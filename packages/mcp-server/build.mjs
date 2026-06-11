import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

// Bundles @core (packages/core) and @syslib (system-react/src/lib) sources
// directly into dist so the server runs with only npm dependencies installed.
await build({
  entryPoints: [path.join(root, 'src/index.ts')],
  outfile: path.join(root, 'dist/index.js'),
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
