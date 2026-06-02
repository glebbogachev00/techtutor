"use client";

import { useState } from "react";

interface Props {
  classId: string;
  studentId: string;
  studentName: string;
}

export default function RemoveStudentButton({ classId, studentId, studentName }: Props) {
  const [status, setStatus] = useState<"idle" | "confirming" | "removing">("idle");

  async function handleRemove() {
    setStatus("removing");
    await fetch("/api/teacher/class/remove-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, studentId }),
    });
    window.location.reload();
  }

  if (status === "confirming") {
    return (
      <span className="flex items-center gap-1">
        <span className="text-xs text-slate-500">Remove {studentName}?</span>
        <button
          onClick={handleRemove}
          className="text-xs text-red-600 font-semibold hover:underline ml-1"
        >
          Yes
        </button>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs text-slate-500 hover:underline"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setStatus("confirming")}
      disabled={status === "removing"}
      className="text-xs text-slate-400 hover:text-red-500 transition disabled:opacity-40"
      title="Remove student"
    >
      {status === "removing" ? "…" : "✕"}
    </button>
  );
}
