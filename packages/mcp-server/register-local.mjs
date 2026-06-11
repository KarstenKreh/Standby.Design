// One-off helper: registers this server user-wide in ~/.claude.json
// (string-level insert — preserves the file byte-for-byte otherwise).
// Run: node register-local.mjs [path-to-dist-index.js]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const home = process.env.USERPROFILE || process.env.HOME;
const cfgPath = path.join(home, '.claude.json');
const serverPath = process.argv[2]
  ?? path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist', 'index.js');

if (!fs.existsSync(serverPath)) throw new Error('dist/index.js not found — run npm run build first: ' + serverPath);

const raw = fs.readFileSync(cfgPath, 'utf8');
const existing = JSON.parse(raw);
if (existing.mcpServers?.['standby-design']) {
  console.log('standby-design already registered:', JSON.stringify(existing.mcpServers['standby-design'].args));
  process.exit(0);
}
if (existing.mcpServers) throw new Error('top-level mcpServers exists — add the entry there manually.');

const entry = {
  'standby-design': {
    type: 'stdio',
    command: 'node',
    args: [serverPath],
    env: {},
  },
};
const block = '  "mcpServers": ' + JSON.stringify(entry, null, 2).split('\n').map((l, i) => (i === 0 ? l : '  ' + l)).join('\n') + ',\n';

const idx = raw.indexOf('{');
const updated = raw.slice(0, idx + 1) + '\n' + block + raw.slice(idx + 1).replace(/^\s*\n/, '');
const parsed = JSON.parse(updated);
if (!parsed.mcpServers?.['standby-design']) throw new Error('entry missing after edit');

fs.writeFileSync(cfgPath, updated);
console.log('OK — standby-design registered for all sessions. Server path:', serverPath);
