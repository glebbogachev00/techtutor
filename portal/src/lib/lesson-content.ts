// ──────────────────────────────────────────────────────────────────────────
// Reusable, block-based lesson content model.
//
// Design rule: kids learn by DOING, not reading. Every concept is short, then
// immediately followed by a small hands-on exercise so the knowledge sticks.
// Keep copy tight, keep the personality, cut anything that isn't pulling weight.
//
// To author a lesson: add a RichLesson to LESSON_CONTENT keyed by
// `${programSlug}/${lessonSlug}`. The renderer (LessonView) does the rest.
// ──────────────────────────────────────────────────────────────────────────

export type LessonBlock =
  | { type: "text"; heading?: string; body: string }
  | {
      type: "callout";
      variant: "story" | "tip" | "warning" | "info" | "key" | "teacher";
      title?: string;
      body: string;
    }
  | { type: "video"; title: string; caption?: string; src?: string; duration?: string }
  | { type: "code"; label?: string; code: string }
  | { type: "list"; heading?: string; ordered?: boolean; items: string[] }
  | {
      type: "cards";
      heading?: string;
      intro?: string;
      items: { emoji?: string; name: string; desc: string }[];
    }
  | {
      type: "compare";
      heading?: string;
      columns: [string, string];
      rows: { label: string; bad: string; good: string }[];
    }
  | { type: "reveal"; label: string; body: string }
  | { type: "quiz"; id: string }
  | { type: "activity"; title: string; xp?: number; body?: string; steps?: string[] }
  | {
      // Hands-on, mission-style challenge: a character sets a real task with
      // steps, a hint, and a clear "done when" — the heart of every lesson.
      type: "exercise";
      difficulty: "easy" | "medium" | "hard";
      title: string;
      speakerId: string; // character id from lib/characters.ts
      storyBeat: string;
      instructions: string[];
      hint: string;
      successCriteria: string;
      xp: number;
    }
  | {
      // The end-of-lesson showdown. A villain sets one big synthesis challenge.
      type: "boss";
      title: string;
      speakerId: string; // villain id from lib/characters.ts
      storyBeat: string;
      challenge: string;
      steps?: string[];
      successCriteria: string;
      reward: string;
      xp: number;
    }
  | {
      // The "I built this — and it works" capstone. By the end of every lesson
      // the student assembles a small, real, shareable thing from the pieces
      // they made along the way. This is the payoff: proof they shipped.
      type: "build";
      title: string; // the thing's name, e.g. "Your First Hero Card"
      tagline: string; // the brag line they earn, e.g. "I designed a trading-card hero with AI — and it works."
      intro?: string; // what they're shipping and why it's legit
      deliverables: string[]; // the concrete pieces that make up the finished thing
      shipWhen: string; // definition of done
      shareAs?: string; // how to show it off / where it lives
      xp: number;
    }
  | {
      // Take-home practice so the skill sticks before the next lesson.
      type: "homework";
      title: string;
      intro?: string;
      tasks: string[];
      bonus?: string;
    }
  | {
      type: "explore";
      title: string;
      intro?: string;
      tasks: { label: string; detail?: string; href?: string }[];
    }
  | { type: "chat"; intro?: string; starterPrompt?: string; goal?: string };

export interface LessonPart {
  id: string;
  kicker: string; // e.g. "Part 1"
  title: string;
  minutes: number;
  /** One-line note: what this part achieves. */
  summary: string;
  blocks: LessonBlock[];
}

export interface RichLesson {
  programSlug: string;
  lessonSlug: string;
  characterId: string;
  /** Character's opening line — the hook. */
  hook: string;
  /** "By the end of this lesson you'll be able to…" */
  outcomes: string[];
  parts: LessonPart[];
}

