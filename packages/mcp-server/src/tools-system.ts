/**
 * System-level tools: inspect a design-system URL, export full token code,
 * and list available fonts.
 *
 * The export composition is shared with the System page via @core/system-export.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { resolveDesignSystem } from '@core/design-system';
import { generateSystemExport, defaultSections, SYSTEM_SECTIONS, type SystemSection } from '@core/system-export';
import { DEFAULT_SYMBOL_STATE } from '@core/url-state/symbol';
import { getCatalog, fontsByCategory } from '@core/fontshare';
import { parseInput, systemUrl, toolUrl, textResult, errorResult } from './lib.js';
import { colorSummary, typeSummary, shapeSummary, symbolSummary, spaceSummary, motionSummary } from './summaries.js';

const SECTION_NAMES = { c: 'color', t: 'type', s: 'shape', y: 'symbol', p: 'space', m: 'motion' } as const;

/* ── Tools ── */

export function registerSystemTools(server: McpServer): void {
  server.registerTool(
    'get_design_system',
    {
      title: 'Inspect design system',
      description: 'Decode a standby.design URL (or raw hash) and return an overview of the full design system: color palette, type scale, spacing & layout, shape tokens, motion springs, and icons — plus per-tool edit links. Always give the standby.design/system URL to the user — the link is the deliverable.',
      inputSchema: {
        url: z.string().describe('A standby.design URL or raw unified hash (e.g. from a previous generate_* call or copied from the browser).'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (args) => {
      const segs = parseInput(args.url);
      const configured = (Object.keys(SECTION_NAMES) as (keyof typeof SECTION_NAMES)[]).filter(k => segs[k]);
      if (configured.length === 0) {
        return errorResult('No design-system configuration found in that URL/hash. Expected a unified hash like #c=...&t=...&s=...&y=...&p=...&m=...');
      }

      const sys = resolveDesignSystem(segs);

      const parts: string[] = [
        `Design system: ${systemUrl(segs)}`,
        '',
        `Configured sections: ${configured.map(k => SECTION_NAMES[k]).join(', ')} (missing sections shown with defaults)`,
        '',
        colorSummary(sys.color, sys.palettes),
        `Edit: ${toolUrl('color', segs)}`,
        '',
        typeSummary(sys.type, sys.scale),
        `Edit: ${toolUrl('type', segs)}`,
        '',
        spaceSummary(sys.space, sys.spacing),
        `Edit: ${toolUrl('space', segs)}`,
        '',
        shapeSummary(sys.shape),
        `Edit: ${toolUrl('shape', segs)}`,
        '',
        motionSummary(sys.motion, sys.motionPrimitives),
        `Edit: ${toolUrl('motion', segs)}`,
        '',
        sys.symbol ? symbolSummary(sys.symbol) : '## Icons — not configured (use generate_icon_tokens)',
        sys.symbol ? `Edit: ${toolUrl('symbol', segs)}` : '',
      ];
      return textResult(parts.filter(p => p !== '').join('\n').replace(/\n{3,}/g, '\n\n'));
    }
  );

  server.registerTool(
    'export_design_system',
    {
      title: 'Export design system code',
      description: 'Generate the full token code for a design system URL in one format: "css" (CSS custom properties incl. semantic shadcn/ui-compatible tokens), "tailwind" (Tailwind v4 @theme), "design-tokens" (W3C DTCG JSON — typography, spacing & layout, shape, icons and motion; color is not part of it), "llm-briefing" (Markdown brief for AI code generation), or "font-embed" (Fontshare <link> snippet). Optionally restrict to specific sections. Every format carries the standby.design/system share link. Always give that URL to the user alongside the code and keep it as a comment in the theme file of the target project — the link is the deliverable.',
      inputSchema: {
        url: z.string().describe('A standby.design URL or raw unified hash.'),
        format: z.enum(['css', 'tailwind', 'design-tokens', 'llm-briefing', 'font-embed']).describe('Output format.'),
        sections: z.array(z.enum(SYSTEM_SECTIONS as [SystemSection, ...SystemSection[]])).optional().describe('Which sections to include. Honoured by "css", "tailwind", "llm-briefing" and "design-tokens" (which has no color section). By default color, type, space, shape and motion are always included — with their defaults when the URL does not configure them — and symbol only when the URL configures it. Ignored by "font-embed".'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (args) => {
      const segs = parseInput(args.url);
      const resolved = resolveDesignSystem(segs);
      const sys = resolved.symbol || !args.sections?.includes('symbol')
        ? resolved
        : { ...resolved, symbol: { ...DEFAULT_SYMBOL_STATE } };
      const sections = args.sections ?? defaultSections(sys);
      return textResult(generateSystemExport(sys, args.format, { sections, shareUrl: systemUrl(segs) }));
    }
  );

  server.registerTool(
    'list_fonts',
    {
      title: 'List available fonts',
      description: 'List Fontshare font slugs usable in generate_type_scale (headingFont/bodyFont/monoFont), grouped by category. This is the bundled seed catalog — any valid Fontshare slug works even if not listed here.',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => {
      void getCatalog();
      const byCategory = fontsByCategory();
      const lines: string[] = [];
      for (const [category, fonts] of Object.entries(byCategory)) {
        lines.push(`## ${category}`);
        for (const f of fonts) lines.push(`- ${f.slug} — ${f.name}`);
        lines.push('');
      }
      lines.push('Any other Fontshare slug (fontshare.com) is also accepted.');
      return textResult(lines.join('\n'));
    }
  );
}
