import { boundAttribute, locationOf, unwrapExpression, withTemplate } from './vue.js';

export const CLASS_ATTRIBUTE = /^(?:className|class|tw|[A-Za-z]+ClassName)$/;
export const VUE_CLASS_ATTRIBUTE = /^(?:class|tw|className|class-name|[A-Za-z-]+(?:-class|Class|-class-name|ClassName))$/;
export const WEB_ONLY_VARIANT = 'web';
export const CLASS_HELPERS = new Set(['cn', 'clsx', 'classnames', 'classNames', 'cva', 'cx', 'twMerge', 'twJoin', 'tv']);

function calleeName(callee) {
  if (callee.type === 'Identifier') return callee.name;
  if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') return callee.property.name;
  return null;
}

function isClassContext(ancestors) {
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const node = ancestors[i];
    if (node.type === 'JSXAttribute') {
      return node.name.type === 'JSXIdentifier' && CLASS_ATTRIBUTE.test(node.name.name);
    }
    if (node.type === 'CallExpression' && CLASS_HELPERS.has(calleeName(node.callee))) return true;
    if (node.type === 'TaggedTemplateExpression' && calleeName(node.tag) === 'tw') return true;
  }
  return false;
}

function isPropertyKey(node, parent) {
  return parent?.type === 'Property' && parent.key === node && !parent.computed;
}

export function splitClasses(text) {
  return text.split(/\s+/).filter(Boolean);
}

export function splitVariants(token) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of token) {
    if (char === '[' || char === '(') depth++;
    if (char === ']' || char === ')') depth--;
    if (char === ':' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  parts.push(current);
  const utility = parts.pop().replace(/^!|!$/g, '');
  return { variants: parts, utility };
}

function tokenLocator(sourceCode, node) {
  const [rangeStart, rangeEnd] = node.range;
  const source = sourceCode.text.slice(rangeStart, rangeEnd);
  let cursor = 0;
  return (token) => {
    const index = source.indexOf(token, cursor);
    if (index === -1) return undefined;
    cursor = index + token.length;
    return locationOf(sourceCode, rangeStart + index, token.length);
  };
}

function walkTemplateLiteral(node, emit) {
  for (const quasi of node.quasis) emit(quasi, quasi.value.cooked ?? quasi.value.raw);
  for (const expression of node.expressions) walkVueClassExpression(expression, emit);
}

function walkObjectKeys(node, emit) {
  for (const property of node.properties) {
    if (property.type !== 'Property') continue;
    if (property.computed) walkVueClassExpression(property.key, emit);
    else if (property.key.type === 'Identifier') emit(property.key, property.key.name);
    else if (typeof property.key.value === 'string') emit(property.key, property.key.value);
  }
}

export function walkVueClassExpression(expression, emit) {
  const node = unwrapExpression(expression);
  if (!node) return;
  if (node.type === 'Literal') {
    if (typeof node.value === 'string') emit(node, node.value);
  } else if (node.type === 'TemplateLiteral') {
    walkTemplateLiteral(node, emit);
  } else if (node.type === 'ObjectExpression') {
    walkObjectKeys(node, emit);
  } else if (node.type === 'ArrayExpression') {
    node.elements.forEach((element) => walkVueClassExpression(element, emit));
  } else if (node.type === 'SpreadElement') {
    walkVueClassExpression(node.argument, emit);
  } else if (node.type === 'ConditionalExpression') {
    walkVueClassExpression(node.consequent, emit);
    walkVueClassExpression(node.alternate, emit);
  } else if (node.type === 'LogicalExpression' || (node.type === 'BinaryExpression' && node.operator === '+')) {
    walkVueClassExpression(node.left, emit);
    walkVueClassExpression(node.right, emit);
  } else if (node.type === 'CallExpression' && CLASS_HELPERS.has(calleeName(node.callee))) {
    node.arguments.forEach((argument) => walkVueClassExpression(argument, emit));
  }
}

export function createClassVisitor(context, onToken, { script = {}, template = {} } = {}) {
  const { sourceCode } = context;
  const emit = (node, text) => {
    const locate = tokenLocator(sourceCode, node);
    for (const token of splitClasses(text)) {
      const loc = locate(token);
      const parts = splitVariants(token);
      if (!parts.variants.includes(WEB_ONLY_VARIANT)) onToken({ node, loc, token, ...parts });
    }
  };
  const visit = (node, text) => {
    const ancestors = sourceCode.getAncestors(node);
    if (isPropertyKey(node, ancestors[ancestors.length - 1])) return;
    if (isClassContext(ancestors)) emit(node, text);
  };
  return withTemplate(context, {
    Literal(node) {
      if (typeof node.value === 'string') visit(node, node.value);
    },
    TemplateElement(node) {
      visit(node, node.value.cooked ?? node.value.raw);
    },
    ...script,
  }, {
    VAttribute(attribute) {
      const bound = boundAttribute(attribute);
      if (!bound || !VUE_CLASS_ATTRIBUTE.test(bound.name)) return;
      if (bound.expression) walkVueClassExpression(bound.expression, emit);
      else if (bound.literal) emit(bound.literal, bound.literal.value);
    },
    ...template,
  });
}
