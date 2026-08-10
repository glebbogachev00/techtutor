# TechTutor / TechBash — Portable Context

> One file you own. Paste it into any AI (Claude, Cursor, Grok, ChatGPT, etc.) to bring it up to speed.
> Keep this updated by hand, or ask Claude Code to refresh it from its memory.

---

## Who I am
- Gleb — solopreneur / indie-maker. I dislike YC / venture-startup framing; I identify as a solopreneur.
- Building **TechBash**, an education product for kids (ages 8–17).

## Product north star
- The portal (`/portal`, the TechBash Academy app) is an **incubator for young builders** — NOT a coding course, NOT venture/YC hype.
- Goal: produce kids who are great **problem-solvers, builders, and makers** who leave with a real foundation (problem-solving + programming + build-your-own-thing loop) to go build their OWN thing.
- Core ethos: **build something real people actually use.** Ventures come from real problems in a kid's own world (siblings, school, chores, games). Success = "shipped something a real person actually used," not "missions completed."
- The founder loop (find a real problem → build an MVP → get a real user → iterate → pitch) is the **spine**, tasted early and small, scaling to a demo-day capstone.
- Student portfolio + public profile (`/p/[username]`) + certificates = the incubator's proof-of-work output.

## How I want kid-facing content designed (apply by default)
- **One accent only** (`#193B92`). No green/orange/teal/gold — extra colors read as clip-art. (Exception: existing semantic tab chips Concept/Build/SideQuest.)
- **No walls of text.** Straight to the point, cut throat-clearing. Kids decide in one sentence.
- **Tell a story; the kid is the hero.** Second person, concrete moments ("you send your friend a link at 9pm and they sign up"), never "students will learn to…". Frame courses around a hero archetype (Startup Foundation = the Entrepreneur).
- **Specific beats general — always.** Examples as concrete as what you ask the kid to produce.
- **No motivational-poster clichés** ("unlock your potential", "let's go build it").
- **Visuals must teach, not decorate.** One visual device per concept; prefer inline SVG/CSS over emoji.
- **No emoji — hard rule.** Every glyph, icon, and badge is inline SVG/CSS in accent `#193B92` (or inherits text color). The curriculum `glyph` field uses a non-emoji symbol (e.g. `◆`), never an emoji. Emoji that can't inherit color read as clip-art and break the one-accent system.
- **Homework = a checkable BUILD a real person reacts to**, never a reflection worksheet. The kid ships/records/sends something and captures a real person's actual reaction (`data-save` field). Recap questions ("what did you learn?") are banned.
- **Every slide needs a stated purpose.** No page exists "for interactivity" — each must teach, capture an artifact, or move the founder loop forward. If a page can't state its job, cut it.
- **Teach validation early.** Every idea lesson includes a "would a real person miss this if it vanished?" test BEFORE any build step — guards against building cool-but-unneeded things.
- **Make it a repeatable system** — playbooks/skeletons, not one-off slides.

## System playbooks (design/ops docs, built as self-contained HTML artifacts)
Shared studio identity: paper #FBFBFD, ink, accent #193B92, heavy-tight sans display, mono labels.
1. **The Slide Playbook** — how to author lesson slides kids won't skim (Cast the Hero, 3-move induction, Hook→Turn→You slide shape, reusable patterns, Visual Kit, Session Goal, Lesson Skeleton, homework = a checkable BUILD).
2. **BashVerse Competition System** — seasonal, space-themed competition (season arc, 3 age divisions, planets, judging rubric, social-media engine, season kit checklist).

## Admin portal
- Next.js 16 app in `/admin/`, shares ONE Supabase (`bcjmswzubfyjcdgwowfb`) with the student portal.
- Phase 1 complete: iron-session auth (admin + sales), route guarding via `src/proxy.ts`, tables `admin_students / admin_lessons / admin_payments / admin_settings`, pages for Dashboard/Students/Lessons/Import/Compensation.
- Program-completion email done (Resend); admin reads portal tables directly (`tb_reports`, `tb_certificates`, `profiles`), join key = email.
- Scheduling system spec at `admin/docs/scheduling-spec.md` — Phase 1 built then parked at my request.

## Pricing & compensation
- Programs are **24-lesson bundles** (6 projects each). NOT the old 8/12-lesson model — the site moved to 24-lesson "programs."
- Tiers (live site, learning-system.html#builder calculator):
  - **Private Coaching (1-on-1):** 15.000.000₫ / ~$608 per program.
  - **Shared Learning (group 2-4):** 8.400.000₫ / ~$346 per program (most popular; starts private until peers join).
  - **Academy upgrade:** +2.000.000₫ / +$80 (graded homework, showcase portfolio, transcript, rec letter).
  - **Bundle discounts:** 3 programs = 10% off, 6 programs = 15% off. Pay full or split into 2 installments. Commitments portable across all pathways.
- All currently 1-on-1 in practice even if labeled "group."
- Comp: Pool = revenue − costs (sales salary 8M + other). Teaching pay = lessons × 250k/lesson/teacher. Remainder split 50/50 (Gleb & Manthan). `cancelled_late` (<24h) counts as taught.
- NOTE: pricing on the live VN/US site is now the source of truth. The admin portal still stores prices as free-form per-student fields (amount_vnd, package_lessons, lesson_price_vnd) — there is NO centralized price table; reconcile manually if needed.

---
_Last refreshed: 2026-07-20_
