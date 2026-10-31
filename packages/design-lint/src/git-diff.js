import { execFileSync } from 'node:child_process';
import path from 'node:path';

function git(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

export function parseAddedLines(diff) {
  const files = new Map();
  let current = null;
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ ')) {
      const target = line.slice(4).trim();
      current = target === '/dev/null' ? null : target.replace(/^b\//, '');
      if (current && !files.has(current)) files.set(current, []);
      continue;
    }
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (hunk && current) {
      const start = Number(hunk[1]);
      const count = hunk[2] === undefined ? 1 : Number(hunk[2]);
      if (count > 0) files.get(current).push([start, start + count - 1]);
    }
  }
  return files;
}

export function addedLines(cwd, { staged, base }) {
  const top = git(cwd, ['rev-parse', '--show-toplevel']).trim();
  const range = staged ? ['--cached'] : [`${git(cwd, ['merge-base', base, 'HEAD']).trim()}`];
  const diff = git(top, ['diff', ...range, '--unified=0', '--diff-filter=ACMR', '--no-color', '--no-ext-diff']);
  const result = new Map();
  for (const [file, ranges] of parseAddedLines(diff)) {
    if (ranges.length) result.set(path.resolve(top, file), ranges);
  }
  return result;
}
