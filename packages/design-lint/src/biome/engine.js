import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setupError } from '../errors.js';
import { DEFAULT_IGNORES, ignoreMatcher } from '../ignores.js';
import { BIOME_RULES, writeBiomePlugins } from './generate.js';

const BIOME_BIN = '@biomejs/biome/bin/biome';
const RULE_ID = 'standby/biome';
const OTHER_LANGUAGES = ['**/*.astro', '**/*.vue', '**/*.svelte'];
const ARGUMENT_BUDGET = 20000;
const { version } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));

export function findBiome(root) {
  for (const from of [path.join(root, 'package.json'), import.meta.url]) {
    try {
      return createRequire(from).resolve(BIOME_BIN);
    } catch {
      continue;
    }
  }
  return null;
}

function portableIgnores(settings) {
  return [...DEFAULT_IGNORES, ...(settings.ignores ?? [])].filter((glob) => glob.startsWith('**/'));
}

function biomeConfig(dir, settings) {
  return {
    root: true,
    files: { includes: ['**', ...[...portableIgnores(settings), ...OTHER_LANGUAGES].map((glob) => `!${glob}`)] },
    linter: { rules: { recommended: false } },
    plugins: BIOME_RULES.map((rule) => path.join(dir, `${rule}.grit`).replace(/\\/g, '/')),
  };
}

export function ensureBiomeConfig(settings, base = path.join(tmpdir(), 'standby-design-lint')) {
  const key = createHash('sha256').update(JSON.stringify([version, settings.componentPaths, settings.allowedColors, portableIgnores(settings)])).digest('hex').slice(0, 16);
  const dir = path.join(base, key);
  if (existsSync(path.join(dir, 'biome.json'))) return dir;
  mkdirSync(base, { recursive: true });
  const staging = mkdtempSync(`${dir}-`);
  writeBiomePlugins(staging, settings);
  writeFileSync(path.join(staging, 'biome.json'), `${JSON.stringify(biomeConfig(dir, settings), null, 2)}\n`);
  try {
    renameSync(staging, dir);
  } catch (error) {
    rmSync(staging, { recursive: true, force: true });
    if (!existsSync(path.join(dir, 'biome.json'))) throw error;
  }
  return dir;
}

function batches(targets) {
  const groups = [[]];
  let size = 0;
  for (const target of targets) {
    if (size + target.length > ARGUMENT_BUDGET && groups[groups.length - 1].length) {
      groups.push([]);
      size = 0;
    }
    groups[groups.length - 1].push(target);
    size += target.length + 1;
  }
  return groups;
}

function lineOf(file, offset) {
  return readFileSync(file, 'utf8').slice(0, offset).split('\n').length;
}

function position(file, location, edge) {
  if (location[edge]?.line) return location[edge];
  const offset = location.span?.[edge === 'start' ? 0 : 1];
  return { line: offset === undefined ? 1 : lineOf(file, offset), column: 1 };
}

function toMessage(file, diagnostic) {
  const start = position(file, diagnostic.location, 'start');
  const end = position(file, diagnostic.location, 'end');
  return { ruleId: RULE_ID, line: start.line, column: start.column, endLine: end.line, spanEnd: end.line, message: diagnostic.message };
}

function runBiome(bin, config, cwd, targets) {
  const args = [bin, 'lint', `--config-path=${config}`, '--reporter=json', '--max-diagnostics=none', '--no-errors-on-unmatched', ...targets];
  const run = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
  if (run.error) throw run.error;
  try {
    return JSON.parse(run.stdout);
  } catch {
    throw setupError(`Biome lieferte kein lesbares Ergebnis (Exit-Code ${run.status}). Die Plugins brauchen Biome 2.5 oder neuer.\n${run.stderr.trim().slice(0, 2000)}`);
  }
}

function lint(bin, config, cwd, targets) {
  const byFile = new Map();
  let checked = 0;
  for (const batch of batches(targets)) {
    if (!batch.length) continue;
    const output = runBiome(bin, config, cwd, batch);
    checked += (output.summary?.changed ?? 0) + (output.summary?.unchanged ?? 0);
    for (const diagnostic of output.diagnostics ?? []) {
      if (diagnostic.category !== 'plugin' || !diagnostic.location?.path) continue;
      const file = path.resolve(cwd, diagnostic.location.path);
      byFile.set(file, [...(byFile.get(file) ?? []), toMessage(file, diagnostic)]);
    }
  }
  const results = [...byFile].map(([filePath, messages]) => ({ filePath, messages: messages.sort((a, b) => a.line - b.line || a.column - b.column) }));
  return { results, checked };
}

function insideRoot(root, file) {
  const relative = path.relative(root, file);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? relative : path.basename(file);
}

export function createBiomeEngine(root, settings) {
  const bin = findBiome(root);
  if (!bin) {
    throw setupError('Biome fehlt. Der Biome-Weg nutzt das Biome des Projekts: @biomejs/biome 2.5 oder neuer als devDependency installieren. Projekte mit ESLint setzen "engine": "eslint" in package.json unter "standbyDesignLint".');
  }
  const config = ensureBiomeConfig(settings);
  const isIgnored = ignoreMatcher(root, settings.ignores);
  const withoutIgnored = ({ results, checked }) => ({ results: results.filter((result) => !isIgnored(result.filePath)), checked });
  return {
    name: 'biome',
    isIgnored,
    lintFiles(paths) {
      return withoutIgnored(lint(bin, config, root, paths.filter((target) => !isIgnored(target))));
    },
    lintTexts(entries) {
      const mirror = realpathSync(mkdtempSync(path.join(tmpdir(), 'standby-staged-')));
      try {
        const original = new Map();
        for (const { filePath, text } of entries) {
          const relative = insideRoot(root, filePath);
          original.set(path.resolve(mirror, relative), filePath);
          mkdirSync(path.dirname(path.join(mirror, relative)), { recursive: true });
          writeFileSync(path.join(mirror, relative), text);
        }
        const { results, checked } = lint(bin, config, mirror, ['.']);
        return { results: results.map((result) => ({ ...result, filePath: original.get(result.filePath) ?? result.filePath })), checked };
      } finally {
        rmSync(mirror, { recursive: true, force: true });
      }
    },
  };
}
