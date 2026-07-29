# Security and Privacy

## Intended boundary

This build is designed for a trusted home/studio LAN. It is not configured for direct exposure to the public internet.

## Implemented controls

- Client pairing code and random persistent tokens
- Same-origin API and artifact access
- No cloud service requirement
- Original audio not returned by agent search tools
- Agent write disabled by default
- Agent writes confined to `agent-output/`
- Path sanitization
- Request-size limits
- SQLite foreign keys and WAL
- Atomic canonical-file writes
- Audit events for project, queue, revision, artifact, pairing, engine, export, wake, and agent actions

## Production hardening work

Before internet exposure or regulated clinical deployment:

- terminate TLS with a trusted certificate;
- add device-token revocation UI and rotation;
- encrypt sensitive data at rest;
- protect backups;
- add automatic locking and OS account separation;
- formalize retention/deletion policy;
- conduct threat modeling and external review;
- add consent and recording-law workflows;
- validate all applicable healthcare and professional obligations.

Local processing reduces data exposure; it does not automatically create regulatory compliance.
