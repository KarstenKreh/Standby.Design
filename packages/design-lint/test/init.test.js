import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BIN = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'standby-design-lint.js');

function runInit(cwd) {
  return spawnSync(process.execPath, [BIN, 'init', '--no-install'], { cwd, encoding: 'utf8' });
}

function read(project, file) {
  return readFileSync(path.join(project, file), 'utf8');
}

describe('init', () => {
  let project;

  beforeEach(() => {
    project = mkdtempSync(path.join(tmpdir(), 'standby-init-'));
    execFileSync('git', ['init', '-q'], { cwd: project });
    writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name: 'app', devDependencies: { 'standby-design-lint': '^0.2.0' } }, null, 2));
    mkdirSync(path.join(project, '.github'));
  });

  afterEach(() => rmSync(project, { recursive: true, force: true }));

  it('sets up hook, skill, pre-commit, CI, settings and agent instructions', () => {
    const result = runInit(project);
    assert.equal(result.status, 0, result.stderr);

    const settings = JSON.parse(read(project, '.claude/settings.json'));
    assert.equal(settings.hooks.PostToolUse.length, 1);
    assert.match(settings.hooks.PostToolUse[0].hooks[0].command, /standby-design-lint --hook/);

    assert.match(read(project, '.claude/skills/design-review/SKILL.md'), /name: design-review/);
    assert.match(read(project, '.git/hooks/pre-commit'), /standby-design-lint --staged --warn/);
    assert.match(read(project, '.github/workflows/design-lint.yml'), /standby-design-lint@\^0\.2\.0 --since origin\//);
    assert.deepEqual(JSON.parse(read(project, 'package.json')).standbyDesignLint.componentPaths, ['/components/ui/']);
    assert.match(read(project, 'AGENTS.md'), /get_design_rules/);
    assert.equal(read(project, 'CLAUDE.md'), '@AGENTS.md\n');
    assert.match(read(project, '.gitignore'), /^\.design-review\/$/m);
  });

  it('changes nothing on a second run', () => {
    runInit(project);
    const second = runInit(project);
    assert.equal(second.status, 0, second.stderr);
    const statuses = second.stdout.split('\n').filter((line) => line.startsWith('  '));
    assert.ok(statuses.every((line) => line.endsWith('unverändert')), second.stdout);
  });

  it('keeps foreign hooks and project text, and replaces its own entries', () => {
    mkdirSync(path.join(project, '.claude'));
    writeFileSync(path.join(project, '.claude', 'settings.json'), JSON.stringify({
      permissions: { allow: ['Bash(ls)'] },
      hooks: { PostToolUse: [
        { matcher: 'Write', hooks: [{ type: 'command', command: 'prettier --write' }] },
        { matcher: 'Edit', hooks: [{ type: 'command', command: 'node old/standby-design-lint.js --hook' }] },
      ] },
    }));
    writeFileSync(path.join(project, 'CLAUDE.md'), '# App\n\nEigene Notizen.\n');
    writeFileSync(path.join(project, '.git', 'hooks', 'pre-commit'), '#!/bin/sh\nnpm test\nnpx standby-design-lint --staged\n');

    assert.equal(runInit(project).status, 0);

    const settings = JSON.parse(read(project, '.claude/settings.json'));
    assert.deepEqual(settings.permissions, { allow: ['Bash(ls)'] });
    const commands = settings.hooks.PostToolUse.flatMap((entry) => entry.hooks.map((hook) => hook.command));
    assert.deepEqual(commands, ['prettier --write', 'npx --no-install standby-design-lint --hook']);

    const claude = read(project, 'CLAUDE.md');
    assert.match(claude, /^# App\n\nEigene Notizen\.\n\n<!-- standby-design-lint:start -->/);
    assert.equal(existsSync(path.join(project, 'AGENTS.md')), false);

    const hook = read(project, '.git/hooks/pre-commit');
    assert.equal(hook, '#!/bin/sh\nnpm test\nnpx --no-install standby-design-lint --staged --warn\n');
  });

  it('writes into husky when the project uses it', () => {
    mkdirSync(path.join(project, '.husky'));
    writeFileSync(path.join(project, '.husky', 'pre-commit'), 'npx lint-staged\n');
    runInit(project);
    assert.equal(read(project, '.husky/pre-commit'), 'npx lint-staged\nnpx --no-install standby-design-lint --staged --warn\n');
  });

  it('refuses to run outside a project', () => {
    rmSync(path.join(project, 'package.json'));
    const result = runInit(project);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Kein package\.json/);
  });
});

describe('--warn', () => {
  it('reports violations but exits with 0', () => {
    const project = mkdtempSync(path.join(tmpdir(), 'standby-warn-'));
    try {
      mkdirSync(path.join(project, 'src'));
      writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name: 'app', standbyDesignLint: {} }));
      writeFileSync(path.join(project, 'src', 'view.tsx'), 'export const V = () => <div className="bg-[#fff]" />;\n');
      const strict = spawnSync(process.execPath, [BIN, 'src'], { cwd: project, encoding: 'utf8' });
      const warn = spawnSync(process.execPath, [BIN, 'src', '--warn'], { cwd: project, encoding: 'utf8' });
      assert.equal(strict.status, 1);
      assert.equal(warn.status, 0);
      assert.match(warn.stdout, /bg-\[#fff\]/);
      assert.match(warn.stdout, /Der Commit läuft trotzdem/);
    } finally {
      rmSync(project, { recursive: true, force: true });
    }
  });
});
