"use client";

import { useState } from "react";

export default function UnlockCodeInput() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "fail">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setResult("idle");
    const res = await fetch("/api/profile/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim() }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (json?.ok) {
      setResult("success");
      // Reload so the picker unlocks all characters.
      setTimeout(() => window.location.reload(), 800);
    } else {
      setResult("fail");
      setTimeout(() => setResult("idle"), 2000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Enter code…"
        maxLength={32}
        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 tracking-widest font-mono uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <button
        type="submit"
        disabled={loading || !code.trim()}
        className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-700 text-sm font-semibold transition"
      >
        {loading ? "…" : result === "success" ? "✓" : result === "fail" ? "✗" : "Apply"}
      </button>
    </form>
  );
}
