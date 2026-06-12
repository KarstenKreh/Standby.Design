# CLAUDE.md

Operational knowledge for agents working in this repo. Architecture lives in
CONTEXT.md, product strategy in STRATEGY.md — read those for the what; this
file is the how-to-not-get-stuck.

## npm publish (standby-design-mcp)

- The npm account uses **passkey 2FA — there are no TOTP codes**. npm's
  browser auth flow requires a real TTY; from an agent session shell,
  `npm publish` fails (EOTP) and masks the auth URL. **Never try to publish
  from the session shell, and don't send the user to a terminal.** Instead,
  open a visible window on the user's desktop:

  ```powershell
  Start-Process powershell -ArgumentList '-NoExit','-Command','Set-Location "C:\Users\karst\Documents\Repositories\Solopreneur\Standby.Design\packages\mcp-server"; npm publish'
  ```

  The browser opens, the user confirms the passkey. If they check
  "do not challenge for 5 minutes", follow-up publishes from the session
  shell work without a prompt — useful for quick re-publishes.

- Version bump touches **three places**: `package.json` (`version`),
  `src/server.ts` (`SERVER_VERSION`), `server.json` (`version` and
  `packages[0].version`).
- `mcpName` in package.json must stay `io.github.KarstenKreh/standby-design-mcp`
  — **case-sensitive** and must exactly match the `name` in server.json,
  or the MCP registry rejects the publish.
- MCP registry update after an npm release: `mcp-publisher login github`
  (device flow, user confirms code) then `mcp-publisher publish`. Binary:
  GitHub releases of `modelcontextprotocol/registry`
  (`mcp-publisher_windows_amd64.tar.gz`). Registry description max 100 chars.

## Deploys (website + remote MCP server)

- `bash deploy.sh` deploys everything (site + `standby-mcp` container for
  mcp.standby.design). SSH auth runs through the **1Password SSH agent** —
  there is no key file on disk. The user may need to confirm a 1Password
  popup; if auth fails, check `ssh-add -L` and the whitelist in
  `%LOCALAPPDATA%\1Password\config\ssh\agent.toml`.
- The script must use Windows OpenSSH (it prepends the PATH itself) —
  Git Bash's bundled ssh cannot reach the 1Password agent pipe.
- **New root-level static files** (`public/*.html`, `*.txt`) also need a
  `COPY` line in the root `Dockerfile`, or they 404 in production while
  working locally.

## Pitfalls

- The color export generators exist as **twin copies**:
  `color-react/src/lib/code-export.ts` and
  `system-react/src/lib/color-code-export.ts`. Change both, or they drift
  (see issues #15–#28 from the 2026-06 export audit). The MCP server bundles
  the **system copy** via the `@syslib` alias — rebuild it
  (`packages/mcp-server: npm run build`) after generator changes.
- `color-react` has snapshot tests covering export output: review the diff
  first, then update with `npx vitest run -u`.
- The apps build with `vite build` only (no type checking). Run
  `npx tsc --noEmit` where needed; `packages/mcp-server` has a proper
  `typecheck` script.
- Verify MCP server changes with `npm run smoke` (end-to-end stdio test);
  the remote variant serves `/health` for a quick liveness check.
