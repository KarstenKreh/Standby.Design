// System-level briefing: composes the color + type briefings into a single
// markdown doc with a design-system header. Used by the MCP
// generate_design_system tool and by the system-react combined export.

import { generateColorBriefing, type ColorBriefingInput } from './color-briefing';
import { generateTypeBriefing, type TypeBriefingInput } from './type-briefing';

export interface SystemBriefingInput {
  themeName: string;
  color: ColorBriefingInput;
  type: TypeBriefingInput;
}

export function generateSystemBriefing(input: SystemBriefingInput): string {
  const { themeName, color, type } = input;
  const title = themeName || 'Untitled Design System';

  const header = `# ${title} — Design System

A unified token set combining color, typography, and spacing. All values are
production-ready CSS custom properties compatible with shadcn/ui and Tailwind v4.
Use in pairs: background tokens always paired with their \`*-foreground\` counterparts,
type tokens paired with matching \`--leading-*\` and \`--tracking-*\` values.

---

`;

  // Strip the top-level # heading from each sub-briefing to avoid heading clashes;
  // keep everything from the first ## onward.
  const stripTopHeading = (md: string): string => {
    const lines = md.split('\n');
    let i = 0;
    while (i < lines.length && !lines[i].startsWith('## ')) i++;
    return lines.slice(i).join('\n');
  };

  const colorMd = stripTopHeading(generateColorBriefing(color));
  const typeMd = stripTopHeading(generateTypeBriefing(type));

  return `${header}# Color

${colorMd}

---

# Typography & Spacing

${typeMd}
`;
}
