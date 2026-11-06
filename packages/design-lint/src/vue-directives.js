const DIRECTIVE = /(?:<!--|\/\*)\s*eslint-(disable-next-line|disable|enable)\b([\s\S]*?)(?:-->|\*\/)/g;
const SCRIPT_BLOCK = /<script\b[\s\S]*?<\/script>/g;
const OWN_RULE_PREFIX = 'standby/';

function blankOut(match) {
  return match.replace(/[^\n]/g, ' ');
}

function positionAt(text, index) {
  const before = text.slice(0, index);
  const line = before.split('\n').length;
  return { line, column: index - before.lastIndexOf('\n') };
}

function namedRules(body) {
  const [list] = body.split(/\s--\s/);
  return list.split(',').map((piece) => piece.trim().split(/\s+/)[0]).filter(Boolean);
}

export function parseDirectives(text) {
  const directives = [];
  for (const match of text.replace(SCRIPT_BLOCK, blankOut).matchAll(DIRECTIVE)) {
    const named = namedRules(match[2]);
    const rules = named.filter((rule) => rule.startsWith(OWN_RULE_PREFIX));
    if (named.length && !rules.length) continue;
    directives.push({
      kind: match[1],
      rules,
      used: new Set(),
      ...positionAt(text, match.index),
      endLine: positionAt(text, match.index + match[0].length).line,
    });
  }
  return directives;
}

function covers(directive, ruleId) {
  return directive.rules.length === 0 || directive.rules.includes(ruleId);
}

function suppressingDirective(message, directives) {
  let block = null;
  let nextLine = null;
  for (const directive of directives) {
    if (directive.line > message.line || !covers(directive, message.ruleId)) continue;
    if (directive.kind === 'disable') block = directive;
    if (directive.kind === 'enable') block = null;
    if (directive.kind === 'disable-next-line' && directive.endLine + 1 === message.line) nextLine = directive;
  }
  return nextLine ?? block;
}

function unusedMessage(directive, rules) {
  const names = rules.map((rule) => `'${rule}'`).join(', ');
  return {
    ruleId: null,
    severity: 1,
    message: `Unused eslint-disable directive (no problems were reported from ${names}).`,
    line: directive.line,
    column: directive.column,
  };
}

export function applyDirectives(messages, directives) {
  const kept = messages.filter((message) => {
    if (!message.ruleId?.startsWith(OWN_RULE_PREFIX)) return true;
    const directive = suppressingDirective(message, directives);
    directive?.used.add(message.ruleId);
    return !directive;
  });
  for (const directive of directives) {
    if (directive.kind === 'enable') continue;
    const unused = directive.rules.filter((rule) => !directive.used.has(rule));
    if (unused.length) kept.push(unusedMessage(directive, unused));
  }
  return kept;
}

export function createVueDirectives(version) {
  const pending = new Map();
  return {
    meta: { name: 'standby-vue-directives', version },
    preprocess(text, filename) {
      pending.set(filename, parseDirectives(text));
      return [text];
    },
    postprocess(messageLists, filename) {
      const directives = pending.get(filename) ?? [];
      pending.delete(filename);
      return applyDirectives(messageLists.flat(), directives);
    },
    supportsAutofix: true,
  };
}
