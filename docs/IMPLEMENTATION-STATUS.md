# Implementation and Validation Status

## Implemented

- ChatSaid/Taurus responsive product UI
- Project creation and persistence
- Browser audio capture and audio attachment code path
- Optional browser live speech recognition
- Durable serial queue
- Audio-awaiting-transcription state
- External local `whisper.cpp` command adapter
- Deterministic canonical-spec reconciler
- Optional OpenAI-compatible local LLM reconciler
- Full revision ledger and ordinary Project files
- Manual spec editing as a revision
- 15-minute configurable quiescence trigger
- Manual Make
- Artifact-family inference
- Interactive artifact rendering and persistent state
- Clip Copy & Save storage
- ZIP Project export
- Agent handoff paths and instructions
- Stdio MCP server
- Authenticated HTTP MCP endpoint
- Wake-on-LAN relay
- PWA metadata and cache
- Android WebView capture shell source with microphone permission, local-node discovery, origin confinement, and direct Wake-on-LAN
- Optional mDNS/DNS-SD service advertisement through Avahi or Bonjour tools
- systemd service definition

## Automated and passing

The Node E2E suite validates:

- clean startup;
- pairing;
- Project creation;
- two sequential note receipts;
- strict applied order;
- revisions 1 and 2;
- preservation of both notes in the canonical spec;
- artifact construction;
- artifact HTML serving;
- clip persistence;
- MCP spec read;
- ZIP export;
- full process restart and recovery;
- valid Wake-on-LAN magic packet.

## Validation boundaries

- Browser JavaScript files are syntax checked. The execution environment used to create this archive blocked localhost pages in its managed Chromium policy, so interactive browser clicks and MediaRecorder hardware access could not be automatically exercised there.
- The Android source is included, but an Android SDK was not available in the build environment, so an APK is not included and the Gradle build was not executed here.
- `whisper.cpp` binaries and models are intentionally not committed because they are platform-specific and large. Setup scripts install them on the target device. The queue behavior without a transcriber is tested through its durable state model; real acoustic accuracy depends on the selected model and hardware.
- A live Docker Model Runner or `llama-server` was not available during packaging. Failure-safe deterministic operation is fully tested; the OpenAI-compatible adapter is implemented and falls back safely.
