// Semantic surface-color derivation from a brand hex using the palette engine.
// Shared between shape-react, system-react, color-react for coherent previews.

import type { PaletteEntry, Step } from './palette';
import { contrastRatio, invertHex } from './color-math';
import { fillForegroundHex } from './color-code-export';
import type { ThemePalettes } from './theme-palettes';
import type { DecodedState as ColorState } from './url-state/color';
import type { ShapeStyle } from './url-state/shape';

export interface SurfaceColors {
  bg: string;
  card: string;
  /** Always a visibly distinct surface step — unlike `card`, never collapses in neomorph. */
  raised: string;
  elevated: string;
  muted: string;
  secondary: string;
  secondaryFg: string;
  destructive: string;
  destructiveFg: string;
  border: string;
  borderMuted: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryFg: string;
  ring: string;
}

/** Look up a step in a palette by step number. */
function step(palette: PaletteEntry[], s: Step): string {
  return palette.find(e => e.step === s)!.hex;
}

/** Pick foreground from palette — compare actual step contrasts, return whichever wins.
 *  (Previously used hypothetical pure-white/dark, which could pick a step that underperforms.) */
export function pickFgFromPalette(bgHex: string, palette: PaletteEntry[], lightStep: Step, darkStep: Step): string {
  const lightHex = step(palette, lightStep);
  const darkHex = step(palette, darkStep);
  return contrastRatio(lightHex, bgHex) >= contrastRatio(darkHex, bgHex) ? lightHex : darkHex;
}

function pinnedFill(pin: boolean, hex: string, invert: boolean, isDark: boolean): string | null {
  if (!pin) return null;
  return isDark && invert ? invertHex(hex) : hex;
}

/**
 * Derive semantic preview colors from a brand hex.
 * When style === 'neomorph', bg/card/elevated/muted collapse to a single monochromatic
 * surface so dual neumorphic shadows carry the depth instead of color contrast.
 */
export function deriveSurface(
  color: ColorState,
  pal: ThemePalettes,
  isDark: boolean,
  style: ShapeStyle = 'paper',
): SurfaceColors {
  const { brand, surface, error, errorSurface } = pal;
  const isNeomorph = style === 'neomorph';
  const fillStep: Step = isDark ? 400 : 600;

  const primary = pinnedFill(color.brandPin, color.brandHex, color.brandInvert, isDark) ?? step(brand, fillStep);
  const destructive = pinnedFill(color.errorPin, pal.effectiveErrorHex, color.errorInvert, isDark) ?? step(error, fillStep);
  const secondary = step(brand, isDark ? 800 : 200);

  const shared = {
    secondary,
    secondaryFg: pickFgFromPalette(secondary, brand, 100, 900),
    destructive,
    destructiveFg: fillForegroundHex(destructive, errorSurface, color.fgContrastMode),
    primary,
    primaryFg: fillForegroundHex(primary, brand, color.fgContrastMode),
    ring: primary,
  };

  if (isDark) {
    const monoBg = step(surface, 875);
    return {
      ...shared,
      bg: monoBg,
      card: isNeomorph ? monoBg : step(surface, 825),
      raised: step(surface, 825),
      elevated: isNeomorph ? monoBg : step(surface, 800),
      muted: isNeomorph ? monoBg : step(surface, 850),
      border: step(surface, 600),
      borderMuted: step(surface, 700),
      text: step(surface, 25),
      textMuted: step(surface, 300),
    };
  }

  const monoBg = step(surface, 75);
  return {
    ...shared,
    bg: isNeomorph ? monoBg : step(surface, 50),
    card: isNeomorph ? monoBg : step(surface, 25),
    raised: step(surface, 25),
    elevated: isNeomorph ? monoBg : step(surface, 0),
    muted: isNeomorph ? monoBg : step(surface, 75),
    border: step(surface, 300),
    borderMuted: step(surface, 200),
    text: step(surface, 975),
    textMuted: step(surface, 700),
  };
}
