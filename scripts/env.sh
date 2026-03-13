#!/usr/bin/env bash
set -euo pipefail

SCRIPT_SOURCE="${BASH_SOURCE:-$0}"
ROOT_DIR="$(cd "$(dirname "$SCRIPT_SOURCE")/.." && pwd)"

if command -v node >/dev/null 2>&1; then
  DEFAULT_NODE_BIN="$(dirname "$(command -v node)")"
else
  DEFAULT_NODE_BIN="/opt/homebrew/opt/node@22/bin"
fi

NODE_BIN="${NODE_BIN:-$DEFAULT_NODE_BIN}"

if [[ ! -x "$NODE_BIN/node" ]]; then
  echo "Node 22 was not found at $NODE_BIN."
  echo "Set NODE_BIN to the directory containing node and npm, then rerun."
  exit 1
fi

mkdir -p "$ROOT_DIR/.local-config"

export PATH="$NODE_BIN:$PATH"
export XDG_CONFIG_HOME="${XDG_CONFIG_HOME:-$ROOT_DIR/.local-config}"
export ROOT_DIR
