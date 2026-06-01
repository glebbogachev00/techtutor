"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({
  initialName,
}: {
  initialName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setStatus("error");
      setError("Please enter a name.");
      return;
    }
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setStatus("error");
      setError("You need to be signed in.");
      return;
    }
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ full_name: trimmed })
      .eq("id", user.id);
    if (updateErr) {
      setStatus("error");
      setError(updateErr.message);
      return;
    }
    setStatus("saved");
    startTransition(() => router.refresh());
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4"
    >
      <div>
        <label
          htmlFor="display-name"
          className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2"
        >
          Display name
        </label>
        <input
          id="display-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 60))}
          placeholder="What should we call you?"
          className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#193b92] focus:ring-2 focus:ring-[#193b92]/15"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {status === "saved"
            ? "Saved ✓"
            : "Visible to your teachers and on the leaderboard."}
        </p>
        <button
          type="submit"
          disabled={status === "saving" || name.trim() === initialName.trim()}
          className="bg-[#193b92] hover:bg-[#0f2861] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
