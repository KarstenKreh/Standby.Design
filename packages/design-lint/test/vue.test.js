import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RuleTester } from 'eslint';
import { recommendedVue, rules } from '../src/index.js';

const BIN = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'standby-design-lint.js');
const VIEW = 'src/pages/Settings.vue';
const COMPONENT = 'src/components/ui/Button.vue';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  files: ['**/*.vue'],
  languageOptions: recommendedVue().languageOptions,
});

const inTemplate = (markup) => ({ code: `<template>${markup}</template>`, filename: VIEW });
const violation = (markup, ...messageIds) => ({ ...inTemplate(markup), errors: messageIds.map((messageId) => ({ messageId })) });

const CASES = {
  'no-raw-values': {
    valid: [
      inTemplate('<div class="bg-card p-4" />'),
      inTemplate('<div :class="{ \'bg-card\': status === \'bg-red-500\' }" />'),
      inTemplate('<div :class="classes" title="bg-red-500" />'),
      inTemplate('<div :class="status === \'bg-red-500\' ? \'flex\' : \'grid\'" />'),
      inTemplate('<div :class="getClass(\'bg-red-500\')" />'),
      inTemplate('<Item subclass="bg-red-500" />'),
      { code: '<template lang="pug">div(class="bg-[#ff0000]")</template>', filename: VIEW },
    ],
    invalid: [
      violation('<div class="flex bg-[#ff0000]" />', 'color'),
      violation('<div :class="{ \'bg-blue-500\': active, flex: true }" />', 'palette'),
      violation('<div :class="[\'p-[13px]\', active && \'bg-blue-500\']" />', 'length', 'palette'),
      violation('<div :class="active ? \'text-white\' : \'bg-blue-500\'" />', 'palette', 'palette'),
      violation('<div v-bind:class="`flex ${active ? \'bg-blue-500\' : \'\'} text-white`" />', 'palette', 'palette'),
      violation('<div :class="cn(\'p-[13px]\', { \'bg-blue-500\': active })" />', 'length', 'palette'),
      violation('<div :class="(active ? \'bg-blue-500\' : \'\') as string" />', 'palette'),
      violation('<RouterLink active-class="bg-blue-500" />', 'palette'),
      violation('<Dialog :content-class="[\'bg-blue-500\']" />', 'palette'),
      violation('<Dialog contentClass="bg-blue-500" />', 'palette'),
      { code: '<script setup lang="ts">const c = cn(\'bg-blue-500\')</script>', filename: VIEW, errors: [{ messageId: 'palette' }] },
      { code: '<script lang="tsx">const c = <div className="bg-blue-500" />;</script>', filename: VIEW, errors: [{ messageId: 'palette' }] },
    ],
  },
  'no-inline-style': {
    valid: [
      inTemplate('<div :style="{ width: `${percent}%` }" />'),
      inTemplate('<div :style="dynamicStyle" />'),
      inTemplate('<div :style="fill ? undefined : { height: measured }" />'),
      inTemplate('<div :title="{ color: \'#111\' }" />'),
    ],
    invalid: [
      violation('<div :style="{ color: \'#111\', padding: 16 }" />', 'staticStyle', 'staticStyle'),
      violation('<div :style="[base, { margin: 0 }]" />', 'staticStyle'),
      violation('<div :style="active ? { color: \'#111\' } : {}" />', 'staticStyle'),
      violation('<div style="color: #111; padding: 16px" />', 'staticStyle', 'staticStyle'),
      violation('<div style="background: url(\'a:b.png\')" />', 'staticStyle'),
    ],
  },
  'no-state-classes-in-views': {
    valid: [
      { code: '<template><button class="hover:bg-primary-hover" /></template>', filename: COMPONENT },
      inTemplate('<div class="md:flex dark:bg-card" />'),
    ],
    invalid: [
      violation('<div class="rounded-md hover:bg-muted" />', 'stateInView'),
      violation('<div :class="{ \'focus:outline-none\': true, \'group-hover:underline\': active }" />', 'stateInView', 'stateInView'),
    ],
  },
  'no-transition-all': {
    valid: [
      inTemplate('<div class="transition-colors" style="transition: opacity 120ms" />'),
      { code: '<style>.a { transition: opacity 120ms, transform 200ms ease-all; }</style>', filename: VIEW },
      { code: '<style>/* transition: all 200ms */ .a { color: red; }</style>', filename: VIEW },
      { code: '<style lang="scss">.a { --my-transition: all 1s; transition: $all; }</style>', filename: VIEW },
    ],
    invalid: [
      violation('<div :class="[\'transition-all\']" />', 'transitionAll'),
      violation('<div :style="{ transition: \'all 200ms\' }" />', 'transitionAll'),
      violation('<div style="transition: all 200ms" />', 'transitionAll'),
      { code: '<style>.a { transition: all 200ms; }</style>', filename: VIEW, errors: [{ messageId: 'transitionAll', line: 1 }] },
      { code: '<template><div /></template>\n<style scoped lang="scss">\n.a {\n  transition:all 200ms;\n}\n.b { transition-property: all; }\n.c { transition: opacity 1s, all 2s; }\n</style>', filename: VIEW, errors: [{ messageId: 'transitionAll', line: 4 }, { messageId: 'transitionAll', line: 6 }, { messageId: 'transitionAll', line: 7 }] },
    ],
  },
  'no-opacity-on-semantic-colors': {
    valid: [inTemplate('<div class="bg-primary-subtle opacity-50 w-1/2" />')],
    invalid: [
      violation('<span class="bg-primary/10" />', 'opacityModifier'),
      violation('<span :class="{ \'hover:bg-primary/90\': active }" />', 'opacityModifier'),
    ],
  },
  'no-space-utilities': {
    valid: [inTemplate('<div class="flex flex-col gap-3" />')],
    invalid: [
      violation('<div class="space-y-3" />', 'space'),
      violation('<li :class="[\'mb-3\', \'last:mb-0\']" />', 'marginReset'),
    ],
  },
  'no-disabled-by-validity': {
    valid: [
      inTemplate('<Button :disabled="isPending" />'),
      inTemplate('<Button :disabled="mutation.isPending.value" />'),
      inTemplate('<Button disabled />'),
      inTemplate('<Button :title="!isValid" />'),
    ],
    invalid: [
      violation('<Button :disabled="!isValid" />', 'disabledByValidity'),
      violation('<button v-bind:disabled="!form.isDirty || isPending" />', 'disabledByValidity'),
    ],
  },
  'no-click-on-non-interactive': {
    valid: [
      inTemplate('<button type="button" @click="go" />'),
      inTemplate('<Card @click="go" />'),
      inTemplate('<a href="/x" @click="track" />'),
      inTemplate('<div @click.stop />'),
      inTemplate('<div @keydown="go" />'),
    ],
    invalid: [
      violation('<div @click="go" class="cursor-pointer" />', 'clickOnElement'),
      violation('<span role="button" v-on:click="go" />', 'clickOnElement'),
      violation('<div @click.self="close" />', 'clickOnElement'),
      violation('<li @mousedown.prevent="go" />', 'clickOnElement'),
    ],
  },
};

