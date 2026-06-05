import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const contentId = String(body?.content_id ?? "").trim();
  const zoomUrl = String(body?.zoom_url ?? "").trim();
  const scheduledAt = String(body?.scheduled_at ?? "").trim();

  if (!contentId || !zoomUrl || !scheduledAt) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "teacher" && profile.role !== "admin")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("class_sessions")
    .insert({
      teacher_id: user.id,
      content_id: contentId,
      zoom_url: zoomUrl,
      scheduled_at: scheduledAt,
      unlocked_stage: 0,
      is_active: true,
    })
    .select("id, content_id, zoom_url, scheduled_at, unlocked_stage, is_active")
    .single();

  if (error) {
    return NextResponse.json({ error: "create_failed", message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, session: data });
}
