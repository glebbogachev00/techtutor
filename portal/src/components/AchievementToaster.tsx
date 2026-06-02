"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Achievement, AchievementTier } from "@/lib/achievements";

type Toast = Achievement & { uid: number };

const TIER_IMG: Record<AchievementTier, string> = {
  bronze: "/rewards/bronze.png",
  silver: "/rewards/silver.png",
  gold: "/rewards/gold.png",
};

const TIER_RING: Record<AchievementTier, string> = {
  bronze: "ring-amber-700/30",
  silver: "ring-slate-400/40",
  gold: "ring-yellow-400/50",
};

const TIER_LABEL: Record<AchievementTier, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

let uidCounter = 1;

// Public API: dispatched from anywhere on the client.
//   import { emitAchievement } from "@/components/AchievementToaster";
//   emitAchievement(achievement);
export function emitAchievement(a: Achievement) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tt:achievement", { detail: a }));
}

export function emitAchievements(list: Achievement[] | undefined | null) {
  if (!list || list.length === 0) return;
  list.forEach((a, i) => {
    // Slight stagger so users see each one pop in.
    setTimeout(() => emitAchievement(a), i * 600);
  });
}

export default function AchievementToaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    function onAch(e: Event) {
      const detail = (e as CustomEvent<Achievement>).detail;
      if (!detail) return;
      const uid = uidCounter++;
      setToasts((prev) => [...prev, { ...detail, uid }]);
      // Auto-dismiss after 5s.
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.uid !== uid));
      }, 5000);
    }
    window.addEventListener("tt:achievement", onAch as EventListener);
    return () =>
      window.removeEventListener("tt:achievement", onAch as EventListener);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.uid}
          className={`pointer-events-auto flex items-center gap-3 bg-[#0F172A]/95 text-white pl-2 pr-5 py-2 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.25)] ring-2 ${TIER_RING[t.tier]} backdrop-blur-sm animate-tt-toast-in`}
          role="status"
        >
          <div className="h-11 w-11 rounded-full bg-white/10 grid place-items-center overflow-hidden shrink-0">
            <Image
              src={TIER_IMG[t.tier]}
              alt={`${TIER_LABEL[t.tier]} trophy`}
              width={44}
              height={44}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 leading-tight">
              {TIER_LABEL[t.tier]} unlocked
            </p>
            <p className="text-sm font-bold leading-tight truncate">
              {t.title}
            </p>
            <p className="text-[11px] text-white/70 leading-tight truncate">
              {t.description}
            </p>
          </div>
        </div>
      ))}
      <style jsx global>{`
        @keyframes tt-toast-in {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-tt-toast-in {
          animation: tt-toast-in 220ms ease-out;
        }
      `}</style>
    </div>
  );
}
