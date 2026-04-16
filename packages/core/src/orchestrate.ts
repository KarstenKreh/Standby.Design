// Pure orchestration: given decoded tool state, build derived collections
// (palettes, scale, spacing) that the UI and export consumers share.
// Single source of truth — replaces duplicated logic previously inlined in
// color-react/hooks/use-palette.ts and system-react/App.tsx.

import {
  generatePalette,
  computeAutoErrorHex,
  computeAutoAccentHex,
  type PaletteEntry,
  type PaletteMode,
} from './palette';
import { hexToOklch } from './color-math';
import {
  customScale,
  traditionalScale,
  type ComputedLevel,
  type TypeLevel,
} from './scale';
import { applyTypography } from './typography';
import { computeSpacingTokens, type SpacingToken, type SpacingConfig } from './spacing';
import type { DecodedState as DecodedColorState } from './url-state/color';
import type { UrlState as DecodedTypeState } from './url-state/type';

export interface AccentPalette {
  name: string;
  hex: string;
  cssName: string;
  palette: PaletteEntry[];
  slatedPalette: PaletteEntry[];
  pin: boolean;
  invert: boolean;
}

export interface PaletteSet {
  brand: PaletteEntry[];
  surface: PaletteEntry[];
  error: PaletteEntry[];
  errorSurface: PaletteEntry[];
  neutral: PaletteEntry[];
  neutralExtended: PaletteEntry[];
  slated: PaletteEntry[];
  accentPalettes: AccentPalette[];
  brandSwatchOverride: { hex: string; L: number } | null;
  errorSwatchOverride: { hex: string; L: number } | null;
  effectiveBgHex: string;
  effectiveErrorHex: string;
}

export function accentCssName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'accent';
}

/**
 * Canonical palette-set builder. Accepts the decoded color URL state (the same
 * shape used by the color-react Zustand store and system-react useState) and
 * returns every derived palette plus computed metadata.
 */
export function buildPaletteSet(state: DecodedColorState): PaletteSet {
  const {
    brandHex,
    bgColorHex,
    bgAutoMatch,
    errorColorHex,
    errorAutoMatch,
    chromaScale,
    currentMode,
    extraAccents,
    brandPin,
    errorPin,
  } = state;

  const effectiveBgHex = bgAutoMatch ? brandHex : bgColorHex;
  const effectiveErrorHex = errorAutoMatch ? computeAutoErrorHex(brandHex) : errorColorHex;

  const brand = generatePalette(brandHex, 1.0, currentMode);
  const surface = generatePalette(effectiveBgHex, chromaScale, currentMode);
  const error = generatePalette(effectiveErrorHex, 1.0, currentMode);
  const errorSurface = generatePalette(effectiveErrorHex, chromaScale, currentMode);
  const neutral = generatePalette(effectiveBgHex, 0.0, currentMode);
  const slated = generatePalette(effectiveBgHex, chromaScale, currentMode);

  const accentPalettes: AccentPalette[] = (extraAccents || [])
    .filter((a) => a.autoMatch || /^#[0-9a-fA-F]{6}$/.test(a.hex))
    .map((a) => {
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

  const brandSwatchOverride = brandPin
    ? { hex: brandHex, L: hexToOklch(brandHex)[0] }
    : null;
  const errorSwatchOverride = errorPin
    ? { hex: effectiveErrorHex, L: hexToOklch(effectiveErrorHex)[0] }
    : null;

  const neutralExtended: PaletteEntry[] = [
    { step: 0 as PaletteEntry['step'], L: 1, C: 0, H: 0, hex: '#FFFFFF', css: 'oklch(1 0 0)' },
    ...neutral,
    { step: 1000 as PaletteEntry['step'], L: 0, C: 0, H: 0, hex: '#000000', css: 'oklch(0 0 0)' },
  ];

  return {
    brand,
    surface,
    error,
    errorSurface,
    neutral,
    neutralExtended,
    slated,
    accentPalettes,
    brandSwatchOverride,
    errorSwatchOverride,
    effectiveBgHex,
    effectiveErrorHex,
  };
}

/**
 * Canonical type-scale builder. Accepts the decoded type URL state (same shape
 * as the type-react Zustand store and system-react useState). Applies any
 * line-height / letter-spacing overrides.
 */
export function buildScale(state: DecodedTypeState): ComputedLevel[] {
  let levels: ComputedLevel[];
  if (state.scaleMode === 'traditional' && state.traditionalAssignments) {
    const mobileAssignments = state.traditionalMobileAssignments ?? state.traditionalAssignments;
    levels = traditionalScale(state.traditionalAssignments, mobileAssignments);
  } else {
    levels = customScale(
      state.baseSize,
      state.customRatio,
      state.mobileRatio,
      state.mobileBaseSize ?? state.baseSize,
    );
  }
  return applyTypography(
    levels,
    state.lineHeightOverrides ?? {},
    state.letterSpacingOverrides ?? {},
  );
}

/** Thin wrapper for symmetry with buildPaletteSet / buildScale. */
export function buildSpacing(input: SpacingConfig): SpacingToken[] {
  return computeSpacingTokens(input);
}

export interface BuildSystemInput {
  color: DecodedColorState;
  type: DecodedTypeState;
  spacing?: SpacingConfig;
}

export interface DesignSystemResult {
  paletteSet: PaletteSet;
  scale: ComputedLevel[];
  spacing: SpacingToken[];
}

/**
 * Compose color + type + spacing into one merged system. Spacing defaults to a
 * √φ harmonic scale if omitted (matches system-react / space-react defaults).
 */
export function buildSystem(input: BuildSystemInput): DesignSystemResult {
  const paletteSet = buildPaletteSet(input.color);
  const scale = buildScale(input.type);
  const spacing = buildSpacing(
    input.spacing ?? { baseRem: 1, ratio: 1.272, mode: 'harmonic', multiplier: 1, snap: true },
  );
  return { paletteSet, scale, spacing };
}

// Re-export common types so consumers can import everything from one place.
export type { PaletteEntry, PaletteMode, ComputedLevel, TypeLevel, SpacingToken, SpacingConfig };
