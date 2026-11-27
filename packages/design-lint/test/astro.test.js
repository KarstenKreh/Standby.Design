import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintMarkup, markupAttributes } from '../src/markup.js';

const BIN = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'standby-design-lint.js');
const VIEW = 'src/pages/index.astro';

function found(code, settings, filename = VIEW) {
  return lintMarkup(code, filename, settings).map(({ ruleId, line }) => `${ruleId}:${line}`);
}

describe('.astro', () => {
  it('checks class and style attributes with the same rules and messages', () => {
    const [space, color, style] = lintMarkup('<div class="space-y-2 bg-[#fff]" style="color: red">x</div>\n', VIEW);
    assert.equal(space.ruleId, 'standby/no-space-utilities');
    assert.equal(color.ruleId, 'standby/no-raw-values');
    assert.equal(style.ruleId, 'standby/no-inline-style');
    assert.match(space.message, /^„space-y-2“ legt den Abstand als Margin auf die Kinder\..*standby\.design\/docs\/rules\/stack-abstand/);
    assert.deepEqual([space.line, space.column, color.column], [1, 13, 23]);
  });

  it('reads class:list, expressions and template strings', () => {
    const code = [
      '<a class:list={["hover:underline", { "bg-primary/50": active }]} href="/x">a</a>',
      '<span class={`transition-all ${big ? "mb-1" : "last:mb-0"}`}>b</span>',
      '<Card containerClass="text-white" />',
    ].join('\n');
    assert.deepEqual(found(code), [
      'standby/no-state-classes-in-views:1',
      'standby/no-opacity-on-semantic-colors:1',
      'standby/no-transition-all:2',
      'standby/no-space-utilities:2',
      'standby/no-raw-values:3',
    ]);
  });

  it('skips frontmatter, comments, script and style blocks and other attributes', () => {
    const code = [
      '---',
      'const title = "space-y-2";',
      'const html = `<div class="space-y-2">`;',
      '---',
      '<!-- <div class="space-y-2"> -->',
      '<div title="space-y-2" data-class="x" {...props}>It\'s {a < b ? "space-y-2" : ""}</div>',
      '<script>const a = \'<div class="space-y-2">\';</script>',
      '<style>.a { transition: all 1s }</style>',
      '<p class="flex gap-2">ok</p>',
    ].join('\n');
    assert.deepEqual(found(code), []);
  });

  it('keeps checking after a script block', () => {
    assert.deepEqual(found('<script is:inline>let a = 1 < 2;</script>\n<b class="space-x-1">b</b>\n'), ['standby/no-space-utilities:2']);
  });

  it('honours component folders and allowed colors', () => {
    assert.deepEqual(found('<a class="hover:underline bg-blue-500">a</a>', { componentPaths: ['/components/ui/'], allowedColors: ['blue-500'] }, 'src/components/ui/Link.astro'), []);
    assert.deepEqual(found('<a class="hover:underline">a</a>', { componentPaths: [] }), ['standby/no-state-classes-in-views:1']);
  });

  it('accepts an exception comment before the element, in both spellings', () => {
    const code = [
      '<!-- biome-ignore lint/plugin: Markenfarbe aus dem Logo -->',
      '<p class="text-white">a</p>',
      '<!-- eslint-disable-next-line standby/no-raw-values -- Markenfarbe -->',
      '<p',
      '  class="text-white space-y-2"',
      '>b</p>',
      '<p class="text-white">c</p>',
    ].join('\n');
    assert.deepEqual(found(code), ['standby/no-space-utilities:5', 'standby/no-raw-values:7']);
  });

  it('survives broken markup', () => {
    assert.doesNotThrow(() => markupAttributes('<div class="a\n<p class={`x ${'));
    assert.doesNotThrow(() => markupAttributes('---\nunclosed frontmatter <div class='));
  });

  it('is checked by the hook without ESLint or Biome', () => {
    const project = mkdtempSync(path.join(tmpdir(), 'standby-astro-'));
    try {
      mkdirSync(path.join(project, 'src', 'pages'), { recursive: true });
      writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name: 'landing', standbyDesignLint: { engine: 'biome' } }));
      const file = path.join(project, 'src', 'pages', 'index.astro');
      writeFileSync(file, '---\n---\n<div class="space-y-2">a</div>\n<div class="bg-[#fff]">b</div>\n');
      const run = (event) => spawnSync(process.execPath, [BIN, '--hook'], { input: JSON.stringify(event), encoding: 'utf8', cwd: project });
      const whole = run({ tool_name: 'Write', tool_input: { file_path: file, content: '' } });
      assert.equal(whole.status, 2, whole.stderr);
      assert.match(whole.stderr, /src\/pages\/index\.astro:3:13 {2}„space-y-2“/);
      const edit = run({ tool_name: 'Edit', tool_input: { file_path: file, old_string: 'x', new_string: '<div class="bg-[#fff]">b</div>' } });
      assert.match(edit.stderr, /in den geänderten Zeilen \(1\)/);
      const folder = spawnSync(process.execPath, [BIN, 'src'], { encoding: 'utf8', cwd: project });
      assert.match(folder.stdout, /2 Verstöße in 1 Dateien/);
    } finally {
      rmSync(project, { recursive: true, force: true });
    }
  });
});
