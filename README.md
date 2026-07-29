# Tong Buku

**Private Talk → Plan → Make on hardware you own.**

Tong Buku turns private spoken notes into a sequentially reconciled canonical specification and then materializes that specification as an interactive artifact. The public product is Tong Buku; `Taurus` remains an internal architecture and protocol name where changing it would break compatibility.

## Product surfaces

- **Tong Buku Pocket** — responsive installable capture UI plus an Android shell for reliable LAN microphone access.
- **Tong Buku Forge** — capable-device server, durable serial note queue, local transcription adapter, canonical-spec reconciler, revision ledger, artifact builder, Wake-on-LAN relay, API, and MCP server.
- **Tong Buku Desk** — the browser workspace for Talk, Plan, Make, Library, and agent connections.
- **Tong Buku Make** — artifact-grammar renderer that produces an immediately usable project surface from the latest canonical revision.
- **Tong Buku Bridge** — ordinary project folders, local APIs, and MCP access for authorized Codex, Cursor, and other tools.

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

Open one of the displayed URLs and enter the six-digit pairing code printed in the terminal.

```text
http://localhost:7847
```

Other devices on the LAN use the IP address printed at startup, for example:

```text
http://192.168.1.50:7847
```

## The complete loop

1. Create or open a Project.
2. Record, dictate, type, or paste one note.
3. Edit the note and send it.
4. Forge writes it durably to the queue.
5. Forge applies exactly one queued note to the canonical specification.
6. Forge aligns the complete spec and writes a new immutable revision.
7. The next note is processed only after the previous transaction finishes.
8. Press **Make now**, or wait until the queue has been quiet for the configured interval.
9. Make builds a persistent interactive artifact from the latest canonical revision.
10. Authorized tools can read the project folder, local API, or MCP tools.

## Local transcription

The browser can optionally provide immediate live speech recognition when supported. This mode is visibly labeled because browser implementations may use platform services.

For private local transcription, install `whisper.cpp` with the included setup script:

```bash
./scripts/setup-whisper.sh base.en
```

Windows:

```powershell
.\scripts\setup-whisper.ps1 base.en
```

Audio-only notes remain safely queued as `awaiting_transcript` until the local transcription command is available.

## Local LLM

Tong Buku works without an LLM using its deterministic sequential reconciler. To improve reconciliation and artifact shaping, open **Connect → Local intelligence engines** and enter any OpenAI-compatible chat-completions endpoint.

Docker Model Runner:

```text
URL:   http://localhost:12434/engines/v1/chat/completions
Model: ai/qwen2.5-coder
```

Direct `llama-server`:

```text
URL:   http://localhost:8080/v1/chat/completions
Model: local-model
```

If the endpoint fails or returns invalid output, Forge applies the note with the deterministic engine and records the fallback in the revision summary.

## Android Pocket app

Open `apps/pocket-android` in Android Studio and build/install it. On first launch, enter the LAN URL printed by Tong Buku Forge. Use **Find Tong Buku** for mDNS discovery or enter the displayed LAN URL. Long-press the app to change nodes. The Android shell can also send Wake-on-LAN directly from the phone.

The native shell exists because ordinary LAN HTTP pages do not consistently receive browser microphone privileges. It explicitly grants microphone capture to the paired local WebView while retaining the same Tong Buku interface and server.

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

## Brand assets

The final scalable identity lives in:

- `apps/forge/public/icons/tong-buku-mark.svg`
- `apps/forge/public/icons/tong-buku-lockup.svg`
- `apps/forge/public/icons/tong-buku-mono.svg`
- `apps/forge/public/icons/icon.svg`
- `apps/forge/public/brand.css`
- `docs/BRAND-TONG-BUKU.md`

## Verification

```bash
npm run verify
```

The E2E suite creates a clean node, pairs a client, creates a project, enqueues two notes, verifies strict sequential revisions, builds an interactive artifact, saves a clip, reads the spec through MCP, exports a ZIP, restarts Forge, and confirms the complete state survived.

See `docs/IMPLEMENTATION-STATUS.md` for exact validation boundaries.
