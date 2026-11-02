export const CLASS_ATTRIBUTE = /^(?:className|class|tw|[A-Za-z]+ClassName)$/;
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

export function createClassVisitor(context, onToken) {
  const { sourceCode } = context;
  const visit = (node, text) => {
    const ancestors = sourceCode.getAncestors(node);
    if (isPropertyKey(node, ancestors[ancestors.length - 1])) return;
    if (!isClassContext(ancestors)) return;
    for (const token of splitClasses(text)) {
      const parts = splitVariants(token);
      if (!parts.variants.includes(WEB_ONLY_VARIANT)) onToken({ node, token, ...parts });
    }
  };
  return {
    Literal(node) {
      if (typeof node.value === 'string') visit(node, node.value);
    },
    TemplateElement(node) {
      visit(node, node.value.cooked ?? node.value.raw);
    },
  };
}
