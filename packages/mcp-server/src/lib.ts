/**
 * Shared plumbing for the standby.design MCP server:
 * URL/hash handling and per-tool state decoding, all backed by @core.
 */

import { readSegments, buildUnifiedHash, type Segments } from '@core/unified-hash';
import { decodeColorOrDefault, DEFAULT_COLOR_STATE, type DecodedState as ColorState } from '@core/url-state/color';
import { decodeTypeOrDefault, type UrlState as TypeState } from '@core/url-state/type';
import { decodeShapeOrDefault, type ShapeUrlState as ShapeState } from '@core/url-state/shape';
import { DEFAULT_SYMBOL_STATE, type UrlState as SymbolState } from '@core/url-state/symbol';
import type { SpaceUrlState } from '@core/url-state/space';
import type { MotionUrlState } from '@core/url-state/motion';
import { decodeSpaceOrDefault, decodeMotionOrDefault, decodeSymbolOrNull } from '@core/design-system';
import { SUCCESS_HUE, WARNING_HUE, INFO_HUE, type PaletteEntry, type Step } from '@core/palette';
import { pageShareUrl } from '@core/share-link';

export const BASE_URL = 'https://standby.design';

export type { Segments };

/* ── URL handling ── */

/** Accepts a full standby.design URL or a raw (unified) hash, returns segments. */
export function parseInput(input?: string): Segments {
  let hash = (input ?? '').trim();
  if (/^https?:\/\//i.test(hash)) {
    const idx = hash.indexOf('#');
    hash = idx === -1 ? '' : hash.slice(idx + 1);
  }
  return readSegments(hash);
}

export function buildHash(segs: Segments): string {
  return buildUnifiedHash(segs);
}

export function systemUrl(segs: Segments): string {
  return pageShareUrl(`${BASE_URL}/system/`, buildHash(segs));
}

export type ToolName = 'color' | 'type' | 'shape' | 'symbol' | 'space' | 'motion';

export function toolUrl(tool: ToolName, segs: Segments): string {
  return `${BASE_URL}/${tool}#${buildHash(segs)}`;
}

export function normalizeHex(input: string): string | null {
  const hex = input.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return '#' + hex.toUpperCase();
}

export const MCP_COLOR_START: ColorState = {
  ...DEFAULT_COLOR_STATE,
  brandPin: false,
  errorPin: false,
  themeName: '',
  extraAccents: [
    { name: 'Success', hex: '#33994D', pin: false, invert: false, autoMatch: true, autoHue: SUCCESS_HUE },
    { name: 'Warning', hex: '#998033', pin: false, invert: false, autoMatch: true, autoHue: WARNING_HUE },
    { name: 'Info', hex: '#3355CC', pin: false, invert: false, autoMatch: true, autoHue: INFO_HUE },
  ],
};

export { DEFAULT_SYMBOL_STATE };

export function colorStateFrom(segs: Segments): ColorState {
  return decodeColorOrDefault(segs.c);
}

export function typeStateFrom(segs: Segments): TypeState {
  return { ...decodeTypeOrDefault(segs.t) };
}

export function shapeStateFrom(segs: Segments): ShapeState {
  return decodeShapeOrDefault(segs.s);
}

export function symbolStateFrom(segs: Segments): SymbolState | null {
  return decodeSymbolOrNull(segs.y);
}

export function spaceStateFrom(segs: Segments): SpaceUrlState {
  return decodeSpaceOrDefault(segs.p);
}

export function motionStateFrom(segs: Segments): MotionUrlState {
  return decodeMotionOrDefault(segs.m);
}

export function stepHex(entries: PaletteEntry[], step: Step | number): string {
  return entries.find(e => e.step === step)?.hex ?? '';
}

/** Standard MCP text result. */
export function textResult(text: string) {
  return { content: [{ type: 'text' as const, text }] };
}

export function errorResult(text: string) {
  return { content: [{ type: 'text' as const, text }], isError: true };
}
