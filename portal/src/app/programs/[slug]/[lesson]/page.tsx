import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import { CHARACTER_BY_ID, DEFAULT_CHARACTER_ID } from "@/lib/characters";
import { getProgramMeta, getLessons, getLessonContent } from "@/lib/programs";
import { mdxComponents } from "@/components/programs/mdx-components";
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

  return (
    <div className="space-y-5">
      <Link
        href={`/programs/${slug}`}
        className="text-sm text-gray-600 hover:text-[color:var(--color-primary)]"
      >
        ← {program.title}
      </Link>

      {alreadyDone && (
        <span className="inline-flex items-center gap-2 bg-[color:var(--color-teal)] text-white text-xs font-bold px-3 py-1 rounded-full">
          ✓ Completed
        </span>
      )}

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[color:var(--color-ink)]">
        {result.meta.title}
      </h1>

      <div className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[color:var(--color-teal)] mb-2">
          {level ? `${level.title} · Lesson ${result.meta.order}` : "Lesson brief"}
        </h2>
        <p className="text-gray-800">{result.meta.description}</p>
        <p className="text-xs text-gray-400 mt-2">⏱ {result.meta.duration} · +100 XP on completion</p>
      </div>

      <div className="card p-5 sm:p-8">
        <MDXRemote
          source={result.content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>

      <div className="card p-5">
        <LessonComplete
          programSlug={slug}
          lessonSlug={lessonSlug}
          xp={100}
          nextHref={next ? `/programs/${slug}/${next.slug}` : `/programs/${slug}`}
          alreadyDone={alreadyDone}
          accentColor={theme.accent}
          accentShadow={theme.shadow}
        />
      </div>
    </div>
  );
}
