# TechTutor Lesson Ecosystem — Implementation Plan

## Core philosophy

**One lesson should produce everything.**

The teacher teaches once. The system generates everything else.

What began as separate ideas — homework, parent emails, portfolios, reports,
marketing — turned out to be different perspectives on the same underlying
object: **a lesson**. We are no longer building separate systems that have to be
kept in sync. We are building different **views of the same lesson**.

```
                    LESSON
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
   Homework       Lesson Memory     Student Portfolio
                       │                │
                       ▼                │
               Parent Experience        │
                       │                │
                Parent Response         │
                       │                │
                       └────────────┬───┘
                                    │
                                    ▼
                             Content Inbox
                                    │
                                    ▼
                           Website / Marketing
```

Every feature — parent engagement, portfolios, teacher workflow, analytics,
marketing — grows from this one foundation instead of becoming its own system.

---

## Lesson Memory — the single source of truth

Every time a student does a lesson, the system accumulates a **Lesson Memory**:
everything that happened, in one place.

A Lesson Memory contains:

- **What the student built** — the artifacts and answers captured during the lesson
- **What homework was assigned** — practice for the student
- **What the parent experienced** — the auto-generated parent page
- **How the parent responded** — opened, reaction, comment
- **What goes into the portfolio** — the artifacts, permanently
- **Whether it's exceptional** — the showcase flag

### The key that threads it all together

A Lesson Memory is identified by **(student, program, lesson)** —
`(user_id, program_slug, lesson_key)`. That composite key already runs through
the data model, so Lesson Memory is not a new monolith to build; it is the
**join** across tables that already share this key. Nothing is duplicated —
each concern owns its own rows, all pointing at the same lesson.

| Concern | Where it lives | Keyed by |
|---------|----------------|----------|
| Student work + artifacts | `tb_lesson_responses` | user + program + lesson + field |
| Homework (assigned or custom) | `tb_homework` | user (+ program + lesson for assigned) |
| Parent experience (artifact + **concepts** + starter) + publish state | `tb_parent_experience` *(new, Phase 3)* | user + program + lesson |
| Parent response | `tb_homework_moments` → generalised | the parent-experience / homework row |
| Portfolio entry | `tb_portfolio_items` | user, references the artifact |
| Showcase candidacy | flag on the lesson memory | user + program + lesson |

> **Storage rule: never duplicate a file.** An artifact is stored once. The
> parent page, the portfolio, the website showcase, and marketing all
> *reference* the same artifact. One source of truth, many views.

### Two kinds of Lesson Memory — content is optional

A Lesson Memory does **not** require curriculum content. The **fields are the
contract**; how they get filled is an implementation detail.

- **Content-backed** — a curriculum lesson exists (slides, `[data-save]`,
  interactive components). Artifacts and student answers **auto-capture**, and the
  homework **personalizes automatically**.
- **Ad-hoc (teacher-authored)** — no lesson content in the system: a live Scratch
  build, a one-off topic, a session taught off-platform. The teacher creates it
  from the **group / class → student → homework** section as a *custom* homework
  and supplies by hand what capture would otherwise provide — a title /
  achievement, the artifact link(s) (paste the Scratch / game / website URL), and
  a conversation starter.

Everything downstream — Parent Experience, Publish, portfolio, showcase, timeline,
analytics — reads the **same fields**, so it works identically for both. Auto-
capture is one way to fill a memory; manual entry is the other. This is precisely
what keeps "one source of truth" intact.

> **No new tables for ad-hoc.** An ad-hoc memory *is* a custom `tb_homework` row:
> `program_slug` / `lesson_key` are `NULL` (identity = the row `id`), the
> highlight fields carry the parent **achievement** and **conversation starter**
> (`ask_child`), and `links[]` carry the **artifacts**. The Try-It / Watch-It
> decision runs on the pasted artifact URL exactly as it does on a captured one.

---

## During the lesson — artifacts build themselves

Every interactive component automatically saves its own output. The teacher
never collects anything by hand; the lesson assembles its own artifacts as it
progresses.

| Component | Auto-saved artifact |
|-----------|---------------------|
| Scratch | Project URL |
| GDevelop | Game URL |
| Website | Live URL |
| Python | Demo URL |
| AI | Generated image / chatbot link |
| Blender | GIF / video preview |
| Any `[data-save]` field | The student's typed answer (idea, name, pitch, mascot…) |

**Already built (see Build Status):** every `[data-save]` field now persists to
`tb_lesson_responses` per student, and a lesson can nominate an `artifactField`
whose URL flows straight into the homework and portfolio. The remaining work is
giving each interactive component type its own artifact-save hook.

