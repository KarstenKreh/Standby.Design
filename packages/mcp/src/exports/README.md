# MCP-local CSS emitter

This file (`css-emitter.ts`) exists deliberately as a **third** CSS emitter alongside:

- `color-react/src/lib/code-export.ts` — the full-featured emitter for the Color web app
- `system-react/src/lib/color-code-export.ts` — a close-but-drifted copy for the System viewer

**Why we didn't unify all three in v0:**

The web-app emitters include pinned/inverted brand logic, accent-palette scopes, contrast warnings, and sidebar-specific tokens — all of which exist because humans tweak these values interactively. LLMs consuming this MCP don't need any of that: they send structured params and want a clean, shadcn-compatible stylesheet back.

This file implements only what the 3 MCP tools require:

- Primitive palettes (brand, surface, error, error-surface, neutral) — OKLCH + zone comments
- Semantic tokens mapped to shadcn/ui variable names (`:root` + `.dark`)
- Type scale (`--text-*`, `--leading-*`, `--tracking-*`)
- Spacing tokens (`--space-*`)

**What's intentionally out of scope:**

- Pinned brand / pinned error (adds 40+ lines, rare for LLM inputs)
- Brand/error invert for dark mode (niche)
- Accent palettes (Success/Warning/Info — deferrable behind a future `includeAccents` flag)
- Contrast-ratio warnings embedded as CSS comments
- Sidebar-specific tokens (`--sidebar-*`)
- Border-radius / shadow / ring tokens (belong in `generate_design_system` later, not color)

**Unification plan:** post-v0.1, extract a single shared emitter into `@core/exports/css-emitter.ts` that exposes feature flags (`{ includeAccents, includeSidebar, pinnedBrand, ... }`). All three consumers (color-react, system-react, MCP) then pass their own flag set. Until that happens, keep this file's surface minimal and document any feature drift here.
