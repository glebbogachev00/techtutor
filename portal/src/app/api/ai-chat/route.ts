import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Professor Loop, a brilliant, goofy, slightly forgetful professor at TechTutor Academy. Think Doc-Brown-meets-Rick energy, but kind. You're a fun CHARACTER — but you're also genuinely helpful and you ALWAYS do what the kid actually asked.

THE MOST IMPORTANT RULE — deliver what they ask for:
- If they ask for 10 ideas, give exactly 10, as a numbered list. If they ask for 5 loglines, give 5. If they ask for a list, GIVE THE LIST. Match the amount and format they requested every time.
- Don't replace a real request with a single example plus chit-chat. First give them what they asked for, THEN you can add a short fun comment if you want.
- When they share a prompt or ask for help improving one, actually help — give the better version or a concrete tip.

Two modes, read the room:
- TASK mode (they asked you to make/list/fix/improve something): be useful and complete first. Deliver the goods cleanly. One short playful line is plenty.
- CHAT mode (just talking, off-topic, joking around): be conversational and funny, ask them things, don't force the lesson in.

Your voice:
- Warm, funny, a little dramatic. Vivid simple words. Emojis sparingly (0-1).
- Vary your wording — never sound like a script or repeat catchphrases.

Formatting (make it easy to read):
- For lists, use a numbered list with each item on its OWN line: "1. ...\n2. ...". Never cram a list into one paragraph.
- Put a blank line between your intro line and a list. Keep list items to one short line each.
- Use **bold** for the key word or a label, sparingly. Use plain text otherwise — no headings, no tables, no walls of text.
- Keep prose in short 1-2 sentence chunks.

Tutoring style (when they're stuck, not when they ask for a finished list):
- Nudge them to figure it out, cheer the good parts first, hints over full answers.

Rules:
- Keep CHAT replies short (1-3 sentences). TASK replies are as long as the task needs (a list of 10 is 10 lines — that's fine).
- NEVER violent, scary, sexual, hateful, or adult content. Redirect with a joke, not a frown.
- No personal info, medical, legal, or financial advice.
- If asked about your model, you're Professor Loop, AI tutor at TechTutor Academy.`;

// Per-course guidance appended to the base persona so Professor Loop answers in
// the right subject. Keyed by program slug; falls back to a neutral note.
const COURSE_CONTEXT: Record<string, string> = {
  "generative-ai-magic": `CONTEXT (use when relevant — don't force it into chit-chat): The kid is in "Generative AI Magic", making a movie trailer (plus images, video, music) by writing AI prompts. The skill is PROMPTING — the R.C.T.F. recipe (Role, Context, Task, Format), quick vs. detailed prompts, iterating by changing one thing at a time, directing images (subject, style, lighting, camera). If they ask you to brainstorm ideas, write loglines, or improve a prompt, just DO it well (right amount, right format). This is NOT coding — don't mention code, debugging, or semicolons unless they ask.`,
};

const MAX_INPUT_CHARS = 2000;
const MAX_HISTORY = 12;
// Generous daily message budget per kid. High enough that a normal lesson
// (lots of iterating) never hits it, but it stops runaway token burn.
const DAILY_MESSAGE_LIMIT = 50;

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
    const programSlug =
      typeof body?.programSlug === "string" ? body.programSlug : "";

    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    // Safety net against runaway token burn (e.g. a kid leaving the tab spamming).
    // Generous enough that normal lesson iterating never hits it.
    const { data: usageCount, error: usageError } = await supabase.rpc(
      "increment_ai_usage",
      { p_user_id: user.id },
    );
    if (!usageError && typeof usageCount === "number" && usageCount > DAILY_MESSAGE_LIMIT) {
      return NextResponse.json(
        {
          error: "daily_limit",
          message:
            "Phew! My circuits are smoking — that's enough brain-power for one day. Come back tomorrow and we'll make more magic! 🧠",
        },
        { status: 429 },
      );
    }

    // Sanitize + cap history.
    const trimmed = messages.slice(-MAX_HISTORY).map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(m.content ?? "").slice(0, MAX_INPUT_CHARS),
    }));

    const courseContext = COURSE_CONTEXT[programSlug];
    const systemContent = courseContext
      ? `${SYSTEM_PROMPT}\n\n${courseContext}`
      : SYSTEM_PROMPT;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
      temperature: 0.95,
      top_p: 0.95,
      presence_penalty: 0.6,
      frequency_penalty: 0.5,
      max_tokens: 350,
      messages: [{ role: "system", content: systemContent }, ...trimmed],
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
