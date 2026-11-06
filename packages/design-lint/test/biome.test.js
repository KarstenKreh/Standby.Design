import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Linter } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import plugin from '../src/index.js';
import { BIOME_RULES, staleBiomePlugins } from '../src/biome/generate.js';
import { CASES } from './cases.js';

const BIOME_DIR = fileURLToPath(new URL('../biome/', import.meta.url));
const BIOME_BIN = createRequire(import.meta.url).resolve('@biomejs/biome/bin/biome');

function eslintMessages(rule, { code, filename = 'src/case.tsx' }) {
  const linter = new Linter({ configType: 'flat' });
  const config = [{
    files: ['**/*.tsx'],
    languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { standby: plugin },
    rules: { [`standby/${rule}`]: 'error' },
  }];
  return linter.verify(code, config, { filename }).map((result) => result.message);
}

function runBiome(cwd, pluginFile, targets) {
  writeFileSync(path.join(cwd, 'biome.json'), JSON.stringify({
    linter: { rules: { recommended: false } },
    plugins: [path.join(BIOME_DIR, pluginFile).replace(/\\/g, '/')],
  }));
  const args = [BIOME_BIN, 'lint', '--reporter=json', '--max-diagnostics=1000', ...targets];
  let output;
  try {
    output = execFileSync(process.execPath, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    output = error.stdout;
  }
  return JSON.parse(output).diagnostics;
}

function biomeMessagesByFile(diagnostics) {
  const byFile = new Map();
  for (const diagnostic of diagnostics) {
    assert.equal(diagnostic.category, 'plugin', diagnostic.message);
    const file = diagnostic.location.path.replace(/\\/g, '/');
    byFile.set(file, [...(byFile.get(file) ?? []), diagnostic.message]);
  }
  return byFile;
}

function portableCases(rule) {
  const { valid, invalid } = CASES[rule];
  return [...valid, ...invalid]
    .map((entry) => (typeof entry === 'string' ? { code: entry } : entry))
    .filter((entry) => !entry.options);
}

describe('Biome-Plugins', () => {
  let root;
  before(() => {
    root = mkdtempSync(path.join(tmpdir(), 'standby-biome-'));
  });
  after(() => rmSync(root, { recursive: true, force: true }));

  it('passen zu den Regeln in src (sonst npm run build:biome)', () => {
    assert.deepEqual(staleBiomePlugins(BIOME_DIR), []);
  });

  for (const rule of BIOME_RULES) {
    it(`${rule} meldet dasselbe wie die ESLint-Regel`, () => {
      const cwd = path.join(root, rule);
      const cases = portableCases(rule).map((entry, index) => {
        const file = path.posix.join(`case-${index}`, entry.filename ?? 'src/case.tsx');
        mkdirSync(path.dirname(path.join(cwd, file)), { recursive: true });
        writeFileSync(path.join(cwd, file), `${entry.code}\n`);
        return { ...entry, file, expected: eslintMessages(rule, entry) };
      });
      const actual = biomeMessagesByFile(runBiome(cwd, `${rule}.grit`, cases.map(({ file }) => file)));
      for (const { code, file, expected } of cases) {
        const found = actual.get(file) ?? [];
        assert.equal(found.length > 0, expected.length > 0, `${code}\nBiome: ${found.join(' | ') || 'nichts'}`);
        for (const text of found) assert.ok(expected.includes(text), `${code}\nBiome: ${text}\nESLint: ${expected.join(' | ')}`);
      }
    });
  }

  it('die Dateien in warn/ melden als Warnung', () => {
    const cwd = path.join(root, 'warn');
    mkdirSync(path.join(cwd, 'src'), { recursive: true });
    writeFileSync(path.join(cwd, 'src', 'a.tsx'), '<div className="space-y-4" />\n');
    const [diagnostic] = runBiome(cwd, 'warn/no-space-utilities.grit', ['src/a.tsx']);
    assert.equal(diagnostic.severity, 'warning');
  });
});
