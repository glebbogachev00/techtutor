"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { CHARACTERS, type Quest } from "./missions";
import { runPython } from "./python-runner";
import { ListenButton } from "@/components/ListenButton";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Props = {
  quest: Quest;
  isComplete: boolean;
  onComplete: () => void;
  onBack: () => void;
  onNext?: () => void;
  nextLabel?: string;
};

const SHIP_FEEDBACK: Record<string, string[]> = {
  Bao: [
    "OH MY GOSH. Grandma is going to LOVE this. I owe you a banh mi. Two banh mi.",
    "Wait— this is GOOD. Like real-website good. Grandma will print it out and frame it. She frames everything.",
  ],
  Mochi: [
    "BEEP! The robots are in tears. Happy beep tears! The toaster rule made it in. Mochi is at peace.",
    "BEEP-BOOP! Three rules! Mochi can stop hyperventilating. Mochi was hyperventilating before. Mochi is fine now.",
  ],
  "Captain Pixel": [
    "Reviewed and approved, recruit. Clean work. The client is going to be very happy.",
    "Excellent build. Mission accepted. Pin this one to the Wall of New Builders.",
  ],
  "Professor Loop": [
    "Wonderful! Now I just have to remember to bring this with me. To the — what was I going to — oh yes! The market!",
    "Marvelous. I'd hug the screen but I keep forgetting screens aren't huggable. Thank you, recruit.",
  ],
  "Citizens of the planet": [
    "The citizens are CHEERING. Genuinely. There are like, banners.",
    "The mayor wants to make a statue of you. Probably. We'll see how the budget looks.",
  ],
};

type StartMode = "choose" | "starter" | "scratch";

