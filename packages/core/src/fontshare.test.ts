import { describe, it, expect } from 'vitest';
import { fontFamily, getFontEntry } from './fontshare';

describe('fontFamily without the live Fontshare catalog', () => {
  it('resolves fonts from the bundled catalog snapshot', () => {
    expect(fontFamily('sentient')).toBe("'Sentient', serif");
    expect(getFontEntry('jet-brains-mono')?.name).toBe('JetBrains Mono');
  });

  it('derives a family name for slugs missing from the snapshot', () => {
    expect(fontFamily('new-fontshare-font')).toBe("'New Fontshare Font', sans-serif");
  });

  it('keeps system mono stacks', () => {
    expect(fontFamily('system-mono')).toContain('monospace');
  });
});
