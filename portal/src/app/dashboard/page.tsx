import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";
import { ACHIEVEMENTS } from "@/lib/achievements";
import type { AchievementTier } from "@/lib/achievements";
import {
  CHARACTER_BY_ID,
  DEFAULT_CHARACTER_ID,
  getActiveVillain,
} from "@/lib/characters";

export const metadata = { title: "Dashboard — TechBash" };

const TRACK_META: Record<
  string,
  {
    title: string;
    tagline: string;
    icon: string;
    accent: string;
    external?: boolean;
    tool?: string;
  }
> = {
  web: {
    title: "Web Development",
    tagline: "Build real websites with HTML, CSS, and JavaScript.",
    icon: "🌐",
    accent: "#193b92",
  },
  python: {
    title: "Python",
    tagline: "The language behind AI, games and automation.",
    icon: "🐍",
    accent: "#2C7A7B",
  },
  genai: {
    title: "Generative AI",
    tagline: "Talk with Professor Loop and build smart agents.",
    icon: "🤖",
    accent: "#7C3AED",
  },
  "web-games": {
    title: "Web 2D Games",
    tagline: "Code arcade games with HTML5 Canvas and JavaScript.",
    icon: "🕹️",
    accent: "#DB2777",
  },
  "web-3d-games": {
    title: "Web 3D Games",
    tagline: "Build 3D games in your browser with Three.js — no install.",
    icon: "🎯",
    accent: "#0EA5E9",
  },
  "web-3d-design": {
    title: "Web 3D Design",
    tagline: "Model and animate 3D scenes right in the browser.",
    icon: "✨",
    accent: "#8B5CF6",
  },
  "gamedev-2d": {
    title: "2D Game Design",
    tagline: "Design your own 2D games in GDevelop — no code required.",
    icon: "🎮",
    accent: "#F59E0B",
    external: true,
    tool: "GDevelop",
  },
  "gamedev-3d": {
    title: "3D Game Design",
    tagline: "Build worlds and games in Roblox Studio.",
    icon: "🧊",
    accent: "#DC2626",
    external: true,
    tool: "Roblox Studio",
  },
  "design-3d": {
    title: "3D Design",
    tagline: "Model props, scenes and characters in Tinkercad & Blender.",
    icon: "🧱",
    accent: "#0D9488",
    external: true,
    tool: "Tinkercad / Blender",
  },
};

