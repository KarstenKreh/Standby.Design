// Bin entry for @standby-design/mcp. Wires stdio transport + McpServer.
// Shebang banner is injected by tsup at build time.

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer, SERVER_INFO } from './server.js';

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Never write to stdout (protocol channel). stderr is safe.
  console.error(`[${SERVER_INFO.name}] v${SERVER_INFO.version} connected via stdio`);
}

main().catch((err) => {
  console.error('[standby-design-mcp] fatal:', err);
  process.exit(1);
});
