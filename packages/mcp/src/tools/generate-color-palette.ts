import { buildPaletteSet } from '@core/orchestrate';
import { SUCCESS_HUE, WARNING_HUE, INFO_HUE } from '@core/palette';
import { generateColorBriefing } from '@core/exports/color-briefing';
import type { DecodedState as DecodedColorState } from '@core/url-state/color';
import { emitColorCss } from '../exports/css-emitter.js';
import { colorPreviewUrl } from '../preview-url.js';
import type { ColorInput } from '../schemas/color-input.js';

export function runGenerateColorPalette(input: ColorInput) {
  // Construct the full color state the engine expects. Accents are left empty
  // for v0 — LLMs that need Success/Warning/Info can compose them separately.
  const state: DecodedColorState = {
    brandHex: input.brandHex,
    bgColorHex: input.brandHex,
    bgAutoMatch: true,
    errorColorHex: input.errorHex ?? '#CC3333',
    errorAutoMatch: !input.errorHex,
    chromaScale: input.chromaScale,
    currentMode: input.mode,
    brandPin: false,
    brandInvert: false,
    errorPin: false,
    errorInvert: false,
    fgContrastMode: input.fgContrastMode,
    themeName: input.themeName,
    extraAccents: [],
  };
  // Suppress unused-import warnings for hue constants (they document intent;
  // callers may reference them when constructing accents themselves).
  void SUCCESS_HUE; void WARNING_HUE; void INFO_HUE;

  const paletteSet = buildPaletteSet(state);

  const briefing = generateColorBriefing({
    brandHex: input.brandHex,
    effectiveBgHex: paletteSet.effectiveBgHex,
    effectiveErrorHex: paletteSet.effectiveErrorHex,
    accentPalettes: paletteSet.accentPalettes,
    chromaScale: input.chromaScale,
    mode: input.mode,
    brandPin: false,
    errorPin: false,
    themeName: input.themeName,
    fgContrastMode: input.fgContrastMode,
  });

  const cssExport = emitColorCss({
    paletteSet,
    chromaScale: input.chromaScale,
    themeName: input.themeName,
  });

  const previewUrl = colorPreviewUrl(state);

  const structured = {
    palettes: {
      brand: paletteSet.brand,
      surface: paletteSet.surface,
      error: paletteSet.error,
      errorSurface: paletteSet.errorSurface,
      neutral: paletteSet.neutral,
    },
    effectiveBgHex: paletteSet.effectiveBgHex,
    effectiveErrorHex: paletteSet.effectiveErrorHex,
    cssExport,
    previewUrl,
  };

  // Append preview-link footer to the briefing so Claude surfaces it inline.
  const briefingWithLink = `${briefing}\n---\n\n**Continue tweaking in the browser:** [${previewUrl}](${previewUrl})\n`;

  return { briefing: briefingWithLink, structured };
}
