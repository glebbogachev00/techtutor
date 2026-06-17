import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CHARACTER_BY_ID, DEFAULT_CHARACTER_ID } from "@/lib/characters";
import { getProgram, getLesson } from "@/lib/lesson-registry";
import LessonWorkspace from "@/components/programs/LessonWorkspace";

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

  let alreadyDone = false;

  if (user) {
    const progressRes = await supabase
      .from("lesson_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("program_slug", slug)
      .eq("lesson_slug", lessonSlug)
      .maybeSingle();
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

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          {level ? `${level.title} · Lesson ${lesson.meta.order}` : `Lesson ${lesson.meta.order}`}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[color:var(--color-ink)]">
          {lesson.meta.title}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          ⏱ {lesson.meta.duration} · +{lesson.meta.xp} XP on completion
        </p>
      </div>

      <LessonWorkspace
        programSlug={slug}
        lessonSlug={lessonSlug}
        xp={lesson.meta.xp}
        mission={lesson.mission}
        nextHref={next ? `/programs/${slug}/${next.meta.slug}` : `/programs/${slug}`}
        alreadyDone={alreadyDone}
      />
    </div>
  );
}
