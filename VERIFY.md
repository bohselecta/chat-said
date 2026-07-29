# ChatSaid Taurus verification

This branch exists only to trigger the complete public CI gate against the exact source tree published to `main`.

The required gates are:

- `npm run verify` for the full Talk → Plan → Make loop, restart recovery, MCP, export, and Wake-on-LAN;
- Android API 36 debug compilation for Taurus Pocket;
- debug APK artifact upload.
