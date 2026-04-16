import { buildScale } from '@core/orchestrate';
import { computeSpacingTokens } from '@core/spacing';
import { generateTypeBriefing } from '@core/exports/type-briefing';
import type { UrlState as DecodedTypeState } from '@core/url-state/type';
import { emitTypeCss, emitTypeTailwind } from '../exports/css-emitter.js';
import { typePreviewUrl } from '../preview-url.js';
import type { TypeInput } from '../schemas/type-input.js';

function scaleLabelFor(input: TypeInput): string {
  if (input.mode === 'golden') return '√φ Golden Ratio (area-based) — standby.design/type';
  if (input.mode === 'traditional') return 'Traditional Scale — standby.design/type';
  const r = input.ratio ?? 1.272;
  if (Math.abs(r - 1.272) < 0.001) return 'Custom Ratio (√φ ≈ 1.272) — standby.design/type';
  return `Custom Ratio (${r}) — standby.design/type`;
}

export function runGenerateTypeScale(input: TypeInput) {
  const ratio = input.ratio ?? 1.272;
  const mobileBase = input.mobileBaseSize ?? input.baseSize;
  // Default mobile ratio applies a 25% shrink (autoShrink), yielding a fluid scale.
  // Matches the web app default (DEFAULT_TYPE_HASH ratio 1.272 → mobileRatio 1.19).
  const mobileRatio = input.mobileRatio ?? 1 + (ratio - 1) * 0.75;

  const typeState: DecodedTypeState = {
    scaleMode: input.mode,
    baseSize: input.baseSize,
    customRatio: ratio,
    mobileRatio,
    headingFont: input.headingFont,
    bodyFont: input.bodyFont,
    monoFont: input.monoFont,
    headingWeight: 500,
    mobileBaseSize: mobileBase,
    mobileRatioMode: 'auto',
    autoShrink: 25,
    lineHeightOverrides: {},
    letterSpacingOverrides: {},
  };

  const levels = buildScale(typeState);

  const spacingTokens = input.includeSpacing
    ? computeSpacingTokens({
        baseRem: input.baseSize,
        ratio,
        mode: 'harmonic',
        multiplier: 1,
        snap: true,
      })
    : [];

  const scaleLabel = scaleLabelFor(input);
  const emitInput = {
    levels,
    spacingTokens,
    headingFont: input.headingFont,
    bodyFont: input.bodyFont,
    monoFont: input.monoFont,
    scaleLabel,
  };

  const cssExport = emitTypeCss(emitInput);
  const tailwindExport = emitTypeTailwind(emitInput);
  const briefing = generateTypeBriefing(emitInput);
  const previewUrl = typePreviewUrl(typeState);

  const briefingWithLink = `${briefing}\n---\n\n**Continue tweaking in the browser:** [${previewUrl}](${previewUrl})\n`;

  return {
    briefing: briefingWithLink,
    structured: {
      levels,
      spacingTokens,
      cssExport,
      tailwindExport,
      previewUrl,
    },
  };
}
