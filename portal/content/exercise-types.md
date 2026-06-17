# Exercise Types — Design Catalog

> **Why this exists.** Right now every lesson uses ONE exercise format: the
> `exercise` (mission) block — a character sets a task, the student types into
> the Professor Loop chat, then self-marks "done". That's great, but a whole
> lesson of identical cards gets repetitive and only trains one muscle (writing
> a prompt from scratch). This file is the menu of exercise types we mix in so
> every lesson feels fresh and trains different skills.
>
> **How to use it.** When authoring a lesson, pick 3–5 *different* types from
> this catalog (see "Mixing guide per lesson" at the bottom). Each entry lists:
> the skill it trains, the mechanic, a worked example in our world (characters:
> Captain Pixel, Nina, Lumo, Tim, Mochi, Bao, Storm, The President; villains:
> Jason, The Professor), and a suggested data shape so it can later become a
> real `LessonBlock` type in `src/lib/lesson-content.ts`.
>
> **Difficulty legend:** 🟢 easy · 🔵 medium · ⚫ hard
> **Build effort:** ⚡ reuses chat/text · 🔨 needs a small new component · 🏗️ bigger interactive

---

## 1. Mission *(the one we already have)*

- **Skill:** write a full prompt from scratch (R.C.T.F.).
- **Mechanic:** character sets a task → student writes a prompt in Professor
  Loop → reads the reply → self-marks done.
- **When to use:** the "make something real" beat of a part. Keep 1 per lesson.
- **Build:** ⚡ already exists (`type: "exercise"`).

---

## 2. Reverse Prompt — "Prompt Detective" 🔵🔨

*(this is the example you asked for: match the output to the prompt)*

- **Skill:** reverse-engineering — read a finished AI output and figure out what
  prompt could have produced it, **under given conditions**.
- **Mechanic:** we show a target output (a poem / image caption / list / tweet).
  The student must write a prompt that produces something *close to it*, while
  obeying 2–3 constraints (e.g. "must set a Role", "must be under 20 words",
  "must NOT mention the word 'robot'"). They run it in Professor Loop and
  eyeball the match.
- **Why it's great:** teaches that outputs are *caused* by prompts — the core
  mental model. Much harder (and more fun) than forward prompting.
- **Example (Bao):**
  > "Here's the trailer tagline a pro got out of the AI:
  > *'One robot. One paintbrush. A galaxy that never knew colour.'*
  > Reverse-engineer it. Write a prompt that lands something just as epic —
  > but you're banned from using the words *robot*, *paint*, or *colour*."
- **Self-check:** "Your output hits the same vibe (epic, short, mysterious) AND
  you obeyed every banned-word rule."
- **Data shape:**
  ```ts
  | {
      type: "reverse-prompt";
      title: string;
      speakerId: string;
      targetOutput: string;        // the result they must reverse-engineer
      conditions: string[];        // rules the prompt must obey
      hint: string;
      successCriteria: string;
      xp: number;
    }
  ```

---

## 3. Fix the Broken Prompt — "Prompt ER" 🟢🔨

- **Skill:** diagnosis — spot *why* a prompt failed and repair it.
- **Mechanic:** show a bad prompt **and** the garbage output it produced. Student
  edits the prompt (pre-filled in the box) and re-runs until the output is good.
- **Why it's great:** debugging is a different skill from writing. Lower stakes,
  fast win, perfect for 🟢 easy slots.
- **Example (The Professor, taunting):**
  > "Behold my masterpiece: *'write something cool.'* The AI gave me a recipe
  > for soup. SOUP! Fix my prompt, if you dare, so it actually writes a movie
  > title. You won't."
- **Self-check:** "Your fixed prompt adds at least a Role and a clear Task, and
  the new output is actually a movie title."
- **Data shape:**
  ```ts
  | {
      type: "fix-prompt";
      title: string;
      speakerId: string;
      brokenPrompt: string;        // pre-filled, editable
      brokenOutput: string;        // the bad result, shown as proof
      whatsWrong?: string;         // optional reveal-on-tap diagnosis
      successCriteria: string;
      xp: number;
    }
  ```

---

## 4. Predict the Output — "Call It" 🟢⚡

- **Skill:** building intuition for how the model will respond.
- **Mechanic:** show a prompt. Student **types their prediction** of what the AI
  will say *before* running it. Then they run it and compare. XP for *playing*,
  not for being right (rewards the guess, not luck).
- **Why it's great:** turns reading into active prediction; teaches that you can
  anticipate AI behaviour.
