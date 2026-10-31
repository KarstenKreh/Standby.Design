import tsParser from '@typescript-eslint/parser';
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

const plugin = { meta: { name: 'standby-design-lint', version: '0.1.0' }, rules };

export const SOURCE_FILES = ['**/*.jsx', '**/*.tsx', '**/*.js', '**/*.ts', '**/*.mjs'];

export function recommended({ componentPaths, allowedColors, files = SOURCE_FILES } = {}) {
  return {
    name: 'standby/recommended',
    files,
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { standby: plugin },
    rules: {
      'standby/no-raw-values': ['error', allowedColors ? { allowedColors } : {}],
      'standby/no-inline-style': 'error',
      'standby/no-state-classes-in-views': ['error', componentPaths ? { componentPaths } : {}],
      'standby/no-transition-all': 'error',
      'standby/no-opacity-on-semantic-colors': 'error',
      'standby/no-space-utilities': 'error',
      'standby/no-disabled-by-validity': 'error',
      'standby/no-click-on-non-interactive': 'error',
    },
  };
}

plugin.configs = { recommended: recommended() };

export default plugin;
