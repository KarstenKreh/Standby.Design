import { describe, it, expect } from 'vitest';
import {
  CALM_RESPONSE,
  LIVELY_RESPONSE,
  MOTION_PRESETS,
  SEMANTIC_MOTION,
  computeMotionPrimitives,
  cubicBezierAt,
  dampingForMaterial,
  findPrimitive,
  fitCubicBezier,
  presetFor,
  reducedMotionFor,
  responseForEnergy,
  reversedProgress,
  springProgress,
} from './motion';
import {
  generateMotionCompose,
  generateMotionCss,
  generateMotionDesignTokens,
  generateMotionJs,
  generateMotionSwiftUI,
} from './motion-code-export';
import { decodeState, encodeState, DEFAULT_MOTION_URL_STATE } from './url-state/motion';

describe('motion character axes', () => {
  it('energy maps calm to the slow response and lively to the fast one', () => {
    expect(responseForEnergy(0)).toBeCloseTo(CALM_RESPONSE);
    expect(responseForEnergy(1)).toBeCloseTo(LIVELY_RESPONSE);
    expect(responseForEnergy(0.5)).toBeLessThan(CALM_RESPONSE);
    expect(responseForEnergy(0.5)).toBeGreaterThan(LIVELY_RESPONSE);
  });

  it('material maps firm to critical damping and elastic to overshoot', () => {
    expect(dampingForMaterial(0)).toBe(1);
    expect(dampingForMaterial(1)).toBeLessThan(1);
  });
});

describe('computeMotionPrimitives', () => {
  const primitives = computeMotionPrimitives({ energy: 0.5, material: 0.5 });

  it('returns three spatial and three effect springs', () => {
    expect(primitives.map((p) => p.name)).toEqual([
      'spatial.fast', 'spatial.default', 'spatial.slow',
      'effect.fast', 'effect.default', 'effect.slow',
    ]);
  });

  it('spaces fast, default and slow by a factor of 1.5', () => {
    const fast = findPrimitive(primitives, 'spatial', 'fast');
    const def = findPrimitive(primitives, 'spatial', 'default');
    const slow = findPrimitive(primitives, 'spatial', 'slow');
    expect(def.response / fast.response).toBeCloseTo(1.5, 1);
    expect(slow.response / def.response).toBeCloseTo(1.5, 1);
  });

  it('effect springs never overshoot and run faster than spatial ones', () => {
    for (const speed of ['fast', 'default', 'slow'] as const) {
      const effect = findPrimitive(primitives, 'effect', speed);
      const spatial = findPrimitive(primitives, 'spatial', speed);
      expect(effect.damping).toBe(1);
      expect(effect.overshoot).toBe(0);
      expect(effect.response).toBeLessThan(spatial.response);
    }
  });

  it('an effect spring stays at or below its target', () => {
    const effect = findPrimitive(primitives, 'effect', 'slow');
    const fn = springProgress(effect);
    for (let t = 0; t < 2; t += 0.01) expect(fn(t)).toBeLessThanOrEqual(1 + 1e-9);
  });

  it('an elastic spatial spring overshoots', () => {
    const elastic = computeMotionPrimitives({ energy: 0.5, material: 1 });
    expect(findPrimitive(elastic, 'spatial', 'default').overshoot).toBeGreaterThan(0.05);
  });

  it('settle time grows with a calmer energy', () => {
    const calm = findPrimitive(computeMotionPrimitives({ energy: 0, material: 0 }), 'spatial', 'default');
    const lively = findPrimitive(computeMotionPrimitives({ energy: 1, material: 0 }), 'spatial', 'default');
    expect(calm.settleMs).toBeGreaterThan(lively.settleMs);
  });
});

describe('semantic motion', () => {
  it('maps every semantic token to at least one primitive', () => {
    for (const s of SEMANTIC_MOTION) expect(s.spatial || s.effect).toBeTruthy();
  });

  it('exit is an effect only and faster than enter', () => {
    const exit = SEMANTIC_MOTION.find((s) => s.name === 'exit')!;
    expect(exit.spatial).toBeUndefined();
    expect(exit.effect).toBe('fast');
  });
});

describe('reducedMotionFor', () => {
  it('turns spatial-only tokens into a crossfade of the same speed', () => {
    const move = SEMANTIC_MOTION.find((s) => s.name === 'move')!;
    expect(reducedMotionFor(move)).toEqual({ strategy: 'crossfade', effect: 'default' });
  });

  it('keeps the effect part of tokens that have one', () => {
    const nav = SEMANTIC_MOTION.find((s) => s.name === 'navigate.forward')!;
    expect(reducedMotionFor(nav)).toEqual({ strategy: 'effect-only', effect: 'fast' });
  });
});

