"use client";

import { useState } from "react";
import { QUIZZES } from "./quiz-data";

export function QuizById({ id }: { id: string }) {
  const data = QUIZZES[id];
  const [selected, setSelected] = useState<number | null>(null);

  if (!data) return null;

  const answered = selected !== null;
  const isCorrect = answered && data.options[selected].correct;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 my-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-black uppercase tracking-widest text-[#2C7A7B]">
          Quick check
        </p>
        <span className="xp-pill">+{data.xp ?? 10} XP</span>
      </div>

      <p className="text-sm font-bold text-[#0F172A] mb-4">{data.question}</p>

      <div className="space-y-2">
        {data.options.map((opt, i) => {
          let className =
            "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ";
          let style: React.CSSProperties = { borderColor: "#E2E8F0", background: "#F8FAFC" };

          if (answered) {
            if (opt.correct) {
              style = { borderColor: "#2C7A7B", background: "#F0FDF4" };
            } else if (i === selected) {
              style = { borderColor: "#EF4444", background: "#FEF2F2" };
            }
            className += "cursor-default";
          } else {
            className += "hover:border-[#193b92] hover:bg-[#EFF6FF] cursor-pointer";
          }

          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => setSelected(i)}
              className={className}
              style={style}
            >
              <span className="font-black text-[#193b92] mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`mt-4 px-4 py-3 rounded-xl text-sm font-semibold ${
            isCorrect
              ? "bg-[#F0FDF4] text-[#065F46] border border-[#2C7A7B]/20"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {isCorrect ? "✅ Correct! " : "❌ Not quite — "}
          {data.options[selected!].explanation}
        </div>
      )}
    </div>
  );
}
