"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { t, type Locale } from "@/lib/i18n";

export default function LoginForm({ locale }: { locale: Locale }) {
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

  if (status === "sent") {
    return (
      <div className="text-center text-sm text-gray-700">
        <div className="text-4xl mb-3">📬</div>
        {t(locale, "login.checkInbox", { email })}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t(locale, "login.emailLabel")}
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t(locale, "login.emailPlaceholder")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent outline-none"
        />
      </div>
      {status === "error" && (
        <p className="text-red-600 text-sm">{errorMsg || t(locale, "login.error")}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {status === "sending"
          ? t(locale, "login.sending")
          : t(locale, "login.submit")}
      </button>
    </form>
  );
}
