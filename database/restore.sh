#!/usr/bin/env bash
# Restore a backup into a TARGET database — e.g. a fresh local Postgres, or a
# brand-new Supabase project if the old one is lost.
# Usage: ./restore.sh backups/techtutor-YYYYMMDD-HHMMSS.sql.gz "postgresql://.../target"
set -euo pipefail

DUMP="${1:?Usage: ./restore.sh <dump.sql.gz> <target-database-url>}"
TARGET="${2:?Usage: ./restore.sh <dump.sql.gz> <target-database-url>}"

command -v psql >/dev/null || {
  echo "psql not found. Install it:  brew install postgresql@16" >&2
  exit 1
}

echo "Restoring $DUMP → $TARGET"
gunzip -c "$DUMP" | psql "$TARGET"
echo "Done."
