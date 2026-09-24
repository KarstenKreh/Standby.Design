import { describe, it, expect } from 'vitest';
import {
  generateShapeCss,
  generateShapeTailwind,
  generateShapeDesignTokens,
  generateShapeLlmBriefing,
  shapeOptsFromState,
  surfacesFromPalette,
} from './shape-code-export';
import { generatePalette } from './palette';
import { generateShadows } from './shadows';

describe('shape code export', () => {
  it('glass exports no shadow tokens in any format', () => {
    const opts = shapeOptsFromState({ shapeStyle: 'glass', shadowEnabled: true });
    expect(generateShapeCss(opts)).not.toContain('--shadow-');
    expect(generateShapeTailwind(opts)).not.toContain('--shadow-');
    expect(JSON.parse(generateShapeDesignTokens(opts)).shadow).toBeUndefined();
  });

  it('never mentions the removed vaso library', () => {
    const opts = shapeOptsFromState({ shapeStyle: 'glass' });
    expect(generateShapeCss(opts)).not.toMatch(/vaso/i);
    expect(generateShapeLlmBriefing(opts)).not.toMatch(/vaso/i);
  });

  it('builds shadows from the surface palette the caller passes', () => {
    const surface = generatePalette('#7F3355', 0.4, 'exact');
    const opts = shapeOptsFromState({ shapeStyle: 'neomorph' }, surface);
    const expected = generateShadows(surfacesFromPalette(surface, 'neomorph').light.background, false, {
      type: 'neumorphic',
      strength: opts.shadowStrength,
      blurScale: opts.shadowBlurScale,
      scale: opts.shadowScale,
      colorMode: 'auto',
      customColor: '#000000',
    });
    expect(generateShapeCss(opts)).toContain(`--shadow-md: ${expected.find(s => s.name === 'md')!.shadow};`);
  });

  it('exports a custom ring color in light and dark, and in the design tokens', () => {
    const opts = shapeOptsFromState({ ringColorMode: 'custom', ringCustomColor: '#FF6600', shadowEnabled: false });
    const css = generateShapeCss(opts);
    expect(css.match(/--ring: #FF6600;/g)).toHaveLength(2);
    expect(css).toContain('.dark {');
    expect(generateShapeTailwind(opts).match(/--ring: #FF6600;/g)).toHaveLength(2);
    expect(JSON.parse(generateShapeDesignTokens(opts)).ring.color.$value).toBe('#FF6600');
  });

  it('leaves --ring to the color tokens in auto mode', () => {
    const opts = shapeOptsFromState({ ringColorMode: 'auto' });
    expect(generateShapeCss(opts)).not.toMatch(/--ring:/);
    expect(JSON.parse(generateShapeDesignTokens(opts)).ring.color).toBeUndefined();
  });

  it('rounds derived radii to whole pixels like the preview', () => {
    const css = generateShapeCss(shapeOptsFromState({ borderRadius: 10 }));
    expect(css).toContain('--radius-xs: 0.1875rem;');
    expect(css).toContain('--radius-sm: 0.3125rem;');
    expect(css).toContain('--radius-lg: 0.9375rem;');
  });

  it('only asks for mode-dependent shadow blocks when shadows are exported', () => {
    const rule = 'Shadows are mode-dependent';
    expect(generateShapeLlmBriefing(shapeOptsFromState({ shapeStyle: 'paper' }))).toContain(rule);
    expect(generateShapeLlmBriefing(shapeOptsFromState({ shapeStyle: 'glass' }))).not.toContain(rule);
    expect(generateShapeLlmBriefing(shapeOptsFromState({ shapeStyle: 'paper', shadowEnabled: false }))).not.toContain(rule);
  });
});
