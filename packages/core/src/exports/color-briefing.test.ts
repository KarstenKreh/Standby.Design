import { describe, it, expect } from 'vitest';
import { generateColorBriefing } from './color-briefing';

describe('generateColorBriefing', () => {
  const baseInput = {
    brandHex: '#335A7F',
    effectiveBgHex: '#335A7F',
    effectiveErrorHex: '#CC3333',
    accentPalettes: [],
    chromaScale: 0.25,
    mode: 'balanced' as const,
    brandPin: false,
    errorPin: false,
    themeName: 'Test Theme',
    fgContrastMode: 'best' as const,
  };

  it('starts with a markdown H1 heading', () => {
    const md = generateColorBriefing(baseInput);
    expect(md.startsWith('# ')).toBe(true);
    expect(md).toContain('Test Theme — Theme Briefing');
  });

  it('includes the reconciled Surface Layering section (from color-react)', () => {
    const md = generateColorBriefing(baseInput);
    expect(md).toContain('### Surface Layering');
    expect(md).toContain('--background');
    expect(md).toContain('base canvas');
  });

  it('includes the reconciled border-radius note (from system-react)', () => {
    const md = generateColorBriefing(baseInput);
    expect(md).toContain('Border-radius');
    expect(md).toContain('--radius: 0.625rem');
  });

  it('shows pinned contrast warning only when brand is pinned', () => {
    expect(generateColorBriefing(baseInput)).not.toContain('Contrast warning');
    const pinned = generateColorBriefing({ ...baseInput, brandPin: true });
    expect(pinned).toContain('Contrast warning — pinned primary');
  });

  it('includes accent rows when accents are provided', () => {
    const md = generateColorBriefing({
      ...baseInput,
      accentPalettes: [{
        name: 'Success',
        hex: '#33994D',
        cssName: 'success',
        palette: [],
        slatedPalette: [],
        pin: false,
        invert: false,
      }],
    });
    expect(md).toContain('Success');
    expect(md).toContain('--color-success-*');
    expect(md).toContain('### Accent Scopes');
  });

  it('reflects chroma percentage in the output', () => {
    const md = generateColorBriefing({ ...baseInput, chromaScale: 0.5 });
    expect(md).toContain('50% chroma');
  });

  it('falls back to "Untitled Theme" when themeName is empty', () => {
    const md = generateColorBriefing({ ...baseInput, themeName: '' });
    expect(md).toContain('Untitled Theme');
  });

  it('labels palette mode correctly', () => {
    expect(generateColorBriefing(baseInput)).toContain('Balanced midpoint');
    expect(generateColorBriefing({ ...baseInput, mode: 'exact' })).toContain('Brand Centered');
  });
});
