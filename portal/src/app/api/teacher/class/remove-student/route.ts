import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// POST /api/teacher/class/remove-student  { classId, studentId }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const classId = String(body?.classId ?? "").trim();
  const studentId = String(body?.studentId ?? "").trim();

  if (!classId || !studentId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // Auth check with cookie client.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  // Verify the caller is teacher/admin of this class.
  const [{ data: profile }, { data: cls }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
    supabase.from("classes").select("teacher_id").eq("id", classId).maybeSingle(),
  ]);

  if (
    !cls ||
    (profile?.role !== "admin" && cls.teacher_id !== user.id)
  ) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Use service role to bypass RLS on class_members.
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await service
    .from("class_members")
    .delete()
    .eq("class_id", classId)
    .eq("student_id", studentId);

  if (error) {
    return NextResponse.json({ error: "remove_failed", message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

