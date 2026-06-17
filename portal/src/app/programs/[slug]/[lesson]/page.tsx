import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getProgramMeta, getLessons, getLessonContent } from "@/lib/programs";
import { mdxComponents } from "@/components/programs/mdx-components";

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lesson: string }> }) {
  const { slug, lesson: lessonSlug } = await params;
  const program = getProgramMeta(slug);
  if (!program) notFound();

  const result = getLessonContent(slug, lessonSlug);
  if (!result) notFound();

  const lessons = getLessons(slug);
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug);
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const level = program.levels.find((l) => l.number === result.meta.level);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>

      {/* ── Top nav ── */}
      <div className="sticky top-0 z-20 border-b bg-white" style={{ borderColor: "#E2E8F0" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href={`/programs/${slug}`}
            className="text-sm font-semibold flex items-center gap-1.5 shrink-0"
            style={{ color: "var(--color-primary)" }}>
            ← {program.title}
          </Link>
          <div className="flex-1 hidden sm:flex items-center gap-2 min-w-0">
            {level && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ background: level.color + "18", color: level.color }}>
                Level {level.number}
              </span>
            )}
            <span className="text-sm font-semibold truncate" style={{ color: "#64748B" }}>
              {result.meta.title}
            </span>
          </div>
          <span className="text-xs font-semibold shrink-0 px-2.5 py-1 rounded-full"
            style={{ background: "#F1F5F9", color: "#64748B" }}>
            ⏱ {result.meta.duration}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 px-3 border-r bg-white"
          style={{ borderColor: "#E2E8F0" }}>
          {program.levels.map((lvl) => {
            const lvlLessons = lessons.filter((l) => l.level === lvl.number);
            return (
              <div key={lvl.number} className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest px-3 mb-2" style={{ color: lvl.color }}>
                  {lvl.title}
                </p>
                {lvlLessons.length === 0 ? (
                  <p className="px-3 text-xs py-2 rounded-xl" style={{ color: "#94A3B8", background: "#F8FAFC" }}>
                    Coming soon ✨
                  </p>
                ) : (
                  lvlLessons.map((l) => {
                    const isActive = l.slug === lessonSlug;
                    return (
                      <Link key={l.slug} href={`/programs/${slug}/${l.slug}`}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold mb-0.5 transition-all"
                        style={isActive
                          ? { background: "var(--color-primary)", color: "#fff" }
                          : { color: "#64748B" }}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${isActive ? "bg-white/20" : ""}`}
                          style={isActive ? { color: "#fff" } : { background: "#F1F5F9", color: "#94A3B8" }}>
                          {l.order}
                        </span>
                        {l.title}
                      </Link>
                    );
                  })
                )}
              </div>
            );
          })}
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 min-w-0 px-4 sm:px-10 py-10 max-w-3xl">

          {/* Lesson header */}
          {level && (
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
              style={{ background: level.color + "18", color: level.color }}>
              <span>Level {level.number}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>Lesson {result.meta.order}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight" style={{ color: "var(--color-ink)" }}>
            {result.meta.title}
          </h1>
          <p className="text-base mb-8" style={{ color: "#64748B" }}>{result.meta.description}</p>

          {/* What you'll learn strip */}
          <div className="card p-5 mb-10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl grid place-items-center text-xl shrink-0"
              style={{ background: "var(--color-teal)", color: "#fff" }}>📋</div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "var(--color-teal)" }}>
                Mission brief
              </p>
              <p className="text-sm leading-6" style={{ color: "var(--color-ink)" }}>
                {result.meta.description}
              </p>
            </div>
          </div>

          {/* MDX content */}
          <MDXRemote source={result.content} components={mdxComponents} />

          {/* Prev / Next */}
          <div className="mt-16 pt-8 border-t flex gap-4" style={{ borderColor: "#E2E8F0" }}>
            {prev ? (
              <Link href={`/programs/${slug}/${prev.slug}`}
                className="card flex-1 p-4 hover:scale-[1.01] transition-transform">
                <p className="text-xs font-semibold mb-1" style={{ color: "#94A3B8" }}>← Previous</p>
                <p className="text-sm font-bold" style={{ color: "var(--color-ink)" }}>{prev.title}</p>
              </Link>
            ) : <div className="flex-1" />}

            {next ? (
              <Link href={`/programs/${slug}/${next.slug}`}
                className="card flex-1 p-4 text-right hover:scale-[1.01] transition-transform">
                <p className="text-xs font-semibold mb-1" style={{ color: "#94A3B8" }}>Next →</p>
                <p className="text-sm font-bold" style={{ color: "var(--color-ink)" }}>{next.title}</p>
              </Link>
            ) : (
              <Link href={`/programs/${slug}`}
                className="flex-1 p-4 rounded-2xl text-right font-black text-sm text-white transition-transform hover:scale-[1.01] primary-gradient">
                ✓ Back to {program.title}
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
