import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CHARACTER_BY_ID } from "@/lib/characters";
import { getProgram } from "@/lib/lesson-registry";

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

  const totalLessons = program.lessons.length;
  const doneLessons = completedSlugs.length;

  return (
    <div className="space-y-6">
      <Link href="/programs" className="text-sm text-gray-600 hover:text-[color:var(--color-primary)]">
        ← Programs
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="text-5xl">{program.emoji}</div>
        <div>
          <h1 className="text-3xl font-extrabold text-[color:var(--color-ink)]">{program.title}</h1>
          <p className="text-gray-500">{program.tagline}</p>
        </div>
      </div>

      {/* Story intro */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
          The story so far
        </p>
        <p className="text-sm leading-relaxed text-[#0F172A]">{program.storyIntro}</p>
      </div>

      {/* Cast card */}
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
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-14 h-14 rounded-full mb-2 shadow-[0_2px_10px_rgba(15,23,42,0.08)] object-cover"
                  />
                  <p className="text-xs font-bold text-[#0F172A] leading-tight">{c.name}</p>
                  <p className="text-[10px] text-slate-500 leading-snug mt-0.5">{c.tagline}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress */}
      {totalLessons > 0 && (
        <div>
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
            <span>
              <span className="font-semibold text-[#0F172A]">{doneLessons}</span> of {totalLessons} lessons
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${totalLessons > 0 ? (doneLessons / totalLessons) * 100 : 0}%`,
                background: program.color,
              }}
            />
          </div>
        </div>
      )}

      {/* Lessons by level */}
      {program.levels.map((level) => {
        const lvlLessons = program.lessons.filter((l) => l.meta.level === level.number);
        return (
          <div key={level.number}>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Level {level.number} — {level.title}
              </p>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: `${level.color}18`, color: level.color }}
              >
                {level.project.emoji} {level.project.title}
              </span>
            </div>

            {lvlLessons.length === 0 ? (
              <div className="card p-5 text-sm text-gray-400 italic">Coming soon ✨</div>
            ) : (
              <ol className="space-y-3">
                {lvlLessons.map((lesson) => {
                  const done = completedSlugs.includes(lesson.meta.slug);
                  return (
                    <li key={lesson.meta.slug}>
                      <Link
                        href={`/programs/${slug}/${lesson.meta.slug}`}
                        className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                          style={{ background: done ? "#2C7A7B" : level.color }}
                        >
                          {done ? "✓" : lesson.meta.order}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[color:var(--color-ink)]">
                            {lesson.meta.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            +{lesson.meta.xp} XP · {lesson.meta.duration}
                          </p>
                        </div>
                        {done && (
                          <span className="text-xs font-bold text-[#2C7A7B]">Done</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        );
      })}
    </div>
  );
}
