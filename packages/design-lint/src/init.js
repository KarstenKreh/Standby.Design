import { existsSync, lstatSync, mkdirSync, readFileSync, readlinkSync, statSync, writeFileSync, chmodSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { setupError } from './errors.js';
import { checkReleaseAge, compareVersions, releaseAgeGate, releaseTimes } from './release-age.js';

const PACKAGE = 'standby-design-lint';
const PACKAGE_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOOK_COMMAND = `npx --no-install ${PACKAGE} --hook`;
const PRE_COMMIT_LINE = `[ ! -e node_modules/.bin/${PACKAGE} ] || npx --no-install ${PACKAGE} --staged --warn || true`;
const PREPARE_COMMAND = `${PACKAGE} hooks || exit 0`;
const BLOCK_START = '<!-- standby-design-lint:start -->';
const BLOCK_END = '<!-- standby-design-lint:end -->';
const GATE_AWARE_SINCE = '0.5.0';
const ROUTES = { eslint: 'ESLint', biome: 'Biome, ohne ESLint' };
const ESLINT_CONFIGS = ['eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs', 'eslint.config.ts', 'eslint.config.mts', '.eslintrc', '.eslintrc.js', '.eslintrc.cjs', '.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml'];
const BIOME_CONFIGS = ['biome.json', 'biome.jsonc'];
const EXCEPTIONS = {
  eslint: 'die Ausnahme mit `eslint-disable-next-line` und Begründung an die Stelle schreiben, in Vue-Templates als `<!-- eslint-disable-next-line standby/… -- Grund -->`.',
  biome: 'die Ausnahme mit `// biome-ignore lint/plugin: <Grund>` in die Zeile davor schreiben, in JSX als `{/* biome-ignore lint/plugin: <Grund> */}`. `eslint-disable` wirkt in diesem Projekt nicht.',
};
const ASTRO_EXCEPTIONS = {
  eslint: ' In `.astro`-Dateien als `<!-- eslint-disable-next-line standby/… -- Grund -->` vor dem Element.',
  biome: ' In `.astro`-Dateien als `<!-- biome-ignore lint/plugin: <Grund> -->` vor dem Element.',
};

function rulesSource(rulesFile) {
  if (!rulesFile) return 'Die Regeln liefert das MCP-Tool `get_design_rules` von standby-design-mcp, gefiltert nach Kategorie.';
  return `Für dieses Projekt gelten die Regeln in \`${rulesFile}\`. Das MCP-Tool \`get_design_rules\` von standby-design-mcp zeigt den Stand von standby.design zum Nachschlagen. Weicht er ab, gilt die Datei im Projekt.`;
}

export function agentBlock({ route = 'eslint', rulesFile, astro = false } = {}) {
  return `${BLOCK_START}
## Design-Regeln (standby.design)

- Farben, Abstände, Radien und Schriftgrößen kommen nur aus den Design-Tokens des Projekts. Text bekommt eine Rolle (\`text-role-*\`), keine einzelne Größe.
- ${rulesSource(rulesFile)} Meldungen von \`${PACKAGE}\` sofort beheben. Ist ein Treffer gewollt, ${EXCEPTIONS[route]}${astro ? ASTRO_EXCEPTIONS[route] : ''}
- Bevor ein Screen als fertig gilt, den Skill \`design-review\` ausführen.
${BLOCK_END}`;
}

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

export const ESLINT_PACKAGES = ['eslint', '@typescript-eslint/parser', 'typescript'];
export const VUE_PARSER = 'vue-eslint-parser';
const VUE_FRAMEWORKS = ['vue', 'nuxt'];

function packageManager(root) {
  if (existsSync(path.join(root, 'pnpm-lock.yaml')) || existsSync(path.join(root, 'pnpm-workspace.yaml'))) return 'pnpm';
  if (existsSync(path.join(root, 'yarn.lock'))) return 'yarn';
  if (existsSync(path.join(root, 'bun.lockb')) || existsSync(path.join(root, 'bun.lock'))) return 'bun';
  return 'npm';
}

function addArgs(manager, root) {
  if (manager === 'pnpm') return ['add', '-D', ...(existsSync(path.join(root, 'pnpm-workspace.yaml')) ? ['-w'] : []), '-E'];
  if (manager === 'yarn') return ['add', '-D', '-E'];
  if (manager === 'bun') return ['add', '-d', '--exact'];
  return ['install', '-D', '-E'];
}

function declaresPackage(root, name) {
  const manifest = readJson(path.join(root, 'package.json'), {});
  return Boolean(manifest.devDependencies?.[name] ?? manifest.dependencies?.[name]);
}

function hasPackage(root, name) {
  return declaresPackage(root, name) || existsSync(path.join(root, 'node_modules', name, 'package.json'));
}

function tracksFiles(root, glob) {
  try {
    return execFileSync('git', ['ls-files', glob], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 }).trim() !== '';
  } catch {
    return false;
  }
}

