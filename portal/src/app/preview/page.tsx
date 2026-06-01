"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TRACKS, CHARACTERS, ADVENTURES } from "./missions";
import PreviewWorkspace from "./PreviewWorkspace";
import AdventureWorkspace from "./AdventureWorkspace";
import Playground from "./Playground";

const DEFAULT_PROGRESS: Record<string, number[]> = {
  web: [1, 2, 3],
  python: [1],
  genai: [],
};

const DEFAULT_ADVENTURE_PROGRESS: string[] = ["lumen"];

type Mode = "missions" | "adventure" | "playground";

export default function PreviewPage() {
  const [mode, setMode] = useState<Mode>("missions");
  const [trackId, setTrackId] = useState<"web" | "python" | "genai">("web");
  const [progress, setProgress] =
    useState<Record<string, number[]>>(DEFAULT_PROGRESS);
  const [openMission, setOpenMission] = useState<number>(4);
  const [adventureProgress, setAdventureProgress] = useState<string[]>(
    DEFAULT_ADVENTURE_PROGRESS,
  );
  const [openQuestId, setOpenQuestId] = useState<string | null>(null);

  const track = TRACKS.find((t) => t.id === trackId)!;
  const completed = progress[trackId] ?? [];
  const total = track.missions.length;
  const done = completed.length;

  const xp = useMemo(
    () =>
      track.missions
        .filter((m) => completed.includes(m.n))
        .reduce((a, b) => a + b.xp, 0),
    [track, completed],
  );

  const totalXp = useMemo(() => {
    const missionXp = TRACKS.reduce(
      (sum, t) =>
        sum +
        t.missions
          .filter((m) => (progress[t.id] ?? []).includes(m.n))
          .reduce((a, b) => a + b.xp, 0),
      0,
    );
    const adventureXp = ADVENTURES.filter((q) =>
      adventureProgress.includes(q.id),
    ).reduce((a, b) => a + b.reward, 0);
    return missionXp + adventureXp;
  }, [progress, adventureProgress]);

  const openQuest =
    openQuestId ? ADVENTURES.find((q) => q.id === openQuestId) : undefined;

  function completeQuest(id: string) {
    setAdventureProgress((prev) =>
      prev.includes(id) ? prev : [...prev, id],
    );
  }

  function statusOf(n: number): "done" | "current" | "locked" {
    if (completed.includes(n)) return "done";
    const next = track.missions.find((m) => !completed.includes(m.n));
    if (next && next.n === n) return "current";
    return "locked";
  }

  function markComplete(n: number) {
    const next = [...completed, n].sort((a, b) => a - b);
    setProgress({ ...progress, [trackId]: Array.from(new Set(next)) });
    const upcoming = track.missions.find(
      (m) => m.n > n && !completed.includes(m.n),
    );
    if (upcoming) setOpenMission(upcoming.n);
  }

  function switchTrack(id: "web" | "python" | "genai") {
    setTrackId(id);
    const nextTrack = TRACKS.find((t) => t.id === id)!;
    const c = progress[id] ?? [];
    const upcoming = nextTrack.missions.find((m) => !c.includes(m.n));
    setOpenMission(upcoming?.n ?? -1);
  }

  function reset() {
    setProgress(DEFAULT_PROGRESS);
    setTrackId("web");
    setOpenMission(4);
    setAdventureProgress(DEFAULT_ADVENTURE_PROGRESS);
    setOpenQuestId(null);
    setMode("missions");
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] font-sans">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-black tracking-tight"
            aria-label="TechTutor home"
          >
            <span>
              <span className="text-[#193b92]">Tech</span>
              <span className="text-[#2C7A7B]">Tutor</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 border-l border-slate-200 pl-3">
              Portal
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-slate-500">
              Total <span className="font-semibold text-[#193b92]">{totalXp}</span> XP
            </span>
            <button
              onClick={reset}
              className="text-xs font-semibold text-slate-500 hover:text-[#0F172A] px-2 py-1"
              title="Reset preview progress"
            >
              Reset demo
            </button>
            <span className="text-xs px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
              PREVIEW
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Mode toggle */}
        <div className="flex items-center gap-1 mb-6 p-1 bg-slate-100 rounded-full w-fit">
          <button
            onClick={() => {
              setMode("missions");
              setOpenQuestId(null);
            }}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
              mode === "missions"
                ? "bg-white text-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
                : "text-slate-500 hover:text-[#0F172A]"
            }`}
          >
            Missions
          </button>
          <button
            onClick={() => setMode("adventure")}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
              mode === "adventure"
                ? "bg-white text-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
                : "text-slate-500 hover:text-[#0F172A]"
            }`}
          >
            Adventure
            <span className="ml-2 text-[10px] uppercase tracking-wider text-amber-600">
              New
            </span>
          </button>
          <button
            onClick={() => {
              setMode("playground");
              setOpenQuestId(null);
            }}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
              mode === "playground"
                ? "bg-white text-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
                : "text-slate-500 hover:text-[#0F172A]"
            }`}
          >
            Playground
          </button>
        </div>

        {mode === "adventure" ? (
          <AdventureView
            openQuest={openQuest}
            adventureProgress={adventureProgress}
            onOpenQuest={(id) => setOpenQuestId(id)}
            onBack={() => setOpenQuestId(null)}
            onCompleteQuest={completeQuest}
          />
        ) : mode === "playground" ? (
          <Playground />
        ) : (
          <MissionsView />
        )}
      </main>
    </div>
  );

  // ───────────────────────────────────────────────────────────────────
  // Inline subviews — kept here so they share state via closure.
  // ───────────────────────────────────────────────────────────────────

  function MissionsView() {
    return (
      <>
        {/* Track tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-200">
          {TRACKS.map((t) => {
            const active = t.id === trackId;
            const c = progress[t.id] ?? [];
            return (
              <button
                key={t.id}
                onClick={() => switchTrack(t.id)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition -mb-px ${
                  active
                    ? "border-[#193b92] text-[#0F172A]"
                    : "border-transparent text-slate-500 hover:text-[#0F172A]"
                }`}
              >
                {t.name}
                <span className="ml-2 text-xs font-medium text-slate-400">
                  {c.length}/{t.missions.length}
                </span>
              </button>
            );
          })}
        </div>

        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
            {track.name}
          </h1>
          <p className="text-slate-500 mt-2">{track.tagline}</p>
          <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-5 flex gap-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
            <div
              className="shrink-0 w-1.5 rounded-full"
              style={{ background: track.accent }}
            />
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: track.accent }}
              >
                The story so far
              </p>
              <p className="text-sm leading-relaxed text-[#0F172A]">
                {track.storyIntro}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Meet the cast
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(Object.keys(CHARACTERS) as Array<keyof typeof CHARACTERS>).map(
                (name) => {
                  const c = CHARACTERS[name];
                  return (
                    <div
                      key={name}
                      className="flex flex-col items-center text-center"
                    >
                      <img
                        src={c.avatar}
                        alt={name}
                        className="w-16 h-16 rounded-full mb-2 shadow-[0_2px_10px_rgba(15,23,42,0.08)] object-cover"
                      />
                      <p className="text-xs font-bold text-[#0F172A] leading-tight">
                        {name}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1">
                        {c.role}
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          </div>
          <div className="mt-5 flex items-center gap-6 text-sm text-slate-500">
            <span>
              <span className="font-semibold text-[#0F172A]">{done}</span> of{" "}
              {total} missions
            </span>
            <span>
              <span className="font-semibold text-[#193b92]">{xp}</span> XP this track
            </span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(done / total) * 100}%`,
                background: track.accent,
              }}
            />
          </div>
        </section>

        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-200" />
          {track.missions.map((m) => {
            const status = statusOf(m.n);
            const isOpen = openMission === m.n;
            const isLocked = status === "locked";
            const isDone = status === "done";
            const isCurrent = status === "current";

            return (
              <div
                key={`${trackId}-${m.n}`}
                className={`relative pl-12 pb-6 ${
                  isLocked && !isOpen ? "opacity-60" : ""
                }`}
              >
                <div
                  className={`absolute left-[10px] top-1.5 w-5 h-5 rounded-full border-4 ${
                    isDone
                      ? "border-transparent"
                      : isCurrent
                      ? "bg-white border-[#193b92] ring-4 ring-[#193b92]/15"
                      : "bg-white border-slate-300"
                  }`}
                  style={
                    isDone
                      ? { background: track.accent, borderColor: track.accent }
                      : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setOpenMission(isOpen ? -1 : m.n)}
                  className={`w-full text-left rounded-2xl bg-white border transition ${
                    isOpen
                      ? "border-[#193b92] shadow-[0_8px_30px_rgba(25,59,146,0.12)]"
                      : "border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-slate-300"
                  } p-5`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Mission {String(m.n).padStart(2, "0")}
                        </span>
                        {isDone && (
                          <span
                            className="text-[11px] font-semibold uppercase tracking-wider"
                            style={{ color: track.accent }}
                          >
                            · Complete
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#193b92]">
                            · In progress
                          </span>
                        )}
                        {isLocked && (
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            · Locked
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A]">
                        {m.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {m.blurb}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-slate-400 font-medium">
                        XP
                      </div>
                      <div className="text-base font-bold text-[#193b92]">
                        +{m.xp}
                      </div>
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 rounded-2xl bg-white border border-slate-200 p-5">
                    <PreviewWorkspace
                      key={`${trackId}-${m.n}`}
                      mission={m}
                      isComplete={isDone}
                      onComplete={() => markComplete(m.n)}
                      enableAiSandbox={trackId === "genai"}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {done === total && (
          <div
            className="mt-8 rounded-2xl text-white p-6 text-center"
            style={{ background: track.accent }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
              Track complete
            </p>
            <p className="text-lg font-semibold">
              You finished {track.name}. Try the other track or reset the demo.
            </p>
          </div>
        )}
      </>
    );
  }
}

type AdventureViewProps = {
  openQuest: ReturnType<typeof ADVENTURES.find>;
  adventureProgress: string[];
  onOpenQuest: (id: string) => void;
  onBack: () => void;
  onCompleteQuest: (id: string) => void;
};

function AdventureView({
  openQuest,
  adventureProgress,
  onOpenQuest,
  onBack,
  onCompleteQuest,
}: AdventureViewProps) {
  if (openQuest) {
    const isDone = adventureProgress.includes(openQuest.id);
    return (
      <AdventureWorkspace
        key={openQuest.id}
        quest={openQuest}
        isComplete={isDone}
        onComplete={() => onCompleteQuest(openQuest.id)}
        onBack={onBack}
      />
    );
  }

  const totalDone = adventureProgress.length;
  const totalQuests = ADVENTURES.length;
  const earnedXp = ADVENTURES.filter((q) =>
    adventureProgress.includes(q.id),
  ).reduce((a, b) => a + b.reward, 0);
  const progressPct = Math.round((totalDone / totalQuests) * 100);

  return (
    <section>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#193b92] to-[#2C7A7B] text-white p-7 md:p-9 shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
        {/* tiny stars */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1.5px), radial-gradient(circle at 70% 80%, white 1px, transparent 1.5px), radial-gradient(circle at 90% 20%, white 1px, transparent 1.5px), radial-gradient(circle at 40% 70%, white 1px, transparent 1.5px), radial-gradient(circle at 10% 90%, white 1px, transparent 1.5px)",
            backgroundSize: "240px 240px",
          }}
        />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">
            Adventure Mode
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            The Adventure Map
          </h1>
          <p className="text-white/80 mt-2 max-w-xl text-sm md:text-base leading-relaxed">
            Each planet has a citizen with a real problem. Read the brief, build
            the project, ship it. No hand-holding — just you, the editor, and
            the work.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm">
              <span className="font-bold">{totalDone}</span>
              <span className="text-white/70">/ {totalQuests} planets</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm">
              <span className="font-bold">+{earnedXp}</span>
              <span className="text-white/70">XP earned</span>
            </div>
          </div>

          <div className="mt-4 h-1.5 rounded-full bg-white/15 overflow-hidden max-w-md">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Planet grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ADVENTURES.map((q) => {
          const done = adventureProgress.includes(q.id);
          return (
            <button
              key={q.id}
              onClick={() => onOpenQuest(q.id)}
              className="group text-left rounded-2xl bg-white border border-slate-200 p-5 hover:border-slate-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all relative overflow-hidden flex flex-col"
            >
              {/* accent stripe */}
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: q.accent }}
              />

              {/* Header row: planet badge + status pill */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="shrink-0 w-11 h-11 rounded-full grid place-items-center text-white text-lg font-black tracking-tight shadow-[0_4px_15px_rgba(15,23,42,0.18)] group-hover:scale-105 transition-transform"
                    style={{
                      background: q.accent,
                      boxShadow: `0 6px 20px ${q.accent}40`,
                    }}
                  >
                    {q.glyph}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 leading-tight">
                      {q.planet}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {q.language === "python" ? "Python" : "HTML / CSS"}
                    </p>
                  </div>
                </div>
                {done ? (
                  <span
                    className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                    style={{ background: q.accent }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M2.5 6.5L5 9L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Done
                  </span>
                ) : (
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                    Open
                  </span>
                )}
              </div>

              {/* Tagline */}
              <h3 className="text-base font-bold text-[#0F172A] leading-snug mb-2">
                {q.tagline}
              </h3>

              {/* Footer: client + reward */}
              <div className="mt-auto pt-4 flex items-end justify-between gap-3 border-t border-slate-100">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Client
                  </p>
                  <p className="text-sm font-semibold text-[#0F172A] truncate">
                    {q.client}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Reward
                  </p>
                  <p
                    className="text-lg font-bold leading-none mt-0.5"
                    style={{ color: q.accent }}
                  >
                    +{q.reward}
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">
                      XP
                    </span>
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
