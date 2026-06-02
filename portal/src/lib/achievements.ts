// Shared achievement catalog. Used on both server (evaluator) and client (toast).
// Tiers map to images in /public/rewards/{bronze,silver,gold}.png — Mochi mascot.

export type AchievementTier = "bronze" | "silver" | "gold";

export type Achievement = {
  id: string;
  tier: AchievementTier;
  title: string;
  description: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  // ── Bronze ──
  {
    id: "first-mission",
    tier: "bronze",
    title: "First Steps",
    description: "Complete your first mission",
  },
  {
    id: "three-missions",
    tier: "bronze",
    title: "On a Roll",
    description: "Complete 3 missions",
  },
  {
    id: "streak-1",
    tier: "bronze",
    title: "Showed Up",
    description: "Start a 1-day streak",
  },
  {
    id: "first-adventure",
    tier: "bronze",
    title: "Adventure Begins",
    description: "Finish your first adventure",
  },

  // ── Silver ──
  {
    id: "ten-missions",
    tier: "silver",
    title: "Code Crusher",
    description: "Complete 10 missions",
  },
  {
    id: "three-adventures",
    tier: "silver",
    title: "Quest Hunter",
    description: "Finish 3 adventures",
  },
  {
    id: "streak-3",
    tier: "silver",
    title: "Consistent",
    description: "Reach a 3-day streak",
  },
  {
    id: "level-5",
    tier: "silver",
    title: "Rising Star",
    description: "Reach Level 5",
  },

  // ── Gold ──
  {
    id: "track-master",
    tier: "gold",
    title: "Track Master",
    description: "Complete an entire mission track",
  },
  {
    id: "adventurer-supreme",
    tier: "gold",
    title: "Adventurer Supreme",
    description: "Finish all 9 adventures",
  },
];

export const ACHIEVEMENT_BY_ID: Record<string, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);

export const XP_PER_LEVEL = 500;

// ── Evaluator ──
// Given a snapshot of the user's progress, return the set of achievement ids
// that should be unlocked. Caller diffs against already-earned and inserts.

export type ProgressSnapshot = {
  // total mission count across all tracks
  totalMissions: number;
  // per-track mission counts (used for "complete an entire track")
  perTrackCounts: Record<string, number>;
  // per-track target counts (length of each track)
  perTrackTotals: Record<string, number>;
  // adventures completed
  adventuresCompleted: number;
  totalAdventures: number;
  // current streak days
  streak: number;
  // total xp across missions + adventures
  totalXp: number;
};

export function evaluateAchievements(snap: ProgressSnapshot): string[] {
  const earned: string[] = [];

  if (snap.totalMissions >= 1) earned.push("first-mission");
  if (snap.totalMissions >= 3) earned.push("three-missions");
  if (snap.totalMissions >= 10) earned.push("ten-missions");

  if (snap.streak >= 1) earned.push("streak-1");
  if (snap.streak >= 3) earned.push("streak-3");

  if (snap.adventuresCompleted >= 1) earned.push("first-adventure");
  if (snap.adventuresCompleted >= 3) earned.push("three-adventures");
  if (
    snap.totalAdventures > 0 &&
    snap.adventuresCompleted >= snap.totalAdventures
  )
    earned.push("adventurer-supreme");

  const level = Math.floor(snap.totalXp / XP_PER_LEVEL) + 1;
  if (level >= 5) earned.push("level-5");

  for (const [slug, total] of Object.entries(snap.perTrackTotals)) {
    if (total > 0 && (snap.perTrackCounts[slug] ?? 0) >= total) {
      earned.push("track-master");
      break;
    }
  }

  return earned;
}
