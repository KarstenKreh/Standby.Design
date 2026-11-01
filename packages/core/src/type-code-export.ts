/**
 * Code export generators for the type scale.
 */

import { customScale, traditionalScale, resolveMobileRatio, DEFAULT_TRADITIONAL, DEFAULT_TRADITIONAL_MOBILE, LEVEL_LABELS, type ComputedLevel } from './scale';
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

export interface TextRole {
  role: string;
  name: string;
  level: ComputedLevel['level'];
  font: 'heading' | 'body';
  weight?: number;
  tabularNumbers?: boolean;
}

export const TEXT_ROLES: TextRole[] = [
  { role: 'title-1', name: 'Titelstufe 1', level: 'h1', font: 'heading' },
  { role: 'title-2', name: 'Titelstufe 2', level: 'h3', font: 'heading' },
  { role: 'title-3', name: 'Titelstufe 3', level: 'h5', font: 'heading' },
  { role: 'figure', name: 'Kennzahl', level: 'h2', font: 'body', weight: 400, tabularNumbers: true },
  { role: 'body', name: 'Fließtext', level: 'body-m', font: 'body', weight: 400 },
  { role: 'label', name: 'Beschriftung', level: 'body-s', font: 'body', weight: 500 },
  { role: 'meta', name: 'Meta', level: 'caption', font: 'body', weight: 400 },
];

export function availableTextRoles(levels: ComputedLevel[]): TextRole[] {
  const present = new Set(levels.map((l) => l.level));
  return TEXT_ROLES.filter((r) => present.has(r.level));
}

function roleDeclarations(r: TextRole): string[] {
  const declarations = [
    `font-family: var(--font-${r.font});`,
    `font-size: var(--text-${r.level});`,
    `line-height: var(--leading-${r.level});`,
    `letter-spacing: var(--tracking-${r.level});`,
    `font-weight: ${r.weight ?? 'var(--font-weight-heading)'};`,
  ];
  if (r.tabularNumbers) declarations.push('font-variant-numeric: tabular-nums;');
  return declarations;
}

function roleRules(levels: ComputedLevel[], selector: (role: string) => string): string {
  let css = `\n/* Text roles: set text through a role, not through single sizes */\n`;
  for (const r of availableTextRoles(levels)) {
    css += `${selector(r.role)} {\n`;
    for (const d of roleDeclarations(r)) css += `  ${d}\n`;
    css += `}\n`;
  }
  return css;
}

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
  const textRole: Record<string, unknown> = {};
  for (const r of availableTextRoles(opts.levels)) {
    const l = opts.levels.find((x) => x.level === r.level)!;
    textRole[r.role] = {
      $type: 'typography',
      $description: r.name,
      $value: {
        fontFamily: r.font === 'heading' ? headingFF : bodyFF,
        fontSize: l.clampValue,
        fontWeight: r.weight ?? opts.headingWeight,
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
    textRole,
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
  css += roleRules(levels, (role) => `.text-role-${role}`);
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
  css += roleRules(levels, (role) => `@utility text-role-${role}`);
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

  const roles = availableTextRoles(levels);
  if (roles.length) {
    md += `\n## Text Roles\n\n`;
    md += `Every text style in a view has a role. Set text through the role class, not through single sizes or weights.\n\n`;
    md += `| Role | Class | Level | Font | Weight |\n`;
    md += `|------|-------|-------|------|--------|\n`;
    for (const r of roles) {
      md += `| ${r.name} | \`text-role-${r.role}\` | ${LEVEL_LABELS[r.level]} | ${r.font} | ${r.weight ?? opts.headingWeight} |\n`;
    }
    md += `\nA view uses 4 to 7 text styles, 5 by default. Meta text takes the muted foreground color from the color tokens. Rule: standby.design/docs/rules/typografie-jeder-textstil-hat-eine-rolle\n`;
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
