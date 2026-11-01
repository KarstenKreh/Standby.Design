import { describe, it, expect } from 'vitest';
import { buildThemePalettes } from './theme-palettes';
import { DEFAULT_COLOR_STATE, type DecodedState } from './url-state/color';
import { colorSemanticExport, colorTailwindExport, colorThemeInlineExport, generateColorThemeInline } from './color-code-export';
import { resolveDesignSystem } from './design-system';
import { generateSystemExport } from './system-export';

function state(overrides: Partial<DecodedState> = {}): DecodedState {
  return { ...DEFAULT_COLOR_STATE, ...overrides };
}

describe('generateColorThemeInline', () => {
  it('maps each semantic token once to a Tailwind color utility', () => {
    const css = ':root {\n  /* Base */\n  --background: var(--color-surface-50);\n  --primary: var(--color-brand-600);\n}\n.dark {\n  --background: var(--color-surface-950);\n}\n';
    expect(generateColorThemeInline(css)).toContain('@theme inline {\n  --color-background: var(--background);\n  --color-primary: var(--primary);\n}');
  });

  it('covers every semantic token of the export, including accent scopes', () => {
    const s = state({ extraAccents: [{ name: 'Gold', hex: '#c8a020', pin: false, invert: false, autoMatch: false, autoHue: 0 }] });
    const pal = buildThemePalettes(s);
    const semantic = colorSemanticExport(s, pal);
    const block = colorThemeInlineExport(s, pal);
    const names = new Set([...semantic.matchAll(/^\s*--([a-z0-9-]+):/gm)].map((match) => match[1]));
    for (const name of names) expect(block).toContain(`--color-${name}: var(--${name});`);
    expect(block).toContain('--color-border-muted: var(--border-muted);');
    expect(block).toMatch(/--color-gold(-[a-z-]+)?: var\(--gold/);
  });

  it('ends the Tailwind export, while the CSS export stays plain', () => {
    const s = state();
    const pal = buildThemePalettes(s);
    expect(colorTailwindExport(s, pal)).toMatch(/@theme inline \{[\s\S]*\}\n$/);
    const system = resolveDesignSystem({ c: null, t: null, s: null, y: null, p: null, m: null });
    const options = { sections: ['color'] as const, shareUrl: 'https://standby.design/system' };
    expect(generateSystemExport(system, 'tailwind', options)).toContain('@theme inline {');
    expect(generateSystemExport(system, 'css', options)).not.toContain('@theme inline');
  });
});
