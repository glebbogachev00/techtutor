import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = String(body?.code ?? "").trim();
  const displayName = String(body?.displayName ?? "").trim();
  const pin = String(body?.pin ?? "").trim();

  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  // ── PIN flow (teacher pre-registered student) ──────────────────────────
  if (pin && displayName) {
    // Use service client to look up the fabricated email via RPC.
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: lookupData, error: lookupError } = await serviceClient.rpc(
      "student_lookup",
      { p_code: code, p_name: displayName, p_pin: pin },
    );

    if (lookupError) {
      const msg = lookupError.message ?? "";
      if (msg.includes("invalid_code")) {
        return NextResponse.json(
          { error: "invalid_code", message: "That class code didn't match an active class." },
          { status: 404 },
        );
      }
      if (msg.includes("invalid_credentials")) {
        return NextResponse.json(
          { error: "invalid_credentials", message: "Name or PIN didn't match. Try again." },
          { status: 401 },
        );
      }
      return NextResponse.json({ error: "lookup_failed", message: msg }, { status: 500 });
    }

    const fabricatedEmail = Array.isArray(lookupData)
      ? (lookupData[0]?.out_email ?? lookupData[0])
      : (lookupData as { out_email?: string } | null)?.out_email ?? lookupData;

    if (!fabricatedEmail) {
      return NextResponse.json({ error: "invalid_credentials", message: "Name or PIN didn't match." }, { status: 401 });
    }

    // Return the email + derived password to the client — it will call
    // signInWithPassword directly (so the browser session cookies are set).
    // The derived password matches what add-student created.
    return NextResponse.json({
      ok: true,
      mode: "pin",
      email: String(fabricatedEmail),
      password: `${pin}-techbash`,
    });
  }

  // ── Anonymous flow (legacy — no PIN) ──────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("join_class_with_code", {
    p_code: code,
    p_display_name: displayName || null,
  });

  if (error) {
    const msg = error.message || "";
    if (msg.includes("invalid_code")) {
      return NextResponse.json(
        { error: "invalid_code", message: "That class code didn't match an active class." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "join_failed", message: msg },
      { status: 500 },
    );
  }

  const row = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({
    ok: true,
    mode: "anonymous",
    classId: row?.class_id ?? null,
    className: row?.class_name ?? null,
  });
}