export default async function DashboardHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, progressRes, adventureRes, classRes, achievementsRes] =
    await Promise.all([
    supabase
        .from("profiles")
        .select("full_name, role, streak_count, last_active_date, selected_character, cheat_unlocked")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("preview_progress")
        .select("track_slug, xp_earned")
        .eq("user_id", user.id),
      supabase
        .from("preview_adventures")
        .select("xp_earned")
        .eq("user_id", user.id),
      supabase
        .from("class_members")
        .select("class_id, classes(name)")
        .eq("student_id", user.id),
      supabase
        .from("user_achievements")
        .select("achievement_id, earned_at")
        .eq("user_id", user.id),
    ]);

  const earnedMap = new Map(
    (achievementsRes.data ?? []).map((r) => [
      r.achievement_id as string,
      r.earned_at as string,
    ]),
  );

  if (
    profile?.role === "teacher" ||
    profile?.role === "admin"
  ) {
    redirect("/teacher");
  }

  const perTrack: Record<string, { count: number; xp: number }> = {
    web: { count: 0, xp: 0 },
    python: { count: 0, xp: 0 },
    genai: { count: 0, xp: 0 },
    "web-games": { count: 0, xp: 0 },
    "web-3d-games": { count: 0, xp: 0 },
    "web-3d-design": { count: 0, xp: 0 },
    "gamedev-2d": { count: 0, xp: 0 },
    "gamedev-3d": { count: 0, xp: 0 },
    "design-3d": { count: 0, xp: 0 },
  };
  (progressRes.data ?? []).forEach((r) => {
    const slug = r.track_slug as string;
    if (!perTrack[slug]) perTrack[slug] = { count: 0, xp: 0 };
    perTrack[slug].count += 1;
    perTrack[slug].xp += r.xp_earned ?? 0;
  });

  const adventureXp = (adventureRes.data ?? []).reduce(
    (a, b) => a + (b.xp_earned ?? 0),
    0,
  );
  const adventureCount = adventureRes.data?.length ?? 0;
  const missionXp = Object.values(perTrack).reduce((a, b) => a + b.xp, 0);
  const missionCount = Object.values(perTrack).reduce((a, b) => a + b.count, 0);
  const totalXp = missionXp + adventureXp;
  const totalCompleted = missionCount + adventureCount;

  const classes =
    (classRes.data ?? []).map((row) => {
      const cls = row.classes as unknown;
      const name =
        cls && typeof cls === "object" && "name" in cls
          ? String((cls as { name: string }).name)
          : "Class";
      return { id: row.class_id as string, name };
    }) ?? [];

  const name = profile?.full_name ?? user.email?.split("@")[0] ?? "friend";

  // Selected character
  const selectedCharacterId =
    (profile?.selected_character as string | null) ?? DEFAULT_CHARACTER_ID;
  const selectedCharacter =
    CHARACTER_BY_ID[selectedCharacterId] ?? CHARACTER_BY_ID[DEFAULT_CHARACTER_ID];
  const theme = selectedCharacter.theme;

  // Active villain taunt
  const activeVillain = getActiveVillain(totalCompleted);
  // Pick a deterministic taunt based on mission count so it doesn't flicker on SSR
  const villainTaunt = activeVillain?.taunts
    ? activeVillain.taunts[totalCompleted % activeVillain.taunts.length]
    : null;

  // Streak maths
  const streakCount = (profile?.streak_count as number) ?? 0;
  const lastActiveDate = (profile?.last_active_date as string | null) ?? null;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streakAlive = lastActiveDate === today || lastActiveDate === yesterday;
  const daysSinceActive = lastActiveDate
    ? Math.floor((Date.now() - new Date(lastActiveDate).getTime()) / 86400000)
    : null;
  const guiltMessage =
    !streakAlive && daysSinceActive !== null && daysSinceActive >= 2
      ? daysSinceActive >= 5
        ? "The ship has been drifting for days. Captain Pixel hasn't heard from you in a while…"
        : "The ship is drifting. Captain Pixel needs you back."
      : null;

  // Level maths (used in hero)
  const XP_PER_LVL = 500;
  const level = Math.floor(totalXp / XP_PER_LVL) + 1;
  const intoLevel = totalXp % XP_PER_LVL;
  const pct = Math.min(100, Math.round((intoLevel / XP_PER_LVL) * 100));
  const toNext = XP_PER_LVL - intoLevel;
  const topTrack = (["web", "python", "genai"] as const).reduce(
    (best, slug) =>
      (perTrack[slug]?.xp ?? 0) > (perTrack[best]?.xp ?? 0) ? slug : best,
    "web" as "web" | "python" | "genai",
  );
  const nextMissionN = (perTrack[topTrack]?.count ?? 0) + 1;

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo href="/dashboard" size="md" suffix="Portal" />
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="h-9 w-9 rounded-full overflow-hidden border-2 border-[#193b92]/20 hover:border-[#193b92]/60 transition"
              title="Your profile"
            >
              <Image src={selectedCharacter.image} alt={selectedCharacter.name} width={36} height={36} className="h-full w-full object-contain" />
            </Link>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="text-xs text-slate-400 hover:text-[#0F172A] transition"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── Hero launch band ── */}
      <section className="border-b border-slate-200" style={{ background: theme.heroGradient }}>
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <Image
              src={selectedCharacter.fullImage}
              alt={selectedCharacter.name}
              width={224}
              height={224}
              className="h-40 w-40 md:h-56 md:w-56 object-contain shrink-0 drop-shadow-md"
              priority
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#193b92] mb-2">
                Your portal
              </p>
              <h1 className="text-3xl md:text-4xl font-black leading-tight text-[#0F172A]">
                Welcome back,<br />{name}!
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span>⭐ {totalXp.toLocaleString()} XP</span>
                <span className="text-slate-300">·</span>
                <span>Level {level}</span>
                <span className="text-slate-300">·</span>
                <span>{totalCompleted} missions done</span>
              </div>
              {/* Streak badge */}
              <div className="mt-4">
                {streakAlive && streakCount > 0 ? (
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-bold px-3 py-1 rounded-full">
                    🔥 {streakCount}-day streak — keep it going!
                  </span>
                ) : guiltMessage ? (
                  <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 text-sm px-3 py-1.5 rounded-full italic">
                    💬 &quot;{guiltMessage}&quot; — <span className="font-semibold not-italic text-[#0F172A]">Captain Pixel</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-400 text-xs px-3 py-1 rounded-full">
                    🔥 Complete a mission today to start your streak
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            <Link
              href={`/preview?track=${topTrack}`}
              className="inline-flex items-center gap-2 text-white font-black text-base px-8 py-4 rounded-2xl transition"
              style={{ background: theme.accent, boxShadow: `0 4px 20px ${theme.shadow}` }}
            >
              Continue Learning
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-xs text-slate-400">
              Mission {nextMissionN} · {TRACK_META[topTrack].title}
            </p>
          </div>
        </div>
        {/* XP progress strip */}
        <div className="border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-[#0F172A] whitespace-nowrap">Level {level}</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: theme.accent }}
              />
            </div>
            <span className="whitespace-nowrap">{toNext} XP to level {level + 1}</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* ── Villain taunt banner ── */}
        {activeVillain && villainTaunt && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center gap-4">
            <Image
              src={activeVillain.image}
              alt={activeVillain.name}
              width={56}
              height={56}
              className="h-14 w-14 object-contain shrink-0 drop-shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-0.5">
                ⚠ Transmission from {activeVillain.name}
              </p>
              <p className="text-sm font-semibold text-red-700 italic">
                &ldquo;{villainTaunt}&rdquo;
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-red-400 font-semibold">
                {activeVillain.unlockMissions - totalCompleted} missions to defeat
              </p>
              <Link
                href="/preview"
                className="mt-1 inline-block text-[11px] font-bold text-red-600 hover:text-red-800 underline"
              >
                Fight back →
              </Link>
            </div>
          </div>
        )}

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon="⭐" label="Total XP" value={totalXp.toLocaleString()} accent="#E89F47" />
          <StatCard icon="✅" label="Missions" value={String(missionCount)} accent="#193b92" />
          <StatCard icon="🗺️" label="Adventures" value={String(adventureCount)} accent="#7C3AED" />
          <StatCard icon="🎒" label="Classes" value={String(classes.length)} accent="#2C7A7B" />
        </div>

        {/* ── Tracks ── */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-lg font-bold">Tracks</h2>
            <span className="text-xs text-slate-400">3 live · more coming soon</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["web", "python", "genai"] as const).map((slug) => {
              const m = TRACK_META[slug];
              const stats = perTrack[slug];
              return (
                <Link
                  key={slug}
                  href={`/preview?track=${slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 flex flex-col hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-xl grid place-items-center text-xl mb-4"
                    style={{ background: `${m.accent}15` }}
                  >
                    {m.icon}
                  </div>
                  <h3 className="font-bold text-[#0F172A]">{m.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-4 leading-relaxed flex-1">{m.tagline}</p>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{stats.count} done · {stats.xp} XP</span>
                    <span className="font-semibold transition" style={{ color: m.accent }}>
                      {stats.count > 0 ? "Continue →" : "Start →"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Adventure mode ── */}
        <section>
          <div className="rounded-2xl bg-gradient-to-br from-[#F5F0FF] to-[#EEF2FF] p-6 border border-[#7C3AED]/15 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 grid place-items-center text-2xl shrink-0">🗺️</div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7C3AED] mb-0.5">Adventure mode</p>
              <h3 className="text-lg font-bold text-[#0F172A]">Quests across the Bash-verse</h3>
              <p className="text-sm text-slate-600 mt-0.5">
                Story-driven quests with a different character for each — collect XP and unlock new regions.
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
              <Link
                href="/preview"
                className="bg-[#7C3AED] hover:bg-[#6126c2] text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_15px_rgba(124,58,237,0.25)] transition whitespace-nowrap"
              >
                Enter Adventure
              </Link>
              <span className="text-xs text-slate-500">{adventureCount} cleared · {adventureXp} XP</span>
            </div>
          </div>
        </section>

        {/* ── Classes ── */}
        {classes.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4">Your classes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3"
                >
                  <div className="grid place-items-center h-10 w-10 rounded-full bg-[#F5F0FF] text-[#7C3AED] text-lg shrink-0">🎒</div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Class</p>
                    <p className="font-semibold">{c.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Achievements ── */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-lg font-bold">Achievements</h2>
            <span className="text-xs text-slate-400">
              {earnedMap.size}/{ACHIEVEMENTS.length} unlocked
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const earned = earnedMap.has(a.id);
              const earnedAt = earnedMap.get(a.id);
              const ringColor =
                a.tier === "gold"
                  ? "ring-yellow-400/50"
                  : a.tier === "silver"
                    ? "ring-slate-400/40"
                    : "ring-amber-700/30";
              return (
                <div
                  key={a.id}
                  className={`flex flex-col items-center text-center gap-2 rounded-2xl border p-4 transition ${
                    earned
                      ? `bg-white border-slate-200 ring-2 ${ringColor}`
                      : "bg-slate-50 border-dashed border-slate-200 opacity-50"
                  }`}
                  title={earned && earnedAt ? `Earned ${new Date(earnedAt).toLocaleDateString()}` : a.description}
                >
                  <div className="h-12 w-12 rounded-full bg-slate-100 grid place-items-center overflow-hidden">
                    <Image
                      src={`/rewards/${a.tier}.png`}
                      alt={a.tier}
                      width={48}
                      height={48}
                      className={`h-full w-full object-contain ${earned ? "" : "grayscale"}`}
                    />
                  </div>
                  <div>
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${
                      a.tier === "gold" ? "text-yellow-500" : a.tier === "silver" ? "text-slate-500" : "text-amber-700"
                    }`}>{a.tier}</p>
                    <p className="text-xs font-bold leading-tight">{a.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{a.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div
        className="w-9 h-9 rounded-xl grid place-items-center text-lg mb-3"
        style={{ background: `${accent}15` }}
      >
        {icon}
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-2xl font-black mt-0.5">{value}</p>
    </div>
  );
}

// Satisfy the AchievementTier import (used in JSX above via inline ternaries).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _tier: AchievementTier = "bronze";
