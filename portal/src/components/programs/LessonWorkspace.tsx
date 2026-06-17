"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CHARACTER_BY_ID } from "@/lib/characters";
import type { LessonMission } from "@/lib/lesson-registry";

type ChatTurn = { role: "user" | "assistant"; content: string };

interface Props {
  programSlug: string;
  lessonSlug: string;
  xp: number;
  mission: LessonMission;
  nextHref: string;
  alreadyDone: boolean;
}

export default function LessonWorkspace({
  programSlug,
  lessonSlug,
  xp,
  mission,
  nextHref,
  alreadyDone,
}: Props) {
  const router = useRouter();
  const char = CHARACTER_BY_ID[mission.characterId];
  const charRole =
    mission.characterId === "captain-pixel" ? "Your mentor at the Academy"
    : mission.characterId === "bao" ? "Your classmate and partner-in-crime"
    : mission.characterId === "mochi" ? "The Academy's clumsy robot pet"
    : mission.characterId === "storm" ? "The lone-wolf hero"
    : char?.tagline ?? "";

  const [prompt, setPrompt] = useState(mission.starterPrompt ?? "");
  const [chat, setChat] = useState<ChatTurn[]>([]);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState(alreadyDone);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [completing, setCompleting] = useState(false);

  async function send() {
    const text = prompt.trim();
    if (!text || sending) return;
    setSending(true);
    setFeedback(null);
    const nextChat: ChatTurn[] = [...chat, { role: "user", content: text }];
    setChat(nextChat);
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
        setChat((c) => [...c, { role: "assistant", content: `🔒 ${data?.message ?? "Sign in to chat with the AI."}` }]);
        return;
      }
      const reply = data?.reply || data?.error || "The AI didn't reply. Try again in a moment.";
      setChat((c) => [...c, { role: "assistant", content: reply }]);
      if (mission.goal) {
        setFeedback(`Goal: ${mission.goal}`);
      }
    } catch {
      setChat((c) => [...c, { role: "assistant", content: "Something broke. Try again in a moment." }]);
    } finally {
      setSending(false);
    }
  }

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

  function resetChat() {
    setChat([]);
    setFeedback(null);
    setPrompt(mission.starterPrompt ?? "");
  }

  return (
    <div className="space-y-4">

      {/* Character brief */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <div className="flex items-start gap-4">
          {char && (
            <img
              src={char.image}
              alt={char.name}
              className="shrink-0 w-14 h-14 rounded-full shadow-[0_2px_10px_rgba(15,23,42,0.08)] object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="font-bold text-[#0F172A]">{char?.name ?? mission.characterId}</span>
              <span className="text-xs text-slate-400">{charRole}</span>
            </div>
            <p className="text-sm text-[#0F172A] leading-relaxed">{mission.story}</p>
          </div>
        </div>
      </div>

      {/* Why this matters */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 mb-2">
          Why this matters
        </p>
        <p className="text-sm text-[#0F172A] leading-relaxed">{mission.why}</p>
      </div>

      {/* Concept */}
      <div className="rounded-xl bg-white border border-slate-200 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7C3AED] mb-2">
          Learn the concept
        </p>
        <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-line">{mission.concept}</p>
        {mission.example && (
          <pre className="mt-3 bg-[#0F172A] text-[#E2E8F0] text-xs font-mono p-3 rounded-lg overflow-auto whitespace-pre-wrap">
            {mission.example}
          </pre>
        )}
      </div>

      {/* Extra content sections */}
      {mission.sections?.map((section, i) => (
        <div key={i} className="rounded-xl bg-white border border-slate-200 px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#2C7A7B] mb-3">
            {section.heading}
          </p>
          {section.content && (
            <p className="text-sm text-[#0F172A] leading-relaxed mb-3">{section.content}</p>
          )}
          {section.items && (
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.name} className="flex gap-3">
                  <span className="font-bold text-[#0F172A] shrink-0 w-36 text-sm">{item.name}</span>
                  <span className="text-slate-500 text-sm">{item.desc}</span>
                </li>
              ))}
            </ul>
          )}
          {section.tip && (
            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
              <p className="text-xs font-semibold text-amber-800">💡 {section.tip}</p>
            </div>
          )}
        </div>
      ))}

      {/* Mission */}
      <div className="rounded-xl bg-[#F5F0FF] border border-[#7C3AED]/20 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7C3AED] mb-1">
          Your mission
        </p>
        <p className="text-sm text-[#0F172A] leading-relaxed">{mission.task}</p>
        {mission.goal && (
          <p className="text-xs text-[#7C3AED] mt-2">
            <span className="font-semibold">Goal:</span> {mission.goal}
          </p>
        )}
      </div>

      {/* AI Chat */}
      {mission.kind === "chat" && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>AI Chat</span>
            <span className="flex items-center gap-1.5 text-[#7C3AED]">
              <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full" />
              Live
            </span>
          </div>
          <div className="max-h-[360px] overflow-auto p-4 space-y-3 bg-[#FAFAFA]">
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
                      : "max-w-[80%] rounded-2xl rounded-bl-sm bg-white border border-slate-200 text-[#0F172A] text-sm px-4 py-2 whitespace-pre-wrap"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white border border-slate-200 text-slate-400 text-sm px-4 py-2">
                  AI is thinking…
                </div>
              </div>
            )}
          </div>
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
              placeholder="Type your prompt…"
              className="flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            />
            <button
              onClick={send}
              disabled={sending || !prompt.trim()}
              className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold text-sm px-5 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(124,58,237,0.25)]"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </div>
      )}

      {/* Action row */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {mission.kind === "chat" && (
          <button
            onClick={resetChat}
            className="text-sm font-semibold text-slate-500 hover:text-[#0F172A] px-4 py-3"
          >
            Reset chat
          </button>
        )}
        {!completed && (
          <button
            onClick={markComplete}
            disabled={completing || (mission.kind === "chat" && chat.length === 0)}
            className="ml-auto bg-[#2C7A7B] hover:bg-[#234E52] text-white font-semibold text-sm px-6 py-3 rounded-full transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {completing ? "Saving…" : `Mark complete · +${xp} XP`}
          </button>
        )}
        {completed && !xpEarned && (
          <span className="ml-auto text-sm font-semibold text-[#2C7A7B]">✓ Already complete</span>
        )}
      </div>

      {/* XP earned */}
      {xpEarned !== null && (
        <div className="rounded-2xl border border-[#2C7A7B]/30 bg-[#F0FDFA] p-5">
          <p className="font-extrabold text-[#2C7A7B]">
            🎉 +{xpEarned} XP earned!
          </p>
          <a href={nextHref} className="mt-3 inline-block text-sm font-semibold text-[#2C7A7B] underline underline-offset-2">
            Next lesson →
          </a>
        </div>
      )}

      {/* Tutor feedback hint */}
      {feedback && chat.length > 0 && (
        <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#F5F0FF] p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white grid place-items-center text-[10px] font-black tracking-tight">
              TT
            </span>
            <p className="text-[#7C3AED] text-xs font-semibold uppercase tracking-widest">
              Reminder
            </p>
          </div>
          <p className="text-[#0F172A] text-sm leading-relaxed whitespace-pre-line">{feedback}</p>
        </div>
      )}

    </div>
  );
}
