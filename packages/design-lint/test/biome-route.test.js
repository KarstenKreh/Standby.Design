import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureBiomeConfig, findBiome } from '../src/biome/engine.js';
import { globToRegex, ignoreMatcher } from '../src/ignores.js';

const BIN = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'standby-design-lint.js');
const VIEW = 'export const Old = () => <div className="space-y-2" />;\nexport const New = () => <div className="bg-[#fff]" />;\nexport const Tidy = () => <div className="flex gap-2" />;\n';

function write(root, file, content) {
  mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  writeFileSync(path.join(root, file), content);
}

function workspace(engine, extra = {}) {
  const root = mkdtempSync(path.join(tmpdir(), `standby-${engine}-`));
  write(root, 'package.json', JSON.stringify({
    name: 'mono',
    standbyDesignLint: { engine, componentPaths: ['/components/ui/', '/packages/ui/src/components/'], allowedColors: ['blue-500'], ignores: ['apps/web/src/legacy/**'], ...extra },
  }));
  write(root, 'pnpm-workspace.yaml', 'packages:\n  - apps/*\n  - packages/*\nnodeLinker: hoisted\n');
  write(root, 'biome.json', JSON.stringify({ files: { includes: ['**', '!**/view.tsx'] } }));
  write(root, 'apps/web/package.json', JSON.stringify({ name: 'web' }));
  write(root, 'apps/web/src/view.tsx', VIEW);
  write(root, 'apps/web/src/legacy/old.tsx', VIEW);
  write(root, 'apps/web/src/allowed.tsx', 'export const A = () => <div className="bg-blue-500" />;\n');
  write(root, 'apps/web/src/exception.tsx', '// biome-ignore lint/plugin: Markenfarbe aus dem Logo\nexport const A = () => <div className="bg-[#fff]" />;\n');
  write(root, 'packages/ui/src/components/button.tsx', 'export const B = () => <button className="hover:bg-primary-hover" />;\n');
  write(root, 'apps/web/src/row.tsx', 'export const R = () => <a className="hover:underline" />;\n');
  write(root, 'dist/bundle.jsx', VIEW);
  return root;
}

function hook(root, file, newString) {
  const input = newString ? { old_string: 'x', new_string: newString } : { content: '' };
  const event = { tool_name: newString ? 'Edit' : 'Write', tool_input: { file_path: path.join(root, file), ...input } };
  return spawnSync(process.execPath, [BIN, '--hook'], { input: JSON.stringify(event), encoding: 'utf8', cwd: root });
}

function messages(output) {
  return output.split('\n').filter((line) => line.includes('  „')).map((line) => line.slice(line.indexOf('  „') + 2));
}

