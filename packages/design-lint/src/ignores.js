import path from 'node:path';

export const DEFAULT_IGNORES = ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**', '**/coverage/**', '**/*.d.ts'];

function escape(text) {
  return text.replace(/[.+^${}()|[\]\\]/g, '\\$&');
}

export function globToRegex(glob) {
  const pattern = glob.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/\/$/, '/**');
  let source = '';
  for (let i = 0; i < pattern.length; i++) {
    if (pattern.startsWith('**/', i)) {
      source += '(?:.*/)?';
      i += 2;
    } else if (pattern.startsWith('**', i)) {
      source += '.*';
      i += 1;
    } else if (pattern[i] === '*') {
      source += '[^/]*';
    } else if (pattern[i] === '?') {
      source += '[^/]';
    } else {
      source += escape(pattern[i]);
    }
  }
  return new RegExp(`^${source}(?:/.*)?$`);
}

export function ignoreMatcher(root, patterns = []) {
  const regexes = [...DEFAULT_IGNORES, ...patterns].map(globToRegex);
  return (file) => {
    const relative = path.relative(root, path.resolve(root, file)).replace(/\\/g, '/');
    return regexes.some((regex) => regex.test(relative));
  };
}
