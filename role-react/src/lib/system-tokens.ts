import type { Segments } from '@core/unified-hash';
import { decodeState as decodeColorState, DEFAULT_COLOR_STATE } from '@core/url-state/color';
import { decodeShapeOrDefault, type RingStyle } from '@core/url-state/shape';
import { buildThemePalettes } from '@core/theme-palettes';
import type { PaletteEntry, Step } from '@core/palette';
import { contrastRatio } from '@core/color-math';
import { stateLadder, stepLadder, type Ladder, type StateToken } from '@core/state-ladder';

export type { Ladder, StateToken };

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

export function buildRoleTheme(segments: Segments, isDark = true): RoleTheme {
  const decodedColor = segments.c ? decodeColorState(segments.c) : null;
  const color = decodedColor ?? DEFAULT_COLOR_STATE;
  const shapeState = decodeShapeOrDefault(segments.s);
  const { brand, surface, error, effectiveErrorHex: errorHex } = buildThemePalettes(color);
  const brandHex = color.brandHex;

  const brandStep: Step = isDark ? 400 : 600;
  const errorStep: Step = isDark ? 400 : 600;
  const trackStep: Step = isDark ? 700 : 300;
  const fieldStep: Step = isDark ? 700 : 300;
  const navRowStep: Step = isDark ? 825 : 25;
  const navCurrentStep: Step = isDark ? 800 : 100;

  const pinnedBrand = color.brandPin ? brandHex : null;
  const brandLadder = stateLadder(brand, 'brand', brandStep, pinnedBrand);
  const errorRest = color.errorPin ? errorHex : entryHex(error, errorStep);

  return {
    themeName: decodedColor?.themeName ?? '',
    isDark,
    bg: entryHex(surface, isDark ? 875 : 50),
    card: entryHex(surface, isDark ? 825 : 25),
    elevated: entryHex(surface, isDark ? 800 : 0),
    fg: entryHex(surface, isDark ? 25 : 975),
    muted: entryHex(surface, isDark ? 300 : 700),
    border: entryHex(surface, isDark ? 700 : 300),
    radius: shapeState.borderRadius,
    borderW: shapeState.borderEnabled ? shapeState.borderWidth : 0,
    ringWidth: shapeState.ringWidth,
    ringOffset: shapeState.ringOffset,
    ringColor: brandLadder.rest.hex,
    ringStyle: shapeState.ringStyle,
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
      invalid: { hex: errorRest, label: color.errorPin ? 'pinned error' : `error · ${errorStep}`, step: color.errorPin ? null : errorStep },
    },
  };
}
