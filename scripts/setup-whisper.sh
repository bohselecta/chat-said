#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR="$ROOT/.local/whisper.cpp"
MODEL_NAME="${1:-base.en}"
for cmd in git cmake; do command -v "$cmd" >/dev/null || { echo "$cmd is required" >&2; exit 1; }; done
mkdir -p "$ROOT/.local"
if [ ! -d "$VENDOR/.git" ]; then git clone --depth 1 https://github.com/ggml-org/whisper.cpp "$VENDOR"; else git -C "$VENDOR" pull --ff-only; fi
cmake -S "$VENDOR" -B "$VENDOR/build" -DCMAKE_BUILD_TYPE=Release
cmake --build "$VENDOR/build" --config Release -j "$(getconf _NPROCESSORS_ONLN 2>/dev/null || echo 2)"
bash "$VENDOR/models/download-ggml-model.sh" "$MODEL_NAME"
BIN="$VENDOR/build/bin/whisper-cli"
[ -x "$BIN" ] || BIN="$VENDOR/build/bin/main"
MODEL="$VENDOR/models/ggml-${MODEL_NAME}.bin"
printf "export TAURUS_WHISPER_COMMAND='%s -m %s -f {input} -otxt -of {output}'\n" "$BIN" "$MODEL" > "$ROOT/.taurus-whisper.env"
echo "Local whisper.cpp configured. Start with ./scripts/start.sh"
