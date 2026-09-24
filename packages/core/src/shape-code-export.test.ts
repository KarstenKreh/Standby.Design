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
});
