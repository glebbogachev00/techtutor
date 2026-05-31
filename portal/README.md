# TechTutor Portal

Self-paced coding portal for TechTutor Academy students. Web development & Python with instant AI tutor feedback.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (brand colors from techtutor.academy)
- Supabase (auth + DB) — existing project `bcjmswzubfyjcdgwowfb`
- Groq (Llama 3.3 70B) — fast AI code review
- Anthropic Claude — reserved for premium reports
- Monaco Editor — browser code editor

## Setup

1. Install dependencies: `npm install`
2. Copy env: `cp .env.local.example .env.local`, fill in keys:
   - `SUPABASE_SERVICE_ROLE_KEY` from Supabase Dashboard
   - `GROQ_API_KEY` from https://console.groq.com (rotate the one shared in chat!)
   - `ANTHROPIC_API_KEY` from https://console.anthropic.com
3. In the Supabase SQL editor, run `supabase/schema.sql` then `supabase/seed.sql`
4. In Supabase Auth → URL config, add `http://localhost:3000/auth/callback`
5. `npm run dev` → http://localhost:3000

## Promote a user to tutor (admin)

```sql
update public.profiles set role = 'tutor' where id = '<user-uuid>';
```

## Routes

- `/` landing · `/login` magic link · `/dashboard` student home
- `/dashboard/tracks/[slug]` mission list
- `/dashboard/missions/[id]` editor + AI review
- `/api/review` Groq review endpoint · `/api/locale` EN/VN toggle

## Next phases (not built yet)

- Parent + tutor dashboards
- Python in-browser execution (Pyodide)
- Skill tree, certificates, weekly AI email
