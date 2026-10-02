/**
 * Code export generators for the type scale.
 */

import { customScale, traditionalScale, resolveMobileRatio, DEFAULT_TRADITIONAL, DEFAULT_TRADITIONAL_MOBILE, type ComputedLevel } from './scale';
import { applyTypography } from './typography';
import { fontFamily, buildFontshareEmbed } from './fontshare';
import type { UrlState as TypeState } from './url-state/type';

export interface TypeExportOptions {
  levels: ComputedLevel[];
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  headingWeight: number;
  scaleLabel: string;
}

type ExportOptions = TypeExportOptions;

export function computeTypeScale(state: TypeState): ComputedLevel[] {
  const levels = state.scaleMode === 'traditional'
    ? traditionalScale(state.traditionalAssignments ?? DEFAULT_TRADITIONAL, state.traditionalMobileAssignments ?? DEFAULT_TRADITIONAL_MOBILE)
    : customScale(
      state.baseSize,
      state.customRatio,
      resolveMobileRatio(state.mobileRatioMode, state.customRatio, state.autoShrink, state.mobileRatio),
      state.mobileBaseSize,
    );
  return applyTypography(levels, state.lineHeightOverrides, state.letterSpacingOverrides);
}

export function typeScaleLabel(state: Pick<TypeState, 'scaleMode' | 'customRatio'>): string {
  const scale = state.scaleMode === 'traditional'
    ? 'Traditional'
    : Math.abs(state.customRatio - 1.272) < 0.001
      ? '√φ Golden Ratio (area-based)'
      : `Custom Ratio (${state.customRatio})`;
  return `${scale} — standby.design/type`;
}

export function typeOptsFromState(state: TypeState, levels: ComputedLevel[] = computeTypeScale(state)): TypeExportOptions {
  return {
    levels,
    headingFont: state.headingFont,
    bodyFont: state.bodyFont,
    monoFont: state.monoFont,
    headingWeight: state.headingWeight,
    scaleLabel: typeScaleLabel(state),
  };
}

export function typeDesignTokens(opts: TypeExportOptions): Record<string, unknown> {
  const headingFF = fontFamily(opts.headingFont);
  const bodyFF = fontFamily(opts.bodyFont);
  const typography: Record<string, unknown> = {};
  for (const l of opts.levels) {
    typography[l.level] = {
      $type: 'typography',
      $value: {
        fontFamily: l.isHeading ? headingFF : bodyFF,
        fontSize: l.clampValue,
        fontWeight: l.isHeading ? opts.headingWeight : 400,
        lineHeight: l.lineHeight,
        letterSpacing: `${l.letterSpacing}em`,
      },
    };
  }
  return {
    font: {
      heading: { $type: 'fontFamily', $value: headingFF },
      body: { $type: 'fontFamily', $value: bodyFF },
      mono: { $type: 'fontFamily', $value: fontFamily(opts.monoFont) },
    },
    typography,
  };
}

export function generateTypeDesignTokens(opts: TypeExportOptions): string {
  return JSON.stringify(typeDesignTokens(opts), null, 2);
}

/** CSS Custom Properties */
export function generateCssExport(opts: ExportOptions): string {
  const { levels, headingFont, bodyFont, monoFont, scaleLabel } = opts;

  const headingFF = fontFamily(headingFont);
  const bodyFF = fontFamily(bodyFont);
  const monoFF = fontFamily(monoFont);

  const isGolden = scaleLabel.includes('√φ');
  let css = `/* Type Scale — ${scaleLabel} */\n`;
  if (isGolden) {
    css += `/* Scales the perceived area of letterforms by the golden ratio. */\n`;
  }
  css += `:root {\n`;
  css += `  /* Font Families */\n`;
  css += `  --font-heading: ${headingFF};\n`;
  css += `  --font-body: ${bodyFF};\n`;
  css += `  --font-mono: ${monoFF};\n`;
  css += `\n  /* Font Weights */\n`;
  css += `  --font-weight-heading: ${opts.headingWeight};\n`;
  css += `\n  /* Type Scale */\n`;

  for (const l of levels) {
    css += `  --text-${l.level}: ${l.clampValue};\n`;
  }

  css += `\n  /* Line Heights */\n`;
  for (const l of levels) {
    css += `  --leading-${l.level}: ${l.lineHeight};\n`;
  }

  css += `\n  /* Letter Spacing */\n`;
  for (const l of levels) {
    css += `  --tracking-${l.level}: ${l.letterSpacing}em;\n`;
  }

  css += `}\n`;
  return css;
}

