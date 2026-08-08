// Code export — generates CSS custom property strings

import { hexToOklch, contrastRatio, invertHex } from '@core/color-math';
import type { PaletteEntry } from '@core/palette';
import type { AccentPalette } from '@/hooks/use-palette';
import type { FgContrastMode } from '@/store/theme-store';
import { encodeState as encodeColorState, type DecodedState as ColorSeedState } from '@core/url-state/color';

/**
 * Seed documentation header for code exports: records every input that went
 * into the theme plus a Restore URL, so a generated theme can be traced and
 * rebuilt later (issue #1).
 */
export function generateSeedComment(
  state: ColorSeedState,
  effectiveBgHex: string,
  effectiveErrorHex: string,
): string {
  const title = state.themeName && state.themeName !== 'Standby.Design' ? `${state.themeName} — ` : '';
  const accents = state.extraAccents.map(a =>
    `${a.name} ${a.autoMatch ? `auto (hue ${Math.round(a.autoHue)}°)` : a.hex}${a.pin ? ', pinned' : ''}`
  ).join(' · ');
  const lines = [
    `/*`,
    ` * ${title}generated with standby.design`,
    ` * Seed: brand ${state.brandHex}${state.brandPin ? ' (pinned)' : ''}${state.brandInvert ? ' (dark-inverted)' : ''} · mode ${state.currentMode} · text contrast ${state.fgContrastMode}`,
    ` * Surface: ${state.bgAutoMatch ? 'auto from brand' : state.bgColorHex} → ${effectiveBgHex} · chroma ${Math.round(state.chromaScale * 100)}%`,
    ` * Error: ${state.errorAutoMatch ? 'auto from brand hue' : state.errorColorHex} → ${effectiveErrorHex}${state.errorPin ? ' (pinned)' : ''}${state.errorInvert ? ' (dark-inverted)' : ''}`,
    ...(accents ? [` * Accents: ${accents}`] : []),
    ` * Restore: https://standby.design/color#c=${encodeColorState(state)}`,
    ` */`,
  ];
  return lines.join('\n') + '\n\n';
}

interface PaletteMap { [step: number]: PaletteEntry }

function palMap(arr: PaletteEntry[]): PaletteMap {
  return Object.fromEntries(arr.map(r => [r.step, r]));
}

function fgStep(bgHex: string | undefined, pMap: PaletteMap, ls: number, ds: number, fgMode: FgContrastMode): number {
  if (!bgHex) return ls;
  const lightHex = pMap[ls]?.hex;
  const darkHex = pMap[ds]?.hex;
  const lightCR = lightHex ? contrastRatio(lightHex, bgHex) : 0;
  const darkCR = darkHex ? contrastRatio(darkHex, bgHex) : 0;
  if (fgMode === 'preferDark') {
    if (darkCR >= 4.5) return ds;          // preferred passes → use it
    if (lightCR >= 4.5) return ls;         // only other passes → use other
    return ds;                              // neither passes → honor preference
  }
  if (fgMode === 'preferLight') {
    if (lightCR >= 4.5) return ls;         // preferred passes → use it
    if (darkCR >= 4.5) return ds;          // only other passes → use other
    return ls;                              // neither passes → honor preference
  }
  return lightCR >= darkCR ? ls : ds;
}

const AA_CONTRAST = 4.5;
const FILL_FG_LIGHT_STEP = 25;
const FILL_FG_DARK_STEP = 975;

interface FgPick { step: number; cr: number; passes: boolean }

function fillFgPick(bgHex: string, pMap: PaletteMap, fgMode: FgContrastMode): FgPick {
  const rate = (step: number) => ({ step, cr: pMap[step]?.hex ? contrastRatio(pMap[step].hex, bgHex) : 0 });
  const rated = [rate(FILL_FG_LIGHT_STEP), rate(FILL_FG_DARK_STEP)];
  if (fgMode === 'preferDark') rated.reverse();
  else if (fgMode !== 'preferLight') rated.sort((a, b) => b.cr - a.cr);

  const winner = rated.find(c => c.cr >= AA_CONTRAST) || rated[0];
  return { step: winner.step, cr: winner.cr, passes: winner.cr >= AA_CONTRAST };
}

function fillFgRow(name: string, bgHex: string | undefined, pMap: PaletteMap, pfx: string, fgMode: FgContrastMode): Row {
  if (!bgHex) return [name, pfx, FILL_FG_LIGHT_STEP];
  return [name, pfx, fillFgPick(bgHex, pMap, fgMode).step];
}

export interface FillContrastWarning {
  token: string;
  mode: 'light' | 'dark';
  text: string;
}

