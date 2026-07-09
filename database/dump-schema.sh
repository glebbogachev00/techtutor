#!/usr/bin/env bash
# Snapshot the FULL current schema (every table, RPC, policy, trigger) into
# schema.sql — the complete, committed source of truth. Needed because the
# per-feature migration files don't capture the whole database. Re-run and
# commit schema.sql after any schema change.
set -euo pipefail
cd "$(dirname "$0")"

if [ -f .env ]; then set -a; . ./.env; set +a; fi
: "${PGHOST:?Set PGHOST/PGUSER/PGPASSWORD in database/.env (see .env.example)}"
: "${PGPASSWORD:?Set PGPASSWORD in database/.env}"

command -v pg_dump >/dev/null || {
  echo "pg_dump not found. Install it:  brew install postgresql@16" >&2
  exit 1
}

echo "Dumping schema → schema.sql"
pg_dump --schema-only --no-owner --no-privileges > schema.sql
echo "Done. Commit schema.sql to version-control the full structure."
