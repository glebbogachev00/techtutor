"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ServerInfo = {
  cookieCount: number;
  cookies: { name: string; valueLength: number }[];
  user: { id: string; email?: string } | null;
  userError: string | null;
  session: { expiresAt?: number; tokenLength: number } | null;
};

export default function DebugClient() {
  const [browserCookies, setBrowserCookies] = useState<string>("(reading...)");
  const [browserSession, setBrowserSession] = useState<string>("(reading...)");
  const [server, setServer] = useState<ServerInfo | string>("(loading...)");
  const [now, setNow] = useState<string>("");

  async function refresh() {
    setNow(new Date().toISOString());
    // 1. Cookies visible to JS
    setBrowserCookies(
      document.cookie
        .split(";")
        .map((c) => c.trim().split("=")[0])
        .filter(Boolean)
        .join(", ") || "(none)",
    );

    // 2. Browser-side session via Supabase client
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setBrowserSession("ERROR: " + error.message);
      } else if (!data.session) {
        setBrowserSession("no session");
      } else {
        setBrowserSession(
          `user=${data.session.user.email ?? data.session.user.id.slice(0, 8)} ` +
            `expires=${data.session.expires_at}`,
        );
      }
    } catch (e) {
      setBrowserSession("THREW: " + String(e));
    }

    // 3. Server view
    try {
      const r = await fetch("/api/debug/auth", { cache: "no-store" });
      const j = await r.json();
      setServer(j);
    } catch (e) {
      setServer("FETCH FAILED: " + String(e));
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main style={{ fontFamily: "ui-monospace, monospace", padding: 20, fontSize: 13 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700 }}>Auth Debug</h1>
      <p style={{ color: "#666" }}>Generated: {now}</p>
      <button
        onClick={refresh}
        style={{
          padding: "6px 12px",
          background: "#193b92",
          color: "white",
          border: 0,
          borderRadius: 6,
          marginBottom: 20,
        }}
      >
        Refresh
      </button>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>1. Cookies visible to browser JS:</h2>
        <pre style={{ background: "#f3f4f6", padding: 10, borderRadius: 6, whiteSpace: "pre-wrap" }}>
          {browserCookies}
        </pre>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>
          2. Browser Supabase client — getSession():
        </h2>
        <pre style={{ background: "#f3f4f6", padding: 10, borderRadius: 6 }}>
          {browserSession}
        </pre>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>3. Server view (/api/debug/auth):</h2>
        <pre
          style={{
            background: "#f3f4f6",
            padding: 10,
            borderRadius: 6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {typeof server === "string" ? server : JSON.stringify(server, null, 2)}
        </pre>
      </section>

      <hr />
      <p style={{ color: "#666", marginTop: 16 }}>
        How to use: 1) sign in via /login as usual. 2) Come straight here. 3) Copy
        everything above and paste back to assistant.
      </p>
    </main>
  );
}
