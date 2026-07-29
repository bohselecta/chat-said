# Artifact Grammar

Taurus chooses artifacts by intended behavior, not by file extension.

## Intent signals

- “write,” “explain,” “document” → document
- “plan,” “schedule,” “what next” → plan
- “keep this together” → workspace
- “keep track” → tracker
- “compare,” “choose,” “calculate” → decision tool
- “design,” “arrange,” “make” → creator
- “show how it works” → simulation
- “show people,” “publish” → presentation/publication
- “teach,” “practice,” “test” → learning
- “whenever this happens” → automation

## Primitive vocabulary

- text
- tables
- collections
- forms
- timelines
- calendars
- boards
- cards
- charts
- diagrams
- canvases
- calculators
- media
- search
- filters
- actions
- workflow states
- exports
- agent handoffs

## Minimum usable artifact contract

Every artifact must:

1. open with real Project content populated;
2. expose an obvious primary action;
3. be interactive or editable where appropriate;
4. persist user changes;
5. identify the canonical spec revision used;
6. preserve source history;
7. rebuild safely after later notes;
8. support a useful handoff or export;
9. never call an empty template a finished artifact.
