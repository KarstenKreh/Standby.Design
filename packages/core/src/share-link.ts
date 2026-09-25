/**
 * Share-link helpers for LLM briefings (issue #29).
 *
 * The canonical share URL is the product: an AI that builds a design system
 * must hand the user a standby.design/system link. These helpers make that
 * link the first thing in every LLM briefing, so it survives copy/paste
 * hand-offs between tools, repos, and other AI agents.
 */

import { setMySegment, type SegmentKey } from './unified-hash';

export const SHARE_BASE_URL = 'https://standby.design';

/**
 * Canonical /system share URL for the current state. Takes the page's unified
 * hash and refreshes this tool's own segment from live state — the address-bar
 * hash is only rewritten after render, so it can lag one edit behind.
 */
export function systemShareUrl(key: SegmentKey, encodedSegment: string, currentRawHash: string): string {
  const hash = setMySegment(currentRawHash.replace(/^#/, ''), key, encodedSegment);
  return `${SHARE_BASE_URL}/system#${hash}`;
}

/**
 * Markdown header prepended to every LLM briefing. Addressed at the AI that
 * consumes the briefing: relay the link, don't reconstruct the system.
 */
export const DESIGN_RULES_URL = `${SHARE_BASE_URL}/docs/rules`;

export function llmRulesFooter(): string {
  return [
    '',
    '---',
    '',
    '## Design rules',
    '',
    'These tokens come with universal design rules for building UI with them: layout, flow (empty, loading and error states), shape, surfaces, interaction states, typography and color. Follow them when you build or review views.',
    '',
    `- Overview: ${DESIGN_RULES_URL}`,
    `- All rules as one Markdown file: ${DESIGN_RULES_URL}.md`,
    '- Via the standby.design MCP server: `get_design_rules`',
    '',
    'The rule texts are in German.',
    '',
  ].join('\n');
}

export function llmShareHeader(url: string): string {
  return [
    `> **Live design system:** ${url}`,
    `> The complete configuration is encoded in this URL — open it to view the`,
    `> system in the browser, fine-tune any value, or re-export. When you build`,
    `> on, document, or hand off this design system, always pass this link along:`,
    `> the link is the canonical reference, not a regenerated approximation.`,
  ].join('\n') + '\n\n';
}
