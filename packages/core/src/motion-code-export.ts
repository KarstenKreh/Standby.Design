import {
  SEMANTIC_MOTION,
  cssLinearEasing,
  dampingCoefficientOf,
  findPrimitive,
  fitCubicBezier,
  presetFor,
  reducedMotionFor,
  stiffnessOf,
  type MotionCharacter,
  type MotionPrimitive,
  type SemanticMotion,
} from './motion';

export interface MotionExportOptions {
  character: MotionCharacter;
  primitives: MotionPrimitive[];
  restoreUrl?: string;
}

const pct = (v: number) => Math.round(v * 100);

export function motionLabel(c: MotionCharacter): string {
  const preset = presetFor(c);
  return `Energy ${pct(c.energy)} · Material ${pct(c.material)}${preset ? ` (${preset.label})` : ''}`;
}

const kebab = (name: string) => name.replace(/\./g, '-');

function camel(name: string): string {
  return name.split(/[.-]/).map((part, i) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1))).join('');
}

function pascal(name: string): string {
  const c = camel(name);
  return c[0].toUpperCase() + c.slice(1);
}

const fixed = (v: number, digits: number) => String(Math.round(v * 10 ** digits) / 10 ** digits);

function headerLines(opts: MotionExportOptions): string[] {
  const lines = [`Motion tokens — standby.design/motion`, motionLabel(opts.character)];
  if (opts.restoreUrl) lines.push(`Restore: ${opts.restoreUrl}`);
  return lines;
}

function semanticParts(s: SemanticMotion, primitives: MotionPrimitive[]) {
  return {
    spatial: s.spatial ? findPrimitive(primitives, 'spatial', s.spatial) : undefined,
    effect: s.effect ? findPrimitive(primitives, 'effect', s.effect) : undefined,
  };
}

export function generateMotionCss(opts: MotionExportOptions): string {
  const { primitives } = opts;
  let css = `/*\n${headerLines(opts).map((l) => ` * ${l}`).join('\n')}\n *\n * Usage: transition: transform var(--motion-move);\n *        transition: transform var(--motion-enter-spatial), opacity var(--motion-enter-effect);\n *\n * Reduced motion: paths jump (0 ms), effects stay. press, move and expand\n * have no effect part, so crossfade old and new state with opacity var(--motion-<name>-reduced).\n */\n:root {\n`;

  for (const p of primitives) {
    const id = kebab(p.name);
    css += `  --motion-${id}-duration: ${p.settleMs}ms;\n`;
    css += `  --motion-${id}-easing: ${cssLinearEasing(p, p.settleMs)};\n`;
    css += `  --motion-${id}: var(--motion-${id}-duration) var(--motion-${id}-easing);\n`;
  }

  css += `\n`;
  for (const s of SEMANTIC_MOTION) {
    const id = kebab(s.name);
    if (s.spatial && s.effect) {
      css += `  --motion-${id}-spatial: var(--motion-spatial-${s.spatial});\n`;
      css += `  --motion-${id}-effect: var(--motion-effect-${s.effect});\n`;
    } else {
      const ref = s.spatial ? `spatial-${s.spatial}` : `effect-${s.effect}`;
      css += `  --motion-${id}: var(--motion-${ref});\n`;
    }
  }
  css += `\n`;
  for (const s of SEMANTIC_MOTION) {
    const r = reducedMotionFor(s);
    if (r.strategy === 'crossfade') css += `  --motion-${kebab(s.name)}-reduced: var(--motion-effect-${r.effect});\n`;
  }
  css += `}\n`;

  css += `\n@supports not (transition-timing-function: linear(0, 1)) {\n  :root {\n`;
  for (const p of primitives) {
    const [x1, y1, x2, y2] = fitCubicBezier(p, p.settleMs);
    css += `    --motion-${kebab(p.name)}-easing: cubic-bezier(${x1}, ${y1}, ${x2}, ${y2});\n`;
  }
  css += `  }\n}\n`;

  css += `\n@media (prefers-reduced-motion: reduce) {\n  :root {\n`;
  for (const p of primitives.filter((p) => p.kind === 'spatial')) {
    css += `    --motion-${kebab(p.name)}-duration: 0ms;\n`;
  }
  css += `  }\n}\n`;
  return css;
}