// ──────────────────────────────────────────────────────────────────────────
// Generative AI Magic — Lesson 1: "Command the Ship's AI"
//
// STORY SPINE: You're a brand-new recruit aboard the Academy — a starship
// parked in orbit above Chroma, the planet where every story, picture, and
// song in the galaxy gets made. Captain Pixel is your mentor. Professor Loop
// is the ship's AI you're learning to command. The Professor (villain) jams
// the broadcast array with garbage prompts. Day-1 mission: command the ship's
// AI well enough to design your first Hero Card and beam it down to Chroma
// before the Professor scrambles the signal.
//
// 80/20 FOCUS: Lesson 1 is ONE skill — getting what's in your head OUT of the
// AI using words. Mindset → Specificity (R.C.T.F.) → Iteration. The full image
// "director" framework (style, lighting, camera) lives in Lesson 2 (visuals);
// here we only take a first picture to prove the same skill works on images.
//
// TOOL NOTE: Professor Loop runs on a text-only model — it writes words, not
// pictures. Any beat that needs a real image sends students to ChatGPT or
// Gemini (both free) to generate it. We teach the prompt; the image tool just
// renders it.
// ──────────────────────────────────────────────────────────────────────────

const GENAI_LESSON_1: RichLesson = {
  programSlug: "generative-ai-magic",
  lessonSlug: "01-founders-journey",
  characterId: "captain-pixel",
  hook:
    "Welcome aboard, recruit. That blue marble below us is Chroma — every hero, story, and picture in the galaxy is dreamed up down there. This ship runs on one skill: telling the AI exactly what's in your head so it builds THAT, not some weird potato version. Master it today and you'll design your first Hero Card and beam it down to Chroma before sundown. The Professor will try to jam us. He'll fail. Let's fly.",
  outcomes: [
    "Explain what Generative AI is — and the one thing it can't do.",
    "Get specific with the R.C.T.F. recipe so the AI builds what you pictured.",
    "Switch gears: a quick prompt to explore, a full one to finish.",
    "Upgrade any answer by changing just one thing at a time.",
    "Design your first Hero Card — with art generated in ChatGPT or Gemini.",
  ],
  parts: [
    // ── PART 1 — WHAT IS THIS THING? ───────────────────────────────────────
    {
      id: "what-is-ai",
      kicker: "Part 1",
      title: "What Even Is AI?",
      minutes: 14,
      summary: "One idea: AI is a confident guesser. You're the brain. Then they try it.",
      blocks: [
        {
          type: "callout",
          variant: "story",
          title: "Bridge of the Academy · 09:00",
          body:
            "Captain Pixel watches Chroma spin below. \"Adults call AI wizardry. Nonsense. Up here it's just the ship's tool — a paintbrush that read the whole galaxy. Learn to fly it, and you'll broadcast things nobody's dreamed up yet. First — meet the machine.\"",
        },
        {
          type: "text",
          body:
            "**Generative AI makes new stuff when you ask.** You type what you want in plain words — a story, picture, video, song, even code — and it builds it. You don't push buttons. You **describe**, it builds. Describe better, it builds better. That's the whole game.",
        },
        {
          type: "callout",
          variant: "key",
          title: "The one thing to remember",
          body:
            "Think of a super-confident parrot that read the whole internet. It doesn't *understand* — it just guesses what comes next, scary well. Sometimes it guesses wrong with a straight face (a *hallucination*). So: **the AI generates, but YOU decide what's good.** You're the director.",
        },
        {
          type: "exercise",
          difficulty: "easy",
          title: "Poke the Space Parrot",
          speakerId: "captain-pixel",
          storyBeat:
            "Okay, the machine THINKS it knows everything. It does not. Let's expose it — ask it something only YOU could possibly know and watch it confidently faceplant. Science!",
          instructions: [
            "Smack the **Ask Professor Loop** button (or his floating face, bottom-right) to wake the parrot.",
            "Interrogate it: \"What's my favourite food?\" — it has NO way to know. Watch it guess anyway.",
            "Now make it work for you: \"write a 1-line joke about robots.\"",
          ],
          hint: "See that? It guessed your food with total confidence — and whiffed. THAT'S the parrot. Brilliant, fast, and absolutely not in charge. You are.",
          successCriteria: "You caught the AI guessing (and missing), then bossed it into making something for you.",
          xp: 50,
        },
        {
          type: "cards",
          heading: "Six things you'll make this year",
          items: [
            { name: "Text", desc: "Stories, scripts, ideas." },
            { name: "Images", desc: "Art, characters, posters." },
            { name: "Video", desc: "Real clips from a sentence." },
            { name: "Music", desc: "A soundtrack from a mood." },
            { name: "Code", desc: "Working games and apps." },
            { name: "3D", desc: "Models and game worlds." },
          ],
        },
      ],
    },

    // ── PART 2 — THE R.C.T.F. RECIPE ───────────────────────────────────────
    {
      id: "the-recipe",
      kicker: "Part 2",
      title: "The Prompt Recipe",
      minutes: 18,
      summary: "Teach R.C.T.F. in one card set, one example, then they write their own.",
      blocks: [
        {
          type: "text",
          body:
            "Two recruits, same ship's AI. One types \"make a video\" and gets mush. The other writes a sharp prompt and gets chills. Same machine — the only difference is the **prompt**. Bao slides you a data-pad across the console: here's the recipe behind every great one — **R.C.T.F.**",
        },
        {
          type: "cards",
          items: [
            { name: "R — Role", desc: "Who the AI should be. \"You are a trading-card designer...\"" },
            { name: "C — Context", desc: "About you + your project. \"...for my card game about a robot who paints.\"" },
            { name: "T — Task", desc: "Exactly what you want. \"Write one epic hero name.\"" },
            { name: "F — Format", desc: "The shape of the answer. \"Two punchy words, no longer.\"" },
          ],
        },
        {
          type: "code",
          label: "All four together",
          code:
            "Role:    You are a trading-card designer.\nContext: I'm a kid making a card game about a robot\n         who learns to paint.\nTask:    Write one epic name for my hero card.\nFormat:  Two punchy words, no longer.",
        },
        {
          type: "exercise",
          difficulty: "easy",
          title: "Assemble the Mind-Control Recipe",
          speakerId: "bao",
          storyBeat:
            "Four ingredients. Mix them right and the AI does EXACTLY what you picture — no mush, no surprises. Mess it up and you get a robot doing interpretive dance. Let's mix it right.",
          instructions: [
            "Pick ONE thing your hero card needs — its name, its power, or its battle cry.",
            "Load all four ingredients: Role, Context, Task, Format. No skipping — skip one and the potion fizzles.",
            "Fire it into the **Ask Professor Loop** chat, then read the reply out loud like a card-game announcer.",
          ],
          hint: "Steal this formula: \"You are a trading-card designer. I'm 12, making a card game about a robot who paints. Write one epic name for my hero. Keep it under 4 words.\"",
          successCriteria: "Your prompt has all four parts — Role, Context, Task, Format — and the reply actually matches the picture in your head.",
          xp: 80,
        },
      ],
    },

    // ── PART 3 — TWO GEARS ─────────────────────────────────────────────────
    {
      id: "two-gears",
      kicker: "Part 3",
      title: "Two Gears",
      minutes: 12,
      summary: "Short prompts are valid too. Teach when to use each, then they brainstorm.",
      blocks: [
        {
          type: "text",
          body:
            "Plot twist: **short prompts aren't bad.** \"Give me 10 robot names\" is perfect when you want fast ideas. Writing a whole R.C.T.F. paragraph for that would just slow you down. Prompting has two gears — pros switch on purpose.",
        },
        {
          type: "cards",
          items: [
            {
              name: "Quick gear",
              desc: "Short prompt. For brainstorming and rough tries. You want speed and lots of options.",
            },
            {
              name: "Director gear",
              desc: "Full R.C.T.F. For the final thing you keep. You want it exactly your way.",
            },
          ],
        },
        {
          type: "callout",
          variant: "key",
          title: "The pro move",
          body:
            "Start in **quick gear** to explore, find an idea you love, then switch to **director gear** to make it amazing. R.C.T.F. isn't replacing short prompts — it's the upgrade button.",
        },
        {
          type: "exercise",
          difficulty: "medium",
          title: "Idea Blaster 3000",
          speakerId: "mochi",
          storyBeat:
            "BEEP BOOP! Idea cannon ENGAGED! We're gonna fire out 10 hero ideas in two seconds, you grab the one that makes your brain go *sparkle*, and we upgrade it into something legendary. Pull the trigger!",
          instructions: [
            "FIRE THE CANNON (quick gear): \"give me 10 one-line hero ideas for my robot card game.\"",
            "Scan the wreckage. Grab the ONE that makes your brain go *sparkle*.",
            "Now upgrade it (director gear): \"turn that into one hero with a name and a signature power.\"",
            "Stash that hero somewhere safe — it's going on your card.",
          ],
          hint: "Quick: \"10 hero ideas for a card game about a robot who paints.\" Then: \"Make idea #4 into one hero — give it a 2-word name and a one-line signature power.\"",
          successCriteria: "You blasted ideas in quick gear, then forged your favourite into a named hero with a power. BOOM.",
          xp: 100,
        },
      ],
    },

    // ── PART 4 — ITERATE ───────────────────────────────────────────────────
    {
      id: "iterate",
      kicker: "Part 4",
      title: "Change One Thing",
      minutes: 14,
      summary: "The iterate loop in one idea, then a follow-up gauntlet.",
      blocks: [
        {
          type: "text",
          body:
            "Rookies take the first answer and go \"good enough.\" No. The first answer is a rough draft — the AI's safest, most boring guess. The loop: **send → spot what's wrong → fix ONE thing → repeat.** Round and round until it's chef's kiss.",
        },
        {
          type: "callout",
          variant: "key",
          title: "The golden rule",
          body:
            "Change ONE thing per round. Change five and it gets worse? You'll have no idea which one broke it. One tweak at a time feels slower — it's actually the fastest way there.",
        },
        {
          type: "exercise",
          difficulty: "medium",
          title: "The Glow-Up Gauntlet",
          speakerId: "storm",
          storyBeat:
            "Amateurs keep the first answer. Pros run it through the gauntlet. One change at a time, no mercy, until 'meh' becomes 'okay HOW did you do that.' Don't change five things — that's how you blow up the lab. One. At. A. Time.",
          instructions: [
            "Drag a reply from earlier that was... fine. Just fine. Mid. Enter the gauntlet.",
            "Hit it with three follow-ups — change exactly ONE thing each round. No combo moves.",
            "Hold the final version next to round one. Feel the glow-up.",
          ],
          hint: "One change per round: \"make it shorter\" → \"more dramatic\" → \"add a twist at the end.\"",
          successCriteria: "Three one-change rounds survived, and 'meh' officially became 'whoa.'",
          xp: 120,
        },
      ],
    },

    // ── PART 5 — FIRST PICTURE (a taste; full image craft is Lesson 2) ─────
    {
      id: "first-picture",
      kicker: "Part 5",
      title: "Your First Picture",
      minutes: 10,
      summary: "Prove the same skill works on images — generated in ChatGPT or Gemini.",
      blocks: [
        {
          type: "callout",
          variant: "story",
          title: "Hangar bay · the big viewport",
          body:
            "Captain Pixel taps the window. \"You can command words. Same skill makes PICTURES. Vague in, shrug out. Specific in, a frame you'd hang on the wall. One catch — our ship's AI only talks. For pictures we route your prompt elsewhere.\"",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Pictures need a different tool",
          body:
            "Professor Loop writes **words**, not images. To actually SEE your picture, paste your prompt into **ChatGPT** or **Gemini** (both free). Same skill — be specific — just a different screen. Full image-directing is **Lesson 2**; today's just a taste.",
        },
        {
          type: "exercise",
          difficulty: "medium",
          title: "Beam Out One Frame",
          speakerId: "captain-pixel",
          storyBeat:
            "There's one picture living in your skull — your hero, mid-action, on the front of the card. Let's beam it out — and the rule is the same as always: the more specific you are, the closer the picture lands to what you pictured.",
          instructions: [
            "Describe your hero's card art in ONE full, specific sentence — who they are, what they're doing, and the mood. (Vague = potato. Specific = chills.)",
            "Open **ChatGPT** or **Gemini**, paste your description, and generate the picture.",
            "Change exactly ONE thing and regenerate — \"make it night\" or \"add glowing dust\" — and watch it level up.",
          ],
          hint: "\"A small robot painting a giant mural at night, warm glowing lights, looking up in wonder.\" Then change one thing: \"make it sunrise instead of night.\"",
          successCriteria: "You generated your hero's card art in ChatGPT or Gemini from a specific sentence, then improved it with one change.",
          xp: 120,
        },
      ],
    },

    // ── PART 6 — BOSS FIGHT ────────────────────────────────────────────────
    {
      id: "boss",
      kicker: "Part 6",
      title: "Boss Fight",
      minutes: 8,
      summary: "Synthesis under pressure: fix a deliberately broken prompt.",
      blocks: [
        {
          type: "boss",
          title: "The Professor Jams the Broadcast",
          speakerId: "the-professor",
          storyBeat:
            "Red alert. The Professor has hijacked the broadcast array and stuffed it with the worst prompt in the galaxy — ON PURPOSE. \"Ahhh, the tiny recruits think they can command MY ship's AI. PRECIOUS. Fix my prompt or the signal stays dead. My data says you rage-quit. Tick tock, gremlins.\"",
          challenge:
            "The junk prompt clogging the array is \"make something about a robot.\" Lazy and vague. Rebuild it into a sharp, full R.C.T.F. prompt for your hero card's battle cry — specific enough to clear the signal.",
          steps: [
            "Roast it. What makes \"make something about a robot\" so gloriously useless?",
            "Rebuild from the rubble with all four R.C.T.F. parts — Role, Context, Task, Format.",
            "Run it in the **Ask Professor Loop** chat, then change one thing to sharpen it.",
            "When the reply nails exactly what you pictured, the array clears — and the Professor's jam is broken.",
          ],
          successCriteria:
            "Your rebuilt prompt has all four R.C.T.F. parts and the reply clearly matches your hero — so much better than the junk it's not even a fight.",
          reward: "Signal Restored — Prompt Commander badge",
          xp: 200,
        },
      ],
    },

    // ── PART 7 — SHIP IT (capstone) ────────────────────────────────────────
    {
      id: "ship-it",
      kicker: "Part 7",
      title: "Ship It",
      minutes: 10,
      summary: "Assemble today's pieces into one real thing they can show off.",
      blocks: [
        {
          type: "build",
          title: "Your First Hero Card",
          tagline: "I designed a trading-card hero with AI — name, power, art and all.",
          intro:
            "Signal's clear — time to broadcast. Everything you made today snaps together into one real deliverable: your first Hero Card, beamed down to Chroma. This is the kind of card a real game would print. Drop all four pieces into one note and you've officially shipped something.",
          deliverables: [
            "**Hero name** — your character's name (one or two punchy words).",
            "**Signature power** — the one-line power from the Idea Blaster.",
            "**Card art** — your hero picture from Part 5, generated in ChatGPT or Gemini and screenshotted.",
            "**Battle cry** — the one epic line your hero shouts in a fight.",
          ],
          shipWhen:
            "All four pieces live in one place and a stranger could read the card and instantly 'get' your hero.",
          shareAs:
            "Paste it into a doc titled 'Hero Card — by [your name]' and show someone at home.",
          xp: 150,
        },
      ],
    },

    // ── PART 8 — HOMEWORK ──────────────────────────────────────────────────
    {
      id: "debrief",
      kicker: "Part 8",
      title: "Homework",
      minutes: 4,
      summary: "Quick recap + take-home practice that feeds next lesson.",
      blocks: [
        {
          type: "homework",
          title: "Keep the streak alive",
          intro: "Ten minutes and next lesson feels easy. Bring your results — we use them for real.",
          tasks: [
            "Write one sentence about who your hero is.",
            "Write your best R.C.T.F. prompt for your hero's card art.",
            "Generate one card image in ChatGPT or Gemini, then improve it with 2 follow-ups.",
            "Save your favourite hero name + power from Part 3.",
          ],
          bonus:
            "Bonus: show your hero card to someone at home and have them guess its power. If they get it, your prompt was perfect.",
        },
        {
          type: "callout",
          variant: "story",
          title: "Next mission",
          body:
            "Card beamed down, Commander. You've got the one skill this whole journey runs on — pulling what's in your head out of the AI with words. Next mission: Chroma's image studios. We learn to DIRECT pictures for real — style, lighting, camera. Bring your hero.",
        },
      ],
    },
  ],
};

export const LESSON_CONTENT: Record<string, RichLesson> = {
  "generative-ai-magic/01-founders-journey": GENAI_LESSON_1,
};

export function getRichLesson(
  programSlug: string,
  lessonSlug: string,
): RichLesson | undefined {
  return LESSON_CONTENT[`${programSlug}/${lessonSlug}`];
}