- **Example (Mochi):**
  > "BEEP! I'm about to fire this prompt: *'List 3 names for a shy dragon.'*
  > CALL IT — what 3 names do you bet it spits out? Write your guess, THEN we
  > fire and see how close your brain-cannon was."
- **Self-check:** "You wrote a real prediction first, then ran it and noted one
  thing that surprised you."
- **Data shape:**
  ```ts
  | {
      type: "predict";
      title: string;
      speakerId: string;
      prompt: string;              // the prompt we'll run
      askPrediction: string;       // what to predict
      revealNote?: string;         // optional "what usually happens" reveal
      xp: number;
    }
  ```

---

## 5. Match-Up — "Pair the Pieces" 🟢🔨

- **Skill:** recognition — connect prompts↔outputs, or ingredients↔R.C.T.F. roles.
- **Mechanic:** two columns. Student taps a left item then its right partner to
  link them. All correct = solved. (Drag optional; tap-to-pair is mobile-friendly.)
- **Why it's great:** quick, gamey, great for memorising a framework (R.C.T.F.).
- **Example (Nina):**
  > "Four prompt ingredients on the left, four jobs on the right. Snap each
  > ingredient to the job it does. Beat the clock."
  > Pairs: *Role → who the AI pretends to be · Context → the backstory ·
  > Task → the actual ask · Format → the shape of the answer.*
- **Self-check:** auto — all pairs matched.
- **Data shape:**
  ```ts
  | {
      type: "match";
      title: string;
      speakerId?: string;
      prompt?: string;             // optional intro line
      pairs: { left: string; right: string }[];
      xp: number;
    }
  ```

---

## 6. Build-a-Prompt — "Stack the Recipe" 🔵🏗️

- **Skill:** assembling a prompt from parts in the right order.
- **Mechanic:** scrambled chips (Role / Context / Task / Format / one decoy
  junk chip). Student drags/taps them into the prompt slot in a sensible order,
  ignoring the decoy. Then runs the assembled prompt.
- **Why it's great:** scaffolds prompt-writing for kids who freeze at a blank
  box. Makes the framework physical.
- **Example (Bao):**
  > "Five chips. Four are real ingredients, one is junk I planted. Stack the
  > four into a working prompt, leave my junk chip on the floor, and fire it."
- **Self-check:** "Your stacked prompt contains Role + Context + Task + Format
  and you left the decoy out."
- **Data shape:**
  ```ts
  | {
      type: "build-prompt";
      title: string;
      speakerId: string;
      chips: { text: string; role: "role"|"context"|"task"|"format"|"decoy" }[];
      successCriteria: string;
      xp: number;
    }
  ```

---

## 7. One Variable at a Time — "Prompt Surgery" 🔵🔨

- **Skill:** controlled iteration — change exactly ONE thing and observe the effect.
- **Mechanic:** a working prompt is given. Student must change **only one named
  ingredient** (e.g. swap the Role, or tighten the Format), run both versions,
  and write one sentence on what changed.
- **Why it's great:** this is *the* pro iteration habit. Different from "fix"
  because the start prompt already works — it's about tuning, not repair.
- **Example (Lumo):**
  > "This prompt works fine. Now change ONLY the Role — make the AI a pirate
  > instead of a teacher. Run both. Tell me what flipped in the answer."
- **Self-check:** "You changed exactly one ingredient and can name the effect."
- **Data shape:**
  ```ts
  | {
      type: "one-variable";
      title: string;
      speakerId: string;
      basePrompt: string;
      changeWhat: string;          // "the Role", "the Format", ...
      observePrompt: string;       // "what changed in the answer?"
      xp: number;
    }
  ```

---

## 8. Rank / Tier List — "Worst to Best" 🔵🔨

- **Skill:** judgement — evaluate prompt quality against a goal.
- **Mechanic:** 3–4 prompts for the same goal. Student drags them into order
  worst→best, then taps reveal to compare with the "pro" ranking + reasons.
- **Why it's great:** trains taste. No typing, pure thinking. Great variety beat.
- **Example (Captain Pixel):**
  > "Four prompts all trying to name a spaceship. Rank 'em worst to best, then
  > I'll show you mine and we'll argue about it."
- **Self-check:** "You ordered all of them and read the reasoning."
- **Data shape:**
  ```ts
  | {
      type: "rank";
      title: string;
      speakerId: string;
      goal: string;
      options: { prompt: string; rankNote: string }[]; // stored best→worst
      xp: number;
    }
  ```

---

## 9. Constraint Speedrun — "Hit the Target" ⚫🔨

