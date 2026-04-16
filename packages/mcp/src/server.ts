// McpServer setup. IMPORTANT: never write to stdout — stdio transport uses it
// for the protocol. All logging goes to stderr via console.error.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { colorInputShape } from './schemas/color-input.js';
import { typeInputShape } from './schemas/type-input.js';
import { systemInputShape } from './schemas/system-input.js';
import { runGenerateColorPalette } from './tools/generate-color-palette.js';
import { runGenerateTypeScale } from './tools/generate-type-scale.js';
import { runGenerateDesignSystem } from './tools/generate-design-system.js';

export const SERVER_INFO = {
  name: 'standby-design',
  version: '0.1.0',
} as const;

export function createServer(): McpServer {
  const server = new McpServer(SERVER_INFO, {
    capabilities: { tools: {} },
  });

  server.registerTool(
    'generate_color_palette',
    {
      title: 'Generate Color Palette',
      description:
        'Generate an 18-step perceptually uniform color palette in the OKLCH color space from a single brand hex. Returns brand + surface + error + neutral palettes, shadcn/ui-compatible semantic tokens (light + dark mode), a production-ready CSS stylesheet, and a human/LLM-readable briefing. Use when the user asks for a color system, theme, palette, or semantic tokens.',
      inputSchema: colorInputShape,
    },
    async (input) => {
      const { briefing, structured } = runGenerateColorPalette(input);
      return {
        content: [
          { type: 'text', text: briefing },
          { type: 'text', text: JSON.stringify(structured, null, 2) },
        ],
      };
    },
  );

  server.registerTool(
    'generate_type_scale',
    {
      title: 'Generate Type Scale',
      description:
        'Generate a fluid typographic scale with CSS clamp() between mobile (375px) and desktop (1920px). Supports three modes: golden (fixed √φ ≈ 1.272 lookup), traditional (Renaissance point sizes), and custom (user-defined ratio). Returns 11 levels (display → caption) with line-heights + letter-spacings, optional derived spacing tokens, CSS + Tailwind v4 exports, and an LLM briefing. Use when the user asks for typography, text sizes, font scales, or fluid type.',
      inputSchema: typeInputShape,
    },
    async (input) => {
      const { briefing, structured } = runGenerateTypeScale(input);
      return {
        content: [
          { type: 'text', text: briefing },
          { type: 'text', text: JSON.stringify(structured, null, 2) },
        ],
      };
    },
  );

  server.registerTool(
    'generate_design_system',
    {
      title: 'Generate Design System',
      description:
        'Generate a complete, unified design system combining color + typography + spacing from a single brand hex and type ratio. Returns merged palettes, semantic tokens, type scale (with clamp()), spacing tokens, a single unified CSS stylesheet, a Tailwind v4 @theme block, and a system-level LLM briefing that composes all sub-briefings. Use when the user asks for a full theme, design tokens, or a starter system for their brand.',
      inputSchema: systemInputShape,
    },
    async (input) => {
      const { briefing, structured } = runGenerateDesignSystem(input);
      return {
        content: [
          { type: 'text', text: briefing },
          { type: 'text', text: JSON.stringify(structured, null, 2) },
        ],
      };
    },
  );

  return server;
}
