import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PACKAGE = 'standby-design-lint';
const PACKAGE_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOOK_COMMAND = `npx --no-install ${PACKAGE} --hook`;
const PRE_COMMIT_LINE = `npx --no-install ${PACKAGE} --staged --warn`;
const PREPARE_COMMAND = `${PACKAGE} hooks || exit 0`;
const BLOCK_START = '<!-- standby-design-lint:start -->';
const BLOCK_END = '<!-- standby-design-lint:end -->';
const AGENT_BLOCK = `${BLOCK_START}
## Design-Regeln (standby.design)

- Farben, Abstände, Radien und Schriftgrößen kommen nur aus den Design-Tokens des Projekts. Text bekommt eine Rolle (\`text-role-*\`), keine einzelne Größe.
- Die Regeln liefert das MCP-Tool \`get_design_rules\` von standby-design-mcp, gefiltert nach Kategorie. Meldungen von \`${PACKAGE}\` sofort beheben. Ist ein Treffer gewollt, die Ausnahme mit \`eslint-disable-next-line\` und Begründung an die Stelle schreiben.
- Bevor ein Screen als fertig gilt, den Skill \`design-review\` ausführen.
${BLOCK_END}`;

function ownVersion() {
  return JSON.parse(readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8')).version;
}

function readJson(file, fallback) {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : fallback;
}

function indentOf(file) {
  const match = existsSync(file) ? /\n([ \t]+)"/.exec(readFileSync(file, 'utf8')) : null;
  return match ? match[1] : 2;
}

function writeIfChanged(file, content) {
  const before = existsSync(file) ? readFileSync(file, 'utf8') : null;
  if (before === content) return 'unverändert';
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
  return before === null ? 'angelegt' : 'aktualisiert';
}

function packageManager(root) {
  if (existsSync(path.join(root, 'pnpm-lock.yaml'))) return ['pnpm', ['add', '-D']];
  if (existsSync(path.join(root, 'yarn.lock'))) return ['yarn', ['add', '-D']];
  if (existsSync(path.join(root, 'bun.lockb')) || existsSync(path.join(root, 'bun.lock'))) return ['bun', ['add', '-d']];
  return ['npm', ['install', '-D']];
}

function installPackage(root) {
  const [command, args] = packageManager(root);
  execFileSync(command, [...args, `${PACKAGE}@latest`], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
  return `${command} ${args.join(' ')} ${PACKAGE}@latest`;
}

function ensureSettings(root) {
  const file = path.join(root, 'package.json');
  const manifest = readJson(file, null);
  if (manifest.standbyDesignLint) return 'unverändert';
  manifest.standbyDesignLint = { componentPaths: ['/components/ui/'], allowedColors: [], ignores: [] };
  return writeIfChanged(file, `${JSON.stringify(manifest, null, indentOf(file))}\n`);
}

function isOurHook(entry) {
  return (entry.hooks ?? []).some((hook) => String(hook.command ?? '').includes(PACKAGE));
}

function ensureClaudeHook(root) {
  const file = path.join(root, '.claude', 'settings.json');
  const settings = readJson(file, {});
  settings.hooks ??= {};
  const others = (settings.hooks.PostToolUse ?? []).filter((entry) => !isOurHook(entry));
  settings.hooks.PostToolUse = [...others, { matcher: 'Edit|MultiEdit|Write', hooks: [{ type: 'command', command: HOOK_COMMAND, timeout: 30 }] }];
  return writeIfChanged(file, `${JSON.stringify(settings, null, indentOf(file))}\n`);
}

function ensureSkill(root) {
  const source = path.join(PACKAGE_ROOT, 'skills', 'design-review', 'SKILL.md');
  return writeIfChanged(path.join(root, '.claude', 'skills', 'design-review', 'SKILL.md'), readFileSync(source, 'utf8'));
}

function gitHooksDir(root) {
  try {
    const dir = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], { cwd: root, encoding: 'utf8' }).trim();
    return path.resolve(root, dir);
  } catch {
    return null;
  }
}

function withLine(content, line) {
  const lines = content.split('\n').filter((existing) => !existing.includes(PACKAGE));
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return `${lines.join('\n')}\n${line}\n`;
}

function ensurePreCommit(root) {
  const husky = path.join(root, '.husky');
  const hooksDir = existsSync(husky) ? husky : gitHooksDir(root);
  if (!hooksDir) return { file: null, status: 'übersprungen, kein Git-Repo' };
  const file = path.join(hooksDir, 'pre-commit');
  const content = existsSync(file) ? readFileSync(file, 'utf8') : '#!/bin/sh\n';
  const status = writeIfChanged(file, withLine(content, PRE_COMMIT_LINE));
  chmodSync(file, 0o755);
  return { file, status };
}

