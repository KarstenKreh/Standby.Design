import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { CLASS_ATTRIBUTE, CLASS_HELPERS, WEB_ONLY_VARIANT } from '../class-strings.js';
import { COLOR_PREFIXES, DEFAULT_PALETTE, NON_COLOR_VALUES, RAW_COLOR, RAW_LENGTH } from '../tailwind.js';
import noRawValues, { FONT_FAMILY } from '../rules/no-raw-values.js';
import noInlineStyle from '../rules/no-inline-style.js';
import noStateClassesInViews, { DEFAULT_COMPONENT_PATHS, STATE_VARIANT } from '../rules/no-state-classes-in-views.js';
import noTransitionAll from '../rules/no-transition-all.js';
import noOpacityOnSemanticColors from '../rules/no-opacity-on-semantic-colors.js';
import noSpaceUtilities, { EDGE_VARIANT, MARGIN_RESET, SPACE } from '../rules/no-space-utilities.js';
import noDisabledByValidity, { PENDING_NAME, VALIDITY_NAME } from '../rules/no-disabled-by-validity.js';
import noClickOnNonInteractive, { CLICK_HANDLERS, NON_INTERACTIVE } from '../rules/no-click-on-non-interactive.js';
import { alternation, containsMatch, escapeRegex, fullMatch, gritRegex, message } from './grit.js';

export const SEVERITIES = { error: '', warn: 'warn' };

const EDGE_QUOTES = `[\\s"'\`]*`;
const BRACKETED = '\\[[^\\]]*\\]|\\([^)]*\\)';
const PART = `${EDGE_QUOTES}((?:${BRACKETED}|[^\\s"'\`\\[(])+)${EDGE_QUOTES}`;
const VARIANT = `(?:${BRACKETED}|[^:\\[(])*`;
const TOKEN = `((?:${VARIANT}:)*)!?((?:${BRACKETED}|[^:\\[(!])+)!?`;
const COLOR_PREFIX = alternation(COLOR_PREFIXES);
const PALETTE_COLOR = `(?:white|black|${alternation(DEFAULT_PALETTE)}-\\d{2,3})`;
const STATIC_VALUE = `or {
      JsStringLiteralExpression(),
      JsNumberLiteralExpression(),
      JsBooleanLiteralExpression(),
      JsNullLiteralExpression(),
      JsBigintLiteralExpression(),
      JsRegexLiteralExpression(),
      JsTemplateExpression(elements=[JsTemplateChunkElement()]),
      JsTemplateExpression(elements=[]),
      JsUnaryExpression(argument=or { JsNumberLiteralExpression(), JsStringLiteralExpression(), JsBigintLiteralExpression() })
    }`;

function bareSource(regex) {
  return regex.source.replace(/^\^/, '').replace(/\$$/, '');
}

function withVariant(regex) {
  return `(?:${VARIANT}:)*(?:${bareSource(regex)}):(?:${VARIANT}:)*`;
}

function pathPattern(paths) {
  return `(?s).*(?:${paths.map((entry) => escapeRegex(entry).replace(/\//g, '[/\\\\]')).join('|')}).*`;
}

const CLASS_CONTEXT = `within or {
    JsxAttribute(name=${gritRegex(bareSource(CLASS_ATTRIBUTE))}),
    JsCallExpression(callee=${gritRegex(`(?:.*\\.)?${alternation(CLASS_HELPERS)}`)}),
    JsTemplateExpression(tag=${gritRegex('(?:.*\\.)?tw')})
  }`;

function classRule({ hint, checks, severity, guard = '' }) {
  const branches = checks.map(({ conditions, text }) => `      and {
${[...conditions, `$message = ${text}`].map((line) => `        ${line}`).join(',\n')}
      }`);
  return `or { JsxString(), JsStringLiteralExpression(), JsTemplateChunkElement() } as $class where {
  $class <: ${gritRegex(`(?s).*(?:${hint}).*`)},
  $class <: ${CLASS_CONTEXT},${guard}
  $parts = split($class, " "),
  $parts <: some $part where {
    $part <: ${gritRegex(PART)}($token),
    $token <: ${gritRegex(TOKEN)}($variants, $utility),
    $variants <: not ${gritRegex(withVariant(new RegExp(`^${WEB_ONLY_VARIANT}$`)))},
    or {
${branches.join(',\n')}
    }
  },
  register_diagnostic(span=$class, message=$message, severity="${severity}")
}`;
}

function messages(rule) {
  return rule.meta.messages;
}

function rawValues(severity) {
  const text = messages(noRawValues);
  const arbitrary = [`$utility <: ${gritRegex('[^\\[]*\\[(.+)\\]')}($arbitrary)`, `$arbitrary <: not ${gritRegex('(?s).*var\\(.*')}`];
  return classRule({
    severity,
    hint: `\\[|white|black|${alternation(DEFAULT_PALETTE)}-\\d`,
    checks: [
      { conditions: [`$utility <: ${gritRegex(fullMatch(FONT_FAMILY))}`], text: message(text.fontFamily, { token: '$token' }) },
      { conditions: [...arbitrary, `$arbitrary <: ${gritRegex(containsMatch(RAW_COLOR))}`], text: message(text.color, { token: '$token' }) },
      { conditions: [...arbitrary, `$arbitrary <: ${gritRegex(containsMatch(RAW_LENGTH))}`], text: message(text.length, { token: '$token' }) },
      { conditions: [`$utility <: ${gritRegex(`-?${COLOR_PREFIX}-${PALETTE_COLOR}(?:/.*)?`)}`], text: message(text.palette, { token: '$token' }) },
    ],
  });
}

