import { VUE_CLASS_ATTRIBUTE } from './class-strings.js';
import noRawValues from './rules/no-raw-values.js';
import noInlineStyle from './rules/no-inline-style.js';
import noStateClassesInViews from './rules/no-state-classes-in-views.js';
import noTransitionAll from './rules/no-transition-all.js';
import noOpacityOnSemanticColors from './rules/no-opacity-on-semantic-colors.js';
import noSpaceUtilities from './rules/no-space-utilities.js';

export const MARKUP_FILE = /\.astro$/;

const MARKUP_RULES = {
  'no-raw-values': noRawValues,
  'no-inline-style': noInlineStyle,
  'no-state-classes-in-views': noStateClassesInViews,
  'no-transition-all': noTransitionAll,
  'no-opacity-on-semantic-colors': noOpacityOnSemanticColors,
  'no-space-utilities': noSpaceUtilities,
};
const STYLE_SELECTOR = 'VAttribute[directive=false][key.name="style"]';
const FRONTMATTER = /^﻿?\s*---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/;
const TAG_NAME = /[A-Za-z][\w.:-]*/y;
const ATTRIBUTE_NAME = /[^\s=>/{"'`]+/y;
const WHITESPACE = /\s*/y;
const RAW_TEXT_TAG = /^(?:script|style)$/i;
const CLASS_LIST = 'class:list';
const BIOME_IGNORE = /biome-ignore\s+lint\/plugin/;
const ESLINT_DISABLE = /eslint-disable-next-line/;

function stringEnd(text, start) {
  const quote = text[start];
  let i = start + 1;
  while (i < text.length && text[i] !== quote) i += text[i] === '\\' ? 2 : 1;
  return Math.min(i + 1, text.length);
}

function scanTemplate(text, start, literals) {
  let i = start + 1;
  let chunk = i;
  while (i < text.length) {
    if (text[i] === '\\') {
      i += 2;
    } else if (text[i] === '`') {
      literals?.push([chunk, i]);
      return i + 1;
    } else if (text[i] === '$' && text[i + 1] === '{') {
      literals?.push([chunk, i]);
      i = scanExpression(text, i + 1, literals);
      chunk = i;
    } else {
      i++;
    }
  }
  return text.length;
}

function scanExpression(text, start, literals) {
  let depth = 0;
  let i = start;
  while (i < text.length) {
    const char = text[i];
    if (char === '{') {
      depth++;
      i++;
    } else if (char === '}') {
      depth--;
      i++;
      if (depth === 0) return i;
    } else if (char === '"' || char === "'") {
      const end = stringEnd(text, i);
      literals?.push([i + 1, end - 1]);
      i = end;
    } else if (char === '`') {
      i = scanTemplate(text, i, literals);
    } else if (char === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end === -1 ? text.length : end + 2;
    } else {
      i++;
    }
  }
  return text.length;
}

function skipWhitespace(text, index) {
  WHITESPACE.lastIndex = index;
  WHITESPACE.exec(text);
  return WHITESPACE.lastIndex;
}

function readValue(text, start, name, tagStart, attributes) {
  const opener = text[start];
  if (opener === '"' || opener === "'") {
    const close = text.indexOf(opener, start + 1);
    const end = close === -1 ? text.length : close;
    attributes.push({ name, tagStart, literals: [[start + 1, end]], dynamic: false });
    return Math.min(end + 1, text.length);
  }
  if (opener === '{' || opener === '`') {
    const literals = [];
    const end = opener === '{' ? scanExpression(text, start, literals) : scanTemplate(text, start, literals);
    attributes.push({ name, tagStart, literals, dynamic: true });
    return end;
  }
  let i = start;
  while (i < text.length && !/[\s>]/.test(text[i])) i++;
  return i;
}

function readAttributes(text, start, tagStart, attributes) {
  let i = start;
  while (i < text.length) {
    i = skipWhitespace(text, i);
    const char = text[i];
    if (char === '>') return { end: i + 1, selfClosing: text[i - 1] === '/' };
    if (char === '<' || char === undefined) return { end: i, selfClosing: true };
    if (char === '{') {
      i = scanExpression(text, i, null);
      continue;
    }
    ATTRIBUTE_NAME.lastIndex = i;
    const name = ATTRIBUTE_NAME.exec(text)?.[0];
    if (!name) {
      i++;
      continue;
    }
    i = skipWhitespace(text, ATTRIBUTE_NAME.lastIndex);
    if (text[i] === '=') i = readValue(text, skipWhitespace(text, i + 1), name, tagStart, attributes);
  }
  return { end: text.length, selfClosing: true };
}

function closingTag(text, tag, from) {
  const close = new RegExp(`</${tag}\\s*>`, 'gi');
  close.lastIndex = from;
  return close.exec(text)?.index ?? text.length;
}

export function markupAttributes(text) {
  const attributes = [];
  let i = FRONTMATTER.exec(text)?.[0].length ?? 0;
  while ((i = text.indexOf('<', i)) !== -1) {
    if (text.startsWith('<!--', i)) {
      const end = text.indexOf('-->', i + 4);
      i = end === -1 ? text.length : end + 3;
      continue;
    }
    TAG_NAME.lastIndex = i + 1;
    const tag = TAG_NAME.exec(text)?.[0];
    if (!tag) {
      i++;
      continue;
    }
    const { end, selfClosing } = readAttributes(text, TAG_NAME.lastIndex, i, attributes);
    i = RAW_TEXT_TAG.test(tag) && !selfClosing ? closingTag(text, tag, end) : end;
  }
  return attributes;
}

function lineStarts(text) {
  const starts = [0];
  for (let i = text.indexOf('\n'); i !== -1; i = text.indexOf('\n', i + 1)) starts.push(i + 1);
  return starts;
}

function locator(text) {
  const starts = lineStarts(text);
  return (index) => {
    let low = 0;
    let high = starts.length - 1;
    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      if (starts[middle] <= index) low = middle;
      else high = middle - 1;
    }
    return { line: low + 1, column: index - starts[low] };
  };
}

function ruleOptions(name, { componentPaths, allowedColors }) {
  if (name === 'no-raw-values' && allowedColors) return [{ allowedColors }];
  if (name === 'no-state-classes-in-views' && componentPaths?.length) return [{ componentPaths }];
  return [];
}

function fill(template, data = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key]);
}

