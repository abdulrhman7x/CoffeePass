---
name: Next.js build workflow
description: Prevent concurrent development and production compilation from corrupting or panicking over shared Next.js output.
---

Stop the CoffeePass development workflow before running a production build, then restart the managed artifact workflow after the build check.

**Why:** Running Turbopack development compilation and `next build` concurrently against the same `.next` output caused an internal Turbopack task panic. The build passed after stopping the dev workflow.

**How to apply:** Before a production build, stop only `artifacts/coffeepass: web`; run the build; then restart the same workflow and verify its logs and preview.
