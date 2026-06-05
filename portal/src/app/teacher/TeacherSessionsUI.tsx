"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CLASS_SESSIONS } from "@/app/preview/sessions";
import { CHARACTER_BY_ID, DEFAULT_CHARACTER_ID } from "@/lib/characters";

export type SessionRow = {
  id: string;
  content_id: string;
  zoom_url: string;
  scheduled_at: string;
  unlocked_stage: number;
};

const STAGE_LABEL = ["Not started", "Easy", "Medium", "Hard", "Boss"];

function getCharacter(id: string) {
  return CHARACTER_BY_ID[id] ?? CHARACTER_BY_ID[DEFAULT_CHARACTER_ID];
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dayLabel(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short" });
}
function dateLabel(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function timeLabel(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function TeacherSessionsUI({ initialSessions }: { initialSessions: SessionRow[] }) {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionRow[]>(initialSessions);
  const [showNew, setShowNew] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  // Form state — calendar-style picker
  const [contentId, setContentId] = useState(CLASS_SESSIONS[0]?.contentId ?? "");
  const [zoomUrl, setZoomUrl] = useState("");
  const today = new Date();
  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);
  const [dateStr, setDateStr] = useState(defaultDate);
  const [timeStr, setTimeStr] = useState("15:00");

  const selectedContent = CLASS_SESSIONS.find((c) => c.contentId === contentId);

  async function createSession(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusyId("__new__");
    const iso = new Date(`${dateStr}T${timeStr}`).toISOString();

    const res = await fetch("/api/teacher/session/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content_id: contentId, zoom_url: zoomUrl, scheduled_at: iso }),
    });
    const json = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(json?.message || "Could not create session.");
      return;
    }
    setSessions((prev) => [json.session, ...prev]);
    setZoomUrl("");
    setShowNew(false);
    startTransition(() => router.refresh());
  }

  async function deleteSession(id: string, label: string) {
    if (!window.confirm(`Delete the session "${label}"? This can't be undone.`)) return;
    setError("");
    setBusyId(id);
    const res = await fetch("/api/teacher/session/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: id }),
    });
    const json = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      setError(json?.message || "Could not delete session.");
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== id));
    startTransition(() => router.refresh());
  }

  function copyLink(id: string) {
    navigator.clipboard.writeText(`${window.location.origin}/preview/session/${id}`);
  }

  // Build a 7-day calendar strip (today + next 6 days)
  const calendarDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }, []);

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, SessionRow[]>();
    sessions.forEach((s) => {
      const key = new Date(s.scheduled_at).toDateString();
      const list = map.get(key) ?? [];
      list.push(s);
      map.set(key, list);
    });
    return map;
  }, [sessions]);

  function setDateFromCal(d: Date) {
    setDateStr(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    if (!showNew) setShowNew(true);
  }

  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#DB2777] mb-1">
            Live sessions
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Class sessions</h2>
          <p className="text-slate-500 text-sm mt-1">
            Schedule a class, share the link, unlock exercises live during the lesson.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="bg-[#DB2777] hover:bg-[#be185d] text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_15px_rgba(219,39,119,0.25)]"
        >
          {showNew ? "Cancel" : "+ Schedule session"}
        </button>
      </div>

      {/* Calendar strip */}
      <div className="mb-6 grid grid-cols-7 gap-2">
        {calendarDays.map((d) => {
          const dayKey = d.toDateString();
          const dayHas = sessionsByDay.get(dayKey) ?? [];
          const isToday = d.toDateString() === new Date().toDateString();
          const isSelected =
            dateStr === `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
          return (
            <button
              key={dayKey}
              type="button"
              onClick={() => setDateFromCal(d)}
              className={`relative rounded-2xl border p-3 text-center transition ${
                isSelected
                  ? "bg-[#DB2777] text-white border-[#DB2777] shadow-[0_4px_15px_rgba(219,39,119,0.25)]"
                  : isToday
                    ? "bg-[#FDF2F8] border-[#DB2777]/20 text-[#0F172A] hover:border-[#DB2777]/40"
                    : "bg-white border-slate-200 text-[#0F172A] hover:border-slate-300"
              }`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                {dayLabel(d)}
              </p>
              <p className="text-lg font-black">{d.getDate()}</p>
              {dayHas.length > 0 && (
                <span
                  className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                    isSelected ? "bg-white" : "bg-[#DB2777]"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* New session form */}
      {showNew && (
        <form
          onSubmit={createSession}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]"
        >
          {/* Program selector — visual cards */}
          <div className="mb-5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Pick a lesson</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {CLASS_SESSIONS.map((s) => {
                const c = getCharacter(s.introCharacterId);
                const selected = contentId === s.contentId;
                return (
                  <button
                    key={s.contentId}
                    type="button"
                    onClick={() => setContentId(s.contentId)}
                    className={`text-left rounded-2xl border-2 p-4 transition flex items-start gap-3 ${
                      selected
                        ? "border-[#DB2777] bg-[#FDF2F8]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Image src={c.image} alt={c.name} width={44} height={44} className="shrink-0 w-11 h-11 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <span
                        className="inline-block text-[9px] font-bold uppercase tracking-widest text-white px-2 py-0.5 rounded-full mb-1"
                        style={{ background: s.accentColor }}
                      >
                        {s.program === "gdevelop" ? "🎮 GDevelop" : "🌋 Roblox"} · L{s.lessonNumber}
                      </span>
                      <p className="text-sm font-bold text-[#0F172A] leading-tight">{s.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{s.tagline}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date + time + zoom in one row */}
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Date</label>
              <input
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#DB2777] focus:ring-2 focus:ring-[#DB2777]/15"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Time</label>
              <input
                type="time"
                required
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#DB2777] focus:ring-2 focus:ring-[#DB2777]/15"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Zoom link</label>
              <input
                type="url"
                required
                placeholder="https://zoom.us/j/…"
                value={zoomUrl}
                onChange={(e) => setZoomUrl(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#DB2777] focus:ring-2 focus:ring-[#DB2777]/15"
              />
            </div>
          </div>

          {/* Lesson preview when selected */}
          {selectedContent && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 mb-4 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-[#0F172A]">{selectedContent.title}</span> · {selectedContent.exercises.length} exercises + boss fight ·
              ~{selectedContent.exercises.reduce((s, e) => s + e.xp, 0) + selectedContent.bossFight.xp} XP available
            </div>
          )}

          <button
            type="submit"
            disabled={busyId === "__new__"}
            className="bg-[#DB2777] hover:bg-[#be185d] text-white font-semibold text-sm px-6 py-2.5 rounded-full disabled:opacity-60"
          >
            {busyId === "__new__" ? "Scheduling…" : "Schedule this session"}
          </button>
        </form>
      )}

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-base font-bold text-[#0F172A]">No sessions scheduled</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Tap <b>+ Schedule session</b> above, pick a lesson, choose a date and Zoom link.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const content = CLASS_SESSIONS.find((c) => c.contentId === s.content_id);
            const accent = content?.accentColor ?? "#DB2777";
            const intro = getCharacter(content?.introCharacterId ?? DEFAULT_CHARACTER_ID);
            const dateObj = new Date(s.scheduled_at);
            const label = content?.title ?? s.content_id;
            return (
              <div
                key={s.id}
                className="rounded-2xl bg-white border border-slate-200 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] flex items-stretch gap-4"
              >
                {/* Date block */}
                <div
                  className="shrink-0 w-20 rounded-xl text-center py-3 px-2 flex flex-col justify-center"
                  style={{ background: `${accent}12`, color: accent }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{dayLabel(dateObj)}</p>
                  <p className="text-2xl font-black leading-none my-0.5">{dateObj.getDate()}</p>
                  <p className="text-[10px] font-semibold opacity-80">{timeLabel(dateObj)}</p>
                </div>

                {/* Lesson info */}
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <Image src={intro.image} alt={intro.name} width={40} height={40} className="shrink-0 w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block text-[9px] font-bold uppercase tracking-widest text-white px-2 py-0.5 rounded-full mb-1"
                      style={{ background: accent }}
                    >
                      {content?.program === "gdevelop" ? "🎮 GDevelop" : "🌋 Roblox"} · L{content?.lessonNumber ?? "?"}
                    </span>
                    <p className="text-sm font-bold text-[#0F172A] leading-tight truncate">{label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{dateLabel(dateObj)} · {STAGE_LABEL[s.unlocked_stage]}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyLink(s.id)}
                    className="text-xs font-semibold text-slate-500 hover:text-[#0F172A] border border-slate-200 hover:border-slate-300 rounded-full px-3 py-1.5 transition"
                  >
                    Copy link
                  </button>
                  <Link
                    href={`/preview/session/${s.id}/teacher`}
                    className="text-xs font-semibold text-white rounded-full px-4 py-1.5 transition hover:opacity-90"
                    style={{ background: accent }}
                  >
                    Run class →
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteSession(s.id, label)}
                    disabled={busyId === s.id}
                    className="text-slate-300 hover:text-red-500 transition disabled:opacity-30 w-7 h-7 grid place-items-center"
                    aria-label="Delete session"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
