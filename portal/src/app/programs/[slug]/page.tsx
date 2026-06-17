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
    <div className="space-y-6">
      <Link
        href="/programs"
        className="text-sm text-gray-600 hover:text-[color:var(--color-primary)]"
      >
        ← Programs
      </Link>

      <div className="flex items-center gap-4">
        <div className="text-5xl">{program.emoji}</div>
        <div>
          <h1 className="text-3xl font-extrabold text-[color:var(--color-ink)]">
            {program.title}
          </h1>
          <p className="text-gray-600">{program.tagline}</p>
        </div>
      </div>

      {program.levels.map((level) => {
        const lvlLessons = lessons.filter((l) => l.level === level.number);
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
              <div className="card p-5 text-sm text-gray-400 italic">
                Coming soon ✨
              </div>
            ) : (
              <ol className="space-y-3">
                {lvlLessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/programs/${slug}/${lesson.slug}`}
                      className="card p-5 flex items-center gap-4"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                        style={{ background: level.color }}
                      >
                        {lesson.order}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[color:var(--color-ink)]">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lesson.duration} · {lesson.description}
                        </p>
                      </div>
                      <span className="text-sm text-gray-400">→</span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        );
      })}
    </div>
  );
}
