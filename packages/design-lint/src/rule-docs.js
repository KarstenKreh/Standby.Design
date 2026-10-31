const BASE_URL = 'https://standby.design/docs/rules';

export const RULE_DOCS = {
  tokens: { slug: 'farbe-werte-kommen-aus-tokens-nie-aus-der-hand', title: 'Werte kommen aus Tokens, nie aus der Hand' },
  inlineStyles: { slug: 'stack-utility-klassen-statt-inline-styles', title: 'Utility-Klassen statt Inline-Styles' },
  noRebuildInView: { slug: 'bedienung-verhalten-und-aussehen-werden-nicht-in-der-ansicht-nachgebaut', title: 'Verhalten und Aussehen werden nicht in der Ansicht nachgebaut' },
  motion: { slug: 'bedienung-bewegung-hat-einen-wert-und-haelt-nichts-auf', title: 'Bewegung hat einen Wert und hält nichts auf' },
  opacityModifiers: { slug: 'stack-keine-deckkraft-modifier-auf-semantischen-farben', title: 'Keine Deckkraft-Modifier auf semantischen Farben' },
  gap: { slug: 'stack-abstand-ueber-gap-nicht-ueber-margins-am-kind', title: 'Abstand über gap, nicht über Margins am Kind' },
  neverDisabled: { slug: 'bedienung-ein-button-ist-nie-gesperrt', title: 'Ein Button ist nie gesperrt' },
  nameAndState: { slug: 'bedienung-name-und-zustand-stehen-im-code', title: 'Name und Zustand stehen im Code' },
};

export function ruleUrl(key) {
  return `${BASE_URL}/${RULE_DOCS[key].slug}`;
}

export function withRule(key, text) {
  return `${text} Regel: „${RULE_DOCS[key].title}“ ${ruleUrl(key)}`;
}
