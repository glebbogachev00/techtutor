import Link from 'next/link'
import { getAllPrograms } from '@/lib/programs'

export default function ProgramsPage() {
  const programs = getAllPrograms()

  return (
    <div className="min-h-screen pattern-bg">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <Link href="/dashboard" className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
            ← Back to dashboard
          </Link>
          <h1 className="text-3xl font-extrabold mt-4 mb-2" style={{ color: 'var(--color-ink)' }}>
            Your Programs
          </h1>
          <p className="text-base" style={{ color: '#6B7280' }}>
            Structured learning journeys — each one ending with a real shipped project.
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed" style={{ borderColor: '#E5E7EB' }}>
            <div className="text-4xl mb-4">📚</div>
            <p className="font-semibold" style={{ color: '#6B7280' }}>No programs available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {programs.map(p => (
              <Link key={p.slug} href={`/programs/${p.slug}`}
                className="card p-6 flex gap-5 items-start hover:scale-[1.01] transition-transform">
                <div className="text-4xl w-14 h-14 flex items-center justify-center rounded-2xl shrink-0"
                  style={{ background: p.colorLight }}>
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h2 className="font-extrabold text-lg" style={{ color: 'var(--color-ink)' }}>{p.title}</h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: p.colorLight, color: p.color }}>
                      {p.totalLessons} lessons
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#F3F4F6', color: '#6B7280' }}>
                      Ages {p.ages}
                    </span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: '#6B7280' }}>{p.tagline}</p>
                  <div className="flex gap-2 flex-wrap">
                    {p.levels.map(l => (
                      <span key={l.number} className="text-xs font-semibold px-2 py-1 rounded-lg"
                        style={{ background: l.color + '18', color: l.color }}>
                        {l.project.emoji} {l.project.title}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 font-bold text-sm" style={{ color: p.color }}>Start →</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
