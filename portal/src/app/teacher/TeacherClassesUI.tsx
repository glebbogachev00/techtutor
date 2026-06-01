"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type ClassRow = {
  id: string;
  name: string;
  created_at: string;
  active_code: string | null;
  member_count: number;
  top_student_name: string | null;
  top_student_xp: number;
};

export default function TeacherClassesUI({
  initialClasses,
}: {
  initialClasses: ClassRow[];
}) {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassRow[]>(initialClasses);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function createClass(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusyId("__new__");
    const res = await fetch("/api/teacher/class/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    const json = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(json?.message || "Could not create class.");
      return;
    }
    setClasses((prev) => [
      {
        id: json.class.id,
        name: json.class.name,
        created_at: new Date().toISOString(),
        active_code: json.class.code,
        member_count: 0,
        top_student_name: null,
        top_student_xp: 0,
      },
      ...prev,
    ]);
    setNewName("");
    setShowNew(false);
    startTransition(() => router.refresh());
  }

  async function rotateCode(classId: string) {
    setError("");
    setBusyId(classId);
    const res = await fetch("/api/teacher/class/rotate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId }),
    });
    const json = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(json?.message || "Could not rotate code.");
      return;
    }
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId ? { ...c, active_code: json.code } : c,
      ),
    );
  }

  async function deleteClass(classId: string, name: string) {
    if (
      !window.confirm(
        `Delete the class "${name}"?\n\nThis removes the class, its codes, and every student's membership in it. Student accounts and XP are kept. This can't be undone.`,
      )
    )
      return;
    setError("");
    setBusyId(classId);
    const res = await fetch("/api/teacher/class/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId }),
    });
    const json = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      setError(json?.message || "Could not delete class.");
      return;
    }
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    startTransition(() => router.refresh());
  }

  return (
    <>
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7C3AED] mb-1">
            Teacher dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Your classes</h1>
          <p className="text-slate-500 text-sm mt-1">
            Generate rotating class codes and watch student progress.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="bg-[#7C3AED] hover:bg-[#6126c2] text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_15px_rgba(124,58,237,0.25)]"
        >
          {showNew ? "Cancel" : "+ New class"}
        </button>
      </div>

      {showNew && (
        <form
          onSubmit={createClass}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value.slice(0, 80))}
            placeholder="e.g. Year 7 Coding Club"
            className="flex-1 px-4 py-3 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15"
          />
          <button
            type="submit"
            disabled={busyId === "__new__"}
            className="bg-[#7C3AED] hover:bg-[#6126c2] text-white font-semibold text-sm px-6 py-3 rounded-full disabled:opacity-60"
          >
            {busyId === "__new__" ? "Creating…" : "Create class"}
          </button>
        </form>
      )}

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {classes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center">
          <div
            className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full"
            style={{ background: "#F5F0FF" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7l9-4 9 4-9 4-9-4z" />
              <path d="M3 12l9 4 9-4" />
              <path d="M3 17l9 4 9-4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#0F172A]">No classes yet</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Click <b>+ New class</b> to create your first class. You&apos;ll get
            a join code that students can use — no email or password needed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] flex flex-col"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                Class
              </p>
              <h3 className="text-base font-bold text-[#0F172A]">{c.name}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {c.member_count} {c.member_count === 1 ? "student" : "students"}
              </p>
              {c.top_student_name ? (
                <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
                  <span className="font-semibold text-[#0F172A] truncate">
                    {c.top_student_name}
                  </span>
                  <span className="text-slate-400">leads with</span>
                  <span className="font-semibold text-[#7C3AED]">
                    {c.top_student_xp} XP
                  </span>
                </p>
              ) : c.member_count > 0 ? (
                <p className="text-[11px] text-slate-400 mt-2">No XP earned yet</p>
              ) : null}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                  Active code
                </p>
                <p className="text-lg font-mono tracking-widest text-[#7C3AED] font-bold">
                  {c.active_code ?? "— — —"}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => rotateCode(c.id)}
                  disabled={busyId === c.id}
                  className="flex-1 text-xs font-semibold text-[#7C3AED] border border-[#7C3AED]/30 hover:bg-[#F5F0FF] rounded-full py-2 disabled:opacity-60"
                >
                  {busyId === c.id ? "Working…" : "Rotate code"}
                </button>
                <Link
                  href={`/teacher/class/${c.id}`}
                  className="flex-1 text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6126c2] rounded-full py-2 text-center"
                >
                  View roster
                </Link>
              </div>
              <button
                type="button"
                onClick={() => deleteClass(c.id, c.name)}
                disabled={busyId === c.id}
                className="mt-2 text-[11px] font-semibold text-slate-400 hover:text-red-600 transition disabled:opacity-60"
              >
                Delete class
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