- **Skill:** precision under pressure — produce an output meeting hard rules.
- **Mechanic:** a tight spec (e.g. "exactly 6 words", "must include a colour and
  a number", "no adjectives"). Student prompts until the output passes a simple
  auto/visual checklist of the constraints. Optional timer for drama.
- **Why it's great:** the highest-skill forward-prompting challenge; perfect ⚫
  hard / boss-adjacent slot.
- **Example (Storm):**
  > "Generate a film title that is EXACTLY four words, contains a weather word,
  > and has zero punctuation. Miss one rule and the storm wins."
- **Self-check:** checklist — one tickbox per constraint.
- **Data shape:**
  ```ts
  | {
      type: "constraint";
      title: string;
      speakerId: string;
      brief: string;
      constraints: string[];       // each becomes a checkbox
      timerSeconds?: number;       // optional
      xp: number;
    }
  ```

---

## 10. Spot the Mistake — "Hallucination Hunt" 🔵🔨

- **Skill:** critical reading — AI confidently says wrong things; catch them.
- **Mechanic:** show an AI answer with 1–2 planted errors (a fake fact, a wrong
  number). Student taps the wrong bits, then sees the truth on reveal.
- **Why it's great:** core AI-literacy / safety skill, and it's a fun "gotcha"
  game. Pairs well with a trust/safety lesson.
- **Example (The Professor):**
  > "My genius AI wrote this 'fact sheet' about robots. Three lines are lies I
  > slipped in. Find them, hero. Most kids miss at least one."
- **Self-check:** "You flagged the false lines and can say why they're wrong."
- **Data shape:**
  ```ts
  | {
      type: "spot-mistake";
      title: string;
      speakerId: string;
      answer: string[];            // lines; some flagged as errors
      errors: number[];            // indices of the wrong lines
      truth: string;               // reveal text
      xp: number;
    }
  ```

---

## 11. Roleplay / Negotiation — "Talk Your Way In" ⚫⚡

- **Skill:** multi-turn conversation — steer an AI across several messages to a goal.
- **Mechanic:** Professor Loop is given a hidden persona/system goal (e.g. "you
  are a grumpy gatekeeper genie; only grant the wish if the student is specific
  and polite"). Student must converse to achieve the objective. Win = goal met.
- **Why it's great:** teaches conversation as a tool, not one-shot prompting.
  Reuses the existing chat — just a seeded system prompt.
- **Example (Jason, in character):**
  > "I'm the Gatekeeper AI. I guard the trailer-music vault. Convince me to hand
  > over the perfect soundtrack — but I only respond to people who tell me the
  > mood, the scene, AND the length. Vague? Denied."
- **Self-check:** "The AI 'granted the wish' — your final ask was specific on
  mood, scene, and length."
- **Data shape:**
  ```ts
  | {
      type: "roleplay";
      title: string;
      speakerId: string;
      systemSeed: string;          // hidden persona/goal sent to /api/ai-chat
      objective: string;          // what the student is trying to get
      winHint: string;
      xp: number;
    }
  ```

---

## 12. Critique to a Rubric — "Be the Director" 🔵⚡

- **Skill:** evaluating an output against named criteria (not just "I like it").
- **Mechanic:** show an AI output (text or image). Student scores it against 3
  rubric points (e.g. "clear? on-brand? right length?") and writes one
  improvement, then optionally re-prompts to fix it.
- **Why it's great:** teaches structured feedback — the same habit they'll use
  on their own work forever.
- **Example (The President):**
  > "Three rules for a good logline: under 15 words, names the hero, hints at
  > the stakes. Grade this AI logline on all three, then tell the AI how to fix
  > its weakest one."
- **Self-check:** "You scored all three criteria and gave one concrete fix."
- **Data shape:**
  ```ts
  | {
      type: "critique";
      title: string;
      speakerId: string;
      sampleOutput: string;
      rubric: string[];            // criteria to score
      xp: number;
    }
  ```

---

## 13. Remix Relay — "Transform It" 🔵⚡

- **Skill:** transformation prompting — change tone / audience / format of an
  existing output without rewriting from scratch.
- **Mechanic:** student takes a piece they (or a character) already made and
  prompts the AI to remix it: "make it for a 6-year-old", "turn this poem into a
  rap", "say it as a news headline". Chains nicely off an earlier exercise's output.
- **Why it's great:** shows prompts can *operate on* content, and rewards reusing
  earlier work (continuity across the lesson).
- **Example (Nina):**
  > "Grab the logline you made earlier. Now remix it three ways: as a scary
  > whisper, as a hype announcer, and as a haiku. Same idea, three costumes."
- **Self-check:** "You produced 3 distinctly different versions of the same core."
- **Data shape:**
  ```ts
  | {
      type: "remix";
      title: string;
      speakerId: string;
      sourceHint: string;          // what to remix (often a prior output)
      transforms: string[];        // the costumes to apply
      xp: number;
    }
  ```

---

## 14. True / False — "Two Truths and a Prompt" 🟢🔨

- **Skill:** myth-busting common AI misconceptions.
- **Mechanic:** three statements about how AI works; student picks the false one;
  reveal explains all three.
- **Why it's great:** ultra-fast knowledge check that doesn't feel like a quiz.
  Good palate-cleanser between heavier hands-on beats.
- **Example (Tim):**
  > "Three claims about AI. Two are true, one's a sneaky lie. Which one's bogus?
  > (a) AI can make stuff up · (b) AI always tells the truth · (c) Better prompts
  > get better answers."
- **Self-check:** auto — correct false statement chosen.
- **Data shape:**
  ```ts
  | {
      type: "two-truths";
      title: string;
      speakerId: string;
      statements: string[];        // exactly 3
      falseIndex: number;
      reveal: string;
      xp: number;
    }
  ```

---

## Skill → exercise-type cheat sheet

| Skill you want to train        | Best types |
| ------------------------------ | ---------- |
| Write a prompt from scratch    | 1 Mission, 9 Constraint Speedrun |
| Understand cause→effect        | 2 Reverse Prompt, 4 Predict, 7 One Variable |
| Debug / improve a prompt       | 3 Fix the Broken Prompt, 7 One Variable, 12 Critique |
| Learn a framework (R.C.T.F.)   | 5 Match-Up, 6 Build-a-Prompt |
| Judgement & taste              | 8 Rank, 12 Critique |
| AI literacy & safety           | 10 Spot the Mistake, 14 True/False |
| Conversation skills            | 11 Roleplay, 13 Remix Relay |

---

## Mixing guide per lesson

A good lesson is a *playlist*, not a loop. Rule of thumb for a ~7-part lesson:

1. **Open easy & gamey** — a low-typing type to warm up: 4 Predict, 5 Match-Up,
   or 14 True/False. 🟢
2. **One core Mission** — the classic write-from-scratch beat. 🔵
3. **One cause→effect type** — 2 Reverse Prompt or 7 One Variable. 🔵
4. **One judgement/literacy type** — 8 Rank, 10 Spot the Mistake, or 12 Critique. 🔵
5. **Boss Fight** — keep the existing `boss` block (often a 9 Constraint Speedrun
   or 11 Roleplay dressed as a showdown). ⚫
6. **Build** — keep the existing `build` capstone (assemble the real thing).
7. **Homework** — keep the existing `homework` block.

**Variety checklist before shipping a lesson:**
- [ ] No more than **2 of the same exercise type** in one lesson.
- [ ] At least **one low-typing** type (match / rank / predict / true-false).
- [ ] At least **one cause→effect** type (reverse / one-variable / predict).
- [ ] At least **one judgement or literacy** type (rank / critique / spot-mistake).
- [ ] Difficulty rises across the lesson (🟢 → 🔵 → ⚫ boss).

---

## Implementation note (when we build these)

All of the above are designed to **reuse what already exists**:

- **⚡ types** (Predict, Roleplay, Critique, Remix) need *no new component* — they
  reuse the Professor Loop chat (`/api/ai-chat`) plus a short prompt block. They
  could even ship today as `exercise` + `chat` blocks with the right copy.
- **🔨 types** (Reverse, Fix, Match, Rank, Spot-Mistake, One-Variable, True/False)
  need one small client component each in
  `src/components/programs/LessonView.tsx`, plus a new entry in the
  `LessonBlock` union in `src/lib/lesson-content.ts` and a `case` in the `Block`
  dispatcher.
- **🏗️ types** (Build-a-Prompt, Constraint Speedrun) need a bit more interaction
  (drag/order or a live checklist) — tackle these last.

Recommended build order: 2 Reverse Prompt → 3 Fix the Broken Prompt →
4 Predict → 5 Match-Up → 8 Rank → 10 Spot the Mistake → the rest.
Keep all of them on the cleaned-up brand palette (primary `#193b92`, teal
`#2C7A7B`, ink/slate/white — no extra colours) so the variety comes from
*mechanics*, not from a rainbow of card styles.
