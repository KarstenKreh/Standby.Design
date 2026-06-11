# Anthropic Connector Directory — Submission Sheet

Prepared answers for submitting standby.design to the Claude connector
directory. Form: https://claude.com/docs/connectors/building/submission

## Listing

| Field | Value |
|-------|-------|
| Name | standby.design |
| Short description | Generate production-ready design systems: OKLCH color palettes, fluid type scales, spacing, shape and icon tokens — exportable as CSS, Tailwind v4, or W3C design tokens. |
| Remote MCP endpoint | `https://mcp.standby.design/mcp` (Streamable HTTP) |
| Authentication | None — all tools are pure, deterministic, and operate only on design parameters passed in the request. No user data is accessed. |
| Privacy policy | https://standby.design/privacy.html |
| Documentation | https://standby.design/llms.txt and https://github.com/KarstenKreh/Standby.Design/tree/master/packages/mcp-server |
| Support contact | GitHub issues: https://github.com/KarstenKreh/Standby.Design/issues |
| Source | Open source (MIT): https://github.com/KarstenKreh/Standby.Design |
| npm package (local alternative) | https://www.npmjs.com/package/standby-design-mcp |

## Review notes (for the test pass)

- No credentials needed — connect and call any tool directly.
- All 8 tools carry `title` and `readOnlyHint: true` annotations; there are
  no destructive operations and no side effects.
- Every generate_* tool returns a shareable `https://standby.design/system#…`
  URL; opening it in a browser shows the generated system visually.
- Suggested 10-minute test script:
  1. `generate_color_palette` with `{ "brandHex": "#0D9488", "themeName": "Review Test" }`
  2. `generate_type_scale` with the returned `url` and `{ "headingFont": "clash-display" }`
  3. `generate_shape_tokens` with the returned `url` and `{ "style": "glass" }`
  4. `export_design_system` with the final `url` and `{ "format": "tailwind" }`
  5. Open the returned standby.design URL in a browser — it shows the same system.
  6. Error path: `generate_color_palette` with `{ "brandHex": "nope" }` returns a
     helpful validation error (isError, no crash).

## Example prompts (3+)

1. "Build me a design system for a calm fintech product — dark blue brand,
   sharp corners, corporate icons. Give me the Tailwind tokens."
   → Chained generate_* calls, ends with a system URL + tailwind export.
2. "Generate a color palette from #FF2D9C with vibrant surfaces and lime,
   cyan and violet accents, then make the shapes neobrutalist."
   → generate_color_palette + generate_shape_tokens, returns URL + summaries.
3. "Here is our design system URL — export it as CSS custom properties and
   explain the semantic tokens." → get_design_system + export_design_system.
4. "Make the typography bigger and switch headings to Clash Display, keep
   everything else." → generate_type_scale with the existing URL (only the
   type segment changes).

## Submission status

- [ ] DNS A record `mcp.standby.design` → 46.225.131.97 active
- [ ] HTTPS endpoint live (Traefik/Let's Encrypt)
- [ ] Validated with MCP Inspector against the live endpoint
- [ ] Form submitted (review queue typically 1–2 weeks; escalation: mcp-review@anthropic.com)
