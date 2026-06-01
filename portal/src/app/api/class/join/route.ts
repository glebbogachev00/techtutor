import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = String(body?.code ?? "").trim();
  const displayName = String(body?.displayName ?? "").trim();

  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  const supabase = await createClient();

  // Must already have a session (anonymous or email). LoginForm signs in
  // anonymously before calling this endpoint.
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
    classId: row?.class_id ?? null,
    className: row?.class_name ?? null,
  });
}
