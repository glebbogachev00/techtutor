"use client";

import { useEffect, useState } from "react";

// ── Text-to-speech (free Microsoft Edge neural voices via /api/tts) ──────────
// The browser's built-in speechSynthesis sounds robotic, so we stream real
// neural-voice MP3 from our own /api/tts route (free, no API key). If that ever
// fails we silently fall back to the browser voice so audio never fully breaks.
// Shared across lessons AND adventures/missions so any long story text can be
// read aloud.

function stripForSpeech(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[#_>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Module-level player so only ONE thing speaks at a time across the whole app.
let activeAudio: HTMLAudioElement | null = null;
function stopActiveAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function browserFallbackSpeak(text: string, onEnd: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onEnd();
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  const voice = pickNaturalVoice();
  if (voice) utter.voice = voice;
  utter.rate = 0.95;
  utter.pitch = 1.0;
  utter.onend = onEnd;
  utter.onerror = onEnd;
  window.speechSynthesis.speak(utter);
}

// When the neural voice is unavailable we still want the best-sounding voice the
// device has, not the robotic default. Prefer known-natural macOS / Chrome /
// Edge voices, then any "natural/enhanced/premium" voice, then any en-US voice.
const PREFERRED_FALLBACK_VOICES = [
  "Samantha",
  "Ava (Enhanced)",
  "Ava (Premium)",
  "Ava",
  "Allison",
  "Serena (Enhanced)",
  "Google US English",
  "Microsoft Aria Online (Natural) - English (United States)",
  "Microsoft Jenny Online (Natural) - English (United States)",
];

function pickNaturalVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = en.length ? en : voices;
  for (const name of PREFERRED_FALLBACK_VOICES) {
    const hit = pool.find((v) => v.name === name);
    if (hit) return hit;
  }
  const natural = pool.find((v) => /natural|enhanced|premium/i.test(v.name));
  if (natural) return natural;
  return pool.find((v) => v.lang === "en-US") ?? pool[0];
}

// A small speaker button that reads the given text aloud (tap again to stop).
export function ListenButton({ text, className = "" }: { text: string; className?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");

  useEffect(() => {
    return () => {
      // stop audio if this button unmounts mid-play
      if (state === "playing") stopActiveAudio();
    };
  }, [state]);

  async function play() {
    if (state === "playing" || state === "loading") {
      stopActiveAudio();
      setState("idle");
      return;
    }
    stopActiveAudio();
    const clean = stripForSpeech(text);
    setState("loading");
    try {
      // The free Edge endpoint occasionally hiccups — try twice before we ever
      // drop to the (lower-quality) browser voice, so the neural voice is used
      // as consistently as possible everywhere.
      let res: Response | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: clean }),
          });
          if (res.ok) break;
        } catch {
          res = null;
        }
      }
      if (!res || !res.ok) throw new Error("tts failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      activeAudio = audio;
      const cleanup = () => {
        URL.revokeObjectURL(url);
        if (activeAudio === audio) activeAudio = null;
        setState("idle");
      };
      audio.onended = cleanup;
      audio.onerror = cleanup;
      setState("playing");
      await audio.play();
    } catch {
      // Neural voice unavailable — fall back to the browser voice.
      setState("playing");
      browserFallbackSpeak(clean, () => setState("idle"));
    }
  }

  const playing = state === "playing";
  const loading = state === "loading";

  return (
    <button
      type="button"
      onClick={play}
      aria-label={playing ? "Stop reading" : "Listen to this"}
      title={playing ? "Stop" : loading ? "Loading…" : "Listen"}
      className={`shrink-0 inline-grid place-items-center w-7 h-7 rounded-full border transition-all ${
        playing
          ? "bg-[#193b92] border-[#193b92] text-white"
          : "border-slate-200 text-slate-400 hover:border-[#193b92] hover:text-[#193b92] hover:bg-slate-50"
      } ${className}`}
    >
      {loading ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="animate-spin">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : playing ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 9v6h3l5 4V5L7 9H4z" fill="currentColor" />
          <path
            d="M16 8.5a4 4 0 0 1 0 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
