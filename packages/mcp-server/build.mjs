import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

// Bundles @core (packages/core) and @syslib (system-react/src/lib) sources
// directly into dist so the server runs with only npm dependencies installed.
// Two entries: index.js (stdio, for npx/local) and http.js (Streamable HTTP,
// for mcp.standby.design).
await build({
  entryPoints: [path.join(root, 'src/index.ts'), path.join(root, 'src/http.ts')],
  outdir: path.join(root, 'dist'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  banner: { js: '#!/usr/bin/env node' },
  alias: {
    '@core': path.join(root, '../core/src'),
    '@syslib': path.join(root, '../../system-react/src/lib'),
  },
  packages: 'external',
  define: { 'import.meta.env.DEV': 'false' },
  logLevel: 'info',
});
