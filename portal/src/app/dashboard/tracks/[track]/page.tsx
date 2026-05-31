import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/locale";
import { t, type Locale } from "@/lib/i18n";

type Mission = {
  id: string;
  slug: string;
  sort_order: number;
  title_en: string;
  title_vn: string;
  xp_reward: number;
};

function missionTitle(m: Mission, locale: Locale) {
  return locale === "vn" ? m.title_vn : m.title_en;
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track: trackSlug } = await params;
  const supabase = await createClient();

  const { data: track } = await supabase
    .from("tracks")
    .select("*")
    .eq("slug", trackSlug)
    .maybeSingle();

  if (!track) notFound();

  const { data: missions } = await supabase
    .from("missions")
    .select("id, slug, sort_order, title_en, title_vn, xp_reward")
    .eq("track_id", track.id)
    .order("sort_order");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: progressRows } = await supabase
    .from("progress")
    .select("mission_id")
    .eq("user_id", user!.id);

  const completedSet = new Set((progressRows ?? []).map((r) => r.mission_id));
  const locale = await getLocale();

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="text-sm text-gray-600 hover:text-[color:var(--color-primary)]"
      >
        ← {t(locale, "nav.dashboard")}
      </Link>

      <div className="flex items-center gap-4">
        <div className="text-5xl">{track.icon}</div>
        <div>
          <h1 className="text-3xl font-extrabold text-[color:var(--color-ink)]">
            {locale === "vn" ? track.title_vn : track.title_en}
          </h1>
          <p className="text-gray-600">
            {locale === "vn" ? track.description_vn : track.description_en}
          </p>
        </div>
      </div>

      <ol className="space-y-3">
        {(missions ?? []).map((m, i) => {
          const done = completedSet.has(m.id);
          const previousDone =
            i === 0 ? true : completedSet.has((missions ?? [])[i - 1].id);
          const unlocked = done || previousDone;
          return (
            <li key={m.id}>
              <Link
                href={unlocked ? `/dashboard/missions/${m.id}` : "#"}
                className={`card p-5 flex items-center gap-4 ${
                  unlocked ? "" : "opacity-50 pointer-events-none"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    done
                      ? "bg-[color:var(--color-teal)]"
                      : "bg-[color:var(--color-primary)]"
                  }`}
                >
                  {done ? "✓" : m.sort_order}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[color:var(--color-ink)]">
                    {missionTitle(m, locale)}
                  </p>
                  <p className="text-xs text-gray-500">
                    +{m.xp_reward} XP
                    {done ? ` · ${t(locale, "track.completed")}` : ""}
                    {!unlocked ? ` · ${t(locale, "track.locked")}` : ""}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
