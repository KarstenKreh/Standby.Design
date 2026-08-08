/**
 * Compact, human/model-readable summaries of each tool's computed output.
 * Kept deliberately small — full exports are available via export_design_system.
 */

import type { DecodedState as ColorState } from '@core/url-state/color';
import type { UrlState as TypeState } from '@core/url-state/type';
import type { ShapeUrlState as ShapeState } from '@core/url-state/shape';
import type { UrlState as SymbolState } from '@core/url-state/symbol';
import type { SpaceUrlState } from '@core/url-state/space';
import type { ComputedLevel } from '@core/scale';
import type { SpacingToken } from '@core/spacing';
import { computeIconTokens, weightToStroke } from '@core/icon-tokens';
import { ICON_SETS, getSetById, type IconSetDefinition } from '@core/icon-sets';
import { recommendSets } from '@core/recommend';
import { fontFamily } from '@core/fontshare';
import { type PaletteResult, stepHex } from './lib.js';

export function colorSummary(state: ColorState, palette: PaletteResult): string {
  const lines: string[] = [];
  const name = state.themeName && state.themeName !== 'Standby.Design' ? ` · theme "${state.themeName}"` : '';
  lines.push(`## Color — brand ${state.brandHex} · mode ${state.currentMode} · surface chroma ${Math.round(state.chromaScale * 100)}%${name}`);
  lines.push('');
  lines.push(`Brand scale: ${palette.brand.map(e => `${e.step}:${e.hex}`).join(' ')}`);
  lines.push(`Surface scale: ${palette.surface.map(e => `${e.step}:${e.hex}`).join(' ')}`);
  lines.push(`Error: ${palette.effectiveErrorHex}${state.errorAutoMatch ? ' (auto-derived from brand hue)' : ''}`);
  if (palette.accentPalettes.length > 0) {
    lines.push(`Accents: ${palette.accentPalettes.map(a => `${a.name} ${a.hex}${a.pin ? ' (pinned)' : ''}`).join(' · ')}`);
  }
  lines.push('');
  lines.push('Key semantic tokens (light/dark):');
  lines.push(`- primary: ${state.brandPin ? state.brandHex + ' (pinned)' : `${stepHex(palette.brand, 600)} / ${stepHex(palette.brand, 400)}`}`);
  lines.push(`- background: ${stepHex(palette.surface, 50)} / ${stepHex(palette.surface, 875)}`);
  lines.push(`- destructive: ${state.errorPin ? palette.effectiveErrorHex + ' (pinned)' : `${stepHex(palette.error, 600)} / ${stepHex(palette.error, 400)}`}`);
  return lines.join('\n');
}

export function typeSummary(state: TypeState, scale: ComputedLevel[]): string {
  const lines: string[] = [];
  const modeLabel = state.scaleMode === 'traditional'
    ? 'traditional scale'
    : `custom ratio ${state.customRatio} (mobile ${state.mobileRatio})`;
  lines.push(`## Typography — ${modeLabel} · base ${state.baseSize}rem`);
  lines.push(`Fonts: heading ${fontFamily(state.headingFont)} (${state.headingFont}, weight ${state.headingWeight}) · body ${fontFamily(state.bodyFont)} (${state.bodyFont}) · mono ${fontFamily(state.monoFont)} (${state.monoFont})`);
  lines.push('');
  lines.push('Level | Mobile→Desktop | Line-height | Letter-spacing');
  for (const l of scale) {
    const size = l.isFluid ? `${l.minRem}rem → ${l.maxRem}rem` : `${l.maxRem}rem`;
    lines.push(`${l.label} | ${size} | ${l.lineHeight} | ${l.letterSpacing}em`);
  }
  return lines.join('\n');
}

