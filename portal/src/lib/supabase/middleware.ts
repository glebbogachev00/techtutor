import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        path: "/",
        sameSite: "lax",
        secure: true,
        maxAge: ONE_YEAR_SECONDS,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Use getSession() here so middleware only makes a Supabase network call when
  // the access token is actually expired. Using getUser() on every request
  // causes concurrent refresh attempts across parallel API calls, which makes
  // Supabase invalidate the session immediately after login.
  // Individual pages/routes still call getUser() for authoritative auth checks.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const { pathname } = request.nextUrl;
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/parent") ||
    pathname.startsWith("/admin");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    const redirectResponse = NextResponse.redirect(url);
    // Preserve any refreshed-session cookies Supabase wrote to supabaseResponse.
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}
