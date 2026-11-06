import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import { rules } from '../src/index.js';
import { CASES } from './cases.js';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

for (const [rule, cases] of Object.entries(CASES)) {
  describe(rule, () => tester.run(rule, rules[rule], cases));
}
