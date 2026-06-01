import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";
import TeacherClassesUI, { type ClassRow } from "./TeacherClassesUI";

export const metadata = { title: "Teacher dashboard — TechBash" };

export default async function TeacherDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/teacher/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "teacher" && profile.role !== "admin")) {
    redirect("/dashboard");
  }

  let classes: ClassRow[] = [];
  try {
    const { data: classRows } = await supabase
      .from("classes")
      .select("id, name, created_at")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    const rows = classRows ?? [];

    if (rows.length > 0) {
      const ids = rows.map((r) => r.id);
      const [{ data: codes }, { data: members }] = await Promise.all([
        supabase
          .from("class_codes")
          .select("class_id, code")
          .in("class_id", ids)
          .eq("active", true),
        supabase.from("class_members").select("class_id").in("class_id", ids),
      ]);

      const codeMap = new Map<string, string>();
      (codes ?? []).forEach((c) => codeMap.set(c.class_id, c.code));
      const memberMap = new Map<string, number>();
      (members ?? []).forEach((m) => {
        memberMap.set(m.class_id, (memberMap.get(m.class_id) ?? 0) + 1);
      });

      classes = rows.map((r) => ({
        id: r.id,
        name: r.name,
        created_at: r.created_at,
        active_code: codeMap.get(r.id) ?? null,
        member_count: memberMap.get(r.id) ?? 0,
      }));
    }
  } catch {
    classes = [];
  }

  const displayName = profile.full_name ?? user.email ?? "Teacher";

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#0F172A]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/teacher" size="md" suffix="Teachers" />
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500 hidden sm:inline">
              {displayName}
            </span>
            <Link
              href="/auth/signout"
              className="text-slate-500 hover:text-[#0F172A]"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <TeacherClassesUI initialClasses={classes} />

        <div className="mt-10 rounded-2xl bg-[#F0F9F8] border border-[#2C7A7B]/20 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#2C7A7B] mb-2">
            Coming next
          </p>
          <ul className="text-sm text-[#0F172A] space-y-1 leading-relaxed">
            <li>· Live roster with XP, missions completed, time on platform</li>
            <li>· Assign specific tracks (Web · Python · GenAI) per class</li>
            <li>· Export progress reports (PDF / CSV)</li>
            <li>· Invite a co-teacher</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