function opacityModifiers(severity) {
  return classRule({
    severity,
    hint: '/',
    checks: [{
      conditions: [
        `$utility <: ${gritRegex(`-?${COLOR_PREFIX}-([^/\\[(][^/]*)/(.+)`)}($value, $alpha)`,
        `$value <: not ${gritRegex('\\d.*')}`,
        `$value <: not ${gritRegex(alternation(NON_COLOR_VALUES))}`,
      ],
      text: message(messages(noOpacityOnSemanticColors).opacityModifier, { token: '$token', alpha: '$alpha' }),
    }],
  });
}

function stateClasses(severity) {
  return classRule({
    severity,
    hint: '(?:hover|focus|active|pressed)',
    guard:`\n  $filename <: not ${gritRegex(pathPattern(DEFAULT_COMPONENT_PATHS))},`,
    checks: [{
      conditions: [`$variants <: ${gritRegex(withVariant(STATE_VARIANT))}`],
      text: message(messages(noStateClassesInViews).stateInView, { token: '$token', paths: DEFAULT_COMPONENT_PATHS.join(', ') }),
    }],
  });
}

function spaceUtilities(severity) {
  const text = messages(noSpaceUtilities);
  return classRule({
    severity,
    hint: `${bareSource(SPACE)}|${bareSource(MARGIN_RESET)}`,
    checks: [
      { conditions: [`$utility <: ${gritRegex(fullMatch(SPACE))}`], text: message(text.space, { token: '$token' }) },
      {
        conditions: [`$utility <: ${gritRegex(fullMatch(MARGIN_RESET))}`, `$variants <: ${gritRegex(withVariant(EDGE_VARIANT))}`],
        text: message(text.marginReset, { token: '$token' }),
      },
    ],
  });
}

function transitionAll(severity) {
  const text = messages(noTransitionAll).transitionAll;
  const classes = classRule({
    severity,
    hint: 'transition-all',
    checks: [{ conditions: [`$utility <: ${gritRegex('transition-all')}`], text: message(text, { what: '„transition-all“' }) }],
  });
  return `or {
  ${classes.replace(/\n/g, '\n  ')},
  JsPropertyObjectMember(name=${gritRegex('transition')}, value=JsStringLiteralExpression() as $value) where {
    $value <: ${gritRegex(`["'\`]\\s*all\\b.*`)},
    register_diagnostic(span=$value, message=${message(text, { what: '„transition: all“' })}, severity="${severity}")
  }
}`;
}

function inlineStyle(severity) {
  const text = messages(noInlineStyle);
  return `or {
  JsxAttribute(name=${gritRegex('style')}, initializer=JsxAttributeInitializerClause(value=JsxExpressionAttributeValue(expression=JsObjectExpression(members=$members)))) where {
    $members <: some JsPropertyObjectMember(name=$name, value=${STATIC_VALUE}) as $property,
    $name <: ${gritRegex(`["']?(.*?)["']?`)}($key),
    register_diagnostic(span=$property, message=${message(text.staticStyle, { name: '$key' })}, severity="${severity}")
  },
  JsCallExpression(callee=${gritRegex('StyleSheet\\.create')}) as $sheet where {
    register_diagnostic(span=$sheet, message=${message(text.styleSheet, {})}, severity="${severity}")
  }
}`;
}

function disabledByValidity(severity) {
  return `JsxAttribute(name=${gritRegex('disabled')}, initializer=JsxAttributeInitializerClause(value=JsxExpressionAttributeValue() as $value)) where {
  $value <: contains or { JsReferenceIdentifier(), JsName() } as $name where {
    $name <: ${gritRegex(containsMatch(VALIDITY_NAME))},
    $name <: not ${gritRegex(containsMatch(PENDING_NAME))}
  },
  register_diagnostic(span=$value, message=${message(messages(noDisabledByValidity).disabledByValidity, { name: '$name' })}, severity="${severity}")
}`;
}

function clickOnNonInteractive(severity) {
  return `or {
  JsxOpeningElement(name=$element, attributes=$attributes),
  JsxSelfClosingElement(name=$element, attributes=$attributes)
} where {
  $element <: ${gritRegex(alternation(NON_INTERACTIVE))},
  $attributes <: some JsxAttribute(name=$handler) as $attribute where {
    $handler <: ${gritRegex(alternation(CLICK_HANDLERS))}
  },
  register_diagnostic(span=$attribute, message=${message(messages(noClickOnNonInteractive).clickOnElement, { element: '$element', handler: '$handler' })}, severity="${severity}")
}`;
}

const BUILDERS = {
  'no-raw-values': rawValues,
  'no-inline-style': inlineStyle,
  'no-state-classes-in-views': stateClasses,
  'no-transition-all': transitionAll,
  'no-opacity-on-semantic-colors': opacityModifiers,
  'no-space-utilities': spaceUtilities,
  'no-disabled-by-validity': disabledByValidity,
  'no-click-on-non-interactive': clickOnNonInteractive,
};

export const BIOME_RULES = Object.keys(BUILDERS);

export function gritSource(rule, severity) {
  return `language js\n\n${BUILDERS[rule](severity)}\n`;
}

export function biomePluginFiles() {
  return Object.entries(SEVERITIES).flatMap(([severity, folder]) =>
    BIOME_RULES.map((rule) => ({ file: path.posix.join(folder, `${rule}.grit`), source: gritSource(rule, severity) })));
}

export function staleBiomePlugins(dir) {
  return biomePluginFiles().filter(({ file, source }) => {
    try {
      return readFileSync(path.join(dir, file), 'utf8') !== source;
    } catch {
      return true;
    }
  }).map(({ file }) => file);
}

export function writeBiomePlugins(dir) {
  for (const { file, source } of biomePluginFiles()) {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    writeFileSync(path.join(dir, file), source);
  }
}
