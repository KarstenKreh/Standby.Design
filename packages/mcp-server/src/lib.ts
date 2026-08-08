/**
 * Shared plumbing for the standby.design MCP server:
 * URL/hash handling, per-tool default states, and the palette/scale/spacing
 * computations mirrored from system-react/src/App.tsx.
 */

import { parseUnifiedHash, buildUnifiedHash } from '@core/unified-hash';
import { decodeState as decodeColorState, type DecodedState as ColorState } from '@core/url-state/color';
import { decodeState as decodeTypeState, type UrlState as TypeState } from '@core/url-state/type';
import { decodeState as decodeShapeState, type ShapeUrlState as ShapeState } from '@core/url-state/shape';
import { decodeState as decodeSymbolState, type UrlState as SymbolState } from '@core/url-state/symbol';
import { decodeState as decodeSpaceState, DEFAULT_SPACE_URL_STATE, type SpaceUrlState } from '@core/url-state/space';
import {
  generatePalette, computeAutoErrorHex, computeAutoAccentHex,
  SUCCESS_HUE, WARNING_HUE, INFO_HUE,
  type PaletteEntry, type Step,
} from '@core/palette';
import { hexToOklch } from '@core/color-math';
import { customScale, traditionalScale, resolveMobileRatio, DEFAULT_TRADITIONAL, DEFAULT_TRADITIONAL_MOBILE, type ComputedLevel } from '@core/scale';
import { applyTypography } from '@core/typography';
import { computeSpacingTokens, type SpacingToken } from '@core/spacing';
import type { AccentPalette } from '@syslib/color-code-export';

export const BASE_URL = 'https://standby.design';

/* ── URL handling ── */

export interface Segments {
  c: string | null;
  t: string | null;
  s: string | null;
  y: string | null;
  p: string | null;
}

