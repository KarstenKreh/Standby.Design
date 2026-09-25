import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const DOCS_DIR = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(DOCS_DIR, 'rules');
const PUBLIC_DOCS_DIR = path.join(DOCS_DIR, '..', 'public', 'docs');
const OUTPUT_DIR = path.join(PUBLIC_DOCS_DIR, 'rules');
const SITE = 'https://standby.design';
const INDEX_URL = '/docs/rules';
const HUB_FILE = '00 Hub - Design Rules.md';
const DROPPED_HUB_SECTIONS = ['Nächste Schritte'];
const SITEMAP_PATH = path.join(DOCS_DIR, '..', 'public', 'sitemap.xml');

const CALLOUT_LABELS = {
  tip: 'Regel',
  summary: 'Zusammenfassung',
  quote: 'Zitat',
  note: 'Hinweis',
  warning: 'Achtung',
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  let listKey = null;
  for (const line of match[1].split('\n')) {
    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem && listKey) {
      meta[listKey].push(unquote(listItem[1]));
      continue;
    }
    const pair = line.match(/^([A-Za-z-]+):\s*(.*)$/);
    if (!pair) continue;
    if (pair[2] === '') {
      listKey = pair[1];
      meta[listKey] = [];
    } else {
      listKey = null;
      meta[pair[1]] = unquote(pair[2]);
    }
  }
  return { meta, body: raw.slice(match[0].length) };
}

function unquote(value) {
  return value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
}

function splitTitle(body) {
  const match = body.match(/^\s*#\s+(.+)\n/);
  if (!match) return { title: null, rest: body };
  return { title: match[1].trim(), rest: body.slice(match[0].length) };
}

function dropSections(body, headings) {
  const lines = body.split('\n');
  const kept = [];
  let dropping = false;
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) dropping = headings.includes(h2[1].trim());
    if (!dropping) kept.push(line);
  }
  return kept.join('\n');
}

function mapOutsideFences(body, transform) {
  const parts = body.split(/(^```[\s\S]*?^```$)/m);
  return parts.map((part) => (part.startsWith('```') ? part : transform(part))).join('');
}

function resolveWikilinks(text, notesByName, toLink) {
  return text.replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g, (_, target, alias) => {
    const name = target.trim();
    const note = notesByName.get(name);
    const label = (alias || note?.title || name).trim();
    return note ? toLink(label, note) : label;
  });
}

function extractCallouts(text, renderCallout) {
  const lines = text.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const head = lines[i].match(/^>\s*\[!(\w+)\][+-]?\s*(.*)$/);
    if (!head) {
      out.push(lines[i]);
      continue;
    }
    const inner = [];
    while (i + 1 < lines.length && /^>/.test(lines[i + 1])) {
      inner.push(lines[i + 1].replace(/^>\s?/, ''));
      i++;
    }
    const type = head[1].toLowerCase();
    const title = head[2].trim() || CALLOUT_LABELS[type] || head[1];
    out.push(renderCallout(type, title, inner.join('\n')));
  }
  return out.join('\n');
}

function loadNotes() {
  const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.md')).sort();
  return files.map((file) => {
    const name = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8').replace(/\r\n/g, '\n');
    const { meta, body } = parseFrontmatter(raw);
    const { title, rest } = splitTitle(body);
    const isHub = file === HUB_FILE;
    const category = name.includes(' - ') ? name.split(' - ')[0] : null;
    return {
      file,
      name,
      meta,
      title: title || name,
      body: isHub ? dropSections(rest, DROPPED_HUB_SECTIONS) : rest,
      isHub,
      isRule: meta.type === 'design-rule',
      category,
      slug: isHub ? null : slugify(name),
      url: isHub ? INDEX_URL : `${INDEX_URL}/${slugify(name)}`,
    };
  });
}

function renderHtmlBody(note, notesByName) {
  const placeholders = [];
  const prepared = mapOutsideFences(note.body, (text) => {
    const linked = resolveWikilinks(text, notesByName, (label, target) => `[${label}](${target.url})`);
    return extractCallouts(linked, (type, title, inner) => {
      const html = `<aside class="callout callout-${escapeHtml(type)}"><p class="callout-title">${escapeHtml(title)}</p>${marked.parse(inner)}</aside>`;
      placeholders.push(html);
      return `\n\nCALLOUTPLACEHOLDER${placeholders.length - 1}\n\n`;
    });
  });
  return marked
    .parse(prepared)
    .replace(/<p>CALLOUTPLACEHOLDER(\d+)<\/p>/g, (_, index) => placeholders[Number(index)])
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>');
}

