import React from "react";
import { QuizById } from "./QuizById";
import { Reveal } from "./Reveal";

export function Callout({
  type = "info",
  children,
}: {
  type?: "story" | "tip" | "warning" | "info";
  children: React.ReactNode;
}) {
  const styles = {
    story:   { bg: "bg-[#EFF6FF] border-[#193b92]/20",   bar: "#193b92", icon: "✨", label: "Story" },
    tip:     { bg: "bg-[#F0FDF4] border-[#2C7A7B]/20",   bar: "#2C7A7B", icon: "💡", label: "Pro tip" },
    warning: { bg: "bg-amber-50 border-amber-200",        bar: "#D97706", icon: "⚠️", label: "Watch out" },
    info:    { bg: "bg-slate-50 border-slate-200",        bar: "#64748B", icon: "ℹ️",  label: "Note" },
  };
  const s = styles[type] ?? styles.info;
  return (
    <div className={`rounded-xl border px-5 py-4 my-5 ${s.bg}`} style={{ borderLeftColor: s.bar, borderLeftWidth: 4 }}>
      <p className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: s.bar }}>
        {s.icon} {s.label}
      </p>
      <div className="text-sm leading-7 text-[#0F172A]">{children}</div>
    </div>
  );
}

export function Activity({
  title,
  xp = 25,
  children,
}: {
  title: string;
  xp?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden my-6">
      <div className="px-5 py-3 flex items-center gap-3 bg-[#193b92]">
        <span className="text-lg">🎯</span>
        <span className="font-black text-white text-sm uppercase tracking-wider flex-1">{title}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-white/10 px-2 py-1 rounded-full">
          +{xp} XP
        </span>
      </div>
      <div className="px-5 py-4 text-sm leading-7 text-[#0F172A]">{children}</div>
    </div>
  );
}

export function ProjectMap() {
  const projects = [
    { n: 1, emoji: "🎬", title: "AI Trailer",        level: 1, color: "#193b92", bg: "#EFF6FF" },
    { n: 2, emoji: "🌐", title: "GenAI Web App",     level: 2, color: "#2C7A7B", bg: "#F0FDF4" },
    { n: 3, emoji: "🕹️",  title: "2D Game",           level: 2, color: "#2C7A7B", bg: "#F0FDF4" },
    { n: 4, emoji: "🎮", title: "3D Game",             level: 3, color: "#7C3AED", bg: "#F5F3FF" },
    { n: 5, emoji: "🏫", title: "Educational Site",   level: 3, color: "#7C3AED", bg: "#F5F3FF" },
    { n: 6, emoji: "💬", title: "Discord App + PWA",  level: 3, color: "#7C3AED", bg: "#F5F3FF" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
      {projects.map((p) => (
        <div
          key={p.n}
          className="rounded-2xl border border-slate-200 p-4 flex flex-col gap-2"
          style={{ background: p.bg }}
        >
          <span className="text-2xl">{p.emoji}</span>
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: p.color }}>
            Project {p.n} · Level {p.level}
          </p>
          <p className="text-xs font-bold text-[#0F172A]">{p.title}</p>
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
  QuizById,
  Reveal,

  h2: (p) => (
    <h2
      className="text-lg font-black text-[#0F172A] mt-10 mb-4 pb-3 border-b border-slate-200"
      {...p}
    />
  ),
  h3: (p) => (
    <h3 className="text-base font-black text-[#0F172A] mt-6 mb-2" {...p} />
  ),
  p: (p) => (
    <p className="text-sm leading-7 text-slate-600 mb-4" {...p} />
  ),
  ul: (p) => <ul className="my-4 space-y-2" {...p} />,
  ol: (p) => (
    <ol className="my-4 space-y-2 list-decimal pl-5 text-slate-600" {...p} />
  ),
  li: (p) => (
    <li className="flex gap-2.5 text-sm leading-7 text-slate-600">
      <span className="text-[#193b92] font-black shrink-0 mt-0.5">▸</span>
      <span {...p} />
    </li>
  ),
  blockquote: (p) => (
    <blockquote
      className="my-5 pl-4 py-3 rounded-r-xl text-sm leading-7 text-[#134E4A] italic bg-[#F0F9F8] border-l-4"
      style={{ borderLeftColor: "#2C7A7B" }}
      {...p}
    />
  ),
  code: (p) => (
    <code
      className="text-xs px-1.5 py-0.5 rounded-md font-mono font-bold bg-slate-100 text-[#193b92]"
      {...p}
    />
  ),
  pre: (p) => (
    <pre
      className="my-5 p-5 rounded-2xl overflow-x-auto text-sm leading-7 font-mono bg-[#0F172A] text-slate-200"
      style={{ boxShadow: "0 4px 20px rgba(15,23,42,0.2)" }}
      {...p}
    />
  ),
  strong: (p) => <strong className="font-black text-[#0F172A]" {...p} />,
  em: (p) => <em className="italic text-[#2C7A7B]" {...p} />,
  table: (p) => (
    <div className="my-5 rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <table className="w-full text-sm" {...p} />
    </div>
  ),
  th: (p) => (
    <th
      className="text-left px-5 py-3 text-[11px] font-black uppercase tracking-widest bg-slate-50 border-b border-slate-200 text-[#2C7A7B]"
      {...p}
    />
  ),
  td: (p) => (
    <td
      className="px-5 py-3 text-sm text-slate-600 border-b border-slate-100"
      {...p}
    />
  ),
  hr: () => (
    <hr className="my-8 border-0 h-px bg-slate-200" />
  ),
};
