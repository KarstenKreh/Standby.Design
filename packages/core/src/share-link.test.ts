import { describe, it, expect } from 'vitest';
import { systemShareUrl, llmShareHeader, SHARE_BASE_URL } from './share-link';

describe('systemShareUrl', () => {
  it('builds a /system URL from a fresh segment when no hash exists yet', () => {
    expect(systemShareUrl('c', 'AABBCC,1', '')).toBe(`${SHARE_BASE_URL}/system#c=AABBCC,1`);
  });

  it('refreshes its own segment and preserves the others', () => {
    const url = systemShareUrl('t', 'NEW', '#c=SEED&t=OLD&p=SPACE');
    expect(url).toBe(`${SHARE_BASE_URL}/system#c=SEED&t=NEW&p=SPACE`);
  });

  it('accepts the raw hash with or without leading #', () => {
    expect(systemShareUrl('y', 'ICONS', 'c=SEED')).toBe(systemShareUrl('y', 'ICONS', '#c=SEED'));
  });
});

describe('llmShareHeader', () => {
  it('puts the URL in the first line and ends with a blank line', () => {
    const header = llmShareHeader('https://standby.design/system#c=X');
    expect(header.split('\n')[0]).toContain('https://standby.design/system#c=X');
    expect(header.endsWith('\n\n')).toBe(true);
  });
});
