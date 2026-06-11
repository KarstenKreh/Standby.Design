// One-off helper: registers this server for Claude DESKTOP chat sessions
// via %APPDATA%\Claude\claude_desktop_config.json (the desktop app ignores
// ~/.claude.json — see github.com/anthropics/claude-code/issues/57559).
// Run: node register-desktop.mjs [path-to-dist-index.js]
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const appData = process.env.APPDATA;
const cfgPath = path.join(appData, 'Claude', 'claude_desktop_config.json');
const serverPath = process.argv[2]
  ?? path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist', 'index.js');

if (!fs.existsSync(serverPath)) throw new Error('dist/index.js not found — run npm run build first: ' + serverPath);

// Absolute node path — GUI-spawned processes may not have the shell PATH.
const nodePath = execSync(process.platform === 'win32' ? 'where node' : 'which node')
  .toString().split(/\r?\n/)[0].trim();

const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : {};
cfg.mcpServers = cfg.mcpServers ?? {};
cfg.mcpServers['standby-design'] = {
  command: nodePath,
  args: [serverPath],
};

fs.copyFileSync(cfgPath, cfgPath + '.bak-mcp');
fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n');
console.log('OK — standby-design registered for Claude desktop chats.');
console.log('  command:', nodePath);
console.log('  args:', serverPath);
console.log('Fully restart the Claude app (quit from system tray) to load it.');
