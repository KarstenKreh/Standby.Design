/**
 * Code export for spacing + layout tokens. Shared between space-react and system-react.
 */

import { computeSpacingTokens, type SpacingToken } from './spacing';
import type { Breakpoint, Container } from './layout';
import type { AspectRatio } from './aspect';
import { formatAspect, expandAndSortAspects } from './aspect';
import { sortBreakpoints, sortContainers } from './layout';
import type { SpaceUrlState } from './url-state/space';

export interface SpaceExportOptions {
  spacingTokens: SpacingToken[];
  breakpoints: Breakpoint[];
  fluidMinVw: number;
  fluidMaxVw: number;
  containers: Container[];
  proseMaxCh: number;
  aspectRatios: AspectRatio[];
  includeReciprocals: boolean;
  ratioLabel: string;
}

const expandAspects = expandAndSortAspects;

const STATIC_WIDTH_SUFFIXES = new Set([
  'full', 'auto', 'screen', 'min', 'max', 'fit', 'px', 'none',
  'dvw', 'dvh', 'lvw', 'lvh', 'svw', 'svh',
]);

const TW_DEFAULT_CONTAINER_SCALE: Record<string, string> = {
  '3xs': '16rem',
  '2xs': '18rem',
  xs: '20rem',
  sm: '24rem',
  md: '28rem',
  lg: '32rem',
  xl: '36rem',
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
  '6xl': '72rem',
  '7xl': '80rem',
};

export function tailwindContainerName(name: string): string {
  return STATIC_WIDTH_SUFFIXES.has(name) ? `${name}width` : name;
}

export function spacingTokensFor(state: SpaceUrlState): SpacingToken[] {
  return computeSpacingTokens({
    baseRem: state.spacingBaseRem,
    ratio: state.spacingRatio,
    mode: state.spacingMode,
    multiplier: state.spacingMultiplier,
    snap: state.spacingSnap,
  });
}

export function spaceRatioLabel(state: Pick<SpaceUrlState, 'spacingMode' | 'spacingRatio'>): string {
  if (state.spacingMode === 'harmonic') return 'Harmonic multiples';
  if (Math.abs(state.spacingRatio - 1.272) < 0.001) return '√φ Golden Ratio';
  return `Geometric ×${state.spacingRatio.toFixed(3)}`;
}

const SOURCE = 'standby.design/space';

export function spaceOptsFromState(state: SpaceUrlState, spacingTokens: SpacingToken[] = spacingTokensFor(state)): SpaceExportOptions {
  return {
    spacingTokens,
    breakpoints: state.breakpoints,
    fluidMinVw: state.fluidMinVw,
    fluidMaxVw: state.fluidMaxVw,
    containers: state.containers,
    proseMaxCh: state.proseMaxCh,
    aspectRatios: state.aspectRatios,
    includeReciprocals: state.aspectIncludeReciprocals,
    ratioLabel: spaceRatioLabel(state),
  };
}

/** CSS Custom Properties */
export function generateSpaceCss(opts: SpaceExportOptions): string {
  const { spacingTokens, breakpoints, fluidMinVw, fluidMaxVw, containers, proseMaxCh, aspectRatios, includeReciprocals, ratioLabel } = opts;

  const bps = sortBreakpoints(breakpoints);
  const cts = sortContainers(containers);
  const ars = expandAspects(aspectRatios, includeReciprocals);

  let css = `/* Space — ${ratioLabel} — ${SOURCE} */\n:root {\n`;

  css += `  /* Spacing Scale */\n`;
  for (const t of spacingTokens) {
    css += `  --space-${t.name}: ${t.rem}rem;\n`;
  }

  css += `\n  /* Breakpoints */\n`;
  for (const b of bps) {
    css += `  --breakpoint-${b.name}: ${b.minPx}px;\n`;
  }
  css += `  --fluid-min-vw: ${fluidMinVw}px;\n`;
  css += `  --fluid-max-vw: ${fluidMaxVw}px;\n`;

  css += `\n  /* Containers */\n`;
  for (const c of cts) {
    css += `  --container-${c.name}: ${c.maxPx}px;\n`;
  }
  css += `  --prose-max: ${proseMaxCh}ch;\n`;

  css += `\n  /* Aspect Ratios */\n`;
  for (const a of ars) {
    css += `  --aspect-${a.name}: ${formatAspect(a)};\n`;
  }

  css += `}\n`;
  return css;
}

