"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function TeacherLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/teacher`,
      },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-[#FAFAFA] min-h-screen">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo href="/" size="md" suffix="Teachers" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="mb-6">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#7C3AED] mb-2">
              Teacher portal
            </span>
            <h1 className="text-xl font-bold text-[#0F172A] leading-tight">
              Sign in to your dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage classes, generate weekly class codes, and watch student
              progress.
            </p>
          </div>

          {status === "sent" ? (
            <div className="text-center py-4">
              <div
                className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full"
                style={{ background: "#F5F0FF" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 6l8 7 8-7" />
                </svg>
              </div>
              <p className="text-sm text-slate-700">
                Magic link sent to <strong>{email}</strong>. Open it on this
                device.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15"
                />
              </div>
              {status === "error" && (
                <p className="text-red-600 text-sm">
                  {errorMsg || "Something went wrong."}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold text-sm px-6 py-3 rounded-full transition disabled:opacity-60 shadow-[0_4px_15px_rgba(124,58,237,0.25)]"
              >
                {status === "sending" ? "Sending…" : "Send magic link"}
              </button>
              <p className="text-xs text-slate-500 text-center">
                New here?{" "}
                <a
                  href="mailto:hello@techtutor.academy?subject=Teacher access"
                  className="underline hover:text-[#0F172A]"
                >
                  Request teacher access
                </a>
              </p>
            </form>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center mt-6">
          Not a teacher?{" "}
          <Link href="/login" className="underline hover:text-[#0F172A]">
            Student / personal sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
