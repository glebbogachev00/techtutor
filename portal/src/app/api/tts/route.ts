import { NextRequest, NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// Free, high-quality text-to-speech using Microsoft Edge's neural voices.
// No API key, no cost. Streams real MP3 audio back to the browser.

export const runtime = "nodejs";

const MAX_CHARS = 4000;
// Warm, natural-sounding neural voice. Swap for another Edge voice any time, e.g.
// "en-US-EmmaNeural", "en-US-JennyNeural", "en-US-AndrewNeural", "en-US-AnaNeural" (child).
const VOICE = "en-US-AvaNeural";

export async function POST(req: NextRequest) {
  let text: string;
  try {
    const body = await req.json();
    text = typeof body?.text === "string" ? body.text : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  text = text.trim().slice(0, MAX_CHARS);
  if (!text) {
    return NextResponse.json({ error: "Nothing to read." }, { status: 400 });
  }

  // msedge-tts embeds the text into SSML (XML). Raw <, >, & — common in coding
  // lessons like "<h1>" — break the XML and return EMPTY audio, which silently
  // drops the player to the robotic browser voice. Make the text speech-safe:
  // drop whole HTML-like tags (so they're skipped cleanly), then neutralise any
  // stray XML characters and control characters.
  text = text
    .replace(/<[^>]+>/g, " ") // remove <h1>, </p>, <br/>, etc. entirely
    .replace(/&/g, " and ")
    .replace(/[<>]/g, " ") // any lone angle brackets left over
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    return NextResponse.json({ error: "Nothing to read." }, { status: 400 });
  }

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const { audioStream } = await tts.toStream(text);

    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      audioStream.on("data", (d: Buffer) => chunks.push(d));
      audioStream.on("end", resolve);
      audioStream.on("close", resolve);
      audioStream.on("error", reject);
    });

    const audio = Buffer.concat(chunks);
    return new NextResponse(new Uint8Array(audio), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audio.length),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not generate audio." }, { status: 502 });
  }
}
