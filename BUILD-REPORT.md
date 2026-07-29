# Build Report — ChatSaid / Taurus 0.1.0

Date: 2026-07-29

## Delivered organism

- Taurus Pocket responsive PWA
- Taurus Pocket Android source shell
- Taurus Forge local server
- Durable SQLite and Project filesystem
- Strict one-note-at-a-time queue
- Deterministic spec reconciliation
- Optional Docker Model Runner / llama.cpp compatible reconciliation
- Local whisper.cpp adapter and setup scripts
- Revision ledger
- Manual and quiet-period Make
- Artifact grammar and interactive renderer
- Library, Copy & Save, and ZIP export
- Local API, stdio MCP, HTTP MCP, agent handoff
- Wake-on-LAN relay and Android direct wake
- Optional Avahi/Bonjour service advertisement
- systemd deployment

## Verification executed

```text
npm test      PASS — 2 tests
npm run check PASS — required files + 16 JavaScript modules
npm run smoke PASS — Talk → queued Make → Plan revisions → Artifact
```

The E2E test additionally stops and restarts the server and confirms the project, revisions, artifact, clips, and token remain usable.

## Deliberate external payloads

The repository does not commit a Whisper model or platform binary. `scripts/setup-whisper.*` installs them on the target system. It also does not commit a local LLM; Docker Model Runner and direct `llama-server` are runtime choices configured in the UI.

See `docs/IMPLEMENTATION-STATUS.md` for exact validation boundaries.
