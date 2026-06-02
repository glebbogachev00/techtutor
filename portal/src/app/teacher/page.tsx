import Link from "next/link";
import Image from "next/image";
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
  if (!user) redirect("/login?teacher=1");

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
        supabase
          .from("class_members")
          .select("class_id, student_id")
          .in("class_id", ids),
      ]);

      const codeMap = new Map<string, string>();
      (codes ?? []).forEach((c) => codeMap.set(c.class_id, c.code));

      // class_id -> student_id[]
      const classStudents = new Map<string, string[]>();
      (members ?? []).forEach((m) => {
        const arr = classStudents.get(m.class_id) ?? [];
        arr.push(m.student_id);
        classStudents.set(m.class_id, arr);
      });

      // XP per student across preview tables
      const allStudentIds = Array.from(
        new Set((members ?? []).map((m) => m.student_id)),
      );
      const xpByStudent = new Map<string, number>();
      const nameByStudent = new Map<string, string | null>();
      if (allStudentIds.length > 0) {
        const [{ data: prog }, { data: adv }, { data: profs }] =
          await Promise.all([
            supabase
              .from("preview_progress")
              .select("user_id, xp_earned")
              .in("user_id", allStudentIds),
            supabase
              .from("preview_adventures")
              .select("user_id, xp_earned")
              .in("user_id", allStudentIds),
            supabase
              .from("profiles")
              .select("id, full_name")
              .in("id", allStudentIds),
          ]);
        (prog ?? []).forEach((r) => {
          xpByStudent.set(
            r.user_id as string,
            (xpByStudent.get(r.user_id as string) ?? 0) + (r.xp_earned ?? 0),
          );
        });
        (adv ?? []).forEach((r) => {
          xpByStudent.set(
            r.user_id as string,
            (xpByStudent.get(r.user_id as string) ?? 0) + (r.xp_earned ?? 0),
          );
        });
        (profs ?? []).forEach((p) => {
          nameByStudent.set(p.id as string, (p.full_name as string) ?? null);
        });
      }

      classes = rows.map((r) => {
        const studentIds = classStudents.get(r.id) ?? [];
        let topId: string | null = null;
        let topXp = 0;
        for (const sid of studentIds) {
          const xp = xpByStudent.get(sid) ?? 0;
          if (xp > topXp) {
            topXp = xp;
            topId = sid;
          }
        }
        return {
          id: r.id,
          name: r.name,
          created_at: r.created_at,
          active_code: codeMap.get(r.id) ?? null,
          member_count: studentIds.length,
          top_student_name: topId ? nameByStudent.get(topId) ?? null : null,
          top_student_xp: topXp,
        };
      });
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
            <Image
              src="/characters/captain-pixel.png"
              alt="Captain Pixel"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full bg-[#FEF3C7] ring-2 ring-[#193b92]/10 object-cover"
              priority
            />
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="text-slate-500 hover:text-[#0F172A]"
              >
                Sign out
              </button>
            </form>
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
