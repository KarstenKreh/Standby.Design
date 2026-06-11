# @standby/mcp-server

MCP server for [standby.design](https://standby.design) — generate and export
production-ready design systems directly from Claude (or any MCP client),
without touching the web UI.

All computation is shared with the standby.design web apps (`packages/core` +
`system-react/src/lib`), so results are identical to what the UI produces.
Every tool returns a shareable `standby.design/system` URL — open it in the
browser to view and fine-tune the system visually; the URL *is* the state.

## Tools

| Tool | Purpose |
|------|---------|
| `generate_color_palette` | OKLCH palette from a brand color: 18-step scales, semantic tokens (shadcn/ui compatible), accents, light+dark |
| `generate_type_scale` | Fluid type scale (CSS `clamp()`), 11 levels, Fontshare fonts, line heights & letter spacing |
| `generate_shape_tokens` | Radii, shadows, borders, focus rings — styles: paper / glass / neomorph / neobrutalism |
| `generate_icon_tokens` | Icon set recommendation/selection + sizing tokens (xs–2xl, stroke) |
| `generate_space_tokens` | Spacing tokens, breakpoints, containers, prose measure, aspect ratios |
| `get_design_system` | Decode any standby.design URL into a full overview |
| `export_design_system` | Full code export: `css`, `tailwind`, `design-tokens` (DTCG), `llm-briefing`, `font-embed` |
| `list_fonts` | Fontshare slugs for `generate_type_scale` |

Each `generate_*` tool accepts an optional `url` and only changes its own
section, so calls chain: color → type → shape → … accumulate into one URL.

## Build

```bash
cd packages/mcp-server
npm install
npm run build        # bundles @core + system-react/src/lib into dist/index.js
npm run smoke        # end-to-end protocol test against the built server
```

## Install

Claude Code:

```bash
claude mcp add standby-design -- npx -y standby-design-mcp
```

Claude Desktop — add to `claude_desktop_config.json`
(Settings → Developer → Edit Config), then restart the app:

```json
{
  "mcpServers": {
    "standby-design": {
      "command": "npx",
      "args": ["-y", "standby-design-mcp"]
    }
  }
}
```

Any other MCP client: run `npx -y standby-design-mcp` as a stdio server.

### Remote (no local install)

A hosted, auth-free endpoint is available at `https://mcp.standby.design/mcp`
(Streamable HTTP, stateless). In Claude: Settings → Connectors → Add custom
connector → paste the URL. Privacy: nothing is collected or stored —
see https://standby.design/privacy.html.

## Example prompts

> Build me a design system for a calm fintech product — dark blue brand,
> sharp corners, corporate icons. Give me the Tailwind tokens.

> Generate a color palette from #FF2D9C with vibrant surfaces and lime,
> cyan and violet accents, then make the shapes neobrutalist.

> Here is our design system URL: https://standby.design/system#… —
> export it as CSS custom properties and explain the semantic tokens.

> Make the typography bigger and switch the headings to Clash Display,
> keep everything else.

## Local development

Register your local build instead of the npm package:

```bash
claude mcp add standby-design -- node "<absolute-path-to-repo>/packages/mcp-server/dist/index.js"
```
