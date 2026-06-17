"use client";

import { useState } from "react";

export function Reveal({ label = "Show answer", children }: { label?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-4">
      {!open ? (
        <button onClick={() => setOpen(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed text-sm font-bold transition-all hover:scale-[1.01]"
          style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)", background: "#EFF6FF" }}>
          👁️ {label}
        </button>
      ) : (
        <div className="rounded-xl p-4 text-sm leading-7 animate-pop"
          style={{ background: "#EFF6FF", border: "2px solid var(--color-primary)", color: "var(--color-ink)" }}>
          {children}
        </div>
      )}
    </div>
  );
}
