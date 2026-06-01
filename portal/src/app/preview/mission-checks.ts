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
  16: (code) =>
    countMatches(code, /<\/h1>/gi) >= 1 && /<h1>[^<]*<\/h1>/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Add the missing </h1> right after 'My Cool Page'." },
  17: (code) =>
    countMatches(code, /<h1[^>]*>/gi) === 1
      ? { ok: true }
      : { ok: false, hint: "Delete one of the two <h1> lines — only one should remain." },
  18: (code) => {
    const tagged = countMatches(code, /<p\s+class=["']note["']/gi);
    if (tagged < 3)
      return { ok: false, hint: "Give all three <p> tags class=\"note\"." };
    if (!/\.note\s*\{[^}]*background\s*:\s*(yellow|#ff[0-9a-f]*)/i.test(code))
      return { ok: false, hint: "Add a .note rule with a yellow background." };
    if (!/\.note\s*\{[^}]*padding/i.test(code))
      return { ok: false, hint: "Add padding (e.g. 12px) to the .note rule." };
    return { ok: true };
  },
  19: (code) =>
    /<img[^>]*\bsrc=["'][^"']+["']/i.test(code) && !/<img[^>]*\bhref=/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Change href= to src= on the <img> tag." },
  20: (code) =>
    /\.gallery\s*\{[\s\S]*?display\s*:\s*grid[\s\S]*?\}/i.test(code) &&
    /grid-template-columns\s*:\s*repeat\s*\(\s*3/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Use display: grid and grid-template-columns: repeat(3, 1fr) on .gallery." },
  21: (code) =>
    /function\s+shout\s*\(/i.test(code) &&
    /toUpperCase\s*\(/i.test(code) &&
    /onclick=["']shout\(/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Define shout(msg), alert(msg.toUpperCase()), and call it from onclick." },
  22: (code) => {
    const m = code.match(/\[([^\]]*)\]/);
    if (!m) return { ok: false, hint: "Make an array of 4 names with [ ... ]." };
    const items = m[1].split(",").filter((s) => s.trim().length > 0);
    if (items.length < 4)
      return { ok: false, hint: "Array needs 4 names." };
    return /\[2\]/.test(code)
      ? { ok: true }
      : { ok: false, hint: "Alert the third name using [2] (arrays start at 0)." };
  },
  23: (code) =>
    /for\s*\(/i.test(code) && /alert\s*\(/i.test(code) && /foods/.test(code)
      ? { ok: true }
      : { ok: false, hint: "Loop through foods, build a string, then alert it." },
  24: (code) =>
    /if\s*\(\s*n\s*===\s*7\s*\)/.test(code)
      ? { ok: true }
      : { ok: false, hint: "Change `n = 7` to `n === 7` inside the if." },
  25: (code) =>
    !/background\s*:\s*lime/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Delete the rule `.card { background: lime; }`." },
  26: (code) =>
    /\{\s*name\s*:\s*["'][^"']+["']\s*,\s*age\s*:\s*\d+\s*,\s*food\s*:\s*["'][^"']+["']/i.test(code) &&
    /alert\s*\(/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Make pet = { name, age, food } and alert with pet.name + ' likes ' + pet.food." },
  27: (code) =>
    /document\.body\.style\.background\s*=\s*["']#0f172a["']/i.test(code) &&
    /document\.body\.style\.color\s*=\s*["']white["']/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Set document.body.style.background = '#0F172A' and color = 'white'." },
  28: (code) =>
    /count\s*=\s*count\s*\+\s*1|count\+\+/i.test(code) &&
    /getElementById\(["']out["']\)\.textContent\s*=\s*count/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Bump count by 1, then write it into #out's textContent." },
  29: (code) =>
    /getElementById\(["']n["']\)\.value/i.test(code) &&
    /getElementById\(["']out["']\)\.textContent\s*=/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Read #n.value, build 'Hi <name>!' and write it into #out.textContent." },
  30: (code) =>
    /getElementById\(["']title["']\)/i.test(code) && !/getElementById\(["']titel["']\)/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Change 'titel' to 'title' so the id matches." },
  31: (code) =>
    /Math\.random\s*\(/i.test(code) &&
    /document\.body\.style\.background\s*=/i.test(code) &&
    /colors\s*\[/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Pick a random index into colors and set body.style.background." },
  32: (code) =>
    /\.box\s*\{[^}]*transition/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Add `transition: background 0.3s ease;` to .box." },
  33: (code) =>
    /todos\.push\s*\(/i.test(code) &&
    /getElementById\(["']list["']\)/i.test(code) &&
    /<li>/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Push to todos, then set #list innerHTML to '<li>' for each todo." },
  34: (code) =>
    countMatches(code, /n\s*=\s*n\s*\+\s*1/g) === 1 &&
    !/n\+\+\s*;\s*n\+\+/.test(code)
      ? { ok: true }
      : { ok: false, hint: "Delete one of the two `n = n + 1` lines." },
  35: (code) =>
    /localStorage\.setItem\(["']fav["']/i.test(code) &&
    /localStorage\.getItem\(["']fav["']/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "save() should setItem('fav', value); load() should getItem('fav')." },
  36: (code) =>
    /fetch\s*\(\s*["']https:\/\/icanhazdadjoke\.com\/?["']/i.test(code) &&
    /Accept[^,)]*application\/json/i.test(code) &&
    /\.joke/.test(code)
      ? { ok: true }
      : { ok: false, hint: "fetch icanhazdadjoke.com with Accept: application/json header, then read data.joke." },
  37: (code) =>
    /try\s*\{[\s\S]*JSON\.parse[\s\S]*\}\s*catch/i.test(code) &&
    /oops/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Wrap JSON.parse in try { } catch (e) { ... set #out to 'Oops, bad input.' }." },
  38: (code) =>
    /setInterval\s*\(/i.test(code) &&
    /Math\.random\s*\(/i.test(code) &&
    /\.style\.(left|top)/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Use setInterval to set #t.style.left and #t.style.top to random pixel values." },
  39: (code) =>
    !/console\.log/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Delete every console.log line in the script." },
  40: (code) =>
    /getElementById\(["']bill["']\)\.value/i.test(code) &&
    /getElementById\(["']pct["']\)\.value/i.test(code) &&
    /toFixed\s*\(\s*2\s*\)/i.test(code) &&
    /getElementById\(["']tip["']\)\.textContent/i.test(code) &&
    /getElementById\(["']total["']\)\.textContent/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Read #bill and #pct, compute tip + total, write both with toFixed(2)." },
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
  16: (code, output) => {
    // Must be indented properly inside the function AND must not crash.
    if (/IndentationError|SyntaxError/i.test(output))
      return { ok: false, hint: "Indent the print line by 4 spaces under def greet(name):." };
    return /def\s+greet\s*\([^)]*\)\s*:\s*\n\s{2,}print\s*\(/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Indent the print() line by 4 spaces under the def." };
  },
  17: (code) =>
    !/TODO REMOVE ME/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Delete the line that prints 'TODO REMOVE ME'." },
  18: (code, output) => {
    if (/\bfor\b|\brange\b/.test(code))
      return { ok: false, hint: "Don't use for or range — use a while loop." };
    if (!/while\s+/i.test(code))
      return { ok: false, hint: "Use a while loop." };
    return /\b1\b[\s\S]*\b5\b/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Print numbers 1 through 5 (inclusive)." };
  },
  19: (code, output) => {
    if (/TimeoutError|Execution timed out/i.test(output))
      return { ok: false, hint: "Add `n = n + 1` (or similar) inside the loop so it ends." };
    return /while\s+n\s*<\s*5/i.test(code) && /\bn\s*=\s*n\s*\+\s*1|\bn\s*\+=\s*1/.test(code)
      ? { ok: true }
      : { ok: false, hint: "Increase n inside the loop so it eventually reaches 5." };
  },
  20: (code, output) =>
    /\.title\s*\(\s*\)/i.test(code) && /Bao Nguyen/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Use name.title() and print the result — should output 'Bao Nguyen'." },
  21: (code, output) =>
    /f["'][^"']*\{name\}[^"']*\{score\}[^"']*["']/i.test(code) &&
    /Mochi/.test(output) &&
    /42/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Use an f-string like f\"Hi {name}, you have {score} points.\"" },
  22: (code, output) => {
    const m = code.match(/\{\s*["']name["']\s*:[\s\S]*?\}/);
    if (!m) return { ok: false, hint: "Create a pilot dict with name, age, callsign." };
    if (!/callsign/i.test(code))
      return { ok: false, hint: "Include a 'callsign' key in the dict." };
    return /Callsign:/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Print 'Callsign: <value>'." };
  },
  23: (code, output) =>
    /\.items\s*\(\s*\)/i.test(code) && /loves/i.test(output)
      ? { ok: true }
      : { ok: false, hint: "Use `for name, snack in snacks.items():` and print '<name> loves <snack>'." },
  24: (code, output) =>
    /range\s*\(\s*10\s*,\s*0\s*,\s*-1\s*\)/.test(code) && /\b1\b/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Change range(10, 1, -1) to range(10, 0, -1) so it includes 1." },
  25: (code) =>
    countMatches(code, /^\s*import\s+random\s*$/gm) === 1
      ? { ok: true }
      : { ok: false, hint: "Delete the duplicate `import random` line." },
  26: (code, output) => {
    if (!/\[\s*[^\]]*for\s+\w+\s+in\s+range/.test(code))
      return { ok: false, hint: "Use a list comprehension: [n*2 for n in range(1, 11)]." };
    return /\b20\b/.test(output) && /\b2\b/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Print the list — it should include 2 through 20." };
  },
  27: (code, output) =>
    /sorted\s*\([^)]*reverse\s*=\s*True/i.test(code) && /\b88\b/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Use sorted(scores, reverse=True) and print it." },
  28: (code, output) =>
    /for\s+line\s+in\s+notes\.split/i.test(code) && /first line/i.test(output) && /third line/i.test(output)
      ? { ok: true }
      : { ok: false, hint: "Loop with `for line in notes.split('\\n'):` and print each line stripped." },
  29: (code, output) =>
    /try\s*:[\s\S]*int\s*\([\s\S]*except/i.test(code) && /Not a number/i.test(output)
      ? { ok: true }
      : { ok: false, hint: "Wrap int(raw) in try/except ValueError and print 'Not a number — try again.'" },
  30: (code, output) =>
    !/nam3/.test(code) && /Mochi/.test(output) && !/NameError/i.test(output)
      ? { ok: true }
      : { ok: false, hint: "Change `nam3` to `name` in the f-string." },
  31: (code, output) => {
    if (!/class\s+Pet\s*:/.test(code))
      return { ok: false, hint: "Define `class Pet:` with __init__ and speak." };
    if (!/def\s+__init__\s*\(\s*self\s*,/.test(code))
      return { ok: false, hint: "Add `def __init__(self, name):` inside the class." };
    if (!/def\s+speak\s*\(\s*self\s*\)/.test(code))
      return { ok: false, hint: "Add a `def speak(self):` method." };
    return /says hi/i.test(output)
      ? { ok: true }
      : { ok: false, hint: "Create a Pet, call .speak() — it should print '<name> says hi'." };
  },
  32: (code, output) =>
    /import\s+math/i.test(code) && /math\.sqrt\s*\(\s*144\s*\)/i.test(code) && /\b12(\.0)?\b/.test(output)
      ? { ok: true }
      : { ok: false, hint: "import math, then print(math.sqrt(144)) — output should be 12.0." },
  33: (code, output) =>
    /sorted\s*\(\s*words\s*,\s*key\s*=\s*lambda/i.test(code) && /fig/.test(output) && /banana/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Use sorted(words, key=lambda s: len(s)) and print it." },
  34: (code) =>
    !/time traveler/i.test(code)
      ? { ok: true }
      : { ok: false, hint: "Delete the `elif age < 0: return 'time traveler'` branch — it can never run." },
  35: (code, output) =>
    /json\.loads\s*\(/i.test(code) && /Bao/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Use json.loads(raw) then print the 'name' key." },
  36: (code, output) =>
    /str\s*\(\s*age\s*\)/i.test(code) && /12 years/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Convert age to a string with str(age) before adding ' years'." },
  37: (code, output) =>
    /def\s+fact\s*\(/i.test(code) && /return\s+n\s*\*\s*fact\s*\(/i.test(code) && /\b120\b/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Define fact(n): base case n<=1 returns 1, else return n * fact(n-1). fact(5) should be 120." },
  38: (code, output) => {
    if (!/\{[\s\S]*for\s+\w+\s+in\s+range[\s\S]*\}/.test(code))
      return { ok: false, hint: "Use a dict comprehension like {n: n*n*n for n in range(1, 6)}." };
    return /\b125\b/.test(output) && /\b1\b/.test(output)
      ? { ok: true }
      : { ok: false, hint: "Print the dict — cubes should include 1, 8, 27, 64, 125." };
  },
  39: (code) =>
    !/\belse\s*:/i.test(code) && countMatches(code, /print\s*\(\s*["']hello["']\s*\)/gi) === 1
      ? { ok: true }
      : { ok: false, hint: "Remove the else and the duplicate print, leaving just one print('hello') in greet()." },
  40: (code, output) =>
    /\.split\s*\(/i.test(code) &&
    /\.lower\s*\(\s*\)/i.test(code) &&
    /the[: ]\s*[23]/i.test(output) &&
    /cat[: ]\s*2/i.test(output)
      ? { ok: true }
      : { ok: false, hint: "Lowercase + split the text, count each word in a dict, then print 'word: count' lines." },
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
