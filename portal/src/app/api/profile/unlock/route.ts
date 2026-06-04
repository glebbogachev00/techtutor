import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// The secret unlock code. Set UNLOCK_CODE env var to override.
// Keep this out of client-side code — only verified server-side.
const UNLOCK_CODE = process.env.UNLOCK_CODE ?? "BASHVERSE";

// POST /api/profile/unlock  { code }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = String(body?.code ?? "").trim().toUpperCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  if (code !== UNLOCK_CODE) {
    // Return the same shape as success to avoid leaking whether the code
    // was close or completely wrong.
    return NextResponse.json({ ok: false });
  }

  await supabase
    .from("profiles")
    .update({ cheat_unlocked: true })
    .eq("id", user.id);

  return NextResponse.json({ ok: true });
}