/** Tailwind v4 @theme — uses v4-native prefixes where applicable. */
export function generateSpaceTailwind(opts: SpaceExportOptions): string {
  const { spacingTokens, breakpoints, fluidMinVw, fluidMaxVw, containers, proseMaxCh, aspectRatios, includeReciprocals, ratioLabel } = opts;

  const bps = sortBreakpoints(breakpoints);
  const cts = sortContainers(containers);
  const ars = expandAspects(aspectRatios, includeReciprocals);

  let css = `/* Space — ${ratioLabel} — ${SOURCE} */\n`;
  css += `/* Tailwind v4: --spacing-*, --breakpoint-*, --container-* are native theme keys. */\n`;
  css += `@theme {\n`;

  for (const t of spacingTokens) {
    css += `  --spacing-${t.name}: ${t.rem}rem;\n`;
  }

  const shadowed = spacingTokens.filter((t) => t.name in TW_DEFAULT_CONTAINER_SCALE);
  if (shadowed.length > 0) {
    css += `\n  /* Named --spacing-* tokens shadow Tailwind's default max-w-* sizes (max-w-md would\n`;
    css += `     resolve to --spacing-md). --max-width-* restores the stock values. w-, min-w- and\n`;
    css += `     basis-<size> still resolve to the spacing token. */\n`;
    for (const t of shadowed) {
      css += `  --max-width-${t.name}: ${TW_DEFAULT_CONTAINER_SCALE[t.name]};\n`;
    }
  }

  css += `\n`;
  for (const b of bps) {
    css += `  --breakpoint-${b.name}: ${b.minPx}px;\n`;
  }

  css += `\n`;
  for (const c of cts) {
    const name = tailwindContainerName(c.name);
    if (name !== c.name) {
      css += `  /* "${c.name}" exported as "${name}": --container-${c.name} would override the static w-${c.name} and max-w-${c.name} utilities. */\n`;
    }
    css += `  --container-${name}: ${c.maxPx}px;\n`;
  }

  css += `\n`;
  for (const a of ars) {
    css += `  --aspect-${a.name}: ${formatAspect(a)};\n`;
  }

  css += `}\n`;

  css += `\n/* Layout values without a Tailwind theme namespace */\n`;
  css += `:root {\n`;
  css += `  --fluid-min-vw: ${fluidMinVw}px;\n`;
  css += `  --fluid-max-vw: ${fluidMaxVw}px;\n`;
  css += `  --prose-max: ${proseMaxCh}ch;\n`;
  css += `}\n`;
  return css;
}

export function spaceDesignTokens(opts: SpaceExportOptions): Record<string, unknown> {
  const spacing: Record<string, unknown> = {};
  for (const t of opts.spacingTokens) {
    spacing[t.name] = { $type: 'dimension', $value: `${t.rem}rem` };
  }

  const breakpoint: Record<string, unknown> = {};
  for (const b of sortBreakpoints(opts.breakpoints)) {
    breakpoint[b.name] = { $type: 'dimension', $value: `${b.minPx}px` };
  }
  breakpoint['fluid-min'] = { $type: 'dimension', $value: `${opts.fluidMinVw}px` };
  breakpoint['fluid-max'] = { $type: 'dimension', $value: `${opts.fluidMaxVw}px` };

  const container: Record<string, unknown> = {};
  for (const c of sortContainers(opts.containers)) {
    container[c.name] = { $type: 'dimension', $value: `${c.maxPx}px` };
  }
  container['prose-max'] = { $type: 'dimension', $value: `${opts.proseMaxCh}ch` };

  const aspect: Record<string, unknown> = {};
  for (const a of expandAspects(opts.aspectRatios, opts.includeReciprocals)) {
    aspect[a.name] = { $type: 'string', $value: formatAspect(a) };
  }

  return { spacing, breakpoint, container, aspect };
}

export function generateSpaceDesignTokens(opts: SpaceExportOptions): string {
  return JSON.stringify(spaceDesignTokens(opts), null, 2);
}

/** LLM Briefing (Markdown) */
export function generateSpaceLlmBriefing(opts: SpaceExportOptions): string {
  const { spacingTokens, breakpoints, fluidMinVw, fluidMaxVw, containers, proseMaxCh, aspectRatios, includeReciprocals, ratioLabel } = opts;

  const bps = sortBreakpoints(breakpoints);
  const cts = sortContainers(containers);
  const ars = expandAspects(aspectRatios, includeReciprocals);

  let md = `# Spacing & Layout — ${ratioLabel} — ${SOURCE}\n\n`;

  md += `## Spacing Scale\n\n`;
  md += `| Token | rem | px |\n`;
  md += `|-------|-----|----|\n`;
  for (const t of spacingTokens) {
    md += `| --space-${t.name} | ${t.rem}rem | ${t.px}px |\n`;
  }

  md += `\n## Breakpoints\n\n`;
  md += `| Name | Min Width |\n`;
  md += `|------|-----------|\n`;
  for (const b of bps) md += `| ${b.name} | ${b.minPx}px |\n`;
  md += `\nFluid viewport anchors: ${fluidMinVw}px (min) → ${fluidMaxVw}px (max).\n`;

  md += `\n## Containers\n\n`;
  md += `| Name | Max Width |\n`;
  md += `|------|-----------|\n`;
  for (const c of cts) md += `| ${c.name} | ${c.maxPx}px |\n`;
  md += `\nProse reading column: ${proseMaxCh}ch.\n`;
  for (const c of cts.filter((c) => tailwindContainerName(c.name) !== c.name)) {
    md += `\nIn the Tailwind export, container "${c.name}" is named --container-${tailwindContainerName(c.name)} so it does not override Tailwind's static w-${c.name} and max-w-${c.name} utilities.\n`;
  }

  md += `\n## Aspect Ratios\n\n`;
  md += `| Name | Ratio |\n`;
  md += `|------|-------|\n`;
  for (const a of ars) md += `| ${a.name} | ${formatAspect(a)} |\n`;

  md += `\n## Usage\n\n`;
  md += `Use the CSS custom properties from the CSS or Tailwind export.\n`;
  md += `Spacing tokens follow a ${ratioLabel} scale suitable for margins, padding, and gap values.\n`;
  md += `Combine with color tokens from standby.design/color, type tokens from standby.design/type, and shape tokens from standby.design/shape.\n`;

  if (includeReciprocals) {
    md += `\n*Portrait variants (-portrait suffix) are included for non-square ratios.*\n`;
  }

  return md;
}
