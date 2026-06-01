import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const classId = String(body?.classId ?? "").trim();
  if (!classId) {
    return NextResponse.json({ error: "missing_class_id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("rotate_class_code", {
    p_class_id: classId,
  });
  if (error) {
    return NextResponse.json(
      { error: "rotate_failed", message: error.message },
      { status: error.message.includes("forbidden") ? 403 : 500 },
    );
  }

  return NextResponse.json({ ok: true, code: data });
}