/** Accepts a full standby.design URL or a raw (unified) hash, returns segments. */
export function parseInput(input?: string): Segments {
  if (!input) return { c: null, t: null, s: null, y: null, p: null };
  let hash = input.trim();
  if (/^https?:\/\//i.test(hash)) {
    const idx = hash.indexOf('#');
    hash = idx === -1 ? '' : hash.slice(idx + 1);
  }
  hash = hash.replace(/^#/, '');
  return parseUnifiedHash(hash);
}

export function buildHash(segs: Segments): string {
  return buildUnifiedHash({
    c: segs.c ?? undefined,
    t: segs.t ?? undefined,
    s: segs.s ?? undefined,
    y: segs.y ?? undefined,
    p: segs.p ?? undefined,
  });
}

/** Mirrors handleShare in system-react: /system/ URL with OG query params. */
export function systemUrl(segs: Segments): string {
  const hash = buildHash(segs);
  const colorState = segs.c ? decodeColorState(segs.c) : null;
  const params = new URLSearchParams();
  const name = colorState?.themeName?.trim();
  if (name && name !== 'Standby.Design') params.set('t', name);
  const hex = colorState?.brandHex?.replace('#', '');
  if (hex && /^[0-9a-fA-F]{6}$/.test(hex)) params.set('c', hex);
  const query = params.toString() ? `?${params.toString()}` : '';
  return `${BASE_URL}/system/${query}#${hash}`;
}

export function toolUrl(tool: 'color' | 'type' | 'shape' | 'symbol' | 'space', segs: Segments): string {
  return `${BASE_URL}/${tool}#${buildHash(segs)}`;
}

export function normalizeHex(input: string): string | null {
  const hex = input.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return '#' + hex.toUpperCase();
}

/* ── Defaults (mirrored from the React apps) ── */

export const DEFAULT_COLOR_STATE: ColorState = {
  brandHex: '#335A7F',
  bgColorHex: '#335A7F',
  bgAutoMatch: true,
  errorColorHex: '#CC3333',
  errorAutoMatch: true,
  chromaScale: 0.25,
  currentMode: 'balanced',
  brandPin: false,
  brandInvert: false,
  errorPin: false,
  errorInvert: false,
  fgContrastMode: 'best',
  themeName: '',
  extraAccents: [
    { name: 'Success', hex: '#33994D', pin: false, invert: false, autoMatch: true, autoHue: SUCCESS_HUE },
    { name: 'Warning', hex: '#998033', pin: false, invert: false, autoMatch: true, autoHue: WARNING_HUE },
    { name: 'Info', hex: '#3355CC', pin: false, invert: false, autoMatch: true, autoHue: INFO_HUE },
  ],
};

export const DEFAULT_TYPE_HASH = 'custom,1,1.272,1.204,satoshi,satoshi,system-mono';

export function defaultTypeState(): TypeState {
  // The default hash always decodes successfully.
  return decodeTypeState(DEFAULT_TYPE_HASH)!;
}

export const DEFAULT_SHAPE_STATE: ShapeState = {
  shapeStyle: 'paper',
  shadowEnabled: true,
  shadowType: 'normal',
  shadowStrength: 1.0,
  shadowBlurScale: 1.0,
  shadowScale: 1.272,
  shadowColorMode: 'auto',
  shadowCustomColor: '#000000',
  borderEnabled: true,
  borderWidth: 1,
  borderColorMode: 'auto',
  borderCustomColor: '#000000',
  borderRadius: 8,
  glassDepth: 0.2,
  glassBlur: 1.0,
  glassDispersion: 0.4,
  ringWidth: 2,
  ringOffset: 2,
  ringColorMode: 'auto',
  ringCustomColor: '#000000',
  ringStyle: 'soft',
  separationMode: 'shadow',
  shadowOffsetX: 2,
  shadowOffsetY: 4,
  brutalistVariant: 'outlined',
};

export const DEFAULT_SYMBOL_STATE: SymbolState = {
  preferredStyle: 'auto',
  preferredWeight: 'auto',
  preferredCorners: 'auto',
  iconBaseSize: 1.25,
  iconScale: 1.272,
  snapTo4px: true,
  selectedSet: null,
};

export { DEFAULT_SPACE_URL_STATE };

/* ── Segment decoding with defaults ── */

export function colorStateFrom(segs: Segments): ColorState {
  return (segs.c ? decodeColorState(segs.c) : null) ?? DEFAULT_COLOR_STATE;
}

export function typeStateFrom(segs: Segments): TypeState {
  return (segs.t ? decodeTypeState(segs.t) : null) ?? defaultTypeState();
}

export function shapeStateFrom(segs: Segments): ShapeState {
  const decoded = segs.s ? decodeShapeState(segs.s) : null;
  return { ...DEFAULT_SHAPE_STATE, ...(decoded ?? {}) };
}

export function symbolStateFrom(segs: Segments): SymbolState | null {
  return segs.y ? decodeSymbolState(segs.y) : null;
}

export function spaceStateFrom(segs: Segments): SpaceUrlState {
  const decoded = segs.p ? decodeSpaceState(segs.p) : null;
  return { ...DEFAULT_SPACE_URL_STATE, ...(decoded ?? {}) };
}

/* ── Computation (mirrored from system-react/src/App.tsx) ── */

export interface PaletteResult {
  brand: PaletteEntry[];
  surface: PaletteEntry[];
  error: PaletteEntry[];
  errorSurface: PaletteEntry[];
  neutral: PaletteEntry[];
  neutralExtended: PaletteEntry[];
  accentPalettes: AccentPalette[];
  brandSwatchOverride: { hex: string; L: number } | null;
  errorSwatchOverride: { hex: string; L: number } | null;
  effectiveBgHex: string;
  effectiveErrorHex: string;
}

function accentCssName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'accent';
}

