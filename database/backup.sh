#!/usr/bin/env bash
# Full backup (schema + ALL data) of the Supabase Postgres → a timestamped,
# gzipped file in database/backups/. This is the real safety net on the free
# tier (which has no automated backups). Run it regularly.
set -euo pipefail
cd "$(dirname "$0")"

if [ -f .env ]; then set -a; . ./.env; set +a; fi
: "${PGHOST:?Set PGHOST/PGUSER/PGPASSWORD in database/.env (see .env.example)}"
: "${PGPASSWORD:?Set PGPASSWORD in database/.env}"
export PGCONNECT_TIMEOUT="${PGCONNECT_TIMEOUT:-20}"  # never hang if the DB is unreachable

command -v pg_dump >/dev/null || {
  echo "pg_dump not found. Install it:  brew install postgresql@16" >&2
  exit 1
}

mkdir -p backups
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="backups/techtutor-$STAMP.sql.gz"

echo "Backing up full database (schema + data) → $OUT"
if pg_dump --no-owner --no-privileges | gzip > "$OUT.tmp"; then
  mv "$OUT.tmp" "$OUT"
  echo "Done — $(du -h "$OUT" | cut -f1)"
else
  rm -f "$OUT.tmp"
  echo "Backup failed — no file written." >&2
  exit 1
fi

# Keep only the 14 most recent backups.
ls -1t backups/techtutor-*.sql.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