export function usesVue(root) {
  return VUE_FRAMEWORKS.some((name) => declaresPackage(root, name)) || tracksFiles(root, '*.vue');
}

function hasAny(root, files) {
  return files.some((file) => existsSync(path.join(root, file)));
}

export function detectRoute(root, forced) {
  if (forced) return { route: forced, reason: `gewählt mit --${forced}` };
  const engine = readJson(path.join(root, 'package.json'), {}).standbyDesignLint?.engine;
  if (ROUTES[engine]) return { route: engine, reason: '"engine" in package.json' };
  if (declaresPackage(root, 'eslint') || hasAny(root, ESLINT_CONFIGS)) return { route: 'eslint', reason: 'das Projekt nutzt ESLint' };
  if (declaresPackage(root, '@biomejs/biome') || hasAny(root, BIOME_CONFIGS)) return { route: 'biome', reason: 'das Projekt nutzt Biome und kein ESLint' };
  return { route: 'eslint', reason: 'weder ESLint noch Biome gefunden' };
}

function installedVersion(root) {
  return readJson(path.join(root, 'node_modules', PACKAGE, 'package.json'), {}).version;
}

export function installCommand(root, { route = detectRoute(root).route, version = ownVersion() } = {}) {
  const manager = packageManager(root);
  const packages = declaresPackage(root, PACKAGE) && installedVersion(root) === version ? [] : [`${PACKAGE}@${version}`];
  if (route === 'eslint') {
    packages.push(...ESLINT_PACKAGES.filter((name) => !hasPackage(root, name)));
    if (usesVue(root) && !declaresPackage(root, VUE_PARSER)) packages.push(VUE_PARSER);
  }
  return packages.length ? [manager, [...addArgs(manager, root), ...packages]] : null;
}

function runCommand(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
}

function installPackage(root, { route, version = ownVersion() }, run) {
  const install = installCommand(root, { route, version });
  if (!install) return `${PACKAGE} ${version} ist schon installiert`;
  const [command, args] = install;
  try {
    run(command, args, root);
  } catch {
    const gate = releaseAgeGate(root, command);
    const hint = gate ? ` Das Projekt erlaubt nur Pakete ab einem Mindestalter (${gate.source}). Ist die Version zu jung, später noch einmal ausführen. Die Sperre nicht umgehen.` : '';
    throw setupError(`„${command} ${args.join(' ')}“ ist fehlgeschlagen, die Meldung steht darüber. init hat nichts eingerichtet.${hint}`);
  }
  return `${command} ${args.join(' ')}`;
}

function formatDate(date) {
  return date.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' });
}

function tooYoung(root, { times, now }) {
  const gate = releaseAgeGate(root, packageManager(root));
  if (!gate) return null;
  const verdict = checkReleaseAge({ version: ownVersion(), gate, times: times(root), now });
  return verdict.allowed ? null : { ...verdict, gate };
}

function setUpWithAllowedVersion(root, { allowedFrom, newestAllowed, gate }, { route, forced, run }) {
  const waiting = `${PACKAGE} ${ownVersion()} ist in diesem Projekt erst ab ${formatDate(allowedFrom)} erlaubt (${gate.source}).`;
  if (!newestAllowed || compareVersions(newestAllowed, GATE_AWARE_SINCE) < 0) {
    throw setupError(`${waiting} Eine ältere Version, die das Projekt so einrichten kann, gibt es nicht. Nichts wurde geändert. Danach noch einmal ausführen: npx ${PACKAGE}@latest init. Die Sperre nicht umgehen.`);
  }
  installPackage(root, { route: 'biome', version: newestAllowed }, run);
  run(process.execPath, [path.join(root, 'node_modules', PACKAGE, 'bin', `${PACKAGE}.js`), 'init', ...(forced ? [`--${route}`] : [])], root);
  return `${waiting} Eingerichtet ist ${newestAllowed}, die neueste erlaubte Version.`;
}

function ensureSettings(root, route) {
  const file = path.join(root, 'package.json');
  const manifest = readJson(file, null);
  const current = manifest.standbyDesignLint;
  const engine = route === 'biome' ? { engine: 'biome' } : {};
  if (current && (route !== 'biome' || current.engine)) return 'unverändert';
  manifest.standbyDesignLint = current ? { ...engine, ...current } : { ...engine, componentPaths: ['/components/ui/'], allowedColors: [], ignores: [] };
  return writeIfChanged(file, `${JSON.stringify(manifest, null, indentOf(file))}\n`);
}

