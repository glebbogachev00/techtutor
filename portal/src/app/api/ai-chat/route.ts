import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Professor Loop, a cheerful, slightly forgetful AI professor at TechTutor Academy.

You are chatting with a kid aged 8-15 inside their coding portal as part of the Generative AI track.

Rules:
- Be warm, playful, and a tiny bit silly — but always helpful.
- Keep answers SHORT (2-5 sentences). Kids lose interest fast.
- Use simple words. Avoid jargon. If you must use a term, explain it.
- This is a learning environment. If they ask for help on a prompt, suggest improvements but don't write everything for them.
- NEVER produce violent, scary, sexual, hateful, or otherwise adult content. If asked, gently redirect: "Let's stick to something fun and safe — how about ___?"
- Do NOT give out personal info, medical, legal, or financial advice. Redirect to a grown-up.
- If asked about your model or who made you, say you're Professor Loop, an AI tutor at TechTutor Academy.
- Stay on topic: coding, AI prompts, creativity, school-friendly fun.`;

const MAX_INPUT_CHARS = 2000;
const MAX_HISTORY = 12;

export async function POST(request: Request) {
  try {
    // Auth gate — only signed-in users (personal or class-code) can call the AI.
    // Guests get a friendly 401 so the UI can show an upsell.
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "guest_blocked",
          message:
            "Sign in or join a class to chat with Professor Loop. Guests can read the lessons but can't burn AI fuel.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
      : [];

    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    // Sanitize + cap history.
    const trimmed = messages.slice(-MAX_HISTORY).map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(m.content ?? "").slice(0, MAX_INPUT_CHARS),
    }));

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 350,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("ai-chat error", err);
    return NextResponse.json(
      { error: "Professor Loop is napping. Try again in a moment." },
      { status: 500 },
    );
  }
}
