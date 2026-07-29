# Verification trigger

The ChatSaid/Taurus repository is public and ready for its full GitHub Actions materialization run.

This branch exists only to trigger the build gate. The workflow unpacks the complete source, installs the corrected build contract, verifies the full Talk → Plan → Make loop, compiles Taurus Pocket for Android, uploads the debug APK, and writes the verified source tree to `main` only after every gate passes.
