import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";

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

  const [{ data: profile }, progressRes, adventureRes, classRes] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, role")
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
    ]);

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
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="h-8 w-8 rounded-full bg-gradient-to-br from-[#193b92] to-[#7C3AED] flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition"
              title="Profile"
            >
              {(name[0] ?? "?").toUpperCase()}
            </Link>
            <Link
              href="/auth/signout"
              className="text-xs text-slate-400 hover:text-[#0F172A] transition"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero launch band ── */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#162554] to-[#0F172A] text-white">
        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#E89F47] mb-2">
              Your portal
            </p>
            <h1 className="text-3xl md:text-4xl font-black leading-tight">
              Welcome back,<br />{name}!
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
              <span>⭐ {totalXp.toLocaleString()} XP</span>
              <span className="text-slate-600">·</span>
              <span>Level {level}</span>
              <span className="text-slate-600">·</span>
              <span>{totalCompleted} missions done</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            <Link
              href={`/preview?track=${topTrack}`}
              className="inline-flex items-center gap-2 bg-[#E89F47] hover:bg-[#d4883c] text-[#0F172A] font-black text-base px-8 py-4 rounded-2xl shadow-[0_8px_30px_rgba(232,159,71,0.4)] transition"
            >
              Launch TechBash
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-xs text-slate-400">
              Continue from Mission {nextMissionN} · {TRACK_META[topTrack].title}
            </p>
          </div>
        </div>
        {/* XP progress strip */}
        <div className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3 text-xs text-slate-400">
            <span className="font-semibold text-white whitespace-nowrap">Level {level}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#E89F47] to-[#7C3AED] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="whitespace-nowrap">{toNext} XP to level {level + 1}</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

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

      </div>
    </main>
  );
    <main className="min-h-screen bg-[#FAFAFA] text-[#0F172A]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/dashboard" size="md" />
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500 hidden sm:inline">
              {user.email ?? name}
            </span>
            <Image
              src="/characters/captain-pixel.png"
              alt="Captain Pixel"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full bg-[#FEF3C7] ring-2 ring-[#193b92]/10 object-cover"
              priority
            />
            <Link
              href="/auth/signout"
              className="text-slate-500 hover:text-[#0F172A]"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Greeting + stats */}
        <section>
          <div className="flex items-start gap-5">
            <Image
              src="/characters/captain-pixel.png"
              alt="Captain Pixel"
              width={88}
              height={88}
              className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-[#FEF3C7] ring-2 ring-[#193b92]/10 object-cover shrink-0"
              priority
            />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#193b92] mb-1">
                Your dashboard
              </p>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {name}!
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Captain Pixel is ready when you are. Pick up where you left
                off, or jump into something new.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <Stat icon="⭐" label="Total XP" value={totalXp.toLocaleString()} />
            <Stat
              icon="✅"
              label="Completed"
              value={`${totalCompleted}`}
            />
            <Stat
              icon="🎒"
              label="Classes"
              value={`${classes.length}`}
            />
          </div>

          {/* Level + XP bar */}
          <LevelBar totalXp={totalXp} />

          {/* Next mission recommendation */}
          <NextMissionCard perTrack={perTrack} />
        </section>

        {/* Classes */}
        {classes.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3">Your classes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3"
                >
                  <div className="grid place-items-center h-10 w-10 rounded-full bg-[#F5F0FF] text-[#7C3AED] text-lg">
                    🎒
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      Class
                    </p>
                    <p className="font-semibold">{c.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tracks */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-lg font-bold">Tracks</h2>
            <span className="text-xs text-slate-400">
              3 live · more coming soon
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["web", "python", "genai"] as const).map((slug) => {
              const m = TRACK_META[slug];
              const stats = perTrack[slug];
              const isLive = true;
              const CardInner = (
                <>
                  {!isLive && (
                    <span
                      className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                      style={{
                        background: `${m.accent}15`,
                        color: m.accent,
                      }}
                    >
                      Soon
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{m.icon}</span>
                    <h3 className="font-bold">{m.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {m.tagline}
                  </p>
                  {m.external && (
                    <p className="text-[10px] text-slate-400 mb-3 -mt-2">
                      Uses {m.tool}
                    </p>
                  )}
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {stats.count} done · {stats.xp} XP
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: isLive ? m.accent : "#94A3B8" }}
                    >
                      {isLive ? "Continue →" : "In the works"}
                    </span>
                  </div>
                </>
              );
              const cardClass =
                "rounded-2xl border border-slate-200 bg-white p-5 flex flex-col relative " +
                (isLive
                  ? "hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition"
                  : "opacity-70 cursor-not-allowed");
              return isLive ? (
                <Link key={slug} href={`/preview?track=${slug}`} className={cardClass}>
                  {CardInner}
                </Link>
              ) : (
                <div
                  key={slug}
                  className={cardClass}
                  aria-disabled="true"
                  title="Coming soon"
                >
                  {CardInner}
                </div>
              );
            })}
          </div>
        </section>

        {/* Adventures */}
        <section>
          <div className="rounded-2xl bg-gradient-to-br from-[#F5F0FF] to-[#E8F0FE] p-6 border border-[#7C3AED]/15">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7C3AED] mb-1">
              Adventure mode
            </p>
            <h3 className="text-xl font-bold">Quests across the Bash-verse</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              9 story-driven quests with a different character for each — collect
              XP and unlock the next region.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Link
                href="/preview"
                className="bg-[#7C3AED] hover:bg-[#6126c2] text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_15px_rgba(124,58,237,0.25)]"
              >
                Enter Adventure
              </Link>
              <span className="text-xs text-slate-500">
                {adventureCount} quest{adventureCount === 1 ? "" : "s"} cleared ·{" "}
                {adventureXp} XP
              </span>
            </div>
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
