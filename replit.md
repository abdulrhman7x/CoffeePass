# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## CoffeePass specification precedence

- For the `artifacts/coffeepass` app, `attached_assets/skill_(1)_1791909116301.md` is the primary technical specification. Read it before CoffeePass implementation work.
- Skills under `.agents/skills/` provide supplemental design, accessibility-review, or React performance guidance. They do not override the instructor's specification or the user's explicit product requirements. If a conflict arises, follow the instructor's specification and ask the user before proceeding.
- The shared Express/PostgreSQL API scaffold described below is separate workspace infrastructure; do not use it as CoffeePass's backend or database. CoffeePass follows its primary specification for Next.js API routes and MongoDB Atlas.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
