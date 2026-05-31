import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type ReviewResult = {
  status: "passed" | "needs_work";
  feedback: string;
};

function buildSystemPrompt(locale: string) {
  const lang = locale === "vn" ? "Vietnamese" : "English";
  return `You are a friendly, encouraging coding tutor for children aged 8-15 at TechTutor Academy.

You are reviewing a kid's code submission for a small coding mission.

Rules:
- Reply in ${lang}.
- Keep it short: 2-4 short sentences max.
- Be warm and specific. Celebrate what they did well.
- If something is wrong, give ONE clear hint — never the full solution.
- Use simple words. Avoid jargon.
- End your reply with one line in this exact format on its own line:
  VERDICT: passed
  OR
  VERDICT: needs_work

A submission "passed" only if it clearly meets the expected outcome. When unsure, mark needs_work.`;
}

function parseAIResponse(text: string): ReviewResult {
  const lines = text.trim().split(/\r?\n/);
  let status: ReviewResult["status"] = "needs_work";
  const feedbackLines: string[] = [];
  for (const line of lines) {
    const match = line.match(/^\s*VERDICT\s*:\s*(passed|needs_work)\s*$/i);
    if (match) {
      status = match[1].toLowerCase() as ReviewResult["status"];
    } else {
      feedbackLines.push(line);
    }
  }
  return { status, feedback: feedbackLines.join("\n").trim() };
}

export async function POST(request: Request) {
  try {
    const { missionId, code, locale } = await request.json();
    if (!missionId || typeof code !== "string") {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    if (code.length > 20000) {
      return NextResponse.json({ error: "Code too long" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: mission } = await supabase
      .from("missions")
      .select("title_en, brief_en, expected_outcome, language, xp_reward")
      .eq("id", missionId)
      .maybeSingle();

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    const userPrompt = `Mission: ${mission.title_en}
Language: ${mission.language}
Brief: ${mission.brief_en}
Expected outcome: ${mission.expected_outcome}

Student's code:
\`\`\`${mission.language}
${code}
\`\`\`

Review the code and give the student feedback.`;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 400,
      messages: [
        { role: "system", content: buildSystemPrompt(locale ?? "en") },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const { status, feedback } = parseAIResponse(raw);

    // Save submission
    await supabase.from("submissions").insert({
      user_id: user.id,
      mission_id: missionId,
      code,
      status,
      ai_feedback: feedback,
    });

    // Award XP if passed and not already awarded
    if (status === "passed") {
      await supabase.from("progress").upsert(
        {
          user_id: user.id,
          mission_id: missionId,
          xp_earned: mission.xp_reward,
        },
        { onConflict: "user_id,mission_id" },
      );
    }

    return NextResponse.json({ status, feedback });
  } catch (err) {
    console.error("review error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}
