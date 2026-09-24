/**
 * Code export generators for shape tokens.
 */

import { generateShadows, type ShadowConfig, type ShadowType } from './shadows';
import { generatePalette, type PaletteEntry, type Step } from './palette';
import { softRingSpread, SOFT_RING_ALPHA } from './ring';
import type { ColorMode, SeparationMode, ShapeStyle, BrutalistVariant, RingStyle, ShapeUrlState } from './url-state/shape';

export interface ShapeSurfaceTones {
  background: string;
  card: string;
}

export interface ShapeSurfaces {
  light: ShapeSurfaceTones;
  dark: ShapeSurfaceTones;
}

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
  ringColorMode: ColorMode;
  ringCustomColor: string;
  separationMode: SeparationMode;
  surfaces: ShapeSurfaces;
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
    brutalistVariant: opts.brutalistVariant,
  };
}

function paletteStep(palette: PaletteEntry[], s: Step): string {
  return palette.find(e => e.step === s)!.hex;
}

export function surfacesFromPalette(surface: PaletteEntry[], shapeStyle: ShapeStyle): ShapeSurfaces {
  const isNeomorph = shapeStyle === 'neomorph';
  const lightBackground = paletteStep(surface, 50);
  const darkBackground = paletteStep(surface, 875);
  return {
    light: { background: lightBackground, card: isNeomorph ? lightBackground : paletteStep(surface, 25) },
    dark: { background: darkBackground, card: isNeomorph ? darkBackground : paletteStep(surface, 825) },
  };
}

function exportsShadows(opts: ShapeExportOptions): boolean {
  return opts.shapeStyle !== 'glass' && opts.shadowEnabled;
}

function customRingColor(opts: ShapeExportOptions): string | null {
  return opts.ringColorMode === 'custom' && opts.ringCustomColor ? opts.ringCustomColor : null;
}

function shadowsFor(opts: ShapeExportOptions, isDark: boolean) {
  const tones = isDark ? opts.surfaces.dark : opts.surfaces.light;
  const backdrop = opts.shapeStyle === 'neobrutalism' ? tones.card : tones.background;
  return generateShadows(backdrop, isDark, buildShadowConfig(opts));
}

const DEFAULT_SURFACE_HEX = '#335A7F';
const DEFAULT_SURFACE_CHROMA = 0.25;

const SHAPE_DEFAULTS: Omit<ShapeExportOptions, 'surfaces'> = {
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
  ringColorMode: 'auto',
  ringCustomColor: '#000000',
  separationMode: 'shadow',
};

export function shapeOptsFromState(state: Partial<ShapeUrlState> | null, surfacePalette?: PaletteEntry[]): ShapeExportOptions {
  const merged = { ...SHAPE_DEFAULTS, ...state };
  const palette = surfacePalette ?? generatePalette(DEFAULT_SURFACE_HEX, DEFAULT_SURFACE_CHROMA);
  return { ...merged, surfaces: surfacesFromPalette(palette, merged.shapeStyle) };
}

