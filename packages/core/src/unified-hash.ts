/**
 * Unified hash format for cross-tool state sharing.
 *
 * Format: c=<color-hash>&t=<type-hash>&s=<shape-hash>&y=<symbol-hash>&p=<space-hash>&m=<motion-hash>
 *
 * Each tool reads/writes only its own segment and preserves the rest.
 * Legacy hashes (without c=, t=, s=, y=, or p= prefix) are detected by the caller.
 */

export type SegmentKey = 'c' | 't' | 's' | 'y' | 'p' | 'm';

export type Segments = Record<SegmentKey, string | null>;

export const SEGMENT_KEYS: readonly SegmentKey[] = ['c', 't', 's', 'y', 'p', 'm'];

type UnifiedSegments = Segments;

export function emptySegments(): Segments {
  return { c: null, t: null, s: null, y: null, p: null, m: null };
}

export function readSegments(raw: string): Segments {
  const str = raw.replace(/^#/, '');
  if (str !== '' && !isUnifiedHash(str)) return { ...emptySegments(), c: str };
  return parseUnifiedHash(str);
}

function isSegmentKey(key: string): key is SegmentKey {
  return (SEGMENT_KEYS as readonly string[]).includes(key);
}

/** Check whether a raw hash string uses the unified format. */
export function isUnifiedHash(raw: string): boolean {
  const str = raw.replace(/^#/, '');
  return /(?:^|&)[ctsypm]=/.test(str);
}

/** Parse unified hash into segments. Returns null values for missing keys. */
export function parseUnifiedHash(raw: string): UnifiedSegments {
  const str = raw.replace(/^#/, '');
  const result: UnifiedSegments = emptySegments();
  if (!isUnifiedHash(str)) return result;

  let currentKey: SegmentKey | null = null;
  for (const part of str.split('&')) {
    const eq = part.indexOf('=');
    const key = eq === -1 ? '' : part.slice(0, eq);
    if (isSegmentKey(key)) {
      currentKey = key;
      result[key] = part.slice(eq + 1) || null;
    } else if (currentKey && result[currentKey] !== null) {
      result[currentKey] += '&' + part;
    }
  }
  return result;
}

/** Build a unified hash string (without leading #). */
export function buildUnifiedHash(segments: Partial<Record<SegmentKey, string | null | undefined>>): string {
  return SEGMENT_KEYS.filter(key => segments[key]).map(key => `${key}=${segments[key]}`).join('&');
}

/** Extract a single segment from a unified hash. Returns null if missing or legacy. */
export function getMySegment(raw: string, key: SegmentKey): string | null {
  return parseUnifiedHash(raw)[key];
}

/** Replace one segment in a unified hash, preserving others. Returns hash without #. */
export function setMySegment(raw: string, key: SegmentKey, value: string): string {
  const parsed = parseUnifiedHash(raw);
  parsed[key] = value;
  return buildUnifiedHash(parsed);
}
