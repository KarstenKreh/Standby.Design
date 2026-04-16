import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  dts: true,
  sourcemap: true,
  splitting: false,
  banner: {
    js: '#!/usr/bin/env node',
  },
  // Resolve @core/* via the tsconfig paths. @core source is bundled into
  // the output so the published package is fully self-contained.
  tsconfig: './tsconfig.json',
  // Keep the MCP SDK + zod as external deps (users install them via npm);
  // everything else (including @core source) gets bundled.
  external: ['@modelcontextprotocol/sdk', 'zod'],
});