function radiusScale(base: number) {
  return {
    xs: Math.round(base / 4),
    sm: Math.round(base / 2),
    md: base,
    lg: Math.round(base * 1.5),
    xl: Math.round(base * 2),
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
  const radii = radiusScale(opts.borderRadius);

  let css = `/* Shape Tokens — standby.design/shape */\n`;
  css += `:root {\n`;

  // Shadows (light) — only for paper style
  if (exportsShadows(opts)) {
    const lightShadows = shadowsFor(opts, false);
    css += `  /* Shadows — ${shadowTypeLabel(effectiveShadowType(opts))}, scale ${scaleLabel(opts.shadowScale)} */\n`;
    for (const s of lightShadows) {
      css += `  --shadow-${s.name}: ${s.shadow};\n`;
    }
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
  const ringColor = customRingColor(opts);
  if (ringColor) css += `  --ring: ${ringColor};\n`;
  for (const line of ringTokenLines(opts)) css += `  ${line}\n`;

  // Glass (Liquid Glass — use with liquid-glass-react or similar)
  if (opts.shapeStyle === 'glass') {
    css += `\n  /* Liquid Glass */\n`;
    css += `  --glass-depth: ${opts.glassDepth};\n`;
    css += `  --glass-blur: ${opts.glassBlur};\n`;
    css += `  --glass-dispersion: ${opts.glassDispersion};\n`;
  }

  css += `}\n`;

  // Dark overrides (only shadows, only for paper style)
  if (exportsShadows(opts) || ringColor) {
    css += `\n.dark {\n`;
    if (exportsShadows(opts)) {
      for (const s of shadowsFor(opts, true)) {
        css += `  --shadow-${s.name}: ${s.shadow};\n`;
      }
    }
    if (ringColor) css += `  --ring: ${ringColor};\n`;
    css += `}\n`;
  }

  // Separation mode (informational)
  css += `\n/* Surface separation strategy: ${opts.separationMode} */\n`;

  return css;
}

/* ------------------------------------------------------------------ */
/*  Tailwind v4                                                       */
/* ------------------------------------------------------------------ */

export function generateShapeTailwind(opts: ShapeExportOptions): string {
  const radii = radiusScale(opts.borderRadius);

  let css = `/* Shape Tokens — standby.design/shape */\n`;

  // Mode-independent tokens in @theme
  css += `@theme {\n`;

  // Border Radius
  for (const [name, px] of Object.entries(radii)) {
    const varName = name === 'md' ? '--radius' : `--radius-${name}`;
    css += `  ${varName}: ${pxToRem(px)};\n`;
  }

  // Border
  if (opts.borderEnabled && opts.borderWidth > 0) {
    css += `\n  --border-width: ${opts.borderWidth}px;\n`;
  }

  // Ring
  css += `\n  ${ringUsageComment(opts.ringStyle)}\n`;
  for (const line of ringTokenLines(opts)) css += `  ${line}\n`;

  // Glass (Liquid Glass — use with liquid-glass-react or similar)
  if (opts.shapeStyle === 'glass') {
    css += `\n  /* Liquid Glass */\n`;
    css += `  --glass-depth: ${opts.glassDepth};\n`;
    css += `  --glass-blur: ${opts.glassBlur};\n`;
    css += `  --glass-dispersion: ${opts.glassDispersion};\n`;
  }

  css += `}\n`;

  // Shadows are mode-dependent → CSS custom properties (paper only)
  const ringColor = customRingColor(opts);
  if (exportsShadows(opts) || ringColor) {
    const lightShadows = exportsShadows(opts) ? shadowsFor(opts, false) : [];
    const darkShadows = exportsShadows(opts) ? shadowsFor(opts, true) : [];

    if (lightShadows.length) {
      css += `\n/* Shadows — ${shadowTypeLabel(effectiveShadowType(opts))}, scale ${scaleLabel(opts.shadowScale)} */\n`;
    }
    if (ringColor) {
      css += `${lightShadows.length ? '' : '\n'}/* Custom focus ring color — overrides --ring from the color tokens in both modes */\n`;
    }
    css += `/* Mode-dependent: use CSS custom properties with darkMode: "class" */\n`;
    css += `:root {\n`;
    for (const s of lightShadows) {
      css += `  --shadow-${s.name}: ${s.shadow};\n`;
    }
    if (ringColor) css += `  --ring: ${ringColor};\n`;
    css += `}\n`;
    css += `.dark {\n`;
    for (const s of darkShadows) {
      css += `  --shadow-${s.name}: ${s.shadow};\n`;
    }
    if (ringColor) css += `  --ring: ${ringColor};\n`;
    css += `}\n`;
  }

  css += `\n/* Surface separation strategy: ${opts.separationMode} */\n`;

  return css;
}

/* ------------------------------------------------------------------ */
/*  W3C Design Tokens (DTCG JSON)                                     */
/* ------------------------------------------------------------------ */

export function generateShapeDesignTokens(opts: ShapeExportOptions): string {
  const radii = radiusScale(opts.borderRadius);

  const tokens: Record<string, unknown> = {};

  // Shadows (paper only)
  if (exportsShadows(opts)) {
    const lightShadows = shadowsFor(opts, false);
    const darkShadows = shadowsFor(opts, true);

    const shadow: Record<string, unknown> = {};
    for (let i = 0; i < lightShadows.length; i++) {
      shadow[lightShadows[i].name] = {
        $type: 'shadow',
        $value: {
          light: lightShadows[i].shadow,
          dark: darkShadows[i].shadow,
        },
      };
    }
    tokens.shadow = shadow;
  }

  // Border Radius
  const borderRadius: Record<string, unknown> = {};
  for (const [name, px] of Object.entries(radii)) {
    borderRadius[name] = {
      $type: 'dimension',
      $value: pxToRem(px),
    };
  }
  tokens.borderRadius = borderRadius;

  // Border
  if (opts.borderEnabled && opts.borderWidth > 0) {
    tokens.borderWidth = {
      $type: 'dimension',
      $value: `${opts.borderWidth}px`,
    };
  }

  // Ring
  const ringColor = customRingColor(opts);
  tokens.ring = {
    ...(ringColor && { color: { $type: 'color', $value: ringColor } }),
    style: { $type: 'string', $value: opts.ringStyle },
    width: { $type: 'dimension', $value: `${opts.ringWidth}px` },
    offset: { $type: 'dimension', $value: opts.ringStyle === 'soft' ? '0px' : `${opts.ringOffset}px` },
    ...(opts.ringStyle === 'soft' && {
      haloWidth: { $type: 'dimension', $value: `${softRingSpread(opts.ringWidth)}px` },
      haloOpacity: { $type: 'number', $value: SOFT_RING_ALPHA },
    }),
  };

  // Glass
  if (opts.shapeStyle === 'glass') {
    tokens.glass = {
      depth: { $type: 'number', $value: opts.glassDepth },
      blur: { $type: 'number', $value: opts.glassBlur },
      dispersion: { $type: 'number', $value: opts.glassDispersion },
    };
  }

  // Separation
  tokens.surfaceSeparation = {
    $type: 'string',
    $value: opts.separationMode,
  };

  return JSON.stringify(tokens, null, 2);
}

/* ------------------------------------------------------------------ */
/*  LLM Briefing                                                      */
/* ------------------------------------------------------------------ */

export function generateShapeLlmBriefing(opts: ShapeExportOptions): string {
  const radii = radiusScale(opts.borderRadius);

  let md = `# Shape Tokens — standby.design/shape\n\n`;

  const styleLabel =
    opts.shapeStyle === 'paper' ? 'Paper' :
    opts.shapeStyle === 'glass' ? 'Glass (Liquid Glass)' :
    opts.shapeStyle === 'neomorph' ? 'Neomorph (Soft UI)' :
    `Neobrutalism (${opts.brutalistVariant})`;
  md += `**Style:** ${styleLabel}\n\n`;

  if (opts.shapeStyle === 'neomorph') {
    md += `## Neomorph Notes\n\n`;
    md += `- **Monochromatic surface:** Cards, muted, and elevated layers share the parent background color. Depth comes from dual shadows (light top-left + dark bottom-right), not color contrast.\n`;
    md += `- **Accessibility:** Low surface/background contrast is inherent to the style. Ensure text and interactive elements meet WCAG AA (4.5:1) against their own backgrounds — the preview flags sub-threshold buttons.\n`;
    md += `- **Pressed states:** Mirror the same shadow values with \`inset\` to create a depressed effect for active/pressed buttons.\n`;
    md += `- **Border default:** 0 by design. Raise \`--border-width\` only if you need extra separation.\n\n`;
  }

  if (opts.shapeStyle === 'neobrutalism') {
    const isSolid = opts.brutalistVariant === 'solid';
    const echoColor = opts.shadowColorMode === 'custom'
      ? `the custom shadow color \`${opts.shadowCustomColor}\``
      : `the surface's own background one palette step darker (OKLCH lightness −0.10, in both light and dark mode; the tokens use the card surface)`;
    md += `## Neobrutalism Notes\n\n`;
    md += `- **Offset echo:** A copy of each surface's outline sits behind it at offset (${opts.shadowOffsetX}px, ${opts.shadowOffsetY}px). Exported as \`--shadow-*\` with zero blur.\n`;
    md += isSolid
      ? `- **Variant:** \`solid\` — the echo is a filled block in ${echoColor}, with no stroke. The surface in front drops its own border.\n`
      : `- **Variant:** \`outlined\` — the echo is hollow: filled with the card surface color and stroked (${opts.borderEnabled ? opts.borderWidth : 1}px) in ${echoColor}.\n`;
    if (!isSolid) {
      md += `- **Borders carry the style:** Each surface has an explicit border in the echo color, taken from its own background the same way. Borders are required, not optional.\n`;
    }
    md += `- **No blur, no soft shadows:** This style is flat and hard-edged by design. Do not mix with gaussian drop shadows.\n`;
    md += `- **Offset ladder:** xs–xl levels scale the offset by the shadow scale (\`${scaleLabel(opts.shadowScale)}\`), so elevation reads even though all shadows are hard.\n\n`;
  }

  // Shadows (paper + neomorph — skipped for glass)
  if (opts.shapeStyle !== 'glass') {
  md += `## Shadows\n\n`;
  if (opts.shadowEnabled) {
    md += `- **Style:** ${shadowTypeLabel(effectiveShadowType(opts))}\n`;
    md += `- **Scale:** ${scaleLabel(opts.shadowScale)} (5 levels: xs, sm, md, lg, xl)\n`;
    md += `- **Strength:** ${opts.shadowStrength}\n`;
    md += `- **Blur scale:** ${opts.shadowBlurScale}\n`;
    md += `- **Color mode:** ${opts.shadowColorMode}${opts.shadowColorMode === 'custom' ? ` (${opts.shadowCustomColor})` : ''}\n\n`;

    const lightShadows = shadowsFor(opts, false);
    const darkShadows = shadowsFor(opts, true);

    md += `### Light mode\n\n`;
    md += `| Level | box-shadow |\n|-------|------------|\n`;
    for (const s of lightShadows) md += `| ${s.name} | \`${s.shadow}\` |\n`;

    md += `\n### Dark mode\n\n`;
    md += `| Level | box-shadow |\n|-------|------------|\n`;
    for (const s of darkShadows) md += `| ${s.name} | \`${s.shadow}\` |\n`;
  } else {
    md += `Shadows are **disabled**.\n`;
  }
  } // end paper-only shadows

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
  const ringColor = customRingColor(opts);
  md += ringColor
    ? `- **Color:** custom \`${ringColor}\` in both modes — the export sets \`--ring\` in \`:root\` and \`.dark\`, overriding the color tokens\n`
    : `- **Color:** \`--ring\` from the color tokens — the primary color (brand-600 light, brand-400 dark, or the pinned brand color)\n`;
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
    md += `Implemented as a self-contained SVG filter + \`backdrop-filter\` component (no external runtime dependency).\n\n`;
    md += `- **Depth:** ${opts.glassDepth} (displacement intensity)\n`;
    md += `- **Blur:** ${opts.glassBlur} (backdrop blur multiplier)\n`;
    md += `- **Dispersion:** ${opts.glassDispersion} (chromatic aberration)\n`;
    md += `\nDisplacement is driven by an SVG \`<feDisplacementMap>\` with 35% filter padding (no edge clipping). Backdrop blur and saturation use the native CSS \`backdrop-filter\`. Chromatic aberration is produced by three \`feDisplacementMap\` passes with per-channel scale offsets.\n`;
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
  if (exportsShadows(opts)) {
    md += `Shadows are mode-dependent — define both \`:root\` and \`.dark\` blocks.\n`;
  }
  if (ringColor) {
    md += `The custom ring color is set in both \`:root\` and \`.dark\` so it wins over \`--ring\` from the color tokens — load the shape tokens after the color tokens.\n`;
  }
  md += `Combine with color tokens from standby.design/color and type tokens from standby.design/type.\n`;

  return md;
}
