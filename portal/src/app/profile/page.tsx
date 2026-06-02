import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";
import ProfileForm from "./ProfileForm";
import { ACHIEVEMENTS } from "@/lib/achievements";
import type { AchievementTier } from "@/lib/achievements";

export const metadata = { title: "Profile — TechBash" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, progressRes, adventureRes, achievementsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, role, language, created_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("preview_progress")
      .select("xp_earned")
      .eq("user_id", user.id),
    supabase
      .from("preview_adventures")
      .select("xp_earned")
      .eq("user_id", user.id),
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

  const missionXp = (progressRes.data ?? []).reduce(
    (a, b) => a + (b.xp_earned ?? 0),
    0,
  );
  const adventureXp = (adventureRes.data ?? []).reduce(
    (a, b) => a + (b.xp_earned ?? 0),
    0,
  );
  const totalXp = missionXp + adventureXp;
  const totalCompleted =
    (progressRes.data?.length ?? 0) + (adventureRes.data?.length ?? 0);

  const initialName = profile?.full_name ?? "";
  const isStaff =
    profile?.role === "teacher" || profile?.role === "admin";
  const homeHref = isStaff ? "/teacher" : "/dashboard";

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#0F172A]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo href={homeHref} size="md" />
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm text-slate-500 hover:text-[#0F172A]"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <div className="flex items-start gap-4 sm:gap-5">
          <Image
            src="/characters/captain-pixel.png"
            alt="Captain Pixel"
            width={88}
            height={88}
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-[#FEF3C7] ring-2 ring-[#193b92]/10 object-cover shrink-0"
            priority
          />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#193b92] mb-1">
              Your profile
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
              {initialName || user.email}
            </h1>
            <p className="text-slate-500 text-sm mt-1 truncate">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Stat icon="⭐" label="Total XP" value={totalXp.toLocaleString()} />
          <Stat icon="✅" label="Completed" value={`${totalCompleted}`} />
          <Stat
            icon="🛡️"
            label="Role"
            value={
              profile?.role
                ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                : "Student"
            }
          />
        </div>

        <ProfileForm initialName={initialName} />

        {/* ── Achievements ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Achievements ({earnedMap.size}/{ACHIEVEMENTS.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const earned = earnedMap.has(a.id);
              const earnedAt = earnedMap.get(a.id);
              return (
                <div
                  key={a.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                    earned
                      ? "border-slate-200 bg-white"
                      : "border-dashed border-slate-200 bg-slate-50 opacity-50"
                  }`}
                >
                  <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 grid place-items-center overflow-hidden">
                    <Image
                      src={`/rewards/${a.tier}.png`}
                      alt={a.tier}
                      width={40}
                      height={40}
                      className={`h-full w-full object-contain ${
                        earned ? "" : "grayscale"
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <TierLabel tier={a.tier} />
                    <p className="text-xs font-bold leading-tight truncate">
                      {a.title}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                      {earned && earnedAt
                        ? new Date(earnedAt).toLocaleDateString()
                        : a.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Account
          </p>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Email</dt>
              <dd className="text-[#0F172A] truncate">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Language</dt>
              <dd className="text-[#0F172A]">{profile?.language ?? "en"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Joined</dt>
              <dd className="text-[#0F172A]">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-slate-50 transition"
          >
            ← Dashboard
          </Link>
          <Link
            href="/preview"
            className="inline-flex items-center gap-2 bg-[#193b92] hover:bg-[#2952b8] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition"
          >
            Open Preview
          </Link>
        </div>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
      <div className="text-xl sm:text-2xl mb-1">{icon}</div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-base sm:text-xl font-bold truncate">{value}</p>
    </div>
  );
}

const TIER_COLORS: Record<AchievementTier, string> = {
  bronze: "text-amber-700",
  silver: "text-slate-500",
  gold: "text-yellow-500",
};

function TierLabel({ tier }: { tier: AchievementTier }) {
  return (
    <p
      className={`text-[9px] font-bold uppercase tracking-widest leading-tight ${TIER_COLORS[tier]}`}
    >
      {tier}
    </p>
  );
}
