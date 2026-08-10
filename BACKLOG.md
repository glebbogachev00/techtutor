# TechTutor Backlog — Idea Intake

This is the **intake layer**. Items stay here until they pass the validation gate,
then get triaged into TACTIC_PLAN.md as executable steps. Nothing here is a build yet.

## Process (applied to every item)
1. **Intake** — one line, tagged with venture + suspected problem. No elaboration.
2. **Validation gate** — is there *evidence* the problem exists? If no → task is
   "observe/measure", not "build".
3. **Triage + north-star filter** — tier T1–T5; does it serve the incubator / shipped-
   something-real north star? If neither → exploration, not core work.
4. **Pick one, smallest viable** — pilot by *doing*, not by building infrastructure.

---

## B1 — Play Mode at end of slides
- **Venture:** TechTutor (TechBash / Play Mode + lesson slides)
- **Problem exists?** Partial. Low TechBash adoption/engagement reported (real, but
  unmeasured — "not apparent"). Hypothesis: in-class slides → Play Mode drives use.
- **Triage:** T3 — modify existing (slides + Play Mode both exist; the linkage + result
  capture are new).
- **North star:** engagement loop + parent signal (results → parents), from the
  Duolingo-loop discussion. Reuses what works (Play Mode already "going well").
- **Before build (dependencies):**
  - confirm Play Mode result-capture path exists in portal (`tb_lesson_responses` /
    `tb_homework`) — or what it writes to.
  - confirm slides can embed / launch Play Mode.
  - define the parent-visible results surface (the missing Duolingo "progress hit").
- **Status:** BACKLOGGED — validation gate pending. Cheapest first step is a *pilot*,
  not a build: run Play Mode in one live class, measure whether in-class use lifts
  engagement. No code until that signal is real.

## B2 — Academic material delivered via slides
- **Venture:** TechTutor (academic program content / authoring)
- **Problem exists?** Internal (authoring load), not user-facing. Claim "most material
  through slides" is unvalidated as a standing standard.
- **Triage:** T3 — modify existing content system; touches `tt-content-author`.
- **North star:** "one lesson produces everything" — slides as primary carrier feed the
  portal spine (homework, parent experience, portfolio).
- **Before build (dependencies):**
  - define which academic programs / levels this applies to.
  - check `tt-content-author` for existing slide-authoring conventions.
  - decide: standing authoring standard vs per-program.
- **Status:** BACKLOGGED — needs scoping before any build. Pure scoping task, no code.

## B3 — Parent reactions on the portfolio (parent-student interaction)
- **Venture:** TechTutor (TechBash / portfolio `/p/[username]` + parent engagement)
- **Problem exists?** Partial→real. Evidenced: parents are effectiveness-blind (design
  doc B4 — parents DM asking "did my child get the homework?"). The portfolio today is
  **passive** (view-only) — no reason to engage or return. Gap = an *immediate reason*
  to engage, not more content (teacher can already make/edit/publish anything).
- **Triage:** T3 — modify existing (portfolio exists; reactions + kid-facing display are new).
- **North star:** parent visibility → engagement → referral. Flips the portfolio from a
  gallery into a two-way loop: parent taps a reaction/cheer + short note → **the kid sees
  it** → kid ships more, parent returns. Fires the referral prompt at the reaction moment
  (peak pride) — exactly where the design doc says to.
- **Academy tie-in:** the reaction (free engagement) is the natural launch point for the
  Academy upsell — an emotionally-engaged parent is the one who upgrades. Individual
  graded wins stay free + react-able; the **full graded report card + letter of rec** is
  the paid unlock, teased right at the reaction moment.
- **Before build (dependencies):**
  - new `reactions` table (item/target, emoji, optional note, optional "from" e.g. Mum/Grandma).
  - reaction UI on `/p/[username]` (link-based, no parent account — like `/h`, `/r`).
  - kid-facing "your family cheered your work" surface on the student dashboard.
  - decide identity model (anonymous vs named relationship).
  - referral nudge + Academy tease shown post-reaction.
- **Status:** BACKLOGGED. Cheapest first step = the core loop (parent reacts → kid sees
  it); referral/Academy nudges layer on after. Low new design, reuses the portfolio.

---

