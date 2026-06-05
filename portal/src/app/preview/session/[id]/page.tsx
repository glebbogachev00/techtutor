"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CHARACTER_BY_ID, DEFAULT_CHARACTER_ID } from "@/lib/characters";
import {
  SESSION_BY_CONTENT_ID,
  type ClassSession,
  type SessionExercise,
} from "../../sessions";

type DbSession = {
  id: string;
  content_id: string;
  zoom_url: string;
  scheduled_at: string;
  unlocked_stage: number;
  is_active: boolean;
};

const STAGE_LABELS = ["Warming up…", "Easy unlocked", "Medium unlocked", "Hard unlocked", "Boss fight LIVE"];

function getCharacter(id: string) {
  return CHARACTER_BY_ID[id] ?? CHARACTER_BY_ID[DEFAULT_CHARACTER_ID];
}

function minutesUntil(iso: string) {
  return Math.round((new Date(iso).getTime() - Date.now()) / 60000);
}

// ── Zoom Banner ─────────────────────────────────────────────────────────────
function ZoomBanner({ zoomUrl, scheduledAt, accent }: { zoomUrl: string; scheduledAt: string; accent: string }) {
  const [mins, setMins] = useState(() => minutesUntil(scheduledAt));
  useEffect(() => {
    const id = setInterval(() => setMins(minutesUntil(scheduledAt)), 30000);
    return () => clearInterval(id);
  }, [scheduledAt]);

  if (mins > 30) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <span className="text-xl">⏰</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Class starts</p>
          <p className="text-sm font-bold text-[#0F172A] truncate">
            {new Date(scheduledAt).toLocaleString("en-US", { weekday: "long", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <a
          href={zoomUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-slate-500 hover:text-[#0F172A] underline whitespace-nowrap"
        >
          Test Zoom link
        </a>
      </div>
    );
  }

  const label = mins <= 0 ? "Your class is LIVE — join now" : `Your class starts in ${mins} minute${mins === 1 ? "" : "s"}`;

  return (
    <a
      href={zoomUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl p-5 text-white relative overflow-hidden shadow-[0_12px_40px_rgba(15,23,42,0.18)] hover:opacity-95 transition"
      style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)` }}
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl">📹</span>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">Live class</p>
          <p className="font-bold leading-tight">{label}</p>
        </div>
        <span className="rounded-full bg-white/20 backdrop-blur px-4 py-1.5 text-xs font-semibold whitespace-nowrap">
          Open Zoom →
        </span>
      </div>
    </a>
  );
}

// ── Character speech bubble ────────────────────────────────────────────────
function SpeechCard({ characterId, body, role }: { characterId: string; body: string; role?: string }) {
  const c = getCharacter(characterId);
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-4">
        <Image
          src={c.image}
          alt={c.name}
          width={56}
          height={56}
          className="shrink-0 w-14 h-14 rounded-full object-cover shadow-[0_2px_10px_rgba(15,23,42,0.08)]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <span className="font-bold text-[#0F172A]">{c.name}</span>
            <span className="text-xs text-slate-400">{role ?? c.tagline}</span>
          </div>
          <p className="text-sm text-[#0F172A] leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}

// ── Exercise Card ──────────────────────────────────────────────────────────
function ExerciseCard({
  exercise,
  index,
  unlocked,
  completed,
  onComplete,
  accent,
}: {
  exercise: SessionExercise;
  index: number;
  unlocked: boolean;
  completed: boolean;
  onComplete: () => void;
  accent: string;
}) {
  const [open, setOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  const difficultyBg =
    exercise.difficulty === "easy" ? "#16a34a" : exercise.difficulty === "medium" ? "#d97706" : "#dc2626";
  const character = getCharacter(exercise.speakerId);

  if (!unlocked) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/40 p-5 flex items-center gap-4">
        <div className="shrink-0 w-11 h-11 rounded-full bg-slate-100 grid place-items-center text-slate-400 font-bold">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Mission · {exercise.difficulty}</p>
          <p className="text-sm font-bold text-slate-400">Locked — teacher will reveal this next</p>
        </div>
        <span className="text-slate-300 text-xl">🔒</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-white border transition shadow-[0_4px_20px_rgba(15,23,42,0.04)] ${
        open ? "border-[#0F172A]/30" : "border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        <div
          className="shrink-0 w-11 h-11 rounded-full grid place-items-center text-white font-black text-sm shadow-[0_4px_15px_rgba(15,23,42,0.18)]"
          style={{ background: completed ? "#16a34a" : difficultyBg }}
        >
          {completed ? "✓" : String(index + 1).padStart(2, "0")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-[10px] font-bold uppercase tracking-widest text-white px-2 py-0.5 rounded-full"
              style={{ background: difficultyBg }}
            >
              {exercise.difficulty}
            </span>
            {completed && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">· Complete</span>
            )}
          </div>
          <h3 className="text-base font-bold text-[#0F172A] leading-tight">{exercise.title}</h3>
          <p className="text-xs text-slate-500 mt-1">{exercise.concept}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">XP</div>
          <div className="text-base font-bold" style={{ color: accent }}>+{exercise.xp}</div>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 -mt-1 space-y-4">
          {/* Story beat from the character */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-start gap-3">
              <Image
                src={character.image}
                alt={character.name}
                width={36}
                height={36}
                className="shrink-0 w-9 h-9 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#0F172A] mb-0.5">{character.name}</p>
                <p className="text-sm text-slate-700 italic leading-relaxed">{exercise.storyBeat}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Steps</p>
            <ol className="space-y-2">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: difficultyBg }}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Hint */}
          <div>
            <button
              type="button"
              onClick={() => setHintOpen(!hintOpen)}
              className="text-xs font-semibold underline"
              style={{ color: accent }}
            >
              {hintOpen ? "Hide hint" : "💡 Show hint"}
            </button>
            {hintOpen && (
              <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
                {exercise.hint}
              </div>
            )}
          </div>

          {/* Done */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-[#0F172A]">Done when:</span> {exercise.successCriteria}
            </p>
            {!completed ? (
              <button
                type="button"
                onClick={onComplete}
                className="shrink-0 rounded-full px-5 py-2 text-xs font-bold text-white shadow-[0_4px_15px_rgba(15,23,42,0.18)] hover:opacity-90 transition"
                style={{ background: accent }}
              >
                Mark done ✓
              </button>
            ) : (
              <span className="shrink-0 text-xs font-bold text-green-700">+{exercise.xp} XP earned</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Boss Fight Card ────────────────────────────────────────────────────────
function BossCard({
  session,
  unlocked,
  completed,
  onComplete,
}: {
  session: ClassSession;
  unlocked: boolean;
  completed: boolean;
  onComplete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const bf = session.bossFight;
  const villain = getCharacter(bf.speakerId);
  const accent = session.accentColor;

  if (!unlocked) {
    return (
      <div
        className="rounded-3xl border-2 border-dashed p-6 flex items-center gap-4"
        style={{ borderColor: `${accent}50`, background: `${accent}05` }}
      >
        <span className="text-3xl">⚔️</span>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Boss fight</p>
          <p className="text-sm font-bold text-slate-500">Finish the exercises first…</p>
        </div>
        <span className="text-2xl">🔒</span>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl border-2 overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.15)]"
      style={{ borderColor: accent, background: "white" }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 flex items-start gap-4"
        style={{ background: `linear-gradient(135deg, ${accent}10 0%, transparent 60%)` }}
      >
        <Image
          src={villain.image}
          alt={villain.name}
          width={64}
          height={64}
          className="shrink-0 w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-[0_4px_15px_rgba(15,23,42,0.18)]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-[10px] font-bold uppercase tracking-widest text-white px-2 py-0.5 rounded-full"
              style={{ background: accent }}
            >
              Boss fight
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">⏱ {bf.timeLimitMinutes} min</span>
            {completed && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">· Defeated</span>
            )}
          </div>
          <h3 className="text-lg font-black text-[#0F172A] leading-tight">{bf.title}</h3>
          <p className="text-sm text-slate-600 mt-1 italic">"{bf.storyBeat}"</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Reward</div>
          <div className="text-base font-bold" style={{ color: accent }}>+{bf.xp} XP</div>
        </div>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Challenges</p>
            <ol className="space-y-3">
              {bf.challenges.map((c, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: accent }}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{c}</span>
                </li>
              ))}
            </ol>
          </div>

          {!completed ? (
            <button
              type="button"
              onClick={onComplete}
              className="w-full rounded-full py-3 text-sm font-bold text-white shadow-[0_4px_15px_rgba(15,23,42,0.18)] hover:opacity-90 transition"
              style={{ background: accent }}
            >
              I defeated {bf.title} 🏆
            </button>
          ) : (
            <div className="rounded-xl border-2 p-4 text-center" style={{ borderColor: accent, background: `${accent}10` }}>
              <p className="text-2xl mb-1">🏆</p>
              <p className="text-sm font-bold text-[#0F172A]">Badge earned: <span style={{ color: accent }}>{bf.reward}</span></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function SessionPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params.id;

  const [dbSession, setDbSession] = useState<DbSession | null>(null);
  const [content, setContent] = useState<ClassSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `tt-session-done-${sessionId}`;
  const [doneStages, setDoneStages] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    } catch {
      return [];
    }
  });

  const markDone = useCallback(
    (stage: number) => {
      setDoneStages((prev) => {
        if (prev.includes(stage)) return prev;
        const next = [...prev, stage];
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [storageKey],
  );

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      const { data, error: err } = await supabase
        .from("class_sessions")
        .select("id, content_id, zoom_url, scheduled_at, unlocked_stage, is_active")
        .eq("id", sessionId)
        .maybeSingle();

      if (err || !data) {
        setError("Session not found. Check the link from your teacher.");
        setLoading(false);
        return;
      }
      setDbSession(data as DbSession);
      const c = SESSION_BY_CONTENT_ID[(data as DbSession).content_id];
      if (!c) {
        setError("Lesson content not found.");
        setLoading(false);
        return;
      }
      setContent(c);
      setLoading(false);

      channel = supabase
        .channel(`session:${sessionId}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "class_sessions", filter: `id=eq.${sessionId}` },
          (payload) => {
            setDbSession((prev) =>
              prev ? { ...prev, unlocked_stage: (payload.new as DbSession).unlocked_stage } : prev,
            );
          },
        )
        .subscribe();
    }

    load();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] grid place-items-center">
        <div className="text-center space-y-3">
          <div className="text-3xl">📡</div>
          <p className="text-sm text-slate-500">Connecting to your class…</p>
        </div>
      </main>
    );
  }

  if (error || !dbSession || !content) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] grid place-items-center">
        <div className="text-center space-y-3 max-w-sm">
          <div className="text-5xl">😕</div>
          <p className="text-base text-[#0F172A] font-bold">{error ?? "Something went wrong."}</p>
          <Link href="/preview" className="text-sm text-[#193b92] underline">← Back to the portal</Link>
        </div>
      </main>
    );
  }

  const stage = dbSession.unlocked_stage;
  const accent = content.accentColor;
  const stageDone = doneStages.length;
  const totalXp =
    content.exercises.reduce((s, e, i) => (doneStages.includes(i) ? s + e.xp : s), 0) +
    (doneStages.includes(99) ? content.bossFight.xp : 0);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#0F172A]">
      {/* Hero */}
      <div
        className="relative overflow-hidden text-white px-6 py-10 sm:py-14"
        style={{ background: `linear-gradient(135deg, #0F172A 0%, ${accent} 70%, ${accent} 100%)` }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle at 20% 20%, white, transparent 50%)" }} />
        <div className="max-w-2xl mx-auto relative">
          <Link href="/preview" className="text-[11px] uppercase tracking-widest text-white/70 hover:text-white inline-flex items-center gap-1 mb-6">
            ← TechBash portal
          </Link>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
              {content.program === "gdevelop" ? "🎮 GDevelop" : "🌋 Roblox"}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
              Lesson {content.lessonNumber}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
              {STAGE_LABELS[stage]}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 leading-tight">{content.title}</h1>
          <p className="text-white/80 text-base mb-6">{content.tagline}</p>

          {/* Progress + XP bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-2 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full rounded-full bg-white transition-all" style={{ width: `${(stageDone / 4) * 100}%` }} />
            </div>
            <span className="text-xs font-bold whitespace-nowrap">{totalXp} XP</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 -mt-6 sm:-mt-8 pb-16 space-y-6 relative">
        {/* Zoom banner */}
        <ZoomBanner zoomUrl={dbSession.zoom_url} scheduledAt={dbSession.scheduled_at} accent={accent} />

        {/* Story intro */}
        <SpeechCard characterId={content.introCharacterId} body={content.storyIntro} />

        {/* Big idea */}
        <div className="rounded-xl bg-[#F0F9F8] border border-[#2C7A7B]/20 px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#2C7A7B] mb-1">Today's big idea</p>
          <p className="text-sm text-[#0F172A] leading-relaxed">{content.bigIdea}</p>
        </div>

        {/* Exercises */}
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">Lesson missions</h2>
          <div className="space-y-3">
            {content.exercises.map((ex, i) => (
              <ExerciseCard
                key={i}
                exercise={ex}
                index={i}
                unlocked={stage > i}
                completed={doneStages.includes(i)}
                onComplete={() => markDone(i)}
                accent={accent}
              />
            ))}
          </div>
        </div>

        {/* Boss fight */}
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">Boss fight</h2>
          <BossCard
            session={content}
            unlocked={stage >= 4}
            completed={doneStages.includes(99)}
            onComplete={() => markDone(99)}
          />
        </div>

        {/* Victory CTA */}
        {doneStages.includes(99) && (
          <div
            className="rounded-3xl p-8 text-center text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)]"
            style={{ background: `linear-gradient(135deg, ${accent} 0%, #0F172A 100%)` }}
          >
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-black mb-2">Class complete!</h3>
            <p className="text-white/80 mb-5 text-sm">
              You earned <strong>+{totalXp} XP</strong> and the <strong>{content.bossFight.reward}</strong> badge. Want to keep going?
            </p>
            <Link
              href="/preview"
              className="inline-block rounded-full bg-white text-[#0F172A] font-bold text-sm px-6 py-3 hover:bg-slate-100 transition"
            >
              Explore more missions →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
