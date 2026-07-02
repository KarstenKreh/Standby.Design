/**
 * Shared server factory for both transports (stdio + Streamable HTTP).
 *
 * All computation is shared with the standby.design web apps via packages/core
 * and system-react/src/lib; results are deterministic and URL-addressable.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGenerateTools } from './tools-generate.js';
import { registerSystemTools } from './tools-system.js';

export const SERVER_VERSION = '0.1.5';

export function createServer(): McpServer {
  const server = new McpServer(
    { name: 'standby-design', version: SERVER_VERSION },
    {
      instructions: [
        'Tools for generating complete design systems with standby.design.',
        'Typical flow: generate_color_palette → generate_type_scale → generate_shape_tokens / generate_icon_tokens / generate_space_tokens, passing the returned URL into each subsequent call so the sections accumulate. Every result includes a shareable standby.design/system URL the user can open to view and fine-tune the system visually.',
        'Use export_design_system to get the full CSS / Tailwind v4 / W3C design tokens / LLM briefing for a URL, and get_design_system to inspect an existing URL.',
        'All tools are pure and deterministic — no network access, no side effects.',
      ].join('\n'),
    }
  );

  registerGenerateTools(server);
  registerSystemTools(server);
  return server;
}
