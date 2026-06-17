"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProgramEntry } from "@/lib/lesson-registry";

interface Props {
  program: ProgramEntry;
  completedSlugs: string[];
}

export default function ProgramLessons({ program, completedSlugs }: Props) {
  const completed = new Set(completedSlugs);
  const firstWithLessons =
    program.levels.find((l) => program.lessons.some((x) => x.meta.level === l.number))
      ?.number ?? program.levels[0]?.number ?? 1;

  const [activeLevel, setActiveLevel] = useState<number>(firstWithLessons);

  const level = program.levels.find((l) => l.number === activeLevel) ?? program.levels[0];
  const levelLessons = program.lessons
    .filter((l) => l.meta.level === activeLevel)
    .sort((a, b) => a.meta.order - b.meta.order);

  const accent = level?.color ?? program.color;

  return (
    <div className="space-y-6">
      {/* Level tabs — mirrors the missions track-tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200">
        {program.levels.map((l) => {
          const active = l.number === activeLevel;
          const lessons = program.lessons.filter((x) => x.meta.level === l.number);
          const done = lessons.filter((x) => completed.has(x.meta.slug)).length;
          return (
            <button
              key={l.number}
              onClick={() => setActiveLevel(l.number)}
              className={`shrink-0 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition ${
                active
                  ? "text-[#0F172A]"
                  : "border-transparent text-slate-500 hover:text-[#0F172A]"
              }`}
              style={active ? { borderColor: accent } : undefined}
            >
              {l.tier}
              <span className="ml-2 text-xs font-medium text-slate-400">
                {lessons.length > 0 ? `${done}/${lessons.length}` : "Soon"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Level header */}
      <section>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
            style={{ background: accent }}
          >
            {level.tier}
          </span>
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: `${accent}18`, color: accent }}
          >
            {level.project.emoji} {level.project.title}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
          Level {level.number} — {level.title}
        </h2>
        <p className="text-slate-500 mt-1 text-sm leading-relaxed">{level.description}</p>
      </section>

      {/* Lessons timeline — mirrors the missions vertical timeline */}
      {levelLessons.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/40 p-8 text-center text-sm text-slate-400 italic">
          Coming soon ✨
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-200" />
          {levelLessons.map((lesson, i) => {
            const done = completed.has(lesson.meta.slug);
            const prevDone =
              i === 0 ? true : completed.has(levelLessons[i - 1].meta.slug);
            const unlocked = done || prevDone;
            const current = !done && unlocked;

            return (
              <div
                key={lesson.meta.slug}
                className={`relative pl-12 pb-4 ${unlocked ? "" : "opacity-60"}`}
              >
                {/* Timeline node */}
                <div
                  className="absolute left-[10px] top-1.5 w-5 h-5 rounded-full border-4"
                  style={
                    done
                      ? { background: accent, borderColor: accent }
                      : current
                      ? { background: "white", borderColor: accent, boxShadow: `0 0 0 4px ${accent}26` }
                      : { background: "white", borderColor: "#cbd5e1" }
                  }
                />

                <Link
                  href={unlocked ? `/programs/${program.slug}/${lesson.meta.slug}` : "#"}
                  className={`group block rounded-2xl bg-white border p-5 transition ${
                    unlocked
                      ? "border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
                      : "border-slate-200 pointer-events-none"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-11 h-11 rounded-full grid place-items-center font-black text-white text-sm shadow-[0_4px_15px_rgba(15,23,42,0.18)]"
                      style={{ background: done ? "#16a34a" : unlocked ? accent : "#cbd5e1" }}
                    >
                      {done ? "✓" : unlocked ? String(lesson.meta.order).padStart(2, "0") : "🔒"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Lesson {String(lesson.meta.order).padStart(2, "0")}
                        </span>
                        {done && (
                          <span
                            className="text-[11px] font-semibold uppercase tracking-wider"
                            style={{ color: accent }}
                          >
                            · Complete
                          </span>
                        )}
                        {current && (
                          <span
                            className="text-[11px] font-semibold uppercase tracking-wider"
                            style={{ color: accent }}
                          >
                            · Start here
                          </span>
                        )}
                        {!unlocked && (
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            · Locked
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A] leading-tight">
                        {lesson.meta.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        {lesson.meta.description}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        ⏱ {lesson.meta.duration} · +{lesson.meta.xp} XP
                      </p>
                    </div>

                    <div className="shrink-0 self-center">
                      <span
                        className="text-lg opacity-0 group-hover:opacity-100 transition"
                        style={{ color: accent }}
                      >
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
