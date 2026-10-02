import { describe, it, expect } from 'vitest';
import { systemShareUrl, llmShareHeader, llmRulesFooter, pageShareUrl, ogQuery, withShareLink, DESIGN_RULES_URL, SHARE_BASE_URL } from './share-link';

describe('withShareLink', () => {
  const url = 'https://standby.design/system#c=X';

  it('puts the link into a CSS comment that keeps the code parseable', () => {
    const out = withShareLink('css', url, ':root { --a: 1; }');
    expect(out.startsWith(`/* Design system: ${url}`)).toBe(true);
    expect(out.replace(/\/\*[\s\S]*?\*\//g, '').trim()).toBe(':root { --a: 1; }');
  });

  it('adds the link as the first $description of design tokens', () => {
    const out = JSON.parse(withShareLink('design-tokens', url, '{"spacing":{}}'));
    expect(Object.keys(out)[0]).toBe('$description');
    expect(out.$description).toContain(url);
    expect(out.spacing).toEqual({});
  });

  it('tells briefing readers to store the link in the theme file', () => {
    const out = withShareLink('llm-briefing', url, '# Body');
    expect(out).toContain(url);
    expect(out).toContain('theme file');
    expect(out.endsWith('# Body')).toBe(true);
  });

  it('uses an HTML comment for the font embed', () => {
    expect(withShareLink('font-embed', url, '<link>')).toBe(`<!-- Design system: ${url} -->\n<link>`);
  });
});

describe('pageShareUrl', () => {
  const color = 'FF6B35,FF6B35,1,CC3333,1,30,balanced,0,0,best,My%20Theme,0,0';

  it('adds the OG query for theme name and brand color', () => {
    expect(pageShareUrl('https://x.test/shape/', `#c=${color}&s=S`))
      .toBe(`https://x.test/shape/?t=My+Theme&c=FF6B35#c=${color}&s=S`);
  });

  it('omits the default theme name', () => {
    expect(ogQuery(`c=${color.replace('My%20Theme', 'Standby.Design')}`)).toBe('?c=FF6B35');
  });

  it('has no query without a color segment', () => {
    expect(pageShareUrl('https://x.test/motion/', 'm=50,50')).toBe('https://x.test/motion/#m=50,50');
  });
});

describe('systemShareUrl', () => {
  it('builds a /system URL from a fresh segment when no hash exists yet', () => {
    expect(systemShareUrl('c', 'AABBCC,1', '')).toBe(`${SHARE_BASE_URL}/system#c=AABBCC,1`);
  });

  it('refreshes its own segment and preserves the others', () => {
    const url = systemShareUrl('t', 'NEW', '#c=SEED&t=OLD&p=SPACE');
    expect(url).toBe(`${SHARE_BASE_URL}/system#c=SEED&t=NEW&p=SPACE`);
  });

  it('accepts the raw hash with or without leading #', () => {
    expect(systemShareUrl('y', 'ICONS', 'c=SEED')).toBe(systemShareUrl('y', 'ICONS', '#c=SEED'));
  });
});

describe('llmShareHeader', () => {
  it('puts the URL in the first line and ends with a blank line', () => {
    const header = llmShareHeader('https://standby.design/system#c=X');
    expect(header.split('\n')[0]).toContain('https://standby.design/system#c=X');
    expect(header.endsWith('\n\n')).toBe(true);
  });
});

describe('llmRulesFooter', () => {
  it('links the rules page, the Markdown bundle and the MCP tool', () => {
    const footer = llmRulesFooter();
    expect(footer).toContain(DESIGN_RULES_URL);
    expect(footer).toContain(`${DESIGN_RULES_URL}.md`);
    expect(footer).toContain('get_design_rules');
  });
});
