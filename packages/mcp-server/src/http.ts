/**
 * Remote MCP entry — Streamable HTTP transport at /mcp, fully stateless:
 * every request gets a fresh server + transport pair, no sessions, no state.
 * Suited for the Anthropic connector directory (auth-free, pure tools).
 */

import http from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer, SERVER_VERSION } from './server.js';

const PORT = Number(process.env.PORT ?? 3000);
const MAX_BODY_BYTES = 1024 * 1024; // requests are small JSON-RPC payloads

function jsonRpcError(res: http.ServerResponse, status: number, code: number, message: string): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ jsonrpc: '2.0', error: { code, message }, id: null }));
}

const httpServer = http.createServer(async (req, res) => {
  // Permissive CORS — the server is public, auth-free, and side-effect-free.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID');
  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;

  if (req.method === 'GET' && (pathname === '/' || pathname === '/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      name: 'standby-design',
      version: SERVER_VERSION,
      status: 'ok',
      endpoint: '/mcp',
      docs: 'https://standby.design/llms.txt',
    }));
    return;
  }

  if (pathname !== '/mcp') {
    jsonRpcError(res, 404, -32000, 'Not found — the MCP endpoint is /mcp');
    return;
  }

  // Stateless mode: no sessions, so SSE resubscription (GET) and session
  // termination (DELETE) are not applicable.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    jsonRpcError(res, 405, -32000, 'Method not allowed — stateless server, POST only');
    return;
  }

  let body: unknown;
  try {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
      size += (chunk as Buffer).length;
      if (size > MAX_BODY_BYTES) throw new Error('payload too large');
      chunks.push(chunk as Buffer);
    }
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    jsonRpcError(res, 400, -32700, 'Parse error — invalid JSON body');
    return;
  }

  try {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => {
      void transport.close();
      void server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (err) {
    console.error('MCP request failed:', err);
    if (!res.headersSent) {
      jsonRpcError(res, 500, -32603, 'Internal server error');
    }
  }
});

httpServer.listen(PORT, () => {
  console.log(`standby-design MCP server (Streamable HTTP) listening on :${PORT}/mcp`);
});
