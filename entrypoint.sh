#!/bin/sh
set -e

# ──────────────────────────────────────────────────────────
# Wait for PostgreSQL to be reachable before doing anything.
# Railway / cloud PaaS may start the DB slightly after the app.
# ──────────────────────────────────────────────────────────
wait_for_db() {
  # If DATABASE_URL is set, parse host/port from it; otherwise use env vars.
  if [ -n "$DATABASE_URL" ]; then
    # e.g. postgresql://user:pass@host:5432/db
    DB_HOST_WAIT=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:/]+).*|\1|')
    DB_PORT_WAIT=$(echo "$DATABASE_URL" | sed -E 's|.*:([0-9]+)/.*|\1|')
  else
    DB_HOST_WAIT="${DB_HOST:-localhost}"
    DB_PORT_WAIT="${DB_PORT:-5432}"
  fi

  echo "⏳ Waiting for PostgreSQL at ${DB_HOST_WAIT}:${DB_PORT_WAIT}..."
  MAX_RETRIES=30
  RETRIES=0
  until nc -z "$DB_HOST_WAIT" "$DB_PORT_WAIT" 2>/dev/null; do
    RETRIES=$((RETRIES + 1))
    if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
      echo "❌ Could not reach PostgreSQL after ${MAX_RETRIES} attempts. Exiting."
      exit 1
    fi
    echo "   → not ready yet (attempt ${RETRIES}/${MAX_RETRIES}), retrying in 2s..."
    sleep 2
  done
  echo "✅ PostgreSQL is ready."
}

wait_for_db

echo "──────────────────────────────────────────"
echo "  🔨 Running database migrations..."
echo "──────────────────────────────────────────"
node -r dotenv/config ./node_modules/typeorm/cli.js migration:run \
  -d dist/config/data-source.js

# Seed the database only when SEED_ON_STARTUP=true is set.
if [ "$SEED_ON_STARTUP" = "true" ]; then
  echo "──────────────────────────────────────────"
  echo "  🌱 Running database seed (plans)..."
  echo "──────────────────────────────────────────"
  node -r dotenv/config dist/config/seeders/plan.seed.js
fi

echo "──────────────────────────────────────────"
echo "  🚀 Starting Vanish Vault API..."
echo "──────────────────────────────────────────"
exec node dist/server.js
