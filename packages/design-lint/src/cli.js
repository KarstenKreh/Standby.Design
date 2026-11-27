import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { addedLines } from './git-diff.js';
import { reviewScreen } from './review.js';
import { SETUP_ERROR, setupError } from './errors.js';
import { DEFAULT_IGNORES, ignoreMatcher } from './ignores.js';
import { createBiomeEngine, findBiome } from './biome/engine.js';
import { BIOME_RULES, writeBiomePlugins } from './biome/generate.js';
import { MARKUP_FILE, lintMarkup } from './markup.js';
import { ESLINT_PACKAGES, VUE_PARSER, initProject, formatInitReport, installHooks, usesVue } from './init.js';

export { SETUP_ERROR };

const LINTABLE = /\.(?:jsx|tsx|js|ts|mjs|vue|astro)$/;
const HOOK_MESSAGE_LIMIT = 20;
const OWN_RULE_PREFIX = 'standby/';
const SKIPPED_FOLDERS = new Set(['node_modules', '.git']);
const ENGINES = ['eslint', 'biome'];
const USAGE = `standby-design-lint: prüft Code gegen die Design-Regeln von standby.design

  standby-design-lint init       richtet Hook, Pre-Commit, CI, Skill und Agenten-Anweisung ein oder aktualisiert sie
                                 erkennt selbst, ob das Projekt ESLint oder nur Biome nutzt (--eslint, --biome legt es fest)
  standby-design-lint hooks      richtet nur den Pre-Commit ein (läuft über das prepare-Skript bei npm install)
  standby-design-lint biome <ordner>  schreibt die Regeln als Biome-Plugins mit den Einstellungen des Projekts (für biome.json)
  standby-design-lint [Pfade…]   prüft Dateien oder Ordner (Vorgabe: src)
  standby-design-lint --staged   prüft nur die Zeilen, die für den Commit vorgemerkt sind (Pre-Commit)
  standby-design-lint --since <ref>  prüft nur die Zeilen, die seit <ref> dazukamen (CI, z. B. origin/main)
  standby-design-lint review <url>  Screenshots (1280 und 375 px) und Textstil-Zählung eines Screens
  standby-design-lint --hook     liest ein Claude-Code-Hook-Ereignis von stdin und prüft die bearbeitete Datei
  --warn                         meldet Verstöße, endet aber mit Exit-Code 0 (für den Pre-Commit)

Einstellungen stehen in package.json unter "standbyDesignLint":
  { "componentPaths": ["/components/ui/"], "allowedColors": [], "ignores": [] }
  "engine": "biome" prüft mit dem Biome des Projekts statt mit ESLint. "rulesFile" nennt die Regeldatei des Projekts.`;

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

async function loadEslint(root) {
  try {
    const [{ ESLint }, standby] = await Promise.all([import('eslint'), import('./index.js')]);
    return { ESLint, standby };
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
    const biome = findBiome(root) ? ' Dieses Projekt hat Biome: "engine": "biome" in package.json unter "standbyDesignLint" prüft ohne ESLint.' : '';
    throw setupError(`ESLint fehlt. Das Paket bringt es seit 0.3.0 nicht mehr selbst mit. Einmal ausführen: npm i -D ${ESLINT_PACKAGES.join(' ')} (oder npx standby-design-lint init).${biome}`, { missing: 'eslint' });
  }
}

function vueConfigs(standby, root, { componentPaths, allowedColors }) {
  if (standby.vueParserInstalled()) return [{ ...standby.recommendedVue({ componentPaths, allowedColors }), processor: standby.vueDirectives }];
  if (usesVue(root)) throw setupError(`${VUE_PARSER} fehlt, das Projekt nutzt aber Vue. Einmal ausführen: npm i -D ${VUE_PARSER} (oder npx standby-design-lint init).`);
  return [];
}

function isOwnMessage(message) {
  return message.ruleId === null || message.ruleId.startsWith(OWN_RULE_PREFIX);
}

function withoutForeignRules(results) {
  return results.map((result) => ({ ...result, messages: result.messages.filter(isOwnMessage) }));
}

async function createEslintEngine(root, settings) {
  const { ESLint, standby } = await loadEslint(root);
  const eslint = new ESLint({
    cwd: root,
    overrideConfigFile: true,
    overrideConfig: [
      { ignores: [...DEFAULT_IGNORES, ...(settings.ignores ?? [])] },
      standby.recommended(settings),
      ...vueConfigs(standby, root, settings),
    ],
    errorOnUnmatchedPattern: false,
  });
  const collect = (results) => ({ results: withoutForeignRules(results), checked: results.length });
  return {
    name: 'eslint',
    isIgnored: (file) => eslint.isPathIgnored(file),
    lintFiles: async (paths) => collect(await eslint.lintFiles(paths)),
    async lintTexts(entries) {
      const results = [];
      for (const { filePath, text } of entries) results.push(...(await eslint.lintText(text, { filePath })));
      return collect(results);
    },
  };
}

export async function createEngine(root, settings) {
  if (settings.engine && !ENGINES.includes(settings.engine)) {
    throw setupError(`"engine": "${settings.engine}" in package.json kennt das Paket nicht. Erlaubt: ${ENGINES.join(', ')}.`);
  }
  if (settings.engine === 'biome') return createBiomeEngine(root, settings);
  try {
    return await createEslintEngine(root, settings);
  } catch (error) {
    if (error.missing !== 'eslint' || settings.engine === 'eslint' || !findBiome(root)) throw error;
    return createBiomeEngine(root, settings);
  }
}

