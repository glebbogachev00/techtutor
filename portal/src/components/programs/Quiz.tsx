"use client";

import { useState } from "react";

interface Option { label: string; correct: boolean; explanation?: string }

export function Quiz({ question, options, xp = 10 }: { question: string; options: Option[]; xp?: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = answered && options[selected].correct;

  return (
    <div className="card my-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-teal)" }}>Quick check</span>
        <span className="xp-pill ml-auto">+{xp} XP</span>
      </div>
      <p className="font-bold text-base mb-4" style={{ color: "var(--color-ink)" }}>{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          let style: React.CSSProperties = { borderColor: "#E2E8F0", background: "#F8FAFC" };
          if (answered) {
            if (opt.correct) style = { borderColor: "var(--color-teal)", background: "#ECFDF5" };
            else if (i === selected) style = { borderColor: "#EF4444", background: "#FEF2F2" };
          }
          return (
            <button key={i} disabled={answered}
              onClick={() => setSelected(i)}
              className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all disabled:cursor-default hover:scale-[1.01]"
              style={style}>
              <span className="mr-2 font-black" style={{ color: "var(--color-primary)" }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`mt-4 p-4 rounded-xl text-sm font-semibold ${isCorrect ? "bg-[#ECFDF5] text-[#065F46]" : "bg-[#FEF2F2] text-[#991B1B]"}`}>
          {isCorrect ? "✅ Correct!" : "❌ Not quite —"}{" "}
          {options[selected].explanation ?? (isCorrect ? "Great thinking." : `The correct answer is ${options.find(o => o.correct)?.label}.`)}
        </div>
      )}
    </div>
  );
}
