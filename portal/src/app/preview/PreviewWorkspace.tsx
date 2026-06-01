"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { CHARACTERS, type Mission } from "./missions";
import { runPython } from "./python-runner";
import { checkMission } from "./mission-checks";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Props = {
  mission: Mission;
  trackId: string;
  isComplete: boolean;
  onComplete: () => void;
  enableAiSandbox?: boolean;
};

const FAKE_FEEDBACK = [
  "Nice work. Your code runs cleanly and the changes look great.",
  "Solid. You followed the task and your code is easy to read.",
  "Great job. Small tip: try changing one more thing to make it really yours.",
  "Looking good. The output shows exactly what we asked for.",
];

export default function PreviewWorkspace({
  mission,
  trackId,
  isComplete,
  onComplete,
  enableAiSandbox = false,
}: Props) {
  const [code, setCode] = useState(mission.starter);
  const [reviewing, setReviewing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const isPython = mission.language === "python";
  const pythonOutput = isPython ? runPython(code) : "";
  const speaker = CHARACTERS[mission.story.character];

  function handleSubmit() {
    setReviewing(true);
    setFeedback(null);
    setPassed(false);
    setTimeout(() => {
      const result = checkMission(
        trackId,
        mission.n,
        code,
        isPython ? pythonOutput : "",
        mission.starter,
      );
      if (result.ok) {
        setFeedback(FAKE_FEEDBACK[mission.n % FAKE_FEEDBACK.length]);
        setPassed(true);
      } else {
        setFeedback(
          result.hint ??
            "Not quite yet — re-read the task and try again.",
        );
        setPassed(false);
      }
      setReviewing(false);
    }, 600);
  }

  async function sendPromptToAi() {
    const promptText = (pythonOutput || "").trim();
    if (!promptText || aiLoading) return;
    setAiLoading(true);
    setAiReply(null);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: promptText }],
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setAiReply(
          `🔒 ${data?.message ?? "Sign in to chat with the AI."}`,
        );
      } else {
        setAiReply(
          data?.reply || data?.error || "The AI didn't reply. Try again?",
        );
      }
    } catch {
      setAiReply("Something broke. Try sending again in a moment.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="space-y-4">
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

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 mb-2">
          Why this matters
        </p>
        <p className="text-sm text-[#0F172A] leading-relaxed">{mission.why}</p>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#193b92] mb-2">
          Learn the concept
        </p>
        <p className="text-sm text-[#0F172A] leading-relaxed">
          {mission.concept}
        </p>
        {mission.example && (
          <pre className="mt-3 bg-[#0F172A] text-[#E2E8F0] text-xs font-mono p-3 rounded-lg overflow-auto whitespace-pre">
            {mission.example}
          </pre>
        )}
      </div>

      <div className="rounded-xl bg-[#F0F9F8] border border-[#2C7A7B]/20 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#2C7A7B] mb-1">
          Now you try
        </p>
        <p className="text-sm text-[#0F172A] leading-relaxed">{mission.task}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
          <div className="px-4 py-2 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Code</span>
            <span className="text-slate-400">
              {isPython ? "main.py" : "index.html"}
            </span>
          </div>
          <Editor
            height="320px"
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
            <pre className="w-full h-[320px] p-4 text-sm font-mono text-[#0F172A] bg-[#0F172A]/[0.03] overflow-auto whitespace-pre-wrap">
              {pythonOutput}
            </pre>
          ) : (
            <iframe
              title="Live preview"
              sandbox="allow-scripts"
              srcDoc={code}
              className="w-full h-[320px] bg-white"
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={handleSubmit}
          disabled={reviewing}
          className="bg-[#193b92] hover:bg-[#0f2861] text-white font-semibold text-sm px-7 py-3 rounded-full transition disabled:opacity-60 disabled:cursor-wait shadow-[0_4px_15px_rgba(25,59,146,0.25)]"
        >
          {reviewing ? "Reviewing..." : "Check with tutor"}
        </button>
        <button
          onClick={() => setCode(mission.starter)}
          className="text-sm font-semibold text-slate-500 hover:text-[#0F172A] px-4 py-3"
        >
          Reset code
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

      {feedback && (
        <div className="rounded-2xl border border-[#2C7A7B]/30 bg-[#F0F9F8] p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#2C7A7B] text-white grid place-items-center text-[10px] font-black tracking-tight">
              TT
            </span>
            <p className="text-[#2C7A7B] text-xs font-semibold uppercase tracking-widest">
              Tutor feedback
            </p>
          </div>
          <p className="text-[#0F172A] text-sm leading-relaxed whitespace-pre-line">
            {feedback}
          </p>
        </div>
      )}

      {enableAiSandbox && (
        <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#F5F0FF] p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white grid place-items-center text-[10px] font-black">
              AI
            </span>
            <p className="text-[#7C3AED] text-xs font-semibold uppercase tracking-widest">
              Try your prompt on a real AI
            </p>
          </div>
          <p className="text-[#0F172A] text-sm leading-relaxed mb-3">
            Whatever your code prints will be sent to the AI as a prompt. Run
            your code, then hit the button.
          </p>
          <div className="rounded-lg bg-white border border-slate-200 p-3 mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Prompt being sent
            </p>
            <pre className="text-xs font-mono text-[#0F172A] whitespace-pre-wrap break-words">
              {pythonOutput.trim() || "(your output is empty — run some print() first)"}
            </pre>
          </div>
          <button
            onClick={sendPromptToAi}
            disabled={aiLoading || !pythonOutput.trim()}
            className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(124,58,237,0.25)]"
          >
            {aiLoading ? "AI is thinking..." : "Send prompt to AI"}
          </button>
          {aiReply && (
            <div className="mt-4 rounded-lg bg-white border border-[#7C3AED]/20 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7C3AED] mb-2">
                AI response
              </p>
              <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                {aiReply}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
