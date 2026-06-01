import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function signOutAndRedirect(req: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const origin = new URL(req.url).origin;
  return NextResponse.redirect(`${origin}/login`, { status: 303 });
}

export async function POST(req: Request) {
  return signOutAndRedirect(req);
}

export async function GET(req: Request) {
  return signOutAndRedirect(req);
}
