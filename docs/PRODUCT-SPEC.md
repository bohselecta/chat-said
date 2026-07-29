# ChatSaid / Taurus — Canonical Product Specification

Version: 0.1.0  
Status: Implemented reference build

## Product definition

ChatSaid Taurus is a private, local-first speech-to-project system. It allows a person to talk naturally into persistent Projects, processes each incoming note as an atomic design transaction, maintains one aligned canonical specification, and builds a usable screen-based artifact after the project becomes quiet or the user explicitly presses Make.

The system recreates **chat → plan → make** as visible deterministic phases rather than an opaque swarm of agents.

## Product family

### Taurus Pocket

A handheld capture surface for phones and tablets.

Responsibilities:

- Pair with a Taurus Forge node.
- Select or create a Project.
- Record speech.
- Optionally show a live browser transcript.
- Allow editing before submission.
- Upload audio and/or text to the Project queue.
- Show durable receipt and processing status.
- Browse clips and artifacts.

Implementations in this repository:

- Responsive installable PWA served by Forge.
- Native Android WebView shell that grants microphone access on a LAN HTTP origin.

### Taurus Forge

A capable PC, laptop, or home node that owns project state.

Responsibilities:

- Accept notes continuously from paired devices.
- Persist audio and note records before processing.
- Maintain one global serial processing lane.
- Reconcile one note into one Project spec at a time.
- Save every resulting revision to SQLite and ordinary files.
- Keep model use optional and replaceable.
- Wait for quiescence or accept manual Make.
- Build and serve artifacts.
- Export Project archives.
- Expose read-only paths, APIs, and MCP tools to authorized agents.
- Relay Wake-on-LAN packets to capable devices.

### Taurus Desk

The full browser workspace on a capable screen.

Five modes:

1. **Talk** — capture, edit, submit, and inspect the live queue.
2. **Plan** — read/edit `TAURUS.md` and inspect the immutable revision ledger.
3. **Make** — trigger and use the current interactive artifact.
4. **Library** — retrieve notes and exact Copy & Save clips.
5. **Connect** — copy filesystem/API/MCP handoffs and configure local engines.

### Taurus Make

The artifact materialization phase.

It reads the latest canonical spec only after all earlier queued notes are applied. It never uses an unprocessed batch of conversation as its source of truth.

## Central doctrine

> Steps, not agents. One idea, one reconciliation, one new canonical state. Then build only from that state.

## Project model

Projects are persistent workspaces that can receive speech across days, devices, and sessions.

Each Project owns:

- name and description;
- recordings;
- source transcripts;
- queue items;
- canonical machine spec;
- canonical human-readable spec;
- immutable revisions;
- edited clips;
- built artifacts;
- interactive artifact state;
- agent outputs;
- audit events.

Every Project has a stable filesystem location and stable identifiers.

## Talk phase

### Capture

The user may submit:

- audio plus an edited browser transcript;
- audio alone for local Whisper processing;
- typed text;
- pasted text;
- text supplied by another local client or API.

### Receipt

The server allocates a Project-local increasing sequence number and stores the queue item before acknowledging it.

A note has one of these states:

- `awaiting_transcript`
- `queued`
- `processing`
- `applied`
- `failed`

### Copy & Save

Copy & Save creates a durable Project clip before attempting the clipboard operation. A clipboard failure therefore cannot lose the selected text.

## Plan phase

### Serial processing

Forge selects the oldest queued note. No later note may be reconciled until that transaction completes or fails.

For each note:

1. Load the latest canonical spec.
2. Mark the note processing.
3. Reconcile only that note.
4. Preserve all compatible prior decisions.
5. Surface contradictions under constraints or open questions.
6. Append the exact note to the source-note ledger.
7. Normalize the complete spec.
8. Write `spec.json` and `TAURUS.md` atomically.
9. Write an immutable revision snapshot.
10. Mark the note applied.
11. Continue to the next note.

### Reconciliation engines

#### Deterministic engine

Always available. It classifies speech fragments into canonical sections, preserves source text, deduplicates exact concepts, and produces a coherent machine-readable spec.

#### Local LLM engine

Optional. It calls an explicitly configured OpenAI-compatible endpoint. The endpoint can be Docker Model Runner, direct `llama-server`, or another local service.

The LLM must return the full updated structured spec. If the call fails, times out, returns malformed data, or violates schema expectations, the deterministic engine applies the note and the revision records the fallback.

### Canonical sections

- Vision
- Users
- Principles
- Capabilities
- Workflows
- Interfaces
- Data & Memory
- Integrations
- Privacy & Trust
- Constraints
- Open Questions
- Source Note Ledger

## Make phase

Make starts when either condition is true:

- the user presses Make now; or
- the Project queue is empty and the Project has been quiet for its configured interval, default 15 minutes.

Make does not begin if a note is queued, awaiting transcription, or processing.

### Artifact grammar

Applications are containers, not the governing categories. Taurus infers what the person expects to do at the screen.

Artifact families:

- Document
- Plan or runbook
- Workspace
- Tracker or dashboard
- Decision tool
- Creator or editor
- Simulation or interactive prototype
- Presentation or publication
- Learning or practice experience
- Automation or workflow

A Project may produce a coordinated artifact bundle.

### Implemented artifact contract

The reference renderer creates a safe interactive project surface containing:

- Overview populated from the Project vision and capabilities.
- Plan with persistent checkable work.
- Tracker populated from capabilities, workflows, and constraints.
- Navigable wireframe generated from interface requirements.
- Decision register generated from constraints and open questions.
- Share surface containing a public-safe Project summary.

Interactive state is stored both in the browser and on Forge.

A configured local LLM may improve the constrained artifact manifest. It does not directly emit executable server code.

## Agent bridge

Every Project includes:

- `TAURUS.md`
- `spec.json`
- `project.json`
- `AGENTS.md`
- `agent-output/`

The Connect screen supplies:

- local Project folder;
- canonical spec path;
- authenticated Project API URL;
- MCP URL;
- a ready-to-copy Codex/Cursor instruction.

MCP tools are read-only by default. `save_agent_output` is enabled only when `TAURUS_AGENT_WRITE=1` and is confined to `agent-output/`.

## Privacy model

Defaults:

- local accountless operation;
- audio stored on user-owned hardware;
- deterministic processing when no model is configured;
- no automatic cloud transfer;
- no transcript content in discovery metadata;
- paired-client tokens required for APIs and artifacts;
- original material preserved;
- explicit model configuration;
- explicit agent write elevation;
- visible audit events.

Browser live speech recognition is opt-in and visibly discloses that the browser vendor may provide the speech service.

## Distribution model

One downloadable repository runs the capable-device system and serves the PWA. The Android client is included as a separate buildable app source.

Deployment targets:

- Windows PC or laptop
- Linux desktop or server
- old Linux laptop appliance under systemd
- macOS development/desktop node
- Android phone or tablet capture client
- any modern browser for Desk access

## Definition of done

A release is valid only when the following complete loop passes:

1. Fresh node starts without dependency installation.
2. Client pairs.
3. Project is created.
4. Two notes are submitted in order.
5. Note 1 creates revision 1.
6. Note 2 creates revision 2.
7. The final canonical spec contains both ideas in source order.
8. Make creates an interactive artifact from revision 2.
9. A clip is saved.
10. MCP reads the canonical spec.
11. Project exports as ZIP.
12. Server stops and restarts.
13. Project, revisions, artifact, and clips remain intact.
