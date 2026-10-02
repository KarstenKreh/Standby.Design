import { computeIconTokens, weightToStroke, type IconTokens } from './icon-tokens';
import { ICON_SETS, getSetById, type IconSetDefinition } from './icon-sets';
import { recommendSets, type RecommendedSet, type SymbolPreferences } from './recommend';
import type { UrlState as SymbolState } from './url-state/symbol';

export interface ResolvedIconSet {
  set: IconSetDefinition;
  selected: boolean;
}

export function symbolPreferences(state: SymbolState): SymbolPreferences {
  return { style: state.preferredStyle, mood: 50, weight: state.preferredWeight, corners: state.preferredCorners };
}

export function resolveIconSet(state: SymbolState): ResolvedIconSet {
  const chosen = state.selectedSet ? getSetById(state.selectedSet) : undefined;
  if (chosen) return { set: chosen, selected: true };
  return { set: recommendSets(symbolPreferences(state))[0]?.set ?? ICON_SETS[0], selected: false };
}

export function alternativeIconSets(state: SymbolState): RecommendedSet[] {
  const { set } = resolveIconSet(state);
  return recommendSets(symbolPreferences(state)).filter(r => r.set.id !== set.id);
}

function symbolTokens(state: SymbolState): { resolved: ResolvedIconSet; tokens: IconTokens } {
  const resolved = resolveIconSet(state);
  const tokens = computeIconTokens(state.iconBaseSize, state.iconScale, weightToStroke(resolved.set.strokeWeight), state.snapTo4px);
  return { resolved, tokens };
}

function setLabel({ set, selected }: ResolvedIconSet): string {
  return `${selected ? 'Selected' : 'Recommended'}: ${set.name} (${set.id})`;
}

function tokenBlock(state: SymbolState, selector: string): string {
  const { resolved, tokens } = symbolTokens(state);
  return [
    `/* Icon Tokens — standby.design/symbol */`,
    `/* ${setLabel(resolved)} */`,
    `${selector} {`,
    ...tokens.sizes.map((s) => `  --icon-${s.name}: ${s.rem}rem;`),
    `  --icon-stroke: ${tokens.strokeWidth}px;`,
    `}`,
  ].join('\n');
}

export function generateSymbolCss(state: SymbolState): string {
  return tokenBlock(state, ':root');
}

export function generateSymbolTailwind(state: SymbolState): string {
  return tokenBlock(state, '@theme');
}

export function symbolDesignTokens(state: SymbolState): Record<string, unknown> {
  const { resolved, tokens } = symbolTokens(state);
  return {
    icon: {
      $description: `Icon tokens — ${setLabel(resolved).toLowerCase()}`,
      size: Object.fromEntries(tokens.sizes.map((s) => [s.name, { $type: 'dimension', $value: `${s.rem}rem` }])),
      stroke: { $type: 'dimension', $value: `${tokens.strokeWidth}px` },
    },
  };
}

export function generateSymbolDesignTokens(state: SymbolState): string {
  return JSON.stringify(symbolDesignTokens(state), null, 2);
}

export function generateSymbolLlmBriefing(state: SymbolState): string {
  const { resolved, tokens } = symbolTokens(state);
  const { set } = resolved;
  return [
    `# Icon System — standby.design/symbol`,
    ``,
    `## ${resolved.selected ? 'Selected' : 'Recommended'} Set`,
    ``,
    `**${set.name}** — ${set.description}`,
    ``,
    `- Style: ${set.style}`,
    `- Weight: ${set.strokeWeight}`,
    `- Corners: ${set.cornerStyle}`,
    `- License: ${set.license}`,
    `- Install: \`npm install ${set.npmPackage}\``,
    `- Browse: ${set.url}`,
    `- Iconify prefix: \`${set.iconifyPrefix}\``,
    ``,
    `## Sizing Tokens`,
    ``,
    `| Token | Value | Use Case |`,
    `|-------|-------|----------|`,
    ...tokens.sizes.map((s) => `| --icon-${s.name} | ${s.rem}rem (${s.px}px) | ${s.useCase} |`),
    `| --icon-stroke | ${tokens.strokeWidth}px | Stroke width |`,
    ``,
    `## Alternatives`,
    ``,
    ...alternativeIconSets(state).map((r, i) => `${i + 1}. **${r.set.name}** (${Math.round(r.score * 100)}%) — ${r.set.description}`),
    ``,
    `## Usage Guidelines`,
    ``,
    `- Use \`--icon-md\` (${tokens.sizes[2].px}px) as the default size for UI icons`,
    `- Use \`--icon-sm\` for inline icons next to body text`,
    `- Use \`--icon-lg\` for primary navigation and action buttons`,
    `- Maintain consistent stroke width of ${tokens.strokeWidth}px across all icons`,
    `- Stick to a single icon set for visual consistency`,
  ].join('\n');
}
