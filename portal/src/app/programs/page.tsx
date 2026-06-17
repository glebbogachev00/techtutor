import Link from "next/link";
import { getAllPrograms } from "@/lib/programs";

const PROGRAM_SKILLS: Record<string, string[]> = {
  "generative-ai-magic": ["Prompt engineering", "AI video", "2D & 3D games", "Web apps", "Discord bots"],
};

const PROGRAM_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  "generative-ai-magic": { label: "NEW", color: "#059669", bg: "#DCFCE7" },
};

export default function ProgramsPage() {
  const programs = getAllPrograms();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-semibold text-slate-500 hover:text-[#0F172A] transition">
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0F172A] mb-2">Programs</h1>
          <p className="text-slate-500">Structured learning journeys — each one ends with a real shipped project.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p) => {
            const badge = PROGRAM_BADGE[p.slug];
            const skills = PROGRAM_SKILLS[p.slug] ?? [];
            return (
              <Link
                key={p.slug}
                href={`/programs/${p.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all relative overflow-hidden flex flex-col"
              >
                {/* Hover accent stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: p.color }}
                />

                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl grid place-items-center text-2xl"
                    style={{ background: p.colorLight }}
                  >
                    {p.emoji}
                  </div>
                  {badge && (
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  )}
                </div>

                <h2 className="text-base font-black text-[#0F172A] mb-1.5">{p.title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">{p.tagline}</p>

                {skills.length > 0 && (
                  <p className="text-[11px] text-slate-400">
                    <span className="font-black uppercase tracking-widest">Skills: </span>
                    {skills.join(", ")}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
