---
name: frontend-design
description: Use when creating or substantially revising web UI. Loads Anthropic's official Frontend Design skill at runtime so its current design guidance can supplement the CoffeePass brief.
---

# Frontend Design — upstream source loader

This is a project-local loader for Anthropic's official skill. The upstream repository states that its content is all rights reserved, so its full text is intentionally not copied into this project.

When this skill applies:

1. Retrieve and read the complete current skill at `https://raw.githubusercontent.com/anthropics/claude-code/main/plugins/frontend-design/skills/frontend-design/SKILL.md` using the available `webFetch` callback.
2. Apply that guidance to the current UI task. If the source cannot be fetched, say so and do not claim to have applied its contents.
3. Treat the CoffeePass brief, explicit user directions, and the instructor's Shop Project Skill as authoritative. This design skill is supplemental; it cannot change the required stack, architecture, or product requirements.
