import { buildPaletteSet, buildScale } from '@core/orchestrate';
import { computeSpacingTokens } from '@core/spacing';
import { generateSystemBriefing } from '@core/exports/system-briefing';
import type { DecodedState as DecodedColorState } from '@core/url-state/color';
import type { UrlState as DecodedTypeState } from '@core/url-state/type';
import { emitColorCss, emitTypeCss, emitTypeTailwind } from '../exports/css-emitter.js';
import { systemPreviewUrl } from '../preview-url.js';
import type { SystemInput } from '../schemas/system-input.js';

function scaleLabelFor(mode: 'golden' | 'traditional' | 'custom', ratio: number): string {
  if (mode === 'golden') return '√φ Golden Ratio (area-based) — standby.design/type';
  if (mode === 'traditional') return 'Traditional Scale — standby.design/type';
  if (Math.abs(ratio - 1.272) < 0.001) return 'Custom Ratio (√φ ≈ 1.272) — standby.design/type';
  return `Custom Ratio (${ratio}) — standby.design/type`;
}

export function runGenerateDesignSystem(input: SystemInput) {
  const colorState: DecodedColorState = {
    brandHex: input.brandHex,
    bgColorHex: input.brandHex,
    bgAutoMatch: true,
    errorColorHex: input.errorHex ?? '#CC3333',
    errorAutoMatch: !input.errorHex,
    chromaScale: input.chromaScale,
    currentMode: input.colorMode,
    brandPin: false,
    brandInvert: false,
    errorPin: false,
    errorInvert: false,
    fgContrastMode: input.fgContrastMode,
    themeName: input.themeName,
    extraAccents: [],
  };

  const typeState: DecodedTypeState = {
    scaleMode: input.typeMode,
    baseSize: input.typeBaseSize,
    customRatio: input.typeRatio,
    // Default 25% autoShrink → fluid scale between mobile/desktop.
    mobileRatio: 1 + (input.typeRatio - 1) * 0.75,
    headingFont: input.headingFont,
    bodyFont: input.bodyFont,
    monoFont: input.monoFont,
    headingWeight: 500,
    mobileBaseSize: input.typeBaseSize,
    mobileRatioMode: 'auto',
    autoShrink: 25,
    lineHeightOverrides: {},
    letterSpacingOverrides: {},
  };

  const paletteSet = buildPaletteSet(colorState);
  const levels = buildScale(typeState);
  const spacingTokens = computeSpacingTokens({
    baseRem: input.spacingBase,
    ratio: input.spacingRatio,
    mode: input.spacingMode,
    multiplier: 1,
    snap: input.spacingSnap,
  });

  const colorCss = emitColorCss({
    paletteSet,
    chromaScale: input.chromaScale,
    themeName: input.themeName,
  });
  const typeEmitInput = {
    levels,
    spacingTokens,
    headingFont: input.headingFont,
    bodyFont: input.bodyFont,
    monoFont: input.monoFont,
    scaleLabel: scaleLabelFor(input.typeMode, input.typeRatio),
  };
  const typeCss = emitTypeCss(typeEmitInput);
  const typeTailwind = emitTypeTailwind(typeEmitInput);

  const cssExport = `${colorCss}\n${typeCss}`;
  const tailwindExport = `${colorCss}\n${typeTailwind}`;

  const briefing = generateSystemBriefing({
    themeName: input.themeName,
    color: {
      brandHex: input.brandHex,
      effectiveBgHex: paletteSet.effectiveBgHex,
      effectiveErrorHex: paletteSet.effectiveErrorHex,
      accentPalettes: [],
      chromaScale: input.chromaScale,
      mode: input.colorMode,
      brandPin: false,
      errorPin: false,
      themeName: input.themeName,
      fgContrastMode: input.fgContrastMode,
    },
    type: typeEmitInput,
  });

  const previewUrl = systemPreviewUrl(colorState, typeState);
  const briefingWithLink = `${briefing}\n---\n\n**Continue tweaking in the browser:** [${previewUrl}](${previewUrl})\n`;

  return {
    briefing: briefingWithLink,
    structured: {
      color: {
        palettes: {
          brand: paletteSet.brand,
          surface: paletteSet.surface,
          error: paletteSet.error,
          errorSurface: paletteSet.errorSurface,
          neutral: paletteSet.neutral,
        },
        effectiveBgHex: paletteSet.effectiveBgHex,
        effectiveErrorHex: paletteSet.effectiveErrorHex,
      },
      type: { levels },
      spacing: spacingTokens,
      cssExport,
      tailwindExport,
      previewUrl,
    },
  };
}
