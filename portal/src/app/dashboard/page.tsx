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

  return (
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
              3 live · 6 coming soon
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              [
                "web",
                "python",
                "genai",
                "web-games",
                "web-3d-games",
                "web-3d-design",
                "gamedev-2d",
                "gamedev-3d",
                "design-3d",
              ] as const
            ).map((slug) => {
              const m = TRACK_META[slug];
              const stats = perTrack[slug];
              const isLive = slug === "web" || slug === "python" || slug === "genai";
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

function Stat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

const XP_PER_LEVEL = 500;

function LevelBar({ totalXp }: { totalXp: number }) {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const intoLevel = totalXp % XP_PER_LEVEL;
  const pct = Math.min(100, Math.round((intoLevel / XP_PER_LEVEL) * 100));
  const toNext = XP_PER_LEVEL - intoLevel;
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#193b92]">
            Level {level}
          </span>
          <span className="text-[10px] text-slate-400">
            · {intoLevel}/{XP_PER_LEVEL} XP
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          {toNext} XP to level {level + 1}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#193b92] to-[#7C3AED] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function NextMissionCard({
  perTrack,
}: {
  perTrack: Record<string, { count: number; xp: number }>;
}) {
  // Continue the track with the most XP. Only consider live tracks.
  const order = ["web", "python", "genai"] as const;
  let topSlug: (typeof order)[number] = "web";
  let topXp = -1;
  for (const slug of order) {
    const xp = perTrack[slug]?.xp ?? 0;
    if (xp > topXp) {
      topXp = xp;
      topSlug = slug;
    }
  }
  const meta = TRACK_META[topSlug];
  const nextN = (perTrack[topSlug]?.count ?? 0) + 1;
  const isFresh = topXp <= 0;
  return (
    <div
      className="mt-4 rounded-2xl p-5 border flex items-center gap-4"
      style={{
        background: `linear-gradient(135deg, ${meta.accent}10, ${meta.accent}05)`,
        borderColor: `${meta.accent}30`,
      }}
    >
      <div
        className="grid place-items-center h-12 w-12 rounded-2xl text-2xl shrink-0"
        style={{ background: `${meta.accent}1a` }}
      >
        {meta.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-0.5"
          style={{ color: meta.accent }}
        >
          {isFresh ? "Start here" : "Up next"}
        </p>
        <p className="font-bold text-[#0F172A] truncate">
          {meta.title} · Mission {nextN}
        </p>
        <p className="text-xs text-slate-500 truncate">{meta.tagline}</p>
      </div>
      <Link
        href={`/preview?track=${topSlug}`}
        className="shrink-0 text-white text-xs font-semibold px-4 py-2.5 rounded-full"
        style={{ background: meta.accent }}
      >
        {isFresh ? "Begin →" : "Continue →"}
      </Link>
    </div>
  );
}
