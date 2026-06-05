"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SESSION_BY_CONTENT_ID, type ClassSession } from "../../../sessions";

type DbSession = {
  id: string;
  content_id: string;
  zoom_url: string;
  scheduled_at: string;
  unlocked_stage: number;
  is_active: boolean;
};

const STAGE_LABELS = [
  { stage: 1, label: "Unlock Easy exercise", emoji: "🟢" },
  { stage: 2, label: "Unlock Medium exercise", emoji: "🟡" },
  { stage: 3, label: "Unlock Hard exercise", emoji: "🔴" },
  { stage: 4, label: "Start Boss Fight", emoji: "⚔️" },
];

export default function TeacherSessionPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params.id;

  const [dbSession, setDbSession] = useState<DbSession | null>(null);
  const [content, setContent] = useState<ClassSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("class_sessions")
        .select("id, content_id, zoom_url, scheduled_at, unlocked_stage, is_active")
        .eq("id", sessionId)
        .maybeSingle();

      if (err || !data) {
        setError("Session not found.");
        setLoading(false);
        return;
      }
      setDbSession(data as DbSession);
      const c = SESSION_BY_CONTENT_ID[(data as DbSession).content_id];
      setContent(c ?? null);
      setLoading(false);

      // Real-time sync so two teacher tabs stay in sync
      supabase
        .channel(`teacher-session:${sessionId}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "class_sessions", filter: `id=eq.${sessionId}` },
          (payload) => setDbSession((prev) => prev ? { ...prev, ...(payload.new as Partial<DbSession>) } : prev),
        )
        .subscribe();
    }
    load();
  }, [sessionId]);

  async function advance() {
    if (!dbSession || dbSession.unlocked_stage >= 4) return;
    setAdvancing(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("class_sessions")
      .update({ unlocked_stage: dbSession.unlocked_stage + 1 })
      .eq("id", sessionId)
      .select("unlocked_stage")
      .single();
    if (data) setDbSession((prev) => prev ? { ...prev, unlocked_stage: data.unlocked_stage } : prev);
    setAdvancing(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  if (error || !dbSession || !content) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error ?? "Not found"}</div>;
  }

  const stage = dbSession.unlocked_stage;
  const nextAction = STAGE_LABELS.find((s) => s.stage === stage + 1);
  const studentUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/preview/session/${sessionId}`;

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Teacher view</div>
          <h1 className="text-3xl font-black">{content.title}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {content.program === "gdevelop" ? "GDevelop" : "Roblox"} · Lesson {content.lessonNumber}
          </p>
        </div>

        {/* Student link */}
        <div className="bg-gray-800 rounded-2xl p-5 space-y-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Student link</div>
          <div className="flex items-center gap-3">
            <code className="text-sm text-green-400 flex-1 truncate">{studentUrl}</code>
            <button
              className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full"
              onClick={() => navigator.clipboard.writeText(studentUrl)}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Stage progress */}
        <div className="bg-gray-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Class progress</div>
          <div className="space-y-3">
            {STAGE_LABELS.map((s) => {
              const done = stage >= s.stage;
              return (
                <div key={s.stage} className={`flex items-center gap-3 text-sm ${done ? "text-white" : "text-gray-500"}`}>
                  <span>{done ? "✅" : "⬜"}</span>
                  <span>{s.emoji} {s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advance button */}
        {nextAction ? (
          <button
            onClick={advance}
            disabled={advancing}
            className="w-full rounded-2xl py-5 text-xl font-black transition-all disabled:opacity-50"
            style={{ background: content.accentColor }}
          >
            {advancing ? "Unlocking…" : `${nextAction.emoji} ${nextAction.label}`}
          </button>
        ) : (
          <div className="text-center text-green-400 font-bold text-lg py-4">
            🎉 All stages unlocked — boss fight is live!
          </div>
        )}

        {/* Zoom link */}
        <a
          href={dbSession.zoom_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center rounded-2xl py-4 bg-blue-600 hover:bg-blue-500 font-bold transition-colors"
        >
          📹 Open Zoom room
        </a>
      </div>
    </main>
  );
}
