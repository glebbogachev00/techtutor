import React from "react";

export interface LessonMeta {
  slug: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  level: number;
  xp: number;
}

export interface LessonEntry {
  meta: LessonMeta;
  Content: React.FC;
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

function Lesson01() {
  return (
    <div className="space-y-5">

      <div className="card p-5 border-l-4 border-[color:var(--color-primary)]">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[color:var(--color-primary)] mb-2">
          ✨ Welcome, Founder
        </h2>
        <p className="text-gray-800">
          Six months from now you&apos;ll have shipped an AI-generated trailer, a web app,
          two games, an educational experience, and a full Discord community app.
          Not drafts. Not homework. Real things people can actually use.
        </p>
        <p className="text-gray-800 mt-3">
          This is Lesson 1. Your tour of every platform, tool, and skill you&apos;re about
          to have in your toolkit.
        </p>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[color:var(--color-teal)] mb-3">
          🎬 AI Video Platforms
        </h2>
        <p className="text-gray-800 mb-3">
          Your first project is an <strong>AI-generated trailer</strong> — a real cinematic
          short. These are the platforms you&apos;ll work with:
        </p>
        <ul className="space-y-3">
          {[
            { name: "Runway ML", desc: "The industry standard for AI video. Type a description, upload an image, get a clip. Used by professional filmmakers." },
            { name: "Kling AI", desc: "Exceptional at realistic motion and character movement. Great for dramatic scenes." },
            { name: "Luma Dream Machine", desc: "Specialises in 3D-style video and camera movement. Creates stunning cinematic shots." },
            { name: "Suno / Udio", desc: "Generate music from text. Describe a mood and tempo, get a real soundtrack in seconds." },
          ].map(p => (
            <li key={p.name} className="flex gap-3">
              <span className="font-bold text-[color:var(--color-ink)] shrink-0 w-36">{p.name}</span>
              <span className="text-gray-600 text-sm">{p.desc}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">
            💡 The secret to great AI video: it&apos;s 80% prompting, 20% tool.
            That&apos;s why prompting is the first skill we master.
          </p>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[color:var(--color-teal)] mb-3">
          🕹️ 2D Game Platforms
        </h2>
        <p className="text-gray-800 mb-3">Project 3 is a <strong>2D game</strong> — and you&apos;ll build it faster than you think.</p>
        <ul className="space-y-3">
          {[
            { name: "GDevelop", desc: "Uses events instead of code. Make a full platformer, shooter, or puzzle game without writing a line. AI helps with levels, dialogue, and sprites." },
            { name: "Construct 3", desc: "Browser-based, professional-grade. Used by indie studios. AI generates artwork and sound while you focus on game design." },
          ].map(p => (
            <li key={p.name} className="flex gap-3">
              <span className="font-bold text-[color:var(--color-ink)] shrink-0 w-36">{p.name}</span>
              <span className="text-gray-600 text-sm">{p.desc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[color:var(--color-teal)] mb-3">
          🎮 3D Game Platforms
        </h2>
        <ul className="space-y-3">
          {[
            { name: "Three.js", desc: "JavaScript library that runs 3D graphics right in the browser. No download required. AI writes the code — you focus on the experience." },
            { name: "Roblox Studio", desc: "Build entire 3D worlds. 80 million people log in every day. Building on Roblox means a built-in audience." },
            { name: "Spline", desc: "The fastest way to create interactive 3D objects for the web. No code required, AI generates assets." },
          ].map(p => (
            <li key={p.name} className="flex gap-3">
              <span className="font-bold text-[color:var(--color-ink)] shrink-0 w-36">{p.name}</span>
              <span className="text-gray-600 text-sm">{p.desc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[color:var(--color-teal)] mb-3">
          🌐 Website & App Platforms
        </h2>
        <ul className="space-y-3">
          {[
            { name: "Cursor", desc: "A code editor with AI built in. Describe what you want, it writes the code. You're the architect; AI is the builder." },
            { name: "v0 by Vercel", desc: "Generate full UI components from a text description. Describe a dashboard — v0 produces working React code instantly." },
            { name: "Bolt.new", desc: "Full-stack apps from a single prompt. Describe your app idea, Bolt scaffolds everything: database, backend, frontend." },
          ].map(p => (
            <li key={p.name} className="flex gap-3">
              <span className="font-bold text-[color:var(--color-ink)] shrink-0 w-36">{p.name}</span>
              <span className="text-gray-600 text-sm">{p.desc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[color:var(--color-teal)] mb-3">
          💬 The Core Skill: Prompting
        </h2>
        <p className="text-gray-800 mb-4">
          Every platform above — video, games, websites — responds to <strong>prompts</strong>.
          Your ability to write a great prompt determines the quality of everything you create.
          Use <strong>R.C.T.F.</strong>:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            { letter: "R", word: "Role", example: '"You are a Hollywood trailer writer..."' },
            { letter: "C", word: "Context", example: '"...for a 13-year-old making a school film about AI..."' },
            { letter: "T", word: "Task", example: '"...write a 60-second dramatic voiceover script..."' },
            { letter: "F", word: "Format", example: '"...with short punchy sentences and a call to action."' },
          ].map(r => (
            <div key={r.letter} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-7 h-7 rounded-full bg-[color:var(--color-primary)] text-white text-sm font-black grid place-items-center shrink-0">
                  {r.letter}
                </span>
                <span className="font-bold text-[color:var(--color-ink)]">{r.word}</span>
              </div>
              <p className="text-xs text-gray-500 italic">{r.example}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm font-semibold text-red-800">
            ⚠️ Biggest mistake: accepting the first output. Real creators send 10–20 follow-up prompts before they&apos;re happy.
          </p>
        </div>
      </div>

      <div className="card p-5 border-l-4 border-[color:var(--color-primary)]">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[color:var(--color-primary)] mb-3">
          🎯 Your First Activity — +30 XP
        </h2>
        <p className="text-gray-800 mb-3">
          Pick ONE platform from today&apos;s lesson. Write an R.C.T.F. prompt for something
          you&apos;d want to make with it.
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2"><span className="text-[color:var(--color-primary)] font-bold">▸</span> A clear Role for the AI</li>
          <li className="flex gap-2"><span className="text-[color:var(--color-primary)] font-bold">▸</span> Context about who you are and what you&apos;re making</li>
          <li className="flex gap-2"><span className="text-[color:var(--color-primary)] font-bold">▸</span> A specific Task (not vague!)</li>
          <li className="flex gap-2"><span className="text-[color:var(--color-primary)] font-bold">▸</span> A Format for the output</li>
        </ul>
        <p className="text-sm text-gray-500 mt-3 italic">
          Bonus: test your prompt in ChatGPT or Claude and paste the result to share with your teacher.
        </p>
      </div>

    </div>
  );
}

// ── Registry ──────────────────────────────────────────────────────────────────

export const PROGRAMS: ProgramEntry[] = [
  {
    slug: "generative-ai-magic",
    title: "Generative AI Magic",
    tagline: "From zero to AI founder in 24 lessons",
    description: "Over 24 lessons and 6 signature projects, you'll go from understanding how AI works to shipping a trailer, a web app, two games, an educational experience, and a full Discord community app.",
    emoji: "✨",
    color: "#7C3AED",
    colorLight: "#F5F3FF",
    ages: "10–15",
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
          description: "Your tour of every platform, tool, and skill you'll master across 24 lessons and 6 real projects.",
          duration: "50 min",
          order: 1,
          level: 1,
          xp: 100,
        },
        Content: Lesson01,
      },
    ],
  },
];

export function getProgram(slug: string): ProgramEntry | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}

export function getLesson(programSlug: string, lessonSlug: string): LessonEntry | undefined {
  return getProgram(programSlug)?.lessons.find((l) => l.meta.slug === lessonSlug);
}
