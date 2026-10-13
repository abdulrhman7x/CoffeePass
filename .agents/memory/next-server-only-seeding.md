---
name: Next server-only and seed scripts
description: Avoid breaking standalone TypeScript seed scripts with Next's server-only package.
---

Keep a shared Mongoose connection helper importable from both Next.js routes and standalone `tsx` scripts. Apply `import "server-only"` to App Router-only services that consume that helper, not to the shared helper itself.

**Why:** The `server-only` package's default Node entry intentionally throws outside React Server Components, so a plain seed script fails before it can connect to MongoDB.

**How to apply:** Put the marker in server-side product/auth modules; let scripts import the connection helper directly.
