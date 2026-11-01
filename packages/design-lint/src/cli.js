import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ESLint } from 'eslint';
import { recommended } from './index.js';
import { addedLines } from './git-diff.js';
import { reviewScreen } from './review.js';
import { initProject, formatInitReport } from './init.js';

const LINTABLE = /\.(?:jsx|tsx|js|ts|mjs)$/;
const HOOK_MESSAGE_LIMIT = 20;
const DEFAULT_IGNORES = ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**', '**/coverage/**', '**/*.d.ts'];
const USAGE = `standby-design-lint: prüft Code gegen die Design-Regeln von standby.design

  standby-design-lint init       richtet Hook, Pre-Commit, CI, Skill und Agenten-Anweisung ein oder aktualisiert sie
  standby-design-lint [Pfade…]   prüft Dateien oder Ordner (Vorgabe: src)
  standby-design-lint --staged   prüft nur die Zeilen, die für den Commit vorgemerkt sind (Pre-Commit)
  standby-design-lint --since <ref>  prüft nur die Zeilen, die seit <ref> dazukamen (CI, z. B. origin/main)
  standby-design-lint review <url>  Screenshots (1280 und 375 px) und Textstil-Zählung eines Screens
  standby-design-lint --hook     liest ein Claude-Code-Hook-Ereignis von stdin und prüft die bearbeitete Datei
  --warn                         meldet Verstöße, endet aber mit Exit-Code 0 (für den Pre-Commit)

Einstellungen stehen in package.json unter "standbyDesignLint":
  { "componentPaths": ["/components/ui/"], "allowedColors": [], "ignores": [] }`;

export function findSettings(startDir) {
  let dir = path.resolve(startDir);
  while (true) {
    const manifest = path.join(dir, 'package.json');
    if (existsSync(manifest)) {
      const settings = JSON.parse(readFileSync(manifest, 'utf8')).standbyDesignLint;
      if (settings) return { root: dir, settings };
    }
    const parent = path.dirname(dir);
    if (parent === dir) return { root: path.resolve(startDir), settings: {} };
    dir = parent;
  }
}

export function createLinter(root, settings) {
  return new ESLint({
    cwd: root,
    overrideConfigFile: true,
    overrideConfig: [
      { ignores: [...DEFAULT_IGNORES, ...(settings.ignores ?? [])] },
      recommended(settings),
    ],
    errorOnUnmatchedPattern: false,
  });
}

export function formatResults(results) {
  const lines = [];
  for (const result of results) {
    for (const message of result.messages) {
      const file = path.relative(process.cwd(), result.filePath).replace(/\\/g, '/');
      lines.push(`${file}:${message.line}:${message.column}  ${message.message}`);
    }
  }
  return lines;
}

