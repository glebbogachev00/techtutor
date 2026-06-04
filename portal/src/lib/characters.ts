// Character roster for the TechBash portal.
// Heroes are selectable avatars. Villains are antagonists that taunt students
// until defeated (unlocked) by completing enough missions.

export type CharacterRole = "hero" | "villain";

export type CharacterTheme = {
  /** Main accent — used for buttons, XP bar, level text */
  accent: string;
  /** Lighter accent for hover states */
  accentHover: string;
  /** Hero banner background color */
  heroBg: string;
  /** Hero banner subtle gradient overlay (CSS gradient) */
  heroGradient: string;
  /** Border / ring color */
  border: string;
  /** Box shadow for CTA button */
  shadow: string;
};

export type Character = {
  id: string;
  name: string;
  role: CharacterRole;
  /** Head/shoulders portrait for picker & header avatar */
  image: string;
  /** Full-body illustration for dashboard hero */
  fullImage: string;
  unlockMissions: number;
  lockHint: string;
  theme: CharacterTheme;
  taunts?: string[];
  defeatedTaunts?: string[];
};

export const CHARACTERS: Character[] = [
  // ── Free heroes ──────────────────────────────────────────────────────────
  {
    id: "captain-pixel",
    name: "Captain Pixel",
    role: "hero",
    image: "/characters/captain-pixel.png",
    fullImage: "/characters/pixel-full.png",
    unlockMissions: 0,
    lockHint: "",
    theme: {
      accent: "#193b92",
      accentHover: "#2952b8",
      heroBg: "#EEF2FF",
      heroGradient: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
      border: "#193b92",
      shadow: "rgba(25,59,146,0.25)",
    },
  },
  {
    id: "nina",
    name: "Nina",
    role: "hero",
    image: "/characters/Nina.png",
    fullImage: "/characters/Nina_full.png",
    unlockMissions: 0,
    lockHint: "",
    theme: {
      accent: "#DB2777",
      accentHover: "#be185d",
      heroBg: "#FDF2F8",
      heroGradient: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)",
      border: "#DB2777",
      shadow: "rgba(219,39,119,0.22)",
    },
  },
  {
    id: "lumo",
    name: "Lumo",
    role: "hero",
    image: "/characters/lumo.png",
    fullImage: "/characters/lumo_full.png",
    unlockMissions: 0,
    lockHint: "",
    theme: {
      accent: "#F59E0B",
      accentHover: "#d97706",
      heroBg: "#FFFBEB",
      heroGradient: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
      border: "#F59E0B",
      shadow: "rgba(245,158,11,0.25)",
    },
  },
  {
    id: "tim",
    name: "Tim",
    role: "hero",
    image: "/characters/tim.png",
    fullImage: "/characters/tim_full.png",
    unlockMissions: 0,
    lockHint: "",
    theme: {
      accent: "#0EA5E9",
      accentHover: "#0284c7",
      heroBg: "#F0F9FF",
      heroGradient: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
      border: "#0EA5E9",
      shadow: "rgba(14,165,233,0.22)",
    },
  },
  {
    id: "mochi",
    name: "Mochi",
    role: "hero",
    image: "/characters/mochi.png",
    fullImage: "/characters/moci_full.png",
    unlockMissions: 0,
    lockHint: "",
    theme: {
      accent: "#7C3AED",
      accentHover: "#6d28d9",
      heroBg: "#F5F3FF",
      heroGradient: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
      border: "#7C3AED",
      shadow: "rgba(124,58,237,0.22)",
    },
  },
  {
    id: "bao",
    name: "Bao",
    role: "hero",
    image: "/characters/bao.png",
    fullImage: "/characters/bao_full.png",
    unlockMissions: 0,
    lockHint: "",
    theme: {
      accent: "#2C7A7B",
      accentHover: "#1d5c5c",
      heroBg: "#F0FDFA",
      heroGradient: "linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)",
      border: "#2C7A7B",
      shadow: "rgba(44,122,123,0.22)",
    },
  },
  // ── Unlockable hero ───────────────────────────────────────────────────────
  {
    id: "storm",
    name: "Storm",
    role: "hero",
    image: "/characters/storm.png",
    fullImage: "/characters/Storm_full.png",
    unlockMissions: 10,
    lockHint: "Complete 10 missions to unlock",
    theme: {
      accent: "#0F172A",
      accentHover: "#1e293b",
      heroBg: "#F1F5F9",
      heroGradient: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)",
      border: "#0F172A",
      shadow: "rgba(15,23,42,0.22)",
    },
  },
  // ── Special unlock: The President ────────────────────────────────────────
  {
    id: "president",
    name: "The President",
    role: "hero",
    image: "/characters/president.png",
    fullImage: "/characters/President_full.png",
    unlockMissions: 0,
    lockHint: "Complete the full Generative AI track to unlock",
    theme: {
      accent: "#065F46",
      accentHover: "#047857",
      heroBg: "#ECFDF5",
      heroGradient: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
      border: "#065F46",
      shadow: "rgba(6,95,70,0.22)",
    },
    taunts: [
      "On behalf of the Milky Way Galaxy, welcome. We've been watching your progress.",
      "The galaxy's future depends on young coders. No pressure. Actually — yes, some pressure.",
      "I've seen a thousand civilisations rise and fall on their relationship with technology. Choose wisely.",
    ],
  },
  // ── Villains ──────────────────────────────────────────────────────────────
  {
    id: "jason",
    name: "Jason",
    role: "villain",
    image: "/characters/jason.png",
    fullImage: "/characters/jason_full.png",
    unlockMissions: 5,
    lockHint: "Defeat Jason by completing 5 missions",
    theme: {
      accent: "#DC2626",
      accentHover: "#b91c1c",
      heroBg: "#FFF1F2",
      heroGradient: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)",
      border: "#DC2626",
      shadow: "rgba(220,38,38,0.22)",
    },
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
    fullImage: "/characters/The_Professor_full.png",
    unlockMissions: 15,
    lockHint: "Defeat The Professor by completing 15 missions",
    theme: {
      accent: "#7F1D1D",
      accentHover: "#991b1b",
      heroBg: "#FEF2F2",
      heroGradient: "linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)",
      border: "#7F1D1D",
      shadow: "rgba(127,29,29,0.22)",
    },
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
// cheatUnlocked=true bypasses all gates (secret code entered).
export function getUnlockedCharacters(
  totalMissions: number,
  genaiTrackCompleted = false,
  cheatUnlocked = false,
): Character[] {
  if (cheatUnlocked) return CHARACTERS;
  return CHARACTERS.filter((c) => {
    if (c.id === "president") return genaiTrackCompleted;
    return totalMissions >= c.unlockMissions;
  });
}

export function isCharacterUnlocked(
  id: string,
  totalMissions: number,
  genaiTrackCompleted = false,
  cheatUnlocked = false,
): boolean {
  if (cheatUnlocked) return true;
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