function renderMarkdownBody(note, notesByName) {
  return mapOutsideFences(note.body, (text) => {
    const linked = resolveWikilinks(text, notesByName, (label) => label);
    return extractCallouts(linked, (_, title, inner) =>
      [`> **${title}**`, ...inner.split('\n').map((line) => (line ? `> ${line}` : '>'))].join('\n'),
    );
  }).replace(/^(#{2,5})\s/gm, '#$1 ');
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

function renderMetaHtml(note) {
  const rows = metaRows(note);
  if (rows.length === 0) return '';
  const items = rows
    .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join('');
  return `<dl class="rule-meta">${items}</dl>`;
}

const STYLES = `
    :root {
      color-scheme: dark;
      --font-heading: 'Satoshi', sans-serif;
      --font-body: 'Satoshi', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --text-h3: clamp(1.9344rem, 0.2719vw + 1.8707rem, 2.197rem);
      --text-h5: clamp(1.246rem, 0.0559vw + 1.2329rem, 1.3rem);
      --text-body-s: 1rem;
      --text-caption: 0.7692rem;
      --leading-h3: 1.2;
      --leading-h5: 1.3;
      --leading-body-s: 1.5;
      --tracking-h3: -0.01em;
      --tracking-body-s: 0.01em;
      --background: oklch(0.145 0 0);
      --foreground: oklch(0.985 0 0);
      --card: oklch(0.205 0 0);
      --muted-foreground: oklch(0.708 0 0);
      --border: oklch(1 0 0 / 10%);
      --emphasis: oklch(0.78 0.1 230);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: var(--font-body);
      font-size: var(--text-body-s);
      line-height: var(--leading-body-s);
      letter-spacing: var(--tracking-body-s);
      background: var(--background);
      color: var(--foreground);
      padding: 2rem 1.5rem 3rem;
    }
    main { max-width: 720px; margin: 0 auto; }
    .back {
      display: inline-block;
      padding: 0.5rem 0.75rem;
      margin: 0 0 2rem -0.75rem;
      border-radius: 8px;
      color: var(--muted-foreground);
      text-decoration: none;
      transition: color 0.2s, background 0.2s;
    }
    .back:hover { color: var(--foreground); background: var(--card); }
    .eyebrow {
      font-size: var(--text-caption);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted-foreground);
      margin-bottom: 0.5rem;
    }
    h1 {
      font-family: var(--font-heading);
      font-size: var(--text-h3);
      font-weight: 700;
      line-height: var(--leading-h3);
      letter-spacing: var(--tracking-h3);
      margin-bottom: 0.4em;
    }
    h2 {
      font-family: var(--font-heading);
      font-size: var(--text-h5);
      font-weight: 700;
      line-height: var(--leading-h5);
      margin-top: 2.25em;
      margin-bottom: 0.5em;
    }
    h3 {
      font-family: var(--font-heading);
      font-size: var(--text-body-s);
      font-weight: 700;
      margin-top: 1.5em;
      margin-bottom: 0.4em;
    }
    p, li { color: var(--muted-foreground); margin-bottom: 0.75em; }
    strong { color: var(--foreground); font-weight: 500; }
    ul, ol { padding-left: 1.25rem; margin-bottom: 0.75em; }
    a { color: var(--emphasis); }
    code { font-family: var(--font-mono); font-size: 0.9em; }
    pre {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.5;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.9rem 1rem;
      margin-bottom: 1rem;
      overflow-x: auto;
      white-space: pre;
    }
    pre code { font-size: inherit; color: var(--foreground); }
    hr { border: 0; border-top: 1px solid var(--border); margin: 2rem 0; }
    .lead { font-size: 1.125rem; }
    .table-wrap { overflow-x: auto; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td {
      text-align: left;
      vertical-align: top;
      padding: 0.6rem 0.75rem 0.6rem 0;
      border-bottom: 1px solid var(--border);
    }
    th { color: var(--foreground); font-weight: 500; }
    td { color: var(--muted-foreground); }
    td code { color: var(--foreground); }
    blockquote {
      border-left: 2px solid var(--border);
      padding-left: 1rem;
      margin-bottom: 0.9rem;
    }
    blockquote p { margin-bottom: 0; }
    .callout {
      background: var(--card);
      border-radius: 8px;
      padding: 0.9rem 1rem;
      margin-bottom: 1.25rem;
    }
    .callout p:last-child, .callout ul:last-child { margin-bottom: 0; }
    .callout-title {
      font-size: var(--text-caption);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted-foreground);
      margin-bottom: 0.35rem;
    }
    .callout-tip p:not(.callout-title) { color: var(--foreground); font-size: 1.125rem; }
    .callout-tip .callout-title { color: var(--emphasis); }
    .rule-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1.5rem;
      margin: 0.25rem 0 1.75rem;
      font-size: 0.875rem;
    }
    .rule-meta dt { color: var(--muted-foreground); }
    .rule-meta dd { color: var(--foreground); }
    .agent-hint { font-size: 0.875rem; }
    .legal-links {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 3.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }
    .legal-links a {
      padding: 0.6rem 1rem;
      border-radius: 8px;
      color: var(--muted-foreground);
      text-decoration: none;
      transition: color 0.2s, background 0.2s;
    }
    .legal-links a:hover { color: var(--foreground); background: var(--card); }
`;

function renderPage({ title, description, url, back, eyebrow, lead, meta, content }) {
  const pageTitle = url === INDEX_URL ? 'Design Rules — standby.design' : `${title} — Design Rules — standby.design`;
  const fullUrl = `${SITE}${url}`;
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${fullUrl}" />
  <link rel="alternate" type="text/markdown" href="${SITE}/docs/rules.md" title="Design Rules (Markdown)" />

  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${fullUrl}" />
  <meta property="og:site_name" content="standby.design" />
  <meta property="og:image" content="${SITE}/og-image?tool=github" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${SITE}/og-image?tool=github" />

  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23111'/%3E%3Ccircle cx='16' cy='16' r='6' fill='none' stroke='%234a7aaa' stroke-width='2'/%3E%3C/svg%3E">
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@1,2&f[]=jet-brains-mono@1,2&display=swap" rel="stylesheet">
  <style>${STYLES}  </style>
  <script defer src="https://umami.standby.design/script.js" data-website-id="255e8c46-9a39-4cc8-ba66-5cb4fc53b91e"></script>
</head>
<body>
  <main>
    <a class="back" href="${back.href}">&larr; ${escapeHtml(back.label)}</a>

${eyebrow ? `    <p class="eyebrow">${escapeHtml(eyebrow)}</p>\n` : ''}    <h1>${escapeHtml(title)}</h1>
${lead ? `    <p class="lead">${escapeHtml(lead)}</p>\n` : ''}${meta ? `    ${meta}\n` : ''}
${content}

    <nav class="legal-links">
      <a href="/">Home</a>
      <a href="/docs/mcp">MCP Server</a>
      <a href="${INDEX_URL}">Design Rules</a>
      <a href="/impressum.html">Impressum</a>
      <a href="/datenschutz.html">Datenschutz</a>
    </nav>
  </main>
</body>
</html>
`;
}

function renderAgentMarkdown(notes, notesByName) {
  const hub = notes.find((n) => n.isHub);
  const hubPosition = (rule) => {
    const index = hub.body.indexOf(`[[${rule.name}]]`);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  const rules = notes.filter((n) => n.isRule).sort((x, y) => hubPosition(x) - hubPosition(y));
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
  const sections = rules.map((rule) => {
    const meta = metaRows(rule).map(([label, value]) => `**${label}:** ${value}`).join(' · ');
    return [`## ${rule.title}`, '', `${rule.category} · ${SITE}${rule.url}`, meta ? `\n${meta}` : '', '', renderMarkdownBody(rule, notesByName).trim(), ''].join('\n');
  });
  return `${header}\n${sections.join('\n')}`;
}

function updateSitemap(notes) {
  if (!fs.existsSync(SITEMAP_PATH)) return;
  const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const withoutRules = sitemap.replace(/\n  <url>\n    <loc>https:\/\/standby\.design\/docs\/rules[^<]*<\/loc>[\s\S]*?<\/url>/g, '');
  const entries = notes
    .map((note) => `  <url>\n    <loc>${SITE}${note.url}</loc>\n    <priority>${note.isHub ? '0.8' : '0.6'}</priority>\n  </url>`)
    .join('\n');
  fs.writeFileSync(SITEMAP_PATH, withoutRules.replace('</urlset>', `${entries}\n</urlset>`));
}

function build() {
  const notes = loadNotes();
  const notesByName = new Map(notes.map((n) => [n.name, n]));
  for (const note of notes) {
    for (const alias of Array.isArray(note.meta.aliases) ? note.meta.aliases : []) notesByName.set(alias, note);
  }

  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const note of notes) {
    const description = note.meta.description || note.title;
    const html = note.isHub
      ? renderPage({
          title: 'Design Rules',
          description,
          url: INDEX_URL,
          back: { href: '/', label: 'standby.design' },
          lead: description,
          content: `    <p class="agent-hint">Für Agenten: alle Regeln in einer Datei als <a href="/docs/rules.md">Markdown</a>.</p>\n${renderHtmlBody(note, notesByName)}`,
        })
      : renderPage({
          title: note.title,
          description,
          url: note.url,
          back: { href: INDEX_URL, label: 'Design Rules' },
          eyebrow: note.category,
          meta: renderMetaHtml(note),
          content: renderHtmlBody(note, notesByName),
        });
    const target = note.isHub ? path.join(PUBLIC_DOCS_DIR, 'rules.html') : path.join(OUTPUT_DIR, `${note.slug}.html`);
    fs.writeFileSync(target, html);
  }

  fs.writeFileSync(path.join(PUBLIC_DOCS_DIR, 'rules.md'), renderAgentMarkdown(notes, notesByName));
  updateSitemap(notes);
  console.log(`Built ${notes.length} pages into public/docs (rules.html, rules/*.html, rules.md)`);
}

build();
