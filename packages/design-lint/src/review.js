import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { analyzeTextStyles } from './dom/text-styles.js';

const DEFAULT_WIDTHS = [1280, 375];

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    throw new Error('Playwright fehlt. Einmal ausführen: npm i -D playwright && npx playwright install chromium');
  }
}

function slugFor(url) {
  const { pathname, hash } = new URL(url);
  const slug = `${pathname}${hash}`.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
  return slug || 'start';
}

export function formatTextStyleReport(report) {
  const lines = [
    `Textstile: ${report.count} (Korridor ${report.corridor[0]}-${report.corridor[1]}, Vorgabe ${report.preferred})`,
    report.scaleSource === 'stylesheet' ? `Typo-Skala aus den Tokens: ${report.scale.join(', ')} px` : `Keine vollständige Typo-Skala in den Tokens gefunden. Mindestabstand zweier Größen: Faktor ${report.minRatio}`,
    '',
    '| Größe | Gewicht | Familie | Farbe | Schreibweise | Anzahl | Rolle | Beispiel |',
    '|---|---|---|---|---|---|---|---|',
    ...report.styles.map((s) => `| ${s.size}px | ${s.weight} | ${s.family} | ${s.color} | ${s.transform} | ${s.count} | ${s.roles.join(', ') || '–'} | ${s.samples[0]} |`),
    '',
  ];
  if (report.findings.length === 0) lines.push('Keine Befunde.');
  for (const finding of report.findings) lines.push(`- ${finding.severity === 'error' ? 'Verstoß' : 'Hinweis'}: ${finding.text}`);
  return lines.join('\n');
}

export async function reviewScreen(url, { out = '.design-review', widths = DEFAULT_WIDTHS, corridor, preferred } = {}) {
  const { chromium } = await loadPlaywright();
  const dir = path.resolve(out, slugFor(url));
  mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch();
  const sections = [`# Design-Review: ${url}`, ''];
  const screenshots = [];
  let errors = 0;
  try {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await page.goto(url, { waitUntil: 'networkidle' });
      const file = path.join(dir, `${width}.png`);
      await page.screenshot({ path: file, fullPage: true });
      screenshots.push(file);
      const report = await page.evaluate(analyzeTextStyles, { corridor, preferred });
      errors += report.findings.filter((finding) => finding.severity === 'error').length;
      sections.push(`## Breite ${width}px`, '', `Screenshot: ${file}`, '', formatTextStyleReport(report), '');
      await page.close();
    }
  } finally {
    await browser.close();
  }
  const reportFile = path.join(dir, 'report.md');
  writeFileSync(reportFile, sections.join('\n'));
  return { reportFile, screenshots, errors, text: sections.join('\n') };
}
