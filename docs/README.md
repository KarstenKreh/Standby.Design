# docs

Source for the rule pages at https://standby.design/docs/rules and the research pages at https://standby.design/docs/research.

- `rules/*.md` are the rule notes, one file per rule, in Obsidian syntax (frontmatter, `> [!TIP]` callouts, `[[wikilinks]]`). `00 Hub - Design Rules.md` becomes the overview page.
- `research/*.md` are the research notes in the same syntax. They say why the tools do what they do; the rules stay instructions. `00 Hub - Research.md` becomes the overview page. A note is named `<Bereich> - <Thema>.md`, the frontmatter carries `description`, `tool` and `stand`.
- `npm run build` (run once `npm install` first) runs both builds:
  - `build-rules.mjs` writes `public/docs/rules.html`, `public/docs/rules/<slug>.html`, the agent bundle `public/docs/rules.md`, and the rule entries in `public/sitemap.xml`.
  - `build-research.mjs` writes `public/docs/research.html`, `public/docs/research/<slug>.html`, the agent bundle `public/docs/research.md`, and the research entries in `public/sitemap.xml`.
- `page-kit.mjs` holds what both builds share: note parsing, Markdown and callout rendering, the page template and the sitemap update.
- The generated files are committed. The Docker image copies `public/docs/` as is and does not run this build.
- The hub section "Nächste Schritte" is internal and is left out of the rule pages. Wikilinks to notes outside the own folder render as plain text.
- The rules build also writes `packages/mcp-server/src/design-rules.json`, the data behind the MCP tool `get_design_rules`. After changing a rule, rebuild and release the MCP server too. Research is not part of the MCP server yet.
- When adding a research page, also mention it in `public/llms.txt`.
