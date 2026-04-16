// Builds shareable preview URLs into the web tools. Each URL encodes the full
// state, so the user can click through and continue tweaking interactively.
// Base URL is configurable via STANDBY_BASE_URL env var (defaults to production).

import { encodeState as encodeColor } from '@core/url-state/color';
import { encodeState as encodeType } from '@core/url-state/type';
import { buildUnifiedHash } from '@core/unified-hash';
import type { DecodedState as DecodedColorState } from '@core/url-state/color';
import type { UrlState as DecodedTypeState } from '@core/url-state/type';

function baseUrl(): string {
  const raw = process.env.STANDBY_BASE_URL?.trim();
  const url = raw || 'https://standby.design';
  return url.replace(/\/+$/, '');
}

export function colorPreviewUrl(state: DecodedColorState): string {
  const hash = encodeColor(state);
  return `${baseUrl()}/color#${hash}`;
}

export function typePreviewUrl(state: DecodedTypeState): string {
  const hash = encodeType(state);
  return `${baseUrl()}/type#${hash}`;
}

export function systemPreviewUrl(color: DecodedColorState, type: DecodedTypeState): string {
  const c = encodeColor(color);
  const t = encodeType(type);
  return `${baseUrl()}/system#${buildUnifiedHash({ c, t })}`;
}
