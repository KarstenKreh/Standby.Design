import { createClassVisitor } from '../class-strings.js';
import { withRule } from '../rule-docs.js';

const SPACE = /^-?space-[xy]-/;
const MARGIN_RESET = /^-?m[tblrsexy]?-0$/;
const EDGE_VARIANT = /^(?:first|last|only|odd|even|not-first|not-last)$/;

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Abstand zwischen Geschwistern kommt über flex und gap am Container.' },
    schema: [],
    messages: {
      space: withRule('gap', '„{{token}}“ legt den Abstand als Margin auf die Kinder. Fix: „flex flex-col gap-*“ oder „flex gap-*“ am Container.'),
      marginReset: withRule('gap', '„{{token}}“ räumt einen Margin am Rand wieder ab. Fix: Margins an den Kindern entfernen und gap am Container setzen.'),
    },
  },
  create(context) {
    return createClassVisitor(context, ({ node, token, variants, utility }) => {
      if (SPACE.test(utility)) {
        context.report({ node, messageId: 'space', data: { token } });
      } else if (MARGIN_RESET.test(utility) && variants.some((variant) => EDGE_VARIANT.test(variant))) {
        context.report({ node, messageId: 'marginReset', data: { token } });
      }
    });
  },
};
