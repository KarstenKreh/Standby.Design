# @standby-design/mcp

MCP server exposing the [standby.design](https://standby.design) design-system engine to LLMs. Generate production-ready color palettes, fluid typographic scales, and complete design systems with one call.

Powered by the same OKLCH color math, √φ type scales, and perceptually uniform palette generation used by the web tools at [standby.design](https://standby.design).

## Tools

### `generate_color_palette`
18-step perceptually uniform palette in OKLCH from a single brand hex. Returns brand + surface + error + neutral palettes, shadcn/ui-compatible semantic tokens (light + dark), a ready-to-paste CSS stylesheet, and a human/LLM-readable briefing.

### `generate_type_scale`
Fluid typographic scale with CSS `clamp()` between mobile (375px) and desktop (1920px). Three modes: **golden** (fixed √φ ≈ 1.272), **traditional** (Renaissance point sizes), **custom** (user ratio). Returns 11 levels (display → caption) with line-heights, letter-spacings, optional spacing tokens, CSS + Tailwind v4 exports.

### `generate_design_system`
Complete unified system combining color + typography + spacing from a single brand and ratio. Returns merged palettes, semantic tokens, type scale, spacing scale, one unified CSS stylesheet, a Tailwind v4 `@theme` block, and a system-level briefing.

## Install

### Claude Desktop

Edit your config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "standby-design": {
      "command": "npx",
      "args": ["-y", "@standby-design/mcp"]
    }
  }
}
```

Restart Claude Desktop. The three tools appear under the plug icon.

### Cursor

In `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "standby-design": {
      "command": "npx",
      "args": ["-y", "@standby-design/mcp"]
    }
  }
}
```

### Anywhere else

```bash
npx @standby-design/mcp
```

Works with any MCP-compatible client that supports stdio transport.

## Example prompts

> Generate me a complete design system for a fintech brand. Brand color is `#335A7F`, clean look, body text at 1rem.

> I need an OKLCH color palette for `#8B5CF6` with semantic tokens for light and dark mode, and high chroma surfaces.

> Build a type scale using the golden ratio, heading font Satoshi, for a landing page.

## Output format

Every tool returns **two** content blocks:
1. **Markdown briefing** — human-readable, LLM-consumable documentation of the generated tokens, including usage guidance and Tailwind utility mapping.
2. **Structured JSON** — all generated palettes, levels, tokens, CSS, and Tailwind exports, ready to parse programmatically.

Claude reads the briefing first when deciding how to use the tokens.

## Philosophy

- **OKLCH everywhere** — perceptually uniform color space. Gamut-safe sRGB mapping is automatic.
- **√φ as a design heuristic** — the default type and spacing ratio of 1.272 sits inside the empirical 1.20–1.50 perceptual corridor. At this factor, the perceived area of letterforms scales by φ. It's not magic — it's a rational starting point.
- **No backend, no accounts** — MCP is just a thin wrapper around pure TypeScript functions.
- **shadcn/ui compatible** — semantic tokens map 1:1 to shadcn variable names.

## Repository

Source and full web tools at [github.com/standby-design/standby.design](https://github.com/standby-design/standby.design) / [standby.design](https://standby.design).

## License

MIT. No copyright on generated output — take what you need, make it yours.
