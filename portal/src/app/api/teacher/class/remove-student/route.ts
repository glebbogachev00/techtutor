import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// POST /api/teacher/class/remove-student  { classId, studentId }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const classId = String(body?.classId ?? "").trim();
  const studentId = String(body?.studentId ?? "").trim();

  if (!classId || !studentId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  // RLS policy "teacher delete class members" allows this delete
  // when the caller is the class owner or an admin.
  const { error } = await supabase
    .from("class_members")
    .delete()
    .eq("class_id", classId)
    .eq("student_id", studentId);

  if (error) {
    return NextResponse.json({ error: "remove_failed", message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}