function fillWarning(token: string, mode: 'light' | 'dark', bgHex: string | undefined, pMap: PaletteMap, fgMode: FgContrastMode): FillContrastWarning[] {
  if (!bgHex) return [];
  const pick = fillFgPick(bgHex, pMap, fgMode);
  if (pick.passes) return [];
  return [{
    token,
    mode,
    text: `⚠ --${token} reaches only ${pick.cr.toFixed(2)}:1 on --${token.replace(/-foreground$/, '')} (${mode} mode) — below WCAG AA 4.5:1. Neither step ${FILL_FG_LIGHT_STEP} nor step ${FILL_FG_DARK_STEP} of this palette passes: the seed color sits too close to mid lightness for readable text on it. Do not put text on this fill, or pick a lighter or darker seed.`,
  }];
}

export function collectFillContrastWarnings(
  accentPalettes: AccentPalette[],
  brandPal: PaletteEntry[], errPal: PaletteEntry[], errSurfPal: PaletteEntry[],
  brandPin: boolean, pinnedBrandHex: string | null, brandInvert: boolean,
  errorPin: boolean, pinnedErrorHex: string | null, errorInvert: boolean,
  fgMode: FgContrastMode,
): FillContrastWarning[] {
  const brandMap = palMap(brandPal);
  const errMap = palMap(errPal);
  const errSurfMap = palMap(errSurfPal);

  const bHex = brandPin ? pinnedBrandHex : null;
  const bInvHex = bHex && brandInvert ? invertHex(bHex) : null;
  const eHex = errorPin ? pinnedErrorHex : null;
  const eInvHex = eHex && errorInvert ? invertHex(eHex) : null;

  const out: FillContrastWarning[] = [
    ...fillWarning('primary-foreground', 'light', bHex || brandMap[600]?.hex, brandMap, fgMode),
    ...fillWarning('primary-foreground', 'dark', bHex ? (bInvHex || bHex) : brandMap[400]?.hex, brandMap, fgMode),
    ...fillWarning('destructive-foreground', 'light', eHex || errMap[600]?.hex, errSurfMap, fgMode),
    ...fillWarning('destructive-foreground', 'dark', eHex ? (eInvHex || eHex) : errMap[400]?.hex, errSurfMap, fgMode),
  ];

  accentPalettes.forEach(entry => {
    const aMap = palMap(entry.palette || []);
    const aHex = entry.pin ? entry.hex : null;
    const aInvHex = aHex && entry.invert ? invertHex(aHex) : null;
    out.push(
      ...fillWarning(`${entry.cssName}-foreground`, 'light', aHex || aMap[600]?.hex, aMap, fgMode),
      ...fillWarning(`${entry.cssName}-foreground`, 'dark', aHex ? (aInvHex || aHex) : aMap[400]?.hex, aMap, fgMode),
    );
  });

  return out;
}

function hexToCss(hex: string): string {
  const [L, C, H] = hexToOklch(hex);
  return `oklch(${L.toFixed(4)} ${C.toFixed(4)} ${H.toFixed(2)})`;
}

// Generate primitive token section for a palette
function fmtSec(palette: PaletteEntry[], prefix: string, mode: 'css' | 'hex'): string {
  const gs = [
    { l: 'Light Surfaces', f: (r: PaletteEntry) => r.step <= 100 },
    { l: 'Core', f: (r: PaletteEntry) => r.step >= 200 && r.step <= 800 },
    { l: 'Dark Surfaces (normal)', f: (r: PaletteEntry) => r.step >= 825 && r.step <= 875 },
    { l: 'Dark Surfaces (high contrast)', f: (r: PaletteEntry) => r.step >= 900 },
  ];
  let out = '';
  gs.forEach((g, i) => {
    if (i > 0) out += '\n';
    out += `  /* ${g.l} */\n`;
    palette.filter(g.f).forEach(r => {
      const v = mode === 'css' ? r.css : r.hex;
      out += `  --color-${prefix}-${r.step}: ${v};\n`;
    });
  });
  return out;
}

type Row = [string, string | null, string | number];

function buildBlock(sel: string, rows: Row[]): string {
  let o = `${sel} {\n`;
  rows.forEach(([name, prefix, step]) => {
    if (name === '#comment') o += `  /* ${step} */\n`;
    else if (prefix === null) o += `  /* ${step} */\n`;
    else if (prefix === '#direct') o += `  --${name}: ${step};\n`;
    else o += `  --${name}: var(--color-${prefix}-${step});\n`;
  });
  return o + `}\n`;
}

