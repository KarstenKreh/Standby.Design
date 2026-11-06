import { createClassVisitor } from '../class-strings.js';
import { withRule } from '../rule-docs.js';
import { locationOf, styleBlocks } from '../vue.js';

const CSS_COMMENT = /\/\*[\s\S]*?\*\//g;
const CSS_TRANSITION_ALL = /(?<![\w-])transition(?:-property)?\s*:(?:[^;{}]*,)?\s*all(?![\w-])/g;

function findTransitionAll(css) {
  const withoutComments = css.replace(CSS_COMMENT, (comment) => ' '.repeat(comment.length));
  return [...withoutComments.matchAll(CSS_TRANSITION_ALL)].map((match) => ({ index: match.index, length: match[0].length }));
}

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
    const { sourceCode } = context;
    const reportCss = (node) => {
      const [start, end] = node.range;
      for (const { index, length } of findTransitionAll(sourceCode.text.slice(start, end))) {
        const loc = locationOf(sourceCode, start + index, length);
        context.report({ node, loc, messageId: 'transitionAll', data: { what: '„transition: all“' } });
      }
    };
    const checkStyleProperty = (node) => {
      if (typeof node.value === 'string' && /^\s*all\b/.test(node.value)) {
        context.report({ node, messageId: 'transitionAll', data: { what: '„transition: all“' } });
      }
    };
    return createClassVisitor(context, ({ node, loc, utility }) => {
      if (utility === 'transition-all') context.report({ node, loc, messageId: 'transitionAll', data: { what: '„transition-all“' } });
    }, {
      script: {
        'Property[key.name="transition"] > Literal': checkStyleProperty,
        'Program:exit'() {
          styleBlocks(context).forEach(reportCss);
        },
      },
      template: {
        'Property[key.name="transition"] > Literal': checkStyleProperty,
        'VAttribute[directive=false][key.name="style"]'(attribute) {
          if (attribute.value) reportCss(attribute.value);
        },
      },
    });
  },
};
