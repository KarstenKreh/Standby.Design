/**
 * System-level tools: inspect a design-system URL, export full token code,
 * and list available fonts.
 *
 * The export composition mirrors system-react/src/components/combined-export.tsx.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  generatePrimitivesOklch,
  generateSemantic,
  generateSeedComment,
  generateLlmBriefing as generateColorLlmBriefing,
} from '@syslib/color-code-export';
import {
  generateCssExport as generateTypeCss,
  generateTailwindV4Export as generateTypeTailwind,
  generateFontEmbed,
  generateLlmBriefing as generateTypeLlmBriefing,
} from '@syslib/type-code-export';
import {
  generateShapeCss,
  generateShapeTailwind,
  generateLlmBriefing as generateShapeLlmBriefing,
  optsFromState as shapeOptsFromState,
} from '@syslib/shape-code-export';
import { generateDesignTokens } from '@syslib/design-token-export';
import {
  generateSpaceCss,
  generateSpaceTailwind,
  generateSpaceLlmBriefing,
  type SpaceExportOptions,
} from '@core/space-code-export';
import type { UrlState as TypeState } from '@core/url-state/type';
import type { UrlState as SymbolState } from '@core/url-state/symbol';
import type { SpaceUrlState } from '@core/url-state/space';
import { computeIconTokens, weightToStroke } from '@core/icon-tokens';
import { getCatalog, fontsByCategory } from '@core/fontshare';
import { llmShareHeader } from '@core/share-link';
import {
  parseInput, systemUrl, toolUrl, textResult, errorResult,
  colorStateFrom, typeStateFrom, shapeStateFrom, symbolStateFrom, spaceStateFrom,
  DEFAULT_SYMBOL_STATE,
  buildPalette, buildScale, buildSpacing,
} from './lib.js';
import { colorSummary, typeSummary, shapeSummary, symbolSummary, spaceSummary, resolveIconSet } from './summaries.js';

type Section = 'color' | 'type' | 'space' | 'shape' | 'symbol';
const ALL_SECTIONS: Section[] = ['color', 'type', 'space', 'shape', 'symbol'];

type ExportFormat = 'css' | 'tailwind' | 'design-tokens' | 'llm-briefing' | 'font-embed';

function shareHeaderFor(format: ExportFormat, url: string): string {
  const line = `Design system: ${url}`;
  if (format === 'css' || format === 'tailwind') return `/* ${line} */`;
  if (format === 'font-embed') return `<!-- ${line} -->`;
  return line;
}

/* ── Labels (mirrored from combined-export.tsx) ── */

function getScaleLabel(typeState: TypeState): string {
  if (typeState.scaleMode === 'traditional') return 'Traditional Scale';
  const r = typeState.customRatio;
  if (Math.abs(r - 1.272) < 0.001) return 'Custom Ratio (√φ ≈ 1.272)';
  return `Custom Ratio (${r})`;
}

function getSpaceRatioLabel(s: SpaceUrlState): string {
  if (s.spacingMode === 'geometric' && Math.abs(s.spacingRatio - 1.272) < 0.001) {
    return '√φ Golden Ratio';
  }
  if (s.spacingMode === 'geometric') {
    return `Geometric ×${s.spacingRatio.toFixed(3)}`;
  }
  return 'Harmonic multiples';
}

/* ── Symbol generators (mirrored from combined-export.tsx, component-local there) ── */

function symbolTokenLines(sym: SymbolState): { header: string[]; tokens: string[] } {
  const { set } = resolveIconSet(sym);
  const tokens = computeIconTokens(sym.iconBaseSize, sym.iconScale, weightToStroke(set.strokeWeight), sym.snapTo4px);
  return {
    header: [
      `/* Icon Tokens — standby.design/symbol */`,
      `/* Recommended: ${set.name} (${set.id}) */`,
    ],
    tokens: [
      ...tokens.sizes.map((s) => `  --icon-${s.name}: ${s.rem}rem;`),
      `  --icon-stroke: ${tokens.strokeWidth}px;`,
    ],
  };
}

function generateSymbolCss(sym: SymbolState): string {
  const { header, tokens } = symbolTokenLines(sym);
  return [...header, ':root {', ...tokens, '}'].join('\n');
}

function generateSymbolTailwind(sym: SymbolState): string {
  const { header, tokens } = symbolTokenLines(sym);
  return [...header, '@theme {', ...tokens, '}'].join('\n');
}

function generateSymbolLlmBriefing(sym: SymbolState): string {
  const { set } = resolveIconSet(sym);
  const tokens = computeIconTokens(sym.iconBaseSize, sym.iconScale, weightToStroke(set.strokeWeight), sym.snapTo4px);
  return [
    `# Icon System — standby.design/symbol`,
    ``,
    `**Recommended:** ${set.name} — ${set.description}`,
    `- Install: \`npm install ${set.npmPackage}\``,
    `- Style: ${set.style}, Weight: ${set.strokeWeight}, Corners: ${set.cornerStyle}`,
    ``,
    `| Token | Value |`,
    `|-------|-------|`,
    ...tokens.sizes.map((s) => `| --icon-${s.name} | ${s.rem}rem (${s.px}px) |`),
    `| --icon-stroke | ${tokens.strokeWidth}px |`,
  ].join('\n');
}

