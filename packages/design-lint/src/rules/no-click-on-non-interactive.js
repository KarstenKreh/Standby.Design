import { withRule } from '../rule-docs.js';

const NON_INTERACTIVE = new Set(['div', 'span', 'li', 'p', 'section', 'article', 'img', 'td', 'tr', 'View', 'Text']);
const CLICK_HANDLERS = new Set(['onClick', 'onMouseDown', 'onMouseUp', 'onPointerDown', 'onPointerUp']);

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Klickbares ist ein Button oder Link, kein div mit onClick.' },
    schema: [],
    messages: {
      clickOnElement: withRule('nameAndState', '<{{element}}> mit {{handler}} ist für Tastatur und Screenreader kein Bedienelement. Fix: <button type="button"> oder einen Link nehmen, am besten die Button-Komponente des Projekts.'),
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier' || !NON_INTERACTIVE.has(node.name.name)) return;
        const handler = node.attributes.find((attr) => attr.type === 'JSXAttribute' && CLICK_HANDLERS.has(attr.name.name));
        if (handler) {
          context.report({ node: handler, messageId: 'clickOnElement', data: { element: node.name.name, handler: handler.name.name } });
        }
      },
    };
  },
};
