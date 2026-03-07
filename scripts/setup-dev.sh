#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/env.sh"

cd "$ROOT_DIR"

docker compose up -d

if [[ ! -d "$ROOT_DIR/backend/node_modules" ]]; then
  echo "Installing backend dependencies..."
  npm ci --prefix "$ROOT_DIR/backend"
fi

if [[ ! -d "$ROOT_DIR/storefront/node_modules" ]]; then
  echo "Installing storefront dependencies..."
  npm ci --prefix "$ROOT_DIR/storefront"
fi

bash "$ROOT_DIR/scripts/backend-migrate.sh"
bash "$ROOT_DIR/scripts/backend-bootstrap-tenant.sh"

PRODUCT_COUNT="$(docker compose exec -T postgres psql -U medusa -d medusa_b2c -tAc "select count(*) from product;" | tr -d '[:space:]')"

if [[ "$PRODUCT_COUNT" == "0" ]]; then
  bash "$ROOT_DIR/scripts/backend-seed.sh"
fi

cat <<EOF

Development setup is ready.
- Storefront: http://localhost:8000
- Medusa backend: http://localhost:9000
- Medusa admin: http://localhost:9000/app

Start both apps with:
  npm run dev
EOF
