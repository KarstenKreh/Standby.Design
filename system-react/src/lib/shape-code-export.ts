/**
 * Code export generators for shape tokens (used in combined system export).
 */

import { generateShadows, type ShadowConfig, type ShadowType } from '@core/shadows';
import { hexToOklch, oklchToHex } from '@core/color-math';
import { softRingSpread, SOFT_RING_ALPHA } from '@core/ring';
import type { ColorMode, SeparationMode, ShapeStyle, BrutalistVariant, RingStyle, ShapeUrlState as ShapeState } from '@core/url-state/shape';

export interface ShapeExportOptions {
  shapeStyle: ShapeStyle;
  shadowEnabled: boolean;
  shadowType: ShadowType;
  shadowStrength: number;
  shadowBlurScale: number;
  shadowScale: number;
  shadowColorMode: ColorMode;
  shadowCustomColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  brutalistVariant: BrutalistVariant;
  borderEnabled: boolean;
  borderWidth: number;
  borderRadius: number;
  glassDepth: number;
  glassBlur: number;
  glassDispersion: number;
  ringWidth: number;
  ringOffset: number;
  ringStyle: RingStyle;
  separationMode: SeparationMode;
  surfaceHex: string;
}

/** Token lines for the focus ring — soft adds the halo, solid keeps the offset. */
export function ringTokenLines(opts: Pick<ShapeExportOptions, 'ringWidth' | 'ringOffset' | 'ringStyle'>): string[] {
  if (opts.ringStyle === 'solid') {
    return [
      `--ring-width: ${opts.ringWidth}px;`,
      `--ring-offset: ${opts.ringOffset}px;`,
    ];
  }
  return [
    `--ring-width: ${opts.ringWidth}px;`,
    `--ring-offset: 0px;`,
    `--ring-halo-width: ${softRingSpread(opts.ringWidth)}px;`,
    `--ring-halo: color-mix(in oklab, var(--ring) ${Math.round(SOFT_RING_ALPHA * 100)}%, transparent);`,
  ];
}

export function ringUsageComment(ringStyle: RingStyle): string {
  return ringStyle === 'solid'
    ? `/* Focus Ring — solid: outline: var(--ring-width) solid var(--ring); outline-offset: var(--ring-offset); */`
    : `/* Focus Ring — soft: border-color: var(--ring); box-shadow: 0 0 0 var(--ring-halo-width) var(--ring-halo);\n   The full-color border carries the WCAG 3:1 focus contrast, the halo is the extra. */`;
}

const SHAPE_DEFAULTS: ShapeExportOptions = {
  shapeStyle: 'paper',
  shadowEnabled: true,
  shadowType: 'normal',
  shadowStrength: 1.0,
  shadowBlurScale: 1.0,
  shadowScale: 1.272,
  shadowColorMode: 'auto',
  shadowCustomColor: '#000000',
  shadowOffsetX: 2,
  shadowOffsetY: 4,
  brutalistVariant: 'outlined',
  borderEnabled: true,
  borderWidth: 1,
  borderRadius: 8,
  glassDepth: 0,
  glassBlur: 0,
  glassDispersion: 0,
  ringWidth: 2,
  ringOffset: 2,
  ringStyle: 'soft',
  separationMode: 'shadow',
  surfaceHex: '#335A7F',
};