describe('Biome-Weg', () => {
  let biome;
  let eslint;

  before(() => {
    biome = workspace('biome');
    eslint = workspace('eslint');
  });

  after(() => {
    rmSync(biome, { recursive: true, force: true });
    rmSync(eslint, { recursive: true, force: true });
  });

  it('the hook reports the same message and rule link as the ESLint way', () => {
    const viaBiome = hook(biome, 'apps/web/src/view.tsx');
    const viaEslint = hook(eslint, 'apps/web/src/view.tsx');
    assert.equal(viaBiome.status, 2, viaBiome.stderr);
    assert.equal(viaEslint.status, 2, viaEslint.stderr);
    assert.deepEqual(messages(viaBiome.stderr), messages(viaEslint.stderr));
    assert.match(viaBiome.stderr, /standby\.design\/docs\/rules\//);
    assert.match(viaBiome.stderr, /apps\/web\/src\/view\.tsx:2:\d+ {2}„bg-\[#fff\]“/);
  });

  it('the hook reports only the edited lines', () => {
    const dirty = hook(biome, 'apps/web/src/view.tsx', 'export const New = () => <div className="bg-[#fff]" />;');
    assert.equal(dirty.status, 2);
    assert.match(dirty.stderr, /in den geänderten Zeilen \(1\)/);
    assert.doesNotMatch(dirty.stderr, /space-y-2/);
    const tidy = hook(biome, 'apps/web/src/view.tsx', 'export const Tidy = () => <div className="flex gap-2" />;');
    assert.equal(tidy.status, 0, tidy.stderr);
  });

  it('reads component folders, allowed colors and ignores from package.json', () => {
    assert.equal(hook(biome, 'packages/ui/src/components/button.tsx').status, 0);
    assert.equal(hook(biome, 'apps/web/src/allowed.tsx').status, 0);
    assert.equal(hook(biome, 'apps/web/src/legacy/old.tsx').status, 0);
    const row = hook(biome, 'apps/web/src/row.tsx');
    assert.equal(row.status, 2);
    assert.match(row.stderr, /\/components\/ui\/, \/packages\/ui\/src\/components\//);
  });

  it('accepts a biome-ignore comment as the exception', () => {
    assert.equal(hook(biome, 'apps/web/src/exception.tsx').status, 0);
  });

  it('checks a folder without the ignores and the build output, whatever biome.json of the project says', () => {
    const result = spawnSync(process.execPath, [BIN, '.'], { cwd: biome, encoding: 'utf8' });
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stdout, /apps\/web\/src\/view\.tsx:1:/);
    assert.match(result.stdout, /apps\/web\/src\/row\.tsx/);
    assert.doesNotMatch(result.stdout, /legacy|dist\/|allowed|exception|button/);
  });

  it('leaves no file behind in the project', () => {
    hook(biome, 'apps/web/src/view.tsx');
    assert.deepEqual(readdirSync(biome).sort(), ['apps', 'biome.json', 'dist', 'package.json', 'packages', 'pnpm-workspace.yaml']);
  });

  it('writes the plugin files for the settings once and reuses them', () => {
    const config = ensureBiomeConfig({ componentPaths: ['/design/'] }, mkdtempSync(path.join(tmpdir(), 'standby-config-')));
    assert.deepEqual(readdirSync(config).filter((file) => file.endsWith('.grit')).length, 8);
    assert.equal(ensureBiomeConfig({ componentPaths: ['/design/'] }, path.dirname(config)), config);
    rmSync(path.dirname(config), { recursive: true, force: true });
  });

  it('writes plugin files with the settings of the project for biome.json', () => {
    const result = spawnSync(process.execPath, [BIN, 'biome', 'tools/standby'], { cwd: biome, encoding: 'utf8' });
    try {
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /8 Regeln als Biome-Plugins in tools\/standby geschrieben/);
      assert.match(readFileSync(path.join(biome, 'tools/standby/no-state-classes-in-views.grit'), 'utf8'), /packages\[\/\\\\\]ui\[\/\\\\\]src\[\/\\\\\]components/);
      assert.match(readFileSync(path.join(biome, 'tools/standby/warn/no-raw-values.grit'), 'utf8'), /blue-500/);
    } finally {
      rmSync(path.join(biome, 'tools'), { recursive: true, force: true });
    }
  });

  it('takes the Biome of the project root, as a hoisted pnpm workspace installs it', () => {
    write(biome, 'node_modules/@biomejs/biome/package.json', '{"name":"@biomejs/biome","version":"2.6.8"}');
    write(biome, 'node_modules/@biomejs/biome/bin/biome', '');
    try {
      assert.ok(findBiome(biome).startsWith(biome));
    } finally {
      rmSync(path.join(biome, 'node_modules'), { recursive: true, force: true });
    }
  });

  it('names the missing piece when the engine is unknown', () => {
    const root = workspace('rome');
    try {
      const result = hook(root, 'apps/web/src/view.tsx');
      assert.equal(result.status, 1);
      assert.match(result.stderr, /"engine": "rome"/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('Biome-Weg mit --staged und --since', () => {
  let repo;
  const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' });
  const run = (...args) => spawnSync(process.execPath, [BIN, ...args], { cwd: repo, encoding: 'utf8' });

  before(() => {
    repo = mkdtempSync(path.join(tmpdir(), 'standby-biome-staged-'));
    git('init', '-q', '-b', 'main');
    git('config', 'user.email', 'test@example.com');
    git('config', 'user.name', 'test');
    write(repo, 'package.json', JSON.stringify({ name: 'mono', standbyDesignLint: { engine: 'biome' } }));
    write(repo, 'apps/web/src/view.tsx', 'export const Old = () => <div className="space-y-2" />;\n');
    write(repo, 'apps/web/src/components/ui/button.tsx', 'export const B = () => <button />;\n');
    git('add', '.');
    git('commit', '-q', '-m', 'legacy');
  });

  after(() => rmSync(repo, { recursive: true, force: true }));

  it('checks the staged content of the changed lines only', () => {
    write(repo, 'apps/web/src/view.tsx', 'export const Old = () => <div className="space-y-2" />;\nexport const New = () => <div className="bg-[#fff]" />;\n');
    write(repo, 'apps/web/src/components/ui/button.tsx', 'export const B = () => <button className="hover:bg-primary-hover" />;\n');
    git('add', '.');
    write(repo, 'apps/web/src/view.tsx', 'export const Old = () => <div className="space-y-2" />;\nexport const New = () => <div className="flex" />;\n');
    const result = run('--staged');
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stdout, /apps\/web\/src\/view\.tsx:2:\d+ {2}„bg-\[#fff\]“/);
    assert.doesNotMatch(result.stdout, /space-y-2|button/);
    assert.equal(run('--staged', '--warn').status, 0);
  });

  it('checks the lines since a base ref, as the CI workflow does', () => {
    git('checkout', '-q', '-b', 'feature');
    write(repo, 'apps/web/src/view.tsx', 'export const Old = () => <div className="space-y-2" />;\nexport const New = () => <div className="bg-[#fff]" />;\n');
    git('add', '.');
    git('commit', '-q', '-m', 'feature');
    const result = run('--since', 'main');
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stdout, /1 Verstöße in 1 Dateien/);
  });
});

describe('ignores', () => {
  it('matches globs against the path from the project root', () => {
    assert.ok(globToRegex('**/dist/**').test('apps/web/dist/a.js'));
    assert.ok(globToRegex('**/*.d.ts').test('src/types.d.ts'));
    assert.ok(globToRegex('apps/landing/**').test('apps/landing/src/a.astro'));
    assert.ok(!globToRegex('apps/landing/**').test('apps/web/src/a.tsx'));
    assert.ok(globToRegex('src/*.ts').test('src/a.ts'));
    assert.ok(!globToRegex('src/*.ts').test('src/deep/a.ts'));
    const isIgnored = ignoreMatcher(path.resolve('/project'), ['generated/']);
    assert.ok(isIgnored(path.resolve('/project/generated/a.ts')));
    assert.ok(isIgnored(path.resolve('/project/node_modules/x/index.js')));
    assert.ok(!isIgnored(path.resolve('/project/src/a.ts')));
  });
});
