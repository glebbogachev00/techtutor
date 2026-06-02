"use client";

import { useState } from "react";

interface Props {
  classId: string;
}

type NewStudent = { name: string; pin: string };

export default function AddStudentForm({ classId }: Props) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "success">("idle");
  const [error, setError] = useState("");
  const [latest, setLatest] = useState<NewStudent | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    setLatest(null);

    const res = await fetch("/api/teacher/class/add-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, name: name.trim() }),
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus("error");
      setError(
        json?.message ??
          (json?.error === "duplicate_name"
            ? "A student with that name already exists in this class."
            : json?.error === "no_active_code"
              ? "This class has no active code yet — create one first."
              : `Could not add student. (${json?.error ?? res.status})`),
      );
      return;
    }

    setLatest({ name: name.trim(), pin: json.pin });
    setName("");
    setStatus("success");
    // Refresh page data (server component re-render).
    setTimeout(() => window.location.reload(), 100);
  }

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-bold uppercase tracking-widest text-[#7C3AED] mb-4">
        Add a student
      </h2>
      <form onSubmit={handleSubmit} className="flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs text-slate-500 mb-1">First name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => { setName(e.target.value.slice(0, 40)); setStatus("idle"); }}
            placeholder="Alex"
            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15"
          />
        </div>
        <button
          type="submit"
          disabled={status === "saving"}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-60"
        >
          {status === "saving" ? "Adding…" : "Add student"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-600 text-sm mt-3">{error}</p>
      )}
      {latest && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#F5F3FF] border border-[#7C3AED]/20 px-4 py-3">
          <span className="text-xl">🎉</span>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">{latest.name} added!</p>
            <p className="text-sm text-slate-600">
              PIN:{" "}
              <span className="font-mono text-xl font-bold tracking-widest text-[#7C3AED]">
                {latest.pin}
              </span>
              <span className="text-xs text-slate-400 ml-2">— give this to your student</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
