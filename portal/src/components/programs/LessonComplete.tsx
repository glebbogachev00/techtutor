"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LessonComplete({
  programSlug,
  lessonSlug,
  xp,
  nextHref,
  alreadyDone,
  accentColor,
  accentShadow,
}: {
  programSlug: string;
  lessonSlug: string;
  xp: number;
  nextHref: string | null;
  alreadyDone: boolean;
  accentColor: string;
  accentShadow: string;
}) {
  const router = useRouter();
  const [done, setDone] = useState(alreadyDone);
  const [completing, setCompleting] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  async function handleComplete() {
    if (done || completing) return;
    setCompleting(true);
    const res = await fetch("/api/programs/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programSlug, lessonSlug, xp }),
    });
    const data = await res.json();
    setCompleting(false);
    if (res.ok) {
      setDone(true);
      setXpEarned(data.xpEarned);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        {xpEarned !== null && (
          <p className="text-2xl font-black text-[color:var(--color-primary)] animate-pop">
            🎉 +{xpEarned} XP earned!
          </p>
        )}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 bg-[color:var(--color-teal)] text-white text-sm font-bold px-4 py-2 rounded-full">
            ✓ Lesson complete
          </span>
          {nextHref && (
            <button
              onClick={() => router.push(nextHref)}
              className="text-sm font-bold px-5 py-2 rounded-full text-white transition"
              style={{ background: accentColor, boxShadow: `0 4px 20px ${accentShadow}` }}
            >
              Next lesson →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <button
        onClick={handleComplete}
        disabled={completing}
        className="font-bold text-base px-8 py-4 rounded-2xl text-white transition disabled:opacity-60"
        style={{ background: accentColor, boxShadow: `0 4px 20px ${accentShadow}` }}
      >
        {completing ? "Saving…" : `✓ Complete lesson — +${xp} XP`}
      </button>
    </div>
  );
}
