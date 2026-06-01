"use client";

import { useState } from "react";
import { CHARACTERS, type Mission } from "./missions";
import { checkGenAi } from "./mission-checks";

type Props = {
  mission: Mission;
  isComplete: boolean;
  onComplete: () => void;
};

type ChatTurn = { role: "user" | "assistant"; content: string };

export default function GenAiWorkspace({
  mission,
  isComplete,
  onComplete,
}: Props) {
  const speaker = CHARACTERS[mission.story.character];
  const [prompt, setPrompt] = useState(mission.starterPrompt ?? "");
  const [chat, setChat] = useState<ChatTurn[]>([]);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);

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
        setChat((c) => [
          ...c,
          {
            role: "assistant",
            content: `🔒 ${data?.message ?? "Sign in to chat with the AI."}`,
          },
        ]);
        return;
      }
      const reply =
        data?.reply ||
        data?.error ||
        "The AI didn't reply. Try again in a moment.";
      setChat((c) => [...c, { role: "assistant", content: reply }]);

      // Auto-check this turn against the mission goal.
      const result = checkGenAi(mission.n, text, reply);
      if (result.ok) {
        setFeedback(
          "✅ Nailed it. The AI's reply hit every goal for this mission.",
        );
        setPassed(true);
      } else {
        setFeedback(
          result.hint ?? "Close — re-read the goal and tweak your prompt.",
        );
      }
    } catch {
      setChat((c) => [
        ...c,
        { role: "assistant", content: "Something broke. Try again in a moment." },
      ]);
    } finally {
      setSending(false);
    }
  }

  function resetChat() {
    setChat([]);
    setFeedback(null);
    setPassed(false);
    setPrompt(mission.starterPrompt ?? "");
  }

  return (
    <div className="space-y-4">
      {/* Character brief */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <div className="flex items-start gap-4">
          <img
            src={speaker.avatar}
            alt={mission.story.character}
            className="shrink-0 w-14 h-14 rounded-full shadow-[0_2px_10px_rgba(15,23,42,0.08)] object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="font-bold text-[#0F172A]">
                {mission.story.character}
              </span>
              <span className="text-xs text-slate-400">{speaker.role}</span>
            </div>
            <p className="text-sm text-[#0F172A] leading-relaxed">
              {mission.story.text}
            </p>
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
        <p className="text-sm text-[#0F172A] leading-relaxed">
          {mission.concept}
        </p>
        {mission.example && (
          <pre className="mt-3 bg-[#0F172A] text-[#E2E8F0] text-xs font-mono p-3 rounded-lg overflow-auto whitespace-pre-wrap">
            {mission.example}
          </pre>
        )}
      </div>

      {/* Task + goal */}
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

      {/* Chat panel */}
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
            <div
              key={i}
              className={
                m.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
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
            placeholder="Type your prompt..."
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

      {/* Action row */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={resetChat}
          className="text-sm font-semibold text-slate-500 hover:text-[#0F172A] px-4 py-3"
        >
          Reset chat
        </button>
        {passed && !isComplete && (
          <button
            onClick={onComplete}
            className="ml-auto bg-[#2C7A7B] hover:bg-[#234E52] text-white font-semibold text-sm px-6 py-3 rounded-full transition"
          >
            Mark complete · +{mission.xp} XP
          </button>
        )}
        {isComplete && (
          <span className="ml-auto text-sm font-semibold text-[#2C7A7B]">
            Already complete
          </span>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#F5F0FF] p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white grid place-items-center text-[10px] font-black tracking-tight">
              TT
            </span>
            <p className="text-[#7C3AED] text-xs font-semibold uppercase tracking-widest">
              Tutor feedback
            </p>
          </div>
          <p className="text-[#0F172A] text-sm leading-relaxed whitespace-pre-line">
            {feedback}
          </p>
        </div>
      )}
    </div>
  );
}
