# docs

Source for the rule pages at https://standby.design/docs/rules.

- `rules/*.md` are the rule notes, one file per rule, in Obsidian syntax (frontmatter, `> [!TIP]` callouts, `[[wikilinks]]`). `00 Hub - Design Rules.md` becomes the overview page.
- `npm run build` (run once `npm install` first) writes `public/docs/rules.html`, `public/docs/rules/<slug>.html`, the agent bundle `public/docs/rules.md`, and the rule entries in `public/sitemap.xml`.
- The generated files are committed. The Docker image copies `public/docs/` as is and does not run this build.
- The hub section "Nächste Schritte" is internal and is left out of the pages. Wikilinks to notes outside `rules/` render as plain text.
- The same build writes `packages/mcp-server/src/design-rules.json`, the data behind the MCP tool `get_design_rules`. After changing a rule, rebuild and release the MCP server too.
