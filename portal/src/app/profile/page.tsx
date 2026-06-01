import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";
import ProfileForm from "./ProfileForm";

export const metadata = { title: "Profile — TechBash" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, progressRes, adventureRes] = await Promise.all([
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
  ]);

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
          <Link
            href="/auth/signout"
            className="text-sm text-slate-500 hover:text-[#0F172A]"
          >
            Sign out
          </Link>
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

        <div className="text-center">
          <Link
            href={homeHref}
            className="text-sm text-[#193b92] hover:underline"
          >
            ← Back to dashboard
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
