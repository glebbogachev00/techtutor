"use client";

import { useState } from "react";
import Image from "next/image";
import { CHARACTERS } from "@/lib/characters";

// Shown to first-time students who haven't picked a character yet.
// Only free heroes are shown — locked ones aren't even displayed.
export default function CharacterOnboardModal() {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const choices = CHARACTERS.filter(
    (c) => c.role === "hero" && c.unlockMissions === 0 && c.id !== "president",
  );

  async function handlePick() {
    if (!selected || saving) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/profile/character", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId: selected }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setSaving(false);
      const json = await res.json().catch(() => ({}));
      setError(json?.message || json?.error || "Could not save. Try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-auto">
        <div className="text-center mb-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#193b92] mb-2">
            Welcome to TechBash!
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mb-2">
            Pick your character
          </h2>
          <p className="text-sm text-slate-500">
            This will be your avatar across the portal. You can change it anytime from your profile.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {choices.map((c) => {
            const isSelected = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`flex flex-col items-center text-center gap-2 rounded-2xl border-2 p-3 sm:p-4 transition
                  ${isSelected
                    ? "border-[#193b92] bg-[#EEF2FF] ring-4 ring-[#193b92]/20 scale-[1.02]"
                    : "border-slate-200 bg-white hover:border-[#193b92]/40 hover:bg-slate-50"
                  }`}
                style={isSelected ? { borderColor: c.theme.accent, background: c.theme.heroBg } : undefined}
              >
                <Image
                  src={c.fullImage}
                  alt={c.name}
                  width={96}
                  height={96}
                  className="h-20 w-20 sm:h-24 sm:w-24 object-contain"
                />
                <div>
                  <p className="text-sm font-black text-[#0F172A]">{c.name}</p>
                  <p className="text-[11px] font-semibold text-slate-500">{c.tagline}</p>
                </div>
                <p className="text-[10px] text-slate-500 leading-snug line-clamp-3 px-1">
                  {c.bio}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handlePick}
            disabled={!selected || saving}
            className="bg-[#193b92] hover:bg-[#2952b8] disabled:opacity-40 text-white font-bold px-8 py-3 rounded-full shadow-lg transition"
          >
            {saving ? "Loading…" : selected ? `Play as ${CHARACTERS.find(c => c.id === selected)?.name}` : "Pick a character"}
          </button>
          <p className="text-[11px] text-slate-400">
            More heroes unlock as you complete missions.
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
