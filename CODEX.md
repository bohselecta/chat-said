# CODEX.md

Build and refine ChatSaid Taurus as a complete system. Do not replace working zero-dependency paths with scaffolding or placeholders.

Before editing:

1. Read `AGENTS.md`.
2. Read `docs/PRODUCT-SPEC.md`.
3. Run `npm test`.
4. Inspect the complete request flow before changing a subsystem.

After editing:

1. Run `npm test`.
2. Run `npm run check`.
3. Run `npm run smoke`.
4. Verify project state survives process restart.
5. Confirm every user-visible control has a working server path.

The primary acceptance statement is:

> A person talks into a named project, each idea becomes one canonical revision, and the person later opens a usable artifact built from the resulting specification.
