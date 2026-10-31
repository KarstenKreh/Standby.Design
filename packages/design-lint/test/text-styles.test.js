import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { analyzeTextStyles } from '../src/dom/text-styles.js';

const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  chromium = null;
}

describe('analyzeTextStyles', { skip: chromium ? false : 'playwright not installed' }, () => {
  let browser;

  before(async () => {
    browser = await chromium.launch();
  });

  after(async () => {
    await browser?.close();
  });

  async function analyze(name) {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(FIXTURES, name)).href);
    const report = await page.evaluate(analyzeTextStyles, {});
    await page.close();
    return report;
  }

  it('accepts a screen where every style has a role', async () => {
    const report = await analyze('clean.html');
    assert.equal(report.count, 5);
    assert.equal(report.scaleSource, 'stylesheet');
    assert.deepEqual(report.findings.filter((finding) => finding.severity === 'error'), []);
  });

  it('reports too many styles, neighbouring steps and a display family on several roles', async () => {
    const report = await analyze('crowded.html');
    const errors = report.findings.filter((finding) => finding.severity === 'error').map((finding) => finding.text);
    assert.equal(report.count, 9);
    assert.ok(errors.some((text) => text.startsWith('9 Textstile')), errors.join('\n'));
    assert.ok(errors.some((text) => text.includes('„Umsatz“ (24px) und „Details“ (20px)')), errors.join('\n'));
    assert.ok(errors.some((text) => text.includes('Georgia')), errors.join('\n'));
  });
});