export function spaceSummary(state: SpaceUrlState, spacing: SpacingToken[]): string {
  const lines: string[] = [];
  const mode = state.spacingMode === 'geometric'
    ? `geometric ×${state.spacingRatio}`
    : 'harmonic multiples';
  lines.push(`## Spacing & Layout — ${mode} · base ${state.spacingBaseRem}rem · multiplier ${state.spacingMultiplier}× · snap ${state.spacingSnap ? 'on' : 'off'}`);
  lines.push(`Spacing: ${spacing.map(t => `${t.name}:${t.rem}rem`).join(' ')}`);
  lines.push(`Breakpoints: ${state.breakpoints.map(b => `${b.name}:${b.minPx}px`).join(' ')}`);
  lines.push(`Containers: ${state.containers.map(c => `${c.name}:${c.maxPx}px`).join(' ')} · prose ${state.proseMaxCh}ch`);
  lines.push(`Aspect ratios: ${state.aspectRatios.map(a => `${a.name} ${a.w}:${a.h}`).join(' · ')}${state.aspectIncludeReciprocals ? ' (+ reciprocals)' : ''}`);
  lines.push(`Fluid viewport anchors: ${state.fluidMinVw}px → ${state.fluidMaxVw}px`);
  return lines.join('\n');
}

export function shapeSummary(state: ShapeState): string {
  const lines: string[] = [];
  lines.push(`## Shape — style ${state.shapeStyle} · radius base ${state.borderRadius}px`);
  switch (state.shapeStyle) {
    case 'paper':
      lines.push(`Shadows: ${state.shadowEnabled ? `${state.shadowType}, strength ${state.shadowStrength}, blur ×${state.shadowBlurScale}, level spread ×${state.shadowScale}` : 'off'} (color ${state.shadowColorMode === 'custom' ? state.shadowCustomColor : 'auto'})`);
      break;
    case 'glass':
      lines.push(`Glass: depth ${state.glassDepth} · blur ${state.glassBlur} · dispersion ${state.glassDispersion}`);
      break;
    case 'neomorph':
      lines.push(`Neumorphic shadows: strength ${state.shadowStrength}, blur ×${state.shadowBlurScale}`);
      break;
    case 'neobrutalism':
      lines.push(`Brutalist: variant ${state.brutalistVariant} · shadow offset ${state.shadowOffsetX}px/${state.shadowOffsetY}px`);
      break;
  }
  lines.push(`Border: ${state.borderEnabled ? `${state.borderWidth}px (color ${state.borderColorMode === 'custom' ? state.borderCustomColor : 'auto'})` : 'off'}`);
  const ringShape = state.ringStyle === 'solid'
    ? `solid outline, ${state.ringOffset}px offset`
    : 'soft halo at the edge plus a full-color border';
  lines.push(`Focus ring: ${state.ringWidth}px width, ${ringShape} (color ${state.ringColorMode === 'custom' ? state.ringCustomColor : 'auto'})`);
  lines.push(`Separation mode: ${state.separationMode}`);
  return lines.join('\n');
}

export function resolveIconSet(state: SymbolState): { set: IconSetDefinition; selected: boolean } {
  if (state.selectedSet) {
    const set = getSetById(state.selectedSet);
    if (set) return { set, selected: true };
  }
  const recommended = recommendSets({
    style: state.preferredStyle,
    mood: 50,
    weight: state.preferredWeight,
    corners: state.preferredCorners,
  });
  return { set: recommended[0]?.set || ICON_SETS[0], selected: false };
}

export function symbolSummary(state: SymbolState): string {
  const { set, selected } = resolveIconSet(state);
  const tokens = computeIconTokens(state.iconBaseSize, state.iconScale, weightToStroke(set.strokeWeight), state.snapTo4px);
  const lines: string[] = [];
  lines.push(`## Icons — ${selected ? 'selected' : 'recommended'}: ${set.name} (${set.id})`);
  lines.push(`${set.description} · install: npm install ${set.npmPackage}`);
  lines.push(`Style ${set.style} · weight ${set.strokeWeight} · corners ${set.cornerStyle}`);
  lines.push(`Sizes (base ${state.iconBaseSize}rem, scale ×${state.iconScale}${state.snapTo4px ? ', 4px snap' : ''}): ${tokens.sizes.map(s => `${s.name}:${s.px}px`).join(' ')} · stroke ${tokens.strokeWidth}px`);
  return lines.join('\n');
}