// Generate primitives OKLCH block
export function generatePrimitivesOklch(
  brand: PaletteEntry[], surface: PaletteEntry[], error: PaletteEntry[],
  errorSurface: PaletteEntry[], neutralExtended: PaletteEntry[],
  accentPalettes: AccentPalette[], chromaScale: number, customBgHex: string | null,
  themeName: string
): string {
  const pct = Math.round(chromaScale * 100);
  const bgLabel = customBgHex ? `${pct}% chroma — base ${customBgHex}` : `${pct}% chroma`;
  const header = themeName ? `/* ${themeName} — Primitive Tokens */` : `/* Primitive Tokens */`;
  const cmt = (t: string) => `\n  /* ${t} */\n`;

  let o = `${header}\n:root {\n`;
  o += cmt('Brand') + fmtSec(brand, 'brand', 'css');
  o += cmt(`Surface — ${bgLabel}`) + fmtSec(surface, 'surface', 'css');
  o += cmt('Error') + fmtSec(error, 'error', 'css');
  o += cmt(`Error Surface — ${pct}% chroma`) + fmtSec(errorSurface, 'error-surface', 'css');
  o += cmt('Neutral') + fmtSec(neutralExtended, 'neutral', 'css');
  accentPalettes.forEach(entry => {
    o += cmt(entry.name) + fmtSec(entry.palette, entry.cssName, 'css');
    o += cmt(`${entry.name} Surface — ${pct}% chroma`) + fmtSec(entry.slatedPalette, entry.cssName + '-surface', 'css');
  });
  o += `}`;
  return o;
}

// Generate primitives Hex block
export function generatePrimitivesHex(
  brand: PaletteEntry[], surface: PaletteEntry[], error: PaletteEntry[],
  errorSurface: PaletteEntry[], neutralExtended: PaletteEntry[],
  accentPalettes: AccentPalette[], chromaScale: number, customBgHex: string | null,
  themeName: string
): string {
  const pct = Math.round(chromaScale * 100);
  const bgLabel = customBgHex ? `${pct}% chroma — base ${customBgHex}` : `${pct}% chroma`;
  const header = themeName ? `/* ${themeName} — Primitive Tokens (Hex) */` : `/* Primitive Tokens (Hex) */`;
  const cmt = (t: string) => `\n  /* ${t} */\n`;

  let h = `${header}\n:root {\n`;
  h += cmt('Brand') + fmtSec(brand, 'brand', 'hex');
  h += cmt(`Surface — ${bgLabel}`) + fmtSec(surface, 'surface', 'hex');
  h += cmt('Error') + fmtSec(error, 'error', 'hex');
  h += cmt(`Error Surface — ${pct}% chroma`) + fmtSec(errorSurface, 'error-surface', 'hex');
  h += cmt('Neutral') + fmtSec(neutralExtended, 'neutral', 'hex');
  accentPalettes.forEach(entry => {
    h += cmt(entry.name) + fmtSec(entry.palette, entry.cssName, 'hex');
    h += cmt(`${entry.name} Surface — ${pct}% chroma`) + fmtSec(entry.slatedPalette, entry.cssName + '-surface', 'hex');
  });
  h += `}`;
  return h;
}

