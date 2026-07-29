# AGENTS.md — ChatSaid / Taurus

## Mission

Maintain the complete Talk → Plan → Make organism. Do not reduce Taurus to a transcription box, a spec editor, or a generic app generator.

## Non-negotiable invariants

1. Incoming notes are durable before processing.
2. Notes are reconciled one at a time in queue order.
3. Each successfully applied note creates one canonical revision.
4. Artifact generation reads only the latest canonical spec, never a loose batch of chat messages.
5. Deterministic fallbacks remain functional when no model is configured.
6. Original audio, transcripts, notes, and revisions are never silently destroyed.
7. Project folders remain understandable to humans and coding agents.
8. Agent writes are read-only by default and go to `agent-output/` when enabled.
9. No feature is complete until the end-to-end tests pass after restart.

## Required checks

```bash
npm test
npm run check
npm run smoke
```

## Architecture boundaries

- `apps/forge/server.mjs` — HTTP product surface and lifecycle.
- `apps/forge/lib/queue.mjs` — only owner of sequential processing.
- `apps/forge/lib/reconciler.mjs` — deterministic and optional LLM reconciliation.
- `apps/forge/lib/projects.mjs` — canonical filesystem and revision writes.
- `apps/forge/lib/artifacts.mjs` — artifact grammar and rendering.
- `apps/forge/lib/mcp.mjs` — deliberate agent access.
- `apps/forge/public/` — responsive Taurus Pocket/Desk UI.
- `apps/pocket-android/` — native Android LAN/microphone shell.
