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

  // RLS (classes_owner_all) ensures only the owning teacher (or admin) can
  // delete. ON DELETE CASCADE removes class_codes and class_members.
  const { error, count } = await supabase
    .from("classes")
    .delete({ count: "exact" })
    .eq("id", classId);

  if (error) {
    return NextResponse.json(
      { error: "delete_failed", message: error.message },
      { status: 500 },
    );
  }
  if (!count) {
    return NextResponse.json(
      { error: "not_found", message: "Class not found or not yours." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