function countProblems(results) {
  return results.reduce((sum, result) => sum + result.messages.length, 0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function lineRangeOf(content, snippet) {
  const index = snippet ? content.indexOf(snippet) : -1;
  if (index === -1) return null;
  const start = content.slice(0, index).split('\n').length;
  return [start, start + snippet.split('\n').length - 1];
}

export function changedLineRanges(event, content) {
  const input = event.tool_input ?? {};
  if (event.tool_name === 'Write' || typeof input.content === 'string') return null;
  const snippets = Array.isArray(input.edits) ? input.edits.map((edit) => edit.new_string) : [input.new_string];
  const ranges = snippets.map((snippet) => lineRangeOf(content, snippet));
  return ranges.includes(null) ? null : ranges;
}

function keepLines(result, ranges) {
  if (!ranges) return result;
  const touched = (line) => ranges.some(([start, end]) => line >= start && line <= end);
  return { ...result, messages: result.messages.filter((message) => touched(message.line)) };
}

function keepChangedLines(results, ranges) {
  return results.map((result) => keepLines(result, ranges));
}

async function runHook() {
  const event = JSON.parse((await readStdin()) || '{}');
  const filePath = event.tool_input?.file_path;
  if (!filePath || !LINTABLE.test(filePath) || !existsSync(filePath)) return 0;
  const { root, settings } = findSettings(path.dirname(filePath));
  const linter = createLinter(root, settings);
  if (await linter.isPathIgnored(filePath)) return 0;
  const ranges = changedLineRanges(event, readFileSync(filePath, 'utf8'));
  const results = keepChangedLines(await linter.lintFiles([filePath]), ranges);
  const problems = countProblems(results);
  if (problems === 0) return 0;
  const lines = formatResults(results);
  const shown = lines.slice(0, HOOK_MESSAGE_LIMIT);
  const more = lines.length > shown.length ? `\n… und ${lines.length - shown.length} weitere. Alle zeigt: npx standby-design-lint ${path.relative(process.cwd(), filePath)}` : '';
  const scope = ranges ? 'in den geänderten Zeilen' : 'in dieser Datei';
  process.stderr.write(`Design-Regeln verletzt ${scope} (${problems}). Bitte jetzt beheben:\n${shown.join('\n')}${more}\n`);
  return 2;
}

async function runFiles(patterns, { warn }) {
  const { root, settings } = findSettings(process.cwd());
  const linter = createLinter(root, settings);
  const targets = patterns.length ? patterns : ['src'];
  const results = await linter.lintFiles(targets.map((target) => path.resolve(target)));
  return report(results, `Keine Verstöße in ${results.length} Dateien.`, { warn });
}

function report(results, emptyText, { warn = false } = {}) {
  const problems = countProblems(results);
  if (problems === 0) {
    process.stdout.write(`${emptyText}\n`);
    return 0;
  }
  const files = results.filter((result) => result.messages.length).length;
  const note = warn ? ' Der Commit läuft trotzdem, im Pull Request blockieren sie.' : '';
  process.stdout.write(`${formatResults(results).join('\n')}\n\n${problems} Verstöße in ${files} Dateien.${note}\n`);
  return warn ? 0 : 1;
}

function stagedContent(filePath) {
  return execFileSync('git', ['show', `:./${path.basename(filePath)}`], { cwd: path.dirname(filePath), encoding: 'utf8' });
}

async function runChanged({ staged, base, warn }) {
  const { root, settings } = findSettings(process.cwd());
  const linter = createLinter(root, settings);
  const changed = addedLines(process.cwd(), { staged, base });
  const results = [];
  for (const [filePath, ranges] of changed) {
    if (!LINTABLE.test(filePath) || (await linter.isPathIgnored(filePath))) continue;
    const linted = staged ? await linter.lintText(stagedContent(filePath), { filePath }) : await linter.lintFiles([filePath]);
    results.push(...linted.map((result) => keepLines(result, ranges)));
  }
  return report(results, `Keine Verstöße in den geänderten Zeilen (${results.length} Dateien).`, { warn });
}

async function runReview(argv) {
  const url = argv.find((arg) => !arg.startsWith('--') && arg !== optionValue(argv, '--out'));
  if (!url) {
    process.stderr.write('standby-design-lint review <url> [--out <ordner>]\n');
    return 2;
  }
  const { text, reportFile, errors } = await reviewScreen(url, { out: optionValue(argv, '--out') });
  process.stdout.write(`${text}\nBericht: ${reportFile}\n`);
  return errors ? 1 : 0;
}

function optionValue(argv, name) {
  const index = argv.indexOf(name);
  return index === -1 ? undefined : argv[index + 1];
}

export async function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return 0;
  }
  if (argv.includes('--hook')) return runHook();
  if (argv[0] === 'review') return runReview(argv.slice(1));
  if (argv[0] === 'init') {
    process.stdout.write(`${formatInitReport(initProject(process.cwd(), { install: !argv.includes('--no-install') }))}\n`);
    return 0;
  }
  const warn = argv.includes('--warn');
  if (argv.includes('--staged')) return runChanged({ staged: true, warn });
  const base = optionValue(argv, '--since');
  if (base) return runChanged({ base, warn });
  return runFiles(argv.filter((arg) => !arg.startsWith('--')), { warn });
}
