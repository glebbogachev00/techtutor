import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";

export const metadata = { title: "Class roster — TechBash" };

type PageProps = { params: Promise<{ id: string }> };

export default async function ClassRoster({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?teacher=1");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || (profile.role !== "teacher" && profile.role !== "admin")) {
    redirect("/dashboard");
  }

  const { data: cls } = await supabase
    .from("classes")
    .select("id, name, teacher_id, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!cls) notFound();
  if (cls.teacher_id !== user.id && profile.role !== "admin") {
    redirect("/teacher");
  }

  // Active code for the header.
  const { data: codeRow } = await supabase
    .from("class_codes")
    .select("code")
    .eq("class_id", id)
    .eq("active", true)
    .maybeSingle();

  // Roster
  const { data: members } = await supabase
    .from("class_members")
    .select("student_id, joined_at, profiles(full_name, avatar_emoji)")
    .eq("class_id", id)
    .order("joined_at", { ascending: false });

  type MemberRow = {
    student_id: string;
    joined_at: string;
    profiles: { full_name: string | null; avatar_emoji: string | null } | null;
  };
  const roster = (members ?? []) as MemberRow[];
  const ids = roster.map((m) => m.student_id);

  // Per-student stats from preview tables.
  let xpMap = new Map<string, number>();
  let missionCountMap = new Map<string, number>();
  let adventureCountMap = new Map<string, number>();
  if (ids.length > 0) {
    const [{ data: prog }, { data: adv }] = await Promise.all([
      supabase
        .from("preview_progress")
        .select("user_id, xp_earned")
        .in("user_id", ids),
      supabase
        .from("preview_adventures")
        .select("user_id, xp_earned")
        .in("user_id", ids),
    ]);

    (prog ?? []).forEach((r) => {
      xpMap.set(r.user_id as string, (xpMap.get(r.user_id as string) ?? 0) + (r.xp_earned ?? 0));
      missionCountMap.set(
        r.user_id as string,
        (missionCountMap.get(r.user_id as string) ?? 0) + 1,
      );
    });
    (adv ?? []).forEach((r) => {
      xpMap.set(r.user_id as string, (xpMap.get(r.user_id as string) ?? 0) + (r.xp_earned ?? 0));
      adventureCountMap.set(
        r.user_id as string,
        (adventureCountMap.get(r.user_id as string) ?? 0) + 1,
      );
    });
  }

  const sorted = [...roster].sort(
    (a, b) => (xpMap.get(b.student_id) ?? 0) - (xpMap.get(a.student_id) ?? 0),
  );

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#0F172A]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/teacher" size="md" suffix="Teachers" />
          <Link
            href="/auth/signout"
            className="text-sm text-slate-500 hover:text-[#0F172A]"
          >
            Sign out
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href="/teacher"
            className="text-xs text-slate-500 hover:text-[#7C3AED]"
          >
            ← All classes
          </Link>
        </div>

        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7C3AED] mb-1">
              Class roster
            </p>
            <h1 className="text-3xl font-bold tracking-tight">{cls.name}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {roster.length} {roster.length === 1 ? "student" : "students"}
              {codeRow?.code && (
                <>
                  {" · "}
                  <span className="font-mono tracking-widest text-[#7C3AED] font-bold">
                    {codeRow.code}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {roster.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-bold">No students yet</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Share the code{" "}
              <span className="font-mono font-bold text-[#7C3AED]">
                {codeRow?.code ?? "— — —"}
              </span>{" "}
              with your class. They sign in at{" "}
              <span className="font-mono">/login</span> using the Class code tab.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Student</th>
                  <th className="text-right px-5 py-3 font-semibold">
                    Missions
                  </th>
                  <th className="text-right px-5 py-3 font-semibold">
                    Quests
                  </th>
                  <th className="text-right px-5 py-3 font-semibold">XP</th>
                  <th className="text-right px-5 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((m) => {
                  const name = m.profiles?.full_name ?? "Anonymous";
                  const emoji = m.profiles?.avatar_emoji ?? "🚀";
                  const xp = xpMap.get(m.student_id) ?? 0;
                  const missions = missionCountMap.get(m.student_id) ?? 0;
                  const quests = adventureCountMap.get(m.student_id) ?? 0;
                  return (
                    <tr
                      key={m.student_id}
                      className="border-t border-slate-100 hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{emoji}</span>
                          <span className="font-semibold">{name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        {missions}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        {quests}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums font-bold text-[#7C3AED]">
                        {xp.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-slate-500 text-xs">
                        {new Date(m.joined_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
