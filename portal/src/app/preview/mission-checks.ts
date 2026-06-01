// Per-mission validators. Looks up by track + mission number.
// A check returns { ok: true } if the student's code satisfies the task,
// or { ok: false, hint } with a friendly nudge.

export type CheckResult = { ok: boolean; hint?: string };
export type Check = (code: string, output: string) => CheckResult;

const has = (code: string, needle: string | RegExp) =>
  typeof needle === "string"
    ? code.toLowerCase().includes(needle.toLowerCase())
    : needle.test(code);

const countMatches = (code: string, re: RegExp) =>
  (code.match(re) ?? []).length;

// Helper: at least one of these must be present.
const requireAny = (
  code: string,
  patterns: (string | RegExp)[],
  hint: string,
): CheckResult => {
  return patterns.some((p) => has(code, p))
    ? { ok: true }
    : { ok: false, hint };
};

// Helper: the line must differ from the starter (user actually edited).
const mustChange = (
  code: string,
  starter: string,
  hint: string,
): CheckResult => {
  const a = code.replace(/\s+/g, " ").trim();
  const b = starter.replace(/\s+/g, " ").trim();
  return a !== b ? { ok: true } : { ok: false, hint };
};

// ─────────────────────────────────────────────────────────────────────────────
// Web track
// ─────────────────────────────────────────────────────────────────────────────
const WEB: Record<number, Check> = {
  1: (code) => {
    if (/<h1>\s*hello,?\s*world!?\s*<\/h1>/i.test(code)) {
      return {
        ok: false,
        hint: "Replace 'Hello, world!' with your own name inside the <h1> tags.",
      };
    }
    const m = code.match(/<h1>([\s\S]*?)<\/h1>/i);
    return m && m[1].trim().length > 0
      ? { ok: true }
      : { ok: false, hint: "Put your name between the <h1> and </h1> tags." };
  },
  2: (code) => {
    const h2 = /<h2[^>]*>[\s\S]*?<\/h2>/i.test(code);
    const pCount = countMatches(code, /<p[^>]*>[\s\S]*?<\/p>/gi);
    if (!h2)
      return { ok: false, hint: "Add an <h2>...</h2> heading below the <h1>." };
    if (pCount < 2)
      return { ok: false, hint: "Add a second <p>...</p> paragraph." };
    return { ok: true };
  },
  3: (code) =>
    /src=["']https?:\/\/[^"']*placekitten\.com\/300\/200["']/i.test(code)
      ? { ok: false, hint: "Change the img src to a different URL." }
      : /<img[^>]*src=["'][^"']+["']/i.test(code)
        ? { ok: true }
        : { ok: false, hint: "Keep the <img> tag and give it a new src URL." },
  4: (code) => {
    const links = countMatches(code, /<a[^>]*href=["'][^"']+["'][^>]*>/gi);
    if (links < 2)
      return { ok: false, hint: "Add a second <a href=...>link</a>." };
    return /techtutor\.academy/i.test(code)
      ? { ok: true }
      : {
          ok: false,
          hint: "One of the links should point to techtutor.academy.",
        };
  },
  5: (code) => {
    const items = countMatches(code, /<li[^>]*>[\s\S]*?<\/li>/gi);
    return items >= 4
      ? { ok: true }
      : { ok: false, hint: "Add three more <li>...</li> items (4 total)." };
  },
  6: (code) =>
    /color\s*:\s*#?2c7a7b/i.test(code) &&
    /background\s*:\s*(white|#fff(fff)?)/i.test(code)
      ? { ok: true }
      : {
          ok: false,
          hint: "Set h1 color to #2C7A7B and body background to white.",
        },
  7: (code, _o) => {
    // starter has background: #193b92
    const match = code.match(/\.btn\s*\{[\s\S]*?background\s*:\s*([^;]+);/i);
    if (!match)
      return { ok: false, hint: "Keep the .btn rule with a background color." };
    return /#193b92/i.test(match[1])
      ? { ok: false, hint: "Pick a NEW background color for .btn." }
      : { ok: true };
  },
  8: (code) => {
    const m = code.match(
      /textContent\s*=\s*["']([^"']*)["']/i,
    );
    if (!m)
      return {
        ok: false,
        hint: "Keep the onclick that sets textContent on #title.",
      };
    return m[1].trim().length > 0 && m[1] !== "Hello!"
      ? { ok: true }
      : { ok: false, hint: "Change the new heading text to something fun." };
  },
  9: (code, _o) =>
    requireAny(
      code,
      [/<img[^>]*src=/i, /<h2[^>]*>[\s\S]{2,}<\/h2>/i],
      "Add your name, a photo (<img>) and a few details to the card.",
    ),
  10: (code) =>
    /display\s*:\s*flex/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Add display: flex to the wrapping <div>." },
  11: (code) =>
    /button:hover\s*\{[^}]*background/i.test(code)
      ? { ok: true }
      : {
          ok: false,
          hint: "Add a button:hover { background: ... } rule.",
        },
  12: (code) => {
    const inputs = countMatches(code, /<input[^>]*>/gi);
    if (inputs < 2)
      return { ok: false, hint: "Add a second <input /> for age." };
    if (!/type=["']submit["']/i.test(code))
      return {
        ok: false,
        hint: 'Add a <button type="submit">...</button>.',
      };
    return { ok: true };
  },
  13: (code) =>
    /\.card\s*\{[^}]*box-shadow/i.test(code) &&
    /\.card\s*\{[^}]*border-radius/i.test(code) &&
    /\.card\s*\{[^}]*padding/i.test(code)
      ? { ok: true }
      : {
          ok: false,
          hint: "The .card rule needs padding, border-radius, AND box-shadow.",
        },
  14: (code) =>
    /document\.getElementById\(["']greeting["']\)/i.test(code) &&
    /let\s+name\s*=\s*["'][^"']+["']/i.test(code)
      ? { ok: true }
      : {
          ok: false,
          hint: "Set name to your name, then put it into #greeting.",
        },
  15: (code) =>
    /if\s*\(/i.test(code) &&
    /===?\s*7/i.test(code) &&
    /(yes|no)/i.test(code)
      ? { ok: true }
      : {
          ok: false,
          hint: "Inside check(), use an if to compare guess to 7 and show YES or no.",
        },
};

// ─────────────────────────────────────────────────────────────────────────────
// Python track
// ─────────────────────────────────────────────────────────────────────────────
const PY: Record<number, Check> = {
  1: (code, output) =>
    /print\s*\(/i.test(code) && !/Hello,\s*world!?/i.test(output)
      ? { ok: true }
      : { ok: false, hint: "Change the message inside print() to your name." },
  2: (code) =>
    /\bage\s*=\s*\d+/i.test(code) && /print\s*\([^)]*age[^)]*\)/i.test(code)
      ? { ok: true }
      : {
          ok: false,
          hint: "Create an age variable with a number, then print(age).",
        },
  3: (_c, output) =>
    /\b56\b/.test(output)
      ? { ok: true }
      : { ok: false, hint: "print(7 * 8) — the output should show 56." },
  4: (code, output) =>
    /\bage\s*=\s*\d+/i.test(code) && /teenager/i.test(output)
      ? { ok: true }
      : {
          ok: false,
          hint: "Change age to 13 or higher so the output prints 'teenager'.",
        },
  5: (code, output) => {
    if (!/range\s*\(\s*1\s*,\s*11\s*\)/.test(code))
      return { ok: false, hint: "Use range(1, 11) to count 1 through 10." };
    return /\b10\b/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Run it — the output should include 10." };
  },
  6: (code) => {
    const m = code.match(/colors\s*=\s*\[([^\]]*)\]/i);
    if (!m) return { ok: false, hint: "Keep the colors list." };
    const items = m[1].split(",").filter((s) => s.trim().length > 0);
    return items.length >= 4
      ? { ok: true }
      : { ok: false, hint: "Add two more colors to the list (4 total)." };
  },
  7: (code) =>
    /greet\s*\(\s*["'](?!world["'])[^"']+["']\s*\)/i.test(code)
      ? { ok: true }
      : {
          ok: false,
          hint: 'Change greet("World") to greet("YourFriend").',
        },
  8: (code) => {
    const hasLoop = /for\s+\w+\s+in\s+range\s*\(\s*5\s*\)/i.test(code);
    const hasRand = /random\.randint\s*\(\s*1\s*,\s*6\s*\)/i.test(code);
    if (!hasLoop)
      return { ok: false, hint: "Wrap the roll in `for i in range(5):`." };
    if (!hasRand)
      return {
        ok: false,
        hint: "Keep random.randint(1, 6) inside the loop.",
      };
    return { ok: true };
  },
  9: (code, output) => {
    const m = code.match(/=\s*\[([^\]]*)\]/);
    if (!m) return { ok: false, hint: "Make a list of three foods." };
    const items = m[1].split(",").filter((s) => s.trim().length > 0);
    if (items.length < 3)
      return { ok: false, hint: "List needs at least 3 items." };
    return /\[1\]|\bsnacks\[1\]|foods\[1\]/i.test(code) || output.trim().length > 0
      ? { ok: true }
      : { ok: false, hint: "Print the second item with mylist[1]." };
  },
  10: (code, output) =>
    /for\s+\w+\s+in\s+greetings/i.test(code) && /Mochi says/i.test(output)
      ? { ok: true }
      : {
          ok: false,
          hint: "Use `for g in greetings:` and print('Mochi says:', g).",
        },
  11: (code, output) => {
    if (!/if\s+age\s*>=?\s*12/i.test(code))
      return { ok: false, hint: "Use if age >= 12: to decide." };
    return /ride|next year/i.test(output)
      ? { ok: true }
      : { ok: false, hint: "Print 'You can ride!' or 'Maybe next year.'" };
  },
  12: (code, output) => {
    if (!/for\s+\w+\s+in\s+range\s*\(\s*10\s*,\s*0\s*,\s*-1\s*\)/i.test(code))
      return { ok: false, hint: "Use range(10, 0, -1) to count down." };
    return /Blast off/i.test(output) && /\b10\b/.test(output) && /\b1\b/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Print each number, then print 'Blast off!'." };
  },
  13: (code) =>
    /input\s*\(/i.test(code) && /print\s*\(/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Use input() to ask, then print the answer." },
  14: (code, output) => {
    if (!/def\s+double\s*\(/i.test(code))
      return { ok: false, hint: "Define `def double(n):` that returns n*2." };
    if (!/return\b/i.test(code))
      return { ok: false, hint: "Use `return` inside the function." };
    return /\b14\b/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Print double(7) — it should print 14." };
  },
  15: (code) => {
    const hasLoop = /while\s+|for\s+/i.test(code);
    const hasIf = /if\s+/i.test(code);
    const hasInput = /input\s*\(/i.test(code);
    if (!hasLoop || !hasIf || !hasInput)
      return {
        ok: false,
        hint: "Use a loop + if/elif/else + input() so the player can keep guessing.",
      };
    return { ok: true };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// GenAI track (mostly written-prompt practice — check that text was rewritten)
// ─────────────────────────────────────────────────────────────────────────────
const GENAI: Record<number, Check> = {
  1: (code) =>
    /haiku about pizza/i.test(code)
      ? {
          ok: false,
          hint: "Change 'pizza' to your favorite animal.",
        }
      : /prompt\s*=\s*["'][^"']+["']/i.test(code)
        ? { ok: true }
        : { ok: false, hint: "Edit the prompt string." },
  2: (code) => {
    const m = code.match(/strong\s*=\s*["']([^"']+)["']/);
    if (!m || m[1].trim().length < 20)
      return {
        ok: false,
        hint: "Make `strong` a longer, more specific prompt (subject, action, style).",
      };
    return /draw a dog/i.test(m[1])
      ? {
          ok: false,
          hint: "Don't keep 'draw a dog' — make it specific.",
        }
      : { ok: true };
  },
  3: (code) =>
    /role\s*=\s*["'][^"']*(teacher|robot)[^"']*["']/i.test(code)
      ? { ok: true }
      : {
          ok: false,
          hint: "Set role to something like 'You are a friendly robot teacher...'",
        },
  4: (code) => {
    const m = code.match(/parts\s*=\s*\[([^\]]*)\]/);
    if (!m) return { ok: false, hint: "Keep the parts list." };
    const items = m[1].split(",").filter((s) => s.trim().length > 0);
    return items.length >= 4
      ? { ok: true }
      : { ok: false, hint: "Add at least 3 more details to the parts list." };
  },
  5: (code) =>
    countMatches(code, /->/g) >= 3
      ? { ok: true }
      : {
          ok: false,
          hint: "Add at least 2 examples (cat -> 🐱, etc.) then ask for the next.",
        },
  6: (code) =>
    /hero_name\s*=/i.test(code) && /backstory_prompt\s*=/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Keep both hero_name and backstory_prompt." },
  7: (code) => {
    const m = code.match(/checks\s*=\s*\[([\s\S]*?)\]/);
    if (!m) return { ok: false, hint: "Keep the checks list." };
    const items = m[1]
      .split("\n")
      .filter((l) => /["']/.test(l))
      .filter((l) => !/^\s*#/.test(l));
    return items.length >= 3
      ? { ok: true }
      : { ok: false, hint: "Add at least 3 questions to the checks list." };
  },
  8: (code) =>
    /def\s+build_prompt/.test(code) &&
    /return\b/.test(code) &&
    /(audience|topic)/i.test(code)
      ? { ok: true }
      : {
          ok: false,
          hint: "Build the function so it combines role + audience + topic and returns the full prompt.",
        },
};

const TABLE: Record<string, Record<number, Check>> = {
  web: WEB,
  python: PY,
  genai: GENAI,
};

export function checkMission(
  trackId: string,
  missionN: number,
  code: string,
  output: string,
  starter: string,
): CheckResult {
  const table = TABLE[trackId];
  const check = table?.[missionN];
  if (check) return check(code, output);

  // Fallback: at minimum the student must have changed the starter meaningfully.
  return mustChange(
    code,
    starter,
    "I don't see your changes yet. Try editing the code to match the task above.",
  );
}
