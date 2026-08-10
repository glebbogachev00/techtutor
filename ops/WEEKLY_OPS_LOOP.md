# TechTutor Weekly Ops Loop

**Job:** Keep TechTutor running frictionlessly — intake, scheduling, payments, content, support.  
**Runner:** Admin (Gleb or delegated)  
**Success signal:** Zero "what should I do about this?" decisions per week — every trigger → deterministic action.

---

## The loop (run weekly, Sunday evening or Monday morning)

### 1. Intake & Trial Conversion
**Source of truth:** Admin portal → Students → filter `status: trial`

| If | Then |
|---|---|
| Trial scheduled ≥7 days ago, no follow-up logged | Send check-in message: "How was [child's name]'s trial? Ready to pick a program?" |
| Trial completed, parent said "yes" but no payment in `admin_payments` | Send invoice link (Formspree → Zalo/email) |
| Trial scheduled <7 days ago | Wait |
| Trial status = `churned` | Archive; no action |

**Decision file:** `~/Documents/techtutor/ops/intake-decisions.md` (if/then for common parent questions: "can we start next week?", "can we switch teachers?", "what if my kid misses a class?")

---

### 2. Scheduling & Lessons
**Source of truth:** Admin portal → Lessons → filter by `date_range: this_week`

| If | Then |
|---|---|
| Lesson status = `completed`, logged ≥24h ago | No action (comp already counts it) |
| Lesson status = `cancelled_late` (<24h notice) | Verify it's logged as taught for comp; no makeup |
| Lesson status = `cancelled_ok` (≥24h notice) | Offer makeup slot; log makeup in `admin_lessons` with `makeup: true` |
| Student absent, no cancellation logged | Teacher reports it → log as `cancelled_late` |
| Recurring lesson approaching, no calendar event | Create Google Calendar event (later: auto-scheduled from `admin_recurring_lessons`) |

**Manual step (parked until Phase 3):** Scheduling requests arrive via Zalo/email. Log each as a row in `admin/src/app/schedule` (the booking table). For now, teacher availability is coordinated manually; Phase 3 will auto-rank options.

**Decision file:** `~/Documents/techtutor/ops/scheduling-decisions.md` (if/then for makeup requests, time-change requests, teacher-swap requests).

---

### 3. Payments & Reconciliation
**Source of truth:** Admin portal → Payments

| If | Then |
|---|---|
| Payment due this week (installment 2 of 2), not marked `paid` | Send reminder 3 days before due date |
| Payment overdue ≥7 days | Pause lessons; send "payment required to resume" message |
| Payment received (bank notification), not logged in `admin_payments` | Log it (amount_vnd, date, student_id, type: `full`/`installment_1`/`installment_2`) |
| Referral reward earned (new enrollment with `referral_code`), not logged in `referral_rewards` | Manually log reward (advocate's next invoice deducted by reward_vnd); automate later |

**Reconciliation (once per month):** Export VCB transactions → cross-check against `admin_payments` → flag discrepancies (missing logs, duplicate payments).

**Decision file:** `~/Documents/techtutor/ops/payment-decisions.md` (if/then for late-payment asks: "can I pay next week?", "my bank transfer is stuck", "can I get a discount?").

---

### 4. Content & Curriculum
**Source of truth:** Portal curriculum (`~/Documents/techtutor/portal/src/data/curriculum/`), BashVerse competition (`~/Documents/techtutor/portal/src/app/dashboard/bashverse/`)

| If | Then |
|---|---|
| New program starting this week, no lesson slides ready | Generate slides via `tt-content-pipeline` (topic → slides + homework BUILD) |
| BashVerse season live, no weekly leaderboard update | Update leaderboard (manual until auto-scoring ships; comp dashboard shows submissions) |
| Student completed program (24 lessons done), no certificate issued | Generate certificate via admin portal → Certificates |
| Student portfolio empty (0 projects), enrolled ≥4 weeks | Check in with teacher: "Is [child] building? If not, why?" |

**Decision file:** `~/Documents/techtutor/ops/content-decisions.md` (if/then for content requests: "can we skip ahead?", "this lesson is too easy", "my kid wants to build [X] instead").

---

### 5. Support & Parent Communication
**Source of truth:** Zalo messages, email (no ticketing system yet)

| If | Then |
|---|---|
| Parent message ≥24h old, not replied | Reply (or delegate to teacher if lesson-specific) |
| Parent asks about progress | Link to student's portfolio (`/p/[username]`) + last lesson summary |
| Parent asks "what's next after this program?" | Offer pathway: next program in track, or BashVerse competition |
| Parent refers a friend (sends contact) | Log referral manually in `referral_rewards`; send referred parent the trial link |

**Decision file:** `~/Documents/techtutor/ops/support-decisions.md` (if/then for common parent asks).

---

## The system behind the loop (what makes this runnable)

1. **Single admin portal** = all state lives in one place (students, lessons, payments, settings). No scattered sheets.
2. **If/then decision files** = every recurring question → pre-made answer. Runner reads the file, not their judgment.
3. **Cron-ready parts** (later):
   - Trial follow-ups → auto-message after 7 days
   - Payment reminders → auto-send 3 days before due
   - BashVerse leaderboard → auto-update from submissions table
   - Certificates → auto-issue on program completion
4. **Clear handoff points:**
   - Teacher handles: lesson delivery, makeup coordination, in-class troubleshooting
   - Admin handles: intake, payments, parent comms, content pipeline
   - Gleb handles: only the gates (pricing changes, new hires, partnership decisions)

---

## How to test this system

Run ONE real week with this playbook:
1. Print this file or open it in a second window.
2. On Monday morning, start at § 1 (Intake) and work through § 5 (Support) in order.
3. Every time you hit a case NOT covered by the if/then table → log it in the relevant decision file.
4. At the end of the week, count how many decisions you had to make vs how many were pre-solved.
5. Iterate: the decision files grow until the loop runs on autopilot.

**Success = you run the loop in <30 min, no Zalo interruptions, no "what should I do?" moments.**

---

## Next: decision files (if you want them pre-seeded)

I can generate the five decision files (`intake-decisions.md`, `scheduling-decisions.md`, `payment-decisions.md`, `content-decisions.md`, `support-decisions.md`) with starter if/then rules drawn from common TechTutor scenarios. Or you run one real week and populate them yourself from what comes up.

Your call.
