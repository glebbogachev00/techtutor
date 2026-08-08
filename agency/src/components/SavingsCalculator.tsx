"use client";

import { useState } from "react";

const BUILD_COST = 25_000_000;
const PARTNER_MONTHLY = 2_000_000;
const MONTHS = 36;
const USD_RATE = 25_500;

export type CalculatorCopy = {
  eyebrow: string;
  title: string;
  sub: string;
  toolsLabel: string;
  tools: readonly { key: string; label: string; cost: number }[];
  otherLabel: string;
  monthlyLabel: string;
  rentLabel: string;
  rentSub: string;
  ownLabel: string;
  ownSub: string;
  saveLabel: string;
  savePositive: string;
  saveNegative: string;
  cta: string;
  note: string;
};

function fmt(n: number): string {
  const m = n / 1e6;
  const s = m < 10 ? m.toFixed(1).replace(/\.0$/, "") : Math.round(m).toString();
  return `₫${s}M`;
}

export default function SavingsCalculator({ t }: { t: CalculatorCopy }) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(t.tools.filter((tool) => tool.key !== "loyalty").map((tool) => tool.key))
  );
  const [other, setOther] = useState("");

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const otherCost = Math.max(0, parseInt(other.replace(/\D/g, ""), 10) || 0);
  const monthly =
    t.tools.reduce((sum, tool) => (selected.has(tool.key) ? sum + tool.cost : sum), 0) + otherCost;

  const rent = monthly * MONTHS;
  const own = BUILD_COST + PARTNER_MONTHLY * MONTHS;
  const savings = rent - own;
  const max = Math.max(rent, own, 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Tool picker */}
      <div>
        <p className="eyebrow mb-4">{t.toolsLabel}</p>
        <div className="space-y-2">
          {t.tools.map((tool) => {
            const on = selected.has(tool.key);
            return (
              <button
                key={tool.key}
                type="button"
                onClick={() => toggle(tool.key)}
                aria-pressed={on}
                className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                  on
                    ? "border-white/25 bg-white/[0.05]"
                    : "border-white/[0.08] bg-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                    on ? "border-white bg-white text-black" : "border-white/30"
                  }`}
                  aria-hidden
                >
                  {on ? "✓" : ""}
                </span>
                <span className="flex-1 text-sm">{tool.label}</span>
                <span
                  className="text-xs text-[#666]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {fmt(tool.cost)}/mo
                </span>
              </button>
            );
          })}
        </div>
        <label className="mt-4 block">
          <span className="text-xs text-[#a1a1a1]">{t.otherLabel}</span>
          <input
            type="text"
            inputMode="numeric"
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="0"
            className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm outline-none transition focus:border-white/30"
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </label>
      </div>

      {/* Results */}
      <div className="panel p-7">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm text-[#a1a1a1]">{t.monthlyLabel}</p>
          <p className="text-lg font-bold" style={{ fontFamily: "var(--font-mono)" }}>
            {fmt(monthly)}/mo
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <p className="text-sm font-medium text-red-300/80">{t.rentLabel}</p>
              <p className="text-sm font-bold" style={{ fontFamily: "var(--font-mono)" }}>
                {fmt(rent)}
              </p>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-red-400/60 transition-all duration-500"
                style={{ width: `${(rent / max) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-[#666]">{t.rentSub}</p>
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <p className="text-sm font-medium text-emerald-300/80">{t.ownLabel}</p>
              <p className="text-sm font-bold" style={{ fontFamily: "var(--font-mono)" }}>
                {fmt(own)}
              </p>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-400/60 transition-all duration-500"
                style={{ width: `${(own / max) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-[#666]">{t.ownSub}</p>
          </div>
        </div>

        <div className="hairline-t mt-8 pt-6">
          {savings > 0 ? (
            <>
              <p className="text-sm text-[#a1a1a1]">{t.saveLabel}</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                {fmt(savings)}
                <span
                  className="ml-2 text-sm font-normal text-[#666]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ≈ ${Math.round(savings / USD_RATE).toLocaleString("en-US")}
                </span>
              </p>
              <p className="mt-1.5 text-sm text-[#a1a1a1]">{t.savePositive}</p>
            </>
          ) : (
            <p className="text-sm text-[#a1a1a1] leading-relaxed">{t.saveNegative}</p>
          )}
          <a href="#contact" className="btn-white mt-6 w-full justify-center">
            {t.cta} <span aria-hidden>→</span>
          </a>
          <p className="mt-4 text-xs text-[#666] leading-relaxed">{t.note}</p>
        </div>
      </div>
    </div>
  );
}