/** Build full options from partial decoded shape state. */
export function optsFromState(state: Partial<ShapeState> | null, surfaceHex?: string): ShapeExportOptions {
  return {
    ...SHAPE_DEFAULTS,
    ...state,
    surfaceHex: surfaceHex ?? state?.shadowCustomColor ?? SHAPE_DEFAULTS.surfaceHex,
  } as ShapeExportOptions;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function effectiveShadowType(opts: ShapeExportOptions): ShadowType {
  if (opts.shapeStyle === 'neomorph') return 'neumorphic';
  if (opts.shapeStyle === 'neobrutalism') return 'brutalist';
  return opts.shadowType;
}

function buildShadowConfig(opts: ShapeExportOptions): ShadowConfig {
  return {
    type: effectiveShadowType(opts),
    strength: opts.shadowStrength,
    blurScale: opts.shadowBlurScale,
    scale: opts.shadowScale,
    colorMode: opts.shadowColorMode,
    customColor: opts.shadowCustomColor,
    offsetX: opts.shadowOffsetX,
    offsetY: opts.shadowOffsetY,
    borderWidth: opts.borderEnabled ? opts.borderWidth : 1,
  };
}

function deriveBgHex(surfaceHex: string, isDark: boolean): string {
  const [, , H] = hexToOklch(surfaceHex);
  const C = 0.015;
  return isDark ? oklchToHex(0.15, C, H) : oklchToHex(0.96, C * 0.3, H);
}

function radiusScale(base: number) {
  return {
    xs: base / 4,
    sm: base / 2,
    md: base,
    lg: base * 1.5,
    xl: base * 2,
  } as Record<string, number>;
}

function pxToRem(px: number): string {
  return `${+(px / 16).toFixed(4)}rem`;
}

function shadowTypeLabel(t: ShadowType): string {
  return { normal: 'Normal', neumorphic: 'Neumorphic', flat: 'Flat', brutalist: 'Brutalist' }[t];
}

function scaleLabel(scale: number): string {
  return Math.abs(scale - 1.272) < 0.001 ? '√φ' : scale.toFixed(3);
}

/* ------------------------------------------------------------------ */
/*  CSS Custom Properties                                             */
/* ------------------------------------------------------------------ */

export function generateShapeCss(opts: ShapeExportOptions): string {
  const config = buildShadowConfig(opts);
  const radii = radiusScale(opts.borderRadius);

  let css = `/* Shape Tokens — standby.design/shape */\n`;
  css += `:root {\n`;

  // Shadows (light)
  if (opts.shadowEnabled) {
    const lightBg = deriveBgHex(opts.surfaceHex, false);
    const lightShadows = generateShadows(lightBg, false, config);
    css += `  /* Shadows — ${shadowTypeLabel(effectiveShadowType(opts))}, scale ${scaleLabel(opts.shadowScale)} */\n`;
    for (const s of lightShadows) {
      css += `  --shadow-${s.name}: ${s.shadow};\n`;
    }
  } else {
    css += `  /* Shadows: disabled */\n`;
  }

  // Border Radius
  css += `\n  /* Border Radius */\n`;
  for (const [name, px] of Object.entries(radii)) {
    const varName = name === 'md' ? '--radius' : `--radius-${name}`;
    css += `  ${varName}: ${pxToRem(px)};\n`;
  }

  // Border
  if (opts.borderEnabled && opts.borderWidth > 0) {
    css += `\n  /* Border */\n`;
    css += `  --border-width: ${opts.borderWidth}px;\n`;
  }

  // Ring
  css += `\n  ${ringUsageComment(opts.ringStyle)}\n`;
  for (const line of ringTokenLines(opts)) css += `  ${line}\n`;

  // Glass
  if (opts.shapeStyle === 'glass') {
    css += `\n  /* Liquid Glass (vaso) */\n`;
    css += `  --glass-depth: ${opts.glassDepth};\n`;
    css += `  --glass-blur: ${opts.glassBlur};\n`;
    css += `  --glass-dispersion: ${opts.glassDispersion};\n`;
  }

  css += `}\n`;

  // Dark overrides (only shadows change)
  if (opts.shadowEnabled) {
    const darkBg = deriveBgHex(opts.surfaceHex, true);
    const darkShadows = generateShadows(darkBg, true, config);
    css += `\n.dark {\n`;
    for (const s of darkShadows) {
      css += `  --shadow-${s.name}: ${s.shadow};\n`;
    }
    css += `}\n`;
  }

  css += `\n/* Surface separation strategy: ${opts.separationMode} */\n`;

  return css;
}

/* ------------------------------------------------------------------ */
/*  Tailwind v4                                                       */
/* ------------------------------------------------------------------ */

export function generateShapeTailwind(opts: ShapeExportOptions): string {
  const config = buildShadowConfig(opts);
  const radii = radiusScale(opts.borderRadius);

  let css = `/* Shape Tokens — standby.design/shape */\n`;

  // Mode-independent tokens in @theme
  css += `@theme {\n`;

  for (const [name, px] of Object.entries(radii)) {
    const varName = name === 'md' ? '--radius' : `--radius-${name}`;
    css += `  ${varName}: ${pxToRem(px)};\n`;
  }

  if (opts.borderEnabled && opts.borderWidth > 0) {
    css += `\n  --border-width: ${opts.borderWidth}px;\n`;
  }

  css += `\n  ${ringUsageComment(opts.ringStyle)}\n`;
  for (const line of ringTokenLines(opts)) css += `  ${line}\n`;

  if (opts.shapeStyle === 'glass') {
    css += `\n  --glass-depth: ${opts.glassDepth};\n`;
    css += `  --glass-blur: ${opts.glassBlur};\n`;
    css += `  --glass-dispersion: ${opts.glassDispersion};\n`;
  }

  css += `}\n`;

  // Shadows are mode-dependent
  if (opts.shadowEnabled) {
    const lightBg = deriveBgHex(opts.surfaceHex, false);
    const darkBg = deriveBgHex(opts.surfaceHex, true);
    const lightShadows = generateShadows(lightBg, false, config);
    const darkShadows = generateShadows(darkBg, true, config);

    css += `\n/* Shadows — ${shadowTypeLabel(effectiveShadowType(opts))}, scale ${scaleLabel(opts.shadowScale)} */\n`;
    css += `:root {\n`;
    for (const s of lightShadows) {
      css += `  --shadow-${s.name}: ${s.shadow};\n`;
    }
    css += `}\n`;
    css += `.dark {\n`;
    for (const s of darkShadows) {
      css += `  --shadow-${s.name}: ${s.shadow};\n`;
    }
    css += `}\n`;
  }

  css += `\n/* Surface separation strategy: ${opts.separationMode} */\n`;

  return css;
}

/* ------------------------------------------------------------------ */
/*  LLM Briefing                                                      */
/* ------------------------------------------------------------------ */

export function generateLlmBriefing(opts: ShapeExportOptions): string {
  const config = buildShadowConfig(opts);
  const radii = radiusScale(opts.borderRadius);

  let md = `# Shape Tokens — standby.design/shape\n\n`;

  // Shadows
  md += `## Shadows\n\n`;
  if (opts.shadowEnabled) {
    md += `- **Style:** ${shadowTypeLabel(effectiveShadowType(opts))}\n`;
    md += `- **Scale:** ${scaleLabel(opts.shadowScale)} (5 levels: xs, sm, md, lg, xl)\n`;
    md += `- **Strength:** ${opts.shadowStrength}\n`;
    md += `- **Blur scale:** ${opts.shadowBlurScale}\n`;
    md += `- **Color mode:** ${opts.shadowColorMode}${opts.shadowColorMode === 'custom' ? ` (${opts.shadowCustomColor})` : ''}\n\n`;

    const lightBg = deriveBgHex(opts.surfaceHex, false);
    const darkBg = deriveBgHex(opts.surfaceHex, true);
    const lightShadows = generateShadows(lightBg, false, config);
    const darkShadows = generateShadows(darkBg, true, config);

    md += `### Light mode\n\n`;
    md += `| Level | box-shadow |\n|-------|------------|\n`;
    for (const s of lightShadows) md += `| ${s.name} | \`${s.shadow}\` |\n`;

    md += `\n### Dark mode\n\n`;
    md += `| Level | box-shadow |\n|-------|------------|\n`;
    for (const s of darkShadows) md += `| ${s.name} | \`${s.shadow}\` |\n`;
  } else {
    md += `Shadows are **disabled**.\n`;
  }

  // Border Radius
  md += `\n## Border Radius\n\n`;
  md += `Base: ${opts.borderRadius}px\n\n`;
  md += `| Token | Value |\n|-------|-------|\n`;
  for (const [name, px] of Object.entries(radii)) {
    const token = name === 'md' ? '--radius' : `--radius-${name}`;
    md += `| ${token} | ${pxToRem(px)} (${px}px) |\n`;
  }

  // Border
  md += `\n## Border\n\n`;
  if (opts.borderEnabled && opts.borderWidth > 0) {
    md += `- **Width:** ${opts.borderWidth}px\n`;
  } else {
    md += `Borders are **disabled**.\n`;
  }

  // Ring
  md += `\n## Focus Ring\n\n`;
  md += `- **Style:** ${opts.ringStyle === 'soft' ? 'soft — a translucent halo hugging the edge (box-shadow, no blur), plus the element border in the full ring color' : 'solid — a hard outline set off from the element'}\n`;
  md += `- **Width:** ${opts.ringWidth}px\n`;
  if (opts.ringStyle === 'soft') {
    md += `- **Halo:** ${softRingSpread(opts.ringWidth)}px spread at ${Math.round(SOFT_RING_ALPHA * 100)}% opacity, no offset\n`;
    md += `- **CSS:** \`border-color: var(--ring); box-shadow: 0 0 0 var(--ring-halo-width) var(--ring-halo);\`\n`;
    md += `- **Contrast:** WCAG 2.2 wants 3:1 for focus. The full-color border carries that — never drop it and keep only the halo.\n`;
  } else {
    md += `- **Offset:** ${opts.ringOffset}px\n`;
    md += `- **CSS:** \`outline: var(--ring-width) solid var(--ring); outline-offset: var(--ring-offset);\`\n`;
  }

  // Glass
  md += `\n## Liquid Glass\n\n`;
  if (opts.shapeStyle === 'glass') {
    md += `Uses the \`vaso\` library (liquid glass distortion effect).\n\n`;
    md += `- **Depth:** ${opts.glassDepth} (displacement intensity)\n`;
    md += `- **Blur:** ${opts.glassBlur} (backdrop blur amount)\n`;
    md += `- **Dispersion:** ${opts.glassDispersion} (chromatic aberration)\n`;
  } else {
    md += `Liquid glass effect is **disabled**.\n`;
  }

  // Separation
  md += `\n## Surface Separation\n\n`;
  md += `Strategy: **${opts.separationMode}**\n`;
  const descriptions: Record<SeparationMode, string> = {
    shadow: 'Surfaces are separated using box-shadow elevation.',
    border: 'Surfaces are separated using visible borders.',
    contrast: 'Surfaces are separated using background-color contrast.',
    gap: 'Surfaces are separated using whitespace (gap/padding).',
    mixed: 'Surfaces use a combination of shadow, border, and contrast.',
  };
  md += `${descriptions[opts.separationMode]}\n`;

  // Usage hint
  md += `\n## Usage\n\n`;
  md += `Use the CSS custom properties from the CSS or Tailwind export.\n`;
  md += `Shadows are mode-dependent — define both \`:root\` and \`.dark\` blocks.\n`;
  md += `Combine with color tokens from standby.design/color and type tokens from standby.design/type.\n`;

  return md;
}
