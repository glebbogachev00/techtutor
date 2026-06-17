import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CHARACTER_BY_ID } from "@/lib/characters";
import { getProgram } from "@/lib/lesson-registry";
import ProgramLessons from "@/components/programs/ProgramLessons";
import CosmosBackground from "@/components/CosmosBackground";
import { ListenButton } from "@/components/ListenButton";

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let completedSlugs: string[] = [];
  if (user) {
    const { data } = await supabase
      .from("lesson_progress")
      .select("lesson_slug")
      .eq("user_id", user.id)
      .eq("program_slug", slug);
    completedSlugs = (data ?? []).map((r) => r.lesson_slug);
  }

  const accent = program.color;
  const totalLessons = program.lessons.length;
  const doneLessons = completedSlugs.length;
  const pct = totalLessons > 0 ? (doneLessons / totalLessons) * 100 : 0;

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#0F172A]">
      {/* Hero */}
      <div
        className="relative overflow-hidden text-white px-6 pt-20 pb-12 sm:pt-28 sm:pb-16"
        style={{ background: `linear-gradient(135deg, #0F172A 0%, ${accent} 70%, ${accent} 100%)` }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle at 20% 20%, white, transparent 50%)" }}
        />
        {/* Cosmos starfield + Planet Chroma, centred behind the hero */}
        <CosmosBackground />
        <div className="max-w-2xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/70 mb-6">
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <span className="text-white/40">/</span>
            <Link href="/programs" className="hover:text-white">Programs</Link>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur grid place-items-center text-4xl shrink-0">
              {program.emoji}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                {program.title}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">{program.tagline}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex-1 h-2 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-bold whitespace-nowrap">
              {doneLessons}/{totalLessons} lessons
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 -mt-6 sm:-mt-8 pb-16 space-y-6 relative">
        {/* Story intro */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              The story so far
            </p>
            <ListenButton text={program.storyIntro} />
          </div>
          <p className="text-sm leading-relaxed text-[#0F172A]">{program.storyIntro}</p>
        </div>

        {/* Cast */}
        {program.castIds.length > 0 && (
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Meet the cast
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {program.castIds.map((id) => {
                const c = CHARACTER_BY_ID[id];
                if (!c) return null;
                return (
                  <div key={id} className="flex flex-col items-center text-center">
                    <Image
                      src={c.image}
                      alt={c.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full mb-2 shadow-[0_2px_10px_rgba(15,23,42,0.08)] object-cover"
                    />
                    <p className="text-xs font-bold text-[#0F172A] leading-tight">{c.name}</p>
                    <p className="text-[11px] text-slate-500 leading-snug mt-1">
                      {program.castIntros?.[id] ?? c.tagline}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lessons by level — tabbed, mirrors the missions section */}
        <ProgramLessons program={program} completedSlugs={completedSlugs} />
      </div>
    </main>
  );
}