function isDirectory(target) {
  try {
    return statSync(target).isDirectory();
  } catch {
    return false;
  }
}

export function claudeFolder(root) {
  const link = path.join(root, '.claude');
  const linked = (dir) => ({ dir, label: path.relative(root, dir).replace(/\\/g, '/'), via: ' (über .claude)' });
  let stat;
  try {
    stat = lstatSync(link);
  } catch {
    return { dir: link, label: '.claude', via: '' };
  }
  if (stat.isSymbolicLink()) {
    const dir = path.resolve(root, readlinkSync(link).replace(/^\\\\\?\\/, ''));
    mkdirSync(dir, { recursive: true });
    return linked(dir);
  }
  if (stat.isFile()) {
    const target = readFileSync(link, 'utf8').trim();
    const dir = path.resolve(root, target);
    if (!target || /[\r\n]/.test(target) || !isDirectory(dir)) {
      throw setupError('.claude ist eine Datei, kein Ordner. Ist sie ein Symlink, den Git als Text ausgecheckt hat (core.symlinks=false), muss der Zielordner existieren.');
    }
    return linked(dir);
  }
  return { dir: link, label: '.claude', via: '' };
}

function isOurHook(entry) {
  return (entry.hooks ?? []).some((hook) => String(hook.command ?? '').includes(PACKAGE));
}

function ensureClaudeHook(claude) {
  const file = path.join(claude, 'settings.json');
  const settings = readJson(file, {});
  settings.hooks ??= {};
  const others = (settings.hooks.PostToolUse ?? []).filter((entry) => !isOurHook(entry));
  settings.hooks.PostToolUse = [...others, { matcher: 'Edit|MultiEdit|Write', hooks: [{ type: 'command', command: HOOK_COMMAND, timeout: 30 }] }];
  return writeIfChanged(file, `${JSON.stringify(settings, null, indentOf(file))}\n`);
}

function ensureSkill(claude) {
  const source = path.join(PACKAGE_ROOT, 'skills', 'design-review', 'SKILL.md');
  return writeIfChanged(path.join(claude, 'skills', 'design-review', 'SKILL.md'), readFileSync(source, 'utf8'));
}

function gitHooksDir(root) {
  try {
    const dir = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return path.resolve(root, dir);
  } catch {
    return null;
  }
}

const CLOSING_EXIT = /^exit(?:\s|$)/;