---

## The final lesson slide (teacher)

Instead of writing reports, the teacher simply **reviews the lesson** on its last
slide. Three sections, then one button.

### Section 1 — Homework  *(for the student)*

Assign practice. **Completely independent of the parent experience.**

- Homework / assignment
- Resources
- (Optional) due date

### Section 2 — Parent Experience  *(auto-generated preview)*

The system has already assembled it from the lesson's artifacts:

- ✓ Game / Try It  *(the artifact)*
- ✓ AI image / Watch It
- ✓ **Concepts learned**  *(auto from the lesson's declared concepts; editable)*
- ✓ Conversation starter

The teacher checks it, then presses **📤 Publish** — not "Send." The teacher is
*publishing the lesson*, not manually emailing parents. **Publish sends exactly
one email; later edits are silent.**

### Section 3 — Showcase  *(optional)*

A single checkbox: **☐ Mark as showcase candidate.** Only exceptional lessons
get marked.

### What Publish does

```
Publish
  ↓
Generate Lesson Memory
  ↓
Generate Parent Page  (artifact + concepts + conversation starter)
  ↓
Update Student Portfolio
  ↓
Find Parent Email
  ↓
Send ONE Email — the invitation
       headline link → Parent Experience page
       small links   → /h/{code} (homework) · /p/{username} (portfolio)
```

No manual emails. No salesperson. No teacher texting parents. Editing after
Publish never re-sends — the links are live and the portfolio auto-updates.

---

## Homework  *(audience: student)*

**Purpose: practice.** Homework is **not** mixed with the parent page. They are
two separate surfaces with two separate URLs, created independently — never one
fused row. (Model **A**: two *views* of one lesson, joined by
`(student, program, lesson)`, but neither requires the other to exist.)

- Assignments
- Interactive practice
- Progress
- Completion

**A living, editable page — not a one-shot.** Homework lives on its own page in
the **group / class → student** section. It is editable **anytime**:

- Assigning from a lesson slide **appends** a homework row to the student's list;
  it never overwrites.
- The teacher can open that page later and edit the task, resources, or due date
  at any point — editing does **not** re-notify anyone (see the email rule below).

The public homework page (`/h/{code}`) becomes **pure homework** — title, task,
resources, optional solution/comments. The parent highlight fields and the
reaction thread move out of it and onto the Parent Experience page.

---

## Parent Experience  *(audience: parent + child)*

**Purpose: experience today's lesson together.** Its own page, its own URL —
separate from `/h/{code}`. One simple flow:

```
Today's Achievement
   ↓
Try It  /  Watch It   (the artifact — what the child built)
   ↓
Concepts Learned      (what the child learned today)
   ↓
Conversation Starter
   ↓
Celebrate
   ↓
Share
```

**Concepts Learned** *(new field)* — a short list of what the child learned
(e.g. *loops · collisions · coordinates*). A lesson can **declare** its concepts
so they auto-fill; the teacher can **override or type them by hand** (required for
ad-hoc memories with no slides). Same auto-or-manual pattern as the achievement
fields.

**Try It** — when the artifact is interactive (Scratch, GDevelop, website,
Python, Thunkable, AI chatbot), the parent plays it live.

**Watch It** — when it is not interactive (Blender GIF, animation, AI image),
the parent watches it. *The backend decides Try-It vs Watch-It automatically
from the artifact type. Parents never need to know why.*

**Conversation Starter** — generated automatically, one or two questions:
*"How did you make the character jump?" · "Why did you choose these colours?" ·
"What happens if you change this?"*

**Celebrate** — simple reactions: ❤️ Proud · 🚀 Keep Going · 🎉 Amazing · 💬 optional comment.

**Share** — native phone sharing (Zalo, Messenger, WhatsApp, Email).
**Private only for MVP.**

---

## The parent email — an invitation, not a notification

**One email per lesson. One headline link. Two small links. Sent on Publish.**

The whole point is that parents never track a pile of links. The email carries
**one** door; everything else lives *inside* the pages, not the inbox.

```
Subject:  Tom built his first platform game today 🎮

Tom built a game where the character jumps over obstacles.
Today he learned: loops · collisions · coordinates.

        ┌──────────────────────────────┐
        │   ▶  See what Tom made        │   ← the ONE headline link
        └──────────────────────────────┘         → Parent Experience page

        📚 This week's practice →              ← small, secondary → /h/{code}
        🗂  Everything Tom's made →             ← small, secondary → /p/{username}

Open. Play. Talk. Done.
```

**The rules that keep it simple:**

1. **Trigger on Publish, never on edit.** The teacher hitting **Publish** sends
   exactly one email. Editing the homework or the parent page afterward is
   **silent** — the links are already live and the portfolio already reflects the
   change. One deliberate Publish = one email. This is the rule that prevents
   spam.
2. **One headline link.** It points at the Parent Experience page, which *is* the
   hub for artifact + concepts + reaction + share. The email does not carry those
   individually.
3. **Homework is a small secondary line**, not the headline — its real audience is
   the child, but the parent can use it to nudge. Celebration always leads.
4. **The portfolio is the one permanent link.** `/p/{username}` never changes and
   auto-updates. Sent once in a welcome email and re-linked at the foot of every
   lesson email, it is the parent's single home base. There is really only one
   link to remember.

An invitation is one door. A notification is a pile of links. We send invitations.

---

## Parent Response — it becomes part of the lesson

The parent's reaction is the lesson's final puzzle. It does **not** become a
message in an inbox. It becomes part of the Lesson Memory.

Parent Response stores exactly:

- Opened
- Reaction
- Comment
- Submitted time

Nothing more.

---

## Student Timeline & Portfolio

Every lesson becomes a **permanent memory** on the student's timeline:

```
Lesson 1 · Game    · Homework · ❤️ Proud     · "I'm so impressed!"
Lesson 2 · Website ·          · 🚀 Keep Going
Lesson 3 · Robot   ·          · 🎉 Amazing
```

Students can look back years later. Teachers see it naturally — no separate
report to write.

The **Portfolio** is where every artifact already lives:
`Student → Portfolio → Lesson → Artifacts`. It is the source of truth that the
parent page, showcase, and marketing all reference.

---

## Content system — an inbox, not a CMS

Not a content bank. Not folders or collections. Just an **inbox** of the lessons
a teacher marked as exceptional.

```
Lesson → ⭐ Showcase Candidate → Content Inbox → Approve → Website
```

The inbox is tiny:

```
Amazing Scratch Game   [ Preview ]  [ Approve ]  [ Dismiss ]
```

Approve references the existing artifact — nothing is re-uploaded.

---

## Admin dashboard

The teacher sees each lesson as history, not as a notification feed:

```
Lesson · Homework · Artifacts · Parent Viewed ✓ · Reaction ❤️ · Comment
```

No inbox. No notifications. Just the lesson's own record.

---

## Analytics — a free byproduct

Because every lesson is stored, analytics come naturally.

- **Student:** lessons · homework · portfolio · parent interactions · parent comments
- **Teacher:** parent open rate · average response time · most common reaction · homework completion
- **School:** most popular projects · most shared projects · most viewed lessons · top showcase candidates

---

## Permissions

| Role | Can do |
|------|--------|
| **Teacher** | Assign homework; review the auto-generated parent experience and Publish it; mark showcase candidates; everything keyed to their own students |
| **Student** | Do lessons (work auto-saves); edit portfolio items; toggle visibility |
| **Parent** | Open the published parent page (no account); Try/Watch; leave one reaction + optional comment; share privately |
| **Admin** | Review the Content Inbox; approve showcase pieces for the website |

---

## Build status (what already exists)

The audit found most infrastructure was already present; recent work turned the
first slice of the Lesson Memory idea into reality.

### ✅ Built — Lesson Memory foundation (capture → personalize)

- **`tb_lesson_responses`** *(migration written, apply pending)* — every
  `[data-save]` field a student fills now persists per **(student, program,
  lesson, field)**, not just to their device. Teacher preview never writes.
- **Personalized homework** — the Assign-from-slide panel reads a student's real
  answers and rewrites the highlight from them (templated lines with `{child}` /
  `{field}` placeholders, falling back to generic wording), shows the student's
  actual answers for reference, and auto-attaches an `artifactField` URL.
- **Many homeworks per student** *(migration written, apply pending)* —
  `tb_homework` gained `program_slug`, `lesson_key`, `source`; dropped
  `unique(user_id)`. Assigned homework keys to its lesson; custom homework is its
  own row. **This resolves the clash** where assign-from-slide and the custom
  editor overwrote each other.
- Personalized templates authored for Startup Foundation Lessons 1 & 2.

### ⏳ Migrations awaiting application (Supabase SQL editor)

- `supabase/migrations/2026-07-17_homework_many.sql`
- `supabase/migrations/2026-07-17_lesson_responses.sql`

### Pre-existing surfaces

| Area | What's there |
|------|-------------|
| `tb_portfolio_items` | title, desc, image, video, link, code snapshot, public toggle, teacher curation |
| `tb_homework` | now many-per-student; highlight fields; shareable `/h/{code}` |
| `tb_homework_moments` | parent reaction + comment (the seed of Parent Response) |
| `tb_certificates` / `tb_reports` | verification codes, `/c/{code}`, `/r/{code}` |
| Public pages | `/p/{username}`, `/h/{code}`, `/r/{code}`, `/c/{code}` — no parent auth |
| Lesson slides | rich interactive content; `[data-save]` capture → DB; Assign-from-slide |

---

## Phase plan

Each phase is one more **view** of the Lesson Memory. Nothing here is a separate
system.

### Phase 1 — Capture & personalized homework  ✅ *(built; apply migrations)*

The foundation of Lesson Memory. `tb_lesson_responses` capture, many-homeworks
model, personalized Assign-from-slide. **Next:** apply the two migrations and
verify the capture → personalize loop against real student data.

### Phase 2 — Homework list & the two creation paths (incl. ad-hoc memories)

Turn the per-student homework page into a **list** of that student's Lesson
Memories: each assigned lesson + any custom homework, each with its `/h/{code}`.
"New homework → **From a lesson** / **Custom**." Optional fields; nothing required.

The **Custom** path is the **ad-hoc Lesson Memory creator** — for sessions with no
lesson content. Expose on it the same fields a captured memory would carry so a
manual memory is complete:

- **Achievement** (parent-facing) + **conversation starter** — the existing
  highlight fields.
- **Artifact link(s)** — paste the Scratch / game / website / video URL; these
  become the `links[]` the parent page and portfolio reference.

Because it writes the same `tb_homework` shape (with `program_slug`/`lesson_key`
`NULL`), an ad-hoc memory flows into Parent Experience, portfolio, showcase, and
the timeline with **no extra plumbing**.

### Phase 3 — Parent Experience + Publish  *(the split + the email)*

The concrete build that separates homework from the parent page and wires up the
one-email-on-Publish flow.

- **Split `/h/{code}` into two surfaces.** Strip the highlight fields and the
  reaction thread out of the homework page so `/h/{code}` is **pure homework**.
  The parent-facing content moves to its own page + URL.
- **`concepts` field (new).** A lesson can declare its concepts (auto-fill); the
  teacher can override or type them by hand. Carried on the same row as the other
  highlight fields, so ad-hoc memories get it for free.
- **`tb_parent_experience`** keyed to **(student, program, lesson)**: generated
  page content + `published_at`. Two *views* of one lesson (model **A**) — the
  homework row and the parent row share the join key but neither requires the
  other.
- **Public parent page** with the `Achievement → Try/Watch → Concepts →
  Conversation → Celebrate → Share` flow. **Try-It vs Watch-It chosen
  automatically from artifact type.**
- **Publish action → one email.** Generate parent page → update portfolio → find
  parent email → send **one** invitation (headline link → parent page; small links
  → `/h/{code}` + `/p/{username}`). Fires on Publish only; **editing afterward
  never re-sends.**
- Homework stays completely separate from this page.

### Phase 4 — Parent Response as part of the lesson

Generalise `tb_homework_moments` into a Parent Response on the lesson memory:
`opened`, `reaction`, `comment`, `submitted_time`. It surfaces on the student
timeline and the admin dashboard — never as a message/notification.

### Phase 5 — Student Timeline & Portfolio as source of truth

Every lesson memory renders on the student timeline; every artifact lives once in
the portfolio and is *referenced* everywhere else.

### Phase 6 — Content Inbox & Showcase

Showcase-candidate flag → tiny approval inbox → website. References existing
artifacts; no re-upload, no CMS.

### Phase 7 — Analytics

Fall out of the stored lesson memories: student, teacher, and school views.

### Phase 8 — Per-component artifact hooks

Give each interactive component type (Scratch, GDevelop, website, Python, AI,
Blender) its own artifact-save so `Try It` / `Watch It` populate automatically
for every project type, not just `[data-save]` text and a manual artifact link.

---

## Product principles

1. **One lesson produces everything.** Teach once; the system generates the rest.
2. **One source of truth.** The Lesson Memory. Never duplicate an artifact.
3. Homework is for the student; the parent page is for the family. Separate surfaces, separate URLs, created independently.
4. The parent email is an invitation, not a notification: **one email per lesson, one headline link, sent on Publish — never on edit.** Links live inside the pages, not the inbox.
5. A parent's response becomes part of the lesson, not a message in an inbox.
6. Publish the lesson — don't manually send, email, or text.
7. Marketing is a natural byproduct of genuine family moments, never the goal.
8. Sharing is always optional and private-by-default for MVP; explicit permission before any public use.
