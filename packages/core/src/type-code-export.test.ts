import { describe, it, expect } from 'vitest';
import { generateCssExport, generateTailwindV4Export, generateLlmBriefing, typeDesignTokens, TEXT_ROLES } from './type-code-export';
import { customScale, traditionalScale, DEFAULT_TRADITIONAL, DEFAULT_TRADITIONAL_MOBILE } from './scale';

function makeOpts() {
  const levels = customScale(1.0, 1.272);
  return {
    levels,
    headingFont: 'satoshi',
    bodyFont: 'satoshi',
    monoFont: 'system-mono',
    headingWeight: 500,
    scaleLabel: 'Custom — 1.272',
  };
}

describe('generateCssExport', () => {
  it('contains :root block', () => {
    const output = generateCssExport(makeOpts());
    expect(output).toContain(':root {');
  });

  it('contains font family tokens', () => {
    const output = generateCssExport(makeOpts());
    expect(output).toContain('--font-heading');
    expect(output).toContain('--font-body');
    expect(output).toContain('--font-mono');
  });

  it('contains the heading weight token', () => {
    const output = generateCssExport({ ...makeOpts(), headingWeight: 700 });
    expect(output).toContain('--font-weight-heading: 700;');
  });

  it('contains type scale tokens', () => {
    const output = generateCssExport(makeOpts());
    expect(output).toContain('--text-display');
    expect(output).toContain('--text-h1');
    expect(output).toContain('--text-body-m');
    expect(output).toContain('--text-caption');
  });

  it('contains line height tokens', () => {
    const output = generateCssExport(makeOpts());
    expect(output).toContain('--leading-display');
    expect(output).toContain('--leading-body-m');
  });

  it('contains letter spacing tokens', () => {
    const output = generateCssExport(makeOpts());
    expect(output).toContain('--tracking-display');
  });

  it('does not contain spacing tokens (moved to /space tool)', () => {
    const output = generateCssExport(makeOpts());
    expect(output).not.toContain('--space-sm');
    expect(output).not.toContain('--space-3xl');
  });

  it('snapshot stability', () => {
    const output = generateCssExport(makeOpts());
    expect(output).toMatchSnapshot();
  });
});

describe('generateTailwindV4Export', () => {
  it('contains @theme block', () => {
    const output = generateTailwindV4Export(makeOpts());
    expect(output).toContain('@theme {');
  });

  it('does not contain :root', () => {
    const output = generateTailwindV4Export(makeOpts());
    expect(output).not.toContain(':root');
  });

  it('contains same tokens as CSS export (minus spacing)', () => {
    const output = generateTailwindV4Export(makeOpts());
    expect(output).toContain('--text-display');
    expect(output).toContain('--font-heading');
    expect(output).toContain('--leading-display');
    expect(output).toContain('--tracking-display');
    expect(output).toContain('--font-weight-heading: 500;');
    expect(output).not.toContain('--space-sm');
  });

  it('snapshot stability', () => {
    const output = generateTailwindV4Export(makeOpts());
    expect(output).toMatchSnapshot();
  });
});

describe('generateLlmBriefing', () => {
  it('lists the heading weight', () => {
    const output = generateLlmBriefing({ ...makeOpts(), headingWeight: 700 });
    expect(output).toContain('weight 700');
    expect(output).toContain('--font-weight-heading');
  });

  it('mentions clamp() only when a level is fluid', () => {
    const fluid = generateLlmBriefing({ ...makeOpts(), levels: customScale(1.0, 1.272, 1.2) });
    expect(fluid).toContain('clamp()` for fluid scaling');
    const output = generateLlmBriefing(makeOpts());
    expect(output).not.toContain('for fluid scaling');
    expect(output).toContain('Font sizes are static');
  });
});

describe('text roles', () => {
  it('exports one class per role in the CSS export', () => {
    const output = generateCssExport(makeOpts());
    for (const r of TEXT_ROLES) expect(output).toContain(`.text-role-${r.role} {`);
    expect(output).toMatch(/\.text-role-meta \{[^}]*font-size: var\(--text-caption\);/);
    expect(output).toMatch(/\.text-role-figure \{[^}]*font-weight: 400;[^}]*tabular-nums/);
  });

  it('exports Tailwind utilities', () => {
    const output = generateTailwindV4Export(makeOpts());
    expect(output).toContain('@utility text-role-title-1 {');
    expect(output).toMatch(/@utility text-role-title-1 \{[^}]*font-weight: var\(--font-weight-heading\);/);
  });

  it('exports role tokens with the heading weight for titles', () => {
    const tokens = typeDesignTokens({ ...makeOpts(), headingWeight: 700 }) as { textRole: Record<string, { $value: { fontWeight: number } }> };
    expect(Object.keys(tokens.textRole)).toEqual(TEXT_ROLES.map((r) => r.role));
    expect(tokens.textRole['title-2'].$value.fontWeight).toBe(700);
    expect(tokens.textRole.label.$value.fontWeight).toBe(500);
  });

  it('lists the roles in the briefing', () => {
    const output = generateLlmBriefing(makeOpts());
    expect(output).toContain('## Text Roles');
    expect(output).toContain('`text-role-meta`');
  });

  it('keeps two scale steps between titles of the same weight', () => {
    const order = ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body-l', 'body-m', 'body-s', 'caption'];
    const titles = TEXT_ROLES.filter((r) => r.role.startsWith('title-')).map((r) => order.indexOf(r.level));
    for (let i = 1; i < titles.length; i++) expect(titles[i] - titles[i - 1]).toBeGreaterThanOrEqual(2);
  });

  it('covers every role level in the traditional scale', () => {
    const levels = traditionalScale(DEFAULT_TRADITIONAL, DEFAULT_TRADITIONAL_MOBILE).map((l) => l.level);
    for (const r of TEXT_ROLES) expect(levels).toContain(r.level);
  });
});
