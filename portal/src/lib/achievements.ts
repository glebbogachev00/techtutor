// Shared achievement catalog. Used on both server (evaluator) and client (toast).
// Tiers map to images in /public/rewards/{bronze,silver,gold}.png — Mochi mascot.
// hidden:true achievements are not shown until earned.

export type AchievementTier = "bronze" | "silver" | "gold";

export type Achievement = {
  id: string;
  tier: AchievementTier;
  title: string;
  description: string;
  hidden?: boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  // ── Bronze (12) ──────────────────────────────────────────────────────────
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
    id: "five-missions",
    tier: "bronze",
    title: "Getting Serious",
    description: "Complete 5 missions",
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
  {
    id: "first-web",
    tier: "bronze",
    title: "Web Wanderer",
    description: "Complete your first Web Development mission",
  },
  {
    id: "first-python",
    tier: "bronze",
    title: "Snake Charmer",
    description: "Complete your first Python mission",
  },
  {
    id: "first-genai",
    tier: "bronze",
    title: "AI Curious",
    description: "Complete your first Generative AI mission",
  },
  {
    id: "first-character",
    tier: "bronze",
    title: "Own Your Look",
    description: "Choose a character on your profile",
  },
  {
    id: "joined-class",
    tier: "bronze",
    title: "Team Player",
    description: "Join a class",
  },
  {
    id: "level-2",
    tier: "bronze",
    title: "Level Up",
    description: "Reach Level 2",
  },
  {
    id: "night-owl",
    tier: "bronze",
    title: "Night Owl",
    description: "Complete a mission after 9 PM",
  },

  // ── Silver (12) ──────────────────────────────────────────────────────────
  {
    id: "ten-missions",
    tier: "silver",
    title: "Code Crusher",
    description: "Complete 10 missions",
  },
  {
    id: "twenty-missions",
    tier: "silver",
    title: "Mission Machine",
    description: "Complete 20 missions",
  },
  {
    id: "three-adventures",
    tier: "silver",
    title: "Quest Hunter",
    description: "Finish 3 adventures",
  },
  {
    id: "five-adventures",
    tier: "silver",
    title: "World Explorer",
    description: "Finish 5 adventures",
  },
  {
    id: "streak-3",
    tier: "silver",
    title: "Consistent",
    description: "Reach a 3-day streak",
  },
  {
    id: "streak-7",
    tier: "silver",
    title: "Week Warrior",
    description: "Reach a 7-day streak",
  },
  {
    id: "level-5",
    tier: "silver",
    title: "Rising Star",
    description: "Reach Level 5",
  },
  {
    id: "level-10",
    tier: "silver",
    title: "Veteran Coder",
    description: "Reach Level 10",
  },
  {
    id: "unlock-storm",
    tier: "silver",
    title: "Stormbreaker",
    description: "Unlock Storm by completing 10 missions",
  },
  {
    id: "defeat-jason",
    tier: "silver",
    title: "Outsmarted Jason",
    description: "Defeat Jason by completing 5 missions",
  },
  {
    id: "five-web",
    tier: "silver",
    title: "Web Builder",
    description: "Complete 5 Web Development missions",
  },
  {
    id: "five-python",
    tier: "silver",
    title: "Pythonista",
    description: "Complete 5 Python missions",
  },

  // ── Gold (6) ─────────────────────────────────────────────────────────────
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
    description: "Finish all adventures",
  },
  {
    id: "streak-30",
    tier: "gold",
    title: "Unstoppable",
    description: "Reach a 30-day streak",
  },
  {
    id: "defeat-professor",
    tier: "gold",
    title: "Outsmarted The Professor",
    description: "Defeat The Professor by completing 15 missions",
  },
  {
    id: "genai-master",
    tier: "gold",
    title: "Galactic Intelligence",
    description: "Complete the full Generative AI track — The President has noticed",
  },
  {
    id: "thirty-missions",
    tier: "gold",
    title: "Legend Status",
    description: "Complete 30 missions",
  },

  // ── Hidden (1) ───────────────────────────────────────────────────────────
  {
    id: "ghost-coder",
    tier: "gold",
    title: "Ghost Coder",
    description: "Complete 5 missions in a single day",
    hidden: true,
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
  totalMissions: number;
  perTrackCounts: Record<string, number>;
  perTrackTotals: Record<string, number>;
  adventuresCompleted: number;
  totalAdventures: number;
  streak: number;
  totalXp: number;
  // class membership
  inClass?: boolean;
  // whether the user has selected a character
  hasSelectedCharacter?: boolean;
  // missions completed today (for Ghost Coder)
  missionsToday?: number;
  // hour of last mission (0-23) for Night Owl
  lastMissionHour?: number | null;
  // genai track fully complete
  genaiTrackCompleted?: boolean;
};

