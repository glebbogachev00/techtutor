"use client";

import { useState } from "react";

export function Reveal({
  label = "Show answer",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full my-4 py-3 rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-[#193b92] hover:text-[#193b92] transition-all"
      >
        👁️ {label}
      </button>
    );
  }
  return (
    <div className="my-4 rounded-xl border border-[#193b92]/20 bg-[#EFF6FF] px-5 py-4 text-sm leading-7 text-[#0F172A] animate-pop">
      {children}
    </div>
  );
}
