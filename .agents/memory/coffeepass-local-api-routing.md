---
name: CoffeePass local API checks
description: How to avoid testing CoffeePass Next.js routes through the wrong service in this multi-artifact workspace.
---

For local API checks in this workspace, target the CoffeePass web workflow directly rather than assuming the workspace development domain root reaches Next.js. The root may route to the separate Express API artifact and return its generic 404.

**Why:** The workspace contains both CoffeePass and an independent Express API artifact, and the shared development domain can route to the API service instead of the web app.

**How to apply:** When requests to the shared domain return Express-style `Cannot POST` responses, use the CoffeePass web workflow's allocated local port for route tests; do not change the Next.js route based on that proxy response.