export function evaluateAchievements(snap: ProgressSnapshot): string[] {
  const earned: string[] = [];

  // ── Mission count ──
  if (snap.totalMissions >= 1) earned.push("first-mission");
  if (snap.totalMissions >= 3) earned.push("three-missions");
  if (snap.totalMissions >= 5) earned.push("five-missions");
  if (snap.totalMissions >= 10) earned.push("ten-missions");
  if (snap.totalMissions >= 20) earned.push("twenty-missions");
  if (snap.totalMissions >= 30) earned.push("thirty-missions");

  // ── Per-track firsts ──
  if ((snap.perTrackCounts["web"] ?? 0) >= 1) earned.push("first-web");
  if ((snap.perTrackCounts["python"] ?? 0) >= 1) earned.push("first-python");
  if ((snap.perTrackCounts["genai"] ?? 0) >= 1) earned.push("first-genai");

  // ── Per-track depth ──
  if ((snap.perTrackCounts["web"] ?? 0) >= 5) earned.push("five-web");
  if ((snap.perTrackCounts["python"] ?? 0) >= 5) earned.push("five-python");

  // ── Streak ──
  if (snap.streak >= 1) earned.push("streak-1");
  if (snap.streak >= 3) earned.push("streak-3");
  if (snap.streak >= 7) earned.push("streak-7");
  if (snap.streak >= 30) earned.push("streak-30");

  // ── Adventures ──
  if (snap.adventuresCompleted >= 1) earned.push("first-adventure");
  if (snap.adventuresCompleted >= 3) earned.push("three-adventures");
  if (snap.adventuresCompleted >= 5) earned.push("five-adventures");
  if (snap.totalAdventures > 0 && snap.adventuresCompleted >= snap.totalAdventures)
    earned.push("adventurer-supreme");

  // ── Levels ──
  const level = Math.floor(snap.totalXp / XP_PER_LEVEL) + 1;
  if (level >= 2) earned.push("level-2");
  if (level >= 5) earned.push("level-5");
  if (level >= 10) earned.push("level-10");

  // ── Track completion ──
  for (const [slug, total] of Object.entries(snap.perTrackTotals)) {
    if (total > 0 && (snap.perTrackCounts[slug] ?? 0) >= total) {
      earned.push("track-master");
      break;
    }
  }

  // ── Genai master / President unlock ──
  if (snap.genaiTrackCompleted) earned.push("genai-master");

  // ── Villain defeats ──
  if (snap.totalMissions >= 5) earned.push("defeat-jason");
  if (snap.totalMissions >= 10) earned.push("unlock-storm");
  if (snap.totalMissions >= 15) earned.push("defeat-professor");

  // ── Social / profile ──
  if (snap.inClass) earned.push("joined-class");
  if (snap.hasSelectedCharacter) earned.push("first-character");

  // ── Hidden: Night Owl ──
  if (snap.lastMissionHour != null && snap.lastMissionHour >= 21)
    earned.push("night-owl");

  // ── Hidden: Ghost Coder ──
  if ((snap.missionsToday ?? 0) >= 5) earned.push("ghost-coder");

  return earned;
}
