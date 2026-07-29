#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 22.5 or newer is required." >&2
  exit 1
fi
MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
if [ "$MAJOR" -lt 22 ]; then
  echo "Node.js 22.5 or newer is required; found $(node --version)." >&2
  exit 1
fi
if [ -f "$ROOT/.taurus-whisper.env" ]; then
  # shellcheck disable=SC1091
  source "$ROOT/.taurus-whisper.env"
fi
exec node "$ROOT/apps/forge/server.mjs"
