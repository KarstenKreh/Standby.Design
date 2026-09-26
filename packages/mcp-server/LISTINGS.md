# Directory Listings — Submission Sheet

Copy-paste material for listing the MCP server in third-party directories (issue #11). The official MCP Registry entry (`io.github.KarstenKreh/standby-design-mcp`) exists since 2026-06-12, but as of 2026-09-25 none of the directories below had picked it up automatically, so each one needs a manual submission. All of them require signing in (mostly with GitHub), which only Karsten can do.

## Status (checked 2026-09-25)

| Directory | Listed? | Where to submit |
|-----------|---------|-----------------|
| Smithery | No (search for "standby" finds nothing) | https://smithery.ai → sign in with GitHub → "Publish server" / "Add server" → choose remote URL |
| Glama | No (no page under KarstenKreh/Standby.Design) | https://glama.ai/mcp/servers → "Add server" → GitHub repo URL. `glama.json` in the repo root names KarstenKreh as maintainer, so the listing can be claimed afterwards |
| PulseMCP | Unknown (site blocks scripted checks) | https://www.pulsemcp.com/submit |
| mcp.so | No | https://mcp.so → "Submit" (sign in with GitHub) |

## Fields

| Field | Value |
|-------|-------|
| Name | standby.design |
| Package / slug | `standby-design-mcp` |
| Remote endpoint | `https://mcp.standby.design/mcp` (Streamable HTTP, no auth) |
| Local install | `npx -y standby-design-mcp` |
| Claude Code | `claude mcp add standby-design -- npx -y standby-design-mcp` |
| Repository | https://github.com/KarstenKreh/Standby.Design |
| Server source | https://github.com/KarstenKreh/Standby.Design/tree/master/packages/mcp-server |
| Homepage / docs | https://standby.design/docs/mcp |
| npm | https://www.npmjs.com/package/standby-design-mcp |
| Privacy policy | https://standby.design/privacy.html |
| License | MIT |
| Icon (512×512 PNG) | https://raw.githubusercontent.com/KarstenKreh/Standby.Design/master/packages/mcp-server/icon.png |
| Social image (1280×640) | https://standby.design/og-image?tool=github |
| Categories | Design, Developer Tools, Frontend |
| Tags | design-system, design-tokens, color-palette, oklch, typography, tailwind, shadcn, css |

## Tagline (max. 100 characters)

Generate design systems: OKLCH color palettes, fluid type scales, spacing, shape and icon tokens.

## Short description

Let your AI agent build a real design system instead of guessing one. Generates OKLCH color palettes, fluid type scales, spacing, shape, icon and motion tokens, and exports them as CSS, Tailwind v4 or W3C design tokens. Free, no auth, every result links to a live preview on standby.design.

## Long description

standby.design gives AI agents the same generators that power the standby.design web tools. Instead of improvising colors, font sizes and spacing, the agent calls deterministic, tested generators and gets production-ready tokens back.

- Color: OKLCH palettes from a brand color with 18-step scales, shadcn/ui-compatible semantic tokens, accents, light and dark mode.
- Type: fluid type scales with CSS clamp(), 11 levels, Fontshare fonts, line heights and letter spacing.
- Space: spacing scale, breakpoints, container widths, prose measure and aspect ratios.
- Shape: radii, shadows, borders and focus rings in four styles (paper, glass, neomorph, neobrutalism).
- Icons: an icon set recommendation plus sizing tokens.
- Motion: spring-based motion tokens from two character axes (energy, material), with semantic tokens and a reduced-motion rule.
- Export: CSS custom properties, Tailwind v4 theme, W3C design tokens (DTCG) or an LLM briefing.

Every tool returns a share link that holds the full configuration. Tools chain through that link, and opening it in the browser shows the complete system with a live preview where every value can be fine-tuned. All tools are read-only and stateless; nothing is stored or logged.

## Tools

generate_color_palette, generate_type_scale, generate_space_tokens, generate_shape_tokens, generate_icon_tokens, generate_motion_tokens, get_design_system, export_design_system, list_fonts, get_design_rules

## Example prompts

- Build me a design system for a calm fintech product: dark blue brand, sharp corners, corporate icons. Give me the Tailwind tokens.
- Generate a color palette from #FF2D9C with vibrant surfaces and lime, cyan and violet accents, then make the shapes neobrutalist.
- Here is our design system link: https://standby.design/system#… Export it as CSS custom properties and explain the semantic tokens.
