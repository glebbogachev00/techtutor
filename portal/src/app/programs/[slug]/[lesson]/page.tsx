import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProgram, getLesson } from "@/lib/lesson-registry";
import { getRichLesson } from "@/lib/lesson-content";
import CosmosBackground from "@/components/CosmosBackground";
import LessonWorkspace from "@/components/programs/LessonWorkspace";
import LessonView from "@/components/programs/LessonView";

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
  const richLesson = getRichLesson(slug, lessonSlug);

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

  const nextHref = next ? `/programs/${slug}/${next.meta.slug}` : `/programs/${slug}`;
  const accent = level?.color ?? program.color;

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
          <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/70 mb-6 flex-wrap">
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <span className="text-white/40">/</span>
            <Link href="/programs" className="hover:text-white">Programs</Link>
            <span className="text-white/40">/</span>
            <Link href={`/programs/${slug}`} className="hover:text-white">{program.title}</Link>
          </nav>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {level && (
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
                {level.tier}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
              Lesson {lesson.meta.order}
            </span>
            {alreadyDone && (
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
                ✓ Completed
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            {lesson.meta.title}
          </h1>
          <p className="text-white/80 text-sm sm:text-base">{lesson.meta.description}</p>
          <p className="text-xs text-white/70 mt-4">
            ⏱ {lesson.meta.duration} · +{lesson.meta.xp} XP on completion
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 -mt-6 sm:-mt-8 pb-16 relative">
        {richLesson ? (
          <LessonView
            lesson={richLesson}
            programSlug={slug}
            lessonSlug={lessonSlug}
            xp={lesson.meta.xp}
            nextHref={nextHref}
            alreadyDone={alreadyDone}
          />
        ) : (
          <LessonWorkspace
            programSlug={slug}
            lessonSlug={lessonSlug}
            xp={lesson.meta.xp}
            mission={lesson.mission}
            nextHref={nextHref}
            alreadyDone={alreadyDone}
          />
        )}
      </div>
    </main>
  );
}
