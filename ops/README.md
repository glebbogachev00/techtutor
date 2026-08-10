# TechTutor Content Console

A local web tool for drafting, reviewing, and publishing social posts in the TechTutor
voice. Zero third-party dependencies — pure Python stdlib. No `pip install`, no build step.
Python 3.9+ (works on 3.14).

```bash
cd /Users/glebbogachev/Documents/techtutor
python3 ops/content-console.py     # → http://127.0.0.1:8778
```

## Six steps, one decision each

The console walks forward and never puts two decisions on the same screen.

| Step | You do | Notes |
|------|--------|-------|
| **1 Source** | Where's this coming from? | Something that happened, or today's tech news |
| **2 Type** | What kind of post | 14 types, each with its own shape and interview |
| **3 Purpose** | What it should *do* to the reader | Laugh, teach, spark interest, reassure, prove, invite |
| **4 Talk** | Say what happened | It asks short concrete questions; you answer |
| **5 Write** | Read the draft, change it | Lint, one-click revisions, tailored image prompt |
| **6 Post** | Add the visual, publish | Nothing publishes without your click |

### Why it no longer asks questions when you wanted a post

The old build had one `/generate` route that was told "use only the facts the user gives"
and "never invent." With an empty box it had no facts and no permission to make any up, so
the only move left was to ask you what happened — and that landed in your caption field.

Now there are two routes and they cannot do each other's job:

- **`/interview`** can only ask questions. It is forbidden from writing a line of copy.
- **`/draft`** can only write a post. It is forbidden from asking anything. If the facts
  are thin it writes the shortest honest post they support and tells you what was missing.

## Purpose, and why posts are actionable

Every post is briefed with a **job** from `jobs.json` — an effect on the reader, not a
topic. The writer is told that a post which is accurate but does nothing to the reader has
failed, and that the reader must finish able to *do* something within fifteen minutes
without paying anyone. The action comes out of the content, not from a bolted-on CTA.

Following the standard 80/20 split, five of the six jobs are non-promotional. `invite` is
the 20% — use it roughly one post in five.

## Promotional posts as stories

`fb_story_ad` and `fb_offer_story` carry `"craft": "ad"`, which loads `ad-craft.md` on top
of the voice spec. That's the old direct-response school adapted to a founder who doesn't
shout: the headline does most of the work, long copy is allowed here, facts outsell
adjectives, the offer arrives once and late, and a discount must state its true business
reason. Invented urgency and fake scarcity are banned outright.

## The news desk

Step 1 can pull the current Hacker News front page (public API, no key, no dependency),
then filter it down to the few stories a Vietnamese parent or a kid learning to build
things would actually care about. Each keeps an **angle** you can argue, plus a suggested
type and job. Stories with no honest angle get dropped rather than stretched. Cached 30
minutes; **Refresh** forces a re-read.

## Two passes, and why

The single most important thing to know about this codebase.

Instructions about **rhythm** and **image punch** do not survive inside the main writer
prompt. They compete with ~18k tokens of other rules and lose. This was measured, not guessed:
three rounds of increasingly explicit instruction — ending with hard numeric targets like
"average sentence must be over eighteen words" — moved the average sentence length from 12.3
to 12.6 to 11.6. It never moved.

So both now get their own call, with a tiny system prompt and exactly one job:

| Pass | Job | Result |
|------|-----|--------|
| `humanize()` | Join staccato into real sentences and paragraphs | 11.6 → **20.7** words/sentence, 9 → **5** paragraphs, lint clean |
| `punch_image()` | Turn a tasteful prompt into one that stops a thumb | soft flat illustration → documentary receipt with hex values, frame percentages and thumbnail legibility |

`polish()` runs both and is wired into `/draft`, `/rewrite` and `/revise`. Turn either off
per-request with `{"humanize": false}` or `{"punch_images": false}`.

**The general lesson:** when the model will not follow a rule, do not write the rule louder.
Give it its own call.

### What was causing the staccato

Three things enforced it at once, and all three are now fixed:

- `voice.md` rule 8 said "one idea per line, a BLANK LINE between each beat"
- anti-slop rule 10 said "sentences under 22 words"
- **`voice-lint.py` flagged every sentence over 22 words as a violation** — the lint was
  mechanically punishing exactly the long, organised sentences that read as human

The lint now does the opposite: it flags **staccato** (too many short sentences), a clipped
**average**, and **fragmentation** (too many one-sentence paragraphs).

`voice-samples.md` is also the reason instructions kept losing — the approved samples are all
written in the old staccato, and demonstrated texture beats written instruction every time.
They are now explicitly labelled voice-only, not rhythm.

## Keeping the voice

Four editable files steer every draft. They're re-read on each call, so edits take effect
with no restart.

