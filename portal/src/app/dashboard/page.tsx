import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";

export const metadata = { title: "Dashboard — TechBash" };

const TRACK_META: Record<
  string,
  { title: string; tagline: string; icon: string; accent: string }
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

  const name = profile?.full_name ?? "friend";

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#0F172A]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/dashboard" size="md" />
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500 hidden sm:inline">{name}</span>
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
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#193b92] mb-1">
            Your dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {name}!
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pick up where you left off, or jump into something new.
          </p>

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
            <Link
              href="/preview"
              className="text-xs font-semibold text-[#193b92] hover:underline"
            >
              Open playground →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["web", "python", "genai"] as const).map((slug) => {
              const m = TRACK_META[slug];
              const stats = perTrack[slug];
              return (
                <Link
                  key={slug}
                  href="/preview"
                  className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{m.icon}</span>
                    <h3 className="font-bold">{m.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {m.tagline}
                  </p>
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {stats.count} done · {stats.xp} XP
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: m.accent }}
                    >
                      Continue →
                    </span>
                  </div>
                </Link>
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
