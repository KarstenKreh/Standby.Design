/**
 * Local MCP entry — stdio transport, used by `npx standby-design-mcp`
 * and local registrations.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

const server = createServer();
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('standby-design MCP server running on stdio');
