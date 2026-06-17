import React from "react";
import { Quiz } from "./Quiz";
import { Reveal } from "./Reveal";

export function Callout({ type = "info", children }: { type?: "story" | "tip" | "warning" | "info"; children: React.ReactNode }) {
  const styles = {
    story:   { border: "var(--color-primary)", bg: "#EFF6FF", icon: "✨", label: "Story" },
    tip:     { border: "var(--color-teal)",    bg: "#F0FDF4", icon: "💡", label: "Pro tip" },
    warning: { border: "#D97706",              bg: "#FFFBEB", icon: "⚠️", label: "Watch out" },
    info:    { border: "#6366F1",              bg: "#EEF2FF", icon: "ℹ️",  label: "Note" },
  };
  const s = styles[type] ?? styles.info;
  return (
    <div className="card my-6 p-5" style={{ borderLeft: `5px solid ${s.border}`, background: s.bg, borderRadius: "0 16px 16px 0", boxShadow: "none" }}>
      <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: s.border }}>{s.icon} {s.label}</p>
      <div className="text-sm leading-7" style={{ color: "var(--color-ink)" }}>{children}</div>
    </div>
  );
}

export function Activity({ title, xp = 25, children }: { title: string; xp?: number; children: React.ReactNode }) {
  return (
    <div className="card my-8 overflow-hidden" style={{ border: "2px solid var(--color-primary)" }}>
      <div className="px-6 py-4 flex items-center gap-3 primary-gradient">
        <span className="text-xl">🎯</span>
        <span className="font-black text-white text-sm uppercase tracking-wider flex-1">{title}</span>
        <span className="xp-pill bg-white" style={{ color: "var(--color-primary)" }}>+{xp} XP</span>
      </div>
      <div className="px-6 py-5 text-sm leading-7" style={{ color: "var(--color-ink)" }}>{children}</div>
    </div>
  );
}

export function ProjectMap() {
  const projects = [
    { n: 1, emoji: "🎬", title: "AI Trailer",       level: 1, color: "var(--color-primary)" },
    { n: 2, emoji: "🌐", title: "GenAI Web App",    level: 2, color: "var(--color-teal)" },
    { n: 3, emoji: "🕹️",  title: "2D Game",          level: 2, color: "var(--color-teal)" },
    { n: 4, emoji: "🎮", title: "3D Game",            level: 3, color: "#7C3AED" },
    { n: 5, emoji: "🏫", title: "Educational Site",  level: 3, color: "#7C3AED" },
    { n: 6, emoji: "💬", title: "Discord App + PWA", level: 3, color: "#7C3AED" },
  ];
  return (
    <div className="my-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {projects.map(p => (
        <div key={p.n} className="card p-4">
          <div className="text-2xl mb-2">{p.emoji}</div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: p.color }}>
            Project {p.n} · Level {p.level}
          </p>
          <p className="text-xs font-bold" style={{ color: "var(--color-ink)" }}>{p.title}</p>
        </div>
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mdxComponents: Record<string, React.ComponentType<any>> = {
  Callout,
  Activity,
  ProjectMap,
  Quiz,
  Reveal,
  h2: (p) => (
    <div className="flex items-center gap-3 mt-10 mb-4">
      <div className="h-px flex-1" style={{ background: "#E2E8F0" }} />
      <h2 className="text-lg font-black uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--color-teal)" }} {...p} />
      <div className="h-px flex-1" style={{ background: "#E2E8F0" }} />
    </div>
  ),
  h3: (p) => <h3 className="text-base font-black mt-6 mb-2" style={{ color: "var(--color-ink)" }} {...p} />,
  p:  (p) => <p  className="text-base leading-8 mb-4" style={{ color: "#334155" }} {...p} />,
  ul: (p) => <ul className="my-4 space-y-2" {...p} />,
  ol: (p) => <ol className="my-4 space-y-2 list-decimal pl-5" style={{ color: "#334155" }} {...p} />,
  li: (p) => (
    <li className="flex gap-2.5 text-base leading-7" style={{ color: "#334155" }}>
      <span style={{ color: "var(--color-primary)", fontWeight: 900, flexShrink: 0 }}>▸</span>
      <span {...p} />
    </li>
  ),
  blockquote: (p) => (
    <blockquote className="my-5 pl-5 py-3 text-sm leading-7 rounded-r-xl italic"
      style={{ borderLeft: "4px solid var(--color-teal)", background: "#F0FDF4", color: "#134E4A" }} {...p} />
  ),
  code: (p) => (
    <code className="text-sm px-1.5 py-0.5 rounded-lg font-mono font-bold"
      style={{ background: "#F1F5F9", color: "var(--color-primary)" }} {...p} />
  ),
  pre: (p) => (
    <pre className="code-editor my-6 rounded-2xl overflow-x-auto" {...p} />
  ),
  strong: (p) => <strong className="font-black" style={{ color: "var(--color-ink)" }} {...p} />,
  em: (p) => <em className="italic" style={{ color: "var(--color-teal)" }} {...p} />,
  table: (p) => (
    <div className="card my-6 overflow-hidden p-0">
      <table className="w-full text-sm" {...p} />
    </div>
  ),
  th: (p) => (
    <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-wider"
      style={{ background: "#F8FAFC", color: "var(--color-teal)", borderBottom: "2px solid #E2E8F0" }} {...p} />
  ),
  td: (p) => (
    <td className="px-5 py-3 text-sm" style={{ color: "#334155", borderBottom: "1px solid #F1F5F9" }} {...p} />
  ),
  hr: () => <hr className="my-8 border-0 h-px" style={{ background: "#E2E8F0" }} />,
};