for (const [rule, cases] of Object.entries(CASES)) {
  describe(`Vue: ${rule}`, () => tester.run(rule, rules[rule], cases));
}

describe('Vue über die CLI', () => {
  let project;
  const file = (name) => path.join(project, 'src', name);
  const run = (cwd, ...args) => spawnSync(process.execPath, [BIN, ...args], { cwd, encoding: 'utf8' });
  const runHook = (event) => spawnSync(process.execPath, [BIN, '--hook'], { input: JSON.stringify(event), encoding: 'utf8' });
  const git = (...args) => execFileSync('git', ['-c', 'user.email=test@example.com', '-c', 'user.name=test', ...args], { cwd: project, encoding: 'utf8' });

  const legacy = '<template>\n  <div class="space-y-2">\n    <p>alt</p>\n  </div>\n</template>\n';

  before(() => {
    project = mkdtempSync(path.join(tmpdir(), 'standby-vue-'));
    mkdirSync(path.join(project, 'src'));
    writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name: 'fixture', standbyDesignLint: {} }));
    writeFileSync(file('view.vue'), legacy);
    git('init', '-q');
    git('add', '.');
    git('commit', '-q', '-m', 'legacy');
  });

  after(() => rmSync(project, { recursive: true, force: true }));

  it('blockiert im Hook mit Exit 2 und nennt die Zeile des Edits', () => {
    const edit = '    <p class="hover:bg-muted bg-primary/10">neu</p>';
    writeFileSync(file('view.vue'), legacy.replace('    <p>alt</p>', edit));
    const result = runHook({ tool_name: 'Edit', tool_input: { file_path: file('view.vue'), old_string: 'x', new_string: edit } });
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /view\.vue:3:\d+ .*hover:bg-muted/);
    assert.match(result.stderr, /view\.vue:3:\d+ .*bg-primary\/10/);
    assert.doesNotMatch(result.stderr, /space-y-2/);
  });

  it('trifft in einem mehrzeiligen class-Attribut die Zeile der Klasse', () => {
    const edit = '      hover:bg-muted';
    writeFileSync(file('multi.vue'), `<template>\n  <div\n    class="\n      flex\n${edit}\n      space-y-2\n    "\n  />\n</template>\n`);
    const result = runHook({ tool_name: 'Edit', tool_input: { file_path: file('multi.vue'), old_string: 'x', new_string: edit } });
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /multi\.vue:5:7 /);
    assert.doesNotMatch(result.stderr, /space-y-2/);
  });

  it('meldet :class-Schlüssel auch in Dateien mit Windows-Zeilenenden an der richtigen Stelle', () => {
    writeFileSync(file('crlf.vue'), '<template>\n  <div :class="{\n    \'hover:bg-muted\': active,\n  }" />\n</template>\n'.replace(/\n/g, '\r\n'));
    const result = run(project, 'src/crlf.vue');
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stdout, /crlf\.vue:3:6 /);
  });

  it('versteht TypeScript in <script> und im Template', () => {
    writeFileSync(file('typed.vue'), '<script setup lang="ts" generic="T">\nconst pick = <U,>(x: U) => x as U;\nconst cast = <string>value;\n</script>\n<template>\n  <div :class="(a as string)" />\n</template>\n');
    writeFileSync(file('typed-tsx.vue'), '<script lang="tsx">\nexport const node = <div class="flex" />;\n</script>\n');
    const result = run(project, 'src/typed.vue', 'src/typed-tsx.vue');
    assert.equal(result.status, 0, result.stdout + result.stderr);
  });

  it('zählt den Ordner mit und meldet Script-Teile mit der Zeile der .vue-Datei', () => {
    writeFileSync(file('script.vue'), '<template>\n  <div />\n</template>\n\n<script setup lang="ts">\nconst c = cn(\'bg-blue-500\');\n</script>\n');
    const result = run(project, 'src');
    assert.match(result.stdout, /script\.vue:6:\d+ /);
  });

  it('prüft in --staged und --since nur die neuen Zeilen einer .vue-Datei', () => {
    writeFileSync(file('view.vue'), legacy.replace('    <p>alt</p>', '    <p class="bg-primary/10">neu</p>'));
    git('add', 'src/view.vue');
    const staged = run(project, '--staged');
    assert.equal(staged.status, 1, staged.stderr);
    assert.match(staged.stdout, /bg-primary\/10/);
    assert.doesNotMatch(staged.stdout, /space-y-2/);
    assert.equal(run(project, '--staged', '--warn').status, 0);

    git('commit', '-q', '-m', 'neu');
    const since = run(project, '--since', 'HEAD~1');
    assert.equal(since.status, 1, since.stderr);
    assert.match(since.stdout, /bg-primary\/10/);
    assert.doesNotMatch(since.stdout, /space-y-2/);
  });

  it('lässt bestehende Verstöße in --since durch', () => {
    writeFileSync(file('view.vue'), legacy);
    git('add', 'src/view.vue');
    git('commit', '-q', '-m', 'zurück');
    writeFileSync(file('view.vue'), legacy.replace('<p>alt</p>', '<p class="flex">alt</p>'));
    git('add', 'src/view.vue');
    git('commit', '-q', '-m', 'sauber');
    const since = run(project, '--since', 'HEAD~1');
    assert.equal(since.status, 0, since.stdout);
  });

  describe('Ausnahme-Kommentare', () => {
    const lint = (name, content) => {
      writeFileSync(file(name), content);
      return run(project, `src/${name}`);
    };

    it('eslint-disable-next-line gilt für die nächste Zeile', () => {
      const result = lint('next.vue', '<template>\n  <!-- eslint-disable-next-line standby/no-raw-values -- Logo-Farbe -->\n  <div class="bg-[#ff0000]" />\n  <div class="bg-[#00ff00]" />\n</template>\n');
      assert.equal(result.status, 1);
      assert.doesNotMatch(result.stdout, /#ff0000/);
      assert.match(result.stdout, /#00ff00/);
    });

    it('eslint-disable und eslint-enable klammern ein mehrzeiliges Attribut ein', () => {
      const result = lint('block.vue', '<template>\n  <!-- eslint-disable standby/no-raw-values -- Grund -->\n  <div class="\n    bg-[#ff0000]\n  " />\n  <!-- eslint-enable standby/no-raw-values -->\n  <div class="bg-[#00ff00]" />\n</template>\n');
      assert.doesNotMatch(result.stdout, /#ff0000/);
      assert.match(result.stdout, /#00ff00/);
    });

    it('meldet einen Kommentar, der nichts unterdrückt', () => {
      const result = lint('unused.vue', '<template>\n  <!-- eslint-disable-next-line standby/no-raw-values -- Grund -->\n  <div class="bg-card" />\n</template>\n');
      assert.equal(result.status, 1);
      assert.match(result.stdout, /unused\.vue:2:3 .*Unused eslint-disable directive/);
    });

    it('lässt Kommentare fremder Regeln in Ruhe', () => {
      const result = lint('foreign.vue', '<template>\n  <!-- eslint-disable-next-line vue/no-v-html -- statischer Text -->\n  <div v-html="x" />\n  <!-- eslint-disable-next-line vue/no-v-html — mit Gedankenstrich -->\n  <div class="bg-[#ff0000]" />\n</template>\n');
      assert.equal(result.status, 1);
      assert.match(result.stdout, /#ff0000/);
      assert.doesNotMatch(result.stdout, /Unused/);
    });

    it('zählt Kommentare zu Regeln fremder Plugins in Skripten nicht als Verstoß', () => {
      const vue = lint('foreign-script.vue', '<script setup lang="ts">\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nconst a: any = 1;\n</script>\n');
      assert.equal(vue.status, 0, vue.stdout);
      const ts = lint('foreign.ts', '// eslint-disable-next-line @typescript-eslint/no-explicit-any\nexport const a: any = 1;\n');
      assert.equal(ts.status, 0, ts.stdout);
    });

    it('wirkt auch in <style> und in <script>', () => {
      const result = lint('style.vue', '<script setup lang="ts">\n// eslint-disable-next-line standby/no-raw-values -- Grund\nconst c = cn(\'bg-blue-500\');\n</script>\n<style>\n/* eslint-disable-next-line standby/no-transition-all -- Grund */\n.a { transition: all 1s; }\n</style>\n');
      assert.equal(result.status, 0, result.stdout);
    });
  });

  it('ignoriert ein Projekt ohne .vue-Dateien', () => {
    const empty = mkdtempSync(path.join(tmpdir(), 'standby-novue-'));
    try {
      mkdirSync(path.join(empty, 'src'));
      writeFileSync(path.join(empty, 'package.json'), '{"name":"fixture"}');
      writeFileSync(path.join(empty, 'src', 'a.ts'), 'export const a = 1;\n');
      assert.equal(run(empty, 'src').status, 0);
    } finally {
      rmSync(empty, { recursive: true, force: true });
    }
  });
});
