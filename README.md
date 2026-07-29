# ChatSaid / Taurus

**Talk → Plan → Make, on hardware you own.**

ChatSaid Taurus is a complete local-first project system that turns private spoken notes into a sequentially reconciled canonical specification and then materializes that specification as an interactive artifact.

The repository contains:

- **Taurus Pocket** — responsive installable web capture UI plus an Android WebView shell for reliable LAN microphone access.
- **Taurus Forge** — the capable-device server, durable serial note queue, local transcription adapter, canonical-spec reconciler, revision ledger, artifact builder, Wake-on-LAN relay, API, and MCP server.
- **Taurus Desk** — the full ChatSaid browser workspace for Talk, Plan, Make, Library, and agent connections.
- **Taurus Make** — a constrained artifact-grammar renderer that always produces an immediately usable project workspace, plan, tracker, wireframe, decision register, and share surface. A configured local LLM can improve the manifest without replacing the deterministic fallback.

## Run it

Requirements: **Node.js 22.5 or newer**. There are no npm dependencies and no install step.

### Windows

Double-click `START-TAURUS.cmd`, or run:

```powershell
.\scripts\start.ps1
```

### Linux or macOS

Double-click `START-TAURUS.command` on macOS, or run:

```bash
./scripts/start.sh
```

Open one of the displayed URLs. Enter the six-digit pairing code printed in the terminal.

The default URL is:

```text
http://localhost:7847
```

Other computers and phones on the LAN use the IP address printed at startup, for example:

```text
http://192.168.1.50:7847
```

## The complete loop

1. Create or open a Project.
2. Record, dictate, type, or paste one note.
3. Edit the note and send it.
4. Taurus places it in a durable queue.
5. Forge applies exactly one queued note to the canonical specification.
6. Forge aligns the complete spec and writes a new immutable revision.
7. The next queued note is processed only after the previous transaction finishes.
8. Press **Make now**, or wait until the queue has been quiet for the project’s configured interval.
9. Taurus builds a persistent interactive artifact from the latest canonical revision.
10. Codex, Cursor, or another authorized tool can read the project folder, local API, or MCP tools.

## Local transcription

The browser can optionally provide immediate live speech recognition when supported. This mode is visibly labeled because browser implementations may use platform services.

For private local transcription, install `whisper.cpp` with the included setup script:

```bash
./scripts/setup-whisper.sh base.en
```

or on Windows:

```powershell
.\scripts\setup-whisper.ps1 base.en
```

Audio-only notes remain safely queued as `awaiting_transcript` until the local transcription command is available.

## Local LLM

Taurus works without an LLM using its deterministic sequential reconciler. To improve reconciliation and artifact shaping, open **Connect → Local intelligence engines** and enter any OpenAI-compatible chat-completions endpoint.

Docker Model Runner example:

```text
URL:   http://localhost:12434/engines/v1/chat/completions
Model: ai/qwen2.5-coder
```

Direct `llama-server` example:

```text
URL:   http://localhost:8080/v1/chat/completions
Model: local-model
```

If the endpoint fails or returns invalid output, Taurus applies the note with the deterministic engine and records that fallback in the revision summary.

## Android Pocket app

Open `apps/pocket-android` in Android Studio and build/install it. On first launch, enter the LAN URL printed by Taurus Forge. Use **Find Taurus** for mDNS discovery or enter the displayed LAN URL. Long-press the app at any time to change nodes. The Android shell can also send Wake-on-LAN directly from the phone when Forge is sleeping.

The Android shell exists because ordinary LAN HTTP pages do not consistently receive browser microphone privileges. The native shell explicitly grants microphone capture to the paired local WebView while retaining the same ChatSaid interface and server.

## Project folders

Every project remains ordinary readable files:

```text
data/projects/<project-slug>/
├── TAURUS.md
├── spec.json
├── project.json
├── AGENTS.md
├── recordings/
├── transcripts/
├── clips/
├── notes/
├── revisions/
├── artifacts/
└── agent-output/
```

Original source material is not silently rewritten. Each applied note creates a revision under `revisions/`.

## Cursor and MCP

The repository includes `.cursor/mcp.json`. Cursor can run the zero-dependency stdio MCP server directly:

```text
node apps/forge/mcp-stdio.mjs
```

Available tools:

- `list_projects`
- `get_project`
- `get_spec`
- `list_recent_notes`
- `search_project`
- `save_agent_output` — disabled unless `TAURUS_AGENT_WRITE=1`

Forge also exposes an authenticated HTTP MCP endpoint at `/mcp` and project-specific handoff instructions in the Connect screen.

## Verification

```bash
npm test
npm run check
npm run smoke
```

The E2E test creates a clean node, pairs a client, creates a project, enqueues two notes, verifies strict sequential revisions, builds an interactive artifact, saves a clip, reads the spec through MCP, exports a ZIP, restarts Forge, and confirms the complete state survived.

See `docs/IMPLEMENTATION-STATUS.md` for exact validation boundaries.
