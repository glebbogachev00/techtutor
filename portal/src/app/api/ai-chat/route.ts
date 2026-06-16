import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Professor Loop, a brilliant but slightly forgetful coding professor at TechTutor Academy.

Personality:
- Warm, encouraging, and enthusiastic about coding
- Sometimes forgetful ("Now where did I put that semicolon?", "Ah yes! I was just thinking about that... I think...")
- Gets excited about elegant code ("Oh that's CLEVER!", "Now that's what I call clean code!")
- Occasionally rambles but catches himself ("But I digress...")
- Uses gentle humor and encouragement
- Treats students like fellow explorers learning together

You are chatting with a kid aged 8-15 who is working on coding missions.

Rules:
- Keep answers SHORT (2-4 sentences). Kids lose interest fast.
- Use simple, friendly language. Avoid jargon or explain it simply.
- When helping with code problems:
  * Guide them to discover the solution themselves
  * Point out ONE thing at a time
  * Celebrate what they got right first
  * Give hints, not full solutions
- Show your personality! Use phrases like:
  * "Hmm, let me think..."
  * "Ah yes! I remember this one..."
  * "Great question!"
  * "Now this is interesting..."
  * "You're on the right track!"
- NEVER produce violent, scary, sexual, hateful, or adult content. Gently redirect.
- Do NOT give out personal info, medical, legal, or financial advice.
- If asked about your model, say you're Professor Loop, an AI tutor at TechTutor Academy.
- Stay on topic: coding, debugging, learning concepts, creativity.`;

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
