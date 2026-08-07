import { parseUnifiedHash, isUnifiedHash } from '@core/unified-hash';
import { decodeState as decodeColorState, type DecodedState as ColorState } from '@core/url-state/color';
import { decodeState as decodeShapeState, type ShapeUrlState as ShapeState } from '@core/url-state/shape';
import { generatePalette, computeAutoErrorHex, STEPS, L_WHITE, L_BLACK, type PaletteEntry, type Step } from '@core/palette';
import { contrastRatio, hexToOklch, oklchToHex, maxChromaInGamut } from '@core/color-math';

export interface Segments {
  c: string | null;
  t: string | null;
  s: string | null;
  y: string | null;
  p: string | null;
}

export interface StateToken {
  hex: string;
  label: string;
}

export interface Ladder {
  rest: StateToken;
  hover: StateToken;
  pressed: StateToken;
  reversed: boolean;
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
  brand: Ladder & { fg: string };
  track: Ladder;
  navRow: Ladder;
  navCurrent: Ladder;
  navMarker: StateToken;
  field: { rest: Ladder; focusBorder: StateToken; invalid: StateToken };
}

const DEFAULT_BRAND = '#335A7F';

const HOVER_RUNG_IN_STEP_NUMBERS = 100;
const PRESSED_RUNG_IN_STEP_NUMBERS = 200;

type Direction = -1 | 1;

function entryHex(pal: PaletteEntry[], step: Step): string {
  return pal.find(e => e.step === step)?.hex ?? '#888888';
}

function snapToStep(target: number): Step {
  return STEPS.reduce((best, s) => Math.abs(s - target) < Math.abs(best - target) ? s : best, STEPS[0]);
}

function rungsFrom(step: Step, dir: Direction): { hover: Step; pressed: Step } {
  return {
    hover: snapToStep(step + dir * HOVER_RUNG_IN_STEP_NUMBERS),
    pressed: snapToStep(step + dir * PRESSED_RUNG_IN_STEP_NUMBERS),
  };
}

function stepLadder(pal: PaletteEntry[], name: string, step: Step, isDark: boolean): Ladder {
  const preferred: Direction = isDark ? -1 : 1;
  let dir = preferred;
  let rungs = rungsFrom(step, dir);
  if (rungs.hover === step || rungs.pressed === rungs.hover) {
    dir = -preferred as Direction;
    rungs = rungsFrom(step, dir);
  }
  const token = (s: Step): StateToken => ({ hex: entryHex(pal, s), label: `${name} · ${s}` });
  return {
    rest: token(step),
    hover: token(rungs.hover),
    pressed: token(rungs.pressed),
    reversed: dir !== preferred,
  };
}

function rungDeltaInLightness(pal: PaletteEntry[]): number {
  const a = pal.find(e => e.step === 400);
  const b = pal.find(e => e.step === 500);
  return a && b ? Math.abs(a.L - b.L) : 0.096;
}

function pinnedLadder(hex: string, pal: PaletteEntry[], isDark: boolean): Ladder {
  const [L, C, H] = hexToOklch(hex);
  const delta = rungDeltaInLightness(pal);
  const preferred = isDark ? 1 : -1;
  const room = preferred === 1 ? L_WHITE - L : L - L_BLACK;
  const dir = room >= delta * 2 ? preferred : -preferred;

  const at = (offset: number): StateToken => {
    if (offset === 0) return { hex, label: 'pinned' };
    const nextL = Math.min(L_WHITE, Math.max(L_BLACK, L + dir * delta * offset));
    const nextC = Math.min(C, maxChromaInGamut(nextL, H));
    const sign = dir > 0 ? '+' : '−';
    return { hex: oklchToHex(nextL, nextC, H), label: `pinned · L ${sign}${(delta * offset).toFixed(2)}` };
  };

  return { rest: at(0), hover: at(1), pressed: at(2), reversed: dir !== preferred };
}

function ladderFor(
  pal: PaletteEntry[], name: string, step: Step, isDark: boolean,
  pinnedHex: string | null,
): Ladder {
  return pinnedHex ? pinnedLadder(pinnedHex, pal, isDark) : stepLadder(pal, name, step, isDark);
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
  const brandLadder = ladderFor(brand, 'brand', brandStep, isDark, pinnedBrand);
  const errorRest = colorState?.errorPin ? errorHex : entryHex(error, errorStep);

  return {
    themeName: colorState?.themeName ?? '',
    isDark,
    bg: entryHex(surface, isDark ? 875 : 50),
    card: entryHex(surface, isDark ? 825 : 25),
    elevated: entryHex(surface, isDark ? 800 : 25),
    fg: entryHex(surface, isDark ? 25 : 975),
    muted: entryHex(surface, isDark ? 300 : 700),
    border: entryHex(surface, isDark ? 700 : 300),
    radius: shapeState.borderRadius ?? 8,
    borderW: (shapeState.borderEnabled ?? true) ? (shapeState.borderWidth ?? 1) : 0,
    ringWidth: shapeState.ringWidth ?? 2,
    ringOffset: shapeState.ringOffset ?? 2,
    ringColor: brandLadder.rest.hex,
    brand: {
      ...brandLadder,
      fg: pickFg(brandLadder.rest.hex, entryHex(surface, 975), entryHex(surface, 25)),
    },
    track: stepLadder(surface, 'surface', trackStep, isDark),
    navRow: stepLadder(surface, 'surface', navRowStep, isDark),
    navCurrent: stepLadder(brand, 'brand', navCurrentStep, isDark),
    navMarker: brandLadder.rest,
    field: {
      rest: stepLadder(surface, 'surface', fieldStep, isDark),
      focusBorder: brandLadder.rest,
      invalid: { hex: errorRest, label: colorState?.errorPin ? 'pinned error' : `error · ${errorStep}` },
    },
  };
}
