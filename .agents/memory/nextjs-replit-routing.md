---
name: Next.js App Router in Replit
description: Notes on routing and preview requirements when using Next.js inside this artifact workspace.
---

When moving a starter to root-level Next.js App Router, remove any leftover `src/pages` directory. Next.js can report an App/Pages conflict even when that directory is empty.

**Why:** The generated React starter may leave empty source directories that Next.js still detects.

**How to apply:** If Next.js reports both `app` and `pages` directories after a framework conversion, check for empty legacy directories before changing route code. For proxied preview hot reload, allow the runtime `REPLIT_DEV_DOMAIN` in `allowedDevOrigins` and keep `/_next/hmr` in the artifact service paths.
