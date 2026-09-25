import { describe, it, expect } from 'vitest';
import { generatePalette } from './palette';
import { hexToOklch } from './color-math';
import { stepLadder, pinnedLadder, stateLadder } from './state-ladder';

const brand = generatePalette('#335A7F', 1.0, 'balanced');

describe('stepLadder', () => {
  it('hover is one rung lighter and pressed one rung darker in light mode', () => {
    const ladder = stepLadder(brand, 'brand', 600);
    expect(ladder.hover.step).toBe(500);
    expect(ladder.pressed.step).toBe(700);
    expect(ladder.reversed).toBe(false);
  });

  it('keeps the same directions in dark mode', () => {
    const ladder = stepLadder(brand, 'brand', 400);
    expect(ladder.hover.step).toBe(300);
    expect(ladder.pressed.step).toBe(500);
  });

  it('hover is lighter and pressed darker than rest in OKLCH lightness', () => {
    for (const step of [200, 400, 600, 800] as const) {
      const ladder = stepLadder(brand, 'brand', step);
      const L = (hex: string) => hexToOklch(hex)[0];
      expect(L(ladder.hover.hex)).toBeGreaterThan(L(ladder.rest.hex));
      expect(L(ladder.pressed.hex)).toBeLessThan(L(ladder.rest.hex));
    }
  });

  it('flips hover to darker at the light end of the scale', () => {
    const lightest = brand[0].step;
    const ladder = stepLadder(brand, 'brand', lightest);
    expect(ladder.reversed).toBe(true);
    expect(ladder.hover.step).toBeGreaterThan(lightest);
    expect(ladder.pressed.step!).toBeGreaterThan(ladder.hover.step!);
  });

  it('flips pressed to lighter at the dark end of the scale', () => {
    const ladder = stepLadder(brand, 'brand', 975);
    expect(ladder.reversed).toBe(true);
    expect(ladder.hover.step).toBeLessThan(975);
    expect(ladder.pressed.step).not.toBe(975);
    expect(ladder.pressed.step).not.toBe(ladder.hover.step);
  });
});

describe('pinnedLadder', () => {
  it('moves the pinned lightness up for hover and down for pressed', () => {
    const ladder = pinnedLadder('#335A7F', brand);
    const [L] = hexToOklch('#335A7F');
    expect(hexToOklch(ladder.hover.hex)[0]).toBeGreaterThan(L);
    expect(hexToOklch(ladder.pressed.hex)[0]).toBeLessThan(L);
    expect(ladder.hover.step).toBeNull();
  });

  it('flips hover to darker for a near-white pinned color', () => {
    const ladder = pinnedLadder('#FAFAFA', brand);
    expect(ladder.reversed).toBe(true);
    expect(hexToOklch(ladder.hover.hex)[0]).toBeLessThan(hexToOklch('#FAFAFA')[0]);
  });
});

describe('stateLadder', () => {
  it('uses the pinned ladder only when a pinned hex is given', () => {
    expect(stateLadder(brand, 'brand', 600, null).hover.step).toBe(500);
    expect(stateLadder(brand, 'brand', 600, '#335A7F').hover.step).toBeNull();
  });
});
