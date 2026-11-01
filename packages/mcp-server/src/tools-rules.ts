import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import rulesData from './design-rules.json';
import { textResult, errorResult } from './lib.js';

type DesignRule = (typeof rulesData.rules)[number];

const RULES: DesignRule[] = rulesData.rules;
const CATEGORIES = [...new Set(RULES.map((r) => r.category))];
const PLATFORMS = [...new Set(RULES.flatMap((r) => r.appliesTo))];

function normalize(value: string): string {
  return value.trim().toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
}

function findCategory(input: string): string | undefined {
  const wanted = normalize(input).replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');
  return CATEGORIES.find((c) => normalize(c) === wanted || normalize(c) === normalize(input));
}

function softValues(rule: DesignRule): string {
  const parts: string[] = [];
  if (rule.korridor) parts.push(`Korridor: ${rule.korridor}`);
  if (rule.default) parts.push(`Vorgabe: ${rule.default}`);
  return parts.join(' · ');
}

function renderSummary(rules: DesignRule[]): string {
  const lines: string[] = [];
  for (const category of CATEGORIES) {
    const inCategory = rules.filter((r) => r.category === category);
    if (inCategory.length === 0) continue;
    lines.push(`## ${category}`, '');
    for (const rule of inCategory) {
      const soft = softValues(rule);
      lines.push(`- **${rule.title}** (\`${rule.slug}\`, ${rule.scope}): ${rule.rule}${soft ? ` _${soft}_` : ''}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function renderFull(rule: DesignRule): string {
  const meta = [`${rule.category} · ${rule.scope} · ${rule.appliesTo.join(', ')}`, softValues(rule)].filter(Boolean).join(' · ');
  return [`# ${rule.title}`, '', meta, rule.url, '', rule.body].join('\n');
}

const HEADER = [
  `Design rules from standby.design: universal rules for building UI with the tokens. Overview: ${rulesData.source} · all rules as one Markdown file: ${rulesData.markdown}`,
  'The rule texts are in German. Each full rule explains the rule (Regel), why it holds (Warum), how to spot a violation in code (Woran Du den Verstoß erkennst), a right/wrong example and its limits (Grenzen). "Korridor" is the allowed range of a soft value, "Vorgabe" is its default until the project defines its own value — prefer the project\'s tokens over the default.',
].join('\n\n');

export const PROJECT_SETUP_GUIDE = [
  '# Set up or update standby.design rule enforcement in this project',
  '',
  'Run these steps in the root folder of the project (where package.json is), then report the summary to the user.',
  '',
  '1. Run `npx standby-design-lint@latest init`. It installs or updates the package and sets up, or updates in place:',
  '   - a Claude Code hook in `.claude/settings.json` that lints every edited line against the rules,',
  '   - a pre-commit hook that warns about new violations (husky if present, otherwise the git hooks folder),',
  '   - a CI workflow `.github/workflows/design-lint.yml` that fails a pull request with new violations,',
  '   - the skill `.claude/skills/design-review` for a visual review of a finished screen,',
  '   - a short rules block in `CLAUDE.md` / `AGENTS.md`, and `standbyDesignLint` settings in package.json.',
  '   Running it again only updates; it never duplicates entries.',
  '2. Check `standbyDesignLint.componentPaths` in package.json: it must list the folder of the project\'s base components (default `/components/ui/`). Hover and focus styles are only allowed there.',
  '3. Commit the changed files. If GitHub rejects the push because of the workflow file, the token lacks the `workflow` scope: ask the user to run `gh auth refresh -s workflow`.',
  '4. Existing violations stay untouched; only new or changed lines are checked. To see all of them: `npx standby-design-lint src`.',
  '',
  'No package.json (not a JavaScript project): skip step 1 to 4. The rules still apply through get_design_rules.',
  'The rule texts come from this MCP server. A locally installed server (npx standby-design-mcp) loads a new version after the client restarts; mcp.standby.design is always current.',
].join('\n');

export function registerRuleTools(server: McpServer) {
  server.registerTool(
    'update_project',
    {
      title: 'Set up or update rule enforcement in a project',
      description: 'Returns the steps to install or update the standby.design rule enforcement (lint hook, pre-commit, CI, review skill, agent instructions) in the current project. Call this when the user asks to get the latest standby.design rules or update, e.g. "Hol Dir das Update", "update standby", "set up the design rules here".',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => textResult(PROJECT_SETUP_GUIDE)
  );

  server.registerTool(
    'get_design_rules',
    {
      title: 'Get design rules',
      description: `Universal design rules for building UI with design tokens: layout, flow (empty, loading and error states, dialogs), shape, surfaces, interaction and keyboard access, forms, content structure, states, typography, color and stack rules for Tailwind/React Native. The tokens say which values exist; these rules say how to use them. Call this before building or reviewing views. Without arguments it returns every rule as one line (${RULES.length} rules); pass rules (slugs) or a category with detail "full" for the complete text including how to detect violations in code. Rule texts are in German. Categories: ${CATEGORIES.join(', ')}.`,
      inputSchema: {
        category: z.string().optional().describe(`Only rules from this category: ${CATEGORIES.join(', ')}.`),
        platform: z.enum(PLATFORMS as [string, ...string[]]).optional().describe('Only rules that apply to this platform.'),
        scope: z.enum(['universal', 'stack']).optional().describe('"universal" applies to every project, "stack" to one technology (e.g. Tailwind, React Native).'),
        rules: z.array(z.string()).optional().describe('Rule slugs (from the summary) to return in full.'),
        detail: z.enum(['summary', 'full']).optional().describe('"summary" (default): one line per rule. "full": complete rule text. Defaults to "full" when rules are given.'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (args) => {
      let selected = RULES;

      if (args.category) {
        const category = findCategory(args.category);
        if (!category) return errorResult(`Unknown category "${args.category}". Available: ${CATEGORIES.join(', ')}.`);
        selected = selected.filter((r) => r.category === category);
      }
      if (args.platform) selected = selected.filter((r) => r.appliesTo.includes(args.platform as string));
      if (args.scope) selected = selected.filter((r) => r.scope === args.scope);
      if (args.rules?.length) {
        const unknown = args.rules.filter((slug) => !RULES.some((r) => r.slug === slug));
        if (unknown.length) return errorResult(`Unknown rule slug(s): ${unknown.join(', ')}. Call get_design_rules without arguments to list all slugs.`);
        selected = selected.filter((r) => args.rules!.includes(r.slug));
      }

      if (selected.length === 0) return textResult(`${HEADER}\n\nNo rules match these filters.`);

      const detail = args.detail ?? (args.rules?.length ? 'full' : 'summary');
      const filtered = Boolean(args.category || args.rules?.length);

      if (detail === 'full' && filtered) {
        return textResult([HEADER, ...selected.map(renderFull)].join('\n\n---\n\n'));
      }

      const hint = detail === 'full'
        ? 'Full text is limited to a category or a list of rule slugs, to keep the response small. Showing the summary instead.'
        : 'For the full text of a rule, call get_design_rules with rules: ["<slug>"] or with a category and detail: "full".';
      return textResult(`${HEADER}\n\n${hint}\n\n${renderSummary(selected)}`);
    }
  );
}
