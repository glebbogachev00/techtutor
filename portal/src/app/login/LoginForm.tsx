"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t, type Locale } from "@/lib/i18n";

type Mode = "student" | "personal" | "guest";

export default function LoginForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("personal");

  // Personal (magic link)
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  // Student code
  const [studentCode, setStudentCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [codeStatus, setCodeStatus] = useState<
    "idle" | "checking" | "error" | "success"
  >("idle");
  const [codeError, setCodeError] = useState("");

  async function handlePersonal(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  async function handleStudentCode(e: React.FormEvent) {
    e.preventDefault();
    setCodeStatus("checking");
    setCodeError("");
    const supabase = createClient();

    // 1. Sign in anonymously if not already signed in.
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      const { error: anonErr } = await supabase.auth.signInAnonymously();
      if (anonErr) {
        setCodeStatus("error");
        setCodeError(
          anonErr.message.includes("disabled")
            ? "Anonymous sign-ins are disabled. Ask an admin to enable them in Supabase."
            : anonErr.message,
        );
        return;
      }
    }

    // 2. Call the join endpoint.
    const res = await fetch("/api/class/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: studentCode,
        displayName: studentName,
      }),
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setCodeStatus("error");
      setCodeError(
        json?.message ||
          (json?.error === "invalid_code"
            ? "That code didn't match an active class."
            : "Could not join. Try again."),
      );
      return;
    }

    setCodeStatus("success");
    router.push("/dashboard");
    router.refresh();
  }

  function handleGuest() {
    router.push("/preview");
  }

  return (
    <div className="w-full">
      {/* Mode tabs */}
      <div className="flex items-center gap-1 p-1 mb-6 rounded-full bg-slate-100">
        {(
          [
            { id: "student", label: "Class code" },
            { id: "personal", label: "Personal" },
            { id: "guest", label: "Guest" },
          ] as { id: Mode; label: string }[]
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`flex-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded-full transition ${
              mode === m.id
                ? "bg-white text-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
                : "text-slate-500 hover:text-[#0F172A]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Personal (magic link) ─────────────────────────── */}
      {mode === "personal" && (
        <>
          {status === "sent" ? (
            <div className="text-center py-6">
              <div
                className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full"
                style={{ background: "#E8F0FE" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#193b92" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 6l8 7 8-7" />
                </svg>
              </div>
              <p className="text-sm text-slate-700">
                {t(locale, "login.checkInbox", { email })}
              </p>
            </div>
          ) : (
            <form onSubmit={handlePersonal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  {t(locale, "login.emailLabel")}
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t(locale, "login.emailPlaceholder")}
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#193b92] focus:ring-2 focus:ring-[#193b92]/15"
                />
              </div>
              {status === "error" && (
                <p className="text-red-600 text-sm">
                  {errorMsg || t(locale, "login.error")}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-[#193b92] hover:bg-[#0f2861] text-white font-semibold text-sm px-6 py-3 rounded-full transition disabled:opacity-60 shadow-[0_4px_15px_rgba(25,59,146,0.25)]"
              >
                {status === "sending"
                  ? t(locale, "login.sending")
                  : t(locale, "login.submit")}
              </button>
              <p className="text-xs text-slate-500 text-center">
                We&apos;ll email you a magic link — no password to remember.
              </p>
            </form>
          )}
        </>
      )}

      {/* ── Class code (students, no email) ───────────────── */}
      {mode === "student" && (
        <form onSubmit={handleStudentCode} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Your first name
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value.slice(0, 40))}
              placeholder="Alex"
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#193b92] focus:ring-2 focus:ring-[#193b92]/15"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Class code
            </label>
            <input
              type="text"
              required
              value={studentCode}
              onChange={(e) =>
                setStudentCode(e.target.value.toUpperCase().slice(0, 10))
              }
              placeholder="BA3-7F2K"
              className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest border border-slate-300 rounded-xl outline-none focus:border-[#193b92] focus:ring-2 focus:ring-[#193b92]/15"
            />
          </div>
          {codeStatus === "error" && (
            <p className="text-red-600 text-sm text-center">{codeError}</p>
          )}
          <button
            type="submit"
            disabled={codeStatus === "checking"}
            className="w-full bg-[#193b92] hover:bg-[#0f2861] text-white font-semibold text-sm px-6 py-3 rounded-full transition disabled:opacity-60 shadow-[0_4px_15px_rgba(25,59,146,0.25)]"
          >
            {codeStatus === "checking" ? "Joining…" : "Join class"}
          </button>
          <p className="text-xs text-slate-500 text-center">
            No email needed. Your teacher gives you a fresh code each week.
          </p>
        </form>
      )}

      {/* ── Guest ─────────────────────────────────────────── */}
      {mode === "guest" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-[#F0F9F8] border border-[#2C7A7B]/20 p-4">
            <p className="text-sm text-[#0F172A] leading-relaxed">
              Try TechBash without an account. You&apos;ll see a few sample
              missions and the playground — progress and AI chats won&apos;t
              be saved.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGuest}
            className="w-full bg-[#2C7A7B] hover:bg-[#234E52] text-white font-semibold text-sm px-6 py-3 rounded-full transition shadow-[0_4px_15px_rgba(44,122,123,0.25)]"
          >
            Continue as guest
          </button>
          <p className="text-xs text-slate-500 text-center">
            Want to save XP and chat with Professor Loop? Switch to Personal or
            ask your teacher for a class code.
          </p>
        </div>
      )}
    </div>
  );
}
