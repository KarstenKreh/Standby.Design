// Generates real tool outputs for visual QA. Run: `npm run sample`.
// Prints three sample tool calls, each as (briefing, structured JSON preview).

import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { createServer } from '../src/server.js';

async function callTool(client: Client, name: string, args: Record<string, unknown>) {
  const result = await client.callTool({ name, arguments: args });
  const content = Array.isArray(result.content) ? result.content : [];
  const texts = content
    .filter((c): c is { type: string; text: string } => typeof c === 'object' && c !== null && (c as { type: unknown }).type === 'text')
    .map((c) => c.text);
  return { briefing: texts[0] ?? '', json: texts[1] ?? '' };
}

function ruler(title: string): string {
  return `\n${'═'.repeat(80)}\n  ${title}\n${'═'.repeat(80)}\n`;
}

async function main(): Promise<void> {
  const server = createServer();
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'sample', version: '0.0.0' }, { capabilities: {} });
  await Promise.all([server.connect(serverT), client.connect(clientT)]);

  // 1. Color
  const color = await callTool(client, 'generate_color_palette', {
    brandHex: '#335A7F',
    themeName: 'Atlas',
  });
  process.stdout.write(ruler('generate_color_palette — briefing (first 1400 chars)'));
  process.stdout.write(color.briefing.slice(0, 1400) + '\n…\n');
  process.stdout.write(ruler('generate_color_palette — CSS export (first 800 chars)'));
  const colorStructured = JSON.parse(color.json);
  process.stdout.write(colorStructured.cssExport.slice(0, 800) + '\n…\n');
  process.stdout.write(`\n  Palette counts: brand=${colorStructured.palettes.brand.length}, surface=${colorStructured.palettes.surface.length}, error=${colorStructured.palettes.error.length}\n`);

  // 2. Type
  const type = await callTool(client, 'generate_type_scale', {
    mode: 'custom',
    baseSize: 1,
    ratio: 1.272,
    headingFont: 'satoshi',
    bodyFont: 'satoshi',
    monoFont: 'jet-brains-mono',
  });
  process.stdout.write(ruler('generate_type_scale — briefing (first 800 chars)'));
  process.stdout.write(type.briefing.slice(0, 800) + '\n…\n');
  process.stdout.write(ruler('generate_type_scale — CSS (first 600 chars)'));
  const typeStructured = JSON.parse(type.json);
  process.stdout.write(typeStructured.cssExport.slice(0, 600) + '\n…\n');
  process.stdout.write(`\n  Fluid levels: ${typeStructured.levels.filter((l: { isFluid: boolean }) => l.isFluid).length}/${typeStructured.levels.length}\n`);

  // 3. System
  const sys = await callTool(client, 'generate_design_system', {
    brandHex: '#335A7F',
    typeMode: 'custom',
    typeRatio: 1.272,
    themeName: 'Atlas',
  });
  process.stdout.write(ruler('generate_design_system — briefing header (first 600 chars)'));
  process.stdout.write(sys.briefing.slice(0, 600) + '\n…\n');
  const sysStructured = JSON.parse(sys.json);
  process.stdout.write(ruler('generate_design_system — totals'));
  process.stdout.write(`  brand palette:    ${sysStructured.color.palettes.brand.length} steps\n`);
  process.stdout.write(`  type levels:      ${sysStructured.type.levels.length}\n`);
  process.stdout.write(`  spacing tokens:   ${sysStructured.spacing.length}\n`);
  process.stdout.write(`  CSS output:       ${sysStructured.cssExport.length} chars\n`);
  process.stdout.write(`  Tailwind output:  ${sysStructured.tailwindExport.length} chars\n`);
  process.stdout.write(`  briefing:         ${sys.briefing.length} chars\n`);

  await client.close();
  await server.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
