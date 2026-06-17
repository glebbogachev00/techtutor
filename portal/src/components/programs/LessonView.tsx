"use client";

import { useEffect, useState } from "react";
import { CHARACTER_BY_ID } from "@/lib/characters";
import { QuizById } from "./QuizById";
import { ListenButton } from "@/components/ListenButton";
import type { LessonBlock, LessonPart, RichLesson } from "@/lib/lesson-content";

type ChatTurn = { role: "user" | "assistant"; content: string };

interface Props {
  lesson: RichLesson;
  programSlug: string;
  lessonSlug: string;
  xp: number;
  nextHref: string;
  alreadyDone: boolean;
}

// ── Inline emphasis renderer (safe — builds React nodes, no innerHTML) ──────
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(regex);
  parts.forEach((part, i) => {
    if (!part) return;
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={i} className="font-bold text-[#0F172A]">
          {part.slice(2, -2)}
        </strong>,
      );
    } else if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code
          key={i}
          className="text-[0.8em] px-1.5 py-0.5 rounded-md font-mono font-semibold bg-slate-100 text-[#193b92]"
        >
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part.startsWith("*") && part.endsWith("*")) {
      nodes.push(
        <em key={i} className="italic text-[#2C7A7B]">
          {part.slice(1, -1)}
        </em>,
      );
    } else {
      nodes.push(part);
    }
  });
  return nodes;
}

// Render a chat message with formatting: each line on its own row, numbered/
// bulleted lines get hanging indent, and **bold**/*italic*/`code` are honoured.
function renderChatMessage(text: string): React.ReactNode {
  const lines = text.replace(/\r/g, "").split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (trimmed === "") return <div key={i} className="h-2" aria-hidden />;
    const listMatch = /^(\d+\.|[-*•])\s+(.*)$/.exec(trimmed);
    if (listMatch) {
      const [, marker, rest] = listMatch;
      const bullet = /^\d+\.$/.test(marker) ? marker : "•";
      return (
        <div key={i} className="flex gap-2 leading-relaxed">
          <span className="shrink-0 font-semibold text-[#193b92]">{bullet}</span>
          <span className="min-w-0">{renderInline(rest)}</span>
        </div>
      );
    }
    return (
      <div key={i} className="leading-relaxed">
        {renderInline(line)}
      </div>
    );
  });
}

// ── Text-to-speech (free Microsoft Edge neural voices via /api/tts) ──────────
// The browser's built-in speechSynthesis sounds robotic, so we stream real
// ── Text-to-speech (free Microsoft Edge neural voices via /api/tts) ──────────
// ListenButton now lives in @/components/ListenButton so lessons AND the
// adventure/mission workspaces can share one neural-voice player.

const CALLOUT_STYLES = {
  story: { bg: "bg-slate-50", bar: "#193b92", label: "Story" },
  tip: { bg: "bg-slate-50", bar: "#2C7A7B", label: "Tip" },
  warning: { bg: "bg-slate-50", bar: "#193b92", label: "Watch out" },
  info: { bg: "bg-slate-50", bar: "#64748B", label: "Note" },
  key: { bg: "bg-slate-50", bar: "#2C7A7B", label: "Key idea" },
  teacher: { bg: "bg-slate-50", bar: "#0F172A", label: "Teacher" },
} as const;

const DIFFICULTY = {
  easy: { label: "Easy", color: "#2C7A7B" },
  medium: { label: "Medium", color: "#193b92" },
  hard: { label: "Hard", color: "#0F172A" },
} as const;

// ── A single Reveal (kept local so we can pass plain string body) ───────────
function RevealBlock({ label, body }: { label: string; body: string }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full my-2 py-3 rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-[#193b92] hover:text-[#193b92] transition-all"
      >
        👁️ {label}
      </button>
    );
  }
  return (
    <div className="my-2 rounded-xl border border-[#193b92]/20 bg-[#EFF6FF] px-5 py-4 text-sm leading-7 text-[#0F172A] animate-pop">
      {renderInline(body)}
    </div>
  );
}