// Generate semantic tokens block
export function generateSemantic(
  accentPalettes: AccentPalette[],
  brandPal: PaletteEntry[], errPal: PaletteEntry[], errSurfPal: PaletteEntry[], surfacePal: PaletteEntry[],
  brandPin: boolean, pinnedBrandHex: string | null, brandInvert: boolean,
  errorPin: boolean, pinnedErrorHex: string | null, errorInvert: boolean,
  fgMode: FgContrastMode, themeName: string
): string {
  const brandMap = palMap(brandPal);
  const errMap = palMap(errPal);
  const errSurfMap = palMap(errSurfPal);
  const surfMap = palMap(surfacePal);

  const bPin = brandPin;
  const bHex = pinnedBrandHex;
  const ePin = errorPin;
  const eHex = pinnedErrorHex;

  // Brand pin
  const bCss = bPin && bHex ? hexToCss(bHex) : null;

  // Inverted brand for dark mode (lightness mirrored, hue/chroma preserved)
  const bInvHex = bPin && bHex && brandInvert ? invertHex(bHex) : null;
  const bInvCss = bInvHex ? hexToCss(bInvHex) : null;

  const primaryFillLight = bPin && bHex ? bHex : brandMap[600]?.hex;
  const primaryFillDark = bPin && bHex ? (bInvHex || bHex) : brandMap[400]?.hex;

  const primaryLight: Row   = bPin && bHex ? ['primary', '#direct', bCss!] : ['primary', 'brand', 600];
  const primaryFgLight: Row = fillFgRow('primary-foreground', primaryFillLight, brandMap, 'brand', fgMode);
  const primaryDark: Row    = bPin && bHex ? (bInvCss ? ['primary', '#direct', bInvCss] : ['primary', '#direct', bCss!]) : ['primary', 'brand', 400];
  const primaryFgDark: Row  = fillFgRow('primary-foreground', primaryFillDark, brandMap, 'brand', fgMode);
  const sbPrimLight: Row    = bPin && bHex ? ['sidebar-primary', '#direct', bCss!] : ['sidebar-primary', 'brand', 600];
  const sbPrimFgLight: Row  = fillFgRow('sidebar-primary-foreground', primaryFillLight, brandMap, 'brand', fgMode);
  const sbPrimDark: Row     = bPin && bHex ? (bInvCss ? ['sidebar-primary', '#direct', bInvCss] : ['sidebar-primary', '#direct', bCss!]) : ['sidebar-primary', 'brand', 400];
  const sbPrimFgDark: Row   = fillFgRow('sidebar-primary-foreground', primaryFillDark, brandMap, 'brand', fgMode);

  const fillWarnings = collectFillContrastWarnings(
    accentPalettes, brandPal, errPal, errSurfPal,
    brandPin, pinnedBrandHex, brandInvert,
    errorPin, pinnedErrorHex, errorInvert,
    fgMode,
  );
  const warnRows = (token: string, mode: 'light' | 'dark'): Row[] =>
    fillWarnings.filter(w => w.token === token && w.mode === mode).map(w => ['#comment', null, w.text] as Row);

  const ringLight: Row      = bPin && bHex ? ['ring', '#direct', bCss!] : ['ring', 'brand', 600];
  const ringDark: Row       = bPin && bHex ? (bInvCss ? ['ring', '#direct', bInvCss] : ['ring', '#direct', bCss!]) : ['ring', 'brand', 400];
  const sbRingLight: Row    = bPin && bHex ? ['sidebar-ring', '#direct', bCss!] : ['sidebar-ring', 'brand', 600];
  const sbRingDark: Row     = bPin && bHex ? (bInvCss ? ['sidebar-ring', '#direct', bInvCss] : ['sidebar-ring', '#direct', bCss!]) : ['sidebar-ring', 'brand', 400];

  // Contrast warning for pinned brand used as text color
  const brandContrastWarnLight: Row[] = [];
  const brandContrastWarnDark: Row[] = [];
  if (bPin && bHex) {
    const lightBg = surfMap[50]?.hex;
    const darkBg = surfMap[875]?.hex;
    const darkCheckHex = bInvHex || bHex;
    const lightFail = lightBg ? contrastRatio(bHex, lightBg) < 4.5 : false;
    const darkFail = darkBg ? contrastRatio(darkCheckHex, darkBg) < 4.5 : false;
    if (lightFail) {
      brandContrastWarnLight.push(['#comment', null,
        `⚠ Pinned primary has low contrast on light surfaces — do not use as text color. Use --foreground for text on light backgrounds.`]);
    }
    if (darkFail) {
      brandContrastWarnDark.push(['#comment', null,
        `⚠ Pinned primary has low contrast on dark surfaces — do not use as text color. Use --foreground for text on dark backgrounds.`]);
    }
  }

  // Error pin
  const eCss = ePin && eHex ? hexToCss(eHex) : null;
  const eInvHex = ePin && eHex && errorInvert ? invertHex(eHex) : null;
  const eInvCss = eInvHex ? hexToCss(eInvHex) : null;

  const destFillLight = ePin && eHex ? eHex : errMap[600]?.hex;
  const destFillDark = ePin && eHex ? (eInvHex || eHex) : errMap[400]?.hex;

  const destLight: Row   = ePin && eHex ? ['destructive', '#direct', eCss!] : ['destructive', 'error', 600];
  const destFgLight: Row = fillFgRow('destructive-foreground', destFillLight, errSurfMap, 'error-surface', fgMode);
  const destDark: Row    = ePin && eHex ? (eInvCss ? ['destructive', '#direct', eInvCss] : ['destructive', '#direct', eCss!]) : ['destructive', 'error', 400];
  const destFgDark: Row  = fillFgRow('destructive-foreground', destFillDark, errSurfMap, 'error-surface', fgMode);

  const root = buildBlock(':root', [
    [null as unknown as string, null, 'Base'],
    ['background', 'surface', 50], ['foreground', 'surface', 975],
    [null as unknown as string, null, 'Card'],
    ['card', 'surface', 25], ['card-foreground', 'surface', 975],
    [null as unknown as string, null, 'Elevated — sits on a card'],
    ['elevated', 'surface', 0], ['elevated-foreground', 'surface', 975],
    [null as unknown as string, null, 'Popover'],
    ['popover', 'surface', 25], ['popover-foreground', 'surface', 975],
    [null as unknown as string, null, 'Primary'],
    primaryLight, primaryFgLight,
    ...warnRows('primary-foreground', 'light'),
    ...brandContrastWarnLight,
    ['primary-subtle', 'brand', 100], ['primary-subtle-foreground', 'brand', 950],
    ['primary-emphasis', 'brand', 700],
    [null as unknown as string, null, 'Secondary — softened brand'],
    ['secondary', 'brand', 200], ['secondary-foreground', 'brand', fgStep(brandMap[200]?.hex, brandMap, 100, 900, fgMode)],
    [null as unknown as string, null, 'Muted'],
    ['muted', 'surface', 75], ['muted-foreground', 'surface', 700],
    [null as unknown as string, null, 'Accent'],
    ['accent', 'brand', 100], ['accent-foreground', 'brand', fgStep(brandMap[100]?.hex, brandMap, 50, 950, fgMode)],
    [null as unknown as string, null, 'Destructive'],
    destLight, destFgLight,
    ...warnRows('destructive-foreground', 'light'),
    ['destructive-subtle', 'error', 100], ['destructive-subtle-foreground', 'error', 950],
    ['destructive-emphasis', 'error', 700],
    ['destructive-border', 'error-surface', 300],
    [null as unknown as string, null, 'Border / Input / Ring'],
    ['border', 'surface', 300], ['border-muted', 'surface', 200],
    ['input', 'surface', 300], ['input-hover', 'surface', 400], ringLight,
    [null as unknown as string, null, 'Sidebar'],
    ['sidebar', 'surface', 25], ['sidebar-foreground', 'surface', 975],
    sbPrimLight, sbPrimFgLight,
    ['sidebar-accent', 'brand', 100], ['sidebar-accent-foreground', 'brand', fgStep(brandMap[100]?.hex, brandMap, 50, 950, fgMode)],
    ['sidebar-border', 'surface', 300], sbRingLight,
  ]);

  const dark = buildBlock('.dark', [
    [null as unknown as string, null, 'Base'],
    ['background', 'surface', 875], ['foreground', 'surface', 25],
    [null as unknown as string, null, 'Card'],
    ['card', 'surface', 825], ['card-foreground', 'surface', 25],
    [null as unknown as string, null, 'Elevated — sits on a card'],
    ['elevated', 'surface', 800], ['elevated-foreground', 'surface', 25],
    [null as unknown as string, null, 'Popover'],
    ['popover', 'surface', 825], ['popover-foreground', 'surface', 25],
    [null as unknown as string, null, 'Primary'],
    primaryDark, primaryFgDark,
    ...warnRows('primary-foreground', 'dark'),
    ...brandContrastWarnDark,
    ['primary-subtle', 'brand', 850], ['primary-subtle-foreground', 'brand', 50],
    ['primary-emphasis', 'brand', 300],
    [null as unknown as string, null, 'Secondary — softened brand'],
    ['secondary', 'brand', 800], ['secondary-foreground', 'brand', fgStep(brandMap[800]?.hex, brandMap, 100, 900, fgMode)],
    [null as unknown as string, null, 'Muted'],
    ['muted', 'surface', 850], ['muted-foreground', 'surface', 300],
    [null as unknown as string, null, 'Accent'],
    ['accent', 'brand', 850], ['accent-foreground', 'brand', fgStep(brandMap[850]?.hex, brandMap, 50, 950, fgMode)],
    [null as unknown as string, null, 'Destructive'],
    destDark, destFgDark,
    ...warnRows('destructive-foreground', 'dark'),
    ['destructive-subtle', 'error', 850], ['destructive-subtle-foreground', 'error', 50],
    ['destructive-emphasis', 'error', 300],
    ['destructive-border', 'error-surface', 700],
    [null as unknown as string, null, 'Border / Input / Ring'],
    ['border', 'surface', 600], ['border-muted', 'surface', 700],
    ['input', 'surface', 600], ['input-hover', 'surface', 500], ringDark,
    [null as unknown as string, null, 'Sidebar'],
    ['sidebar', 'surface', 825], ['sidebar-foreground', 'surface', 25],
    sbPrimDark, sbPrimFgDark,
    ['sidebar-accent', 'brand', 850], ['sidebar-accent-foreground', 'brand', fgStep(brandMap[850]?.hex, brandMap, 50, 950, fgMode)],
    ['sidebar-border', 'surface', 600], sbRingDark,
  ]);

  let accentBlocks = '';
  accentPalettes.forEach(entry => {
    const n = entry.cssName;
    const aPin = !!entry.pin;
    const aInv = !!entry.invert;
    const aHex = entry.hex;
    const aCss = aPin ? hexToCss(aHex) : null;
    const aMap = palMap(entry.palette || []);
    const aInvHex = aPin && aInv ? invertHex(aHex) : null;
    const aInvCss = aInvHex ? hexToCss(aInvHex) : null;

    const aFillLight = aPin ? aHex : aMap[600]?.hex;
    const aFillDark = aPin ? (aInvHex || aHex) : aMap[400]?.hex;

    const aLight: Row = aPin ? [n, '#direct', aCss!] : [n, n, 600];
    const aFgL: Row = fillFgRow(`${n}-foreground`, aFillLight, aMap, n, fgMode);
    const aDark: Row = aPin ? (aInvCss ? [n, '#direct', aInvCss] : [n, '#direct', aCss!]) : [n, n, 400];
    const aFgD: Row = fillFgRow(`${n}-foreground`, aFillDark, aMap, n, fgMode);

    const accentRoot = buildBlock(':root', [
      [null as unknown as string, null, `${entry.name} — light`],
      aLight, aFgL,
      ...warnRows(`${n}-foreground`, 'light'),
      [null as unknown as string, null, 'Background / Card / Elevated / Popover'],
      [`${n}-background`, `${n}-surface`, 50], [`${n}-background-foreground`, `${n}-surface`, 975],
      [`${n}-card`, `${n}-surface`, 25], [`${n}-card-foreground`, `${n}-surface`, 975],
      [`${n}-elevated`, `${n}-surface`, 0], [`${n}-elevated-foreground`, `${n}-surface`, 975],
      [`${n}-popover`, `${n}-surface`, 25], [`${n}-popover-foreground`, `${n}-surface`, 975],
      [null as unknown as string, null, 'Secondary'],
      [`${n}-secondary`, n, 200], [`${n}-secondary-foreground`, n, fgStep(aMap[200]?.hex, aMap, 100, 900, fgMode)],
      [null as unknown as string, null, 'Muted / Subtle / Accent'],
      [`${n}-muted`, `${n}-surface`, 75], [`${n}-muted-foreground`, `${n}-surface`, 700],
      [`${n}-accent`, n, 100], [`${n}-accent-foreground`, n, fgStep(aMap[100]?.hex, aMap, 50, 950, fgMode)],
      [`${n}-subtle`, n, 100], [`${n}-subtle-foreground`, n, 950],
      [`${n}-emphasis`, n, 700],
      [null as unknown as string, null, 'Border / Input / Ring'],
      [`${n}-border`, `${n}-surface`, 300], [`${n}-border-muted`, `${n}-surface`, 200],
      [`${n}-input`, `${n}-surface`, 300], [`${n}-input-hover`, `${n}-surface`, 400], [`${n}-ring`, n, 600],
    ]);
    const accentDark = buildBlock('.dark', [
      [null as unknown as string, null, `${entry.name} — dark`],
      aDark, aFgD,
      ...warnRows(`${n}-foreground`, 'dark'),
      [null as unknown as string, null, 'Background / Card / Elevated / Popover'],
      [`${n}-background`, `${n}-surface`, 875], [`${n}-background-foreground`, `${n}-surface`, 25],
      [`${n}-card`, `${n}-surface`, 825], [`${n}-card-foreground`, `${n}-surface`, 25],
      [`${n}-elevated`, `${n}-surface`, 800], [`${n}-elevated-foreground`, `${n}-surface`, 25],
      [`${n}-popover`, `${n}-surface`, 825], [`${n}-popover-foreground`, `${n}-surface`, 25],
      [null as unknown as string, null, 'Secondary'],
      [`${n}-secondary`, n, 800], [`${n}-secondary-foreground`, n, fgStep(aMap[800]?.hex, aMap, 100, 900, fgMode)],
      [null as unknown as string, null, 'Muted / Subtle / Accent'],
      [`${n}-muted`, `${n}-surface`, 850], [`${n}-muted-foreground`, `${n}-surface`, 300],
      [`${n}-accent`, n, 850], [`${n}-accent-foreground`, n, fgStep(aMap[850]?.hex, aMap, 50, 950, fgMode)],
      [`${n}-subtle`, n, 850], [`${n}-subtle-foreground`, n, 50],
      [`${n}-emphasis`, n, 300],
      [null as unknown as string, null, 'Border / Input / Ring'],
      [`${n}-border`, `${n}-surface`, 600], [`${n}-border-muted`, `${n}-surface`, 700],
      [`${n}-input`, `${n}-surface`, 600], [`${n}-input-hover`, `${n}-surface`, 500], [`${n}-ring`, n, 400],
    ]);
    accentBlocks += `\n/* ${entry.name} Accent — semantic tokens */\n` + accentRoot + '\n' + accentDark;
  });

  const header = themeName
    ? `/* ${themeName} — Semantic Tokens (shadcn/ui compatible) */\n`
    : `/* Semantic Tokens — shadcn/ui compatible */\n`;
  return header + root + '\n' + dark + accentBlocks;
}

