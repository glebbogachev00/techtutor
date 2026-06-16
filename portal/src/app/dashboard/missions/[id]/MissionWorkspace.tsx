"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Mission = {
  id: string;
  language: "html" | "python";
  title_en: string;
  title_vn: string;
  brief_en: string;
  brief_vn: string;
  expected_outcome: string;
  xp_reward: number;
  tracks: { slug: string; title_en: string; title_vn: string };
};

type ReviewStatus = "passed" | "needs_work" | null | string;

export default function MissionWorkspace({
  locale,
  mission,
  initialCode,
  initialFeedback,
  initialStatus,
  alreadyCompleted,
}: {
  locale: Locale;
  mission: Mission;
  initialCode: string;
  initialFeedback: string | null;
  initialStatus: ReviewStatus;
  alreadyCompleted: boolean;
}) {
  const [code, setCode] = useState(initialCode);
  const [reviewing, setReviewing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(initialFeedback);
  const [status, setStatus] = useState<ReviewStatus>(initialStatus);
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  const title = locale === "vn" ? mission.title_vn : mission.title_en;
  const brief = locale === "vn" ? mission.brief_vn : mission.brief_en;

  const previewSrcDoc = useMemo(() => {
    return mission.language === "html" ? code : "";
  }, [code, mission.language]);

  async function handleSubmit() {
    setReviewing(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId: mission.id, code, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Review failed");
      setFeedback(data.feedback);
      setStatus(data.status);
      if (data.status === "passed" && !completed) {
        setCompleted(true);
        setXpEarned(mission.xp_reward);
      }
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : "Sorry, the AI tutor is offline.",
      );
      setStatus("needs_work");
    } finally {
      setReviewing(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          href={`/dashboard/tracks/${mission.tracks.slug}`}
          className="text-sm text-gray-600 hover:text-[color:var(--color-primary)]"
        >
          ← {locale === "vn" ? mission.tracks.title_vn : mission.tracks.title_en}
        </Link>
        {completed && (
          <span className="inline-flex items-center gap-2 bg-[color:var(--color-teal)] text-white text-xs font-bold px-3 py-1 rounded-full">
            ✓ {t(locale, "track.completed")}
          </span>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[color:var(--color-ink)]">
        {title}
      </h1>

      <div className="card p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[color:var(--color-teal)] mb-2">
          {t(locale, "mission.brief")}
        </h2>
        <p className="text-gray-800 whitespace-pre-line">{brief}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card overflow-hidden">
          <div className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {t(locale, "mission.editor")} —{" "}
            {mission.language === "html" ? "HTML" : "Python"}
          </div>
          <Editor
            height="420px"
            language={mission.language === "html" ? "html" : "python"}
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              tabSize: 2,
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div className="card overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {t(locale, "mission.preview")}
          </div>
          {mission.language === "html" ? (
            <iframe
              title="Live preview"
              sandbox="allow-scripts allow-same-origin allow-modals"
              srcDoc={previewSrcDoc}
              className="w-full h-[420px] bg-white"
            />
          ) : (
            <div className="p-5 text-sm text-gray-600 flex-1">
              Python missions are reviewed by the AI tutor. Click{" "}
              <span className="font-semibold">
                {t(locale, "mission.submit")}
              </span>{" "}
              when ready.
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={reviewing}
          className="btn-primary disabled:opacity-60"
        >
          {reviewing ? t(locale, "mission.reviewing") : t(locale, "mission.submit")}
        </button>
      </div>

      {feedback && (
        <div
          className={`card p-5 border-l-4 ${
            status === "passed"
              ? "border-[color:var(--color-teal)]"
              : "border-amber-500"
          }`}
        >
          <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-2">
            {t(locale, "mission.feedback")}
          </h3>
          <p className="whitespace-pre-line text-gray-800">{feedback}</p>
          {xpEarned !== null && (
            <p className="mt-3 font-extrabold text-[color:var(--color-primary)]">
              🎉 {t(locale, "mission.xpEarned", { xp: xpEarned })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
