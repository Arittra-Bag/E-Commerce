#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/env.sh"

cleanup() {
  trap - INT TERM EXIT
  while read -r pid; do
    kill "$pid" 2>/dev/null || true
  done < <(jobs -pr)
}

trap cleanup INT TERM EXIT

bash "$ROOT_DIR/scripts/backend-dev.sh" &
BACKEND_PID=$!

bash "$ROOT_DIR/scripts/storefront-dev.sh" &
STOREFRONT_PID=$!

wait "$BACKEND_PID" "$STOREFRONT_PID"
