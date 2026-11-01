import { createClassVisitor } from '../class-strings.js';
import { withRule } from '../rule-docs.js';

const STATE_VARIANT = /^(?:group-|peer-)?(?:hover|focus|focus-visible|focus-within|active|pressed)(?:\/[\w-]+)?$/;
export const DEFAULT_COMPONENT_PATHS = ['/components/ui/'];

function normalizePath(filename) {
  return `/${filename.replace(/\\/g, '/').replace(/^\/+/, '')}`;
}

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Hover-, Fokus- und Aktiv-Zustände gehören zur Komponente, nicht in die Ansicht.' },
    schema: [{
      type: 'object',
      properties: { componentPaths: { type: 'array', items: { type: 'string' } } },
      additionalProperties: false,
    }],
    messages: {
      stateInView: withRule('noRebuildInView', '„{{token}}“ baut einen Zustand in der Ansicht nach. Fix: die Komponente aus {{paths}} nutzen, die diesen Zustand schon hat, oder dort eine Variante ergänzen.'),
    },
  },
  create(context) {
    const componentPaths = context.options[0]?.componentPaths ?? DEFAULT_COMPONENT_PATHS;
    const filename = normalizePath(context.filename);
    if (componentPaths.some((path) => filename.includes(path))) return {};
    return createClassVisitor(context, ({ node, token, variants }) => {
      if (variants.some((variant) => STATE_VARIANT.test(variant))) {
        context.report({ node, messageId: 'stateInView', data: { token, paths: componentPaths.join(', ') } });
      }
    });
  },
};
