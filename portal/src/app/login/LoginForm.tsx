"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t, type Locale } from "@/lib/i18n";

type Mode = "student" | "personal" | "guest";

export default function LoginForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("personal");
  const [teacherIntent, setTeacherIntent] = useState(false);

  useEffect(() => {
    if (searchParams.get("teacher") === "1") {
      setMode("personal");
      setTeacherIntent(true);
    }
  }, [searchParams]);

  // Personal (email OTP)
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "verifying" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Student code
  const [studentCode, setStudentCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPin, setStudentPin] = useState("");
  const [codeStatus, setCodeStatus] = useState<
    "idle" | "checking" | "error" | "success"
  >("idle");
  const [codeError, setCodeError] = useState("");

  async function handleTeacherPassword(e: React.FormEvent) {
    e.preventDefault();
    setStatus("verifying");
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      setStatus("idle");
      const msg = error.message.toLowerCase();
      if (msg.includes("invalid")) {
        setErrorMsg("Email or password didn't match. Try again.");
      } else if (msg.includes("not confirmed")) {
        setErrorMsg(
          "Email not confirmed yet. Ask the admin to confirm your account.",
        );
      } else {
        setErrorMsg(error.message);
      }
      return;
    }
    // Hard navigation so the next request carries the freshly-set Supabase
    // auth cookies. router.push() can race with cookie writes and leave the
    // server thinking the user is still a guest.
    window.location.assign("/teacher");
  }

  async function handlePersonal(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const supabase = createClient();
    // No emailRedirectTo => Supabase sends a 6-digit OTP code ({{ .Token }}).
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(
        error.message.includes("rate")
          ? "Too many requests — please wait a minute and try again."
          : error.message,
      );
    } else {
      setStatus("sent");
      startResendCooldown();
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const cleanOtp = otp.replace(/\s+/g, "");
    if (cleanOtp.length < 8) return;
    setStatus("verifying");
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: cleanOtp,
      type: "email",
    });
    if (error) {
      setStatus("sent");
      const msg = error.message.toLowerCase();
      if (msg.includes("expired")) {
        setErrorMsg(
          "That code expired. Use the most recent email — older codes are invalidated when you resend. Tap resend if you need a fresh one.",
        );
      } else if (msg.includes("invalid")) {
        setErrorMsg(
          "That code didn't match. Make sure you copied the full code from the latest email (no spaces).",
        );
      } else {
        setErrorMsg(error.message);
      }
      return;
    }
    // Hard navigation so the next request carries the freshly-set Supabase
    // auth cookies. router.push() can race with cookie writes and leave the
    // server thinking the user is still a guest.
    window.location.assign(teacherIntent ? "/teacher" : "/dashboard");
  }

  function startResendCooldown() {
    setResendCooldown(60);
    const tick = () => {
      setResendCooldown((s) => {
        if (s <= 1) return 0;
        setTimeout(tick, 1000);
        return s - 1;
      });
    };
    setTimeout(tick, 1000);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setStatus("sending");
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) {
      setStatus("sent");
      setErrorMsg(
        error.message.includes("rate")
          ? "Please wait a minute before requesting another code."
          : error.message,
      );
    } else {
      setStatus("sent");
      startResendCooldown();
    }
  }

  async function handleStudentCode(e: React.FormEvent) {
    e.preventDefault();
    setCodeStatus("checking");
    setCodeError("");
    const supabase = createClient();

    // ── PIN flow: name + code + PIN ───────────────────────────────────────
    if (studentPin.trim()) {
      const res = await fetch("/api/class/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: studentCode,
          displayName: studentName,
          pin: studentPin.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setCodeStatus("error");
        setCodeError(
          json?.message ||
            (json?.error === "invalid_code"
              ? "That class code didn't match an active class."
              : json?.error === "invalid_credentials"
                ? "Name or PIN didn't match. Ask your teacher to check."
                : "Could not sign in. Try again."),
        );
        return;
      }

      // Server verified credentials and returned the fabricated email.
      // Sign in directly from the browser so cookies are set correctly.
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: json.email,
        password: studentPin.trim(),
      });

      if (signInErr) {
        setCodeStatus("error");
        setCodeError(signInErr.message ?? "Sign-in failed. Try again.");
        return;
      }

      setCodeStatus("success");
      window.location.assign("/dashboard");
      return;
    }

    // ── Anonymous flow (legacy, no PIN) ───────────────────────────────────
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
    window.location.assign("/dashboard");
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

      {/* ── Personal (email OTP code) ─────────────────────── */}
      {mode === "personal" && (
        <>
          {teacherIntent && status !== "sent" && status !== "verifying" && (
            <div className="mb-4 rounded-2xl bg-[#E8F0FE] border border-[#193b92]/20 p-3 flex items-start gap-3">
              <span className="text-lg">👩‍🏫</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#193b92]">
                  Teacher sign-in
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Use the email on your teacher account. After verifying, you&apos;ll
                  land on the teacher dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTeacherIntent(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          )}
          {teacherIntent ? (
            <form onSubmit={handleTeacherPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  Teacher email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#193b92] focus:ring-2 focus:ring-[#193b92]/15"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#193b92] focus:ring-2 focus:ring-[#193b92]/15"
                />
              </div>
              {errorMsg && (
                <p className="text-red-600 text-sm">{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={status === "verifying"}
                className="w-full bg-[#193b92] hover:bg-[#0f2861] text-white font-semibold text-sm px-6 py-3 rounded-full transition disabled:opacity-60 shadow-[0_4px_15px_rgba(25,59,146,0.25)]"
              >
                {status === "verifying" ? "Signing in…" : "Sign in to teacher dashboard"}
              </button>
              <p className="text-xs text-slate-500 text-center">
                Teacher accounts are created by an admin. Contact us if you need one.
              </p>
            </form>
          ) : status === "sent" || status === "verifying" ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <div
                  className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full"
                  style={{ background: "#E8F0FE" }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#193b92" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 6h16v12H4z" />
                    <path d="M4 6l8 7 8-7" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700">
                  We sent a sign-in code to
                </p>
                <p className="text-sm font-semibold text-[#0F172A]">{email}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 text-center">
                  Enter code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  placeholder="12345678"
                  maxLength={8}
                  className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.4em] border border-slate-300 rounded-xl outline-none focus:border-[#193b92] focus:ring-2 focus:ring-[#193b92]/15"
                />
              </div>
              {errorMsg && (
                <p className="text-red-600 text-sm text-center">{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={otp.length < 8 || status === "verifying"}
                className="w-full bg-[#193b92] hover:bg-[#0f2861] text-white font-semibold text-sm px-6 py-3 rounded-full transition disabled:opacity-60 shadow-[0_4px_15px_rgba(25,59,146,0.25)]"
              >
                {status === "verifying" ? "Verifying…" : "Verify & sign in"}
              </button>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setOtp("");
                    setErrorMsg("");
                  }}
                  className="underline hover:text-[#193b92]"
                >
                  Use a different email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="underline hover:text-[#193b92] disabled:no-underline disabled:opacity-60"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend code"}
                </button>
              </div>
            </form>
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
                {status === "sending" ? "Sending code…" : "Send code"}
              </button>
              <p className="text-xs text-slate-500 text-center">
                We&apos;ll email you a sign-in code &mdash; no password to remember.
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
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              PIN <span className="text-slate-400 font-normal normal-case">(from your teacher)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              value={studentPin}
              onChange={(e) => setStudentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="1234"
              className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] border border-slate-300 rounded-xl outline-none focus:border-[#193b92] focus:ring-2 focus:ring-[#193b92]/15"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank to join as a guest student (progress may not save across devices).
            </p>
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
            No email needed. Your teacher gives you a code and PIN.
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

      {/* ── Teacher sign-in footer ────────────────────────── */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={() => {
            setMode("personal");
            setStatus("idle");
            setErrorMsg("");
            setTeacherIntent(true);
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="w-full flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#193b92]/30 px-4 py-3 text-left transition cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-[#E8F0FE] text-lg shrink-0">
              👩‍🏫
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] truncate">
                Teacher sign-in
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Use your work email — same code, lands on teacher dashboard.
              </p>
            </div>
          </div>
          <span className="text-[#193b92] font-bold shrink-0">→</span>
        </button>
      </div>
    </div>
  );
}
