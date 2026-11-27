import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { agentBlock, detectRoute, initProject, installCommand } from '../src/init.js';
import { SETUP_ERROR } from '../src/errors.js';
import { checkReleaseAge, releaseAgeGate } from '../src/release-age.js';

const BIN = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'standby-design-lint.js');
const { version } = JSON.parse(readFileSync(path.join(path.dirname(BIN), '..', 'package.json'), 'utf8'));
const PRE_COMMIT_LINE = '[ ! -e node_modules/.bin/standby-design-lint ] || npx --no-install standby-design-lint --staged --warn || true';
const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-12-01T12:00:00Z');
const WORKSPACE = 'packages:\n  - apps/*\n  - packages/*\nnodeLinker: hoisted\nminimumReleaseAge: 10080\ntrustPolicy: no-downgrade\n';

function runInit(cwd, ...args) {
  return spawnSync(process.execPath, [BIN, 'init', '--no-install', ...args], { cwd, encoding: 'utf8' });
}

function read(project, file) {
  return readFileSync(path.join(project, file), 'utf8');
}

function write(project, file, content) {
  mkdirSync(path.dirname(path.join(project, file)), { recursive: true });
  writeFileSync(path.join(project, file), content);
}

function manifest(project) {
  return JSON.parse(read(project, 'package.json'));
}

