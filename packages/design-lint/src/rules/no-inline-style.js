import { withRule } from '../rule-docs.js';

function isStaticValue(node) {
  if (node.type === 'Literal') return true;
  if (node.type === 'TemplateLiteral') return node.expressions.length === 0;
  if (node.type === 'UnaryExpression' && node.argument.type === 'Literal') return true;
  return false;
}

function propertyName(property) {
  if (property.key.type === 'Identifier') return property.key.name;
  if (property.key.type === 'Literal') return String(property.key.value);
  return '?';
}

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Gestaltung steht in Utility-Klassen. Ein Style trägt nur Werte, die zur Laufzeit berechnet werden.' },
    schema: [],
    messages: {
      staticStyle: withRule('inlineStyles', 'style setzt „{{name}}“ als festen Wert. Fix: als Utility-Klasse in className schreiben. Im Style bleiben nur berechnete Werte (z. B. eine Breite aus einem Prozentwert).'),
      styleSheet: withRule('inlineStyles', 'StyleSheet.create legt Gestaltung neben den Klassen fest. Fix: Utility-Klassen in className nutzen.'),
    },
  },
  create(context) {
    return {
      'JSXAttribute[name.name="style"] > JSXExpressionContainer > ObjectExpression > Property'(property) {
        if (isStaticValue(property.value)) {
          context.report({ node: property, messageId: 'staticStyle', data: { name: propertyName(property) } });
        }
      },
      'CallExpression[callee.object.name="StyleSheet"][callee.property.name="create"]'(node) {
        context.report({ node, messageId: 'styleSheet' });
      },
    };
  },
};
