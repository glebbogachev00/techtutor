import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// GET /api/preview/progress
// Returns { missions: { web: [1,2], python: [], genai: [] }, adventures: ["lumen"] }
// Returns { signedIn: false } if no user — caller falls back to localStorage / defaults.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ signedIn: false });
  }

  const [progressRes, adventureRes] = await Promise.all([
    supabase
      .from("preview_progress")
      .select("track_slug, mission_n")
      .eq("user_id", user.id),
    supabase
      .from("preview_adventures")
      .select("quest_id")
      .eq("user_id", user.id),
  ]);

  const missions: Record<string, number[]> = { web: [], python: [], genai: [] };
  (progressRes.data ?? []).forEach((row) => {
    const slug = row.track_slug as string;
    if (!missions[slug]) missions[slug] = [];
    missions[slug].push(row.mission_n as number);
  });
  Object.keys(missions).forEach((k) => missions[k].sort((a, b) => a - b));

  const adventures = (adventureRes.data ?? []).map((r) => r.quest_id as string);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_emoji, streak_count, last_active_date")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json({
    signedIn: true,
    role: profile?.role ?? "student",
    fullName: profile?.full_name ?? null,
    avatarEmoji: profile?.avatar_emoji ?? null,
    streakCount: profile?.streak_count ?? 0,
    lastActiveDate: profile?.last_active_date ?? null,
    missions,
    adventures,
  });
}

// POST /api/preview/progress  { kind: "mission", trackSlug, missionN, xp } |
//                              { kind: "adventure", questId, xp }
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const userId: string = user.id;
  const body = await req.json().catch(() => ({}));
  const kind = body?.kind;

  // Helper: update streak on the profile after any progress save.
  async function updateStreak() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
    const { data: prof } = await supabase
      .from("profiles")
      .select("streak_count, last_active_date")
      .eq("id", userId)
      .maybeSingle();
    const lastDate = prof?.last_active_date as string | null;
    const currentStreak = (prof?.streak_count as number) ?? 0;
    if (lastDate === today) return; // already counted today
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newStreak = lastDate === yesterday ? currentStreak + 1 : 1;
    await supabase
      .from("profiles")
      .update({ streak_count: newStreak, last_active_date: today })
      .eq("id", userId);
  }

  if (kind === "mission") {
    const trackSlug = String(body?.trackSlug ?? "");
    const missionN = Number(body?.missionN);
    const xp = Math.max(0, Math.min(500, Number(body?.xp ?? 0)));
    if (!trackSlug || !Number.isInteger(missionN)) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }
    const { error } = await supabase.from("preview_progress").upsert(
      {
        user_id: user.id,
        track_slug: trackSlug,
        mission_n: missionN,
        xp_earned: xp,
      },
      { onConflict: "user_id,track_slug,mission_n" },
    );
    if (error) {
      return NextResponse.json(
        { error: "save_failed", message: error.message },
        { status: 500 },
      );
    }
    await updateStreak();
    return NextResponse.json({ ok: true });
  }

  if (kind === "adventure") {
    const questId = String(body?.questId ?? "");
    const xp = Math.max(0, Math.min(1000, Number(body?.xp ?? 0)));
    if (!questId) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }
    const { error } = await supabase.from("preview_adventures").upsert(
      { user_id: user.id, quest_id: questId, xp_earned: xp },
      { onConflict: "user_id,quest_id" },
    );
    if (error) {
      return NextResponse.json(
        { error: "save_failed", message: error.message },
        { status: 500 },
      );
    }
    await updateStreak();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "invalid_kind" }, { status: 400 });
}