## Notes
- Neither item is a build yet. Both pass triage (real-ish problem, T3, reuse existing
  systems). Both are gated on *observe-first*.
- Do NOT promote to TACTIC_PLAN.md until the validation gate passes.
- If we pick one to move: B1's observation step is cheapest (Play Mode already works;
  an in-class pilot costs zero build). B2 is pure scoping.

## Self-hosted tool screen (all failed the "does the problem exist?" gate — log only)
Pattern: repeated infrastructure-ahead-of-problem tangents. Each was screened against
the validation gate; none mapped to a real, evidenced problem in our work. Next one
gets the same one-line verdict, no re-litigation.
- Glance (self-hosted dashboard) — no homelab/service-monitoring need; skip.
- Ollama (local models) — weak Mac can't run privacy-grade models; cloud via Hermes
  already covers cost/privacy; skip.
- Odysseus (PewDiePie self-hosted AI workspace) — duplicate of Hermes (chat+agents
  already have it); skip.
- Generic "what self-hosted tools do I need?" pass — no evidenced problem; skip.

---

## B3 — In-portal games for TechBash (lesson warm-up)
- **Venture:** TechTutor (TechBash portal / student experience)
- **Problem exists?** Partial — real behavior observed: at lesson start, Gleb + students
  use external sites (GameKit, Scribblio, Gartic Phone, Blooket) just to play for fun.
  GameKit + Blooket are the standout "really fun" ones. Hypothesis: bring that
  warm-up *inside* TechBash so students stay on their TechBash accounts, not 3rd-party.
- **Triage:** T3 — modify existing (TechBash accounts + portal both exist; the game
  surface is new but reuses auth/session).
- **North star:** keep students inside the incubator loop; "they use their TechBash account
  for this" = deeper portal habit, not just classes.
- **Before build (dependencies):**
  - decide: build 1–2 *simple original* games (not clone Blooket/GameKit — licensing +
    scope) vs embed/link the existing fun ones inside the portal shell.
  - confirm portal can host a lightweight game view under the student session.
  - pick the one game to pilot (suggest: the GameKit-style one — highest "fun" signal).
- **Status:** BACKLOGGED — validation gate pending. Cheapest first step is a *pilot*:
  define one simple game (or one embedded frame) and run it in one live class. No build
  until the "they'd actually use it instead of the external site" signal is real.

## B4 — Parent engagement / participation feature
- **Venture:** TechTutor (parent experience / engagement loop)
- **Problem exists?** PARTIAL — now evidenced (from Gleb's direct knowledge, not just
  hypothesis). Two concrete parent pains observed:
  1. **Homework-delivery anxiety (non-standard today).** Some parents message asking
     "did my child GET the homework / was it sent?" (online classes — NOT physical
     pickup). Handled ad-hoc/manually, no self-serve status view.
  2. **Effectiveness blindness (the real root).** Gleb knows personally ~90% of customers
     don't know WHAT we teach, can't verify projects are student-built, can't tell if
     it's working. → They can't *participate* because they have NO visibility.
  Insight: engagement isn't a "hook" problem, it's a *visibility* problem. Parents
  support them a lot precisely because parents are flying blind.
- **Triage:** T3 — modify existing parent surface (parent view/comm already exists); the
  participation hook is new. Root fix = give visibility, not a gimmick.
- **North star:** parent signal felt (Duolingo-style), not content cards — parents
  *see + do* something, not just read. Maps to the standing "action/signal" rule.
  Concretely: a parent should be able to *see* "my child built THIS, here's the proof"
  and *answer* the logistics question themselves.
- **Before build (dependencies):**
  - define what "participate" means concretely (reply, react, co-task, share,
    attend a live moment?). Avoid A/B/C menu offload — reason the one hook.
  - check current parent surface for where a participation action can live.
  - decide the visibility primitive: how does a parent *see* student-built proof
    without us hand-holding every account? (portal already captures Play Mode
    results + project artifacts — surface those to parents.)
  - logistics: can the "going home / homework" answer be self-serve vs a message?
- **Status:** BACKLOGGED — validation gate pending. Cheapest first step is *observe*:
  what do parents currently do, and where's the drop-off. No build until the problem is
  evidenced.
