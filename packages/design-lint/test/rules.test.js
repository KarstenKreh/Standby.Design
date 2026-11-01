import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import { rules } from '../src/index.js';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const VIEW = 'src/pages/settings.tsx';
const COMPONENT = 'src/components/ui/button.tsx';

describe('no-raw-values', () => {
  tester.run('no-raw-values', rules['no-raw-values'], {
    valid: [
      '<div className="bg-card text-muted-foreground p-4 rounded-lg" />',
      '<div className="w-[var(--sidebar-width)] grid-cols-[1fr_auto]" />',
      '<div className="text-sm/6 w-1/2 font-heading" />',
      { code: '<div className="bg-blue-500" />', options: [{ allowedColors: ['blue-500'] }] },
      'const x = { label: "#fff" }',
    ],
    invalid: [
      { code: '<div className="bg-[#ff0000]" />', errors: [{ messageId: 'color' }] },
      { code: '<div className="text-[rgba(0,0,0,0.5)]" />', errors: [{ messageId: 'color' }] },
      { code: '<div className={cn("p-[13px]", active && "mt-2")} />', errors: [{ messageId: 'length' }] },
      { code: '<h1 className="text-[1.75rem]" />', errors: [{ messageId: 'length' }] },
      { code: `<p className="font-['Inter']" />`, errors: [{ messageId: 'fontFamily' }] },
      { code: '<div className={`flex ${x} bg-blue-500`} />', errors: [{ messageId: 'palette' }] },
      { code: '<span className="text-white" />', errors: [{ messageId: 'palette' }] },
      { code: 'const button = cva("rounded", { variants: { intent: { danger: "bg-red-600" } } })', errors: [{ messageId: 'palette' }] },
    ],
  });
});

describe('no-inline-style', () => {
  tester.run('no-inline-style', rules['no-inline-style'], {
    valid: [
      '<div style={{ width: `${percent}%` }} />',
      '<div style={{ height: measured }} />',
      '<div style={dynamicStyle} />',
    ],
    invalid: [
      { code: '<div style={{ color: "#111", padding: 16 }} />', errors: [{ messageId: 'staticStyle' }, { messageId: 'staticStyle' }] },
      { code: 'const s = StyleSheet.create({ a: { flex: 1 } })', errors: [{ messageId: 'styleSheet' }] },
    ],
  });
});

describe('no-state-classes-in-views', () => {
  tester.run('no-state-classes-in-views', rules['no-state-classes-in-views'], {
    valid: [
      { code: '<button className="hover:bg-primary-hover focus-visible:ring-2" />', filename: COMPONENT },
      { code: '<div className="md:flex dark:bg-card" />', filename: VIEW },
      { code: '<div className="hover:bg-muted" />', filename: 'src/design/row.tsx', options: [{ componentPaths: ['/design/'] }] },
    ],
    invalid: [
      { code: '<div className="rounded-md hover:bg-accent" />', filename: VIEW, errors: [{ messageId: 'stateInView' }] },
      { code: '<a className="group-hover:underline focus:outline-none" />', filename: VIEW, errors: [{ messageId: 'stateInView' }, { messageId: 'stateInView' }] },
    ],
  });
});

describe('no-transition-all', () => {
  tester.run('no-transition-all', rules['no-transition-all'], {
    valid: ['<div className="transition-colors duration-fast" />', 'const s = { transition: "opacity 120ms" }'],
    invalid: [
      { code: '<div className="transition-all" />', errors: [{ messageId: 'transitionAll' }] },
      { code: '<div className="motion-safe:transition-all" />', errors: [{ messageId: 'transitionAll' }] },
      { code: 'const s = { transition: "all 200ms ease" }', errors: [{ messageId: 'transitionAll' }] },
    ],
  });
});

describe('no-opacity-on-semantic-colors', () => {
  tester.run('no-opacity-on-semantic-colors', rules['no-opacity-on-semantic-colors'], {
    valid: [
      '<div className="bg-primary-subtle opacity-50 w-1/2 text-sm/6 inset-1/2 translate-x-1/2" />',
      '<div className="hover:bg-primary-hover" />',
    ],
    invalid: [
      { code: '<span className="bg-danger/10 text-danger" />', errors: [{ messageId: 'opacityModifier' }] },
      { code: '<button className="hover:bg-primary/90" />', errors: [{ messageId: 'opacityModifier' }] },
      { code: '<div className="border-border/50 ring-ring/[0.3]" />', errors: [{ messageId: 'opacityModifier' }, { messageId: 'opacityModifier' }] },
    ],
  });
});

describe('no-space-utilities', () => {
  tester.run('no-space-utilities', rules['no-space-utilities'], {
    valid: ['<div className="flex flex-col gap-3" />', '<div className="mx-auto m-0" />'],
    invalid: [
      { code: '<div className="space-y-3" />', errors: [{ messageId: 'space' }] },
      { code: '<div className="md:space-x-2" />', errors: [{ messageId: 'space' }] },
      { code: '<li className="mb-3 last:mb-0" />', errors: [{ messageId: 'marginReset' }] },
    ],
  });
});

describe('no-disabled-by-validity', () => {
  tester.run('no-disabled-by-validity', rules['no-disabled-by-validity'], {
    valid: [
      '<Button disabled={isPending} />',
      '<Button disabled={mutation.isPending} />',
      '<Button disabled={isSubmitting || isLoading} />',
      '<Button disabled />',
    ],
    invalid: [
      { code: '<Button disabled={!isValid} />', errors: [{ messageId: 'disabledByValidity' }] },
      { code: '<Button disabled={!form.formState.isDirty} />', errors: [{ messageId: 'disabledByValidity' }] },
      { code: '<button disabled={!accepted || isPending} />', errors: [{ messageId: 'disabledByValidity' }] },
    ],
  });
});

describe('no-click-on-non-interactive', () => {
  tester.run('no-click-on-non-interactive', rules['no-click-on-non-interactive'], {
    valid: ['<button type="button" onClick={go} />', '<Card onClick={go} />', '<a href="/x" onClick={track} />'],
    invalid: [
      { code: '<div onClick={go} className="cursor-pointer" />', errors: [{ messageId: 'clickOnElement' }] },
      { code: '<span role="button" onClick={go} />', errors: [{ messageId: 'clickOnElement' }] },
    ],
  });
});
