import { describe, it, expect } from 'vitest';
import { generateSystemBriefing } from './system-briefing';
import type { ComputedLevel } from '../scale';

const sampleLevels: ComputedLevel[] = [
  { level: 'h1', label: 'H1', minRem: 2.4, maxRem: 3.71, clampValue: 'clamp(2.4rem, 1vw + 2.3rem, 3.71rem)', isFluid: true, isHeading: true, lineHeight: 1.1, letterSpacing: -0.02 },
];

describe('generateSystemBriefing', () => {
  const input = {
    themeName: 'Acme',
    color: {
      brandHex: '#335A7F',
      effectiveBgHex: '#335A7F',
      effectiveErrorHex: '#CC3333',
      accentPalettes: [],
      chromaScale: 0.25,
      mode: 'balanced' as const,
      brandPin: false,
      errorPin: false,
      themeName: 'Acme',
      fgContrastMode: 'best' as const,
    },
    type: {
      levels: sampleLevels,
      spacingTokens: [],
      headingFont: 'satoshi',
      bodyFont: 'satoshi',
      monoFont: 'system-mono',
      scaleLabel: 'Custom Ratio (1.272)',
    },
  };

  it('starts with the system-level title', () => {
    const md = generateSystemBriefing(input);
    expect(md.startsWith('# Acme — Design System')).toBe(true);
  });

  it('includes Color and Typography sections', () => {
    const md = generateSystemBriefing(input);
    expect(md).toContain('# Color');
    expect(md).toContain('# Typography & Spacing');
  });

  it('embeds reconciled content from both sub-briefings', () => {
    const md = generateSystemBriefing(input);
    expect(md).toContain('Surface Layering');      // from color-briefing
    expect(md).toContain('Border-radius');          // reconciled point
    expect(md).toContain('## Fonts');              // from type-briefing
  });

  it('falls back to "Untitled Design System" when name is empty', () => {
    const md = generateSystemBriefing({ ...input, themeName: '' });
    expect(md).toContain('Untitled Design System');
  });
});