function createVisitors(text, filename, settings, report) {
  const getLocFromIndex = locator(text);
  const sourceCode = { text, getLocFromIndex, getAncestors: () => [], parserServices: { defineTemplateBodyVisitor: (template) => template } };
  return Object.entries(MARKUP_RULES).map(([name, rule]) => rule.create({
    options: ruleOptions(name, settings),
    filename,
    sourceCode,
    report({ node, loc, messageId, data }) {
      const start = loc?.start ?? getLocFromIndex(node.range[0]);
      report({ ruleId: `standby/${name}`, line: start.line, column: start.column + 1, message: fill(rule.meta.messages[messageId], data) });
    },
  }));
}

function fakeAttribute(name, [start, end], text) {
  return { directive: false, key: { name, rawName: name }, value: { type: 'VLiteral', value: text.slice(start, end), range: [start, end] } };
}

function isClassAttribute(name) {
  return name === CLASS_LIST || VUE_CLASS_ATTRIBUTE.test(name);
}

function previousLine(lines, line) {
  for (let i = line - 2; i >= 0; i--) {
    if (lines[i].trim()) return lines[i];
  }
  return '';
}

function suppresses(comment, ruleId) {
  if (BIOME_IGNORE.test(comment)) return true;
  if (!ESLINT_DISABLE.test(comment)) return false;
  return !comment.includes('standby/') || comment.includes(ruleId);
}

export function lintMarkup(text, filename, settings = {}) {
  const messages = [];
  const lines = text.split('\n');
  const lineOf = locator(text);
  let tagLine = 1;
  const visitors = createVisitors(text, filename, settings, (message) => {
    const comments = [previousLine(lines, message.line), previousLine(lines, tagLine)];
    if (!comments.some((comment) => suppresses(comment, message.ruleId))) messages.push(message);
  });
  for (const { name, tagStart, literals, dynamic } of markupAttributes(text)) {
    tagLine = lineOf(tagStart).line;
    const style = name === 'style' && !dynamic;
    if (!style && !isClassAttribute(name)) continue;
    for (const range of literals) {
      const attribute = fakeAttribute(style ? 'style' : 'class', range, text);
      for (const visitor of visitors) {
        visitor.VAttribute?.(attribute);
        if (style) visitor[STYLE_SELECTOR]?.(attribute);
      }
    }
  }
  return messages.sort((a, b) => a.line - b.line || a.column - b.column);
}
