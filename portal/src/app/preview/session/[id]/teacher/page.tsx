"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CHARACTER_BY_ID, DEFAULT_CHARACTER_ID } from "@/lib/characters";
import { SESSION_BY_CONTENT_ID, type ClassSession } from "../../../sessions";

type DbSession = {
  id: string;
  content_id: string;
  zoom_url: string;
  scheduled_at: string;
  unlocked_stage: number;
  is_active: boolean;
};

const STAGES = [
  { stage: 1, label: "Reveal Easy mission", helper: "Warm-up", emoji: "🟢", color: "#16a34a" },
  { stage: 2, label: "Reveal Medium mission", helper: "Main concept", emoji: "🟡", color: "#d97706" },
  { stage: 3, label: "Reveal Hard mission", helper: "Stretch challenge", emoji: "🔴", color: "#dc2626" },
  { stage: 4, label: "Start the Boss Fight", helper: "Timed dramatic finish", emoji: "⚔️", color: "#7c3aed" },
];

function getCharacter(id: string) {
  return CHARACTER_BY_ID[id] ?? CHARACTER_BY_ID[DEFAULT_CHARACTER_ID];
}

export default function TeacherSessionPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params.id;
  const [db, setDb] = useState<DbSession | null>(null);
  const [content, setContent] = useState<ClassSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [copied, setCopied] = useState(false);

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
        setError("Session not found.");
        setLoading(false);
        return;
      }
      setDb(data as DbSession);
      const c = SESSION_BY_CONTENT_ID[(data as DbSession).content_id];
      setContent(c ?? null);
      setLoading(false);

      channel = supabase
        .channel(`teacher-session:${sessionId}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "class_sessions", filter: `id=eq.${sessionId}` },
          (payload) => setDb((prev) => (prev ? { ...prev, ...(payload.new as Partial<DbSession>) } : prev)),
        )
        .subscribe();
    }

    load();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [sessionId]);

  async function advance() {
    if (!db || db.unlocked_stage >= 4) return;
    setAdvancing(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("class_sessions")
      .update({ unlocked_stage: db.unlocked_stage + 1 })
      .eq("id", sessionId)
      .select("unlocked_stage")
      .single();
    if (data) setDb((prev) => (prev ? { ...prev, unlocked_stage: data.unlocked_stage } : prev));
    setAdvancing(false);
  }

  async function rewind() {
    if (!db || db.unlocked_stage <= 0) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("class_sessions")
      .update({ unlocked_stage: db.unlocked_stage - 1 })
      .eq("id", sessionId)
      .select("unlocked_stage")
      .single();
    if (data) setDb((prev) => (prev ? { ...prev, unlocked_stage: data.unlocked_stage } : prev));
  }

  function copyLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(`${window.location.origin}/preview/session/${sessionId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (loading) {
    return <main className="min-h-screen bg-[#0F172A] grid place-items-center text-white/60">Loading…</main>;
  }
  if (error || !db || !content) {
    return (
      <main className="min-h-screen bg-[#0F172A] grid place-items-center text-center">
        <div className="text-white">
          <p className="text-5xl mb-3">😕</p>
          <p className="font-bold mb-2">{error ?? "Not found"}</p>
          <Link href="/teacher" className="text-sm text-white/60 underline">← Back to teacher dashboard</Link>
        </div>
      </main>
    );
  }

  const stage = db.unlocked_stage;
  const next = STAGES.find((s) => s.stage === stage + 1);
  const accent = content.accentColor;
  const studentUrl = typeof window !== "undefined" ? `${window.location.origin}/preview/session/${sessionId}` : "";
  const introC = getCharacter(content.introCharacterId);
  const bossC = getCharacter(content.bossFight.speakerId);

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/teacher" className="text-xs text-white/60 hover:text-white">← Teacher dashboard</Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Live control panel</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Lesson header */}
        <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}30, transparent 60%), #1E293B` }}>
          <div className="flex items-start gap-4">
            <Image src={introC.image} alt={introC.name} width={64} height={64} className="shrink-0 w-16 h-16 rounded-full object-cover ring-4 ring-white/20" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white px-2.5 py-1 rounded-full" style={{ background: accent }}>
                  {content.program === "gdevelop" ? "🎮 GDevelop" : "🌋 Roblox"} · L{content.lessonNumber}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">{content.title}</h1>
              <p className="text-sm text-white/70 mt-1">{content.tagline}</p>
            </div>
          </div>
        </div>

        {/* Student link card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl">🔗</span>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Student link</p>
              <p className="text-xs text-white/40">Share this with the student. Same link every class.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-emerald-300 font-mono bg-black/30 px-3 py-2 rounded-lg truncate">{studentUrl}</code>
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 text-xs font-semibold bg-white text-[#0F172A] hover:bg-slate-100 transition px-4 py-2 rounded-full"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Stage timeline */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">Class agenda</p>
          <div className="space-y-2.5">
            {STAGES.map((s, idx) => {
              const isDone = stage >= s.stage;
              const isCurrent = stage + 1 === s.stage;
              const ex = idx < 3 ? content.exercises[idx] : null;
              return (
                <div
                  key={s.stage}
                  className={`rounded-xl border px-4 py-3 flex items-center gap-3 transition ${
                    isCurrent
                      ? "border-white/40 bg-white/10"
                      : isDone
                        ? "border-white/10 bg-white/[0.02] opacity-60"
                        : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div
                    className="shrink-0 w-9 h-9 rounded-full grid place-items-center text-sm font-bold"
                    style={{ background: isDone ? s.color : "rgba(255,255,255,0.08)", color: isDone ? "white" : "rgba(255,255,255,0.5)" }}
                  >
                    {isDone ? "✓" : s.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight">{ex ? ex.title : content.bossFight.title}</p>
                    <p className="text-[11px] text-white/50 mt-0.5">{ex ? ex.concept : s.helper}</p>
                  </div>
                  {isCurrent && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-amber-300">Next</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Advance control */}
        {next ? (
          <button
            type="button"
            onClick={advance}
            disabled={advancing}
            className="w-full rounded-2xl py-5 text-lg font-black transition-all hover:opacity-90 disabled:opacity-50 shadow-[0_12px_40px_rgba(15,23,42,0.4)]"
            style={{ background: accent }}
          >
            {advancing ? "Unlocking…" : `${next.emoji}  ${next.label}`}
          </button>
        ) : (
          <div className="rounded-2xl p-5 text-center bg-gradient-to-br from-purple-700 to-indigo-700">
            <p className="text-2xl mb-1">🏆</p>
            <p className="font-bold">All stages unlocked — boss fight is live!</p>
          </div>
        )}

        {/* Secondary actions */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={rewind}
            disabled={stage === 0}
            className="text-white/50 hover:text-white transition disabled:opacity-30"
          >
            ← Rewind one stage
          </button>
          <a
            href={db.zoom_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition"
          >
            Open Zoom room →
          </a>
        </div>

        {/* Boss preview */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">Boss fight preview</p>
          <div className="flex items-start gap-3">
            <Image src={bossC.image} alt={bossC.name} width={48} height={48} className="shrink-0 w-12 h-12 rounded-full object-cover ring-2 ring-white/20" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">{content.bossFight.title}</p>
              <p className="text-xs text-white/60 italic mt-1">"{content.bossFight.storyBeat}"</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
