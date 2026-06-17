import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getProgramMeta, getLessons, getLessonContent } from '@/lib/programs'
import { mdxComponents } from '@/components/programs/mdx-components'

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lesson: string }> }) {
  const { slug, lesson: lessonSlug } = await params
  const program = getProgramMeta(slug)
  if (!program) notFound()

  const result = getLessonContent(slug, lessonSlug)
  if (!result) notFound()

  const lessons = getLessons(slug)
  const currentIndex = lessons.findIndex(l => l.slug === lessonSlug)
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  const level = program.levels.find(l => l.number === result.meta.level)

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b px-4 py-3 flex items-center gap-3"
        style={{ background: '#fff', borderColor: '#E5E7EB' }}>
        <Link href={`/programs/${slug}`}
          className="text-sm font-semibold shrink-0" style={{ color: program.color }}>
          ← {program.title}
        </Link>
        <div className="flex-1 min-w-0 hidden sm:block">
          <div className="text-xs font-semibold truncate" style={{ color: '#9CA3AF' }}>
            {level && `Level ${level.number} · ${level.title}`}
          </div>
        </div>
        <div className="text-xs shrink-0" style={{ color: '#9CA3AF' }}>
          {result.meta.duration}
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex gap-0">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r py-6 px-3"
          style={{ borderColor: '#E5E7EB', background: '#fff' }}>
          {program.levels.map(lvl => {
            const lvlLessons = lessons.filter(l => l.level === lvl.number)
            if (lvlLessons.length === 0) return null
            return (
              <div key={lvl.number} className="mb-6">
                <div className="text-[10px] font-bold uppercase tracking-wider px-3 mb-2"
                  style={{ color: lvl.color }}>
                  Level {lvl.number} — {lvl.title}
                </div>
                {lvlLessons.map(l => {
                  const isActive = l.slug === lessonSlug
                  return (
                    <Link key={l.slug} href={`/programs/${slug}/${l.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold mb-0.5 transition-colors"
                      style={isActive
                        ? { background: program.color, color: '#fff' }
                        : { color: '#6B7280' }}>
                      {l.title}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-2xl mx-auto px-4 sm:px-8 py-10">
          {/* Lesson header */}
          {level && (
            <div className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: level.color }}>
              Level {level.number} · Lesson {result.meta.order}
            </div>
          )}
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--color-ink)' }}>
            {result.meta.title}
          </h1>
          <p className="text-base mb-8" style={{ color: '#6B7280' }}>{result.meta.description}</p>

          <hr className="mb-8" style={{ borderColor: '#E5E7EB' }} />

          {/* MDX content */}
          <div className="prose-custom">
            <MDXRemote source={result.content} components={mdxComponents} />
          </div>

          {/* Prev / Next */}
          <div className="mt-16 pt-8 border-t flex gap-4" style={{ borderColor: '#E5E7EB' }}>
            {prev ? (
              <Link href={`/programs/${slug}/${prev.slug}`}
                className="flex-1 rounded-2xl border p-4 hover:border-current transition-colors group"
                style={{ borderColor: '#E5E7EB' }}>
                <div className="text-xs mb-1" style={{ color: '#9CA3AF' }}>← Previous</div>
                <div className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>{prev.title}</div>
              </Link>
            ) : <div className="flex-1" />}
            {next ? (
              <Link href={`/programs/${slug}/${next.slug}`}
                className="flex-1 rounded-2xl border p-4 text-right hover:border-current transition-colors group"
                style={{ borderColor: '#E5E7EB' }}>
                <div className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Next →</div>
                <div className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>{next.title}</div>
              </Link>
            ) : (
              <Link href={`/programs/${slug}`}
                className="flex-1 rounded-2xl p-4 text-right text-white font-bold text-sm"
                style={{ background: program.color }}>
                Back to {program.title} ✓
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