/* ── Tools ── */

export function registerSystemTools(server: McpServer): void {
  server.registerTool(
    'get_design_system',
    {
      title: 'Inspect design system',
      description: 'Decode a standby.design URL (or raw hash) and return an overview of the full design system: color palette, type scale, spacing & layout, shape tokens, and icons — plus per-tool edit links. Always give the standby.design/system URL to the user — the link is the deliverable.',
      inputSchema: {
        url: z.string().describe('A standby.design URL or raw unified hash (e.g. from a previous generate_* call or copied from the browser).'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (args) => {
      const segs = parseInput(args.url);
      if (!segs.c && !segs.t && !segs.s && !segs.y && !segs.p) {
        return errorResult('No design-system configuration found in that URL/hash. Expected a unified hash like #c=...&t=...&s=...&y=...&p=...');
      }

      const colorState = colorStateFrom(segs);
      const typeState = typeStateFrom(segs);
      const shapeState = shapeStateFrom(segs);
      const symbolState = symbolStateFrom(segs);
      const spaceState = spaceStateFrom(segs);

      const parts: string[] = [
        `Design system: ${systemUrl(segs)}`,
        '',
        `Configured sections: ${(['c', 't', 's', 'y', 'p'] as const).filter(k => segs[k]).map(k => ({ c: 'color', t: 'type', s: 'shape', y: 'symbol', p: 'space' }[k])).join(', ')} (missing sections shown with defaults)`,
        '',
        colorSummary(colorState, buildPalette(colorState)),
        `Edit: ${toolUrl('color', segs)}`,
        '',
        typeSummary(typeState, buildScale(typeState)),
        `Edit: ${toolUrl('type', segs)}`,
        '',
        spaceSummary(spaceState, buildSpacing(spaceState)),
        `Edit: ${toolUrl('space', segs)}`,
        '',
        shapeSummary(shapeState),
        `Edit: ${toolUrl('shape', segs)}`,
        '',
        symbolState ? symbolSummary(symbolState) : '## Icons — not configured (use generate_icon_tokens)',
        symbolState ? `Edit: ${toolUrl('symbol', segs)}` : '',
      ];
      return textResult(parts.filter(p => p !== '').join('\n').replace(/\n{3,}/g, '\n\n'));
    }
  );

  server.registerTool(
    'export_design_system',
    {
      title: 'Export design system code',
      description: 'Generate the full token code for a design system URL in one format: "css" (CSS custom properties incl. semantic shadcn/ui-compatible tokens), "tailwind" (Tailwind v4 @theme), "design-tokens" (W3C DTCG JSON — typography & spacing), "llm-briefing" (Markdown brief for AI code generation), or "font-embed" (Fontshare <link> snippet). Optionally restrict to specific sections. Always give the returned standby.design/system URL to the user alongside the code — the link is the deliverable.',
      inputSchema: {
        url: z.string().describe('A standby.design URL or raw unified hash.'),
        format: z.enum(['css', 'tailwind', 'design-tokens', 'llm-briefing', 'font-embed']).describe('Output format.'),
        sections: z.array(z.enum(['color', 'type', 'space', 'shape', 'symbol'])).optional().describe('Which sections to include. Default: all configured sections (symbol only when configured).'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (args) => {
      const segs = parseInput(args.url);
      const sections: Section[] = args.sections ?? ALL_SECTIONS.filter(s => s !== 'symbol' || segs.y !== null);

      const colorState = colorStateFrom(segs);
      const typeState = typeStateFrom(segs);
      const shapeState = shapeStateFrom(segs);
      const symbolState = symbolStateFrom(segs) ?? (sections.includes('symbol') ? { ...DEFAULT_SYMBOL_STATE } : null);
      const spaceState = spaceStateFrom(segs);

      const palette = buildPalette(colorState);
      const scale = buildScale(typeState);
      const spacing = buildSpacing(spaceState);

      const spaceOpts: SpaceExportOptions = {
        spacingTokens: spacing,
        breakpoints: spaceState.breakpoints,
        fluidMinVw: spaceState.fluidMinVw,
        fluidMaxVw: spaceState.fluidMaxVw,
        containers: spaceState.containers,
        proseMaxCh: spaceState.proseMaxCh,
        aspectRatios: spaceState.aspectRatios,
        includeReciprocals: spaceState.aspectIncludeReciprocals,
        ratioLabel: getSpaceRatioLabel(spaceState),
      };

      const typeOpts = {
        levels: scale,
        spacingTokens: [],
        headingFont: typeState.headingFont,
        bodyFont: typeState.bodyFont,
        monoFont: typeState.monoFont,
        scaleLabel: getScaleLabel(typeState),
      };

      const colorCss = (): string => {
        let css = generateSeedComment(colorState, palette.effectiveBgHex, palette.effectiveErrorHex);
        css += generatePrimitivesOklch(
          palette.brand, palette.surface, palette.error,
          palette.errorSurface, palette.neutralExtended,
          palette.accentPalettes, colorState.chromaScale,
          colorState.bgAutoMatch ? null : colorState.bgColorHex,
          colorState.themeName,
        );
        css += '\n';
        css += generateSemantic(
          palette.accentPalettes,
          palette.brand, palette.error, palette.errorSurface, palette.surface,
          colorState.brandPin, colorState.brandPin ? colorState.brandHex : null, colorState.brandInvert,
          colorState.errorPin, colorState.errorPin ? palette.effectiveErrorHex : null, colorState.errorInvert,
          colorState.fgContrastMode, colorState.themeName,
        );
        return css;
      };

      const has = (s: Section) => sections.includes(s);
      let output: string;

      switch (args.format) {
        case 'css':
          output = [
            has('color') ? colorCss() : '',
            has('type') ? generateTypeCss(typeOpts) : '',
            has('space') ? generateSpaceCss(spaceOpts) : '',
            has('shape') ? generateShapeCss(shapeOptsFromState(shapeState, palette.effectiveBgHex)) : '',
            has('symbol') && symbolState ? generateSymbolCss(symbolState) : '',
          ].filter(Boolean).join('\n') || '/* No sections selected */';
          break;
        case 'tailwind':
          output = [
            // Color primitives + semantic tokens are plain CSS variables and identical in both formats.
            has('color') ? colorCss() : '',
            has('type') ? generateTypeTailwind(typeOpts) : '',
            has('space') ? generateSpaceTailwind(spaceOpts) : '',
            has('shape') ? generateShapeTailwind(shapeOptsFromState(shapeState, palette.effectiveBgHex)) : '',
            has('symbol') && symbolState ? generateSymbolTailwind(symbolState) : '',
          ].filter(Boolean).join('\n') || '/* No sections selected */';
          break;
        case 'design-tokens':
          output = generateDesignTokens({
            levels: scale,
            spacingTokens: spacing,
            headingFont: typeState.headingFont,
            bodyFont: typeState.bodyFont,
            monoFont: typeState.monoFont,
            headingWeight: typeState.headingWeight,
          });
          output += '\n\n/* Note: the DTCG export covers typography & spacing (matching the web app). Use format "css" or "tailwind" for color and shape tokens. */';
          break;
        case 'llm-briefing': {
          const parts: string[] = [];
          if (has('color')) {
            parts.push(generateColorLlmBriefing(
              colorState.brandHex,
              palette.effectiveBgHex,
              palette.effectiveErrorHex,
              palette.accentPalettes,
              colorState.chromaScale,
              colorState.currentMode,
              colorState.brandPin,
              colorState.errorPin,
              colorState.themeName,
              colorState.fgContrastMode,
            ));
          }
          if (has('type')) parts.push(generateTypeLlmBriefing(typeOpts));
          if (has('space')) parts.push(generateSpaceLlmBriefing(spaceOpts));
          if (has('shape')) parts.push(generateShapeLlmBriefing(shapeOptsFromState(shapeState, palette.effectiveBgHex)));
          if (has('symbol') && symbolState) parts.push(generateSymbolLlmBriefing(symbolState));
          output = parts.length
            ? llmShareHeader(systemUrl(segs)) + parts.join('\n---\n\n')
            : '<!-- No sections selected -->';
          break;
        }
        case 'font-embed':
          output = generateFontEmbed(typeState.headingFont, typeState.bodyFont, typeState.monoFont) || '<!-- No fonts selected -->';
          break;
      }

      return textResult(`${shareHeaderFor(args.format, systemUrl(segs))}\n\n${output}`);
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
