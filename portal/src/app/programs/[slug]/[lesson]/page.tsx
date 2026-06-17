import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import { CHARACTER_BY_ID, DEFAULT_CHARACTER_ID } from "@/lib/characters";
import { getProgramMeta, getLessons, getLessonContent } from "@/lib/programs";
import { mdxComponents } from "@/components/programs/mdx-components";
import { TheorySection } from "@/components/programs/TheorySection";
import { LessonComplete } from "@/components/programs/LessonComplete";

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
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const level = program.levels.find((l) => l.number === result.meta.level);

  // Character theme + completion status
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let theme = CHARACTER_BY_ID[DEFAULT_CHARACTER_ID];
  let alreadyDone = false;

  if (user) {
    const [profileRes, progressRes] = await Promise.all([
      supabase.from("profiles").select("selected_character").eq("id", user.id).single(),
      supabase.from("lesson_progress").select("id")
        .eq("user_id", user.id).eq("program_slug", slug).eq("lesson_slug", lessonSlug).maybeSingle(),
    ]);
    if (profileRes.data?.selected_character) {
      theme = CHARACTER_BY_ID[profileRes.data.selected_character] ?? theme;
    }
    alreadyDone = !!progressRes.data;
  }

  const xpReward = 100;
  const nextHref = next ? `/programs/${slug}/${next.slug}` : `/programs/${slug}`;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href={`/programs/${slug}`}
        className="text-sm text-gray-600 hover:text-[color:var(--color-primary)]"
      >
        ← {program.title}
      </Link>

      {/* Lesson header */}
      <div
        className="rounded-2xl p-8 border border-slate-200"
        style={{ background: theme.heroGradient }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            {level && (
              <p
                className="text-[11px] font-black uppercase tracking-widest mb-2"
                style={{ color: theme.accent }}
              >
                {level.title} · Lesson {result.meta.order}
              </p>
            )}
            <h1 className="text-3xl font-extrabold text-[color:var(--color-ink)] mb-2">
              {result.meta.title}
            </h1>
            <p className="text-gray-500">{result.meta.description}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold text-gray-400 bg-white/60 px-3 py-1.5 rounded-full">
              ⏱ {result.meta.duration}
            </span>
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
              style={{ background: theme.accent }}
            >
              +{xpReward} XP
            </span>
          </div>
        </div>
      </div>

      {/* Theory section */}
      <TheorySection title="Theory">
        <MDXRemote
          source={result.content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </TheorySection>

      {/* Complete lesson */}
      <div className="card">
        <LessonComplete
          programSlug={slug}
          lessonSlug={lessonSlug}
          xp={xpReward}
          nextHref={nextHref}
          alreadyDone={alreadyDone}
          accentColor={theme.accent}
          accentShadow={theme.shadow}
        />
      </div>
    </div>
  );
}