// ── Explore checklist ───────────────────────────────────────────────────────
function ExploreBlock({
  title,
  intro,
  tasks,
}: {
  title: string;
  intro?: string;
  tasks: { label: string; detail?: string; href?: string }[];
}) {
  const [done, setDone] = useState<boolean[]>(() => tasks.map(() => false));
  const completed = done.filter(Boolean).length;
  const pct = Math.round((completed / tasks.length) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 bg-[#0F172A] text-white">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg">🧭</span>
          <span className="font-bold text-sm uppercase tracking-wider flex-1">{title}</span>
          <span className="text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded-full">
            {completed}/{tasks.length} done
          </span>
        </div>
        {intro && <p className="text-sm text-white/80 mt-2 leading-relaxed">{intro}</p>}
        <div className="h-1.5 rounded-full bg-white/15 overflow-hidden mt-3">
          <div
            className="h-full rounded-full bg-[#2C7A7B] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="divide-y divide-slate-100">
        {tasks.map((t, i) => (
          <li key={i} className="flex items-start gap-3 px-5 py-3.5">
            <button
              onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
              aria-pressed={done[i]}
              className={`mt-0.5 shrink-0 w-6 h-6 rounded-md border-2 grid place-items-center text-xs font-black transition-all ${
                done[i]
                  ? "bg-[#2C7A7B] border-[#2C7A7B] text-white"
                  : "border-slate-300 text-transparent hover:border-[#2C7A7B]"
              }`}
            >
              ✓
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold ${
                  done[i] ? "text-slate-400 line-through" : "text-[#0F172A]"
                }`}
              >
                {t.label}
              </p>
              {t.detail && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.detail}</p>}
            </div>
            {t.href && (
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-bold text-[#193b92] hover:underline whitespace-nowrap mt-0.5"
              >
                Open ↗
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── AI chat (mirrors LessonWorkspace behaviour) ─────────────────────────────
function ChatBlock({
  intro,
  starterPrompt,
  goal,
}: {
  intro?: string;
  starterPrompt?: string;
  goal?: string;
}) {
  const [prompt, setPrompt] = useState(starterPrompt ?? "");
  const [chat, setChat] = useState<ChatTurn[]>([]);
  const [sending, setSending] = useState(false);

  async function send() {
    const text = prompt.trim();
    if (!text || sending) return;
    setSending(true);
    const nextChat: ChatTurn[] = [...chat, { role: "user", content: text }];
    setChat(nextChat);
    setPrompt("");
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextChat.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setChat((c) => [
          ...c,
          { role: "assistant", content: `🔒 ${data?.message ?? "Sign in to chat with the AI."}` },
        ]);
        return;
      }
      const reply = data?.reply || data?.error || "The AI didn't reply. Try again in a moment.";
      setChat((c) => [...c, { role: "assistant", content: reply }]);
    } catch {
      setChat((c) => [...c, { role: "assistant", content: "Something broke. Try again in a moment." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
        <span>AI Chat</span>
        <span className="flex items-center gap-1.5 text-[#193b92]">
          <span className="w-1.5 h-1.5 bg-[#193b92] rounded-full" />
          Live
        </span>
      </div>
      {intro && <p className="px-4 pt-3 text-xs text-slate-500 leading-relaxed">{intro}</p>}
      <div className="max-h-[340px] overflow-auto p-4 space-y-3">
        {chat.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">
            Your conversation will show up here.
          </p>
        )}
        {chat.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-br-sm bg-[#193b92] text-white text-sm px-4 py-2 whitespace-pre-wrap"
                  : "max-w-[80%] rounded-2xl rounded-bl-sm bg-slate-50 border border-slate-200 text-[#0F172A] text-sm px-4 py-2 whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-sm px-4 py-2">
              AI is thinking…
            </div>
          </div>
        )}
      </div>
      {goal && (
        <p className="px-4 pb-1 text-[11px] text-[#193b92]">
          <span className="font-bold">Goal:</span> {goal}
        </p>
      )}
      <div className="border-t border-slate-200 p-3 flex items-end gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              send();
            }
          }}
          rows={3}
          placeholder="Type your prompt…  (⌘/Ctrl + Enter to send)"
          className="flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#193b92]/30"
        />
        <button
          onClick={send}
          disabled={sending || !prompt.trim()}
          className="bg-[#193b92] hover:bg-[#14306f] text-white font-semibold text-sm px-5 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(25,59,146,0.25)]"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}

// ── Always-on floating Professor Loop chat ──────────────────────────────────
// Same UI as the Generative AI course (preview workspace): a circular avatar
// launcher bottom-right + purple-header panel. Lives on every lesson so the AI
// is one tap away for every exercise. Buttons inside the lesson can pop it open
// by dispatching the `open-professor-loop` window event. If the API errors out
// (e.g. free-tier token quota), it shows quick links to external AIs so kids
// are never left at a dead end.
const FALLBACK_AIS = [
  { name: "ChatGPT", href: "https://chatgpt.com" },
  { name: "Claude", href: "https://claude.ai" },
  { name: "Gemini", href: "https://gemini.google.com" },
];

const PROFESSOR_LOOP_EVENT = "open-professor-loop";

function FloatingChat({ programSlug }: { programSlug: string }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState<ChatTurn[]>([]);
  const [sending, setSending] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    function handleOpen(e: Event) {
      setOpen(true);
      const seed = (e as CustomEvent<string>).detail;
      if (seed) setPrompt(seed);
    }
    window.addEventListener(PROFESSOR_LOOP_EVENT, handleOpen);
    return () => window.removeEventListener(PROFESSOR_LOOP_EVENT, handleOpen);
  }, []);

  async function send() {
    const text = prompt.trim();
    if (!text || sending) return;
    setSending(true);
    const nextChat: ChatTurn[] = [...chat, { role: "user", content: text }];
    setChat(nextChat);
    setPrompt("");
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programSlug,
          messages: nextChat.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setChat((c) => [
          ...c,
          { role: "assistant", content: data?.message ?? "Sign in to chat with Professor Loop." },
        ]);
        return;
      }
      if (res.status === 429) {
        setChat((c) => [
          ...c,
          { role: "assistant", content: data?.message ?? "That's enough AI magic for today — come back tomorrow!" },
        ]);
        return;
      }
      if (!res.ok || !data?.reply) {
        setShowFallback(true);
        setChat((c) => [
          ...c,
          {
            role: "assistant",
            content:
              "I'm taking a quick breather (it happens!). Use a button above to finish your prompt in another AI, then come back.",
          },
        ]);
        return;
      }
      setChat((c) => [...c, { role: "assistant", content: data.reply }]);
    } catch {
      setShowFallback(true);
      setChat((c) => [
        ...c,
        {
          role: "assistant",
          content: "Couldn't reach me right now. Use a button above to finish in another AI, then come back.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating Professor Loop avatar launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-[0_8px_30px_rgba(25,59,146,0.35)] hover:shadow-[0_8px_40px_rgba(25,59,146,0.45)] transition-all hover:scale-110 z-50"
        title="Ask Professor Loop"
        aria-expanded={open}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/characters/professor-loop.png"
          alt="Professor Loop"
          className="w-full h-full rounded-full border-4 border-white"
        />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-[min(384px,calc(100vw-3rem))] rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)] z-50">
          <div className="px-4 py-2 border-b border-slate-200 bg-[#193b92] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/characters/professor-loop.png"
                alt="Professor Loop"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="text-sm font-bold text-white">Professor Loop</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-slate-200 text-xl leading-none"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {showFallback && (
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500">Try it in:</span>
              {FALLBACK_AIS.map((ai) => (
                <a
                  key={ai.name}
                  href={ai.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#193b92] bg-white border border-slate-200 rounded-full px-2.5 py-1 hover:border-[#193b92] transition"
                >
                  {ai.name} ↗
                </a>
              ))}
            </div>
          )}

          <div className="max-h-[360px] overflow-auto p-4 space-y-3 bg-[#FAFAFA]">
            {chat.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6 px-2 leading-relaxed">
                Your studio. Paste any exercise prompt here, hit send, and keep tweaking one
                thing at a time.
              </p>
            )}
            {chat.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl rounded-br-sm bg-[#193b92] text-white text-sm px-4 py-2 whitespace-pre-wrap"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-white border border-slate-200 text-[#0F172A] text-sm px-4 py-2.5 space-y-0.5"
                  }
                >
                  {m.role === "user" ? m.content : renderChatMessage(m.content)}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white border border-slate-200 text-slate-400 text-sm px-4 py-2">
                  Professor Loop is thinking…
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-3 flex items-end gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={3}
              placeholder="Type your prompt… (Enter to send)"
              className="flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#193b92]/30"
            />
            <button
              onClick={send}
              disabled={sending || !prompt.trim()}
              className="bg-[#193b92] hover:bg-[#14306f] text-white font-semibold text-sm px-5 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(25,59,146,0.25)]"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Pop open the floating Professor Loop chat (optionally seeding the input). */
function openProfessorLoop(seed?: string) {
  window.dispatchEvent(new CustomEvent(PROFESSOR_LOOP_EVENT, { detail: seed }));
}

// ── Hands-on exercise card (mission style) ──────────────────────────────────
function ExerciseBlock({
  difficulty,
  title,
  speakerId,
  storyBeat,
  instructions,
  hint,
  successCriteria,
  xp,
}: {
  difficulty: "easy" | "medium" | "hard";
  title: string;
  speakerId: string;
  storyBeat: string;
  instructions: string[];
  hint: string;
  successCriteria: string;
  xp: number;
}) {
  const d = DIFFICULTY[difficulty];
  const char = CHARACTER_BY_ID[speakerId];
  const [open, setOpen] = useState(true);
  const [hintOpen, setHintOpen] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div
      className={`rounded-2xl bg-white border transition shadow-[0_4px_20px_rgba(15,23,42,0.04)] ${
        open ? "border-slate-300" : "border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        <div
          className="shrink-0 w-11 h-11 rounded-full grid place-items-center text-white font-black text-sm shadow-[0_4px_15px_rgba(15,23,42,0.18)]"
          style={{ background: done ? "#2C7A7B" : d.color }}
        >
          {done ? "✓" : <span className="w-2 h-2 rounded-full bg-white/90" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-[10px] font-bold uppercase tracking-widest text-white px-2 py-0.5 rounded-full"
              style={{ background: d.color }}
            >
              {d.label}
            </span>
            {done && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C7A7B]">
                · Done
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-[#0F172A] leading-tight">{title}</h3>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">XP</div>
          <div className="text-base font-bold" style={{ color: d.color }}>+{xp}</div>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 -mt-1 space-y-4">
          {/* Story beat from the character */}
          {char && (
            <div className="relative rounded-xl bg-slate-50 border border-slate-200 p-4">
              <ListenButton
                text={`${storyBeat} Steps: ${instructions.join(". ")}. Done when: ${successCriteria}`}
                className="absolute top-3 right-3"
              />
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={char.image}
                  alt={char.name}
                  className="shrink-0 w-9 h-9 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0 pr-9">
                  <p className="text-[11px] font-semibold text-[#0F172A] mb-0.5">{char.name}</p>
                  <p className="text-sm text-slate-700 italic leading-relaxed">{storyBeat}</p>
                </div>
              </div>
            </div>
          )}

          {/* Steps */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Steps
            </p>
            <ol className="space-y-2">
              {instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: d.color }}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{renderInline(step)}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Hint + open Professor Loop */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => setHintOpen(!hintOpen)}
              className="text-xs font-semibold underline"
              style={{ color: d.color }}
            >
              {hintOpen ? "Hide hint" : "Show hint"}
            </button>
            <button
              type="button"
              onClick={() => openProfessorLoop()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#193b92] hover:text-[#14306f] transition"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/characters/professor-loop.png"
                alt=""
                className="w-5 h-5 rounded-full border border-white shadow-sm"
              />
              Ask Professor Loop
            </button>
          </div>
          {hintOpen && (
            <div className="-mt-1 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-[#0F172A]">
              {renderInline(hint)}
            </div>
          )}

          {/* Done */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-[#0F172A]">Done when:</span> {successCriteria}
            </p>
            {!done ? (
              <button
                type="button"
                onClick={() => setDone(true)}
                className="shrink-0 rounded-full px-5 py-2 text-xs font-bold text-white shadow-[0_4px_15px_rgba(15,23,42,0.18)] hover:opacity-90 transition"
                style={{ background: d.color }}
              >
                Mark done
              </button>
            ) : (
              <span className="shrink-0 text-xs font-bold text-[#2C7A7B]">+{xp} XP</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Boss fight card (the end-of-lesson showdown) ────────────────────────────
function BossBlock({
  title,
  speakerId,
  storyBeat,
  challenge,
  steps,
  successCriteria,
  reward,
  xp,
}: {
  title: string;
  speakerId: string;
  storyBeat: string;
  challenge: string;
  steps?: string[];
  successCriteria: string;
  reward: string;
  xp: number;
}) {
  const villain = CHARACTER_BY_ID[speakerId];
  const accent = villain?.theme?.accent ?? "#DC2626";
  const [done, setDone] = useState(false);

  return (
    <div className="rounded-3xl overflow-hidden border-2 shadow-[0_8px_30px_rgba(15,23,42,0.12)]" style={{ borderColor: accent }}>
      {/* Dramatic header */}
      <div className="px-6 py-5 text-white" style={{ background: `linear-gradient(135deg, #0F172A 0%, ${accent} 120%)` }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/15 px-3 py-1 rounded-full">
            Boss Fight
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
            +{xp} XP
          </span>
        </div>
        <h3 className="text-2xl font-extrabold leading-tight">{title}</h3>
        {villain && (
          <div className="flex items-start gap-3 mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={villain.image}
              alt={villain.name}
              className="shrink-0 w-12 h-12 rounded-full object-cover ring-2 ring-white/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white/90 mb-0.5">{villain.name}</p>
              <p className="text-sm text-white/80 italic leading-relaxed">{storyBeat}</p>
            </div>
            <ListenButton
              text={`${title}. ${storyBeat} The challenge: ${challenge}${
                steps && steps.length ? `. How to win: ${steps.join(". ")}` : ""
              }`}
              className="!border-white/40 !text-white hover:!bg-white/15 hover:!border-white"
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="bg-white px-6 py-5 space-y-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: accent }}>
            The challenge
          </p>
          <p className="text-sm leading-7 text-[#0F172A]">{renderInline(challenge)}</p>
        </div>

        {steps && steps.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
              How to win
            </p>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: accent }}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{renderInline(step)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-[#0F172A]">Win when:</span> {successCriteria}
          </p>
          {!done ? (
            <button
              type="button"
              onClick={() => setDone(true)}
              className="shrink-0 rounded-full px-5 py-2 text-xs font-bold text-white shadow-[0_4px_15px_rgba(15,23,42,0.18)] hover:opacity-90 transition"
              style={{ background: accent }}
            >
              Claim victory
            </button>
          ) : (
            <span className="shrink-0 text-xs font-bold" style={{ color: accent }}>
              Defeated · +{xp} XP
            </span>
          )}
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Reward
          </span>
          <span className="text-sm font-bold text-[#0F172A]">{reward}</span>
        </div>
      </div>
    </div>
  );
}

// ── Homework checklist ──────────────────────────────────────────────────────
function HomeworkBlock({
  title,
  intro,
  tasks,
  bonus,
}: {
  title: string;
  intro?: string;
  tasks: string[];
  bonus?: string;
}) {
  const [done, setDone] = useState<boolean[]>(() => tasks.map(() => false));
  const completed = done.filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 bg-[#193b92] text-white">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm uppercase tracking-wider flex-1">{title}</span>
          <ListenButton
            text={`${title}. ${intro ?? ""} ${tasks.join(". ")}`}
            className="!border-white/40 !text-white hover:!bg-white/15 hover:!border-white"
          />
          <span className="text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded-full">
            {completed}/{tasks.length} done
          </span>
        </div>
        {intro && <p className="text-sm text-white/80 mt-2 leading-relaxed">{intro}</p>}
      </div>
      <ul className="divide-y divide-slate-100">
        {tasks.map((t, i) => (
          <li key={i} className="flex items-start gap-3 px-5 py-3.5">
            <button
              onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
              aria-pressed={done[i]}
              className={`mt-0.5 shrink-0 w-6 h-6 rounded-md border-2 grid place-items-center text-xs font-black transition-all ${
                done[i]
                  ? "bg-[#2C7A7B] border-[#2C7A7B] text-white"
                  : "border-slate-300 text-transparent hover:border-[#2C7A7B]"
              }`}
            >
              ✓
            </button>
            <p
              className={`flex-1 text-sm font-semibold leading-relaxed ${
                done[i] ? "text-slate-400 line-through" : "text-[#0F172A]"
              }`}
            >
              {renderInline(t)}
            </p>
          </li>
        ))}
      </ul>
      {bonus && (
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-[11px] font-black uppercase tracking-widest text-[#2C7A7B] mb-1">
            Bonus quest
          </p>
          <p className="text-sm leading-7 text-[#0F172A]">{renderInline(bonus)}</p>
        </div>
      )}
    </div>
  );
}

// ── "I built this" capstone ─────────────────────────────────────────────────
// The payoff of every lesson: assemble the pieces made along the way into one
// small, real, shareable thing. Tapping "I built it!" earns the brag line + XP.
function BuildBlock({
  title,
  tagline,
  intro,
  deliverables,
  shipWhen,
  shareAs,
  xp,
}: {
  title: string;
  tagline: string;
  intro?: string;
  deliverables: string[];
  shipWhen: string;
  shareAs?: string;
  xp: number;
}) {
  const [done, setDone] = useState<boolean[]>(() => deliverables.map(() => false));
  const [shipped, setShipped] = useState(false);
  const built = done.filter(Boolean).length;
  const allReady = built === deliverables.length;

  return (
    <div
      className={`rounded-3xl overflow-hidden border-2 shadow-[0_8px_30px_rgba(25,59,146,0.15)] transition ${
        shipped ? "border-[#2C7A7B]" : "border-[#193b92]"
      }`}
    >
      {/* Header */}
      <div
        className="px-6 py-5 text-white"
        style={{
          background: shipped
            ? "linear-gradient(135deg, #234E52 0%, #2C7A7B 120%)"
            : "linear-gradient(135deg, #14306f 0%, #193b92 120%)",
        }}
      >
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/15 px-3 py-1 rounded-full">
            🚀 Ship It
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
            +{xp} XP
          </span>
          <ListenButton
            text={`${title}. ${intro ?? ""} Build these: ${deliverables.join(
              ". ",
            )}. You've shipped it when: ${shipWhen}`}
            className="ml-auto !border-white/40 !text-white hover:!bg-white/15 hover:!border-white"
          />
        </div>
        <h3 className="text-2xl font-extrabold leading-tight">{title}</h3>
        {intro && <p className="text-sm text-white/85 mt-2 leading-relaxed">{intro}</p>}
      </div>

      {/* Body */}
      <div className="bg-white px-6 py-5 space-y-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-[#193b92] mb-2">
            What goes in it
          </p>
          <ul className="space-y-2">
            {deliverables.map((d, i) => (
              <li key={i} className="flex items-start gap-3">
                <button
                  onClick={() => setDone((arr) => arr.map((v, j) => (j === i ? !v : v)))}
                  aria-pressed={done[i]}
                  className={`mt-0.5 shrink-0 w-6 h-6 rounded-md border-2 grid place-items-center text-xs font-black transition-all ${
                    done[i]
                      ? "bg-[#193b92] border-[#193b92] text-white"
                      : "border-slate-300 text-transparent hover:border-[#193b92]"
                  }`}
                >
                  ✓
                </button>
                <p
                  className={`flex-1 text-sm leading-relaxed ${
                    done[i] ? "text-slate-400 line-through" : "text-[#0F172A]"
                  }`}
                >
                  {renderInline(d)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
          <p className="text-xs text-[#0F172A] leading-relaxed">
            <span className="font-bold text-[#193b92]">Shipped when:</span> {shipWhen}
          </p>
          {shareAs && (
            <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
              <span className="font-bold">Show it off:</span> {shareAs}
            </p>
          )}
        </div>

        {!shipped ? (
          <button
            type="button"
            onClick={() => setShipped(true)}
            disabled={!allReady}
            className="w-full rounded-full py-3 text-sm font-black text-white shadow-[0_6px_20px_rgba(25,59,146,0.3)] transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #14306f 0%, #193b92 120%)" }}
          >
            {allReady ? "🚀 I built it!" : `Check off all ${deliverables.length} pieces to ship`}
          </button>
        ) : (
          <div className="rounded-2xl bg-[#F0FDFA] border-2 border-[#2C7A7B]/30 px-5 py-4 text-center animate-pop">
            <p className="text-3xl mb-1">🎉</p>
            <p className="text-base font-black text-[#234E52]">{tagline}</p>
            <p className="text-xs font-bold text-[#2C7A7B] mt-1">+{xp} XP · You shipped it.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Block dispatcher ────────────────────────────────────────────────────────
function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "text":
      return (
        <div className="group relative rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          <ListenButton
            text={block.heading ? `${block.heading}. ${block.body}` : block.body}
            className="absolute top-3 right-3"
          />
          {block.heading && (
            <h3 className="text-base font-bold text-[#0F172A] mb-2 pr-9">{block.heading}</h3>
          )}
          <p className="text-[15px] leading-7 text-slate-600 pr-9">{renderInline(block.body)}</p>
        </div>
      );

    case "callout": {
      const s = CALLOUT_STYLES[block.variant];
      // Teacher cues get a distinct dashed "side note" look so they read as
      // guidance for the room, not part of the student's story.
      if (block.variant === "teacher") {
        return (
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-4">
            <p className="text-[11px] font-black uppercase tracking-widest mb-1.5 text-slate-500">
              {block.title ?? s.label}
            </p>
            <p className="text-sm leading-7 text-slate-600">{renderInline(block.body)}</p>
          </div>
        );
      }
      return (
        <div
          className={`relative rounded-xl ${s.bg} px-5 py-4`}
          style={{ borderLeft: `4px solid ${s.bar}` }}
        >
          <ListenButton
            text={`${block.title ?? s.label}. ${block.body}`}
            className="absolute top-3 right-3"
          />
          <p
            className="text-[11px] font-black uppercase tracking-widest mb-1.5"
            style={{ color: s.bar }}
          >
            {block.title ?? s.label}
          </p>
          <p className="text-sm leading-7 text-[#0F172A] pr-9">{renderInline(block.body)}</p>
        </div>
      );
    }

    case "video":
      return (
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <div className="relative aspect-video bg-gradient-to-br from-[#0F172A] via-[#193b92] to-[#2C7A7B] grid place-items-center">
            {block.src ? (
              <iframe
                src={block.src}
                title={block.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center text-white px-6">
                <div className="w-16 h-16 rounded-full bg-white/15 grid place-items-center mx-auto mb-3 backdrop-blur">
                  <span className="text-2xl ml-1">▶</span>
                </div>
                <p className="font-bold">{block.title}</p>
                {block.duration && (
                  <p className="text-xs text-white/70 mt-1">⏱ {block.duration} · video coming soon</p>
                )}
              </div>
            )}
          </div>
          {block.caption && (
            <p className="text-xs text-slate-500 px-4 py-3 bg-slate-50 leading-relaxed">
              {block.caption}
            </p>
          )}
        </div>
      );

    case "code":
      return (
        <div>
          {block.label && (
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              {block.label}
            </p>
          )}
          <pre
            className="p-5 rounded-2xl overflow-x-auto text-[13px] leading-6 font-mono bg-[#0F172A] text-slate-200 whitespace-pre-wrap"
            style={{ boxShadow: "0 4px 20px rgba(15,23,42,0.2)" }}
          >
            {block.code}
          </pre>
        </div>
      );

    case "list":
      return (
        <div>
          {block.heading && (
            <h3 className="text-base font-bold text-[#0F172A] mb-2">{block.heading}</h3>
          )}
          <ul className="space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-[15px] leading-7 text-slate-600">
                <span className="text-[#193b92] font-black shrink-0 mt-0.5">
                  {block.ordered ? `${i + 1}.` : "▸"}
                </span>
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "cards":
      return (
        <div>
          {block.heading && (
            <h3 className="text-base font-bold text-[#0F172A] mb-1">{block.heading}</h3>
          )}
          {block.intro && <p className="text-sm text-slate-500 mb-3 leading-relaxed">{block.intro}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {block.items.map((it, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-4 flex gap-3 items-start"
              >
                {it.emoji && <span className="text-xl shrink-0">{it.emoji}</span>}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0F172A]">{it.name}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    {renderInline(it.desc)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "compare":
      return (
        <div>
          {block.heading && (
            <h3 className="text-base font-bold text-[#0F172A] mb-3">{block.heading}</h3>
          )}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400 w-16" />
                  <th className="text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {block.columns[0]}
                  </th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-[#2C7A7B]">
                    {block.columns[1]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3 text-xs font-bold text-slate-400">{r.label}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{r.bad}</td>
                    <td className="px-4 py-3 text-sm text-[#0F172A] bg-slate-50">{r.good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "reveal":
      return <RevealBlock label={block.label} body={block.body} />;

    case "quiz":
      return <QuizById id={block.id} />;

    case "activity":
      return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-5 py-3 flex items-center gap-3 bg-[#193b92]">
            <span className="text-lg">🎯</span>
            <span className="font-black text-white text-sm uppercase tracking-wider flex-1">
              {block.title}
            </span>
            {block.xp != null && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 bg-white/10 px-2 py-1 rounded-full">
                +{block.xp} XP
              </span>
            )}
          </div>
          <div className="px-5 py-4">
            {block.body && (
              <p className="text-sm leading-7 text-[#0F172A] mb-3">{renderInline(block.body)}</p>
            )}
            {block.steps && (
              <ol className="space-y-2">
                {block.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-6 text-slate-600">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#EFF6FF] text-[#193b92] grid place-items-center text-[11px] font-black">
                      {i + 1}
                    </span>
                    <span>{renderInline(step)}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      );

    case "explore":
      return <ExploreBlock title={block.title} intro={block.intro} tasks={block.tasks} />;

    case "exercise":
      return (
        <ExerciseBlock
          difficulty={block.difficulty}
          title={block.title}
          speakerId={block.speakerId}
          storyBeat={block.storyBeat}
          instructions={block.instructions}
          hint={block.hint}
          successCriteria={block.successCriteria}
          xp={block.xp}
        />
      );

    case "chat":
      return <ChatBlock intro={block.intro} starterPrompt={block.starterPrompt} goal={block.goal} />;

    case "boss":
      return (
        <BossBlock
          title={block.title}
          speakerId={block.speakerId}
          storyBeat={block.storyBeat}
          challenge={block.challenge}
          steps={block.steps}
          successCriteria={block.successCriteria}
          reward={block.reward}
          xp={block.xp}
        />
      );

    case "homework":
      return (
        <HomeworkBlock
          title={block.title}
          intro={block.intro}
          tasks={block.tasks}
          bonus={block.bonus}
        />
      );

    case "build":
      return (
        <BuildBlock
          title={block.title}
          tagline={block.tagline}
          intro={block.intro}
          deliverables={block.deliverables}
          shipWhen={block.shipWhen}
          shareAs={block.shareAs}
          xp={block.xp}
        />
      );

    default:
      return null;
  }
}

// ── Part section ────────────────────────────────────────────────────────────
function PartSection({ part, index }: { part: LessonPart; index: number }) {
  const [open, setOpen] = useState(true);
  return (
    <section id={`part-${part.id}`} className="scroll-mt-24">
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full text-left flex items-start gap-4 px-6 py-5 hover:bg-slate-50 transition-colors"
        >
          <div className="shrink-0 w-10 h-10 rounded-xl bg-[#193b92] text-white grid place-items-center font-bold text-base">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#193b92]">
                {part.kicker}
              </span>
              <span className="text-[11px] text-slate-400">· {part.minutes} min</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] mt-0.5">{part.title}</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{part.summary}</p>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className={`shrink-0 mt-1.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <div className="px-6 pb-6 pt-1 space-y-5 border-t border-slate-100">
            {part.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Main view ───────────────────────────────────────────────────────────────
export default function LessonView({
  lesson,
  programSlug,
  lessonSlug,
  xp,
  nextHref,
  alreadyDone,
}: Props) {
  const char = CHARACTER_BY_ID[lesson.characterId];
  const [completed, setCompleted] = useState(alreadyDone);
  const [completing, setCompleting] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  const totalMinutes = lesson.parts.reduce((a, p) => a + p.minutes, 0);

  async function markComplete() {
    if (completed || completing) return;
    setCompleting(true);
    try {
      const res = await fetch("/api/programs/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programSlug, lessonSlug }),
      });
      if (res.ok) {
        setCompleted(true);
        setXpEarned(xp);
      }
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Character hook */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-[0_4px_24px_rgba(15,23,42,0.04)]">
        <div className="flex items-start gap-4">
          {char && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={char.image}
              alt={char.name}
              className="shrink-0 w-14 h-14 rounded-full shadow-[0_2px_10px_rgba(15,23,42,0.08)] object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="font-bold text-[#0F172A]">{char?.name ?? lesson.characterId}</span>
              <span className="text-xs text-slate-400">Your mentor at the Academy</span>
            </div>
            <p className="text-sm text-[#0F172A] leading-relaxed pr-9">{lesson.hook}</p>
          </div>
          <ListenButton text={lesson.hook} className="mt-1" />
        </div>
      </div>

      {/* Outcomes */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-[11px] font-black uppercase tracking-widest text-[#193b92] mb-3">
          By the end of this lesson you'll be able to
        </p>
        <ul className="space-y-2">
          {lesson.outcomes.map((o, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-7 text-[#0F172A]">
              <span className="text-[#2C7A7B] font-black shrink-0 mt-0.5">✓</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Part navigator */}
      <nav className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Lesson roadmap
          </p>
          <span className="text-[11px] text-slate-400">{totalMinutes} min total</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {lesson.parts.map((p, i) => (
            <a
              key={p.id}
              href={`#part-${p.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#193b92] hover:text-[#193b92] transition-colors"
            >
              <span className="w-4 h-4 rounded-full bg-slate-100 grid place-items-center text-[10px] font-black">
                {i + 1}
              </span>
              {p.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Parts */}
      <div className="space-y-6">
        {lesson.parts.map((part, i) => (
          <PartSection key={part.id} part={part} index={i} />
        ))}
      </div>

      {/* Completion */}
      {xpEarned !== null ? (
        <div className="rounded-3xl border border-[#2C7A7B]/30 bg-[#F0FDFA] p-6 text-center">
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-extrabold text-[#2C7A7B] text-lg">+{xpEarned} XP earned!</p>
          <p className="text-sm text-slate-500 mt-1">Brilliant work, founder. On to the next one.</p>
          <a
            href={nextHref}
            className="mt-4 inline-block bg-[#2C7A7B] hover:bg-[#234E52] text-white font-semibold text-sm px-6 py-3 rounded-full transition"
          >
            Next lesson →
          </a>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-bold text-[#0F172A]">Finished the lesson?</p>
            <p className="text-sm text-slate-500">
              Mark it complete to bank your XP and unlock the next one.
            </p>
          </div>
          {completed ? (
            <a
              href={nextHref}
              className="bg-[#2C7A7B] hover:bg-[#234E52] text-white font-semibold text-sm px-6 py-3 rounded-full transition text-center"
            >
              ✓ Complete · Next lesson →
            </a>
          ) : (
            <button
              onClick={markComplete}
              disabled={completing}
              className="bg-[#2C7A7B] hover:bg-[#234E52] text-white font-semibold text-sm px-6 py-3 rounded-full transition disabled:opacity-40"
            >
              {completing ? "Saving…" : `Mark complete · +${xp} XP`}
            </button>
          )}
        </div>
      )}

      {/* Always-on studio AI */}
      <FloatingChat programSlug={programSlug} />
    </div>
  );
}
