export const DEFAULT_PALETTE = [
  'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green',
  'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
  'mauve', 'olive', 'mist', 'taupe',
];

export const COLOR_PREFIXES = [
  'bg', 'text', 'border', 'border-x', 'border-y', 'border-t', 'border-r', 'border-b', 'border-l', 'border-s', 'border-e',
  'ring', 'ring-offset', 'outline', 'fill', 'stroke', 'from', 'via', 'to', 'divide', 'placeholder', 'decoration',
  'shadow', 'inset-shadow', 'inset-ring', 'accent', 'caret',
];

const NON_COLOR_VALUES = new Set([
  'xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl',
  'none', 'inner', 'auto', 'inherit', 'current', 'transparent', 'left', 'center', 'right', 'justify', 'start', 'end',
  'wrap', 'nowrap', 'balance', 'pretty', 'clip', 'ellipsis', 'solid', 'dashed', 'dotted', 'double', 'hidden',
  'x', 'y', 't', 'r', 'b', 'l', 's', 'e', 'offset', 'inset', 'clip-text', 'fixed', 'local', 'scroll', 'cover', 'contain',
  'repeat', 'no-repeat', 'origin-border', 'origin-padding', 'origin-content', 'blend-multiply',
]);

const PREFIX_PATTERN = [...COLOR_PREFIXES].sort((a, b) => b.length - a.length).join('|');
const COLOR_UTILITY = new RegExp(`^-?(?:${PREFIX_PATTERN})-(.+)$`);

export function parseColorUtility(utility) {
  const match = COLOR_UTILITY.exec(utility);
  if (!match) return null;
  const rest = match[1];
  const slash = rest.search(/\/(?![^[]*\])/);
  const value = slash === -1 ? rest : rest.slice(0, slash);
  const alpha = slash === -1 ? null : rest.slice(slash + 1);
  if (!value || /^\d/.test(value) || NON_COLOR_VALUES.has(value)) return null;
  const arbitrary = value.startsWith('[') || value.startsWith('(');
  return { value, alpha, arbitrary };
}

export function isPaletteColor(value) {
  if (value === 'white' || value === 'black') return true;
  const match = /^([a-z]+)-(\d{2,3})$/.exec(value);
  return Boolean(match) && DEFAULT_PALETTE.includes(match[1]);
}

export function arbitraryValue(utility) {
  const match = /\[(.+)\]$/.exec(utility);
  return match ? match[1] : null;
}

export const RAW_COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(/i;
export const RAW_LENGTH = /(?:^|[^\w-])-?\d*\.?\d+(?:px|rem|em|pt)\b/;
