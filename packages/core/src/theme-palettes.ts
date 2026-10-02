import { generatePalette, computeAutoErrorHex, computeAutoAccentHex, resolveAccentHues, type PaletteEntry } from './palette';
import { hexToOklch } from './color-math';
import type { DecodedState as ColorState } from './url-state/color';

export interface AccentPalette {
  name: string;
  hex: string;
  cssName: string;
  palette: PaletteEntry[];
  slatedPalette: PaletteEntry[];
  pin: boolean;
  invert: boolean;
}

export interface SwatchOverride {
  hex: string;
  L: number;
}

export interface ThemePalettes {
  brand: PaletteEntry[];
  surface: PaletteEntry[];
  error: PaletteEntry[];
  errorSurface: PaletteEntry[];
  neutral: PaletteEntry[];
  neutralExtended: PaletteEntry[];
  accentPalettes: AccentPalette[];
  brandSwatchOverride: SwatchOverride | null;
  errorSwatchOverride: SwatchOverride | null;
  effectiveBgHex: string;
  effectiveErrorHex: string;
}

const HEX6 = /^#[0-9a-fA-F]{6}$/;

export function accentCssName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'accent';
}

function pinnedSwatch(pin: boolean, hex: string): SwatchOverride | null {
  return pin ? { hex, L: hexToOklch(hex)[0] } : null;
}

function extendNeutral(neutral: PaletteEntry[]): PaletteEntry[] {
  return [
    { step: 0 as PaletteEntry['step'], L: 1, C: 0, H: 0, hex: '#FFFFFF', css: 'oklch(1 0 0)' },
    ...neutral.filter(e => (e.step as number) !== 0),
    { step: 1000 as PaletteEntry['step'], L: 0, C: 0, H: 0, hex: '#000000', css: 'oklch(0 0 0)' },
  ];
}

export function buildThemePalettes(state: ColorState): ThemePalettes {
  const { brandHex, bgColorHex, bgAutoMatch, errorColorHex, errorAutoMatch, chromaScale, currentMode, extraAccents, brandPin, errorPin } = state;

  const effectiveBgHex = bgAutoMatch ? brandHex : bgColorHex;
  const effectiveErrorHex = errorAutoMatch ? computeAutoErrorHex(brandHex) : errorColorHex;

  const neutral = generatePalette(effectiveBgHex, 0.0, currentMode);
  const spreadHues = resolveAccentHues(hexToOklch(brandHex)[2], extraAccents.map(a => a.name));

  const accentPalettes: AccentPalette[] = extraAccents
    .map((a, i) => ({ a, autoHue: spreadHues[i] ?? a.autoHue }))
    .filter(({ a }) => a.autoMatch || HEX6.test(a.hex))
    .map(({ a, autoHue }) => {
      const hex = a.autoMatch ? computeAutoAccentHex(brandHex, autoHue) : a.hex;
      return {
        name: a.name,
        hex,
        cssName: accentCssName(a.name),
        palette: generatePalette(hex, 1.0, currentMode),
        slatedPalette: generatePalette(hex, chromaScale, currentMode),
        pin: a.pin,
        invert: a.invert,
      };
    });

  return {
    brand: generatePalette(brandHex, 1.0, currentMode),
    surface: generatePalette(effectiveBgHex, chromaScale, currentMode),
    error: generatePalette(effectiveErrorHex, 1.0, currentMode),
    errorSurface: generatePalette(effectiveErrorHex, chromaScale, currentMode),
    neutral,
    neutralExtended: extendNeutral(neutral),
    accentPalettes,
    brandSwatchOverride: pinnedSwatch(brandPin, brandHex),
    errorSwatchOverride: pinnedSwatch(errorPin, effectiveErrorHex),
    effectiveBgHex,
    effectiveErrorHex,
  };
}
