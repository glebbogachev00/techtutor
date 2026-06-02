import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

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

  // Auth check.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  // Verify teacher/admin role + class ownership.
  const [{ data: profile }, { data: cls }, { data: codeRow }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
    supabase.from("classes").select("teacher_id").eq("id", classId).maybeSingle(),
    supabase
      .from("class_codes")
      .select("code")
      .eq("class_id", classId)
      .eq("active", true)
      .maybeSingle(),
  ]);

  const isAdmin = profile?.role === "admin";
  const isTeacher = profile?.role === "teacher";

  if (!cls) {
    return NextResponse.json({ error: "class_not_found" }, { status: 404 });
  }
  if (!isAdmin && !(isTeacher && cls.teacher_id === user.id)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!codeRow?.code) {
    return NextResponse.json(
      { error: "no_active_code", message: "This class has no active code yet — create one first." },
      { status: 400 },
    );
  }

  // Check duplicate name.
  const { data: existing } = await supabase
    .from("class_members")
    .select("student_id")
    .eq("class_id", classId)
    .ilike("display_name", name)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { error: "duplicate_name", message: "A student with that name already exists in this class." },
      { status: 409 },
    );
  }

  // Service client for admin API + RLS bypass on insert.
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Generate a unique 4-digit PIN.
  let pin = "";
  for (let i = 0; i < 25; i++) {
    const candidate = String(Math.floor(1000 + Math.random() * 9000));
    const { data: clash } = await service
      .from("class_members")
      .select("student_id")
      .eq("class_id", classId)
      .eq("pin", candidate)
      .maybeSingle();
    if (!clash) {
      pin = candidate;
      break;
    }
  }
  if (!pin) {
    return NextResponse.json({ error: "pin_exhausted" }, { status: 500 });
  }

  // Fabricated email — must match what student_lookup builds.
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const email = `${slug}.${codeRow.code.toLowerCase()}.${pin}@students.techbash.internal`;

  // Create the auth user via the supported admin API.
  const { data: created, error: createErr } = await service.auth.admin.createUser({
    email,
    password: pin,
    email_confirm: true,
    user_metadata: { display_name: name },
  });
  if (createErr || !created.user) {
    return NextResponse.json(
      { error: "create_user_failed", message: createErr?.message ?? "Could not create user." },
      { status: 500 },
    );
  }
  const newUserId = created.user.id;

  // Upsert profile.
  await service
    .from("profiles")
    .upsert({ id: newUserId, full_name: name, role: "student" }, { onConflict: "id" });

  // Insert class_members row.
  const { error: memberErr } = await service.from("class_members").insert({
    class_id: classId,
    student_id: newUserId,
    display_name: name,
    pin,
    joined_at: new Date().toISOString(),
  });
  if (memberErr) {
    // Roll back the auth user if we couldn't attach them to the class.
    await service.auth.admin.deleteUser(newUserId);
    return NextResponse.json(
      { error: "member_insert_failed", message: memberErr.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, pin, studentId: newUserId });
}

