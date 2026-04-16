// Single source of truth for the color LLM briefing.
// Previously duplicated (and drifted) between color-react and system-react.
// Reconciles both: keeps color-react's Surface Layering paragraph and
// system-react's border-radius usage note.

import type { AccentPalette } from '../orchestrate';
import type { FgContrastMode } from '../url-state/color';
import type { PaletteMode } from '../palette';

export interface ColorBriefingInput {
  brandHex: string;
  effectiveBgHex: string;
  effectiveErrorHex: string;
  accentPalettes: AccentPalette[];
  chromaScale: number;
  mode: PaletteMode;
  brandPin: boolean;
  errorPin: boolean;
  themeName: string;
  fgContrastMode: FgContrastMode;
}

export function generateColorBriefing(input: ColorBriefingInput): string {
  const {
    brandHex,
    effectiveBgHex,
    effectiveErrorHex,
    accentPalettes,
    chromaScale,
    mode,
    brandPin,
    errorPin,
    themeName,
    fgContrastMode,
  } = input;

  const pct = Math.round(chromaScale * 100);
  const title = themeName || 'Untitled Theme';

  const fgLabel = fgContrastMode === 'best' ? 'Best Contrast (auto)' :
    fgContrastMode === 'preferLight' ? 'Prefer Light' : 'Prefer Dark';

  const colorRows = [
    `| Brand | \`${brandHex}\` | \`--color-brand-*\` | Primary interactive color${brandPin ? ' (pinned)' : ''} |`,
    `| Surface | \`${effectiveBgHex}\` | \`--color-surface-*\` | Background/container tint at ${pct}% chroma |`,
    `| Error | \`${effectiveErrorHex}\` | \`--color-error-*\` | Destructive/alert color${errorPin ? ' (pinned)' : ''} |`,
    `| Neutral | derived | \`--color-neutral-*\` | 0% chroma variant for high-contrast surfaces |`,
    ...accentPalettes.map(a =>
      `| ${a.name} | \`${a.hex}\` | \`--color-${a.cssName}-*\` | Additional accent${a.pin ? ' (pinned)' : ''} |`
    ),
  ].join('\n');

  const pinnedNote = (brandPin || errorPin || accentPalettes.some(a => a.pin))
    ? `\n> **Pinned** means the exact input hex is used for primary/destructive button colors instead of the generated palette step (brand-600/400 or error-600/400).\n`
    : '';

  let pinnedContrastWarning = '';
  if (brandPin) {
    pinnedContrastWarning = `
> ⚠ **Contrast warning — pinned primary**: The pinned brand color (\`${brandHex}\`) may not have sufficient contrast (WCAG AA 4.5:1) against your surface backgrounds when used as a text color. **Do not use \`--primary\` for body text.** Use \`--foreground\` for general text. \`--primary-foreground\` is only for text on primary-colored backgrounds (e.g. buttons).
`;
  }

  return `# ${title} — Theme Briefing

All colors are generated in the **OKLCH** color space (perceptually uniform). Gamut mapping to sRGB is handled automatically — you never need to worry about out-of-gamut values.

## Seed Colors

| Role | Hex | CSS prefix | Notes |
|------|-----|------------|-------|
${colorRows}
${pinnedNote}${pinnedContrastWarning}
## Semantic Token Mapping

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| \`--background\` | surface-50 | surface-875 | Page background |
| \`--foreground\` | surface-975 | surface-25 | Primary text |
| \`--card\` | surface-25 | surface-825 | Card backgrounds |
| \`--popover\` | surface-25 | surface-800 | Popover/dropdown |
| \`--primary\` | brand-600 | brand-400 | Primary buttons, links |
| \`--secondary\` | brand-100 | brand-900 | Secondary buttons |
| \`--muted\` | surface-75 | surface-850 | Muted backgrounds |
| \`--accent\` | brand-100 | brand-800 | Subtle highlights |
| \`--destructive\` | error-600 | error-400 | Error/delete actions |
| \`--destructive-subtle\` | error-100 | error-800 | Inline errors, alert backgrounds |
| \`--destructive-border\` | error-surface-300 | error-surface-700 | Error borders |
| \`--border\` | surface-300 | surface-600 | Default borders |
| \`--border-muted\` | surface-100 | surface-800 | Subtle separators |
| \`--input\` | surface-300 | surface-700 | Input borders |
| \`--ring\` | surface-400 | surface-500 | Focus rings |

### Sidebar

| Token | Light | Dark |
|-------|-------|------|
| \`--sidebar\` | surface-25 | surface-875 |
| \`--sidebar-primary\` | brand-600 | brand-400 |
| \`--sidebar-accent\` | brand-100 | brand-800 |
| \`--sidebar-border\` | surface-300 | surface-600 |

### Surface Layering

\`--background\` is the **base canvas** — the empty page with nothing on it. Everything placed on the screen (cards, lists, charts, inputs, modals) uses \`--card\`. On mobile, the visible screen is often entirely covered by content, so the entire screen may appear as \`--card\` — but \`--background\` is still the layer underneath, visible in gaps between widgets or behind sheet transitions. On desktop, \`--background\` is more visible because containers don't always fill the viewport. Think of it as: \`--background\` = the wall, \`--card\` = the paper pinned to it.

Every background token has a matching \`*-foreground\` counterpart. Always pair them.
${accentPalettes.length > 0 ? `
### Accent Scopes

Each accent color provides a full semantic scope:
${accentPalettes.map(a => `- **${a.name}** (\`--${a.cssName}\`): \`-foreground\`, \`-background\`, \`-card\`, \`-popover\`, \`-secondary\`, \`-muted\`, \`-accent\`, \`-subtle\`, \`-border\`, \`-border-muted\`, \`-input\`, \`-ring\` — each with light/dark variants.`).join('\n')}
` : ''}
## How to Use

1. **Use semantic tokens** (\`--primary\`, \`--background\`, etc.) in component code — never reference primitive step numbers directly.
2. **Tailwind**: All tokens are available as Tailwind utilities (\`bg-primary\`, \`text-foreground\`, \`border-border\`, etc.).
3. **Dark mode**: Add \`.dark\` to \`<html>\` or a container. All semantic tokens remap automatically.
4. **Borders**: Default to \`--border-muted\` for subtle separation. Use \`--border\` for visible borders (inputs, focused elements).
5. **Shadows and radii**: see standby.design/shape for hue-matched shadow tokens and border-radius scales.
6. **Border-radius**: Base \`--radius: 0.625rem\`. Derived sizes: \`--radius-sm\` (0.6×) through \`--radius-4xl\` (2.6×).

## Primitive Scale Reference

Each color uses an 18-step scale: **25, 50, 75, 100, 200–800, 825, 850, 875, 900, 925, 950, 975**

- **25–100** — light surfaces (backgrounds, cards)
- **200–800** — core palette (buttons, text, accents)
- **825–875** — dark-mode surfaces
- **900–975** — high-contrast surfaces

Two variants per color:
- \`--color-{name}-{step}\` — full chroma (interactive elements)
- \`--color-{name}-surface-{step}\` — ${pct}% chroma (backgrounds, containers)

## Settings

- **Palette mode**: ${mode === 'balanced' ? 'Balanced midpoint' : 'Brand Centered'}
- **Foreground contrast**: ${fgLabel}
- **Surface chroma**: ${pct}%
`;
}
