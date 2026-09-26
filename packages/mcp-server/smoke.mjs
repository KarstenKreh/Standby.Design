// End-to-end smoke test: spawns the built server over stdio and exercises
// the full chained workflow (color → type → shape → icons → space → motion → export).
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

res = await client.callTool({ name: 'generate_motion_tokens', arguments: { url, preset: 'lively-firm', material: 30 } });
console.log('\n=== motion ===\n' + res.content[0].text);
url = urlOf(res);
if (!url.includes('m=85,30')) throw new Error('generate_motion_tokens: preset energy plus material override not encoded as m=85,30: ' + url);
if (!url.includes('p=')) throw new Error('generate_motion_tokens dropped the other segments: ' + url);
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
if (!dtcg.motion?.spatial?.fast?.$value?.duration || !dtcg.typography || !dtcg.spacing) {
  throw new Error('design-tokens export must carry typography, spacing and motion');
}
console.log('\n=== export design-tokens parses as JSON OK ===');

for (const [format, marker] of [['css', '--motion-spatial-fast-duration'], ['tailwind', '--motion-enter-spatial'], ['llm-briefing', '# Motion — Energy 85 · Material 30']]) {
  res = await client.callTool({ name: 'export_design_system', arguments: { url, format } });
  if (!res.content[0].text.includes(marker)) throw new Error(`export ${format} is missing the motion section (${marker})`);
}
console.log('=== css, tailwind and llm-briefing carry motion OK ===');

res = await client.callTool({ name: 'get_design_system', arguments: { url: 'https://standby.design/motion#m=15,85' } });
if (res.isError || !res.content[0].text.includes('## Motion — Energy 15 · Material 85 (Calm · elastic)')) {
  throw new Error('get_design_system does not read a motion-only URL:\n' + res.content[0].text.slice(0, 400));
}
console.log('=== motion-only URL is a valid design system OK ===');

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

res = await client.callTool({ name: 'export_design_system', arguments: { url, format: 'css' } });
for (const token of ['--primary-hover', '--primary-pressed', '--destructive-hover', '--destructive-pressed']) {
  if (!res.content[0].text.includes(token)) throw new Error(`css export is missing the state token ${token}`);
}
console.log('\n=== css export carries hover and pressed tokens OK ===');

res = await client.callTool({ name: 'get_design_rules', arguments: {} });
if (res.isError || !res.content[0].text.includes('form-konzentrische-radien')) {
  throw new Error('get_design_rules summary does not list the rule slugs:\n' + res.content[0].text.slice(0, 400));
}
console.log(`\n=== design rules summary: ${res.content[0].text.length} chars OK ===`);

res = await client.callTool({ name: 'get_design_rules', arguments: { rules: ['form-konzentrische-radien'] } });
if (res.isError || !res.content[0].text.includes('## Warum')) {
  throw new Error('get_design_rules full text is missing the rule body:\n' + res.content[0].text.slice(0, 400));
}
console.log('=== design rule full text OK ===');

res = await client.callTool({ name: 'get_design_rules', arguments: { category: 'Flaeche', detail: 'full' } });
if (res.isError || !res.content[0].text.includes('# Eine Linie trennt')) {
  throw new Error('get_design_rules category filter failed:\n' + res.content[0].text.slice(0, 400));
}
console.log('=== design rules category filter OK ===');

res = await client.callTool({ name: 'export_design_system', arguments: { url, format: 'llm-briefing' } });
if (!res.content[0].text.includes('get_design_rules')) {
  throw new Error('llm-briefing export does not point to the design rules');
}
console.log('=== llm-briefing links the design rules OK ===');

// Error paths
res = await client.callTool({ name: 'generate_color_palette', arguments: { brandHex: 'nope' } });
console.log('\n=== invalid hex →', res.isError ? 'isError OK' : 'MISSING isError', '===\n' + res.content[0].text);

await client.close();
console.log('\nSMOKE TEST PASSED');
