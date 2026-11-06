export function withTemplate(context, scriptVisitor, templateVisitor) {
  const services = context.sourceCode.parserServices;
  if (!services?.defineTemplateBodyVisitor) return scriptVisitor;
  return services.defineTemplateBodyVisitor(templateVisitor, scriptVisitor);
}

export function boundAttribute(attribute) {
  const { key, value, directive } = attribute;
  if (!directive) return { name: key.rawName, literal: value };
  if (key.name.name !== 'bind' || key.argument?.type !== 'VIdentifier') return null;
  return { name: key.argument.rawName, expression: value?.expression ?? null };
}

export function eventHandler(attribute) {
  const { key, value, directive } = attribute;
  if (!directive || key.name.name !== 'on' || key.argument?.type !== 'VIdentifier') return null;
  return value?.expression ? key.argument.rawName.toLowerCase() : null;
}

export function unwrapExpression(node) {
  let current = node;
  while (current?.type === 'TSAsExpression' || current?.type === 'TSNonNullExpression' || current?.type === 'TSSatisfiesExpression') {
    current = current.expression;
  }
  return current;
}

export function locationOf(sourceCode, start, length) {
  return { start: sourceCode.getLocFromIndex(start), end: sourceCode.getLocFromIndex(start + length) };
}

export function styleBlocks(context) {
  const fragment = context.sourceCode.parserServices?.getDocumentFragment?.();
  if (!fragment) return [];
  return fragment.children
    .filter((node) => node.type === 'VElement' && node.name === 'style')
    .flatMap((element) => element.children.filter((child) => child.type === 'VText'));
}
