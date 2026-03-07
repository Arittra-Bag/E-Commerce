#!/usr/bin/env bash
set -euo pipefail

SCRIPT_SOURCE="${BASH_SOURCE:-$0}"
ROOT_DIR="$(cd "$(dirname "$SCRIPT_SOURCE")/.." && pwd)"
NODE_BIN="${NODE_BIN:-/opt/homebrew/opt/node@22/bin}"

if [[ ! -x "$NODE_BIN/node" ]]; then
  echo "Node 22 was not found at $NODE_BIN."
  echo "Set NODE_BIN to the directory containing node and npm, then rerun."
  exit 1
fi

mkdir -p "$ROOT_DIR/.local-config"

export PATH="$NODE_BIN:$PATH"
export XDG_CONFIG_HOME="${XDG_CONFIG_HOME:-$ROOT_DIR/.local-config}"
export ROOT_DIR
