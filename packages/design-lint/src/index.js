import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import tsParser from '@typescript-eslint/parser';
import { createVueDirectives } from './vue-directives.js';
import noRawValues from './rules/no-raw-values.js';
import noInlineStyle from './rules/no-inline-style.js';
import noStateClassesInViews from './rules/no-state-classes-in-views.js';
import noTransitionAll from './rules/no-transition-all.js';
import noOpacityOnSemanticColors from './rules/no-opacity-on-semantic-colors.js';
import noSpaceUtilities from './rules/no-space-utilities.js';
import noDisabledByValidity from './rules/no-disabled-by-validity.js';
import noClickOnNonInteractive from './rules/no-click-on-non-interactive.js';

export const rules = {
  'no-raw-values': noRawValues,
  'no-inline-style': noInlineStyle,
  'no-state-classes-in-views': noStateClassesInViews,
  'no-transition-all': noTransitionAll,
  'no-opacity-on-semantic-colors': noOpacityOnSemanticColors,
  'no-space-utilities': noSpaceUtilities,
  'no-disabled-by-validity': noDisabledByValidity,
  'no-click-on-non-interactive': noClickOnNonInteractive,
};

const require = createRequire(import.meta.url);
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const plugin ={ meta: { name: 'standby-design-lint', version }, rules };

export const SOURCE_FILES = ['**/*.jsx', '**/*.tsx', '**/*.js', '**/*.ts', '**/*.mjs'];
export const VUE_FILES = ['**/*.vue'];
export const vueDirectives = createVueDirectives(version);

const jsxParser = {
  parseForESLint(code, options) {
    return tsParser.parseForESLint(code, { ...options, ecmaFeatures: { ...options?.ecmaFeatures, jsx: true } });
  },
};
const VUE_SCRIPT_PARSERS = { js: tsParser, ts: tsParser, jsx: jsxParser, tsx: jsxParser, '<template>': tsParser };

function ruleSettings({ componentPaths, allowedColors }) {
  return {
    'standby/no-raw-values': ['error', allowedColors ? { allowedColors } : {}],
    'standby/no-inline-style': 'error',
    'standby/no-state-classes-in-views': ['error', componentPaths ? { componentPaths } : {}],
    'standby/no-transition-all': 'error',
    'standby/no-opacity-on-semantic-colors': 'error',
    'standby/no-space-utilities': 'error',
    'standby/no-disabled-by-validity': 'error',
    'standby/no-click-on-non-interactive': 'error',
  };
}

export function recommended({ componentPaths, allowedColors, files = SOURCE_FILES } = {}) {
  return {
    name: 'standby/recommended',
    files,
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { standby: plugin },
    rules: ruleSettings({ componentPaths, allowedColors }),
  };
}

export function vueParserInstalled() {
  try {
    require.resolve('vue-eslint-parser');
    return true;
  } catch {
    return false;
  }
}

export function recommendedVue({ componentPaths, allowedColors, files = VUE_FILES } = {}) {
  return {
    name: 'standby/recommended-vue',
    files,
    languageOptions: {
      parser: require('vue-eslint-parser'),
      parserOptions: { parser: VUE_SCRIPT_PARSERS, ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { standby: plugin },
    rules: ruleSettings({ componentPaths, allowedColors }),
  };
}

plugin.configs = { recommended: recommended() };

export default plugin;
