import { withRule } from '../rule-docs.js';
import { boundAttribute, locationOf, unwrapExpression, withTemplate } from '../vue.js';

const CSS_DECLARATION = /([-\w]+)\s*:\s*(?:[^;"']|"[^"]*"|'[^']*')+/g;

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
    const { sourceCode } = context;
    const checkProperty = (property) => {
      if (isStaticValue(property.value)) {
        context.report({ node: property, messageId: 'staticStyle', data: { name: propertyName(property) } });
      }
    };
    const checkVueExpression = (expression) => {
      const node = unwrapExpression(expression);
      if (node?.type === 'ObjectExpression') {
        node.properties.filter((property) => property.type === 'Property').forEach(checkProperty);
      } else if (node?.type === 'ArrayExpression') {
        node.elements.forEach(checkVueExpression);
      } else if (node?.type === 'ConditionalExpression') {
        checkVueExpression(node.consequent);
        checkVueExpression(node.alternate);
      } else if (node?.type === 'LogicalExpression') {
        checkVueExpression(node.left);
        checkVueExpression(node.right);
      }
    };
    const checkStaticStyle = (literal) => {
      const [start, end] = literal.range;
      for (const match of sourceCode.text.slice(start, end).matchAll(CSS_DECLARATION)) {
        const loc = locationOf(sourceCode, start + match.index, match[0].length);
        context.report({ node: literal, loc, messageId: 'staticStyle', data: { name: match[1] } });
      }
    };
    return withTemplate(context, {
      'JSXAttribute[name.name="style"] > JSXExpressionContainer > ObjectExpression > Property': checkProperty,
      'CallExpression[callee.object.name="StyleSheet"][callee.property.name="create"]'(node) {
        context.report({ node, messageId: 'styleSheet' });
      },
    }, {
      VAttribute(attribute) {
        const bound = boundAttribute(attribute);
        if (bound?.name !== 'style') return;
        if (bound.expression) checkVueExpression(bound.expression);
        else if (bound.literal) checkStaticStyle(bound.literal);
      },
    });
  },
};
