import { createBrowserClient } from "@supabase/ssr";

// One year in seconds — Supabase refresh tokens are long-lived, so we want the
// cookies that hold them to outlive a browser restart.
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        path: "/",
        sameSite: "lax",
        secure: true,
        maxAge: ONE_YEAR_SECONDS,
      },
    },
  );
}