describe('init in a Biome project', () => {
  let project;

  beforeEach(() => {
    project = mkdtempSync(path.join(tmpdir(), 'standby-init-biome-'));
    execFileSync('git', ['init', '-q'], { cwd: project });
    write(project, 'package.json', JSON.stringify({ name: 'mono', packageManager: 'pnpm@10.20.0', devDependencies: { '@biomejs/biome': '2.6.8', typescript: 'catalog:typescript6' } }, null, 2));
    write(project, 'biome.json', '{ "linter": { "enabled": true } }\n');
    write(project, 'pnpm-workspace.yaml', WORKSPACE);
    write(project, 'pnpm-lock.yaml', '');
    mkdirSync(path.join(project, '.github'));
  });

  afterEach(() => rmSync(project, { recursive: true, force: true }));

  it('recognizes a project with Biome and without ESLint', () => {
    assert.equal(detectRoute(project).route, 'biome');
    write(project, 'eslint.config.js', 'export default [];\n');
    assert.equal(detectRoute(project).route, 'eslint');
    assert.equal(detectRoute(project, 'biome').route, 'biome');
  });

  it('adds only its own package to a hoisted pnpm workspace, no ESLint and no second TypeScript', () => {
    assert.deepEqual(installCommand(project), ['pnpm', ['add', '-D', '-w', '-E', `standby-design-lint@${version}`]]);
  });

  it('installs nothing when the running version is already in the project', () => {
    write(project, 'package.json', JSON.stringify({ name: 'mono', devDependencies: { '@biomejs/biome': '2.6.8', 'standby-design-lint': version } }));
    write(project, 'node_modules/standby-design-lint/package.json', JSON.stringify({ version }));
    assert.equal(installCommand(project), null);
  });

  it('sets up every stage in one run and leaves biome.json and TypeScript alone', () => {
    const biomeBefore = read(project, 'biome.json');
    const result = runInit(project);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Weg: Biome, ohne ESLint \(das Projekt nutzt Biome und kein ESLint\)/);
    assert.match(result.stdout, /biome\.json, ESLint und TypeScript bleiben unberührt/);

    assert.equal(manifest(project).standbyDesignLint.engine, 'biome');
    assert.deepEqual(manifest(project).devDependencies, { '@biomejs/biome': '2.6.8', typescript: 'catalog:typescript6' });
    assert.equal(read(project, 'biome.json'), biomeBefore);
    assert.match(JSON.parse(read(project, '.claude/settings.json')).hooks.PostToolUse[0].hooks[0].command, /standby-design-lint --hook/);
    assert.match(read(project, '.claude/skills/design-review/SKILL.md'), /name: design-review/);
    assert.match(read(project, '.git/hooks/pre-commit'), /standby-design-lint --staged --warn/);

    const workflow = read(project, '.github/workflows/design-lint.yml');
    assert.match(workflow, /pnpm\/action-setup@v4\n {6}- uses: actions\/setup-node/);
    assert.match(workflow, /pnpm install --frozen-lockfile\n.*pnpm exec standby-design-lint --since origin\//s);
    assert.doesNotMatch(workflow, /pnpm check|biome check|eslint/);
  });

  it('changes nothing on a second run and keeps the settings of the project', () => {
    runInit(project);
    const settings = { ...manifest(project).standbyDesignLint, componentPaths: ['/components/ui/', '/packages/ui/src/components/'], allowedColors: ['blue-500'] };
    write(project, 'package.json', JSON.stringify({ ...manifest(project), standbyDesignLint: settings }, null, 2) + '\n');
    const second = runInit(project);
    const statuses = second.stdout.split('\n').filter((line) => line.startsWith('  '));
    assert.ok(statuses.length > 5 && statuses.every((line) => line.endsWith('unverändert')), second.stdout);
    assert.deepEqual(manifest(project).standbyDesignLint, settings);
  });

  it('adds the engine to settings that an older version wrote', () => {
    write(project, 'package.json', JSON.stringify({ name: 'mono', devDependencies: { '@biomejs/biome': '2.6.8' }, standbyDesignLint: { componentPaths: ['/design/'] } }));
    runInit(project);
    assert.deepEqual(manifest(project).standbyDesignLint, { engine: 'biome', componentPaths: ['/design/'] });
  });

  it('writes the exception spelling that works in the project into the rules block', () => {
    runInit(project);
    const block = read(project, 'AGENTS.md');
    assert.match(block, /\/\/ biome-ignore lint\/plugin: <Grund>/);
    assert.doesNotMatch(block, /eslint-disable-next-line/);
    assert.match(agentBlock({ route: 'eslint' }), /eslint-disable-next-line/);
    assert.doesNotMatch(agentBlock({ route: 'eslint' }), /biome-ignore/);
  });

  it('names the exception for .astro files when the project tracks some', () => {
    write(project, 'apps/landing/src/pages/index.astro', '<p>a</p>\n');
    execFileSync('git', ['add', 'apps'], { cwd: project });
    runInit(project);
    assert.match(read(project, 'AGENTS.md'), /<!-- biome-ignore lint\/plugin: <Grund> -->/);
  });

  it('names the rules file of the project as the source that counts', () => {
    write(project, 'package.json', JSON.stringify({ name: 'mono', devDependencies: { '@biomejs/biome': '2.6.8' }, standbyDesignLint: { engine: 'biome', rulesFile: 'docs/design/README.md' } }));
    runInit(project);
    assert.match(read(project, 'AGENTS.md'), /Für dieses Projekt gelten die Regeln in `docs\/design\/README\.md`\..*gilt die Datei im Projekt\./);
  });

  it('writes through a .claude symlink into the folder it points to', () => {
    mkdirSync(path.join(project, '.agents'));
    symlinkSync('.agents', path.join(project, '.claude'), 'junction');
    const result = runInit(project);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Claude-Code-Hook in \.agents\/settings\.json \(über \.claude\): angelegt/);
    assert.match(read(project, '.agents/settings.json'), /standby-design-lint --hook/);
    assert.match(read(project, '.agents/skills/design-review/SKILL.md'), /name: design-review/);
    assert.ok(lstatSync(path.join(project, '.claude')).isSymbolicLink());
    assert.ok(runInit(project).stdout.includes('settings.json (über .claude): unverändert'));
  });

  it('follows a .claude symlink that Git checked out as a text file (core.symlinks=false)', () => {
    mkdirSync(path.join(project, '.agents'));
    writeFileSync(path.join(project, '.claude'), '.agents');
    const result = runInit(project);
    assert.equal(result.status, 0, result.stderr);
    assert.match(read(project, '.agents/settings.json'), /standby-design-lint --hook/);
    assert.equal(read(project, '.claude'), '.agents');
  });

  it('stops with a clear message when .claude is a file that points nowhere', () => {
    writeFileSync(path.join(project, '.claude'), 'notes\n');
    const result = runInit(project);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /\.claude ist eine Datei, kein Ordner/);
    assert.equal(existsSync(path.join(project, 'AGENTS.md')), false);
  });

  it('fills an empty husky pre-commit with one line that never blocks', () => {
    write(project, '.husky/pre-commit', '');
    runInit(project);
    assert.equal(read(project, '.husky/pre-commit'), `${PRE_COMMIT_LINE}\n`);
    assert.equal(manifest(project).scripts, undefined);
    const hook = () => spawnSync('git', ['-c', 'alias.precommit=!sh -e .husky/pre-commit', 'precommit'], { cwd: project, encoding: 'utf8' });
    assert.equal(hook().status, 0, hook().stderr);
    write(project, 'node_modules/.bin/standby-design-lint', '#!/bin/sh\nexit 2\n');
    assert.equal(hook().status, 0, hook().stderr);
  });

  it('takes the Node version of the project for the CI workflow', () => {
    write(project, '.nvmrc', '24\n');
    runInit(project);
    assert.match(read(project, '.github/workflows/design-lint.yml'), /node-version-file: \.nvmrc\n {10}cache: pnpm/);
  });
});

