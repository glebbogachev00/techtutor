import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createClient } from "@/lib/supabase/server";
import { CHARACTER_BY_ID, DEFAULT_CHARACTER_ID } from "@/lib/characters";
import { getProgramMeta, getLessons, getLessonContent } from "@/lib/programs";
import { mdxComponents } from "@/components/programs/mdx-components";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>;
}) {
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

  // Get character theme
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let theme = CHARACTER_BY_ID[DEFAULT_CHARACTER_ID];
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("selected_character")
      .eq("id", user.id)
      .single();
    if (profile?.selected_character) {
      theme = CHARACTER_BY_ID[profile.selected_character] ?? theme;
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* ── Top nav ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link
            href={`/programs/${slug}`}
            className="text-sm font-semibold text-slate-500 hover:text-[#0F172A] transition flex items-center gap-1.5"
          >
            ← {program.title}
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            {level && (
              <span
                className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: `${level.color}18`, color: level.color }}
              >
                Level {level.number}
              </span>
            )}
            <span className="text-[11px] font-semibold text-slate-400">
              Lesson {result.meta.order} of {lessons.filter(l => l.level === result.meta.level).length}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            ⏱ {result.meta.duration}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 flex gap-8 py-10">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-6">
            {program.levels.map((lvl) => {
              const lvlLessons = lessons.filter((l) => l.level === lvl.number);
              return (
                <div key={lvl.number}>
                  <p
                    className="text-[10px] font-black uppercase tracking-widest mb-2 px-1"
                    style={{ color: lvl.color }}
                  >
                    Level {lvl.number}
                  </p>
                  <div className="space-y-0.5">
                    {lvlLessons.length === 0 ? (
                      <p className="text-xs text-slate-400 px-3 py-2 italic">Coming soon</p>
                    ) : (
                      lvlLessons.map((l) => {
                        const isActive = l.slug === lessonSlug;
                        return (
                          <Link
                            key={l.slug}
                            href={`/programs/${slug}/${l.slug}`}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              isActive
                                ? "text-white"
                                : "text-slate-500 hover:text-[#0F172A] hover:bg-slate-100"
                            }`}
                            style={isActive ? { background: theme.accent } : {}}
                          >
                            <span
                              className="w-5 h-5 rounded-full grid place-items-center text-[10px] font-black shrink-0"
                              style={
                                isActive
                                  ? { background: "rgba(255,255,255,0.2)", color: "#fff" }
                                  : { background: "#F1F5F9", color: "#94A3B8" }
                              }
                            >
                              {l.order}
                            </span>
                            {l.title}
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">

          {/* Lesson header card */}
          <div
            className="rounded-2xl p-8 mb-8 border border-slate-200"
            style={{ background: theme.heroGradient }}
          >
            {level && (
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-3"
                style={{ color: theme.accent }}
              >
                {level.title} · Lesson {result.meta.order}
              </p>
            )}
            <h1 className="text-3xl font-black text-[#0F172A] leading-tight mb-3">
              {result.meta.title}
            </h1>
            <p className="text-slate-500 text-base">{result.meta.description}</p>
          </div>

          {/* MDX */}
          <div className="space-y-1">
            <MDXRemote source={result.content} components={mdxComponents} />
          </div>

          {/* Prev / Next */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex gap-4">
            {prev ? (
              <Link
                href={`/programs/${slug}/${prev.slug}`}
                className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all"
              >
                <p className="text-[11px] font-semibold text-slate-400 mb-1">← Previous</p>
                <p className="text-sm font-bold text-[#0F172A]">{prev.title}</p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                href={`/programs/${slug}/${next.slug}`}
                className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 text-right hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all"
              >
                <p className="text-[11px] font-semibold text-slate-400 mb-1">Next →</p>
                <p className="text-sm font-bold text-[#0F172A]">{next.title}</p>
              </Link>
            ) : (
              <Link
                href={`/programs/${slug}`}
                className="flex-1 rounded-2xl p-4 text-right text-white font-black text-sm transition-all hover:-translate-y-0.5"
                style={{
                  background: theme.accent,
                  boxShadow: `0 4px 20px ${theme.shadow}`,
                }}
              >
                ✓ Back to {program.title}
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
