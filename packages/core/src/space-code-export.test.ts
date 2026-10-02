import { describe, it, expect } from 'vitest';
import { generateSpaceTailwind, generateSpaceLlmBriefing, generateSpaceDesignTokens, spaceOptsFromState } from './space-code-export';
import { DEFAULT_SPACE_URL_STATE } from './url-state/space';

const defaults = spaceOptsFromState(DEFAULT_SPACE_URL_STATE);

describe('generateSpaceTailwind', () => {
  const tw = generateSpaceTailwind(defaults);

  it('never registers a container key that overrides a static width utility', () => {
    expect(tw).not.toMatch(/--container-full:/);
    expect(tw).toContain('--container-fullwidth: 1920px;');
  });

  it('restores the stock max-w-* sizes that named spacing tokens shadow', () => {
    expect(tw).toContain('--max-width-md: 28rem;');
    expect(tw).toContain('--max-width-3xs: 16rem;');
  });

  it('keeps the fluid anchors and prose measure outside @theme', () => {
    const afterTheme = tw.slice(tw.indexOf('}\n') + 2);
    expect(afterTheme).toContain('--fluid-min-vw: 375px;');
    expect(afterTheme).toContain('--fluid-max-vw: 1920px;');
    expect(afterTheme).toContain('--prose-max: 65ch;');
  });

  it('leaves containers without a clashing name untouched', () => {
    expect(tw).toContain('--container-prose: 680px;');
  });
});

describe('space briefing and tokens', () => {
  it('tells the reader about the renamed Tailwind container', () => {
    expect(generateSpaceLlmBriefing(defaults)).toContain('--container-fullwidth');
  });

  it('exports breakpoints, containers and aspect ratios as design tokens', () => {
    const tokens = JSON.parse(generateSpaceDesignTokens(defaults));
    expect(Object.keys(tokens)).toEqual(['spacing', 'breakpoint', 'container', 'aspect']);
    expect(tokens.container['prose-max'].$value).toBe('65ch');
  });
});
