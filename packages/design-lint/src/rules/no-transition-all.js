import { createClassVisitor } from '../class-strings.js';
import { withRule } from '../rule-docs.js';

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Kein transition-all: Übergänge nennen ihre Eigenschaften.' },
    schema: [],
    messages: {
      transitionAll: withRule('motion', '{{what}} animiert jede Eigenschaft, auch das Layout. Fix: nur die Eigenschaften nennen, die sich ändern (z. B. transition-colors, transition-opacity, transition-transform), Dauer aus den Motion-Tokens.'),
    },
  },
  create(context) {
    const classVisitor = createClassVisitor(context, ({ node, utility }) => {
      if (utility === 'transition-all') context.report({ node, messageId: 'transitionAll', data: { what: '„transition-all“' } });
    });
    return {
      ...classVisitor,
      'Property[key.name="transition"] > Literal'(node) {
        if (typeof node.value === 'string' && /^\s*all\b/.test(node.value)) {
          context.report({ node, messageId: 'transitionAll', data: { what: '„transition: all“' } });
        }
      },
    };
  },
};
