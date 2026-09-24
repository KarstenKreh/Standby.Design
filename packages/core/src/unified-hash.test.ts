import { describe, it, expect } from 'vitest';
import {
  isUnifiedHash,
  parseUnifiedHash,
  buildUnifiedHash,
  getMySegment,
  setMySegment,
} from './unified-hash';
import { encodeState as encodeType, decodeState as decodeType, type UrlState } from './url-state/type';
import { decodeState as decodeSpace } from './url-state/space';

describe('isUnifiedHash', () => {
  it('detects unified format with c= segment', () => {
    expect(isUnifiedHash('c=abc')).toBe(true);
  });

  it('detects unified format with t= segment', () => {
    expect(isUnifiedHash('t=xyz')).toBe(true);
  });

  it('detects unified format with s= segment', () => {
    expect(isUnifiedHash('s=123')).toBe(true);
  });

  it('detects unified format with y= segment', () => {
    expect(isUnifiedHash('y=symbol')).toBe(true);
  });

  it('detects unified format with p= segment', () => {
    expect(isUnifiedHash('p=space')).toBe(true);
  });

  it('detects unified format with leading #', () => {
    expect(isUnifiedHash('#c=abc&t=xyz')).toBe(true);
  });

  it('detects combined segments', () => {
    expect(isUnifiedHash('c=abc&t=xyz&s=123&p=xyz')).toBe(true);
  });

  it('rejects legacy hash without segment keys', () => {
    expect(isUnifiedHash('335A7F,335A7F,1,CC3333,1,25,balanced')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isUnifiedHash('')).toBe(false);
  });

  it('rejects bare #', () => {
    expect(isUnifiedHash('#')).toBe(false);
  });
});

describe('parseUnifiedHash', () => {
  it('parses all five segments', () => {
    const result = parseUnifiedHash('c=colordata&t=typedata&s=shapedata&y=symboldata&p=spacedata');
    expect(result).toEqual({ c: 'colordata', t: 'typedata', s: 'shapedata', y: 'symboldata', p: 'spacedata' });
  });

  it('parses with leading #', () => {
    const result = parseUnifiedHash('#c=colordata&t=typedata');
    expect(result).toEqual({ c: 'colordata', t: 'typedata', s: null, y: null, p: null });
  });

  it('returns null for missing segments', () => {
    const result = parseUnifiedHash('c=only-color');
    expect(result).toEqual({ c: 'only-color', t: null, s: null, y: null, p: null });
  });

  it('returns all null for legacy hash', () => {
    const result = parseUnifiedHash('335A7F,335A7F,1');
    expect(result).toEqual({ c: null, t: null, s: null, y: null, p: null });
  });

  it('returns null value for empty segment (c= without value)', () => {
    const result = parseUnifiedHash('c=&t=data');
    expect(result).toEqual({ c: null, t: 'data', s: null, y: null, p: null });
  });

  it('handles segments with special characters (commas, colons)', () => {
    const result = parseUnifiedHash('c=335A7F,335A7F,1,CC3333&t=custom,1.0,1.272');
    expect(result.c).toBe('335A7F,335A7F,1,CC3333');
    expect(result.t).toBe('custom,1.0,1.272');
  });

  it('handles URL-encoded content like Standby.Design', () => {
    const result = parseUnifiedHash('c=335A7F,bg,1,err,1,25,balanced,0,0,best,Standby.Design');
    expect(result.c).toContain('Standby.Design');
  });

  it('parses space segment with extended keys', () => {
    const result = parseUnifiedHash('p=harmonic,1000,1272,100,1|bp=sm:640');
    expect(result.p).toBe('harmonic,1000,1272,100,1|bp=sm:640');
  });
});

