// End-to-end smoke test: spawns the built server over stdio and exercises
// the full chained workflow (color → type → shape → icons → space → export).
// Run: node smoke.mjs
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const client = new Client({ name: 'smoke', version: '0.0.0' });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(root, 'dist/index.js')] }));

const tools = await client.listTools();
console.log('TOOLS:', tools.tools.map(t => t.name).join(', '));

const urlOf = (res) => {
  const text = res.content[0].text;
  if (res.isError) throw new Error('Tool error: ' + text);
  const m = text.match(/Design system: (\S+)/);
  if (!m) throw new Error('No URL in result:\n' + text);
  return m[1];
};

let res = await client.callTool({ name: 'generate_color_palette', arguments: { brandHex: '#FF6B35', themeName: 'Smoke Test', mode: 'balanced', chromaScale: 0.3 } });
console.log('\n=== color ===\n' + res.content[0].text);
let url = urlOf(res);

res = await client.callTool({ name: 'generate_type_scale', arguments: { url, ratio: 1.25, headingFont: 'clash-display', bodyFont: 'general-sans' } });
console.log('\n=== type ===\n' + res.content[0].text);
url = urlOf(res);

res = await client.callTool({ name: 'generate_shape_tokens', arguments: { url, style: 'paper', borderRadius: 12 } });
url = urlOf(res);
console.log('\n=== shape URL ===\n' + url);

res = await client.callTool({ name: 'generate_icon_tokens', arguments: { url, set: 'lucide' } });
url = urlOf(res);

res = await client.callTool({ name: 'generate_space_tokens', arguments: { url, mode: 'geometric', ratio: 1.25 } });
url = urlOf(res);
console.log('\n=== final URL ===\n' + url);

res = await client.callTool({ name: 'get_design_system', arguments: { url } });
console.log('\n=== overview (first 600 chars) ===\n' + res.content[0].text.slice(0, 600));

for (const format of ['css', 'tailwind', 'design-tokens', 'llm-briefing', 'font-embed']) {
  res = await client.callTool({ name: 'export_design_system', arguments: { url, format } });
  if (res.isError) throw new Error(`export ${format} failed: ` + res.content[0].text);
  console.log(`\n=== export ${format}: ${res.content[0].text.length} chars OK ===`);
}

const withoutCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').trimStart();

for (const format of ['css', 'tailwind']) {
  res = await client.callTool({ name: 'export_design_system', arguments: { url, format } });
  const body = withoutCssComments(res.content[0].text);
  if (!body.startsWith(':root')) {
    throw new Error(`export ${format}: first rule is not :root — the share header is not a CSS comment:\n` + body.slice(0, 200));
  }
  if (!body.includes('--color-')) {
    throw new Error(`export ${format}: primitives block missing — the first :root block was swallowed`);
  }
  console.log(`\n=== export ${format} is parseable CSS OK ===`);
}

res = await client.callTool({ name: 'export_design_system', arguments: { url, format: 'design-tokens' } });
let dtcg;
try {
  dtcg = JSON.parse(res.content[0].text);
} catch (e) {
  throw new Error('design-tokens export is not parseable JSON: ' + e.message + '\n' + res.content[0].text.slice(0, 200));
}
if (!String(dtcg.$description || '').includes('Design system: ')) {
  throw new Error('design-tokens export lost its share link — expected it in $description');
}
console.log('\n=== export design-tokens parses as JSON OK ===');

const schema = (await client.listTools()).tools;

const setDesc = schema.find(t => t.name === 'generate_icon_tokens').inputSchema.properties.set.description;
const setExample = setDesc.match(/e\.g\. "([^"]+)"/)[1];
const validSetIds = setDesc.match(/One of: ([^.]+)\./)[1].split(', ').map(s => s.trim());
if (!validSetIds.includes(setExample)) {
  throw new Error(`generate_icon_tokens documents the example set "${setExample}", which is not a valid id`);
}
console.log(`=== icon set example "${setExample}" is a valid id OK ===`);

const containerDesc = schema.find(t => t.name === 'generate_space_tokens').inputSchema.properties.containers.description;
res = await client.callTool({ name: 'generate_space_tokens', arguments: {} });
const freshUrl = res.content[0].text.match(/Design system: (\S+)/)[1];
res = await client.callTool({ name: 'export_design_system', arguments: { url: freshUrl, format: 'css', sections: ['space'] } });
for (const [, name, px] of res.content[0].text.matchAll(/--container-(\w+): (\d+)px;/g)) {
  if (!new RegExp(`${name} ${px}\\b`).test(containerDesc)) {
    throw new Error(`generate_space_tokens documents no "${name} ${px}" — the container defaults drifted from the doc:\n${containerDesc}`);
  }
}
console.log('=== documented container defaults match the export OK ===');

res = await client.callTool({ name: 'generate_color_palette', arguments: { brandHex: '#0D9488', brandPin: true, brandInvert: true } });
const primaryLine = res.content[0].text.split('\n').find(l => l.startsWith('- primary'));
const pinnedHexes = primaryLine.match(/#[0-9A-F]{6}/g) ?? [];
if (pinnedHexes.length !== 2 || pinnedHexes[0] === pinnedHexes[1]) {
  throw new Error('pinned + inverted primary must report a different hex per mode: ' + primaryLine);
}
console.log(`=== pinned + inverted summary reports both modes OK ===\n${primaryLine}`);

res = await client.callTool({ name: 'export_design_system', arguments: { url, format: 'css' } });
console.log('\n=== css export (first 800 chars) ===\n' + res.content[0].text.slice(0, 800));

res = await client.callTool({ name: 'list_fonts', arguments: {} });
console.log('\n=== fonts (first 300 chars) ===\n' + res.content[0].text.slice(0, 300));

// Error paths
res = await client.callTool({ name: 'generate_color_palette', arguments: { brandHex: 'nope' } });
console.log('\n=== invalid hex →', res.isError ? 'isError OK' : 'MISSING isError', '===\n' + res.content[0].text);

await client.close();
console.log('\nSMOKE TEST PASSED');