describe('minimumReleaseAge', () => {
  let project;
  const times = (ages) => () => Object.fromEntries(Object.entries(ages).map(([name, days]) => [name, new Date(NOW - days * DAY).toISOString()]));
  const commands = [];
  const run = (command, args) => commands.push([command, ...args].join(' '));

  beforeEach(() => {
    commands.length = 0;
    project = mkdtempSync(path.join(tmpdir(), 'standby-age-'));
    write(project, 'package.json', JSON.stringify({ name: 'mono', devDependencies: { '@biomejs/biome': '2.6.8' } }));
    write(project, 'pnpm-workspace.yaml', WORKSPACE);
  });

  afterEach(() => rmSync(project, { recursive: true, force: true }));

  it('reads the gate of pnpm and npm, and the exclude list', () => {
    assert.deepEqual(releaseAgeGate(project, 'pnpm'), { minutes: 10080, source: 'minimumReleaseAge 10080 in pnpm-workspace.yaml' });
    write(project, 'pnpm-workspace.yaml', `${WORKSPACE}minimumReleaseAgeExclude:\n  - '@types/*'\n  - standby-design-lint\n`);
    assert.equal(releaseAgeGate(project, 'pnpm'), null);
    write(project, 'pnpm-workspace.yaml', `${WORKSPACE}minimumReleaseAgeExclude:\n  - '@types/*'\n`);
    assert.equal(releaseAgeGate(project, 'pnpm').minutes, 10080);
    write(project, '.npmrc', 'min-release-age=3\n');
    assert.equal(releaseAgeGate(project, 'npm').minutes, 3 * 24 * 60);
    assert.equal(releaseAgeGate(project, 'yarn'), null);
  });

  it('knows when a version is allowed and which one is the newest allowed', () => {
    const gate = { minutes: 10080 };
    const all = times({ '0.4.0': 30, '0.5.0': 9, '0.5.1': 2, '0.6.0-beta.1': 20 })();
    assert.deepEqual(checkReleaseAge({ version: '0.5.0', gate, times: all, now: NOW }), { allowed: true });
    const verdict = checkReleaseAge({ version: '0.5.1', gate, times: all, now: NOW });
    assert.equal(verdict.allowed, false);
    assert.equal(verdict.newestAllowed, '0.5.0');
    assert.equal(verdict.allowedFrom.getTime(), NOW + 5 * DAY);
    assert.deepEqual(checkReleaseAge({ version: '0.5.1', gate, times: null, now: NOW }), { allowed: true });
  });

  it('installs the running version when it is old enough', () => {
    const result = initProject(project, { times: times({ [version]: 8 }), now: NOW, run });
    assert.deepEqual(commands, [`pnpm add -D -w -E standby-design-lint@${version}`]);
    assert.ok(result.steps.length > 5);
  });

  it('stops and changes nothing when the running version is too young and no older one can step in', () => {
    assert.throws(() => initProject(project, { times: times({ '0.4.0': 30, [version]: 2 }), now: NOW, run }), (error) => {
      assert.equal(error.code, SETUP_ERROR);
      assert.match(error.message, new RegExp(`standby-design-lint ${version.replace(/\./g, '\\.')} ist in diesem Projekt erst ab .*2026.* erlaubt \\(minimumReleaseAge 10080 in pnpm-workspace\\.yaml\\)`));
      assert.match(error.message, /Nichts wurde geändert/);
      return true;
    });
    assert.deepEqual(commands, []);
    assert.equal(existsSync(path.join(project, 'AGENTS.md')), false);
    assert.equal(manifest(project).standbyDesignLint, undefined);
  });

  it('sets up the newest allowed version instead, through the lockfile of the project', () => {
    const result = initProject(project, { times: times({ '0.5.0': 30, '9.0.0': 9, [version]: 2 }), now: NOW, run });
    assert.equal(commands[0], 'pnpm add -D -w -E standby-design-lint@9.0.0');
    assert.match(commands[1], /node_modules[\\/]standby-design-lint[\\/]bin[\\/]standby-design-lint\.js init$/);
    assert.match(result.delegated, /Eingerichtet ist 9\.0\.0, die neueste erlaubte Version\./);
    assert.equal(existsSync(path.join(project, 'AGENTS.md')), false);
  });

  it('stops before it writes anything when the package manager refuses the install', () => {
    const refuse = () => {
      throw new Error('ERR_PNPM_NO_MATURE_MATCHING_VERSION');
    };
    assert.throws(() => initProject(project, { times: () => null, now: NOW, run: refuse }), (error) => {
      assert.equal(error.code, SETUP_ERROR);
      assert.match(error.message, /pnpm add -D -w -E standby-design-lint@.* ist fehlgeschlagen/);
      assert.match(error.message, /Die Sperre nicht umgehen/);
      return true;
    });
    assert.equal(existsSync(path.join(project, 'AGENTS.md')), false);
    assert.equal(manifest(project).standbyDesignLint, undefined);
  });

  it('asks the registry only when the project has a gate', () => {
    write(project, 'pnpm-workspace.yaml', 'packages:\n  - apps/*\n');
    initProject(project, { times: () => assert.fail('no gate, no lookup'), now: NOW, run });
    assert.equal(commands.length, 1);
  });
});