| File | Role |
|------|------|
| `voice.md` | The voice spec. Principles, banned tells, platform voices. |
| `voice-samples.md` | Approved posts as **texture reference** — the rhythm to match. Includes counter-samples of the subtle slop that doesn't look like slop. |
| `tt-voice-image-spec.md` | Colors, style, aspect ratios for image prompts. |
| `ad-craft.md` | Long-copy story-ad craft. Loaded only for the promotional types. |

Plus a hard anti-slop block in `content-console.py` that bans specific *moves* rather than
giving vague style advice: no "it's not just X, it's Y", no "here's the thing", no "that's
when it clicked", no colon-reveals, no closer that widens out to all children everywhere,
no explaining the moment after telling it, and no uniform sentence length.

**Voice lint runs for real now.** `voice-lint.py` is imported and run against every draft;
violations show as chips under the post with a one-click **Fix** that rewrites without
losing facts. It also re-lints as you type your own edits.

## What actually automates (honest)

| Platform | Behavior |
|----------|----------|
| **AI drafting** | ✅ The core value. Interview + writer via the local `claude` CLI. No API key. |
| **Reddit** | ✅ Real one-click auto-post (text/self post) via script-app OAuth. Only for `reddit_ok` types. |
| **Facebook** | 🔗 Copies the caption and opens the Business Suite composer — you paste, add the image, post. FB/IG don't allow pre-filling post text via URL. |
| **Instagram** | 🔗 Copies the caption + surfaces your video link; you post the photo/video yourself. |
| **The image** | Semi-auto: you get a prompt written for *this* post. Generate it in ChatGPT Go and drop it in. |

The one thing you ever set up is Reddit. Facebook and Instagram need zero config.

## Secrets — `ops/.env` (gitignored)

Any missing key just disables that one platform; the app never crashes.

```ini
# Facebook Page
FB_PAGE_TOKEN=

# Reddit "script" app (reddit.com/prefs/apps)
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USERNAME=
REDDIT_PASSWORD=
REDDIT_SUB=learnprogramming

# Model tiers (optional)
CONSOLE_DRAFT_MODEL=opus        # the writer — quality matters most here
CONSOLE_INTERVIEW_MODEL=sonnet  # just asks short questions

# Instagram is manual — no token needed.
```

### Facebook Page token
Graph API Explorer → select your app → **Get Page Access Token** → grant
`pages_manage_posts` + `pages_read_engagement` → exchange for a long-lived token.

### Reddit script-app OAuth
<https://www.reddit.com/prefs/apps> → **create app** → type **script** → redirect
`http://localhost`. Client id (under the name) → `REDDIT_CLIENT_ID`, secret →
`REDDIT_CLIENT_SECRET`, your login → `REDDIT_USERNAME` / `REDDIT_PASSWORD`.

### AI drafting
Needs the `claude` CLI on your PATH. No key — it rides your existing Claude Code plan.
The writer defaults to **Opus** because the drafting is the quality-critical call; the
interviewer runs on **Sonnet** because it only asks short questions. Both run in an empty
temp directory with MCP and tools disabled, so they never pick up the techtutor repo's
`AGENTS.md` and start behaving like a coding agent.

## API

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/` | the UI |
| GET | `/types` | `content-types.json` |
| GET | `/jobs` | `jobs.json` |
| GET | `/status` | `{ai,fb,reddit,ig,lint,draft_model,interview_model}` |
| GET | `/uploads/<file>` | serve an uploaded image/video |
| POST | `/upload` | multipart file → `{file,ctype,video}` |
| POST | `/news` | `{refresh?}` → curated tech stories with angles |
| POST | `/interview` | `{sid?,slug,job,message}` → `{questions,ready,have,missing,note}` — **never a post** |
| POST | `/draft` | `{sid,slug,job,lang_order,notes}` → `{text,post_vn,post_en,slides,image_prompt,alt,action,thin,lint}` — **never questions** |
| POST | `/revise` | `{slug,job,text,instruction,lang_order}` → a rewrite that keeps every fact |
| POST | `/lint` | `{text,lang_order}` → `{lint}` |
| POST | `/save` | writes the post + its interview to `drafts/` |
| POST | `/post` | `{platform,message,image,subreddit?,title?}` |

## Files

- `content-console.py` — the stdlib server
- `index.html` — the single-page UI
- `content-types.json` — the 14 content types
- `jobs.json` — the six purposes
- `voice.md`, `voice-samples.md`, `tt-voice-image-spec.md`, `ad-craft.md` — the voice
- `voice-lint.py` — the mechanical checker, wired into every draft
- `CONTENT.md` — idea backlog
- `drafts/` — saved posts with their interviews attached
- `uploads/`, `.env` — gitignored

## Notes

- Nothing publishes without your click. You're always the publisher.
- Interview sessions live in memory; restarting the server clears them. Saved drafts don't.
- **If the UI acts strange after an update, restart the server.** The page is served from
  disk so it updates on reload, but the routes it calls come from the running process.
