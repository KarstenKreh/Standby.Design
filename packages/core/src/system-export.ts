import type { DesignSystem } from './design-system';
import { colorCssExport, colorLlmBriefing } from './color-code-export';
import {
  generateCssExport as generateTypeCss,
  generateTailwindV4Export as generateTypeTailwind,
  generateLlmBriefing as generateTypeLlmBriefing,
  generateFontEmbed,
  typeDesignTokens,
  typeOptsFromState,
} from './type-code-export';
import { generateSpaceCss, generateSpaceTailwind, generateSpaceLlmBriefing, spaceDesignTokens, spaceOptsFromState } from './space-code-export';
import { generateShapeCss, generateShapeTailwind, generateShapeLlmBriefing, generateShapeDesignTokens, shapeOptsFromState } from './shape-code-export';
import { generateSymbolCss, generateSymbolTailwind, generateSymbolLlmBriefing, symbolDesignTokens } from './symbol-code-export';
import { generateMotionCss, generateMotionDesignTokens, generateMotionLlmBriefing } from './motion-code-export';
import { llmRulesFooter, withShareLink, type ShareableFormat } from './share-link';

export type SystemSection = 'color' | 'type' | 'space' | 'shape' | 'symbol' | 'motion';

export const SYSTEM_SECTIONS: readonly SystemSection[] = ['color', 'type', 'space', 'shape', 'symbol', 'motion'];

export type SystemExportFormat = ShareableFormat;

export function defaultSections(system: DesignSystem): SystemSection[] {
  return SYSTEM_SECTIONS.filter(s => s !== 'symbol' || system.symbol !== null);
}

interface SectionExports {
  css(): string;
  tailwind(): string;
  briefing(): string;
  tokens(): Record<string, unknown>;
}

function sectionExports(system: DesignSystem): Record<SystemSection, SectionExports | null> {
  const typeOpts = typeOptsFromState(system.type, system.scale);
  const spaceOpts = spaceOptsFromState(system.space, system.spacing);
  const shapeOpts = shapeOptsFromState(system.shape, system.palettes.surface);
  const motionOpts = { character: system.motion, primitives: system.motionPrimitives };
  const symbol = system.symbol;
  const colorCss = () => colorCssExport(system.color, system.palettes);

  return {
    color: { css: colorCss, tailwind: colorCss, briefing: () => colorLlmBriefing(system.color, system.palettes), tokens: () => ({}) },
    type: {
      css: () => generateTypeCss(typeOpts),
      tailwind: () => generateTypeTailwind(typeOpts),
      briefing: () => generateTypeLlmBriefing(typeOpts),
      tokens: () => typeDesignTokens(typeOpts),
    },
    space: {
      css: () => generateSpaceCss(spaceOpts),
      tailwind: () => generateSpaceTailwind(spaceOpts),
      briefing: () => generateSpaceLlmBriefing(spaceOpts),
      tokens: () => spaceDesignTokens(spaceOpts),
    },
    shape: {
      css: () => generateShapeCss(shapeOpts),
      tailwind: () => generateShapeTailwind(shapeOpts),
      briefing: () => generateShapeLlmBriefing(shapeOpts),
      tokens: () => ({ shape: JSON.parse(generateShapeDesignTokens(shapeOpts)) }),
    },
    symbol: symbol && {
      css: () => generateSymbolCss(symbol),
      tailwind: () => generateSymbolTailwind(symbol),
      briefing: () => generateSymbolLlmBriefing(symbol),
      tokens: () => symbolDesignTokens(symbol),
    },
    motion: {
      css: () => generateMotionCss(motionOpts),
      tailwind: () => generateMotionCss(motionOpts),
      briefing: () => generateMotionLlmBriefing(motionOpts),
      tokens: () => JSON.parse(generateMotionDesignTokens(motionOpts)),
    },
  };
}

function compose(system: DesignSystem, format: SystemExportFormat, sections: readonly SystemSection[]): string {
  const exports = sectionExports(system);
  const chosen = SYSTEM_SECTIONS.filter(s => sections.includes(s)).map(s => exports[s]).filter((e): e is SectionExports => e !== null);

  switch (format) {
    case 'css':
      return chosen.map(e => e.css()).join('\n') || '/* No sections selected */';
    case 'tailwind':
      return chosen.map(e => e.tailwind()).join('\n') || '/* No sections selected */';
    case 'llm-briefing':
      return chosen.length ? chosen.map(e => e.briefing()).join('\n---\n\n') + llmRulesFooter() : '<!-- No sections selected -->';
    case 'design-tokens':
      return JSON.stringify(Object.assign({}, ...chosen.map(e => e.tokens())), null, 2);
    case 'font-embed':
      return generateFontEmbed(system.type.headingFont, system.type.bodyFont, system.type.monoFont);
  }
}

export function generateSystemExport(
  system: DesignSystem,
  format: SystemExportFormat,
  { sections = defaultSections(system), shareUrl }: { sections?: readonly SystemSection[]; shareUrl: string },
): string {
  return withShareLink(format, shareUrl, compose(system, format, sections));
}
