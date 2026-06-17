// Lesson registry for Programs.
// Each lesson is structured exactly like a TechBash mission:
//   characterId → story → why → concept → sections → task → live AI chat
// No static slides — all lessons use the interactive workspace format.

export interface LessonMeta {
  slug: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  level: number;
  xp: number;
}

export interface LessonSection {
  heading: string;
  content?: string;
  items?: { name: string; desc: string }[];
  tip?: string;
}

export interface LessonMission {
  characterId: string;
  story: string;
  why: string;
  concept: string;
  example?: string;
  sections?: LessonSection[];
  task: string;
  goal?: string;
  kind?: "chat";
  starterPrompt?: string;
}

export interface LessonEntry {
  meta: LessonMeta;
  mission: LessonMission;
}

export interface ProgramEntry {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  emoji: string;
  color: string;
  colorLight: string;
  ages: string;
  storyIntro: string;
  castIds: string[]; // character IDs from lib/characters.ts shown in "Meet the cast"
  levels: {
    number: number;
    title: string;
    description: string;
    color: string;
    project: { number: number; title: string; emoji: string };
  }[];
  lessons: LessonEntry[];
}

// ── Generative AI Magic ───────────────────────────────────────────────────────

export const PROGRAMS: ProgramEntry[] = [
  {
    slug: "generative-ai-magic",
    title: "Generative AI Magic",
    tagline: "From zero to AI founder in 24 lessons",
    description:
      "Over 24 lessons and 6 signature projects, you'll go from understanding how AI works to shipping a trailer, a web app, two games, an educational experience, and a full Discord community app.",
    emoji: "✨",
    color: "#7C3AED",
    colorLight: "#F5F3FF",
    ages: "10–15",
    storyIntro:
      "Six months from now you'll have shipped an AI-generated trailer, a web app, two games, an educational experience, and a full Discord community app. Not drafts. Not homework. Real things people can actually use. Captain Pixel is your guide. Bao is your partner. And the clock starts now.",
    castIds: ["captain-pixel", "bao", "mochi", "storm", "jason", "the-professor"],
    levels: [
      {
        number: 1,
        title: "The Founder's Origin",
        description: "Master prompting, visuals, and audio — then ship your AI trailer.",
        color: "#7C3AED",
        project: { number: 1, title: "Generative AI Trailer", emoji: "🎬" },
      },
      {
        number: 2,
        title: "The Builder Rises",
        description: "Build AI-powered web apps and your first 2D game.",
        color: "#0891B2",
        project: { number: 2, title: "GenAI Web App + 2D Game", emoji: "🕹️" },
      },
      {
        number: 3,
        title: "The Creator's Masterclass",
        description: "Go 3D, build immersive experiences, and ship a Discord app with PWA.",
        color: "#059669",
        project: { number: 3, title: "3D Game + Discord App + PWA", emoji: "🌐" },
      },
    ],
    lessons: [
      {
        meta: {
          slug: "01-founders-journey",
          title: "Welcome to Generative AI Magic",
          description:
            "Your tour of every platform, tool, and skill you'll master across 24 lessons and 6 real projects.",
          duration: "50 min",
          order: 1,
          level: 1,
          xp: 100,
        },
        mission: {
          characterId: "captain-pixel",
          story:
            "Founder, listen up. Six months from now you'll have shipped an AI-generated trailer, a real web app, two games, an educational experience, and a full Discord community app. Not sketches. Not homework. Real things people can actually use. This is Lesson 1 — your tour of every platform and skill you're about to own. Pay attention.",
          why: "Every platform you're about to learn — AI video, games, websites — responds to one thing: a great prompt. Your prompting skill determines the quality of everything you create. That's what we master first, right here, right now.",
          concept:
            "The secret weapon is called R.C.T.F. Every great prompt has four parts:\n\n• Role — tell the AI who it is. e.g. 'You are a Hollywood trailer writer...'\n• Context — tell it about you and the project. e.g. '...for a 13-year-old making a school film about AI...'\n• Task — give it a specific job. e.g. '...write a 60-second dramatic voiceover script...'\n• Format — describe the output. e.g. '...with short punchy sentences and a call to action at the end.'\n\nBiggest mistake: accepting the first output. Real creators send 10–20 follow-up prompts before they're happy.",
          example:
            "Role: You are a Hollywood trailer voiceover writer.\nContext: I'm a 13-year-old creating a school film about AI changing the world.\nTask: Write a dramatic 60-second voiceover script for my trailer.\nFormat: Short punchy sentences. End with a call to action.",
          sections: [
            {
              heading: "🎬 AI Video Platforms",
              content: "Your first project is an AI-generated trailer — a real cinematic short. These are the tools you'll use:",
              items: [
                { name: "Runway ML", desc: "The industry standard for AI video. Type a description, upload an image, get a clip. Used by professional filmmakers." },
                { name: "Kling AI", desc: "Exceptional at realistic motion and character movement. Great for dramatic scenes." },
                { name: "Luma Dream Machine", desc: "Specialises in 3D-style video and camera movement. Stunning cinematic shots." },
                { name: "Suno / Udio", desc: "Generate music from text. Describe a mood and tempo, get a real soundtrack in seconds." },
              ],
              tip: "The quality of your AI video is 80% prompting, 20% tool.",
            },
            {
              heading: "🕹️ Game Platforms",
              content: "Projects 3 and 4 are games — and you'll build them faster than you think.",
              items: [
                { name: "GDevelop", desc: "Uses events instead of code. Build a full platformer or shooter without writing a single line." },
                { name: "Construct 3", desc: "Browser-based, professional-grade. Used by indie studios worldwide." },
                { name: "Roblox Studio", desc: "Build 3D worlds with a built-in audience of 80 million daily players." },
              ],
            },
            {
              heading: "🌐 Website & App Platforms",
              content: "Project 2 is a real web app. These tools make it possible:",
              items: [
                { name: "Cursor", desc: "A code editor with AI built in. Describe what you want, it writes the code." },
                { name: "v0 by Vercel", desc: "Generate full UI components from a text description. Instant working React code." },
                { name: "Bolt.new", desc: "Full-stack apps from a single prompt — database, backend, frontend, all scaffolded." },
              ],
            },
          ],
          task: "Pick ONE platform from the list above. Write a full R.C.T.F. prompt for something you'd actually want to make with it — a trailer, a game concept, or an app idea. Then send it in the AI chat and see what you get.",
          goal: "Your prompt should clearly include all four R.C.T.F. parts: Role, Context, Task, and Format.",
          kind: "chat",
          starterPrompt: "Role: You are a...\nContext: I'm a student who wants to...\nTask: ...\nFormat: ...",
        },
      },
    ],
  },
];

export function getProgram(slug: string): ProgramEntry | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}

export function getLesson(
  programSlug: string,
  lessonSlug: string,
): LessonEntry | undefined {
  return getProgram(programSlug)?.lessons.find((l) => l.meta.slug === lessonSlug);
}
