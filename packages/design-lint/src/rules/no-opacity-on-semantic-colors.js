import { createClassVisitor } from '../class-strings.js';
import { parseColorUtility } from '../tailwind.js';
import { withRule } from '../rule-docs.js';

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Keine Deckkraft-Modifier auf Farben. Abstufungen und Zustände haben benannte Stufen.' },
    schema: [],
    messages: {
      opacityModifier: withRule('opacityModifiers', '„{{token}}“ erfindet mit „/{{alpha}}“ eine neue Farbe. Fix: die benannte Stufe nehmen (z. B. bg-primary-subtle, hover:bg-primary-hover). Soll ein ganzes Element ausblenden, opacity-* nutzen.'),
    },
  },
  create(context) {
    return createClassVisitor(context, ({ node, token, utility }) => {
      const color = parseColorUtility(utility);
      if (color?.alpha && !color.arbitrary) {
        context.report({ node, messageId: 'opacityModifier', data: { token, alpha: color.alpha } });
      }
    });
  },
};
