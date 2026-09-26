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
const SOURCE_DIR = path.join(DOCS_DIR, 'rules');
const PUBLIC_DOCS_DIR = path.join(DOCS_DIR, '..', 'public', 'docs');
const OUTPUT_DIR = path.join(PUBLIC_DOCS_DIR, 'rules');
const INDEX_URL = '/docs/rules';
const HUB_FILE = '00 Hub - Design Rules.md';
const DROPPED_HUB_SECTIONS = ['Nächste Schritte'];
const MCP_DATA_PATH = path.join(DOCS_DIR, '..', 'packages', 'mcp-server', 'src', 'design-rules.json');
const SECTION = { name: 'Design Rules', url: INDEX_URL, markdownUrl: '/docs/rules.md' };

function extractRuleStatement(note) {
  const match = note.body.match(/^>\s*\[!TIP\][^\n]*\n((?:>[^\n]*\n?)+)/m);
  if (!match) return '';
  return match[1]
    .split('\n')
    .map((line) => line.replace(/^>\s?/, '').trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\*\*/g, '');
}

function rulesInHubOrder(notes) {
  const hub = notes.find((n) => n.isHub);
  const hubPosition = (rule) => {
    const index = hub.body.indexOf(`[[${rule.name}]]`);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  return notes.filter((n) => n.isRule).sort((x, y) => hubPosition(x) - hubPosition(y));
}

function renderMcpData(notes, notesByName) {
  const rules = rulesInHubOrder(notes).map((rule) => ({
    slug: rule.slug,
    title: rule.title,
    category: rule.category,
    scope: rule.meta.scope || 'universal',
    appliesTo: Array.isArray(rule.meta['applies-to']) ? rule.meta['applies-to'] : [],
    korridor: rule.meta.korridor || null,
    default: rule.meta.default || null,
    description: rule.meta.description || '',
    rule: extractRuleStatement(rule),
    url: `${SITE}${rule.url}`,
    body: renderMarkdownBody(rule, notesByName, { demote: false }).trim(),
  }));
  return `${JSON.stringify({ source: `${SITE}${INDEX_URL}`, markdown: `${SITE}/docs/rules.md`, language: 'de', rules }, null, 2)}\n`;
}

function metaRows(note) {
  const rows = [];
  if (note.meta.scope) {
    const platforms = Array.isArray(note.meta['applies-to']) ? note.meta['applies-to'].join(', ') : '';
    rows.push(['Geltung', platforms ? `${note.meta.scope} · ${platforms}` : note.meta.scope]);
  }
  if (note.meta.korridor) rows.push(['Korridor', note.meta.korridor]);
  if (note.meta.default) rows.push(['Vorgabe', note.meta.default]);
  return rows;
}

function renderAgentMarkdown(notes, notesByName) {
  const hub = notes.find((n) => n.isHub);
  const header = [
    '# Design Rules',
    '',
    `Source: ${SITE}${INDEX_URL}`,
    '',
    hub.meta.description || '',
    '',
    'Every rule follows the same shape: Regel (the rule), Warum (why it holds), Woran Du den Verstoß erkennst (how to detect a violation in code), Richtig / falsch (example), Grenzen (when it does not apply). Rules that name a number separate hard invariants from soft values: Korridor is the allowed range, Vorgabe is the default until a project sets its own value.',
    '',
  ].join('\n');
  const sections = rulesInHubOrder(notes).map((rule) => {
    const meta = metaRows(rule).map(([label, value]) => `**${label}:** ${value}`).join(' · ');
    return [`## ${rule.title}`, '', `${rule.category} · ${SITE}${rule.url}`, meta ? `\n${meta}` : '', '', renderMarkdownBody(rule, notesByName).trim(), ''].join('\n');
  });
  return `${header}\n${sections.join('\n')}`;
}

function build() {
  const notes = loadNotes({ sourceDir: SOURCE_DIR, hubFile: HUB_FILE, indexUrl: INDEX_URL, droppedHubSections: DROPPED_HUB_SECTIONS }).map(
    (note) => ({ ...note, isRule: note.meta.type === 'design-rule' }),
  );
  const notesByName = indexNotes(notes);

  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const note of notes) {
    const description = note.meta.description || note.title;
    const html = note.isHub
      ? renderPage({
          section: SECTION,
          title: 'Design Rules',
          description,
          url: INDEX_URL,
          back: { href: '/', label: 'standby.design' },
          lead: description,
          content: `    <p class="agent-hint">Für Agenten: alle Regeln in einer Datei als <a href="/docs/rules.md">Markdown</a>. Die Begründungen hinter den Werkzeugen stehen unter <a href="/docs/research">Research</a>.</p>\n${renderHtmlBody(note, notesByName)}`,
        })
      : renderPage({
          section: SECTION,
          title: note.title,
          description,
          url: note.url,
          back: { href: INDEX_URL, label: 'Design Rules' },
          eyebrow: note.category,
          meta: renderMetaHtml(metaRows(note)),
          content: renderHtmlBody(note, notesByName),
        });
    const target = note.isHub ? path.join(PUBLIC_DOCS_DIR, 'rules.html') : path.join(OUTPUT_DIR, `${note.slug}.html`);
    fs.writeFileSync(target, html);
  }

  fs.writeFileSync(path.join(PUBLIC_DOCS_DIR, 'rules.md'), renderAgentMarkdown(notes, notesByName));
  fs.writeFileSync(MCP_DATA_PATH, renderMcpData(notes, notesByName));
  updateSitemap(notes, INDEX_URL);
  console.log(`Built ${notes.length} pages into public/docs (rules.html, rules/*.html, rules.md) and the MCP rule data`);
}

build();
