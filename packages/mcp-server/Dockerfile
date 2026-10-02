# Remote MCP server for mcp.standby.design (Streamable HTTP).
# Build context is the repo root — the bundle pulls sources from
# packages/core via an esbuild alias.

FROM node:20-alpine AS build
WORKDIR /app
COPY packages/core/ packages/core/
COPY packages/mcp-server/package.json packages/mcp-server/package-lock.json packages/mcp-server/
WORKDIR /app/packages/mcp-server
RUN npm ci
COPY packages/mcp-server/build.mjs packages/mcp-server/tsconfig.json ./
COPY packages/mcp-server/src/ src/
RUN node build.mjs

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY packages/mcp-server/package.json packages/mcp-server/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/packages/mcp-server/dist/http.js dist/http.js
EXPOSE 3000
CMD ["node", "dist/http.js"]
