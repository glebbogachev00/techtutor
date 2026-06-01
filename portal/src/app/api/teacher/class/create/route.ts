import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "missing_name" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("create_class", { p_name: name });
  if (error) {
    return NextResponse.json(
      { error: "create_failed", message: error.message },
      { status: error.message.includes("forbidden") ? 403 : 500 },
    );
  }

  const row = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ ok: true, class: row });
}
