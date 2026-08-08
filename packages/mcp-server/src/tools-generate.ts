/**
 * Generate tools — one per standby.design tool (color, type, shape, symbol, space).
 *
 * Each tool reads the corresponding segment from an optional existing URL,
 * applies only the provided parameters on top, re-encodes its segment while
 * preserving all others, and returns the shareable /system URL plus a compact
 * summary of the computed tokens.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { encodeState as encodeColorState, type Accent } from '@core/url-state/color';
import { encodeState as encodeTypeState } from '@core/url-state/type';
import { encodeState as encodeShapeState } from '@core/url-state/shape';
import { encodeState as encodeSymbolState } from '@core/url-state/symbol';
import { encodeState as encodeSpaceState } from '@core/url-state/space';
import { SUCCESS_HUE, WARNING_HUE, INFO_HUE } from '@core/palette';
import { TYPE_LEVELS, type TypeLevel } from '@core/scale';
import { ICON_SETS } from '@core/icon-sets';
import {
  parseInput, systemUrl, toolUrl, normalizeHex, textResult, errorResult,
  colorStateFrom, typeStateFrom, shapeStateFrom, symbolStateFrom, spaceStateFrom,
  DEFAULT_SYMBOL_STATE,
  buildPalette, buildScale, buildSpacing,
  type Segments,
} from './lib.js';
import { colorSummary, typeSummary, shapeSummary, symbolSummary, spaceSummary } from './summaries.js';

const URL_PARAM = z.string().optional().describe(
  'Existing standby.design URL (or raw hash) to modify. Only this tool\'s section is changed; color/type/shape/icon/spacing settings from other tools are preserved. Omit to start fresh from defaults.'
);

function header(segs: Segments, editTool: 'color' | 'type' | 'shape' | 'symbol' | 'space'): string {
  return [
    `Design system: ${systemUrl(segs)}`,
    `Fine-tune in UI: ${toolUrl(editTool, segs)}`,
  ].join('\n');
}

const READ_ONLY = { readOnlyHint: true, openWorldHint: false };

/* ── Color ── */

const ACCENT_PRESET_HUES: Record<string, number> = {
  success: SUCCESS_HUE,
  warning: WARNING_HUE,
  info: INFO_HUE,
};

