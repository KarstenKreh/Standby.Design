import { describe, it, expect } from 'vitest';
import { generatePrimitivesOklch, generateSemantic } from './code-export';
import { generatePalette, type PaletteEntry } from '@core/palette';
import { contrastRatio, oklchToHex } from '@core/color-math';
import type { AccentPalette } from '@/hooks/use-palette';
import type { FgContrastMode } from '@/store/theme-store';

function makePalettes() {
  const brand = generatePalette('#335A7F');
  const surface = generatePalette('#335A7F', 0.25);
  const error = generatePalette('#CC3333');
  const errorSurface = generatePalette('#CC3333', 0.25);
  const neutral = generatePalette('#335A7F', 0);
  return { brand, surface, error, errorSurface, neutral };
}

describe('generatePrimitivesOklch', () => {
  it('contains :root block', () => {
    const { brand, surface, error, errorSurface, neutral } = makePalettes();
    const output = generatePrimitivesOklch(
      brand, surface, error, errorSurface, neutral,
      [], 0.25, null, 'TestTheme'
    );
    expect(output).toContain(':root {');
  });

  it('contains theme name in header', () => {
    const { brand, surface, error, errorSurface, neutral } = makePalettes();
    const output = generatePrimitivesOklch(
      brand, surface, error, errorSurface, neutral,
      [], 0.25, null, 'TestTheme'
    );
    expect(output).toContain('TestTheme');
  });

  it('contains brand tokens', () => {
    const { brand, surface, error, errorSurface, neutral } = makePalettes();
    const output = generatePrimitivesOklch(
      brand, surface, error, errorSurface, neutral,
      [], 0.25, null, 'TestTheme'
    );
    expect(output).toContain('--color-brand-500');
    expect(output).toContain('oklch(');
  });

  it('contains surface, error, neutral tokens', () => {
    const { brand, surface, error, errorSurface, neutral } = makePalettes();
    const output = generatePrimitivesOklch(
      brand, surface, error, errorSurface, neutral,
      [], 0.25, null, 'TestTheme'
    );
    expect(output).toContain('--color-surface-');
    expect(output).toContain('--color-error-');
    expect(output).toContain('--color-neutral-');
  });

  it('snapshot stability', () => {
    const { brand, surface, error, errorSurface, neutral } = makePalettes();
    const output = generatePrimitivesOklch(
      brand, surface, error, errorSurface, neutral,
      [], 0.25, null, 'TestTheme'
    );
    expect(output).toMatchSnapshot();
  });
});

describe('generateSemantic', () => {
  it('contains :root and .dark blocks', () => {
    const { brand, surface, error, errorSurface } = makePalettes();
    const output = generateSemantic(
      [], brand, error, errorSurface, surface,
      false, null, false,
      false, null, false,
      'best', 'TestTheme'
    );
    expect(output).toContain(':root {');
    expect(output).toContain('.dark {');
  });

  it('contains theme name in header', () => {
    const { brand, surface, error, errorSurface } = makePalettes();
    const output = generateSemantic(
      [], brand, error, errorSurface, surface,
      false, null, false,
      false, null, false,
      'best', 'TestTheme'
    );
    expect(output).toContain('TestTheme');
  });

  it('contains standard semantic tokens', () => {
    const { brand, surface, error, errorSurface } = makePalettes();
    const output = generateSemantic(
      [], brand, error, errorSurface, surface,
      false, null, false,
      false, null, false,
      'best', 'TestTheme'
    );
    expect(output).toContain('--background');
    expect(output).toContain('--foreground');
    expect(output).toContain('--primary');
    expect(output).toContain('--destructive');
    expect(output).toContain('--border');
    expect(output).toContain('--ring');
    // Shadows moved to /shape
    expect(output).not.toContain('--shadow-');
  });

  it('snapshot stability', () => {
    const { brand, surface, error, errorSurface } = makePalettes();
    const output = generateSemantic(
      [], brand, error, errorSurface, surface,
      false, null, false,
      false, null, false,
      'best', 'TestTheme'
    );
    expect(output).toMatchSnapshot();
  });
});

