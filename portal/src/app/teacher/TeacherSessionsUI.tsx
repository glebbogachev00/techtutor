"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CLASS_SESSIONS } from "@/app/preview/sessions";

export type SessionRow = {
  id: string;
  content_id: string;
  zoom_url: string;
  scheduled_at: string;
  unlocked_stage: number;
};

const STAGE_LABEL = ["Not started", "Easy unlocked", "Medium unlocked", "Hard unlocked", "Boss fight live"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TeacherSessionsUI({ initialSessions }: { initialSessions: SessionRow[] }) {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionRow[]>(initialSessions);
  const [showNew, setShowNew] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  // Form state
  const [contentId, setContentId] = useState(CLASS_SESSIONS[0]?.contentId ?? "");
  const [zoomUrl, setZoomUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  async function createSession(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusyId("__new__");

    // Convert local datetime-local value to ISO with timezone
    const iso = new Date(scheduledAt).toISOString();

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
    setScheduledAt("");
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
    const url = `${window.location.origin}/preview/session/${id}`;
    navigator.clipboard.writeText(url);
  }

  return (
    <>
      {/* Header row */}
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#DB2777] mb-1">
            Live sessions
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Class sessions</h2>
          <p className="text-slate-500 text-sm mt-1">
            Schedule a session, share the link, unlock exercises live during class.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="bg-[#DB2777] hover:bg-[#be185d] text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_15px_rgba(219,39,119,0.25)]"
        >
          {showNew ? "Cancel" : "+ New session"}
        </button>
      </div>

      {/* New session form */}
      {showNew && (
        <form
          onSubmit={createSession}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 space-y-4"
        >
          {/* Program picker */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Program / lesson
            </label>
            <select
              value={contentId}
              onChange={(e) => setContentId(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#DB2777] focus:ring-2 focus:ring-[#DB2777]/15"
            >
              {CLASS_SESSIONS.map((s) => (
                <option key={s.contentId} value={s.contentId}>
                  {s.program === "gdevelop" ? "🎮 GDevelop" : "🌋 Roblox"} — Lesson {s.lessonNumber}: {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Date / time */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Date & time
            </label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#DB2777] focus:ring-2 focus:ring-[#DB2777]/15"
            />
          </div>

          {/* Zoom URL */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Zoom link
            </label>
            <input
              type="url"
              required
              placeholder="https://zoom.us/j/..."
              value={zoomUrl}
              onChange={(e) => setZoomUrl(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#DB2777] focus:ring-2 focus:ring-[#DB2777]/15"
            />
          </div>

          <button
            type="submit"
            disabled={busyId === "__new__"}
            className="bg-[#DB2777] hover:bg-[#be185d] text-white font-semibold text-sm px-6 py-3 rounded-full disabled:opacity-60"
          >
            {busyId === "__new__" ? "Creating…" : "Create session"}
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
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="text-4xl mb-3">📹</div>
          <h3 className="text-lg font-bold text-[#0F172A]">No sessions yet</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Click <b>+ New session</b> to schedule your first class. You&apos;ll get a shareable link for the student.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => {
            const content = CLASS_SESSIONS.find((c) => c.contentId === s.content_id);
            const label = content
              ? `${content.program === "gdevelop" ? "GDevelop" : "Roblox"} L${content.lessonNumber} — ${content.title}`
              : s.content_id;
            const accentColor = content?.accentColor ?? "#DB2777";

            return (
              <div
                key={s.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] flex flex-col"
              >
                {/* Badge */}
                <span
                  className="self-start text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white mb-2"
                  style={{ background: accentColor }}
                >
                  {content?.program === "gdevelop" ? "GDevelop" : "Roblox"}
                </span>

                <h3 className="text-base font-bold text-[#0F172A] leading-tight">
                  {content?.title ?? s.content_id}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{formatDate(s.scheduled_at)}</p>

                {/* Stage indicator */}
                <div className="mt-3 flex items-center gap-2">
                  <div
                    className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden"
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(s.unlocked_stage / 4) * 100}%`, background: accentColor }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {STAGE_LABEL[s.unlocked_stage] ?? "Done"}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyLink(s.id)}
                    className="flex-1 text-xs font-semibold border rounded-full py-2 hover:bg-slate-50 transition"
                    style={{ borderColor: accentColor + "50", color: accentColor }}
                  >
                    Copy student link
                  </button>
                  <Link
                    href={`/preview/session/${s.id}/teacher`}
                    className="flex-1 text-xs font-semibold text-white rounded-full py-2 text-center hover:opacity-90 transition"
                    style={{ background: accentColor }}
                  >
                    Run class →
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => deleteSession(s.id, label)}
                  disabled={busyId === s.id}
                  className="mt-2 text-[11px] font-semibold text-slate-400 hover:text-red-600 transition disabled:opacity-60"
                >
                  {busyId === s.id ? "Deleting…" : "Delete session"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
