"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SESSION_BY_CONTENT_ID, type ClassSession, type SessionExercise } from "../../sessions";

// ─── Types ──────────────────────────────────────────────────────────────────

type DbSession = {
  id: string;
  content_id: string;
  zoom_url: string;
  scheduled_at: string;
  unlocked_stage: number; // 0=none 1=easy 2=medium 3=hard 4=boss
  is_active: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function minutesUntil(isoDate: string): number {
  return Math.round((new Date(isoDate).getTime() - Date.now()) / 60000);
}

function ZoomBanner({ zoomUrl, scheduledAt }: { zoomUrl: string; scheduledAt: string }) {
  const [mins, setMins] = useState(() => minutesUntil(scheduledAt));

  useEffect(() => {
    const t = setInterval(() => setMins(minutesUntil(scheduledAt)), 30000);
    return () => clearInterval(t);
  }, [scheduledAt]);

  if (mins > 30) return null;

  const label =
    mins <= 0
      ? "Class is live right now"
      : `Your class starts in ${mins} minute${mins === 1 ? "" : "s"}`;

  return (
    <a
      href={zoomUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-2xl px-6 py-4 text-white font-bold text-lg shadow-lg mb-8 hover:opacity-90 transition-opacity"
      style={{ background: "linear-gradient(90deg, #2563EB, #1d4ed8)" }}
    >
      <span className="text-2xl">📹</span>
      <span className="flex-1">{label}</span>
      <span className="rounded-full bg-white/20 px-4 py-1 text-sm">Join Zoom →</span>
    </a>
  );
}

function ExerciseCard({
  exercise,
  index,
  unlocked,
  completed,
  onComplete,
}: {
  exercise: SessionExercise;
  index: number;
  unlocked: boolean;
  completed: boolean;
  onComplete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  const difficultyColor =
    exercise.difficulty === "easy"
      ? "#16a34a"
      : exercise.difficulty === "medium"
        ? "#d97706"
        : "#dc2626";

  if (!unlocked) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 flex items-center gap-4 opacity-50">
        <span className="text-3xl">🔒</span>
        <div>
          <div className="font-bold text-gray-400">Exercise {index + 1} — locked</div>
          <div className="text-sm text-gray-400">Your teacher will unlock this shortly</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border-2 p-6"
      style={{ borderColor: completed ? "#16a34a" : difficultyColor + "40" }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <span className="text-3xl">{completed ? "✅" : exercise.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold uppercase px-2 py-0.5 rounded-full text-white"
              style={{ background: difficultyColor }}
            >
              {exercise.difficulty}
            </span>
            <span className="font-bold text-lg text-gray-900">{exercise.title}</span>
          </div>
          <p className="text-gray-500 text-sm italic">{exercise.storyBeat}</p>
        </div>
        <span className="text-gray-400 text-xl">{open ? "▲" : "▼"}</span>
      </div>

      {/* Expanded */}
      {open && (
        <div className="mt-5 space-y-4">
          <ol className="space-y-2">
            {exercise.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ background: difficultyColor }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>

          {/* Hint */}
          <div>
            <button
              className="text-sm text-blue-600 underline"
              onClick={() => setHintOpen(!hintOpen)}
            >
              {hintOpen ? "Hide hint" : "Show hint"}
            </button>
            {hintOpen && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                💡 {exercise.hint}
              </div>
            )}
          </div>

          {/* Success criteria + done button */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <strong>Done when:</strong> {exercise.successCriteria}
            </p>
            {!completed && (
              <button
                onClick={onComplete}
                className="flex-shrink-0 rounded-full px-5 py-2 text-sm font-bold text-white"
                style={{ background: difficultyColor }}
              >
                Mark done ✓
              </button>
            )}
            {completed && (
              <span className="text-sm font-bold text-green-600">Completed!</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BossFightCard({
  session,
  unlocked,
  completed,
  onComplete,
  accentColor,
}: {
  session: ClassSession;
  unlocked: boolean;
  completed: boolean;
  onComplete: () => void;
  accentColor: string;
}) {
  const [open, setOpen] = useState(false);
  const bf = session.bossFight;

  if (!unlocked) {
    return (
      <div
        className="rounded-2xl border-2 border-dashed p-6 flex items-center gap-4 opacity-50"
        style={{ borderColor: accentColor + "60" }}
      >
        <span className="text-3xl">⚔️</span>
        <div>
          <div className="font-bold text-gray-400">Boss Fight — locked</div>
          <div className="text-sm text-gray-400">Finish the exercises first</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border-2 p-6"
      style={{ borderColor: accentColor, background: accentColor + "08" }}
    >
      <div className="flex items-start gap-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <span className="text-3xl">{completed ? "🏆" : "⚔️"}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold uppercase px-2 py-0.5 rounded-full text-white"
              style={{ background: accentColor }}
            >
              Boss Fight
            </span>
            <span className="font-bold text-lg text-gray-900">{bf.title}</span>
            <span className="text-xs text-gray-400">⏱ {bf.timeLimitMinutes} min</span>
          </div>
          <p className="text-gray-600 text-sm italic">{bf.storyBeat}</p>
        </div>
        <span className="text-gray-400 text-xl">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="mt-5 space-y-4">
          <ol className="space-y-3">
            {bf.challenges.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ background: accentColor }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{c}</span>
              </li>
            ))}
          </ol>

          {!completed ? (
            <button
              onClick={onComplete}
              className="rounded-full px-6 py-3 text-sm font-bold text-white"
              style={{ background: accentColor }}
            >
              I finished the boss fight! 🏆
            </button>
          ) : (
            <div className="flex items-center gap-3 text-green-700 font-bold">
              🏆 Badge earned: <span style={{ color: accentColor }}>{bf.reward}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SessionPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params.id; // Supabase row UUID

  const [dbSession, setDbSession] = useState<DbSession | null>(null);
  const [content, setContent] = useState<ClassSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local completion state (persisted to localStorage per session)
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

  // ── Load session from Supabase ──────────────────────────────────────────
  useEffect(() => {
    let channel: ReturnType<ReturnType<typeof createClient>["channel"]> | null = null;

    async function load() {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("class_sessions")
        .select("id, content_id, zoom_url, scheduled_at, unlocked_stage, is_active")
        .eq("id", sessionId)
        .maybeSingle();

      if (err || !data) {
        setError("Session not found. Check the link and try again.");
        setLoading(false);
        return;
      }

      setDbSession(data as DbSession);
      const c = SESSION_BY_CONTENT_ID[(data as DbSession).content_id];
      if (!c) {
        setError("Session content not found.");
        setLoading(false);
        return;
      }
      setContent(c);
      setLoading(false);

      // Subscribe to real-time updates for unlocked_stage
      channel = supabase
        .channel(`session:${sessionId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "class_sessions",
            filter: `id=eq.${sessionId}`,
          },
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
      if (channel) createClient().removeChannel(channel);
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400 text-lg">Loading your session…</span>
      </div>
    );
  }

  if (error || !dbSession || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-5xl">😕</div>
          <p className="text-gray-600 text-lg">{error ?? "Something went wrong."}</p>
          <a href="/preview" className="text-blue-600 underline text-sm">
            ← Back to the portal
          </a>
        </div>
      </div>
    );
  }

  const stage = dbSession.unlocked_stage;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div>
          <a href="/preview" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
            ← Back to portal
          </a>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{content.introCharacterEmoji}</span>
            <span
              className="text-xs font-bold uppercase px-3 py-1 rounded-full text-white"
              style={{ background: content.accentColor }}
            >
              {content.program === "gdevelop" ? "GDevelop" : "Roblox"} · Lesson {content.lessonNumber}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">{content.title}</h1>
        </div>

        {/* Zoom banner — appears 30 min before class */}
        <ZoomBanner zoomUrl={dbSession.zoom_url} scheduledAt={dbSession.scheduled_at} />

        {/* Story intro */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
          <div className="flex gap-3 items-start">
            <span className="text-4xl flex-shrink-0">{content.introCharacterEmoji}</span>
            <div>
              <div className="font-bold text-sm text-gray-500 mb-1">{content.introCharacter}</div>
              <p className="text-gray-700 leading-relaxed italic">"{content.storyIntro}"</p>
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          <h2 className="font-black text-gray-700 text-sm uppercase tracking-wider">
            Today's exercises
          </h2>
          {content.exercises.map((ex, i) => (
            <ExerciseCard
              key={i}
              exercise={ex}
              index={i}
              unlocked={stage > i}
              completed={doneStages.includes(i)}
              onComplete={() => markDone(i)}
            />
          ))}
        </div>

        {/* Boss Fight */}
        <div className="space-y-4">
          <h2 className="font-black text-gray-700 text-sm uppercase tracking-wider">
            Boss Fight
          </h2>
          <BossFightCard
            session={content}
            unlocked={stage >= 4}
            completed={doneStages.includes(99)}
            onComplete={() => markDone(99)}
            accentColor={content.accentColor}
          />
        </div>

        {/* Footer CTA */}
        {doneStages.includes(99) && (
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center text-white shadow-xl">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-black mb-2">Class complete!</h3>
            <p className="text-white/80 mb-5">
              You earned the <strong>{content.bossFight.reward}</strong> badge. Want to keep going?
            </p>
            <a
              href="/preview"
              className="inline-block rounded-full bg-white text-indigo-700 font-bold px-6 py-3 hover:bg-gray-100 transition-colors"
            >
              Explore more missions →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
