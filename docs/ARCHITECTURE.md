# Architecture

## Runtime

The reference build uses Node.js standard-library modules only:

- `node:http` — local web server
- `node:sqlite` — durable database
- `node:fs` — ordinary Project folders
- `node:dgram` — Wake-on-LAN
- browser MediaRecorder and optional SpeechRecognition — capture
- optional external `whisper.cpp` CLI — local ASR
- optional OpenAI-compatible endpoint — local LLM

There is no npm dependency installation and no container requirement.

## Data authority

SQLite owns indexes, states, relationships, and audit records. Ordinary files own portability and agent legibility.

SQLite is never the only copy of the canonical Project specification.

## Processing lane

`queue.mjs` owns the serial worker. The process uses a single in-memory execution lock plus durable note states. A future multi-process implementation must replace the in-memory lock with an atomic database lease without changing the serial invariant.

## Atomic filesystem writes

Canonical JSON and Markdown are written to temporary files and renamed into place. Immutable revision snapshots are written after each successful reconciliation.

## Failure behavior

- Server crash before note receipt: client does not receive success.
- Crash after note receipt but before processing: note remains queued.
- LLM failure: deterministic reconciliation runs.
- Artifact LLM failure: deterministic artifact manifest runs.
- Audio with no transcript and no Whisper command: note remains `awaiting_transcript`.
- Failed note: later notes remain queued so the inconsistency cannot be silently skipped.
- Browser clipboard failure: the clip is already saved.

## API surface

Core routes:

```text
GET  /api/status
POST /api/pair
GET  /api/bootstrap
GET  /api/projects
POST /api/projects
GET  /api/projects/:id
PATCH /api/projects/:id
GET  /api/projects/:id/notes
POST /api/projects/:id/notes
GET  /api/projects/:id/queue
GET  /api/projects/:id/spec
PUT  /api/projects/:id/spec
GET  /api/projects/:id/revisions
POST /api/projects/:id/build
GET  /api/projects/:id/artifacts
GET  /api/projects/:id/artifact-state
PUT  /api/projects/:id/artifact-state
GET  /api/projects/:id/clips
POST /api/projects/:id/clips
GET  /api/projects/:id/export
GET  /api/projects/:id/agent-handoff
GET  /api/settings/runtime
PUT  /api/settings/runtime
POST /api/wake
POST /mcp
```

## Authentication

A six-digit pairing code is generated on first boot and displayed only in the Forge terminal. Successful pairing issues a 256-bit random client token, stored by the browser and also set as a same-origin cookie.

This is a LAN appliance pairing model, not an internet-facing identity system.

## Filesystem layout

See `README.md`. Project slugs are sanitized and cannot traverse directories. Search tools skip recordings and large/binary files.