/** Tailwind v4 @theme */
export function generateTailwindV4Export(opts: ExportOptions): string {
  const { levels, headingFont, bodyFont, monoFont, scaleLabel } = opts;

  const headingFF = fontFamily(headingFont);
  const bodyFF = fontFamily(bodyFont);
  const monoFF = fontFamily(monoFont);

  const isGolden = scaleLabel.includes('√φ');
  let css = `/* Type Scale — ${scaleLabel} */\n`;
  if (isGolden) {
    css += `/* Scales the perceived area of letterforms by the golden ratio. */\n`;
  }
  css += `@theme {\n`;
  css += `  --font-heading: ${headingFF};\n`;
  css += `  --font-body: ${bodyFF};\n`;
  css += `  --font-mono: ${monoFF};\n`;
  css += `  --font-weight-heading: ${opts.headingWeight};\n`;
  css += `\n`;

  for (const l of levels) {
    css += `  --text-${l.level}: ${l.clampValue};\n`;
  }

  css += `\n`;
  for (const l of levels) {
    css += `  --leading-${l.level}: ${l.lineHeight};\n`;
  }

  css += `\n`;
  for (const l of levels) {
    css += `  --tracking-${l.level}: ${l.letterSpacing}em;\n`;
  }

  css += `}\n`;
  return css;
}

/** LLM Briefing (Markdown) */
export function generateLlmBriefing(opts: ExportOptions): string {
  const { levels, headingFont, bodyFont, monoFont, scaleLabel } = opts;

  const headingFF = fontFamily(headingFont);
  const bodyFF = fontFamily(bodyFont);
  const monoFF = fontFamily(monoFont);

  let md = `# Type Scale — ${scaleLabel}\n\n`;

  md += `## Fonts\n\n`;
  md += `- **Heading:** ${headingFF}, weight ${opts.headingWeight}\n`;
  md += `- **Body:** ${bodyFF}\n`;
  md += `- **Mono:** ${monoFF}\n`;

  md += `\n## Type Scale\n\n`;
  md += `| Level | Min | Max | clamp() |\n`;
  md += `|-------|-----|-----|---------|\n`;
  for (const l of levels) {
    if (l.isFluid) {
      md += `| ${l.label} | ${l.minRem}rem | ${l.maxRem}rem | \`${l.clampValue}\` |\n`;
    } else {
      md += `| ${l.label} | ${l.maxRem}rem | — | ${l.maxRem}rem |\n`;
    }
  }

  md += `\n## Line Heights\n\n`;
  md += `| Level | Value |\n`;
  md += `|-------|-------|\n`;
  for (const l of levels) {
    md += `| ${l.label} | ${l.lineHeight} |\n`;
  }

  md += `\n## Letter Spacing\n\n`;
  md += `| Level | Value |\n`;
  md += `|-------|-------|\n`;
  for (const l of levels) {
    md += `| ${l.label} | ${l.letterSpacing}em |\n`;
  }

  md += `\n## Usage\n\n`;
  md += `Use the CSS custom properties from the CSS or Tailwind export.\n`;
  md += `Set headings in \`var(--font-heading)\` at \`font-weight: var(--font-weight-heading)\`.\n`;
  if (levels.some((l) => l.isFluid)) {
    md += `Font sizes use \`clamp()\` for fluid scaling between 375px and 1920px viewport.\n`;
  } else {
    md += `Font sizes are static and do not scale with the viewport.\n`;
  }
  md += `Combine with color tokens from standby.design/color, shape tokens from standby.design/shape, and spacing/layout tokens from standby.design/space.\n`;

  return md;
}

/** Fontshare embed snippet */
export function generateFontEmbed(
  headingFont: string,
  bodyFont: string,
  monoFont: string,
): string {
  const slugs = [headingFont, bodyFont, monoFont].filter(Boolean);
  const embed = buildFontshareEmbed(slugs);
  if (!embed) return '<!-- No Fontshare fonts selected -->';
  return `<!-- Fontshare Fonts -->\n${embed}`;
}
