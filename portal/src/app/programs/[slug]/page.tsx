import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProgramMeta, getLessons } from '@/lib/programs'

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = getProgramMeta(slug)
  if (!program) notFound()

  const lessons = getLessons(slug)

  return (
    <div className="min-h-screen pattern-bg">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/programs" className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
          ← Programs
        </Link>

        {/* Hero */}
        <div className="mt-6 mb-10 rounded-2xl p-8" style={{ background: `linear-gradient(135deg, ${program.color}22, ${program.color}08)`, border: `2px solid ${program.color}33` }}>
          <div className="text-5xl mb-4">{program.emoji}</div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--color-ink)' }}>{program.title}</h1>
          <p className="text-base mb-1 font-semibold" style={{ color: program.color }}>{program.tagline}</p>
          <p className="text-sm max-w-2xl" style={{ color: '#6B7280' }}>{program.description}</p>
        </div>

        {/* Levels */}
        {program.levels.map(level => {
          const levelLessons = lessons.filter(l => l.level === level.number)
          return (
            <div key={level.number} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: level.color }}>
                  {level.number}
                </div>
                <div>
                  <h2 className="font-extrabold text-lg" style={{ color: 'var(--color-ink)' }}>{level.title}</h2>
                  <p className="text-xs" style={{ color: '#6B7280' }}>{level.description}</p>
                </div>
                <div className="ml-auto text-sm font-bold px-3 py-1 rounded-full shrink-0"
                  style={{ background: level.color + '18', color: level.color }}>
                  {level.project.emoji} {level.project.title}
                </div>
              </div>

              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
                {levelLessons.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm" style={{ color: '#9CA3AF' }}>
                    Coming soon — lessons are being crafted ✨
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
                    {levelLessons.map((lesson, i) => (
                      <Link key={lesson.slug} href={`/programs/${slug}/${lesson.slug}`}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ background: level.color + '18', color: level.color }}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{lesson.title}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{lesson.description}</div>
                        </div>
                        <div className="text-xs shrink-0" style={{ color: '#9CA3AF' }}>{lesson.duration}</div>
                        <div className="text-sm font-bold group-hover:translate-x-1 transition-transform" style={{ color: level.color }}>→</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
