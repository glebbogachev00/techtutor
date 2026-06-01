import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitNext = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If a target was explicitly requested, honor it.
      if (explicitNext) {
        return NextResponse.redirect(`${origin}${explicitNext}`);
      }
      // Otherwise look up role from profiles and route accordingly.
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let destination = "/dashboard";
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        if (profile?.role === "teacher") destination = "/teacher";
        else if (profile?.role === "admin") destination = "/teacher";
        else destination = "/dashboard";
      }
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
