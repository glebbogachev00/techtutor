import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// POST /api/teacher/class/add-student  { classId, name }
// Returns { ok, pin }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const classId = String(body?.classId ?? "").trim();
  const name = String(body?.name ?? "").trim();

  if (!classId || !name) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (name.length > 40) {
    return NextResponse.json({ error: "name_too_long" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("teacher_add_student", {
    p_class_id: classId,
    p_name: name,
  });

  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("forbidden"))
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    if (msg.includes("duplicate_name"))
      return NextResponse.json(
        { error: "duplicate_name", message: "A student with that name already exists in this class." },
        { status: 409 },
      );
    if (msg.includes("no_active_code"))
      return NextResponse.json(
        { error: "no_active_code", message: "This class has no active code yet. Create one first." },
        { status: 400 },
      );
    return NextResponse.json(
      { error: "add_failed", message: msg },
      { status: 500 },
    );
  }

  const row = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ ok: true, pin: row?.pin ?? null, studentId: row?.student_id ?? null });
}
