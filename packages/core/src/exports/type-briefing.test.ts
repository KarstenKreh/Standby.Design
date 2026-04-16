import { describe, it, expect } from 'vitest';
import { generateTypeBriefing } from './type-briefing';
import type { ComputedLevel } from '../scale';
import type { SpacingToken } from '../spacing';

const sampleLevels: ComputedLevel[] = [
  { level: 'h1', label: 'H1', minRem: 2.4, maxRem: 3.71, clampValue: 'clamp(2.4rem, 1vw + 2.3rem, 3.71rem)', isFluid: true, isHeading: true, lineHeight: 1.1, letterSpacing: -0.02 },
  { level: 'body-m', label: 'Body-M', minRem: 1, maxRem: 1, clampValue: '1rem', isFluid: false, isHeading: false, lineHeight: 1.5, letterSpacing: 0 },
];

const sampleSpacing: SpacingToken[] = [
  { name: 'sm', multiple: 1, rem: 1, px: 16 },
];

describe('generateTypeBriefing', () => {
  const baseInput = {
    levels: sampleLevels,
    spacingTokens: [] as SpacingToken[],
    headingFont: 'satoshi',
    bodyFont: 'satoshi',
    monoFont: 'system-mono',
    scaleLabel: 'Custom Ratio (1.272)',
  };

  it('starts with a markdown H1 heading', () => {
    const md = generateTypeBriefing(baseInput);
    expect(md.startsWith('# Type Scale —')).toBe(true);
  });

  it('includes fonts, scale, line heights, and letter spacing sections', () => {
    const md = generateTypeBriefing(baseInput);
    expect(md).toContain('## Fonts');
    expect(md).toContain('## Type Scale');
    expect(md).toContain('## Line Heights');
    expect(md).toContain('## Letter Spacing');
  });

  it('omits the Spacing Scale section when no tokens provided', () => {
    const md = generateTypeBriefing(baseInput);
    expect(md).not.toContain('## Spacing Scale');
  });

  it('includes the Spacing Scale section when tokens provided', () => {
    const md = generateTypeBriefing({ ...baseInput, spacingTokens: sampleSpacing });
    expect(md).toContain('## Spacing Scale');
    expect(md).toContain('--space-sm');
  });

  it('distinguishes fluid and fixed levels in the scale table', () => {
    const md = generateTypeBriefing(baseInput);
    expect(md).toContain('clamp(2.4rem, 1vw + 2.3rem, 3.71rem)');
    expect(md).toContain('| Body-M | 1rem | — | 1rem |');
  });

  it('mentions all four sibling tools in the usage footer', () => {
    const md = generateTypeBriefing(baseInput);
    expect(md).toContain('standby.design/color');
    expect(md).toContain('standby.design/shape');
    expect(md).toContain('standby.design/space');
  });
});