interface ParsedBlock {
  tokens: Record<string, string>;
  comments: string[];
}

function parseBlocks(css: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  let current: ParsedBlock | null = null;
  for (const line of css.split('\n')) {
    if (/^(:root|\.dark) \{$/.test(line)) {
      current = { tokens: {}, comments: [] };
      continue;
    }
    if (line === '}') {
      if (current) blocks.push(current);
      current = null;
      continue;
    }
    if (!current) continue;
    const decl = line.match(/^\s*--([\w-]+):\s*(.+);$/);
    if (decl) {
      current.tokens[decl[1]] = decl[2];
      continue;
    }
    const comment = line.match(/^\s*\/\*\s*(.*?)\s*\*\/$/);
    if (comment) current.comments.push(comment[1]);
  }
  return blocks;
}

function resolveHex(value: string, maps: Record<string, PaletteEntry[]>): string | null {
  const ref = value.match(/^var\(--color-([a-z0-9-]+)-(\d+)\)$/);
  if (ref) {
    const palette = maps[ref[1]];
    if (!palette) return null;
    const step = Number(ref[2]);
    return palette.find(e => (e.step as number) === step)?.hex ?? null;
  }
  const oklch = value.match(/^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/);
  if (oklch) return oklchToHex(Number(oklch[1]), Number(oklch[2]), Number(oklch[3]));
  return null;
}

const ACCENT_SEEDS = [
  { name: 'Success', cssName: 'success', hex: '#168A2A' },
  { name: 'Warning', cssName: 'warning', hex: '#906D12' },
  { name: 'Info', cssName: 'info', hex: '#1271D5' },
];

const ERROR_SEED = '#D31A29';

function makeTheme(brandHex: string, fgMode: FgContrastMode, pin: boolean) {
  const brand = generatePalette(brandHex);
  const surface = generatePalette(brandHex, 0.25);
  const error = generatePalette(ERROR_SEED);
  const errorSurface = generatePalette(ERROR_SEED, 0.25);
  const neutral = generatePalette(brandHex, 0);
  const neutralExtended: PaletteEntry[] = [
    { step: 0 as PaletteEntry['step'], L: 1, C: 0, H: 0, hex: '#FFFFFF', css: 'oklch(1 0 0)' },
    ...neutral.filter(e => (e.step as number) !== 0),
    { step: 1000 as PaletteEntry['step'], L: 0, C: 0, H: 0, hex: '#000000', css: 'oklch(0 0 0)' },
  ];

  const accentPalettes: AccentPalette[] = ACCENT_SEEDS.map(a => ({
    name: a.name,
    hex: a.hex,
    cssName: a.cssName,
    palette: generatePalette(a.hex),
    slatedPalette: generatePalette(a.hex, 0.25),
    pin,
    invert: false,
  }));

  const maps: Record<string, PaletteEntry[]> = {
    brand,
    surface,
    error,
    'error-surface': errorSurface,
    neutral: neutralExtended,
  };
  accentPalettes.forEach(a => {
    maps[a.cssName] = a.palette;
    maps[`${a.cssName}-surface`] = a.slatedPalette;
  });

  const css = generateSemantic(
    accentPalettes, brand, error, errorSurface, surface,
    pin, pin ? brandHex : null, false,
    pin, pin ? ERROR_SEED : null, false,
    fgMode, 'ContrastTheme'
  );

  return { css, maps };
}

const FILL_ROLES: { token: string; warnToken: string }[] = [
  { token: 'primary', warnToken: 'primary-foreground' },
  { token: 'sidebar-primary', warnToken: 'primary-foreground' },
  { token: 'destructive', warnToken: 'destructive-foreground' },
  ...ACCENT_SEEDS.map(a => ({ token: a.cssName, warnToken: `${a.cssName}-foreground` })),
];

const CONTRAST_SEEDS = ['#00857A', '#335A7F', '#D31A29', '#168A2A', '#906D12', '#1271D5'];
const FG_MODES: FgContrastMode[] = ['best', 'preferLight', 'preferDark'];

describe('filled roles reach WCAG AA or carry a warning', () => {
  for (const seed of CONTRAST_SEEDS) {
    for (const pin of [true, false]) {
      for (const fgMode of FG_MODES) {
        it(`${seed} · ${pin ? 'pinned' : 'generated'} · ${fgMode}`, () => {
          const { css, maps } = makeTheme(seed, fgMode, pin);
          const blocks = parseBlocks(css);
          expect(blocks.length).toBeGreaterThan(0);

          for (const block of blocks) {
            for (const role of FILL_ROLES) {
              const fillValue = block.tokens[role.token];
              const fgValue = block.tokens[`${role.token}-foreground`];
              if (!fillValue || !fgValue) continue;

              const fillHex = resolveHex(fillValue, maps);
              const fgHex = resolveHex(fgValue, maps);
              expect(fillHex, `unresolved fill ${role.token}: ${fillValue}`).not.toBeNull();
              expect(fgHex, `unresolved foreground ${role.token}: ${fgValue}`).not.toBeNull();

              const cr = contrastRatio(fillHex!, fgHex!);
              const warned = block.comments.some(c => c.startsWith(`⚠ --${role.warnToken} reaches only`));
              expect(
                cr >= 4.5 || warned,
                `--${role.token} / --${role.token}-foreground: ${cr.toFixed(2)}:1 and no warning`
              ).toBe(true);
            }
          }
        });
      }
    }
  }

  it('pinned Safina brand #00857A keeps step 25 and is warned about', () => {
    const { css, maps } = makeTheme('#00857A', 'preferLight', true);
    const [light] = parseBlocks(css);
    const fgHex = resolveHex(light.tokens['primary-foreground'], maps)!;
    const step25 = generatePalette('#00857A').find(e => (e.step as number) === 25)!.hex;
    expect(contrastRatio('#00857A', fgHex)).toBeCloseTo(contrastRatio('#00857A', step25), 1);
    expect(light.comments.some(c => c.startsWith('⚠ --primary-foreground reaches only 4.01:1'))).toBe(true);
  });

  it('a seed with enough contrast stays free of warnings', () => {
    const { css, maps } = makeTheme('#335A7F', 'preferLight', true);
    const [light] = parseBlocks(css);
    const fillHex = resolveHex(light.tokens['primary'], maps)!;
    const fgHex = resolveHex(light.tokens['primary-foreground'], maps)!;
    expect(contrastRatio(fillHex, fgHex)).toBeGreaterThanOrEqual(4.5);
    expect(light.comments.some(c => c.startsWith('⚠ --primary-foreground'))).toBe(false);
  });
});

describe('popover always equals card', () => {
  const { css } = makeTheme('#00857A', 'best', false);
  const blocks = parseBlocks(css);
  const [baseLight, baseDark] = blocks;

  it('base scope matches in :root and .dark', () => {
    expect(baseLight.tokens['card']).toBe('var(--color-surface-25)');
    expect(baseDark.tokens['card']).toBe('var(--color-surface-825)');
    expect(baseLight.tokens['popover']).toBe(baseLight.tokens['card']);
    expect(baseDark.tokens['popover']).toBe(baseDark.tokens['card']);
  });

  for (const accent of ACCENT_SEEDS) {
    it(`${accent.cssName} scope matches in :root and .dark`, () => {
      const scopedBlocks = blocks.filter(b => b.tokens[`${accent.cssName}-popover`]);
      expect(scopedBlocks).toHaveLength(2);
      const [accentLight, accentDark] = scopedBlocks;
      expect(accentLight.tokens[`${accent.cssName}-card`]).toBe(`var(--color-${accent.cssName}-surface-25)`);
      expect(accentDark.tokens[`${accent.cssName}-card`]).toBe(`var(--color-${accent.cssName}-surface-825)`);
      for (const block of scopedBlocks) {
        expect(block.tokens[`${accent.cssName}-popover`]).toBe(block.tokens[`${accent.cssName}-card`]);
      }
    });
  }
});
