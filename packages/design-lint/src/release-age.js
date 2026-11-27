import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const PACKAGE = 'standby-design-lint';
const MINUTE = 60 * 1000;
const MINUTES_PER_DAY = 24 * 60;

function read(root, file) {
  const target = path.join(root, file);
  return existsSync(target) ? readFileSync(target, 'utf8') : '';
}

function yamlList(yaml, key) {
  const inline = new RegExp(`^${key}:[ \\t]*\\[(.*)\\]`, 'm').exec(yaml);
  if (inline) return inline[1].split(',').map((entry) => entry.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  const block = new RegExp(`^${key}:[ \\t]*\\r?\\n((?:[ \\t]+-.*\\r?\\n?|[ \\t]*#.*\\r?\\n?)*)`, 'm').exec(yaml);
  if (!block) return [];
  return [...block[1].matchAll(/^[ \t]+-[ \t]*['"]?([^'"#\r\n]+?)['"]?[ \t]*(?:#.*)?$/gm)].map((match) => match[1]);
}

function excludes(patterns) {
  return patterns.some((pattern) => new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}(?:@.*)?$`).test(PACKAGE));
}

function pnpmGate(root) {
  const workspace = read(root, 'pnpm-workspace.yaml');
  const fromWorkspace = /^minimumReleaseAge:[ \t]*(\d+)/m.exec(workspace);
  if (fromWorkspace) {
    if (excludes(yamlList(workspace, 'minimumReleaseAgeExclude'))) return null;
    return { minutes: Number(fromWorkspace[1]), source: `minimumReleaseAge ${fromWorkspace[1]} in pnpm-workspace.yaml` };
  }
  const fromNpmrc = /^minimum-release-age[ \t]*=[ \t]*(\d+)/m.exec(read(root, '.npmrc'));
  return fromNpmrc ? { minutes: Number(fromNpmrc[1]), source: `minimum-release-age ${fromNpmrc[1]} in .npmrc` } : null;
}

function npmGate(root) {
  const days = /^min-release-age[ \t]*=[ \t]*(\d+)/m.exec(read(root, '.npmrc'));
  return days ? { minutes: Number(days[1]) * MINUTES_PER_DAY, source: `min-release-age ${days[1]} in .npmrc` } : null;
}

export function releaseAgeGate(root, manager) {
  const gate = manager === 'pnpm' ? pnpmGate(root) : manager === 'npm' ? npmGate(root) : null;
  return gate?.minutes > 0 ? gate : null;
}

export function releaseTimes(root) {
  try {
    const output = execFileSync('npm', ['view', PACKAGE, 'time', '--json'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], shell: process.platform === 'win32', timeout: 30000 });
    return JSON.parse(output);
  } catch {
    return null;
  }
}

export function compareVersions(a, b) {
  const [left, right] = [a, b].map((version) => version.split('-')[0].split('.').map(Number));
  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) return left[i] - right[i];
  }
  return 0;
}

export function checkReleaseAge({ version, gate, times, now = Date.now() }) {
  const published = times?.[version] ? Date.parse(times[version]) : NaN;
  if (Number.isNaN(published)) return { allowed: true };
  const allowedFrom = published + gate.minutes * MINUTE;
  if (allowedFrom <= now) return { allowed: true };
  const mature = Object.entries(times)
    .filter(([name, time]) => /^\d+\.\d+\.\d+$/.test(name) && Date.parse(time) + gate.minutes * MINUTE <= now)
    .map(([name]) => name)
    .sort(compareVersions);
  return { allowed: false, allowedFrom: new Date(allowedFrom), newestAllowed: mature.pop() ?? null };
}
