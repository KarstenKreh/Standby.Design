import { describe, it, expect } from 'vitest';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { createServer } from '../src/server';

async function spawn(): Promise<Client> {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'smoke-test', version: '0.0.0' }, { capabilities: {} });
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);
  return client;
}

function pickText(content: unknown): string[] {
  if (!Array.isArray(content)) return [];
  return content
    .filter((c): c is { type: string; text: string } => typeof c === 'object' && c !== null && (c as { type: unknown }).type === 'text')
    .map((c) => c.text);
}

describe('MCP server — smoke', () => {
  it('lists all three tools', async () => {
    const client = await spawn();
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual([
      'generate_color_palette',
      'generate_design_system',
      'generate_type_scale',
    ]);
  });

  it('generate_color_palette returns briefing + JSON', async () => {
    const client = await spawn();
    const result = await client.callTool({
      name: 'generate_color_palette',
      arguments: { brandHex: '#335A7F' },
    });
    const texts = pickText(result.content);
    expect(texts.length).toBe(2);
    expect(texts[0]).toContain('# ');
    expect(texts[0]).toContain('Surface Layering');
    const structured = JSON.parse(texts[1]);
    expect(structured.palettes.brand.length).toBe(18);
    expect(structured.cssExport).toContain('--color-brand-500');
    expect(structured.cssExport).toContain('--primary');
    expect(structured.cssExport).toContain('.dark {');
    expect(structured.previewUrl).toMatch(/^https?:\/\/[^/]+\/color#/);
    expect(texts[0]).toContain(structured.previewUrl);
  });

  it('generate_type_scale returns clamp() values', async () => {
    const client = await spawn();
    const result = await client.callTool({
      name: 'generate_type_scale',
      arguments: { mode: 'custom', baseSize: 1, ratio: 1.272 },
    });
    const texts = pickText(result.content);
    const structured = JSON.parse(texts[1]);
    expect(structured.levels.length).toBeGreaterThan(5);
    expect(structured.levels.some((l: { clampValue: string }) => l.clampValue.startsWith('clamp('))).toBe(true);
    expect(structured.cssExport).toContain('--text-h1');
    expect(structured.tailwindExport).toContain('@theme {');
    expect(structured.previewUrl).toMatch(/^https?:\/\/[^/]+\/type#/);
  });

  it('generate_design_system returns merged output', async () => {
    const client = await spawn();
    const result = await client.callTool({
      name: 'generate_design_system',
      arguments: {
        brandHex: '#335A7F',
        typeMode: 'custom',
        typeBaseSize: 1,
        typeRatio: 1.272,
      },
    });
    const texts = pickText(result.content);
    expect(texts[0]).toContain('Design System');
    expect(texts[0]).toContain('# Color');
    expect(texts[0]).toContain('# Typography & Spacing');
    const structured = JSON.parse(texts[1]);
    expect(structured.color.palettes.brand.length).toBe(18);
    expect(structured.type.levels.length).toBeGreaterThan(5);
    expect(structured.spacing.length).toBeGreaterThan(5);
    expect(structured.cssExport).toContain('--color-brand-500');
    expect(structured.cssExport).toContain('--text-h1');
    expect(structured.previewUrl).toMatch(/^https?:\/\/[^/]+\/system#c=.+&t=/);
  });

  it('rejects invalid brandHex with isError=true response', async () => {
    const client = await spawn();
    const result = await client.callTool({
      name: 'generate_color_palette',
      arguments: { brandHex: 'not-a-hex' },
    });
    expect(result.isError).toBe(true);
    const texts = pickText(result.content);
    expect(texts[0]).toContain('brandHex');
  });
});
