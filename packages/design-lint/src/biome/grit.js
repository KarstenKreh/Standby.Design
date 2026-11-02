const UNSUPPORTED_REGEX = /\(\?[=!<]/;

export function gritRegex(source) {
  if (UNSUPPORTED_REGEX.test(source)) throw new Error(`GritQL kennt kein Lookaround: ${source}`);
  return `r"${source.replace(/\\\//g, '/').replace(/"/g, '\\"')}"`;
}

export function fullMatch(regex) {
  const flags = regex.flags.includes('i') ? '(?i)' : '';
  const anchoredStart = regex.source.startsWith('^');
  const anchoredEnd = regex.source.endsWith('$') && !regex.source.endsWith('\\$');
  const body = regex.source.slice(anchoredStart ? 1 : 0, anchoredEnd ? -1 : undefined);
  return `${flags}(?s)${anchoredStart ? '' : '.*'}(?:${body})${anchoredEnd ? '' : '.*'}`;
}

export function containsMatch(regex) {
  const flags = regex.flags.includes('i') ? '(?i)' : '';
  return `${flags}(?s).*(?:${regex.source}).*`;
}

export function alternation(words) {
  return `(?:${[...words].sort((a, b) => b.length - a.length).map(escapeRegex).join('|')})`;
}

export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function gritString(text) {
  if (/["\\]/.test(text)) throw new Error(`Biome gibt " und \\ in Meldungen falsch aus: ${text}`);
  return `"${text}"`;
}

export function message(template, values) {
  const parts = [];
  let rest = template;
  for (let match = /\{\{(\w+)\}\}/.exec(rest); match; match = /\{\{(\w+)\}\}/.exec(rest)) {
    if (match.index > 0) parts.push(gritString(rest.slice(0, match.index)));
    const value = values[match[1]];
    if (value === undefined) throw new Error(`Kein Wert für {{${match[1]}}} in: ${template}`);
    parts.push(value.startsWith('$') ? value : gritString(value));
    rest = rest.slice(match.index + match[0].length);
  }
  if (rest) parts.push(gritString(rest));
  return `join(list=[${parts.join(', ')}], separator="")`;
}
