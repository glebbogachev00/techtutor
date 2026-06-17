import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { programSlug, lessonSlug, xp } = await req.json();
  if (!programSlug || !lessonSlug) {
    return Response.json({ error: "missing fields" }, { status: 400 });
  }

  const xpEarned = Number(xp) || 100;

  // Upsert — safe to call multiple times
  const { error } = await supabase.from("lesson_progress").upsert(
    { user_id: user.id, program_slug: programSlug, lesson_slug: lessonSlug, xp_earned: xpEarned },
    { onConflict: "user_id,program_slug,lesson_slug", ignoreDuplicates: true }
  );

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true, xpEarned });
}
