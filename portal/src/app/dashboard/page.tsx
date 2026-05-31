import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/locale";
import { t, type Locale } from "@/lib/i18n";

type Track = {
  id: string;
  slug: string;
  title_en: string;
  title_vn: string;
  description_en: string | null;
  description_vn: string | null;
  icon: string | null;
};

function trackTitle(track: Track, locale: Locale) {
  return locale === "vn" ? track.title_vn : track.title_en;
}
function trackDesc(track: Track, locale: Locale) {
  return locale === "vn" ? track.description_vn : track.description_en;
}

export default async function DashboardHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: tracks }, { data: xpRow }, { data: progress }] =
    await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle(),
      supabase.from("tracks").select("*").order("sort_order"),
      supabase.from("xp_totals").select("total_xp").eq("user_id", user!.id).maybeSingle(),
      supabase.from("progress").select("mission_id").eq("user_id", user!.id),
    ]);

  const locale = await getLocale();
  const xp = xpRow?.total_xp ?? 0;
  const completed = progress?.length ?? 0;
  const name = profile?.full_name ?? "friend";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[color:var(--color-ink)]">
          {t(locale, "dashboard.welcome", { name })}
        </h1>
        <p className="text-gray-600 mt-1">{t(locale, "brand.tagline")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label={t(locale, "dashboard.xp")} value={`${xp}`} icon="⭐" />
        <StatCard
          label={t(locale, "dashboard.completed")}
          value={`${completed}`}
          icon="✅"
        />
        <StatCard label={t(locale, "dashboard.streak")} value="—" icon="🔥" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-[color:var(--color-ink)] mb-4">
          {t(locale, "dashboard.tracks")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(tracks ?? []).map((track) => (
            <Link
              key={track.id}
              href={`/dashboard/tracks/${track.slug}`}
              className="card p-6 flex items-start gap-4"
            >
              <div className="text-4xl">{track.icon}</div>
              <div>
                <h3 className="font-bold text-lg text-[color:var(--color-ink)]">
                  {trackTitle(track, locale)}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {trackDesc(track, locale)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-[color:var(--color-ink)]">
          {value}
        </p>
      </div>
    </div>
  );
}
