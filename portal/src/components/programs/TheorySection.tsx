"use client";

import { useState } from "react";

export function TheorySection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] grid place-items-center text-base shrink-0">
            📖
          </div>
          <span className="font-bold text-[color:var(--color-ink)]">{title}</span>
        </div>
        <span className="text-gray-400 text-lg transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }}>
          ›
        </span>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-6 pb-6 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}