export function installHooks(root) {
  const preCommit = ensurePreCommit(root);
  return { ...preCommit, file: preCommit.file && path.relative(root, preCommit.file).replace(/\\/g, '/') };
}

function prepareScript(existing) {
  if (!existing?.trim()) return PREPARE_COMMAND;
  return `${existing} && (${PREPARE_COMMAND})`;
}

function ensurePrepareScript(root) {
  if (existsSync(path.join(root, '.husky'))) return 'übersprungen, husky liegt schon im Repo';
  const file = path.join(root, 'package.json');
  const manifest = readJson(file, null);
  const existing = manifest.scripts?.prepare;
  if (existing?.includes(`${PACKAGE} hooks`)) return 'unverändert';
  manifest.scripts = { ...manifest.scripts, prepare: prepareScript(existing) };
  return writeIfChanged(file, `${JSON.stringify(manifest, null, indentOf(file))}\n`);
}

function installedRange(root) {
  const manifest = readJson(path.join(root, 'package.json'), {});
  return manifest.devDependencies?.[PACKAGE] ?? manifest.dependencies?.[PACKAGE] ?? 'latest';
}

function workflow(range) {
  return `name: Design-Regeln

on: pull_request

jobs:
  design-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npx --yes ${PACKAGE}@${range} --since origin/\${{ github.base_ref }}
`;
}

function ensureWorkflow(root) {
  if (!existsSync(path.join(root, '.github'))) return 'übersprungen, kein Ordner .github';
  return writeIfChanged(path.join(root, '.github', 'workflows', 'design-lint.yml'), workflow(installedRange(root)));
}

function withBlock(content) {
  const start = content.indexOf(BLOCK_START);
  const end = content.indexOf(BLOCK_END);
  if (start !== -1 && end > start) return content.slice(0, start) + AGENT_BLOCK + content.slice(end + BLOCK_END.length);
  return `${content.replace(/\s*$/, '')}${content.trim() ? '\n\n' : ''}${AGENT_BLOCK}\n`;
}

function ensureAgentInstructions(root) {
  const agents = path.join(root, 'AGENTS.md');
  const claude = path.join(root, 'CLAUDE.md');
  const readOrEmpty = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
  const steps = [['AGENTS.md', writeIfChanged(agents, withBlock(readOrEmpty(agents)))]];
  if (!existsSync(claude)) return [...steps, ['CLAUDE.md', writeIfChanged(claude, '@AGENTS.md\n')]];
  if (readOrEmpty(claude).split(/\r?\n/).includes('@AGENTS.md')) return [...steps, ['CLAUDE.md', 'unverändert']];
  return [...steps, ['CLAUDE.md', writeIfChanged(claude, withBlock(readOrEmpty(claude)))]];
}

function ensureGitignore(root) {
  const file = path.join(root, '.gitignore');
  const content = existsSync(file) ? readFileSync(file, 'utf8') : '';
  if (content.split(/\r?\n/).includes('.design-review/')) return 'unverändert';
  return writeIfChanged(file, `${content.replace(/\s*$/, '')}${content.trim() ? '\n' : ''}.design-review/\n`);
}

export function initProject(root, { install = true } = {}) {
  if (!existsSync(path.join(root, 'package.json'))) {
    throw new Error(`Kein package.json in ${root}. init im Wurzelordner des Projekts ausführen.`);
  }
  const steps = [];
  if (install) steps.push(['Paket', installPackage(root)]);
  steps.push(['Einstellungen in package.json', ensureSettings(root)]);
  steps.push(['Claude-Code-Hook in .claude/settings.json', ensureClaudeHook(root)]);
  steps.push(['Skill .claude/skills/design-review', ensureSkill(root)]);
  const preCommit = installHooks(root);
  steps.push([`Pre-Commit${preCommit.file ? ` (${preCommit.file})` : ''}, warnt nur`, preCommit.status]);
  steps.push(['prepare-Skript in package.json, richtet den Pre-Commit bei jedem npm install ein', ensurePrepareScript(root)]);
  steps.push(['CI .github/workflows/design-lint.yml, blockiert neue Verstöße im PR', ensureWorkflow(root)]);
  for (const [name, status] of ensureAgentInstructions(root)) steps.push([`Agenten-Anweisung ${name}`, status]);
  steps.push(['.gitignore (.design-review/)', ensureGitignore(root)]);
  return steps;
}

export function formatInitReport(steps) {
  const lines = [`${PACKAGE} ${ownVersion()} eingerichtet:`, ...steps.map(([name, status]) => `  ${name}: ${status}`)];
  lines.push('', 'Ein zweiter Lauf aktualisiert alles auf die neueste Version.');
  return lines.join('\n');
}