export function buildPalette(colorState: ColorState): PaletteResult {
  const { brandHex, bgColorHex, bgAutoMatch, errorColorHex, errorAutoMatch, chromaScale, currentMode, extraAccents, brandPin, errorPin } = colorState;

  const effectiveBgHex = bgAutoMatch ? brandHex : bgColorHex;
  const effectiveErrorHex = errorAutoMatch ? computeAutoErrorHex(brandHex) : errorColorHex;

  const brand = generatePalette(brandHex, 1.0, currentMode);
  const surface = generatePalette(effectiveBgHex, chromaScale, currentMode);
  const error = generatePalette(effectiveErrorHex, 1.0, currentMode);
  const errorSurface = generatePalette(effectiveErrorHex, chromaScale, currentMode);
  const neutral = generatePalette(effectiveBgHex, 0.0, currentMode);

  const accentPalettes: AccentPalette[] = (extraAccents || [])
    .filter(a => a.autoMatch || /^#[0-9a-fA-F]{6}$/.test(a.hex))
    .map(a => {
      const effectiveHex = a.autoMatch ? computeAutoAccentHex(brandHex, a.autoHue) : a.hex;
      return {
        name: a.name,
        hex: effectiveHex,
        cssName: accentCssName(a.name),
        palette: generatePalette(effectiveHex, 1.0, currentMode),
        slatedPalette: generatePalette(effectiveHex, chromaScale, currentMode),
        pin: a.pin,
        invert: a.invert,
      };
    });

  const brandSwatchOverride = brandPin ? { hex: brandHex, L: hexToOklch(brandHex)[0] } : null;
  const errorSwatchOverride = errorPin ? { hex: effectiveErrorHex, L: hexToOklch(effectiveErrorHex)[0] } : null;

  const neutralExtended: PaletteEntry[] = [
    { step: 0 as PaletteEntry['step'], L: 1, C: 0, H: 0, hex: '#FFFFFF', css: 'oklch(1 0 0)' },
    ...neutral,
    { step: 1000 as PaletteEntry['step'], L: 0, C: 0, H: 0, hex: '#000000', css: 'oklch(0 0 0)' },
  ];

  return { brand, surface, error, errorSurface, neutral, neutralExtended, accentPalettes, brandSwatchOverride, errorSwatchOverride, effectiveBgHex, effectiveErrorHex };
}

export function buildScale(typeState: TypeState): ComputedLevel[] {
  let s: ComputedLevel[];
  if (typeState.scaleMode === 'traditional') {
    const desktop = typeState.traditionalAssignments ?? DEFAULT_TRADITIONAL;
    const mobile = typeState.traditionalMobileAssignments ?? DEFAULT_TRADITIONAL_MOBILE;
    s = traditionalScale(desktop, mobile);
  } else {
    const effectiveMobileRatio = resolveMobileRatio(
      typeState.mobileRatioMode,
      typeState.customRatio,
      typeState.autoShrink,
      typeState.mobileRatio,
    );
    s = customScale(typeState.baseSize, typeState.customRatio, effectiveMobileRatio, typeState.mobileBaseSize ?? typeState.baseSize);
  }
  return applyTypography(s, typeState.lineHeightOverrides ?? {}, typeState.letterSpacingOverrides ?? {});
}

export function buildSpacing(spaceState: SpaceUrlState): SpacingToken[] {
  return computeSpacingTokens({
    baseRem: spaceState.spacingBaseRem,
    ratio: spaceState.spacingRatio,
    mode: spaceState.spacingMode,
    multiplier: spaceState.spacingMultiplier,
    snap: spaceState.spacingSnap,
  });
}

export function stepHex(entries: PaletteEntry[], step: Step | number): string {
  return entries.find(e => e.step === step)?.hex ?? '';
}

/** Standard MCP text result. */
export function textResult(text: string) {
  return { content: [{ type: 'text' as const, text }] };
}

export function errorResult(text: string) {
  return { content: [{ type: 'text' as const, text }], isError: true };
}
