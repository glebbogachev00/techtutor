"use client";

// ──────────────────────────────────────────────────────────────────────────
// CosmosBackground — a deep-space hero backdrop: a CSS starfield (zero network
// cost, generated once at mount) with Planet Chroma drifting in the centre.
//
// Performance notes:
//   • Stars are plain DOM dots painted via box-shadow — no images, no canvas,
//     no per-frame work. They twinkle with a cheap CSS opacity animation.
//   • The planet itself is the lazy, self-pausing three.js <Planet> (see
//     Planet.tsx), so three.js never loads until it scrolls into view.
//   • Everything is pointer-events-none and aria-hidden — pure decoration.
//
// Usage: place as the first child of a `relative overflow-hidden` hero, then
// keep the real content in a sibling with `relative z-10`.
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Planet from "@/components/Planet";

type CosmosBackgroundProps = {
  /** Diameter classes for the planet. Default mid-size. */
  planetClassName?: string;
  /** Number of stars to scatter. Default 60. */
  starCount?: number;
};

type Star = {
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

export default function CosmosBackground({
  planetClassName = "w-56 h-56 sm:w-72 sm:h-72",
  starCount = 60,
}: CosmosBackgroundProps) {
  // Generate the random star layer on the client only, after mount. Doing this
  // in an effect (rather than during render) keeps SSR and the first client
  // render identical, avoiding a hydration mismatch from Math.random().
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: starCount }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() < 0.85 ? 1 : 2,
        delay: Math.random() * 4,
        duration: 2.5 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.6,
      })),
    );
  }, [starCount]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none bg-black"
      aria-hidden
    >
      {/* Twinkling starfield */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-[cosmos-twinkle_var(--dur)_ease-in-out_infinite]"
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              "--dur": `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Planet Chroma with its ship orbiting in 3D, off to the right side */}
      <div className="absolute top-1/2 right-[6%] sm:right-[8%] -translate-y-1/2">
        <Planet className={planetClassName} />
      </div>

      <style>{`
        @keyframes cosmos-twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
