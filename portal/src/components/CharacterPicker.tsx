"use client";

import Image from "next/image";
import { useState } from "react";
import { CHARACTERS, CHARACTER_BY_ID } from "@/lib/characters";

interface Props {
  totalMissions: number;
  genaiTrackCompleted: boolean;
  currentCharacterId: string;
  cheatUnlocked?: boolean;
}

export default function CharacterPicker({
  totalMissions,
  genaiTrackCompleted,
  currentCharacterId,
  cheatUnlocked = false,
}: Props) {
  const [selected, setSelected] = useState(currentCharacterId);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function isUnlocked(id: string) {
    if (cheatUnlocked) return true;
    if (id === "president") return genaiTrackCompleted;
    const c = CHARACTER_BY_ID[id];
    return !!c && totalMissions >= c.unlockMissions;
  }

  async function handleSave() {
    if (selected === currentCharacterId) return;
    setSaving(true);
    setError("");
    setSaved(false);
    const res = await fetch("/api/profile/character", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId: selected }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      // Hard navigate (cache-busted) so dashboard + header pick up the new character.
      window.location.href = "/dashboard?c=" + Date.now();
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json?.error === "character_locked" ? "That character isn't unlocked yet." : "Could not save. Try again.");
    }
  }

  const heroes = CHARACTERS.filter((c) => c.role === "hero");
  const villains = CHARACTERS.filter((c) => c.role === "villain");

  return (
    <div className="space-y-5">
      {/* Heroes */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Heroes</p>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {heroes.map((c) => {
            const unlocked = isUnlocked(c.id);
            const isSelected = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => unlocked && setSelected(c.id)}
                disabled={!unlocked}
                title={unlocked ? c.name : c.lockHint}
                className={`relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-2 transition
                  ${isSelected
                    ? "border-[#193b92] bg-[#193b92]/5 ring-2 ring-[#193b92]/20"
                    : unlocked
                      ? "border-slate-200 bg-white hover:border-[#193b92]/40 hover:bg-slate-50"
                      : "border-dashed border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                  }`}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                />
                <span className="text-[10px] font-semibold text-slate-600 truncate w-full text-center">
                  {c.name}
                </span>
                {!unlocked && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60">
                    <span className="text-base">🔒</span>
                  </span>
                )}
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#193b92] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Villains — can be selected once unlocked (kids love playing villain) */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Villains</p>
        <p className="text-[11px] text-slate-400 mb-3">Defeat them first — then steal their look.</p>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {villains.map((c) => {
            const unlocked = isUnlocked(c.id);
            const isSelected = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => unlocked && setSelected(c.id)}
                disabled={!unlocked}
                title={unlocked ? `${c.name} (defeated)` : c.lockHint}
                className={`relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-2 transition
                  ${isSelected
                    ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                    : unlocked
                      ? "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/40"
                      : "border-dashed border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                  }`}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                />
                <span className="text-[10px] font-semibold text-slate-600 truncate w-full text-center">
                  {c.name}
                </span>
                {!unlocked && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60">
                    <span className="text-base">💀</span>
                  </span>
                )}
                {unlocked && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    ☠
                  </span>
                )}
                {isSelected && (
                  <span className="absolute -top-1.5 -left-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handleSave}
          disabled={saving || selected === currentCharacterId}
          className="bg-[#193b92] hover:bg-[#2952b8] disabled:opacity-40 text-white text-sm font-bold px-5 py-2 rounded-full transition"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save character"}
        </button>
        {error && <span className="text-sm text-red-500">{error}</span>}
        {saved && <span className="text-sm text-green-600 font-semibold">Character updated!</span>}
      </div>
    </div>
  );
}