// Generate LLM briefing — a human/LLM-readable usage guide for the theme
export function generateLlmBriefing(
  brandHex: string,
  effectiveBgHex: string,
  effectiveErrorHex: string,
  accentPalettes: AccentPalette[],
  chromaScale: number,
  mode: 'balanced' | 'exact',
  brandPin: boolean,
  errorPin: boolean,
  themeName: string,
  fgContrastMode: FgContrastMode,
  fillContrastWarnings: FillContrastWarning[] = [],
): string {
  const pct = Math.round(chromaScale * 100);
  const title = themeName || 'Untitled Theme';

  const fgLabel = fgContrastMode === 'best' ? 'Best Contrast (auto)' :
    fgContrastMode === 'preferLight' ? 'Prefer Light' : 'Prefer Dark';

  const colorRows = [
    `| Brand | \`${brandHex}\` | \`--color-brand-*\` | Primary interactive color${brandPin ? ' (pinned)' : ''} |`,
    `| Surface | \`${effectiveBgHex}\` | \`--color-surface-*\` | Background/container tint at ${pct}% chroma |`,
    `| Error | \`${effectiveErrorHex}\` | \`--color-error-*\` | Destructive/alert color${errorPin ? ' (pinned)' : ''} |`,
    `| Neutral | derived | \`--color-neutral-*\` | 0% chroma variant for high-contrast surfaces |`,
    ...accentPalettes.map(a =>
      `| ${a.name} | \`${a.hex}\` | \`--color-${a.cssName}-*\` | Additional accent${a.pin ? ' (pinned)' : ''} |`
    ),
  ].join('\n');

  const pinnedNote = (brandPin || errorPin || accentPalettes.some(a => a.pin))
    ? `\n> **Pinned** means the exact input hex is used instead of the generated palette step — for the primary (\`brand-600/400\`), destructive (\`error-600/400\`), or accent (\`{accent}-600/400\`) role of that color.\n`
    : '';

  let pinnedContrastWarning = '';
  if (brandPin) {
    pinnedContrastWarning = `
> ⚠ **Contrast warning — pinned primary**: The pinned brand color (\`${brandHex}\`) may not have sufficient contrast (WCAG AA 4.5:1) against your surface backgrounds when used as a text color. **Do not use \`--primary\` for body text.** Use \`--foreground\` for general text. \`--primary-foreground\` is only for text on primary-colored backgrounds (e.g. buttons).
`;
  }

  const fillWarningBlock = fillContrastWarnings.length ? `
> ⚠ **Contrast warning — text on filled color roles**: Neither the lightest nor the darkest step of the palette reaches WCAG AA 4.5:1 on these fills. Avoid text on them, or move the seed color further away from mid lightness.
>
${fillContrastWarnings.map(w => `> - ${w.text.replace(/^⚠ /, '')}`).join('\n')}
` : '';

  return `# ${title} — Theme Briefing

All colors are generated in the **OKLCH** color space (perceptually uniform). Gamut mapping to sRGB is handled automatically — you never need to worry about out-of-gamut values.

## Seed Colors

| Role | Hex | CSS prefix | Notes |
|------|-----|------------|-------|
${colorRows}
${pinnedNote}${pinnedContrastWarning}${fillWarningBlock}
## Semantic Token Mapping

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| \`--background\` | surface-50 | surface-875 | Page background |
| \`--foreground\` | surface-975 | surface-25 | Primary text |
| \`--card\` | surface-25 | surface-825 | Card backgrounds |
| \`--elevated\` | surface-0 | surface-800 | Sits **on** a card: input fills, lists inside cards, selected rows |
| \`--popover\` | surface-25 | surface-825 | Popover/dropdown |
| \`--primary\` | brand-600 | brand-400 | Primary buttons, links |
| \`--primary-subtle\` | brand-100 | brand-850 | Tinted brand fills: callouts, selected items |
| \`--primary-emphasis\` | brand-700 | brand-300 | Brand-colored text, links, icons on background |
| \`--secondary\` | brand-200 | brand-800 | Secondary buttons |
| \`--muted\` | surface-75 | surface-850 | Muted backgrounds |
| \`--accent\` | brand-100 | brand-850 | Interaction highlights (hover, selected) |
| \`--destructive\` | error-600 | error-400 | Error/delete actions |
| \`--destructive-subtle\` | error-100 | error-850 | Inline errors, alert backgrounds |
| \`--destructive-emphasis\` | error-700 | error-300 | Error text and icons on background |
| \`--destructive-border\` | error-surface-300 | error-surface-700 | Error borders |
| \`--border\` | surface-300 | surface-600 | Default borders |
| \`--border-muted\` | surface-200 | surface-700 | Subtle separators |
| \`--input\` | surface-300 | surface-600 | Form-control borders (input, select, textarea) |
| \`--input-hover\` | surface-400 | surface-500 | Form-control border on hover — one rung stronger, still neutral |
| \`--ring\` | brand-600 | brand-400 | Focus rings — brand-colored, so focus never reads as "the border got darker" |

### Sidebar

| Token | Light | Dark |
|-------|-------|------|
| \`--sidebar\` | surface-25 | surface-825 |
| \`--sidebar-primary\` | brand-600 | brand-400 |
| \`--sidebar-accent\` | brand-100 | brand-850 |
| \`--sidebar-border\` | surface-300 | surface-600 |
| \`--sidebar-ring\` | surface-400 | surface-500 |

### Surface Layering

\`--background\` is the **base canvas** — the empty page with nothing on it. Everything placed on the screen (cards, lists, charts, inputs, modals) uses \`--card\`. On mobile, the visible screen is often entirely covered by content, so the entire screen may appear as \`--card\` — but \`--background\` is still the layer underneath, visible in gaps between widgets or behind sheet transitions. On desktop, \`--background\` is more visible because containers don't always fill the viewport. Think of it as: \`--background\` = the wall, \`--card\` = the paper pinned to it.

Every background token has a matching \`*-foreground\` counterpart. Always pair them.
${accentPalettes.length > 0 ? `
### Accent Scopes

Each accent color provides a full semantic scope:
${accentPalettes.map(a => `- **${a.name}** (\`--${a.cssName}\`): \`-foreground\`, \`-background\`, \`-card\`, \`-elevated\`, \`-popover\`, \`-secondary\`, \`-muted\`, \`-accent\`, \`-subtle\`, \`-emphasis\`, \`-border\`, \`-border-muted\`, \`-input\`, \`-ring\` — each with light/dark variants.`).join('\n')}
` : ''}
## How to Use

1. **Use semantic tokens** (\`--primary\`, \`--background\`, etc.) in component code — never reference primitive step numbers directly.
2. **Tailwind v4**: The export ships plain CSS custom properties. To get utilities like \`bg-primary\` or \`text-foreground\`, map the variables once via \`@theme inline { --color-primary: var(--primary); … }\` — see tailwindcss.com/docs/theme.
3. **Dark mode**: Add \`.dark\` to \`<html>\` or a container. All semantic tokens remap automatically.
4. **Surface depth — three levels, never more**: \`--background\` (the page) → \`--card\` (sits on the page) → \`--elevated\` (sits on a card: input fills, lists inside cards, dropdowns, selected rows). Each level is exactly one step lighter than the one below it, in both light and dark mode. Depth does not stack: a field inside a list inside a card still uses \`--elevated\`, not a fourth tone. \`--muted\` runs the other way (recessed, one step darker than \`--card\`) and is not part of the ladder.
5. **Borders**: Default to \`--border-muted\` for subtle separation (dividers, table rows). Use \`--border\` for visible borders (cards, panels). Form controls (\`input\`, \`select\`, \`textarea\`) always use \`--input\` — never \`--border\`.
6. **Colored text**: For links, icons, and indicators placed directly on \`--background\` or \`--card\`, use \`--primary-emphasis\` / \`--destructive-emphasis\` / \`--{name}-emphasis\` — never the button colors (\`--primary\`, 600/400 steps), which may lack text contrast there.
7. **Shadows and radii**: see standby.design/shape for hue-matched shadow tokens and border-radius scales.

## Primitive Scale Reference

Each color uses a 19-step scale: **0, 25, 50, 75, 100, 200–800, 825, 850, 875, 900, 925, 950, 975**

- **0–100** — light surfaces (elevated, cards, backgrounds)
- **200–800** — core palette (buttons, text, accents)
- **825–875** — dark-mode surfaces
- **900–975** — high-contrast surfaces
- **1000** — neutral only: pure black endpoint (\`--color-neutral-1000\`). In the neutral scale, \`--color-neutral-0\` is pure white; in all other scales step 0 is the tinted lightest surface.

Chroma variants:
- \`--color-{name}-{step}\` — full chroma (interactive elements)
- \`--color-surface-{step}\` — the brand's ${pct}%-chroma counterpart (backgrounds, containers)
- \`--color-error-surface-{step}\` and \`--color-{accent}-surface-{step}\` — reduced-chroma twins for error and extra accents
- \`--color-neutral-{step}\` — 0% chroma, no surface twin

## Settings

- **Palette mode**: ${mode === 'balanced' ? 'Balanced midpoint' : 'Brand Centered'}
- **Foreground contrast**: ${fgLabel}
- **Surface chroma**: ${pct}%
`;
}
