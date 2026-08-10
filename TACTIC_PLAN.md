# TechTutor Family Ecosystem — Tactic Plan

> Sequenced execution plan for the Family_Learning_Plan.md. Goal: **more signups
> via existing customers**, built one testable step at a time — never the whole
> system at once. Each step is independently shippable and killable.

## North star (from the plan)
One lesson produces everything. Every feature is a *view* of the same Lesson
Memory, keyed by `(student, program, lesson)`. We build views left-to-right,
each one backing itself in the DB. Nothing duplicated; artifacts stored once.

## Reality check (verified 2026-07-18, not the plan's claimed status)
- `referral_code` column EXISTS on `schedule_bookings` (migration `2026-06-30_referral_code.sql` applied).
- The **2 Phase-1 migrations the plan says are "written, apply pending" DO NOT EXIST on disk** (`admin/supabase/migrations/` has no `2026-07-17_*.sql`). So Phase-1 capture code is built but its schema is NOT applied.
- **Referral state (verified 2026-07-18):** Real system lives in `admin/` — `/refer` (parent link gen w/ Copy) → `/r?code=` (friend landing, generic "REFERRED BY A TechTutor Parent", Book Trial/Zalo/WhatsApp) → `/schedule?ref=code` → `referral_code` stored (`api/schedule/book/route.ts`). `/r` name display made generic per Gleb. `portal/src/components/ReferralBlock.tsx` restored on `/p/{username}` — links to the `/refer` hub (part of the system, not a parallel rebuild). `referral_rewards` table written (`admin/supabase/migrations/2026-07-18_referral_rewards.sql`, PENDING APPLY) backs the 500k advocate credit. `free-trial.html` `?ref=` edit reverted (that form is web3forms, a separate brochure path). GAP: no `referral_code` column on `profiles`/`students` — the code's generation source is missing (prev agent removed it); find before portfolio can embed a code directly.
- **`referral_rewards` table now EXISTS** (was missing) — the advocate's reward is now backed, not just marketing copy. Apply the migration + test the manual wedge before automating.
- Portal curriculum coverage = **1 of 9 programs** (Startup Foundations, 2 lessons built + 15 locked stubs). Other 8 programs have no portal lessons.

## Principle: two tracks, one goal
- **TRACK S (System)** — builds the Lesson Memory spine per the plan's phases. Serves *retention + future share-content*.
- **TRACK W (Wedge)** — makes the *existing* referral program actually drive signups now. Serves *your stated signup goal* directly.
- They converge: when Track S produces student work, Track W's share loop has real content to amplify. Until then, Track W runs standalone on the referral page that already exists.

---

## TRACK S — System (plan phases, in order)

### S1 — Apply Phase-1 capture schema  [NEXT SYSTEM STEP]
The plan's capture code expects tables that aren't applied. Write + apply:
- `2026-07-18_lesson_responses.sql` — `tb_lesson_responses` (student, program, lesson, field, value).
- `2026-07-18_homework_many.sql` — `tb_homework` gains `program_slug`, `lesson_key`, `source`; drop `unique(user_id)`.
- Then: verify capture→personalize loop against ONE real student's data.
- **Test:** a `[data-save]` answer from a real lesson persists and shows in the Assign preview. If it doesn't, the whole spine is hollow.
- *Killable:* if capture can't be verified in a session, stop — nothing downstream is real yet.

### S2 — Homework list + ad-hoc (plan Phase 2)
Per-student `/h/{code}` becomes a LIST. Custom (ad-hoc) homework = its own `tb_homework` row with `program_slug`/`lesson_key` NULL. This is the ad-hoc Lesson Memory creator — lets teachers log off-platform sessions without curriculum.

### S3 — Parent Experience + Publish (plan Phase 3)
Split `/h/{code}` into two surfaces. New `tb_parent_experience` (student+program+lesson). `concepts` field. Publish → ONE email (headline → parent page; small links → `/h/{code}` + `/p/{username}`). Fires on Publish only; edits are silent. **This is the content engine Track W amplifies.**

### S4 — Parent Response (plan Phase 4)
Generalise `tb_homework_moments` → Parent Response on the lesson memory (opened, reaction, comment, submitted_time).

