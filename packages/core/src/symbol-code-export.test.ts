import { describe, it, expect } from 'vitest';
import { resolveIconSet, alternativeIconSets, generateSymbolCss, generateSymbolLlmBriefing } from './symbol-code-export';
import { DEFAULT_SYMBOL_STATE } from './url-state/symbol';
import { recommendSets } from './recommend';

describe('resolveIconSet', () => {
  it('falls back to the top recommendation when nothing is selected', () => {
    const top = recommendSets({ style: 'auto', mood: 50, weight: 'auto', corners: 'auto' })[0].set;
    expect(resolveIconSet(DEFAULT_SYMBOL_STATE)).toEqual({ set: top, selected: false });
  });

  it('uses the explicit selection', () => {
    expect(resolveIconSet({ ...DEFAULT_SYMBOL_STATE, selectedSet: 'lucide' })).toMatchObject({ selected: true, set: { id: 'lucide' } });
  });

  it('ignores an unknown selection', () => {
    expect(resolveIconSet({ ...DEFAULT_SYMBOL_STATE, selectedSet: 'nope' }).selected).toBe(false);
  });
});

describe('symbol exports', () => {
  it('labels an explicit selection as selected, not recommended', () => {
    const css = generateSymbolCss({ ...DEFAULT_SYMBOL_STATE, selectedSet: 'lucide' });
    expect(css).toContain('/* Selected: Lucide');
    expect(css).not.toContain('Recommended');
  });

  it('lists alternatives without the chosen set', () => {
    const state = DEFAULT_SYMBOL_STATE;
    const chosen = resolveIconSet(state).set.id;
    expect(alternativeIconSets(state).some(r => r.set.id === chosen)).toBe(false);
    const alternatives = generateSymbolLlmBriefing(state).split('## Alternatives')[1].split('## Usage')[0];
    expect(alternatives).not.toContain(`**${resolveIconSet(state).set.name}**`);
  });
});
