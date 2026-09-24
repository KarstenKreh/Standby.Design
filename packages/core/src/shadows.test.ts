import { describe, it, expect } from 'vitest';
import { generateShadowValues, generateShadows, type ShadowConfig } from './shadows';
import { hexToOklch } from './color-math';

describe('generateShadowValues', () => {
  it('returns 5 levels', () => {
    const values = generateShadowValues('#F8F8F8', false);
    expect(values).toHaveLength(5);
  });

  it('levels are named xs, sm, md, lg, xl', () => {
    const values = generateShadowValues('#F8F8F8', false);
    const names = values.map((v) => v.name);
    expect(names).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
  });

  it('all shadows are valid CSS shadow strings', () => {
    const values = generateShadowValues('#F8F8F8', false);
    for (const { shadow } of values) {
      expect(shadow).toContain('oklch(');
      expect(shadow).toContain('rem');
      // Two-layer shadow (separated by comma + space)
      const layers = shadow.split(', 0 ');
      expect(layers.length).toBe(2);
    }
  });

  it('dark mode produces higher alpha values than light mode', () => {
    const light = generateShadowValues('#F8F8F8', false);
    const dark = generateShadowValues('#1A1A1A', true);
    // Compare the alpha values of the md level
    const lightAlphas = light[2].shadow.match(/\/ ([\d.]+)/g)!;
    const darkAlphas = dark[2].shadow.match(/\/ ([\d.]+)/g)!;
    const lightAlpha1 = parseFloat(lightAlphas[0].replace('/ ', ''));
    const darkAlpha1 = parseFloat(darkAlphas[0].replace('/ ', ''));
    expect(darkAlpha1).toBeGreaterThan(lightAlpha1);
  });

  it('works with brand color', () => {
    const values = generateShadowValues('#335A7F', false);
    expect(values).toHaveLength(5);
    for (const { shadow } of values) {
      expect(shadow.length).toBeGreaterThan(0);
    }
  });
});

describe('brutalist shadows', () => {
  const baseConfig: ShadowConfig = {
    type: 'brutalist',
    strength: 1,
    blurScale: 1,
    scale: 1,
    colorMode: 'auto',
    customColor: '#000000',
    offsetX: 2,
    offsetY: 4,
    borderWidth: 2,
  };

  function echoLightness(shadow: string): number {
    const layers = shadow.split(', ');
    const echo = layers[layers.length - 1];
    return parseFloat(echo.match(/oklch\(([\d.]+)/)![1]);
  }

  it('auto echo is the element bg one step darker in light and dark mode', () => {
    for (const [bg, isDark] of [['#F4F6F8', false], ['#2A2F36', true]] as const) {
      const [bgL] = hexToOklch(bg);
      const [md] = generateShadows(bg, isDark, baseConfig).filter(s => s.name === 'md');
      expect(echoLightness(md.shadow)).toBeCloseTo(bgL - 0.1, 2);
    }
  });

  it('custom echo uses the custom color', () => {
    const [md] = generateShadows('#F4F6F8', false, { ...baseConfig, colorMode: 'custom', customColor: '#000000' })
      .filter(s => s.name === 'md');
    expect(echoLightness(md.shadow)).toBeCloseTo(0, 2);
  });

  it('outlined fills the echo with the element bg inside a stroke of borderWidth', () => {
    const [md] = generateShadows('#F4F6F8', false, baseConfig).filter(s => s.name === 'md');
    expect(md.shadow).toMatch(/^2\.00px 4\.00px 0 -2px oklch\([^)]*\), 2\.00px 4\.00px 0 0 oklch\(/);
  });

  it('solid is a single filled echo without a filler layer', () => {
    const [md] = generateShadows('#F4F6F8', false, { ...baseConfig, brutalistVariant: 'solid' })
      .filter(s => s.name === 'md');
    expect(md.shadow.split(', ')).toHaveLength(1);
    expect(md.shadow).toMatch(/^2\.00px 4\.00px 0 0 oklch\(/);
  });
});
