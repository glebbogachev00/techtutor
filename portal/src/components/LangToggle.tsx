"use client";

import { useTransition } from "react";

export default function LangToggle({ current }: { current: "en" | "vn" }) {
  const [pending, start] = useTransition();
  async function set(lang: "en" | "vn") {
    if (lang === current || pending) return;
    start(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: lang }),
      });
      window.location.reload();
    });
  }
  return (
    <div className="inline-flex bg-white/15 rounded-full p-1 text-xs font-semibold">
      <button
        onClick={() => set("en")}
        className={`px-3 py-1 rounded-full transition ${
          current === "en" ? "bg-white text-[color:var(--color-teal-dark)]" : "text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => set("vn")}
        className={`px-3 py-1 rounded-full transition ${
          current === "vn" ? "bg-white text-[color:var(--color-teal-dark)]" : "text-white"
        }`}
      >
        VN
      </button>
    </div>
  );
}