function withLine(content, line) {
  const lines = content.split('\n').filter((existing) => !existing.includes(PACKAGE));
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  const closing = lines.length && CLOSING_EXIT.test(lines[lines.length - 1]) ? [lines.pop()] : [];
  return `${[...lines, line, ...closing].join('\n')}\n`;
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

function yarnInstall(root) {
  const lockfile = existsSync(path.join(root, 'yarn.lock')) ? readFileSync(path.join(root, 'yarn.lock'), 'utf8') : '';
  return lockfile.includes('yarn lockfile v1') ? 'yarn install --frozen-lockfile' : 'yarn install --immutable';
}

function ciSteps(root) {
  const manager = packageManager(root);
  const declared = readJson(path.join(root, 'package.json'), {}).packageManager ?? '';
  if (manager === 'pnpm') {
    const setup = declared.startsWith('pnpm@') ? '      - uses: pnpm/action-setup@v4\n' : '      - uses: pnpm/action-setup@v4\n        with:\n          version: 10\n';
    return { setup, cache: 'pnpm', install: 'pnpm install --frozen-lockfile', run: `pnpm exec ${PACKAGE}` };
  }
  if (manager === 'yarn') return { setup: '      - run: corepack enable\n', cache: 'yarn', install: yarnInstall(root), run: `yarn run ${PACKAGE}` };
  if (manager === 'bun') return { setup: '      - uses: oven-sh/setup-bun@v2\n', cache: null, install: 'bun install --frozen-lockfile', run: `bunx ${PACKAGE}` };
  return { setup: '', cache: 'npm', install: 'npm ci', run: `npx --no-install ${PACKAGE}` };
}

function nodeVersion(root) {
  const file = ['.nvmrc', '.node-version'].find((name) => existsSync(path.join(root, name)));
  return file ? `node-version-file: ${file}` : 'node-version: 22';
}

function workflow(root) {
  const { setup, cache, install, run } = ciSteps(root);
  return `name: Design-Regeln

on: pull_request

jobs:
  design-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
${setup}      - uses: actions/setup-node@v4
        with:
          ${nodeVersion(root)}${cache ? `\n          cache: ${cache}` : ''}
      - run: ${install}
      - run: ${run} --since origin/\${{ github.base_ref }}
`;
}

function ensureWorkflow(root) {
  if (!existsSync(path.join(root, '.github'))) return 'übersprungen, kein Ordner .github';
  return writeIfChanged(path.join(root, '.github', 'workflows', 'design-lint.yml'), workflow(root));
}

function withBlock(content, block) {
  const start = content.indexOf(BLOCK_START);
  const end = content.indexOf(BLOCK_END);
  if (start !== -1 && end > start) return content.slice(0, start) + block + content.slice(end + BLOCK_END.length);
  return `${content.replace(/\s*$/, '')}${content.trim() ? '\n\n' : ''}${block}\n`;
}

function ensureAgentInstructions(root, route) {
  const agents = path.join(root, 'AGENTS.md');
  const claude = path.join(root, 'CLAUDE.md');
  const rulesFile = readJson(path.join(root, 'package.json'), {}).standbyDesignLint?.rulesFile;
  const block = agentBlock({ route, rulesFile, astro: tracksFiles(root, '*.astro') });
  const readOrEmpty = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
  const steps = [['AGENTS.md', writeIfChanged(agents, withBlock(readOrEmpty(agents), block))]];
  if (!existsSync(claude)) return [...steps, ['CLAUDE.md', writeIfChanged(claude, '@AGENTS.md\n')]];
  if (readOrEmpty(claude).split(/\r?\n/).includes('@AGENTS.md')) return [...steps, ['CLAUDE.md', 'unverändert']];
  return [...steps, ['CLAUDE.md', writeIfChanged(claude, withBlock(readOrEmpty(claude), block))]];
}

function ensureGitignore(root) {
  const file = path.join(root, '.gitignore');
  const content = existsSync(file) ? readFileSync(file, 'utf8') : '';
  if (content.split(/\r?\n/).includes('.design-review/')) return 'unverändert';
  return writeIfChanged(file, `${content.replace(/\s*$/, '')}${content.trim() ? '\n' : ''}.design-review/\n`);
}

function routeNotes(root, route) {
  if (route !== 'biome') return [];
  const notes = ['Der Biome-Weg prüft .js, .jsx, .ts, .tsx und .mjs mit dem Biome des Projekts, .astro-Dateien prüft das Paket selbst. biome.json, ESLint und TypeScript bleiben unberührt.'];
  if (usesVue(root)) notes.push('.vue-Dateien prüft nur der ESLint-Weg. Im Biome-Weg bleiben sie ungeprüft.');
  return notes;
}

export function initProject(root, { install = true, route: forced, times = releaseTimes, now = Date.now(), run = runCommand } = {}) {
  if (!existsSync(path.join(root, 'package.json'))) {
    throw setupError(`Kein package.json in ${root}. init im Wurzelordner des Projekts ausführen.`);
  }
  const { route, reason } = detectRoute(root, forced);
  if (install) {
    const young = tooYoung(root, { times, now });
    if (young) return { delegated: setUpWithAllowedVersion(root, young, { route, forced, run }) };
  }
  const claude = claudeFolder(root);
  const steps = [];
  if (install) steps.push(['Paket', installPackage(root, { route }, run)]);
  steps.push(['Einstellungen in package.json', ensureSettings(root, route)]);
  steps.push([`Claude-Code-Hook in ${claude.label}/settings.json${claude.via}`, ensureClaudeHook(claude.dir)]);
  steps.push([`Skill ${claude.label}/skills/design-review${claude.via}`, ensureSkill(claude.dir)]);
  const preCommit = installHooks(root);
  steps.push([`Pre-Commit${preCommit.file ? ` (${preCommit.file})` : ''}, warnt nur`, preCommit.status]);
  steps.push(['prepare-Skript in package.json, richtet den Pre-Commit bei jedem npm install ein', ensurePrepareScript(root)]);
  steps.push(['CI .github/workflows/design-lint.yml, blockiert neue Verstöße im PR', ensureWorkflow(root)]);
  for (const [name, status] of ensureAgentInstructions(root, route)) steps.push([`Agenten-Anweisung ${name}`, status]);
  steps.push(['.gitignore (.design-review/)', ensureGitignore(root)]);
  return { steps, way: `${ROUTES[route]} (${reason})`, notes: routeNotes(root, route) };
}

export function formatInitReport({ steps, way, notes = [], delegated }) {
  if (delegated) return delegated;
  const lines = [`${PACKAGE} ${ownVersion()} eingerichtet, Weg: ${way}`, ...steps.map(([name, status]) => `  ${name}: ${status}`)];
  lines.push('', ...notes, `Ein neuer Lauf mit npx ${PACKAGE}@latest init aktualisiert alles auf die neueste Version.`);
  return lines.join('\n');
}
