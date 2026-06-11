// Ambient declaration for Vite's import.meta.env, referenced by
// @core/fontshare (written for the browser apps). The build replaces
// import.meta.env.DEV with `false` via esbuild define; the fetch path
// that reads it is never called by the MCP server.
interface ImportMeta {
  readonly env: { readonly DEV: boolean };
}