export default function AdventureWorkspace({
  quest,
  isComplete,
  onComplete,
  onBack,
  onNext,
  nextLabel,
}: Props) {
  const [startMode, setStartMode] = useState<StartMode>("choose");
  const [code, setCode] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [shipped, setShipped] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(
    quest.needs.map(() => false),
  );
  const [helpStep, setHelpStep] = useState(0);
  const [helpNote, setHelpNote] = useState<string | null>(null);

  const isPython = quest.language === "python";
  const pythonOutput = isPython ? runPython(code) : "";

  const speakerName =
    quest.client === "Citizens of the planet" ? "Captain Pixel" : quest.client;
  const speaker = CHARACTERS[speakerName];

  const scaffold = quest.scaffold ?? [];

  function pickStart(mode: "starter" | "scratch") {
    setStartMode(mode);
    setCode(mode === "starter" ? quest.starter : "");
    setHelpStep(0);
    setHelpNote(null);
  }

  function askForHelp() {
    if (helpStep >= scaffold.length) return;
    const next = scaffold[helpStep];
    const trimmed = code.replace(/\s+$/, "");
    const newCode =
      trimmed.length === 0 ? next.line : `${trimmed}\n${next.line}`;
    setCode(newCode);
    setHelpStep(helpStep + 1);
    setHelpNote(next.note);
  }

  function toggleNeed(i: number) {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  }

  function handleShip() {
    setReviewing(true);
    setFeedback(null);
    setShipped(false);
    setTimeout(() => {
      const pool = SHIP_FEEDBACK[speakerName] ?? SHIP_FEEDBACK["Captain Pixel"];
      setFeedback(pool[Math.floor(Math.random() * pool.length)]);
      setShipped(true);
      setReviewing(false);
    }, 900);
  }

  return (
    <div className="space-y-4">
      {/* Planet header */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: quest.accent }}
      >
        <button
          onClick={onBack}
          className="text-xs font-semibold uppercase tracking-widest text-white/80 hover:text-white mb-3 inline-flex items-center gap-1"
        >
          ← Back to map
        </button>
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-14 h-14 rounded-full bg-white/15 grid place-items-center text-2xl font-black tracking-tight">
            {quest.glyph}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
              Adventure · {quest.planet}
            </p>
            <h2 className="text-2xl font-bold leading-tight">
              {quest.tagline}
            </h2>
          </div>
          <div className="hidden sm:flex flex-col items-end shrink-0">
            <span className="text-[11px] uppercase tracking-widest text-white/70">
              Reward
            </span>
            <span className="text-xl font-bold">+{quest.reward} XP</span>
          </div>
        </div>
      </div>

      {/* Brief from the client */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <div className="flex items-start gap-4">
          <img
            src={speaker.avatar}
            alt={speakerName}
            className="shrink-0 w-14 h-14 rounded-full shadow-[0_2px_10px_rgba(15,23,42,0.08)] object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="font-bold text-[#0F172A]">{speakerName}</span>
              <span className="text-xs text-slate-400">
                {quest.client === "Citizens of the planet"
                  ? `Speaking for the citizens of ${quest.planet}`
                  : speaker.role}
              </span>
            </div>
            <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-line pr-9">
              {quest.brief}
            </p>
          </div>
          <ListenButton text={quest.brief} className="mt-1" />
        </div>
      </div>

      {/* Acceptance criteria */}
      <div className="rounded-xl bg-[#F0F9F8] border border-[#2C7A7B]/20 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#2C7A7B] mb-3">
          The build needs
        </p>
        <ul className="space-y-2">
          {quest.needs.map((n, i) => (
            <li key={i} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggleNeed(i)}
                aria-label={
                  checked[i] ? `Uncheck: ${n}` : `Mark done: ${n}`
                }
                className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 grid place-items-center transition ${
                  checked[i]
                    ? "bg-[#2C7A7B] border-[#2C7A7B] text-white"
                    : "bg-white border-slate-300 hover:border-[#2C7A7B]"
                }`}
              >
                {checked[i] && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M2.5 6.5L5 9L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span
                className={`text-sm leading-relaxed ${
                  checked[i] ? "text-slate-400 line-through" : "text-[#0F172A]"
                }`}
              >
                {n}
              </span>
            </li>
          ))}
        </ul>
        {quest.hint && (
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-600">Hint:</span>{" "}
            {quest.hint}
          </p>
        )}
      </div>

      {/* Start-mode picker */}
      {startMode === "choose" ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
            How do you want to start?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => pickStart("starter")}
              className="text-left rounded-xl border border-slate-200 hover:border-[#193b92] hover:bg-[#193b92]/[0.03] transition p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: quest.accent }}
                >
                  Use the starter
                </span>
              </div>
              <p className="text-sm text-[#0F172A] leading-snug">
                Begin with some code already written. Read it, then add or fix
                what's missing.
              </p>
            </button>
            <button
              onClick={() => pickStart("scratch")}
              className="text-left rounded-xl border border-slate-200 hover:border-[#193b92] hover:bg-[#193b92]/[0.03] transition p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Start from scratch
                </span>
                {scaffold.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Help available
                  </span>
                )}
              </div>
              <p className="text-sm text-[#0F172A] leading-snug">
                Blank canvas. If you get stuck, ask {speakerName} for help — one
                line at a time.
              </p>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Editor controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setStartMode("choose")}
              className="text-xs font-semibold text-slate-500 hover:text-[#0F172A] px-3 py-2 rounded-full"
            >
              ← Change start
            </button>
            <span className="text-xs text-slate-400">
              {startMode === "scratch" ? "Blank canvas" : "Starter code loaded"}
            </span>
            {scaffold.length > 0 && (
              <button
                onClick={askForHelp}
                disabled={helpStep >= scaffold.length}
                className="ml-auto inline-flex items-center gap-2 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: quest.accent,
                  boxShadow: `0 4px 15px ${quest.accent}40`,
                }}
              >
                <img
                  src={speaker.avatar}
                  alt=""
                  aria-hidden
                  className="w-6 h-6 rounded-full -ml-2 ring-2 ring-white object-cover"
                />
                {helpStep >= scaffold.length
                  ? `${speakerName} has no more tips`
                  : helpStep === 0
                  ? `Ask ${speakerName} for help`
                  : `Next line (${helpStep}/${scaffold.length})`}
              </button>
            )}
          </div>

          {/* Editor + preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
              <div className="px-4 py-2 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Code</span>
                <span className="text-slate-400">
                  {isPython ? "main.py" : "index.html"}
                </span>
              </div>
              <Editor
                height="360px"
                language={isPython ? "python" : "html"}
                theme="vs"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              tabSize: isPython ? 4 : 2,
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white flex flex-col">
              <div className="px-4 py-2 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>{isPython ? "Output" : "Preview"}</span>
                <span className="flex items-center gap-1.5 text-[#2C7A7B]">
                  <span className="w-1.5 h-1.5 bg-[#2C7A7B] rounded-full" />
                  Live
                </span>
              </div>
              {isPython ? (
                <pre className="w-full h-[360px] p-4 text-sm font-mono text-[#0F172A] bg-[#0F172A]/[0.03] overflow-auto whitespace-pre-wrap">
                  {pythonOutput}
                </pre>
              ) : (
                <iframe
                  title="Live preview"
                  sandbox="allow-scripts"
                  srcDoc={code}
                  className="w-full h-[360px] bg-white"
                />
              )}
            </div>
          </div>

          {/* Help note from the client/character */}
          {helpNote && (
            <div
              className="rounded-2xl border p-4"
              style={{
                background: `${quest.accent}0D`,
                borderColor: `${quest.accent}33`,
              }}
            >
              <div className="flex items-start gap-3">
                <img
                  src={speaker.avatar}
                  alt={speakerName}
                  className="shrink-0 w-9 h-9 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-widest mb-1"
                    style={{ color: quest.accent }}
                  >
                    {speakerName} · explains
                  </p>
                  <p className="text-sm leading-relaxed text-[#0F172A]">
                    {helpNote}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleShip}
              disabled={reviewing}
              className="text-white font-semibold text-sm px-7 py-3 rounded-full transition disabled:opacity-60 disabled:cursor-wait"
              style={{
                background: quest.accent,
                boxShadow: `0 4px 15px ${quest.accent}40`,
              }}
            >
              {reviewing ? "Sending to client..." : "Ship it to the client"}
            </button>
            <button
              onClick={() => {
                setCode(startMode === "scratch" ? "" : quest.starter);
                setHelpStep(0);
                setHelpNote(null);
              }}
              className="text-sm font-semibold text-slate-500 hover:text-[#0F172A] px-4 py-3"
            >
              Reset code
            </button>
            {shipped && !isComplete && (
              <button
                onClick={onComplete}
                className="ml-auto bg-[#2C7A7B] hover:bg-[#234E52] text-white font-semibold text-sm px-6 py-3 rounded-full transition"
              >
                Claim reward · +{quest.reward} XP
              </button>
            )}
            {isComplete && (
              <span className="ml-auto flex items-center gap-3">
                <span className="text-sm font-semibold text-[#2C7A7B]">
                  Quest complete
                </span>
                {onNext && (
                  <button
                    onClick={onNext}
                    className="bg-[#193b92] hover:bg-[#0f2861] text-white font-semibold text-sm px-6 py-3 rounded-full transition"
                  >
                    {nextLabel ?? "Next adventure →"}
                  </button>
                )}
              </span>
            )}
          </div>

          {feedback && (
            <div
              className="rounded-2xl border p-5"
              style={{
                background: `${quest.accent}0D`,
                borderColor: `${quest.accent}33`,
              }}
            >
              <div className="flex items-start gap-3">
                <img
                  src={speaker.avatar}
                  alt={speakerName}
                  className="shrink-0 w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: quest.accent }}
                  >
                    {speakerName} · Client review
                  </p>
                  <p className="text-[#0F172A] text-sm leading-relaxed">
                    {feedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