function markupFilesIn(target, isIgnored) {
  if (!existsSync(target) || isIgnored(target)) return [];
  if (!statSync(target).isDirectory()) return MARKUP_FILE.test(target) ? [target] : [];
  return readdirSync(target, { withFileTypes: true })
    .filter((entry) => !SKIPPED_FOLDERS.has(entry.name))
    .flatMap((entry) => markupFilesIn(path.join(target, entry.name), isIgnored));
}

export function createLinter(root, settings) {
  const isIgnoredMarkup = ignoreMatcher(root, settings.ignores);
  let engine;
  const code = async () => (engine ??= await createEngine(root, settings));
  const markupResult = ({ filePath, text }) => ({ filePath, messages: lintMarkup(text, filePath, settings) });
  const merge = (markup, linted) => ({ results: [...markup, ...linted.results], checked: markup.length + linted.checked });
  const none = { results: [], checked: 0 };
  return {
    async isIgnored(file) {
      return MARKUP_FILE.test(file) ? isIgnoredMarkup(file) : (await code()).isIgnored(file);
    },
    async lintFiles(paths) {
      const markup = paths.flatMap((target) => markupFilesIn(target, isIgnoredMarkup)).map((filePath) => markupResult({ filePath, text: readFileSync(filePath, 'utf8') }));
      const rest = paths.filter((target) => !MARKUP_FILE.test(target));
      return merge(markup, rest.length ? await (await code()).lintFiles(rest) : none);
    },
    async lintTexts(entries) {
      const markup = entries.filter(({ filePath }) => MARKUP_FILE.test(filePath)).map(markupResult);
      const rest = entries.filter(({ filePath }) => !MARKUP_FILE.test(filePath));
      return merge(markup, rest.length ? await (await code()).lintTexts(rest) : none);
    },
  };
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

function lineRangeOf(rawContent, rawSnippet) {
  const content = rawContent.replace(/\r\n/g, '\n');
  const snippet = rawSnippet?.replace(/\r\n/g, '\n');
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
  const touched = ({ line, spanEnd = line }) => ranges.some(([start, end]) => line <= end && spanEnd >= start);
  return { ...result, messages: result.messages.filter(touched) };
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
  if (await linter.isIgnored(filePath)) return 0;
  const ranges = changedLineRanges(event, readFileSync(filePath, 'utf8'));
  const results = keepChangedLines((await linter.lintFiles([path.resolve(filePath)])).results, ranges);
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
  const { results, checked } = await linter.lintFiles(targets.map((target) => path.resolve(target)));
  return report(results, `Keine Verstöße in ${checked} Dateien.`, { warn });
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
  return execFileSync('git', ['show', `:./${path.basename(filePath)}`], { cwd: path.dirname(filePath), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function pathKey(filePath) {
  const resolved = path.resolve(filePath);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

async function runChanged({ staged, base, warn }) {
  const { root, settings } = findSettings(process.cwd());
  const linter = createLinter(root, settings);
  const changed = new Map();
  for (const [filePath, ranges] of addedLines(process.cwd(), { staged, base })) {
    if (LINTABLE.test(filePath) && !(await linter.isIgnored(filePath))) changed.set(filePath, ranges);
  }
  const files = [...changed.keys()];
  const linted = !files.length ? { results: [] }
    : staged ? await linter.lintTexts(files.map((filePath) => ({ filePath, text: stagedContent(filePath) })))
      : await linter.lintFiles(files);
  const rangesOf = new Map([...changed].map(([filePath, ranges]) => [pathKey(filePath), ranges]));
  const results = linted.results.filter((result) => rangesOf.has(pathKey(result.filePath))).map((result) => keepLines(result, rangesOf.get(pathKey(result.filePath))));
  return report(results, `Keine Verstöße in den geänderten Zeilen (${files.length} Dateien).`, { warn });
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

function runInstallHooks() {
  try {
    const { file, status } = installHooks(process.cwd());
    if (file && status !== 'unverändert') process.stdout.write(`standby-design-lint: Pre-Commit ${file} ${status}\n`);
  } catch (error) {
    process.stderr.write(`standby-design-lint: Pre-Commit nicht eingerichtet (${error.message})\n`);
  }
  return 0;
}

function runBiomePlugins(argv) {
  const target = argv.find((arg) => !arg.startsWith('--'));
  if (!target) {
    process.stderr.write('standby-design-lint biome <ordner>\n');
    return 2;
  }
  const { settings } = findSettings(process.cwd());
  writeBiomePlugins(path.resolve(target), settings);
  const folder = path.relative(process.cwd(), path.resolve(target)).replace(/\\/g, '/');
  process.stdout.write(`${BIOME_RULES.length} Regeln als Biome-Plugins in ${folder} geschrieben, als Warnung in ${folder}/warn. Sie tragen die Einstellungen aus package.json. In biome.json unter "plugins" eintragen, z. B. "./${folder}/${BIOME_RULES[0]}.grit". Nach einer Änderung der Einstellungen oder einem Update neu schreiben.\n`);
  return 0;
}

function runInit(argv) {
  const route = ENGINES.find((engine) => argv.includes(`--${engine}`));
  process.stdout.write(`${formatInitReport(initProject(process.cwd(), { install: !argv.includes('--no-install'), route }))}\n`);
  return 0;
}

export async function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return 0;
  }
  if (argv.includes('--hook')) return runHook();
  if (argv[0] === 'review') return runReview(argv.slice(1));
  if (argv[0] === 'init') return runInit(argv);
  if (argv[0] === 'hooks') return runInstallHooks();
  if (argv[0] === 'biome') return runBiomePlugins(argv.slice(1));
  const warn = argv.includes('--warn');
  if (argv.includes('--staged')) return runChanged({ staged: true, warn });
  const base = optionValue(argv, '--since');
  if (base) return runChanged({ base, warn });
  return runFiles(argv.filter((arg) => !arg.startsWith('--')), { warn });
}
