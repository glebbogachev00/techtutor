import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CHARACTER_BY_ID, isCharacterUnlocked } from "@/lib/characters";

// PATCH /api/profile/character  { characterId }
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const characterId = String(body?.characterId ?? "").trim();

  if (!characterId || !CHARACTER_BY_ID[characterId]) {
    return NextResponse.json({ error: "invalid_character" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  // Fetch mission count + genai + cheat flag.
  const [progressRes, genaiTotalRes, profileRes] = await Promise.all([
    supabase.from("preview_progress").select("track_slug").eq("user_id", user.id),
    supabase.from("preview_progress").select("track_slug").eq("user_id", user.id).eq("track_slug", "genai"),
    supabase.from("profiles").select("cheat_unlocked").eq("id", user.id).maybeSingle(),
  ]);

  const totalMissions = progressRes.data?.length ?? 0;
  const genaiCount = genaiTotalRes.data?.length ?? 0;
  const genaiTrackCompleted = genaiCount >= 5;
  const cheatUnlocked = !!(profileRes.data?.cheat_unlocked);

  if (!isCharacterUnlocked(characterId, totalMissions, genaiTrackCompleted, cheatUnlocked)) {
    return NextResponse.json({ error: "character_locked" }, { status: 403 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ selected_character: characterId })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, characterId });
}
