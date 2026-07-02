/**
 * Lightweight OG-tag injection server.
 * - /{tool}/?t=Name&c=HEX → injects theme name + dynamic OG image URL
 * - /{tool}/og-image?c=HEX → 1200x630 PNG: tool icon + wordmark, tinted in
 *   the brand color (falls back to the tool's hub accent without ?c)
 * - /og-image?tool=github → 1280x640 repo social-preview banner
 * Text rendering requires the Satoshi fonts baked into the image
 * (og-assets/fonts → /usr/share/fonts, see Dockerfile).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 80;
const STATIC_ROOT = '/app/public';
const COLOR_INDEX = path.join(STATIC_ROOT, 'color', 'index.html');
const TYPE_INDEX = path.join(STATIC_ROOT, 'type', 'index.html');
const SYSTEM_INDEX = path.join(STATIC_ROOT, 'system', 'index.html');
const SHAPE_INDEX = path.join(STATIC_ROOT, 'shape', 'index.html');
const SYMBOL_INDEX = path.join(STATIC_ROOT, 'symbol', 'index.html');
const SPACE_INDEX = path.join(STATIC_ROOT, 'space', 'index.html');
const QA_INDEX = path.join(STATIC_ROOT, 'qa', 'index.html');
const ROOT_INDEX = path.join(STATIC_ROOT, 'index.html');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

let colorHtmlTemplate = '';
try {
  colorHtmlTemplate = fs.readFileSync(COLOR_INDEX, 'utf-8');
} catch (e) {
  console.error('Could not read color index.html:', e.message);
}

let typeHtmlTemplate = '';
try {
  typeHtmlTemplate = fs.readFileSync(TYPE_INDEX, 'utf-8');
} catch (e) {
  console.error('Could not read type index.html:', e.message);
}

let systemHtmlTemplate = '';
try {
  systemHtmlTemplate = fs.readFileSync(SYSTEM_INDEX, 'utf-8');
} catch (e) {
  console.error('Could not read system index.html:', e.message);
}

let shapeHtmlTemplate = '';
try {
  shapeHtmlTemplate = fs.readFileSync(SHAPE_INDEX, 'utf-8');
} catch (e) {
  console.error('Could not read shape index.html:', e.message);
}

let symbolHtmlTemplate = '';
try {
  symbolHtmlTemplate = fs.readFileSync(SYMBOL_INDEX, 'utf-8');
} catch (e) {
  console.error('Could not read symbol index.html:', e.message);
}

let spaceHtmlTemplate = '';
try {
  spaceHtmlTemplate = fs.readFileSync(SPACE_INDEX, 'utf-8');
} catch (e) {
  console.error('Could not read space index.html:', e.message);
}

let qaHtmlTemplate = '';
try {
  qaHtmlTemplate = fs.readFileSync(QA_INDEX, 'utf-8');
} catch (e) {
  console.error('Could not read qa index.html:', e.message);
}

const HEX_RE = /^[0-9a-fA-F]{6}$/;

// ---- OG image generation ------------------------------------------------
// Icons are the hub tool-card icons (index.html); accents are the hub
// --card-accent values converted from OKLCH to hex.
const OG_BG = '#0a0a0a';
const OG_FG = '#fafafa';
const OG_MUTED = '#a1a1a1';

const OG_TOOLS = {
  color: {
    label: 'COLOR', accent: '#4989a7', title: ['Color Palette', 'Generator'],
    icon: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="ACCENT"/><circle cx="17.5" cy="10.5" r=".5" fill="ACCENT"/><circle cx="8.5" cy="7.5" r=".5" fill="ACCENT"/><circle cx="6.5" cy="12.5" r=".5" fill="ACCENT"/>',
  },
  type: {
    label: 'TYPE', accent: '#725ec2', title: ['Type Scale', 'Generator'],
    icon: '<path d="M12 4v16"/><path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"/><path d="M9 20h6"/>',
  },
  shape: {
    label: 'SHAPE', accent: '#b86838', title: ['Shape Token', 'Generator'],
    icon: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  },
  symbol: {
    label: 'SYMBOL', accent: '#a067ac', title: ['Icon Set', 'Generator'],
    icon: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  },
  space: {
    label: 'SPACE', accent: '#848538', title: ['Spacing &amp; Layout', 'Generator'],
    icon: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  },
  system: {
    label: 'SYSTEM', accent: '#42926b', title: ['Design System'],
    icon: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  },
};

function ogIconGroup(tool, accent, x, y, size) {
  const scale = size / 24;
  const icon = OG_TOOLS[tool].icon.replace(/ACCENT/g, accent);
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icon}</g>`;
}

function generateOgSvg(tool, accent) {
  const t = OG_TOOLS[tool];
  const titleLines = t.title.map((line, i) =>
    `<text x="80" y="${368 + i * 82}" font-family="Satoshi" font-weight="700" font-size="68" fill="${OG_FG}">${line}</text>`
  ).join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${OG_BG}"/>
  <defs>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="930" cy="315" r="330" fill="url(#glow)"/>
  ${ogIconGroup(tool, accent, 810, 195, 240)}
  <text x="80" y="100" font-family="Satoshi" font-weight="700" font-size="36" fill="${OG_FG}">standby<tspan fill="${accent}">.design</tspan></text>
  <text x="80" y="278" font-family="Satoshi" font-weight="700" font-size="26" letter-spacing="7" fill="${accent}">${t.label}</text>
  ${titleLines}
  <text x="80" y="562" font-family="Satoshi" font-weight="500" font-size="26" fill="${OG_MUTED}">Where human perception meets mathematical rigor.</text>
</svg>`;
}

// GitHub repo social preview: wordmark + tagline + all tool icons (1280x640)
function generateGithubOgSvg() {
  const tools = Object.keys(OG_TOOLS);
  const size = 88, gap = 48;
  const total = tools.length * size + (tools.length - 1) * gap;
  const startX = (1280 - total) / 2;
  const icons = tools.map((tool, i) =>
    ogIconGroup(tool, OG_TOOLS[tool].accent, startX + i * (size + gap), 420, size)
  ).join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640">
  <rect width="1280" height="640" fill="${OG_BG}"/>
  <text x="640" y="255" text-anchor="middle" font-family="Satoshi" font-weight="700" font-size="84" fill="${OG_FG}">standby<tspan fill="#4989a7">.design</tspan></text>
  <text x="640" y="330" text-anchor="middle" font-family="Satoshi" font-weight="500" font-size="32" fill="${OG_MUTED}">Design system generators — web tools + MCP server</text>
  ${icons}
</svg>`;
}

function injectOgTags(html, themeName, brandHex, tool = 'color', label = 'Color Palette Generator', desc = 'color palette') {
  const safeName = themeName.replace(/[<>"&]/g, c =>
    ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', '&': '&amp;' })[c]
  );

  const title = `${safeName} — ${label}`;
  const description = `${safeName} — a ${desc} created on standby.design. Production-ready tokens as CSS, Tailwind v4, or W3C design tokens.`;

  // Dynamic OG image URL: tool icon tinted in the brand color
  const ogTool = OG_TOOLS[tool] ? tool : 'color';
  const imageUrl = brandHex
    ? `https://standby.design/${ogTool}/og-image?c=${brandHex}`
    : `https://standby.design/${ogTool}/og-image`;

  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${title}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${description}"`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"/,
    `<meta property="og:image" content="${imageUrl}"`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${title}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${description}"`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"/,
    `<meta name="twitter:image" content="${imageUrl}"`
  );
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${title}</title>`
  );

  return html;
}

// Cache Fontshare catalog in memory (refreshed on restart)
let fontshareCache = null;
let fontshareFetchPromise = null;

function fetchFontshare() {
  if (fontshareFetchPromise) return fontshareFetchPromise;
  fontshareFetchPromise = new Promise((resolve) => {
    const https = require('https');
    https.get('https://api.fontshare.com/v2/fonts', (apiRes) => {
      const chunks = [];
      apiRes.on('data', (c) => chunks.push(c));
      apiRes.on('end', () => {
        fontshareCache = Buffer.concat(chunks);
        resolve(fontshareCache);
      });
    }).on('error', () => {
      resolve(fontshareCache || Buffer.from('{"fonts":[]}'));
    });
  });
  return fontshareFetchPromise;
}

// Pre-fetch on startup
fetchFontshare();

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Fontshare catalog proxy (avoids CORS)
  if (pathname === '/api/fonts') {
    fetchFontshare().then((data) => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(data);
    });
    return;
  }

  // Dynamic OG image endpoints:
  //   /{tool}/og-image?c=HEX → 1200x630 PNG (tool icon, brand or default accent)
  //   /og-image?tool=github  → 1280x640 repo social-preview banner
  const ogMatch = pathname.match(/^\/(color|type|shape|symbol|space|system)\/og-image$/);
  if (ogMatch || pathname === '/og-image') {
    let svgString = null;
    let width = 1200, height = 630;
    if (ogMatch) {
      const tool = ogMatch[1];
      const hex = url.searchParams.get('c') || '';
      const accent = HEX_RE.test(hex) ? `#${hex}` : OG_TOOLS[tool].accent;
      svgString = generateOgSvg(tool, accent);
    } else {
      const tool = url.searchParams.get('tool') || '';
      if (tool === 'github') {
        svgString = generateGithubOgSvg();
        width = 1280; height = 640;
      } else if (OG_TOOLS[tool]) {
        const hex = url.searchParams.get('c') || '';
        const accent = HEX_RE.test(hex) ? `#${hex}` : OG_TOOLS[tool].accent;
        svgString = generateOgSvg(tool, accent);
      }
    }
    if (!svgString) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    try {
      const sharp = require('sharp');
      const svg = Buffer.from(svgString);
      sharp(svg).resize(width, height).png().toBuffer().then(png => {
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
        });
        res.end(png);
      }).catch(() => {
        res.writeHead(500);
        res.end('Image generation failed');
      });
    } catch (e) {
      res.writeHead(500);
      res.end('sharp not available');
    }
    return;
  }

  // Tool name mapping for OG descriptions
  const TOOL_META = {
    color:  { template: colorHtmlTemplate,  label: 'Color Palette Generator',    desc: 'color palette' },
    type:   { template: typeHtmlTemplate,   label: 'Type Scale Generator',       desc: 'typographic scale' },
    shape:  { template: shapeHtmlTemplate,  label: 'Shape Token Generator',      desc: 'shape token set' },
    symbol: { template: symbolHtmlTemplate, label: 'Icon Style Recommender',     desc: 'icon style recommendation' },
    space:  { template: spaceHtmlTemplate,  label: 'Spacing & Layout Generator', desc: 'spacing and layout token set' },
    system: { template: systemHtmlTemplate, label: 'Design System',              desc: 'design system' },
    qa:     { template: qaHtmlTemplate,     label: 'QA Gallery',                 desc: 'internal QA gallery' },
  };

  // SPA fallback for all tools — inject OG tags when ?t= or ?c= present
  // /qa is a hidden internal gallery (noindex in its own HTML, Disallow in robots.txt)
  const toolMatch = pathname.match(/^\/(color|type|shape|symbol|space|system|qa)(\/|$)/);
  if (toolMatch && !path.extname(pathname)) {
    const tool = toolMatch[1];
    const meta = TOOL_META[tool];
    const template = meta?.template;

    if (template && (url.searchParams.has('t') || url.searchParams.has('c'))) {
      const themeName = url.searchParams.get('t') || '';
      const brandHex = url.searchParams.get('c') || '';
      if (themeName) {
        const safeHex = HEX_RE.test(brandHex) ? brandHex : '';
        const html = injectOgTags(template, themeName, safeHex, tool, meta.label, meta.desc);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
        return;
      }
    }

    // Plain SPA fallback (no query params)
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(template || 'Not found');
    return;
  }

  // Static file serving
  let filePath = path.join(STATIC_ROOT, pathname);
  if (pathname === '/' || pathname === '') {
    filePath = ROOT_INDEX;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Mutable, unversioned files: HTML and crawler-facing text files
    // (llms.txt, robots.txt) must not be cached as immutable.
    const isMutable = ext === '.html' || ext === '.txt';
    const stream = fs.createReadStream(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isMutable ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`OG server running on port ${PORT}`);
});
