import { describe, it, expect } from 'vitest';
import { buildThemePalettes, accentCssName } from './theme-palettes';
import { DEFAULT_COLOR_STATE, MAX_ACCENTS, decodeState, encodeState, type DecodedState } from './url-state/color';
import { computeAutoAccentHex, resolveAccentHues } from './palette';
import { hexToOklch } from './color-math';

function state(overrides: Partial<DecodedState> = {}): DecodedState {
  return { ...DEFAULT_COLOR_STATE, ...overrides };
}

describe('buildThemePalettes', () => {
  it('lists every neutral step exactly once, framed by pure white and black', () => {
    const { neutralExtended } = buildThemePalettes(state());
    const steps = neutralExtended.map(e => e.step as number);
    expect(new Set(steps).size).toBe(steps.length);
    expect(neutralExtended[0]).toMatchObject({ step: 0, hex: '#FFFFFF' });
    expect(neutralExtended[neutralExtended.length - 1]).toMatchObject({ step: 1000, hex: '#000000' });
  });

  it('spreads auto-matched custom accents around the brand hue', () => {
    const accents = [
      { name: 'Gold', hex: '#000000', pin: false, invert: false, autoMatch: true, autoHue: 0 },
      { name: 'Coral', hex: '#000000', pin: false, invert: false, autoMatch: true, autoHue: 0 },
    ];
    const s = state({ extraAccents: accents });
    const hues = resolveAccentHues(hexToOklch(s.brandHex)[2], accents.map(a => a.name));
    const { accentPalettes } = buildThemePalettes(s);
    expect(accentPalettes.map(a => a.hex)).toEqual(hues.map(h => computeAutoAccentHex(s.brandHex, h!)));
    expect(accentPalettes[0].hex).not.toBe(accentPalettes[1].hex);
  });

  it('keeps the semantic hue for preset accents', () => {
    const { accentPalettes } = buildThemePalettes(state({
      extraAccents: [{ name: 'Success', hex: '#000000', pin: false, invert: false, autoMatch: true, autoHue: 145 }],
    }));
    expect(accentPalettes[0].hex).toBe(computeAutoAccentHex(DEFAULT_COLOR_STATE.brandHex, 145));
  });

  it('uses the surface seed only when auto-match is off', () => {
    const custom = buildThemePalettes(state({ bgAutoMatch: false, bgColorHex: '#AA3355' }));
    const auto = buildThemePalettes(state({ bgAutoMatch: true, bgColorHex: '#AA3355' }));
    expect(custom.effectiveBgHex).toBe('#AA3355');
    expect(auto.effectiveBgHex).toBe(DEFAULT_COLOR_STATE.brandHex);
  });

  it('derives css names from accent names', () => {
    expect(accentCssName('Brand Gold!')).toBe('brand-gold');
    expect(accentCssName('***')).toBe('accent');
  });
});

describe('accent limit', () => {
  it('decodes at most MAX_ACCENTS accents', () => {
    const many = Array.from({ length: MAX_ACCENTS + 3 }, (_, i) => ({
      name: `A${i}`, hex: '#336699', pin: false, invert: false, autoMatch: false, autoHue: 0,
    }));
    const decoded = decodeState(encodeState(state({ extraAccents: many })));
    expect(decoded!.extraAccents).toHaveLength(MAX_ACCENTS);
  });
});
