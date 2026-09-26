import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE,
  indexNotes,
  loadNotes,
  renderHtmlBody,
  renderMarkdownBody,
  renderMetaHtml,
  renderPage,
  updateSitemap,
} from './page-kit.mjs';

const DOCS_DIR = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(DOCS_DIR, 'research');
const PUBLIC_DOCS_DIR = path.join(DOCS_DIR, '..', 'public', 'docs');
const OUTPUT_DIR = path.join(PUBLIC_DOCS_DIR, 'research');
const INDEX_URL = '/docs/research';
const MARKDOWN_URL = '/docs/research.md';
const HUB_FILE = '00 Hub - Research.md';
const SECTION = { name: 'Research', url: INDEX_URL, markdownUrl: MARKDOWN_URL };

function metaRows(note) {
  const rows = [];
  if (note.meta.tool) rows.push(['Werkzeug', note.meta.tool]);
  if (note.meta.stand) rows.push(['Stand', note.meta.stand]);
  return rows;
}

function pagesInHubOrder(notes) {
  const hub = notes.find((n) => n.isHub);
  const hubPosition = (page) => {
    const index = hub.body.indexOf(`[[${page.name}]]`);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  return notes.filter((n) => !n.isHub).sort((x, y) => hubPosition(x) - hubPosition(y));
}

function renderAgentMarkdown(notes, notesByName) {
  const hub = notes.find((n) => n.isHub);
  const header = [
    '# Research',
    '',
    `Source: ${SITE}${INDEX_URL}`,
    '',
    hub.meta.description || '',
    '',
    'The reasoning behind the standby.design tools. The design rules at https://standby.design/docs/rules say what to do; these pages say why. Every page sorts its findings by strength of evidence: Gut belegt (well replicated), Plausibel, aber schwach belegt (single or pilot studies), Folklore oder Branchen-Richtlinie (convention without a primary source), Folgerung (what the tool does with it), Quellen (key sources).',
    '',
  ].join('\n');
  const sections = pagesInHubOrder(notes).map((page) => {
    const meta = metaRows(page).map(([label, value]) => `**${label}:** ${value}`).join(' · ');
    return [`## ${page.title}`, '', `${page.category} · ${SITE}${page.url}`, meta ? `\n${meta}` : '', '', renderMarkdownBody(page, notesByName).trim(), ''].join('\n');
  });
  return `${header}\n${sections.join('\n')}`;
}

function build() {
  const notes = loadNotes({ sourceDir: SOURCE_DIR, hubFile: HUB_FILE, indexUrl: INDEX_URL });
  const notesByName = indexNotes(notes);

  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const note of notes) {
    const description = note.meta.description || note.title;
    const html = note.isHub
      ? renderPage({
          section: SECTION,
          title: 'Research',
          description,
          url: INDEX_URL,
          back: { href: '/', label: 'standby.design' },
          lead: description,
          content: `    <p class="agent-hint">Für Agenten: alle Seiten in einer Datei als <a href="${MARKDOWN_URL}">Markdown</a>. Die Handlungsanweisungen stehen in den <a href="/docs/rules">Design Rules</a>.</p>\n${renderHtmlBody(note, notesByName)}`,
        })
      : renderPage({
          section: SECTION,
          title: note.title,
          description,
          url: note.url,
          back: { href: INDEX_URL, label: 'Research' },
          eyebrow: note.category,
          meta: renderMetaHtml(metaRows(note)),
          content: renderHtmlBody(note, notesByName),
        });
    const target = note.isHub ? path.join(PUBLIC_DOCS_DIR, 'research.html') : path.join(OUTPUT_DIR, `${note.slug}.html`);
    fs.writeFileSync(target, html);
  }

  fs.writeFileSync(path.join(PUBLIC_DOCS_DIR, 'research.md'), renderAgentMarkdown(notes, notesByName));
  updateSitemap(notes, INDEX_URL);
  console.log(`Built ${notes.length} pages into public/docs (research.html, research/*.html, research.md)`);
}

build();
