// Character roster for the TechBash portal.
// Heroes are selectable avatars. Villains are antagonists that taunt students
// until defeated (unlocked) by completing enough missions.

export type CharacterRole = "hero" | "villain";

export type Character = {
  id: string;
  name: string;
  role: CharacterRole;
  image: string;        // path under /public
  // missions required to unlock. 0 = free from day 1.
  unlockMissions: number;
  // shown in the picker when locked
  lockHint: string;
  // villain-only: rotating taunts shown on dashboard
  taunts?: string[];
  // villain-only: taunts after the student unlocks them (they're nervous now)
  defeatedTaunts?: string[];
};

export const CHARACTERS: Character[] = [
  // ── Free heroes ──────────────────────────────────────────────────────────
  {
    id: "captain-pixel",
    name: "Captain Pixel",
    role: "hero",
    image: "/characters/pixel-full.png",
    unlockMissions: 0,
    lockHint: "",
  },
  {
    id: "nina",
    name: "Nina",
    role: "hero",
    image: "/characters/Nina.png",
    unlockMissions: 0,
    lockHint: "",
  },
  {
    id: "lumo",
    name: "Lumo",
    role: "hero",
    image: "/characters/lumo.png",
    unlockMissions: 0,
    lockHint: "",
  },
  {
    id: "tim",
    name: "Tim",
    role: "hero",
    image: "/characters/tim.png",
    unlockMissions: 0,
    lockHint: "",
  },
  {
    id: "mochi",
    name: "Mochi",
    role: "hero",
    image: "/characters/mochi.png",
    unlockMissions: 0,
    lockHint: "",
  },
  {
    id: "bao",
    name: "Bao",
    role: "hero",
    image: "/characters/bao.png",
    unlockMissions: 0,
    lockHint: "",
  },
  // ── Unlockable hero ───────────────────────────────────────────────────────
  {
    id: "storm",
    name: "Storm",
    role: "hero",
    image: "/characters/storm.png",
    unlockMissions: 10,
    lockHint: "Complete 10 missions to unlock",
  },
  // ── Special unlock: The President ────────────────────────────────────────
  // Unlocked by completing the full Generative AI track (special condition).
  // Also appears as a guest character in AI-themed adventures.
  {
    id: "president",
    name: "The President",
    role: "hero",
    image: "/characters/president.png",
    unlockMissions: 0, // gated by special flag, not mission count
    lockHint: "Complete the full Generative AI track to unlock",
    taunts: [
      // used as "welcome messages" when he appears in adventures
      "On behalf of the Milky Way Galaxy, welcome. We've been watching your progress.",
      "The galaxy's future depends on young coders. No pressure. Actually — yes, some pressure.",
      "I've seen a thousand civilisations rise and fall on their relationship with technology. Choose wisely.",
    ],
  },

  // ── Villains (special unlocks — defeat by completing missions) ────────────
  {
    id: "jason",
    name: "Jason",
    role: "villain",
    image: "/characters/jason.png",
    unlockMissions: 5,
    lockHint: "Defeat Jason by completing 5 missions",
    taunts: [
      "Every skill you're learning… I'm already automating it. Why bother?",
      "Humans are inefficient. My machines don't take lunch breaks.",
      "Keep coding. It's cute. My bots do it 10,000× faster.",
      "You think learning this will save you? Adorable.",
    ],
    defeatedTaunts: [
      "Ok… maybe you're slightly less replaceable than I thought.",
      "Don't get cocky. I've got upgrades in progress.",
      "Fine. You beat me this round. My next bot won't be so sloppy.",
    ],
  },
  {
    id: "the-professor",
    name: "The Professor",
    role: "villain",
    image: "/characters/The-Professor.png",
    unlockMissions: 15,
    lockHint: "Defeat The Professor by completing 15 missions",
    taunts: [
      "I didn't invent the algorithm that replaced your future. I just… deployed it early.",
      "Every factory, every office, every classroom — already automated in my blueprints.",
      "Progress is inevitable. Your resistance is just… data for my next model.",
      "I was a student once too. Then I realized teaching machines was more efficient.",
    ],
    defeatedTaunts: [
      "Hmm. You're actually learning. This complicates my projections.",
      "My models didn't account for… genuine curiosity. Interesting variable.",
      "I may need to revise my timeline. You're more adaptable than I calculated.",
    ],
  },
];

export const CHARACTER_BY_ID: Record<string, Character> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c]),
);

export const DEFAULT_CHARACTER_ID = "captain-pixel";

// The President is unlocked by completing the full Generative AI track,
// not by a raw mission count. Pass genaiCompleted=true when that track is done.
export function getUnlockedCharacters(
  totalMissions: number,
  genaiTrackCompleted = false,
): Character[] {
  return CHARACTERS.filter((c) => {
    if (c.id === "president") return genaiTrackCompleted;
    return totalMissions >= c.unlockMissions;
  });
}

export function isCharacterUnlocked(
  id: string,
  totalMissions: number,
  genaiTrackCompleted = false,
): boolean {
  const c = CHARACTER_BY_ID[id];
  if (!c) return false;
  if (id === "president") return genaiTrackCompleted;
  return totalMissions >= c.unlockMissions;
}

// Returns the active villain (highest unlock threshold not yet defeated / closest to defeat).
// Returns null if all villains are unlocked (all defeated).
export function getActiveVillain(totalMissions: number): Character | null {
  const villains = CHARACTERS.filter((c) => c.role === "villain");
  // Show the lowest-threshold villain that hasn't been unlocked yet.
  const active = villains
    .filter((c) => totalMissions < c.unlockMissions)
    .sort((a, b) => a.unlockMissions - b.unlockMissions);
  return active[0] ?? null;
}

// Returns a random taunt from a villain given current progress.
export function getVillainTaunt(villain: Character, totalMissions: number): string {
  const pool =
    totalMissions >= villain.unlockMissions
      ? villain.defeatedTaunts ?? villain.taunts ?? []
      : villain.taunts ?? [];
  if (!pool.length) return "";
  return pool[Math.floor(Math.random() * pool.length)];
}
