import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BIN = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'standby-design-lint.js');

function runHook(event) {
  return spawnSync(process.execPath, [BIN, '--hook'], { input: JSON.stringify(event), encoding: 'utf8' });
}

describe('--hook', () => {
  let project;
  const legacy = 'export const Old = () => <div className="space-y-2" />;\n';
  const added = 'export const New = () => <div className="bg-[#fff]" />;\n';
  const tidy = 'export const Tidy = () => <div className="flex gap-2" />;\n';

  before(() => {
    project = mkdtempSync(path.join(tmpdir(), 'standby-lint-'));
    mkdirSync(path.join(project, 'src', 'components', 'ui'), { recursive: true });
    writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name: 'fixture', standbyDesignLint: { componentPaths: ['/components/ui/'] } }));
    writeFileSync(path.join(project, 'src', 'view.tsx'), legacy + added + tidy);
    writeFileSync(path.join(project, 'src', 'clean.tsx'), 'export const A = () => <div className="flex gap-2" />;\n');
    writeFileSync(path.join(project, 'src', 'components', 'ui', 'button.tsx'), 'export const B = () => <button className="hover:bg-primary-hover" />;\n');
    writeFileSync(path.join(project, 'README.md'), '# fixture\n');
  });

  after(() => rmSync(project, { recursive: true, force: true }));

  it('blocks with exit code 2 and names rule and fix for a written file', () => {
    const result = runHook({ tool_name: 'Write', tool_input: { file_path: path.join(project, 'src', 'view.tsx'), content: legacy + added } });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /bg-\[#fff\]/);
    assert.match(result.stderr, /space-y-2/);
    assert.match(result.stderr, /Fix:/);
    assert.match(result.stderr, /standby\.design\/docs\/rules\//);
  });

  it('reports only the edited lines for an Edit', () => {
    const result = runHook({ tool_name: 'Edit', tool_input: { file_path: path.join(project, 'src', 'view.tsx'), old_string: 'x', new_string: added.trim() } });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /bg-\[#fff\]/);
    assert.doesNotMatch(result.stderr, /space-y-2/);
  });

  it('passes when the edited lines are clean, even if the file has old violations', () => {
    const result = runHook({ tool_name: 'Edit', tool_input: { file_path: path.join(project, 'src', 'view.tsx'), old_string: 'x', new_string: tidy.trim() } });
    assert.equal(result.status, 0, result.stderr);
  });

  it('finds a multi-line edit in a file with Windows line endings', () => {
    const file = path.join(project, 'src', 'crlf.tsx');
    const edit = 'export const Tidy = () => (\n  <div className="flex gap-2" />\n);';
    writeFileSync(file, `${legacy}${edit}\n`.replace(/\n/g, '\r\n'));
    const result = runHook({ tool_name: 'Edit', tool_input: { file_path: file, old_string: 'x', new_string: edit } });
    assert.equal(result.status, 0, result.stderr);
  });

  it('checks the whole file when the edit cannot be located', () => {
    const result = runHook({ tool_name: 'Edit', tool_input: { file_path: path.join(project, 'src', 'view.tsx'), old_string: 'x', new_string: 'not in the file' } });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /in dieser Datei/);
  });

  it('allows state classes inside the component folder', () => {
    const result = runHook({ tool_name: 'Write', tool_input: { file_path: path.join(project, 'src', 'components', 'ui', 'button.tsx'), content: '' } });
    assert.equal(result.status, 0, result.stderr);
  });

  it('ignores files it cannot lint', () => {
    assert.equal(runHook({ tool_name: 'Write', tool_input: { file_path: path.join(project, 'README.md') } }).status, 0);
    assert.equal(runHook({}).status, 0);
  });
});