### S5 — Timeline & Portfolio as source of truth (plan Phase 5)
Every lesson memory renders on the student timeline; artifacts live once in portfolio, referenced everywhere.

### S6 — Content Inbox & Showcase (plan Phase 6)
Showcase flag → tiny approval inbox → website. References existing artifacts.

### S7 — Analytics (plan Phase 7)
Falls out of stored memories: student / teacher / school views.

### S8 — Per-component artifact hooks (plan Phase 8)
Each interactive type (Scratch, GDevelop, website, Python, AI, Blender) saves its own artifact URL so Try-It/Watch-It populate automatically.

---

## TRACK W — Wedge (signups now, standalone)

### W1 — Back the advocate reward  [NEXT WEDGE STEP]
Today the referral page promises 500,000₫ to both sides but **nothing records the advocate's earn**. Add ONE table:
```sql
CREATE TABLE public.referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_code text NOT NULL,   -- from schedule_bookings.referral_code / ?ref=
  referrer_parent text,
  referred_student text,
  enrolled_at timestamp,            -- paid enrollment confirmed
  reward_vnd integer DEFAULT 500000,
  status text DEFAULT 'pending',    -- pending | credited | expired
  created_at timestamp DEFAULT now()
);
```
Manually credit for the test. **Test:** do shared referral links convert to *paid* signups? Measure over 2–4 weeks.

### W2 — Bake the referral into the EXISTING portfolio page  [PART OF THE SYSTEM]
The public portfolio `/p/{username}` is the surface parents ALREADY share. The referral system ALREADY EXISTS in the admin app: `/refer` (parent's link generator w/ Copy) → `/r?code=...` (friend landing, generic "REFERRED BY A TechTutor Parent", Book Trial/Zalo/WhatsApp) → `/schedule?ref=code` → `referral_code` stored. There is ALSO a portal-side `/r/[code]/page.tsx`.
**Correct approach (restored after wrong revert):** add a referral block to `/p/{username}` that links INTO this existing system — e.g. to the parent's `/refer` page (or builds `admin.techtutor.academy/r?code={theirCode}`). It must use the parent's REAL referral `code`, not `username`. **Open gap:** no `referral_code` column exists on `profiles`/`students` — the code source the previous agent used is missing. Need to confirm where a parent's code is generated/stored before the portfolio block can embed it (or simply link to `/refer`, which already has it).

### W3 — Capture is ALREADY wired
`admin/src/app/api/schedule/book/route.ts` writes `referral_code` from the booking's `referralCode` (lines 78, 160); `/r` passes `?code` into `/schedule?ref=code`. So the public capture loop already works via the admin scheduler. No new `?ref=` plumbing needed on `free-trial.html` (that form is web3forms, a separate brochure path).

### W4 — Automate credit + invoice deduction (ONLY if W1–W3 show signal)
On paid enrollment with a `referral_code`, auto-insert `referral_rewards` + deduct from next invoice. Until then: manual, measurable.

---

## Sequencing rule
- **Do S1 and W1 in parallel** (different files/tables; no conflict). S1 builds the spine; W1 makes signups measurable *now*.
- After S1 verifies, continue S2→S3. After S3, Track W's share loop has real student content to amplify — W2/W3 become the distribution engine for S3's Parent Experience.
- **Never start S3+ before S1 verifies** — every downstream view assumes capture works.
- **Never automate W4 before W1–W3 prove referrals convert** — that's the "test 1–3 things, keep going if they work" rule.

## What "done" looks like (minimum viable)
- S1 applied + verified on real data.
- W1 table applied; W2 self-serve link live on referral page; 1–2 referrals manually credited and tracked.
- You can answer: *"of the referral links shared this month, how many became paid signups, and how much did we owe advocates?"* — a question impossible to answer today.

## Out of scope (explicitly deferred)
- Building the other 8 programs' curriculum (separate workstream; governed by `tt-content-author` depth standard).
- Full portal rebuild; admin dashboard polish; certificate/report automation.
- Anything that requires the whole system before it yields a signal.
