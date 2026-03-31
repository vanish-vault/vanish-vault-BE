#!/bin/sh
set -e

echo "──────────────────────────────────────────"
echo "  🔨 Running database migrations..."
echo "──────────────────────────────────────────"
node -r dotenv/config ./node_modules/typeorm/cli.js migration:run \
  -d dist/config/data-source.js

# Seed the database only when SEED_ON_STARTUP=true is set.
# Useful for first-time deployments (plans table, etc.).
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
