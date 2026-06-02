import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// GET /api/debug/auth — returns what the server sees about your session.
// Safe to leave deployed: only reveals presence/length of cookie names.
export async function GET() {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  const cookieInfo = all.map((c) => ({
    name: c.name,
    valueLength: c.value?.length ?? 0,
  }));

  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  const sessionRes = await supabase.auth.getSession();

  return NextResponse.json({
    cookieCount: all.length,
    cookies: cookieInfo,
    user: userRes.data?.user
      ? { id: userRes.data.user.id, email: userRes.data.user.email }
      : null,
    userError: userRes.error?.message ?? null,
    session: sessionRes.data?.session
      ? {
          expiresAt: sessionRes.data.session.expires_at,
          tokenLength: sessionRes.data.session.access_token.length,
        }
      : null,
    sessionError: sessionRes.error?.message ?? null,
    env: {
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      urlHost: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
        : null,
    },
  });
}
