import { createClassVisitor } from '../class-strings.js';
import { arbitraryValue, isPaletteColor, parseColorUtility, RAW_COLOR, RAW_LENGTH } from '../tailwind.js';
import { withRule } from '../rule-docs.js';

const FONT_FAMILY = /^font-\[(?:['"]|family-name:)/;

function classify(utility, allowedColors) {
  if (FONT_FAMILY.test(utility)) return 'fontFamily';
  const arbitrary = arbitraryValue(utility);
  if (arbitrary && !arbitrary.includes('var(')) {
    if (RAW_COLOR.test(arbitrary)) return 'color';
    if (RAW_LENGTH.test(arbitrary)) return 'length';
  }
  const color = parseColorUtility(utility);
  if (color && !color.arbitrary && isPaletteColor(color.value) && !allowedColors.includes(color.value)) return 'palette';
  return null;
}

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Gestaltungswerte kommen aus Tokens: keine Hex-, rgb()- oder px-Werte, keine freie Schriftfamilie, keine Tailwind-Standardpalette.' },
    schema: [{
      type: 'object',
      properties: { allowedColors: { type: 'array', items: { type: 'string' } } },
      additionalProperties: false,
    }],
    messages: {
      color: withRule('tokens', '„{{token}}“ setzt eine Farbe von Hand. Fix: die semantische Farbklasse aus dem Token-System nehmen (z. B. bg-card, text-muted-foreground).'),
      length: withRule('tokens', '„{{token}}“ setzt eine Größe von Hand. Fix: eine Stufe der Skala nehmen (Abstand, Radius, Schriftgröße). Fehlt die Stufe, sie in die Skala aufnehmen statt sie hier zu setzen.'),
      fontFamily: withRule('tokens', '„{{token}}“ setzt eine Schriftfamilie von Hand. Fix: die Familien-Klasse aus dem Theme nehmen (z. B. font-sans, font-heading).'),
      palette: withRule('tokens', '„{{token}}“ nimmt eine Farbe der Tailwind-Standardpalette statt eines Tokens. Fix: die semantische Farbe nehmen, die die Rolle beschreibt (z. B. bg-primary, text-foreground, border-border).'),
    },
  },
  create(context) {
    const allowedColors = context.options[0]?.allowedColors ?? [];
    return createClassVisitor(context, ({ node, token, utility }) => {
      const kind = classify(utility, allowedColors);
      if (kind) context.report({ node, messageId: kind, data: { token } });
    });
  },
};