describe('buildUnifiedHash', () => {
  it('builds hash with all segments', () => {
    const hash = buildUnifiedHash({ c: 'color', t: 'type', s: 'shape', p: 'space' });
    expect(hash).toBe('c=color&t=type&s=shape&p=space');
  });

  it('omits empty segments', () => {
    const hash = buildUnifiedHash({ c: 'color' });
    expect(hash).toBe('c=color');
  });

  it('omits undefined segments', () => {
    const hash = buildUnifiedHash({ c: 'color', t: undefined, s: 'shape' });
    expect(hash).toBe('c=color&s=shape');
  });

  it('returns empty string when all segments are empty', () => {
    const hash = buildUnifiedHash({});
    expect(hash).toBe('');
  });

  it('does not include leading #', () => {
    const hash = buildUnifiedHash({ c: 'data' });
    expect(hash).not.toMatch(/^#/);
  });
});

describe('getMySegment', () => {
  it('reads color segment', () => {
    expect(getMySegment('c=colordata&t=typedata', 'c')).toBe('colordata');
  });

  it('reads type segment', () => {
    expect(getMySegment('c=colordata&t=typedata', 't')).toBe('typedata');
  });

  it('reads space segment', () => {
    expect(getMySegment('c=x&p=spacedata', 'p')).toBe('spacedata');
  });

  it('returns null for missing segment', () => {
    expect(getMySegment('c=colordata', 's')).toBeNull();
  });

  it('returns null for legacy hash', () => {
    expect(getMySegment('335A7F,data', 'c')).toBeNull();
  });
});

describe('setMySegment', () => {
  it('sets a new segment preserving others', () => {
    const result = setMySegment('c=old&t=type', 'c', 'new');
    expect(result).toContain('c=new');
    expect(result).toContain('t=type');
  });

  it('adds a space segment to existing hash', () => {
    const result = setMySegment('c=color', 'p', 'space');
    expect(result).toContain('c=color');
    expect(result).toContain('p=space');
  });

  it('works on legacy hash (creates new unified from scratch)', () => {
    const result = setMySegment('335A7F,data', 'c', 'newcolor');
    expect(result).toContain('c=newcolor');
  });
});

describe('round-trips', () => {
  it('build → parse returns same values', () => {
    const segments = { c: 'color-hash', t: 'type-hash', s: 'shape-hash', y: null, p: null };
    const built = buildUnifiedHash({ c: 'color-hash', t: 'type-hash', s: 'shape-hash' });
    const parsed = parseUnifiedHash(built);
    expect(parsed).toEqual(segments);
  });

  it('build → parse round-trips with all five segments', () => {
    const built = buildUnifiedHash({ c: 'color', t: 'type', s: 'shape', y: 'a,50,a,a,125,1250,', p: 'spacedata' });
    const parsed = parseUnifiedHash(built);
    expect(parsed.y).toBe('a,50,a,a,125,1250,');
    expect(parsed.c).toBe('color');
    expect(parsed.p).toBe('spacedata');
  });

  it('setMySegment preserves p when updating c', () => {
    const hash = buildUnifiedHash({ c: 'old', t: 'type', p: 'space' });
    const updated = setMySegment(hash, 'c', 'new');
    expect(getMySegment(updated, 'c')).toBe('new');
    expect(getMySegment(updated, 't')).toBe('type');
    expect(getMySegment(updated, 'p')).toBe('space');
  });
});

const typeState: UrlState = {
  scaleMode: 'custom',
  baseSize: 1,
  customRatio: 1.414,
  mobileRatio: 1.25,
  headingFont: 'sentient',
  bodyFont: 'satoshi',
  monoFont: 'ibm-plex-mono',
  headingWeight: 600,
  mobileBaseSize: 0.9375,
  mobileRatioMode: 'custom',
  autoShrink: 40,
  lineHeightOverrides: { h1: 1.1 },
  letterSpacingOverrides: { h1: -0.02 },
};

describe('parseUnifiedHash with extension keys', () => {
  it('keeps every type extension key when other segments follow', () => {
    const t = 'custom,1,1.414,1.25,sentient,satoshi,ibm-plex-mono|hw=600&mbs=0.9375&mrm=custom&as=40';
    const parsed = parseUnifiedHash(`#c=5B84D6&t=${t}&s=paper,1&p=harmonic,1000,1500,100,1`);
    expect(parsed.t).toBe(t);
    expect(parsed.c).toBe('5B84D6');
    expect(parsed.s).toBe('paper,1');
    expect(parsed.p).toBe('harmonic,1000,1500,100,1');
  });

  it('keeps every space extension key', () => {
    const p = 'harmonic,1000,1500,100,1|fvw=360,1600&pch=70&arr=0';
    expect(parseUnifiedHash(`c=AAAAAA&p=${p}`).p).toBe(p);
  });

  it('ignores stray parts before the first segment', () => {
    expect(parseUnifiedHash('foo=1&bar&c=AAAAAA')).toMatchObject({ c: 'AAAAAA', t: null });
  });
});

describe('segment round-trip across tool switches', () => {
  it('type state survives other tools rewriting their own segments', () => {
    let hash = setMySegment('', 't', encodeType(typeState));
    hash = setMySegment(hash, 'c', '5B84D6');
    hash = setMySegment(hash, 'p', 'harmonic,1000,1500,100,1');
    hash = setMySegment(hash, 's', 'paper,1');
    expect(decodeType(getMySegment(hash, 't')!)).toMatchObject({
      headingWeight: 600,
      mobileBaseSize: 0.9375,
      mobileRatioMode: 'custom',
      autoShrink: 40,
      lineHeightOverrides: { h1: 1.1 },
      letterSpacingOverrides: { h1: -0.02 },
    });
  });

  it('space state survives other tools rewriting their own segments', () => {
    const encoded = 'harmonic,1000,1500,100,1|fvw=360,1600&pch=70&arr=0';
    let hash = setMySegment('', 'p', encoded);
    hash = setMySegment(hash, 't', encodeType(typeState));
    hash = setMySegment(hash, 'c', '5B84D6');
    const decoded = decodeSpace(getMySegment(hash, 'p')!);
    expect(decoded).toMatchObject({ fluidMinVw: 360, fluidMaxVw: 1600, proseMaxCh: 70, aspectIncludeReciprocals: false });
  });
});
