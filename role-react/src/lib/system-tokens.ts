import { parseUnifiedHash, isUnifiedHash } from '@core/unified-hash';
import { decodeState as decodeColorState, type DecodedState as ColorState } from '@core/url-state/color';
import { decodeState as decodeShapeState, type ShapeUrlState as ShapeState, type RingStyle } from '@core/url-state/shape';
import { generatePalette, computeAutoErrorHex, type PaletteEntry, type Step } from '@core/palette';
import { contrastRatio } from '@core/color-math';
import { stateLadder, stepLadder, type Ladder, type StateToken } from '@core/state-ladder';

export type { Ladder, StateToken };

export interface Segments {
  c: string | null;
  t: string | null;
  s: string | null;
  y: string | null;
  p: string | null;
}

export interface RoleTheme {
  themeName: string;
  isDark: boolean;
  bg: string;
  card: string;
  elevated: string;
  fg: string;
  muted: string;
  border: string;
  radius: number;
  borderW: number;
  ringWidth: number;
  ringOffset: number;
  ringColor: string;
  ringStyle: RingStyle;
  brand: Ladder & { fg: string };
  track: Ladder;
  navRow: Ladder;
  navCurrent: Ladder;
  navMarker: StateToken;
  field: { rest: Ladder; focusBorder: StateToken; invalid: StateToken };
}

const DEFAULT_BRAND = '#335A7F';

function entryHex(pal: PaletteEntry[], step: Step): string {
  return pal.find(e => e.step === step)?.hex ?? '#888888';
}

function borderLadder(surface: PaletteEntry[], step: Step, isDark: boolean): Ladder {
  const strongerStep: Step = isDark ? 500 : 400;
  const token = (s: Step): StateToken => ({ hex: entryHex(surface, s), label: `surface · ${s}`, step: s });
  return { rest: token(step), hover: token(strongerStep), pressed: token(strongerStep), reversed: false };
}

function pickFg(bgHex: string, a: string, b: string): string {
  return contrastRatio(a, bgHex) >= contrastRatio(b, bgHex) ? a : b;
}

export function readSegments(rawHash: string): Segments {
  const raw = rawHash.replace(/^#/, '');
  const isLegacyColorOnlyHash = raw !== '' && !isUnifiedHash(raw);
  if (isLegacyColorOnlyHash) return { c: raw, t: null, s: null, y: null, p: null };
  return parseUnifiedHash(raw);
}

export function buildRoleTheme(segments: Segments, isDark = true): RoleTheme {
  const colorState: ColorState | null = segments.c ? decodeColorState(segments.c) : null;
  const shapeState: Partial<ShapeState> = (segments.s ? decodeShapeState(segments.s) : null) ?? {};

  const brandHex = colorState?.brandHex ?? DEFAULT_BRAND;
  const bgHex = colorState ? (colorState.bgAutoMatch ? colorState.brandHex : colorState.bgColorHex) : DEFAULT_BRAND;
  const errorHex = colorState
    ? (colorState.errorAutoMatch ? computeAutoErrorHex(colorState.brandHex) : colorState.errorColorHex)
    : computeAutoErrorHex(DEFAULT_BRAND);
  const chromaScale = colorState?.chromaScale ?? 0.25;
  const mode = colorState?.currentMode ?? 'balanced';

  const brand = generatePalette(brandHex, 1.0, mode);
  const surface = generatePalette(bgHex, chromaScale, mode);
  const error = generatePalette(errorHex, 1.0, mode);

  const brandStep: Step = isDark ? 400 : 600;
  const errorStep: Step = isDark ? 400 : 600;
  const trackStep: Step = isDark ? 700 : 300;
  const fieldStep: Step = isDark ? 700 : 300;
  const navRowStep: Step = isDark ? 825 : 25;
  const navCurrentStep: Step = isDark ? 800 : 100;

  const pinnedBrand = colorState?.brandPin ? brandHex : null;
  const brandLadder = stateLadder(brand, 'brand', brandStep, pinnedBrand);
  const errorRest = colorState?.errorPin ? errorHex : entryHex(error, errorStep);

  return {
    themeName: colorState?.themeName ?? '',
    isDark,
    bg: entryHex(surface, isDark ? 875 : 50),
    card: entryHex(surface, isDark ? 825 : 25),
    elevated: entryHex(surface, isDark ? 800 : 0),
    fg: entryHex(surface, isDark ? 25 : 975),
    muted: entryHex(surface, isDark ? 300 : 700),
    border: entryHex(surface, isDark ? 700 : 300),
    radius: shapeState.borderRadius ?? 8,
    borderW: (shapeState.borderEnabled ?? true) ? (shapeState.borderWidth ?? 1) : 0,
    ringWidth: shapeState.ringWidth ?? 2,
    ringOffset: shapeState.ringOffset ?? 2,
    ringColor: brandLadder.rest.hex,
    ringStyle: shapeState.ringStyle ?? 'soft',
    brand: {
      ...brandLadder,
      fg: pickFg(brandLadder.rest.hex, entryHex(surface, 975), entryHex(surface, 25)),
    },
    track: stepLadder(surface, 'surface', trackStep),
    navRow: stepLadder(surface, 'surface', navRowStep),
    navCurrent: stepLadder(brand, 'brand', navCurrentStep),
    navMarker: brandLadder.rest,
    field: {
      rest: borderLadder(surface, fieldStep, isDark),
      focusBorder: brandLadder.rest,
      invalid: { hex: errorRest, label: colorState?.errorPin ? 'pinned error' : `error · ${errorStep}`, step: colorState?.errorPin ? null : errorStep },
    },
  };
}