export function generateMotionSwiftUI(opts: MotionExportOptions): string {
  const { primitives } = opts;
  let out = `${headerLines(opts).map((l) => `// ${l}`).join('\n')}\n\nimport SwiftUI\n\nextension Animation {\n`;
  for (const p of primitives) {
    out += `    static let ${camel(p.name)} = Animation.spring(response: ${fixed(p.response, 3)}, dampingFraction: ${fixed(p.damping, 3)})\n`;
  }
  out += `}\n\nenum Motion {\n`;
  for (const s of SEMANTIC_MOTION) {
    if (s.spatial && s.effect) {
      out += `    enum ${pascal(s.name)} {\n`;
      out += `        static let spatial = Animation.spatial${pascal(s.spatial)}\n`;
      out += `        static let effect = Animation.effect${pascal(s.effect)}\n`;
      out += `    }\n`;
    } else {
      const ref = s.spatial ? `spatial${pascal(s.spatial)}` : `effect${pascal(s.effect!)}`;
      out += `    static let ${camel(s.name)} = Animation.${ref}\n`;
    }
  }
  out += `\n    enum Reduced {\n`;
  for (const s of SEMANTIC_MOTION) {
    const r = reducedMotionFor(s);
    if (r.strategy === 'crossfade') out += `        static let ${camel(s.name)} = Animation.effect${pascal(r.effect)}\n`;
  }
  out += `    }\n}\n\n`;
  out += `// Reduce Motion: read @Environment(\\.accessibilityReduceMotion).\n`;
  out += `// When it is on, spatial changes happen without animation and effects keep theirs.\n`;
  out += `// press, move and expand crossfade instead: .transition(.opacity) with Motion.Reduced.\n`;
  return out;
}

export function generateMotionCompose(opts: MotionExportOptions): string {
  const { primitives } = opts;
  let out = `${headerLines(opts).map((l) => `// ${l}`).join('\n')}\n\nimport androidx.compose.animation.core.SpringSpec\nimport androidx.compose.animation.core.spring\n\nobject MotionTokens {\n`;
  for (const p of primitives) {
    out += `    fun <T> ${camel(p.name)}(): SpringSpec<T> = spring(dampingRatio = ${fixed(p.damping, 3)}f, stiffness = ${fixed(stiffnessOf(p), 1)}f)\n`;
  }
  out += `\n`;
  for (const s of SEMANTIC_MOTION) {
    if (s.spatial && s.effect) {
      out += `    fun <T> ${camel(s.name)}Spatial(): SpringSpec<T> = spatial${pascal(s.spatial)}()\n`;
      out += `    fun <T> ${camel(s.name)}Effect(): SpringSpec<T> = effect${pascal(s.effect)}()\n`;
    } else {
      const ref = s.spatial ? `spatial${pascal(s.spatial)}` : `effect${pascal(s.effect!)}`;
      out += `    fun <T> ${camel(s.name)}(): SpringSpec<T> = ${ref}()\n`;
    }
  }
  out += `\n`;
  for (const s of SEMANTIC_MOTION) {
    const r = reducedMotionFor(s);
    if (r.strategy === 'crossfade') out += `    fun <T> ${camel(s.name)}Reduced(): SpringSpec<T> = effect${pascal(r.effect)}()\n`;
  }
  out += `}\n\n`;
  out += `// Reduce motion: when the system animator scale is 0, spatial specs snap and effect specs stay.\n`;
  out += `// press, move and expand crossfade instead (Crossfade or fadeIn/fadeOut) with the *Reduced specs.\n`;
  return out;
}

