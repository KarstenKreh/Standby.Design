# Anthropic Connector Directory — Submission Sheet

Prepared answers for submitting standby.design to the Claude connector
directory. Process docs: https://claude.com/docs/connectors/building/submission

> **⚠ Blocked (2026-07-02): there is no public form.** Remote MCP servers are
> submitted through a portal in **Claude.ai admin settings**, which only
> exists for **Team/Enterprise organizations** (Owner role). Karsten's account
> is an individual plan — verified in the browser: the portal deep link
> redirects to personal settings. Decision: proceed without the directory for
> now (MCP Registry listing + aggregators already cover machine discovery);
> optionally package an MCPB desktop extension, which has a separate
> submission form without the portal requirement. Everything below stays
> ready for when portal access exists.

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

- [x] DNS A record `mcp.standby.design` → 46.225.131.97 active
- [x] HTTPS endpoint live (Traefik/Let's Encrypt) — `/health` reports v0.1.5
- [x] Validated against the live endpoint (2026-07-02, raw JSON-RPC over
      Streamable HTTP): initialize handshake, tools/list (8 tools, all with
      `readOnlyHint: true`), stateless tools/call, error path (`isError`,
      helpful message), GET → 405
- [x] npm: `standby-design-mcp` 0.1.5 is the published `latest`
- [x] MCP registry: `io.github.KarstenKreh/standby-design-mcp` 0.1.5 active and
      flagged `isLatest` (npm package version matches)
- [ ] Form submitted — **blocked**, see below

## Directory submission is blocked

The Anthropic connector submission portal is Team/Enterprise-only, so the remote
connector cannot be submitted from this account. The form linked above is not
reachable without such a plan.

Alternative route, tracked in #33: package the stdio server as an MCPB desktop
extension and submit it through the desktop extension form, which needs no
portal access. All listing content in this file is reusable there as-is.

Verified 2026-08-08:

```
$ curl -s https://mcp.standby.design/health
{"name":"standby-design","version":"0.1.5","status":"ok","endpoint":"/mcp","docs":"https://standby.design/llms.txt"}
```
