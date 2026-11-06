export function analyzeTextStyles(options = {}) {
  const corridor = options.corridor ?? [4, 7];
  const preferred = options.preferred ?? 5;
  const minRatio = options.minRatio ?? 1.25;
  const minScaleSteps = 5;
  const SCALE_NAME = /^--(?:text|font-size)-[\w-]+$/;
  const NOT_A_SIZE = /line-height|leading|tracking|weight|shadow|color/;
  const ROLE_CLASS = /(?:^|\s)text-role-([\w-]+)/;

  function px(value) {
    const probe = document.createElement('span');
    probe.style.fontSize = value;
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    document.body.appendChild(probe);
    const size = parseFloat(getComputedStyle(probe).fontSize);
    probe.remove();
    return size;
  }

  function scaleFromStylesheets() {
    const names = new Set();
    const visit = (rules) => {
      for (const rule of rules) {
        if (rule.cssRules) visit(rule.cssRules);
        if (!rule.style) continue;
        for (const name of rule.style) {
          if (SCALE_NAME.test(name) && !NOT_A_SIZE.test(name)) names.add(name);
        }
      }
    };
    for (const sheet of document.styleSheets) {
      try {
        visit(sheet.cssRules);
      } catch {
        continue;
      }
    }
    const sizes = [...names].map((name) => px(`var(${name})`)).filter((size) => size > 0);
    return [...new Set(sizes.map((size) => Math.round(size * 10) / 10))].sort((a, b) => a - b);
  }

  function isVisible(element) {
    if (element.checkVisibility && !element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function roleOf(element) {
    const marked = element.closest('[data-text-role]');
    if (marked) return marked.getAttribute('data-text-role');
    for (let node = element; node && node !== document.body; node = node.parentElement) {
      const match = ROLE_CLASS.exec(node.getAttribute('class') ?? '');
      if (match) return match[1];
    }
    return null;
  }

  function isLinkInRunningText(element) {
    const parent = element.parentElement;
    if (element.tagName !== 'A' || !parent) return false;
    return [...parent.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  }

  const styles = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.replace(/\s+/g, ' ').trim();
    const element = node.parentElement;
    if (!text || !element || seen.has(element)) continue;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(element.tagName)) continue;
    if (!isVisible(element)) continue;
    seen.add(element);
    const computed = getComputedStyle(element);
    const style = {
      family: computed.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
      size: Math.round(parseFloat(computed.fontSize) * 10) / 10,
      weight: computed.fontWeight,
      color: isLinkInRunningText(element) ? getComputedStyle(element.parentElement).color : computed.color,
      transform: computed.textTransform === 'none' ? 'normal' : computed.textTransform,
    };
    const key = `${style.family} · ${style.size}px · ${style.weight} · ${style.color} · ${style.transform}`;
    const entry = styles.get(key) ?? { key, ...style, count: 0, roles: new Set(), samples: [] };
    entry.count++;
    const role = roleOf(element);
    if (role) entry.roles.add(role);
    if (entry.samples.length < 3) entry.samples.push(text.slice(0, 40));
    styles.set(key, entry);
  }

  const list = [...styles.values()]
    .map((entry) => ({ ...entry, roles: [...entry.roles] }))
    .sort((a, b) => b.size - a.size || b.count - a.count);

  const declaredScale = scaleFromStylesheets();
  const useScale = declaredScale.length >= minScaleSteps;
  const stepIndex = (size) => declaredScale.findIndex((value) => Math.abs(value - size) <= 0.5);
  const distance = (a, b) => {
    if (a.size === b.size) return null;
    if (useScale && stepIndex(a.size) !== -1 && stepIndex(b.size) !== -1) {
      return Math.abs(stepIndex(a.size) - stepIndex(b.size)) === 1 ? 'nur eine Stufe' : null;
    }
    const ratio = Math.max(a.size, b.size) / Math.min(a.size, b.size);
    return ratio < minRatio ? `nur ${Math.round((ratio - 1) * 100)} %` : null;
  };

  const findings = [];
  const count = list.length;
  if (useScale) {
    const offScale = list.filter((entry) => stepIndex(entry.size) === -1 && !/mono/i.test(entry.family));
    if (offScale.length) {
      findings.push({ severity: 'error', text: `Größen außerhalb der Typo-Skala: ${offScale.map((entry) => `${entry.size}px („${entry.samples[0]}“)`).join(', ')}.` });
    }
  }
  if (count > corridor[1]) {
    findings.push({ severity: 'error', text: `${count} Textstile in der Ansicht, Korridor ${corridor[0]}-${corridor[1]}. Stile ohne eigene Rolle zusammenlegen.` });
  } else if (count > preferred) {
    findings.push({ severity: 'hint', text: `${count} Textstile, Vorgabe ${preferred}. Prüfen, ob jeder eine eigene Rolle hat.` });
  }

  const withoutRole = list.filter((entry) => entry.roles.length === 0);
  if (withoutRole.length && withoutRole.length < list.length) {
    findings.push({ severity: 'error', text: `${withoutRole.length} Textstile ohne Rolle: ${withoutRole.map((entry) => `„${entry.samples[0]}“ (${entry.size}px ${entry.weight})`).join(', ')}.` });
  }
  const mixedRoles = list.filter((entry) => entry.roles.length > 1);
  for (const entry of mixedRoles) {
    findings.push({ severity: 'hint', text: `Ein Stil trägt mehrere Rollen (${entry.roles.join(', ')}): ${entry.size}px ${entry.weight}. Entweder sind es dieselbe Rolle oder sie brauchen verschiedene Stile.` });
  }

  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];
      const gap = distance(a, b);
      const sameOtherwise = a.family === b.family && a.weight === b.weight && a.color === b.color && a.transform === b.transform;
      if (gap && sameOtherwise) {
        findings.push({ severity: 'error', text: `„${a.samples[0]}“ (${a.size}px) und „${b.samples[0]}“ (${b.size}px) liegen ${gap} auseinander und unterscheiden sich sonst nicht. Zwei Stufen Abstand oder ein zweites Mittel (Gewicht, Farbe, Versalien).` });
      }
      if (a.size === b.size && a.family === b.family && a.transform === b.transform && a.color === b.color) {
        findings.push({ severity: 'hint', text: `„${a.samples[0]}“ und „${b.samples[0]}“ unterscheiden sich nur im Gewicht (${a.weight} / ${b.weight}). Ist das eine eigene Rolle?` });
      }
    }
  }

  const familyUse = new Map();
  for (const entry of list) familyUse.set(entry.family, (familyUse.get(entry.family) ?? 0) + entry.count);
  const textFamily = [...familyUse.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  for (const family of familyUse.keys()) {
    if (family === textFamily || /mono/i.test(family)) continue;
    const users = list.filter((entry) => entry.family === family);
    const roles = new Set(users.flatMap((entry) => (entry.roles.length ? entry.roles : [entry.key])));
    if (roles.size > 1) {
      findings.push({ severity: 'error', text: `Die Familie „${family}“ steht neben der Textschrift an ${roles.size} Rollen. Eine zweite Familie trägt genau eine Rolle.` });
    }
  }

  const singles = list.filter((entry) => entry.count === 1 && entry !== list[0]);
  if (singles.length) {
    findings.push({ severity: 'hint', text: `${singles.length} Stile kommen nur einmal vor: ${singles.map((entry) => `„${entry.samples[0]}“`).join(', ')}. Gehören sie zu einer bestehenden Rolle?` });
  }

  return { count, corridor, preferred, minRatio, scale: declaredScale, scaleSource: useScale ? 'stylesheet' : 'ratio', textFamily, styles: list, findings };
}