export function generateMotionJs(opts: MotionExportOptions): string {
  const { primitives } = opts;
  const spring = (p: MotionPrimitive) =>
    `{ type: "spring", stiffness: ${fixed(stiffnessOf(p), 1)}, damping: ${fixed(dampingCoefficientOf(p), 2)}, mass: 1 }`;
  let out = `${headerLines(opts).map((l) => `// ${l}`).join('\n')}\n\n`;
  for (const kind of ['spatial', 'effect'] as const) {
    out += `export const ${kind} = {\n`;
    for (const p of primitives.filter((p) => p.kind === kind)) {
      out += `  ${p.speed}: ${spring(p)},\n`;
    }
    out += `};\n\n`;
  }
  out += `export const motion = {\n`;
  for (const s of SEMANTIC_MOTION) {
    const key = s.name.includes('.') ? `"${s.name}"` : s.name;
    if (s.spatial && s.effect) {
      out += `  ${key}: { ...spatial.${s.spatial}, opacity: effect.${s.effect} },\n`;
    } else {
      out += `  ${key}: ${s.spatial ? `spatial.${s.spatial}` : `effect.${s.effect}`},\n`;
    }
  }
  out += `};\n\n`;
  out += `export const motionReduced = {\n`;
  for (const s of SEMANTIC_MOTION) {
    const r = reducedMotionFor(s);
    const key = s.name.includes('.') ? `"${s.name}"` : s.name;
    out += `  ${key}: effect.${r.effect},\n`;
  }
  out += `};\n\n`;
  out += `// Reduce motion: wrap the app in <MotionConfig reducedMotion="user">.\n`;
  out += `// Motion then skips transform animations and keeps opacity. For press, move and expand\n`;
  out += `// crossfade old and new state (AnimatePresence) with motionReduced.\n`;
  return out;
}

export function generateMotionDesignTokens(opts: MotionExportOptions): string {
  const { primitives } = opts;
  const primitiveToken = (p: MotionPrimitive) => ({
    $type: 'transition',
    $value: {
      duration: { value: p.settleMs, unit: 'ms' },
      delay: { value: 0, unit: 'ms' },
      timingFunction: fitCubicBezier(p, p.settleMs),
    },
    $extensions: {
      'design.standby.spring': {
        response: p.response,
        dampingFraction: p.damping,
        stiffness: Math.round(stiffnessOf(p) * 10) / 10,
        overshoot: Math.round(p.overshoot * 1000) / 1000,
      },
    },
  });
  const alias = (kind: string, speed: string) => ({ $type: 'transition', $value: `{motion.${kind}.${speed}}` });

  const spatial: Record<string, unknown> = {};
  const effect: Record<string, unknown> = {};
  for (const p of primitives) (p.kind === 'spatial' ? spatial : effect)[p.speed] = primitiveToken(p);

  const semantic: Record<string, unknown> = {};
  const reduced: Record<string, unknown> = {};
  for (const s of SEMANTIC_MOTION) {
    const parts = semanticParts(s, primitives);
    const full = parts.spatial && parts.effect
      ? { spatial: alias('spatial', s.spatial!), effect: alias('effect', s.effect!) }
      : parts.spatial ? alias('spatial', s.spatial!) : alias('effect', s.effect!);
    const r = reducedMotionFor(s);
    const reducedToken = {
      ...alias('effect', r.effect),
      $description: r.strategy === 'crossfade' ? 'Crossfade old and new state instead of moving' : 'Effect only, the path jumps',
    };
    setPath(semantic, s.name, { ...(full as object), $description: s.description });
    setPath(reduced, s.name, reducedToken);
  }

  const doc = {
    motion: {
      $description: headerLines(opts).join(' · '),
      spatial,
      effect,
      ...semantic,
      reduced: { $description: 'Reduced motion: no paths. Effects stay, spatial-only tokens become a crossfade. Use when prefers-reduced-motion is set.', ...reduced },
    },
  };
  return JSON.stringify(doc, null, 2) + '\n';
}

function setPath(target: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split('.');
  let node = target;
  for (const key of keys.slice(0, -1)) {
    node[key] = (node[key] as Record<string, unknown>) ?? {};
    node = node[key] as Record<string, unknown>;
  }
  node[keys[keys.length - 1]] = value;
}
