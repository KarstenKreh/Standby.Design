import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAddedLines } from '../src/git-diff.js';

const BIN = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'standby-design-lint.js');

describe('parseAddedLines', () => {
  it('reads added line ranges per file and skips pure deletions', () => {
    const diff = [
      'diff --git a/src/a.tsx b/src/a.tsx',
      '--- a/src/a.tsx',
      '+++ b/src/a.tsx',
      '@@ -3 +3 @@',
      '@@ -10,2 +11,4 @@',
      '@@ -20,3 +25,0 @@',
      'diff --git a/src/gone.tsx b/src/gone.tsx',
      '--- a/src/gone.tsx',
      '+++ /dev/null',
      '@@ -1,4 +0,0 @@',
    ].join('\n');
    const files = parseAddedLines(diff);
    assert.deepEqual(files.get('src/a.tsx'), [[3, 3], [11, 14]]);
    assert.equal(files.has('src/gone.tsx'), false);
  });
});

describe('--staged', () => {
  let repo;
  const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' });

  before(() => {
    repo = mkdtempSync(path.join(tmpdir(), 'standby-staged-'));
    mkdirSync(path.join(repo, 'src'));
    git('init', '-q');
    git('config', 'user.email', 'test@example.com');
    git('config', 'user.name', 'test');
    writeFileSync(path.join(repo, 'package.json'), '{"name":"fixture"}');
    writeFileSync(path.join(repo, 'src', 'view.tsx'), 'export const Old = () => <div className="space-y-2" />;\n');
    git('add', '.');
    git('commit', '-q', '-m', 'legacy');
  });

  after(() => rmSync(repo, { recursive: true, force: true }));

  function runStaged() {
    return spawnSync(process.execPath, [BIN, '--staged'], { cwd: repo, encoding: 'utf8' });
  }

  it('fails only for violations in staged lines', () => {
    writeFileSync(path.join(repo, 'src', 'view.tsx'), 'export const Old = () => <div className="space-y-2" />;\nexport const New = () => <div className="flex gap-2" />;\n');
    git('add', '.');
    assert.equal(runStaged().status, 0);

    writeFileSync(path.join(repo, 'src', 'view.tsx'), 'export const Old = () => <div className="space-y-2" />;\nexport const New = () => <div className="bg-[#fff]" />;\n');
    git('add', '.');
    const result = runStaged();
    assert.equal(result.status, 1);
    assert.match(result.stdout, /bg-\[#fff\]/);
    assert.doesNotMatch(result.stdout, /space-y-2/);
  });

  it('checks the staged content, not the working tree', () => {
    writeFileSync(path.join(repo, 'src', 'view.tsx'), 'export const Old = () => <div className="space-y-2" />;\nexport const New = () => <div className="flex gap-2" />;\n');
    assert.equal(runStaged().status, 1);
  });
});
