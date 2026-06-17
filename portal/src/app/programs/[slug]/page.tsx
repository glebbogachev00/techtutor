import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgramMeta, getLessons } from "@/lib/programs";

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgramMeta(slug);
  if (!program) notFound();
  const lessons = getLessons(slug);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <Link href="/programs" className="text-sm font-semibold text-slate-500 hover:text-[#0F172A] transition">
            ← Programs
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl grid place-items-center text-3xl" style={{ background: program.colorLight }}>
              {program.emoji}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: program.color }}>
                {program.totalLessons} lessons · {program.levels.length} levels · Ages {program.ages}
              </p>
              <h1 className="text-2xl font-black text-[#0F172A]">{program.title}</h1>
            </div>
          </div>
          <p className="text-slate-500 leading-relaxed">{program.description}</p>
        </div>

        {/* Levels */}
        <div className="space-y-6">
          {program.levels.map((level) => {
            const lvlLessons = lessons.filter((l) => l.level === level.number);
            return (
              <div key={level.number} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                {/* Level header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full grid place-items-center text-white text-sm font-black shrink-0"
                      style={{ background: level.color }}>
                      {level.number}
                    </div>
                    <div>
                      <h2 className="font-black text-[#0F172A]">{level.title}</h2>
                      <p className="text-xs text-slate-400">{level.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold shrink-0 px-3 py-1.5 rounded-full"
                    style={{ background: `${level.color}18`, color: level.color }}>
                    {level.project.emoji} {level.project.title}
                  </span>
                </div>

                {/* Lessons list */}
                {lvlLessons.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-slate-400 italic">
                    Lessons coming soon ✨
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {lvlLessons.map((lesson, i) => (
                      <Link
                        key={lesson.slug}
                        href={`/programs/${slug}/${lesson.slug}`}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition group"
                      >
                        <div className="w-8 h-8 rounded-full grid place-items-center text-xs font-black shrink-0"
                          style={{ background: `${level.color}15`, color: level.color }}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#0F172A]">{lesson.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{lesson.description}</p>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{lesson.duration}</span>
                        <span className="text-slate-300 group-hover:text-slate-500 transition text-sm">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
