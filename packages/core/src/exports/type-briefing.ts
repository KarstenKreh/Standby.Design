// Single source of truth for the type LLM briefing.
// Lifted from system-react (superset: includes Spacing section + /space reference).
// type-react and system-react both consume from here.

import type { ComputedLevel } from '../scale';
import type { SpacingToken } from '../spacing';
import { fontFamily } from '../fontshare';

export interface TypeBriefingInput {
  levels: ComputedLevel[];
  spacingTokens: SpacingToken[];
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  scaleLabel: string;
}

export function generateTypeBriefing(input: TypeBriefingInput): string {
  const { levels, spacingTokens, headingFont, bodyFont, monoFont, scaleLabel } = input;

  const headingFF = fontFamily(headingFont);
  const bodyFF = fontFamily(bodyFont);
  const monoFF = fontFamily(monoFont);

  let md = `# Type Scale — ${scaleLabel}\n\n`;

  md += `## Fonts\n\n`;
  md += `- **Heading:** ${headingFF}\n`;
  md += `- **Body:** ${bodyFF}\n`;
  md += `- **Mono:** ${monoFF}\n`;

  md += `\n## Type Scale\n\n`;
  md += `| Level | Min | Max | clamp() |\n`;
  md += `|-------|-----|-----|---------|\n`;
  for (const l of levels) {
    if (l.isFluid) {
      md += `| ${l.label} | ${l.minRem}rem | ${l.maxRem}rem | \`${l.clampValue}\` |\n`;
    } else {
      md += `| ${l.label} | ${l.maxRem}rem | — | ${l.maxRem}rem |\n`;
    }
  }

  md += `\n## Line Heights\n\n`;
  md += `| Level | Value |\n`;
  md += `|-------|-------|\n`;
  for (const l of levels) {
    md += `| ${l.label} | ${l.lineHeight} |\n`;
  }

  md += `\n## Letter Spacing\n\n`;
  md += `| Level | Value |\n`;
  md += `|-------|-------|\n`;
  for (const l of levels) {
    md += `| ${l.label} | ${l.letterSpacing}em |\n`;
  }

  if (spacingTokens.length > 0) {
    md += `\n## Spacing Scale\n\n`;
    md += `| Token | Value |\n`;
    md += `|-------|-------|\n`;
    for (const t of spacingTokens) {
      md += `| --space-${t.name} | ${t.rem}rem (${t.px}px) |\n`;
    }
  }

  md += `\n## Usage\n\n`;
  md += `Use the CSS custom properties from the CSS or Tailwind export.\n`;
  md += `Font sizes use \`clamp()\` for fluid scaling between 375px and 1920px viewport.\n`;
  md += `Combine with color tokens from standby.design/color, shape tokens from standby.design/shape, and spacing/layout tokens from standby.design/space.\n`;

  return md;
}
