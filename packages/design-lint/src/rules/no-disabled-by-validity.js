import { withRule } from '../rule-docs.js';

const VALIDITY_NAME = /valid|dirty|accept|agree|consent|complete|filled|empty|ready|canSubmit|canSave|hasChanges|touched/i;
const PENDING_NAME = /pending|submitting|loading|saving|busy|fetching|mutating/i;
const CHILD_KEYS = ['argument', 'left', 'right', 'test', 'consequent', 'alternate', 'expression', 'callee', 'object'];

function collectNames(node, names) {
  if (!node || typeof node !== 'object') return names;
  if (node.type === 'Identifier') {
    names.push(node.name);
    return names;
  }
  if (node.type === 'MemberExpression' && !node.computed) collectNames(node.property, names);
  for (const key of CHILD_KEYS) collectNames(node[key], names);
  if (Array.isArray(node.arguments)) node.arguments.forEach((arg) => collectNames(arg, names));
  return names;
}

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Ein Button wird nicht wegen fehlender Eingaben gesperrt, nur während einer Anfrage.' },
    schema: [],
    messages: {
      disabledByValidity: withRule('neverDisabled', 'disabled hängt an „{{name}}“. Ein Button wird nicht gesperrt, weil etwas fehlt. Fix: aktiv lassen und beim Klick am Feld zeigen, was fehlt. Gesperrt nur, solange die Anfrage läuft (z. B. disabled={isPending}).'),
    },
  },
  create(context) {
    return {
      'JSXAttribute[name.name="disabled"] > JSXExpressionContainer'(container) {
        const names = collectNames(container.expression, []);
        const validity = names.find((name) => VALIDITY_NAME.test(name) && !PENDING_NAME.test(name));
        if (validity) context.report({ node: container, messageId: 'disabledByValidity', data: { name: validity } });
      },
    };
  },
};
