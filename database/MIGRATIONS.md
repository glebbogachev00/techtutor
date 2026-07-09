# TechTutor — Database & Backups

The **portal** and **admin** apps share **one** Supabase Postgres project. This
folder is the safety net for it (the free tier has **no** automated backups).

## ⚠️ Read this first
- The per-feature SQL files below **do not** capture the whole database — several
  tables (`profiles`, `tb_reports`, `tb_certificates`, `tb_portfolio_items`, …)
  and RPCs were created directly in the Supabase SQL editor.
- The **complete** structure lives in **`schema.sql`** — generate it with
  `./dump-schema.sh`.
- Migration files alone will **not** rebuild the DB, and they contain **no data**.
  Only `backup.sh` protects your data.

## One-time setup
1. Install Postgres client tools: `brew install postgresql@16`
   (gives you `pg_dump` + `psql`; no Docker needed).
2. Supabase → **Project Settings → Database → Connection string → URI**
   (the direct `:5432` one). Copy `database/.env.example` to `database/.env`
   and paste it in. `.env` is git-ignored.

## Backing up (do this regularly)
```bash
cd database
./backup.sh          # full schema + data → backups/techtutor-<timestamp>.sql.gz
./dump-schema.sh     # schema only → schema.sql (commit this)
```
A weekly `./backup.sh` is enough for a project this size. Keep a copy somewhere
off your laptop too (cloud drive), so a dead laptop ≠ lost backup.

## Restoring (if Supabase is lost)
```bash
# into a fresh local Postgres, or a new Supabase project:
./restore.sh backups/techtutor-<timestamp>.sql.gz "postgresql://.../target"
```

---

## Migration log
Newest at the bottom. When you add a migration, append it here **and** run it in
Supabase.

### Portal — `portal/supabase/migrations/`
| File | What it adds |
|------|--------------|
| `2026-06-05_class_sessions.sql` | Class sessions |
| `2026-06-16_schedule_bookings.sql` | Schedule bookings |
| `2026-06-17_lesson_progress.sql` | Lesson progress |
| `2026-07-03_bashverse_registrations.sql` | BashVerse registrations |
| `2026-07-03_bashverse_submissions.sql` | BashVerse submissions |
| `2026-07-06_bashverse_progress.sql` | BashVerse progress |
| `2026-07-07_homework.sql` | `tb_homework` (per-student homework) |
| `2026-07-07_translations_cache.sql` | `tb_translations` (Azure MT cache) |

### Admin — `admin/sql/`
| File | What it adds |
|------|--------------|
| `001_admin_schema.sql` | Core admin schema |
| `002_expenses.sql` | Expenses |
| `003_invoice_student.sql` | Invoice ↔ student |
| `004_updates.sql` | `admin_updates` |
| `005_resources.sql` | `admin_resources` (Tutorials & Resources) |

> Not captured as migration files (live in Supabase directly): `profiles`,
> `tb_reports`, `tb_certificates`, `tb_portfolio_items`, `classes`,
> `class_members`, and the RPCs (`tb_issue_report`, `tb_issue_course_certificate`,
> `tb_set_student_name`, `create_class`, …). `schema.sql` captures these.