describe('presets', () => {
  it('has four corners and a balanced middle', () => {
    expect(MOTION_PRESETS).toHaveLength(5);
    expect(presetFor({ energy: 0.5, material: 0.5 })?.id).toBe('balanced');
    expect(presetFor({ energy: 0.42, material: 0.5 })).toBeUndefined();
  });
});

describe('fitCubicBezier', () => {
  it('approximates a critically damped spring closely', () => {
    const spring = { response: 0.3, damping: 1 };
    const duration = 500;
    const [x1, y1, x2, y2] = fitCubicBezier(spring, duration);
    const fn = springProgress(spring);
    for (let i = 1; i < 10; i++) {
      const x = i / 10;
      expect(Math.abs(cubicBezierAt(x1, y1, x2, y2, x) - fn((x * duration) / 1000))).toBeLessThan(0.06);
    }
  });
});

describe('fitCubicBezier for effects', () => {
  it('never produces a curve above the target for a critically damped spring', () => {
    const [, y1, , y2] = fitCubicBezier({ response: 0.25, damping: 1 }, 350);
    expect(y1).toBeLessThanOrEqual(1);
    expect(y2).toBeLessThanOrEqual(1);
  });
});

describe('reversedProgress', () => {
  it('keeps the velocity at the turn and comes back to the start', () => {
    const spring = { response: 0.4, damping: 0.8 };
    const fn = reversedProgress(spring, 0.1);
    const before = fn(0.1) - fn(0.099);
    const after = fn(0.101) - fn(0.1);
    expect(Math.abs(after - before)).toBeLessThan(0.002);
    expect(Math.abs(fn(3))).toBeLessThan(0.002);
  });
});

describe('motion url-state', () => {
  it('encodes the default as two percentages', () => {
    expect(encodeState(DEFAULT_MOTION_URL_STATE)).toBe('50,50');
  });

  it('round-trips a custom character', () => {
    expect(decodeState(encodeState({ energy: 0.85, material: 0.15 }))).toEqual({ energy: 0.85, material: 0.15 });
  });

  it('clamps values out of range and rejects garbage', () => {
    expect(decodeState('140,-3')).toEqual({ energy: 1, material: 0 });
    expect(decodeState('abc')).toBeNull();
    expect(decodeState('')).toBeNull();
  });
});

describe('motion exports', () => {
  const opts = { character: { energy: 0.5, material: 0.5 }, primitives: computeMotionPrimitives({ energy: 0.5, material: 0.5 }) };

  it('CSS has linear() springs, a bezier fallback and a reduced-motion block', () => {
    const css = generateMotionCss(opts);
    expect(css).toContain('--motion-spatial-fast-easing: linear(');
    expect(css).toContain('--motion-press: var(--motion-spatial-fast);');
    expect(css).toContain('--motion-enter-effect: var(--motion-effect-default);');
    expect(css).toContain('@supports not (transition-timing-function: linear(0, 1))');
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*--motion-spatial-slow-duration: 0ms/);
    expect(css).not.toMatch(/prefers-reduced-motion[\s\S]*--motion-effect-fast-duration: 0ms/);
    expect(css).toContain('--motion-move-reduced: var(--motion-effect-default);');
    expect(css).not.toContain('--motion-enter-reduced');
  });

  it('SwiftUI, Compose and Motion use the same springs', () => {
    expect(generateMotionSwiftUI(opts)).toContain('static let spatialFast = Animation.spring(response:');
    expect(generateMotionCompose(opts)).toContain('fun <T> effectDefault(): SpringSpec<T> = spring(dampingRatio = 1f');
    expect(generateMotionJs(opts)).toContain('"navigate.forward": { ...spatial.slow, opacity: effect.fast }');
  });

  it('design tokens are valid JSON with aliases and a reduced group', () => {
    const doc = JSON.parse(generateMotionDesignTokens(opts));
    expect(doc.motion.press.$value).toBe('{motion.spatial.fast}');
    expect(doc.motion.navigate.forward.spatial.$value).toBe('{motion.spatial.slow}');
    expect(doc.motion.reduced.enter.$value).toBe('{motion.effect.default}');
    expect(doc.motion.reduced.press.$value).toBe('{motion.effect.fast}');
    expect(doc.motion.reduced.expand.$value).toBe('{motion.effect.slow}');
    expect(doc.motion.spatial.fast.$value.timingFunction).toHaveLength(4);
  });
});
