import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CHARACTER_BY_ID, DEFAULT_CHARACTER_ID } from "@/lib/characters";
import { getProgram, getLesson } from "@/lib/lesson-registry";
import { LessonComplete } from "@/components/programs/LessonComplete";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>;
}) {
  const { slug, lesson: lessonSlug } = await params;

  const program = getProgram(slug);
  if (!program) notFound();

  const lesson = getLesson(slug, lessonSlug);
  if (!lesson) notFound();

  const lessons = program.lessons;
  const currentIndex = lessons.findIndex((l) => l.meta.slug === lessonSlug);
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const level = program.levels.find((l) => l.number === lesson.meta.level);

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

  const { Content } = lesson;

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
        {lesson.meta.title}
      </h1>

      <div className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[color:var(--color-teal)] mb-2">
          {level ? `${level.title} · Lesson ${lesson.meta.order}` : "Lesson brief"}
        </h2>
        <p className="text-gray-800">{lesson.meta.description}</p>
        <p className="text-xs text-gray-400 mt-2">
          ⏱ {lesson.meta.duration} · +{lesson.meta.xp} XP on completion
        </p>
      </div>

      {/* Lesson content — same structure as PreviewWorkspace */}
      <Content />

      {/* Complete */}
      <div className="card p-5">
        <LessonComplete
          programSlug={slug}
          lessonSlug={lessonSlug}
          xp={lesson.meta.xp}
          nextHref={next ? `/programs/${slug}/${next.meta.slug}` : `/programs/${slug}`}
          alreadyDone={alreadyDone}
          accentColor={theme.accent}
          accentShadow={theme.shadow}
        />
      </div>
    </div>
  );
}
