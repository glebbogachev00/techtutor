import type { MDXComponents } from 'mdx/types'

const calloutStyles = {
  story: { bg: '#F5F3FF', border: '#7C3AED', icon: '✨', label: 'Story' },
  tip:   { bg: '#F0FDF4', border: '#16A34A', icon: '💡', label: 'Tip' },
  warning: { bg: '#FFFBEB', border: '#D97706', icon: '⚠️', label: 'Note' },
  info:  { bg: '#EFF6FF', border: '#2563EB', icon: 'ℹ️', label: 'Info' },
}

export function Callout({ type = 'info', children }: { type?: keyof typeof calloutStyles; children: React.ReactNode }) {
  const s = calloutStyles[type] ?? calloutStyles.info
  return (
    <div style={{ background: s.bg, borderLeft: `4px solid ${s.border}`, borderRadius: '0 12px 12px 0' }}
      className="my-6 p-4">
      <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: s.border }}>
        {s.icon} {s.label}
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export function Activity({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="my-8 rounded-2xl overflow-hidden border-2" style={{ borderColor: '#7C3AED' }}>
      <div className="px-5 py-3 font-bold text-white text-sm" style={{ background: '#7C3AED' }}>
        🎯 Activity — {title}
      </div>
      <div className="p-5 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export function ProjectMap() {
  const projects = [
    { n: 1, emoji: '🎬', title: 'AI Trailer', level: 1 },
    { n: 2, emoji: '🌐', title: 'GenAI Web App', level: 2 },
    { n: 3, emoji: '🕹️', title: '2D Game', level: 2 },
    { n: 4, emoji: '🎮', title: '3D Game', level: 3 },
    { n: 5, emoji: '🏫', title: 'Educational Site', level: 3 },
    { n: 6, emoji: '💬', title: 'Discord App + PWA', level: 3 },
  ]
  const levelColors = ['#7C3AED', '#0891B2', '#059669']
  const levelNames = ['Level 1', 'Level 2', 'Level 3']

  return (
    <div className="my-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {projects.map(p => (
        <div key={p.n} className="rounded-xl p-3 border-2 text-center"
          style={{ borderColor: levelColors[p.level - 1], background: levelColors[p.level - 1] + '11' }}>
          <div className="text-2xl mb-1">{p.emoji}</div>
          <div className="text-xs font-bold" style={{ color: levelColors[p.level - 1] }}>Project {p.n}</div>
          <div className="text-xs font-semibold mt-0.5">{p.title}</div>
          <div className="text-[10px] mt-1 opacity-60">{levelNames[p.level - 1]}</div>
        </div>
      ))}
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  Callout,
  Activity,
  ProjectMap,
  h1: (props) => <h1 className="text-3xl font-extrabold mt-8 mb-4" style={{ color: 'var(--color-ink)' }} {...props} />,
  h2: (props) => <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: 'var(--color-ink)' }} {...props} />,
  h3: (props) => <h3 className="text-base font-bold mt-6 mb-2" style={{ color: 'var(--color-ink)' }} {...props} />,
  p: (props) => <p className="text-base leading-relaxed mb-4" style={{ color: '#374151' }} {...props} />,
  ul: (props) => <ul className="list-disc pl-5 mb-4 space-y-1 text-base" style={{ color: '#374151' }} {...props} />,
  ol: (props) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-base" style={{ color: '#374151' }} {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => <blockquote className="border-l-4 pl-4 italic my-4 text-sm" style={{ borderColor: '#7C3AED', color: '#6B7280' }} {...props} />,
  code: (props) => <code className="text-sm px-1.5 py-0.5 rounded font-mono" style={{ background: '#F3F4F6', color: '#7C3AED' }} {...props} />,
  strong: (props) => <strong className="font-bold" style={{ color: 'var(--color-ink)' }} {...props} />,
  table: (props) => <div className="overflow-x-auto my-6"><table className="w-full text-sm border-collapse" {...props} /></div>,
  th: (props) => <th className="text-left px-4 py-2 font-bold border-b-2 text-xs uppercase tracking-wider" style={{ borderColor: '#7C3AED', color: '#7C3AED' }} {...props} />,
  td: (props) => <td className="px-4 py-2 border-b text-sm" style={{ borderColor: '#F3F4F6' }} {...props} />,
  hr: () => <hr className="my-8 border-0 h-px" style={{ background: '#E5E7EB' }} />,
}