export function registerGenerateTools(server: McpServer): void {
  server.registerTool(
    'generate_color_palette',
    {
      title: 'Generate color palette',
      description: 'Generate a perceptually uniform OKLCH color palette from a brand color: 18-step scales for brand/surface/error/accents, semantic tokens (shadcn/ui compatible), light+dark modes. Returns a shareable standby.design/system URL and a compact summary. Always give that URL to the user — the link is the deliverable; it opens the live system in the browser. Use export_design_system for full CSS/Tailwind output.',
      inputSchema: {
        url: URL_PARAM,
        brandHex: z.string().optional().describe('Brand color as 6-digit hex, e.g. "#335A7F". The palette midpoint is derived from this.'),
        themeName: z.string().max(60).optional().describe('Name of the design system (appears in exports and page title).'),
        mode: z.enum(['balanced', 'exact']).optional().describe('"balanced": step 500 is always the perceptual midpoint (even light/dark distribution). "exact": step 500 keeps the input color\'s lightness.'),
        chromaScale: z.number().min(0).max(1).optional().describe('Surface saturation 0–1 (0 = grey surfaces, 1 = vibrant). Default 0.25.'),
        bgColorHex: z.string().optional().describe('Surface tint color as hex, or "auto" to derive from the brand color (default).'),
        errorColorHex: z.string().optional().describe('Error/destructive color as hex, or "auto" to derive from the brand hue (default).'),
        brandPin: z.boolean().optional().describe('Pin the primary token to the exact input hex instead of the palette step.'),
        brandInvert: z.boolean().optional().describe('For pinned brand: mirror lightness in dark mode (e.g. black buttons in light mode, white in dark).'),
        errorPin: z.boolean().optional(),
        errorInvert: z.boolean().optional(),
        fgContrastMode: z.enum(['best', 'preferLight', 'preferDark']).optional().describe('Text color strategy on colored backgrounds.'),
        accents: z.array(z.object({
          name: z.string().min(1).max(30),
          hex: z.string().optional().describe('Hex color. Omit to auto-derive from the brand color (requires autoHue or a preset name: Success/Warning/Info).'),
          autoHue: z.number().min(0).max(360).optional().describe('OKLCH hue for auto-derived accents.'),
          pin: z.boolean().optional(),
          invert: z.boolean().optional(),
        })).max(3).optional().describe('Up to 3 additional named accent colors. Replaces the existing accent list when provided; pass [] to remove all accents. Default: Success/Warning/Info, auto-derived.'),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const segs = parseInput(args.url);
      const state = { ...colorStateFrom(segs), extraAccents: [...colorStateFrom(segs).extraAccents] };

      if (args.brandHex !== undefined) {
        const hex = normalizeHex(args.brandHex);
        if (!hex) return errorResult(`Invalid brandHex "${args.brandHex}" — expected a 6-digit hex color like #335A7F.`);
        state.brandHex = hex;
      }
      if (args.themeName !== undefined) state.themeName = args.themeName;
      if (args.mode !== undefined) state.currentMode = args.mode;
      if (args.chromaScale !== undefined) state.chromaScale = args.chromaScale;
      if (args.bgColorHex !== undefined) {
        if (args.bgColorHex.toLowerCase() === 'auto') {
          state.bgAutoMatch = true;
          state.bgColorHex = state.brandHex;
        } else {
          const hex = normalizeHex(args.bgColorHex);
          if (!hex) return errorResult(`Invalid bgColorHex "${args.bgColorHex}" — expected a 6-digit hex color or "auto".`);
          state.bgAutoMatch = false;
          state.bgColorHex = hex;
        }
      }
      if (args.errorColorHex !== undefined) {
        if (args.errorColorHex.toLowerCase() === 'auto') {
          state.errorAutoMatch = true;
        } else {
          const hex = normalizeHex(args.errorColorHex);
          if (!hex) return errorResult(`Invalid errorColorHex "${args.errorColorHex}" — expected a 6-digit hex color or "auto".`);
          state.errorAutoMatch = false;
          state.errorColorHex = hex;
        }
      }
      if (args.brandPin !== undefined) state.brandPin = args.brandPin;
      if (args.brandInvert !== undefined) state.brandInvert = args.brandInvert;
      if (args.errorPin !== undefined) state.errorPin = args.errorPin;
      if (args.errorInvert !== undefined) state.errorInvert = args.errorInvert;
      if (args.fgContrastMode !== undefined) state.fgContrastMode = args.fgContrastMode;

      if (args.accents !== undefined) {
        const accents: Accent[] = [];
        for (const a of args.accents) {
          if (a.hex) {
            const hex = normalizeHex(a.hex);
            if (!hex) return errorResult(`Invalid hex "${a.hex}" for accent "${a.name}".`);
            accents.push({ name: a.name, hex, pin: a.pin ?? false, invert: a.invert ?? false, autoMatch: false, autoHue: 0 });
          } else {
            const hue = a.autoHue ?? ACCENT_PRESET_HUES[a.name.toLowerCase()];
            if (hue === undefined) {
              return errorResult(`Accent "${a.name}": provide either a hex color or an autoHue (0–360) for auto-derivation. Presets with known hues: Success, Warning, Info.`);
            }
            accents.push({ name: a.name, hex: '#000000', pin: a.pin ?? false, invert: a.invert ?? false, autoMatch: true, autoHue: hue });
          }
        }
        state.extraAccents = accents;
      }

      const next: Segments = { ...segs, c: encodeColorState(state) };
      const palette = buildPalette(state);
      return textResult(`${header(next, 'color')}\n\n${colorSummary(state, palette)}`);
    }
  );

  /* ── Type ── */

  const levelOverrides = z.record(z.string(), z.number()).optional();

  server.registerTool(
    'generate_type_scale',
    {
      title: 'Generate type scale',
      description: 'Generate a fluid typographic scale (CSS clamp() between 375px and 1920px viewports) with 11 levels (Display, H1–H6, Body L/M/S, Caption), Fontshare fonts, line heights and letter spacing. Returns a shareable standby.design/system URL and a summary table. Always give that URL to the user — the link is the deliverable. Use list_fonts to discover font slugs.',
      inputSchema: {
        url: URL_PARAM,
        scaleMode: z.enum(['custom', 'traditional']).optional().describe('"custom": compound ratio scale (default). "traditional": classical Renaissance point sizes per level.'),
        baseSize: z.number().min(0.5).max(2).optional().describe('Desktop base size in rem (default 1.0).'),
        ratio: z.number().min(1.05).max(1.7).optional().describe('Scale ratio for custom mode. Presets: 1.2 minor third, 1.25 major third, 1.272 golden-ratio-area (default, √φ), 1.333 perfect fourth, 1.618 golden ratio. The empirical perceptual corridor is 1.20–1.50.'),
        mobileBaseSize: z.number().min(0.5).max(2).optional().describe('Mobile base size in rem (default = baseSize).'),
        mobileRatio: z.number().min(1.0).max(1.7).optional().describe('Explicit mobile scale ratio. Omit to auto-derive from ratio and autoShrink.'),
        autoShrink: z.number().min(0).max(100).optional().describe('Percent reduction for the auto-derived mobile ratio (default 25). Only used when mobileRatio is not set.'),
        headingFont: z.string().optional().describe('Fontshare font slug for headings, e.g. "satoshi", "general-sans", "clash-display".'),
        bodyFont: z.string().optional().describe('Fontshare font slug for body text.'),
        monoFont: z.string().optional().describe('Font slug for code. System stacks: "system-mono", "consolas", "sf-mono".'),
        headingWeight: z.number().int().min(100).max(900).optional().describe('Font weight for headings (default 500).'),
        lineHeightOverrides: levelOverrides.describe('Per-level line-height overrides, e.g. {"h1": 1.1, "body-m": 1.6}. Levels: display, h1–h6, body-l, body-m, body-s, caption.'),
        letterSpacingOverrides: levelOverrides.describe('Per-level letter-spacing overrides in em, e.g. {"display": -0.05}.'),
        traditionalAssignments: z.record(z.string(), z.number()).optional().describe('For traditional mode: desktop px size per level, e.g. {"display": 48, "h1": 36, ...}.'),
        traditionalMobileAssignments: z.record(z.string(), z.number()).optional().describe('For traditional mode: mobile px size per level.'),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const segs = parseInput(args.url);
      const state = typeStateFrom(segs);

      for (const key of ['lineHeightOverrides', 'letterSpacingOverrides', 'traditionalAssignments', 'traditionalMobileAssignments'] as const) {
        const rec = args[key];
        if (!rec) continue;
        const bad = Object.keys(rec).filter(k => !TYPE_LEVELS.includes(k as TypeLevel));
        if (bad.length > 0) return errorResult(`Invalid type level(s) in ${key}: ${bad.join(', ')}. Valid levels: ${TYPE_LEVELS.join(', ')}.`);
      }

      if (args.scaleMode !== undefined) state.scaleMode = args.scaleMode;
      if (args.baseSize !== undefined) {
        // Keep mobile base in sync unless it was explicitly diverged.
        if (state.mobileBaseSize === state.baseSize && args.mobileBaseSize === undefined) {
          state.mobileBaseSize = args.baseSize;
        }
        state.baseSize = args.baseSize;
      }
      if (args.ratio !== undefined) state.customRatio = args.ratio;
      if (args.mobileBaseSize !== undefined) state.mobileBaseSize = args.mobileBaseSize;
      if (args.autoShrink !== undefined) state.autoShrink = args.autoShrink;
      if (args.mobileRatio !== undefined) {
        state.mobileRatioMode = 'custom';
        state.mobileRatio = args.mobileRatio;
      } else if (state.mobileRatioMode === 'auto') {
        state.mobileRatio = Math.round((1 + (state.customRatio - 1) * (1 - state.autoShrink / 100)) * 1000) / 1000;
      }
      if (args.headingFont !== undefined) state.headingFont = args.headingFont;
      if (args.bodyFont !== undefined) state.bodyFont = args.bodyFont;
      if (args.monoFont !== undefined) state.monoFont = args.monoFont;
      if (args.headingWeight !== undefined) state.headingWeight = args.headingWeight;
      if (args.lineHeightOverrides !== undefined) state.lineHeightOverrides = args.lineHeightOverrides as Partial<Record<TypeLevel, number>>;
      if (args.letterSpacingOverrides !== undefined) state.letterSpacingOverrides = args.letterSpacingOverrides as Partial<Record<TypeLevel, number>>;

      if (state.scaleMode === 'traditional') {
        const fill = (rec: Record<string, number> | undefined, base: Record<TypeLevel, number>): Record<TypeLevel, number> => {
          const out = { ...base };
          for (const [k, v] of Object.entries(rec ?? {})) out[k as TypeLevel] = v;
          return out;
        };
        const { DEFAULT_TRADITIONAL, DEFAULT_TRADITIONAL_MOBILE } = await import('@core/scale');
        state.traditionalAssignments = fill(args.traditionalAssignments, state.traditionalAssignments ?? DEFAULT_TRADITIONAL);
        state.traditionalMobileAssignments = fill(args.traditionalMobileAssignments, state.traditionalMobileAssignments ?? DEFAULT_TRADITIONAL_MOBILE);
      }

      const next: Segments = { ...segs, t: encodeTypeState(state) };
      const scale = buildScale(state);
      return textResult(`${header(next, 'type')}\n\n${typeSummary(state, scale)}`);
    }
  );

  /* ── Shape ── */

  server.registerTool(
    'generate_shape_tokens',
    {
      title: 'Generate shape tokens',
      description: 'Generate shape tokens — radii, shadows, borders, focus rings — in one of four visual styles: "paper" (classic surfaces with layered shadows), "glass" (liquid glass), "neomorph" (soft neumorphism), "neobrutalism" (hard offset shadows). Returns a shareable standby.design/system URL and a summary. Always give that URL to the user — the link is the deliverable.',
      inputSchema: {
        url: URL_PARAM,
        style: z.enum(['paper', 'glass', 'neomorph', 'neobrutalism']).optional().describe('Top-level visual style (default "paper").'),
        borderRadius: z.number().int().min(0).max(64).optional().describe('Base radius in px; scales to a xs–xl radius set (default 8).'),
        shadowEnabled: z.boolean().optional(),
        shadowType: z.enum(['normal', 'flat']).optional().describe('Shadow rendering for paper style.'),
        shadowStrength: z.number().min(0).max(3).optional().describe('Shadow alpha multiplier (default 1.0).'),
        shadowBlurScale: z.number().min(0).max(3).optional().describe('Shadow blur multiplier (default 1.0).'),
        shadowScale: z.number().min(1).max(2).optional().describe('Elevation level spread ratio (default 1.272).'),
        shadowColorHex: z.string().optional().describe('Custom shadow color as hex, or "auto" (default).'),
        shadowOffsetX: z.number().int().min(-16).max(16).optional().describe('Brutalist shadow X offset in px (default 2).'),
        shadowOffsetY: z.number().int().min(-16).max(16).optional().describe('Brutalist shadow Y offset in px (default 4).'),
        brutalistVariant: z.enum(['outlined', 'solid']).optional(),
        borderEnabled: z.boolean().optional(),
        borderWidth: z.number().min(0).max(10).optional().describe('Border width in px (default 1).'),
        borderColorHex: z.string().optional().describe('Custom border color as hex, or "auto" (default).'),
        glassDepth: z.number().min(-2).max(5).optional().describe('Glass displacement intensity (default 0.2).'),
        glassBlur: z.number().min(0).max(20).optional().describe('Glass backdrop blur (default 1.0).'),
        glassDispersion: z.number().min(0).max(2).optional().describe('Chromatic aberration intensity (default 0.4).'),
        ringWidth: z.number().int().min(0).max(8).optional().describe('Focus ring width in px (default 2).'),
        ringOffset: z.number().int().min(0).max(8).optional().describe('Focus ring offset in px (default 2).'),
        ringColorHex: z.string().optional().describe('Custom focus ring color as hex, or "auto" (default).'),
        separationMode: z.enum(['shadow', 'border', 'contrast', 'gap', 'mixed']).optional().describe('How surfaces separate from the background.'),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const segs = parseInput(args.url);
      const state = shapeStateFrom(segs);

      if (args.style !== undefined) state.shapeStyle = args.style;
      if (args.borderRadius !== undefined) state.borderRadius = args.borderRadius;
      if (args.shadowEnabled !== undefined) state.shadowEnabled = args.shadowEnabled;
      if (args.shadowType !== undefined) state.shadowType = args.shadowType;
      if (args.shadowStrength !== undefined) state.shadowStrength = args.shadowStrength;
      if (args.shadowBlurScale !== undefined) state.shadowBlurScale = args.shadowBlurScale;
      if (args.shadowScale !== undefined) state.shadowScale = args.shadowScale;
      if (args.shadowOffsetX !== undefined) state.shadowOffsetX = args.shadowOffsetX;
      if (args.shadowOffsetY !== undefined) state.shadowOffsetY = args.shadowOffsetY;
      if (args.brutalistVariant !== undefined) state.brutalistVariant = args.brutalistVariant;
      if (args.borderEnabled !== undefined) state.borderEnabled = args.borderEnabled;
      if (args.borderWidth !== undefined) state.borderWidth = args.borderWidth;
      if (args.glassDepth !== undefined) state.glassDepth = args.glassDepth;
      if (args.glassBlur !== undefined) state.glassBlur = args.glassBlur;
      if (args.glassDispersion !== undefined) state.glassDispersion = args.glassDispersion;
      if (args.ringWidth !== undefined) state.ringWidth = args.ringWidth;
      if (args.ringOffset !== undefined) state.ringOffset = args.ringOffset;
      if (args.separationMode !== undefined) state.separationMode = args.separationMode;

      for (const [argKey, modeKey, colorKey] of [
        ['shadowColorHex', 'shadowColorMode', 'shadowCustomColor'],
        ['borderColorHex', 'borderColorMode', 'borderCustomColor'],
        ['ringColorHex', 'ringColorMode', 'ringCustomColor'],
      ] as const) {
        const value = args[argKey];
        if (value === undefined) continue;
        if (value.toLowerCase() === 'auto') {
          state[modeKey] = 'auto';
        } else {
          const hex = normalizeHex(value);
          if (!hex) return errorResult(`Invalid ${argKey} "${value}" — expected a 6-digit hex color or "auto".`);
          state[modeKey] = 'custom';
          state[colorKey] = hex;
        }
      }

      const next: Segments = { ...segs, s: encodeShapeState(state) };
      return textResult(`${header(next, 'shape')}\n\n${shapeSummary(state)}`);
    }
  );

  /* ── Symbol ── */

  const SET_IDS = ICON_SETS.map(s => s.id);

  server.registerTool(
    'generate_icon_tokens',
    {
      title: 'Generate icon tokens',
      description: `Pick an icon set and generate icon sizing tokens (xs–2xl + stroke width). Either select a specific set or state style preferences and get a recommendation. Available sets: ${SET_IDS.join(', ')}. Returns a shareable standby.design/system URL and a summary. Always give that URL to the user — the link is the deliverable.`,
      inputSchema: {
        url: URL_PARAM,
        set: z.string().optional().describe(`Icon set variant id to select explicitly, e.g. "${SET_IDS[0]}". One of: ${SET_IDS.join(', ')}. Pass "auto" to clear the selection and use the recommendation instead.`),
        style: z.enum(['outlined', 'filled', 'duotone', 'auto']).optional().describe('Preferred icon style for the recommendation.'),
        weight: z.enum(['thin', 'regular', 'bold', 'auto']).optional().describe('Preferred stroke weight.'),
        corners: z.enum(['sharp', 'rounded', 'auto']).optional().describe('Preferred corner style (sharp = corporate/precise, rounded = friendly).'),
        baseSize: z.number().min(0.5).max(3).optional().describe('Base icon size (md) in rem (default 1.25).'),
        scale: z.number().min(1).max(2).optional().describe('Size scale ratio (default 1.272).'),
        snapTo4px: z.boolean().optional().describe('Round sizes to the 4px grid (default true).'),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const segs = parseInput(args.url);
      const state = symbolStateFrom(segs) ?? { ...DEFAULT_SYMBOL_STATE };

      if (args.set !== undefined) {
        if (args.set.toLowerCase() === 'auto') {
          state.selectedSet = null;
        } else if (!SET_IDS.includes(args.set)) {
          return errorResult(`Unknown icon set "${args.set}". Valid ids: ${SET_IDS.join(', ')} — or "auto" for the recommendation.`);
        } else {
          state.selectedSet = args.set;
        }
      }
      if (args.style !== undefined) state.preferredStyle = args.style;
      if (args.weight !== undefined) state.preferredWeight = args.weight;
      if (args.corners !== undefined) state.preferredCorners = args.corners;
      if (args.baseSize !== undefined) state.iconBaseSize = args.baseSize;
      if (args.scale !== undefined) state.iconScale = args.scale;
      if (args.snapTo4px !== undefined) state.snapTo4px = args.snapTo4px;

      const next: Segments = { ...segs, y: encodeSymbolState(state) };
      return textResult(`${header(next, 'symbol')}\n\n${symbolSummary(state)}`);
    }
  );

  /* ── Space ── */

  server.registerTool(
    'generate_space_tokens',
    {
      title: 'Generate spacing & layout tokens',
      description: 'Generate spacing tokens (3xs–3xl), breakpoints, container widths, prose measure, and aspect ratios. Returns a shareable standby.design/system URL and a summary. Always give that URL to the user — the link is the deliverable.',
      inputSchema: {
        url: URL_PARAM,
        mode: z.enum(['harmonic', 'geometric']).optional().describe('"harmonic": multiples of the base (default). "geometric": compound ratio steps.'),
        baseRem: z.number().min(0.25).max(4).optional().describe('Base spacing in rem (default 1.0).'),
        ratio: z.number().min(1).max(2).optional().describe('Ratio for geometric mode (default 1.272).'),
        multiplier: z.number().min(0.25).max(4).optional().describe('Uniform scale factor on all tokens (default 1.0).'),
        snap: z.boolean().optional().describe('Snap token values to a sensible grid (default true).'),
        breakpoints: z.array(z.object({
          name: z.string().min(1),
          minPx: z.number().int().min(0),
        })).optional().describe('Replace the breakpoint list, e.g. [{"name":"sm","minPx":640},...]. Defaults: sm 640, md 768, lg 1024, xl 1280, 2xl 1536.'),
        fluidMinVw: z.number().int().min(200).max(1000).optional().describe('Lower fluid viewport anchor in px (default 375).'),
        fluidMaxVw: z.number().int().min(1000).max(3840).optional().describe('Upper fluid viewport anchor in px (default 1920).'),
        containers: z.array(z.object({
          name: z.string().min(1),
          maxPx: z.number().int().min(0),
        })).optional().describe('Replace the container list. Defaults: prose 680, narrow 960, default 1200, wide 1440, full 1920.'),
        proseMaxCh: z.number().int().min(20).max(120).optional().describe('Prose measure in ch (default 65).'),
        aspectRatios: z.array(z.object({
          name: z.string().min(1),
          w: z.number().positive(),
          h: z.number().positive(),
        })).optional().describe('Replace the aspect ratio list, e.g. [{"name":"video","w":16,"h":9}].'),
        includeReciprocals: z.boolean().optional().describe('Also export flipped (portrait) variants of each ratio (default true).'),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const segs = parseInput(args.url);
      const state = spaceStateFrom(segs);

      if (args.mode !== undefined) state.spacingMode = args.mode;
      if (args.baseRem !== undefined) state.spacingBaseRem = args.baseRem;
      if (args.ratio !== undefined) state.spacingRatio = args.ratio;
      if (args.multiplier !== undefined) state.spacingMultiplier = args.multiplier;
      if (args.snap !== undefined) state.spacingSnap = args.snap;
      if (args.breakpoints !== undefined) state.breakpoints = args.breakpoints;
      if (args.fluidMinVw !== undefined) state.fluidMinVw = args.fluidMinVw;
      if (args.fluidMaxVw !== undefined) state.fluidMaxVw = args.fluidMaxVw;
      if (args.containers !== undefined) state.containers = args.containers;
      if (args.proseMaxCh !== undefined) state.proseMaxCh = args.proseMaxCh;
      if (args.aspectRatios !== undefined) state.aspectRatios = args.aspectRatios;
      if (args.includeReciprocals !== undefined) state.aspectIncludeReciprocals = args.includeReciprocals;

      const next: Segments = { ...segs, p: encodeSpaceState(state) };
      const spacing = buildSpacing(state);
      return textResult(`${header(next, 'space')}\n\n${spaceSummary(state, spacing)}`);
    }
  );
}
