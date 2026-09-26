export interface Spring {
  response: number;
  damping: number;
}

export type SpringKind = 'spatial' | 'effect';
export type SpringSpeed = 'fast' | 'default' | 'slow';
export type PrimitiveName = `${SpringKind}.${SpringSpeed}`;

export interface MotionPrimitive extends Spring {
  name: PrimitiveName;
  kind: SpringKind;
  speed: SpringSpeed;
  settleMs: number;
  overshoot: number;
}

export interface MotionCharacter {
  energy: number;
  material: number;
}

export interface MotionPreset extends MotionCharacter {
  id: string;
  label: string;
  seenIn: string;
}

export const MOTION_PRESETS: MotionPreset[] = [
  { id: 'calm-firm', label: 'Calm · firm', energy: 0.15, material: 0.15, seenIn: 'premium, finance, luxury' },
  { id: 'calm-elastic', label: 'Calm · elastic', energy: 0.15, material: 0.85, seenIn: 'wellness, lifestyle' },
  { id: 'balanced', label: 'Balanced', energy: 0.5, material: 0.5, seenIn: 'most products' },
  { id: 'lively-firm', label: 'Lively · firm', energy: 0.85, material: 0.15, seenIn: 'productivity, sports, dev tools' },
  { id: 'lively-elastic', label: 'Lively · elastic', energy: 0.85, material: 0.85, seenIn: 'playful consumer apps, games' },
];

export const DEFAULT_MOTION_CHARACTER: MotionCharacter = { energy: 0.5, material: 0.5 };

export const CALM_RESPONSE = 0.6;
export const LIVELY_RESPONSE = 0.25;
export const FIRM_DAMPING = 1;
export const ELASTIC_DAMPING = 0.6;
export const SPEED_STEP = 1.5;
export const EFFECT_SPEEDUP = 1.5;

const SETTLE_TOLERANCE = 0.002;
const SETTLE_STEP_MS = 2;
const SETTLE_LIMIT_MS = 8000;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const round = (v: number, digits: number) => {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
};

export function presetFor(c: MotionCharacter): MotionPreset | undefined {
  return MOTION_PRESETS.find((p) => Math.abs(p.energy - c.energy) < 0.005 && Math.abs(p.material - c.material) < 0.005);
}

export function responseForEnergy(energy: number): number {
  return CALM_RESPONSE * (LIVELY_RESPONSE / CALM_RESPONSE) ** clamp01(energy);
}

export function dampingForMaterial(material: number): number {
  return FIRM_DAMPING + (ELASTIC_DAMPING - FIRM_DAMPING) * clamp01(material);
}

export function springOffset(response: number, damping: number, x0: number, v0: number): (sec: number) => number {
  const w0 = (2 * Math.PI) / response;
  if (damping >= 1) {
    return (t) => Math.exp(-w0 * t) * (x0 + (v0 + w0 * x0) * t);
  }
  const wd = w0 * Math.sqrt(1 - damping * damping);
  return (t) => Math.exp(-damping * w0 * t) * (x0 * Math.cos(wd * t) + ((v0 + damping * w0 * x0) / wd) * Math.sin(wd * t));
}

export function springProgress(s: Spring): (sec: number) => number {
  const offset = springOffset(s.response, s.damping, -1, 0);
  return (t) => (t <= 0 ? 0 : 1 + offset(t));
}

export function settleMs(fn: (sec: number) => number, rest = 1): number {
  let last = 16;
  for (let t = 0; t <= SETTLE_LIMIT_MS; t += SETTLE_STEP_MS) {
    if (Math.abs(fn(t / 1000) - rest) > SETTLE_TOLERANCE) last = t;
  }
  return last;
}

export function overshootOf(s: Spring): number {
  if (s.damping >= 1) return 0;
  return Math.exp((-s.damping * Math.PI) / Math.sqrt(1 - s.damping * s.damping));
}

export function stiffnessOf(s: Spring): number {
  return (2 * Math.PI / s.response) ** 2;
}

export function dampingCoefficientOf(s: Spring): number {
  return 2 * s.damping * Math.sqrt(stiffnessOf(s));
}

function primitive(kind: SpringKind, speed: SpringSpeed, response: number, damping: number): MotionPrimitive {
  const spring = { response: round(response, 3), damping: round(damping, 3) };
  return {
    name: `${kind}.${speed}`,
    kind,
    speed,
    ...spring,
    settleMs: settleMs(springProgress(spring)),
    overshoot: overshootOf(spring),
  };
}

const SPEED_FACTORS: Record<SpringSpeed, number> = { fast: 1 / SPEED_STEP, default: 1, slow: SPEED_STEP };
export const SPEEDS: SpringSpeed[] = ['fast', 'default', 'slow'];

export function computeMotionPrimitives(c: MotionCharacter): MotionPrimitive[] {
  const base = responseForEnergy(c.energy);
  const damping = dampingForMaterial(c.material);
  const spatial = SPEEDS.map((speed) => primitive('spatial', speed, base * SPEED_FACTORS[speed], damping));
  const effect = SPEEDS.map((speed) => primitive('effect', speed, (base * SPEED_FACTORS[speed]) / EFFECT_SPEEDUP, 1));
  return [...spatial, ...effect];
}

export type SemanticGroup = 'basic' | 'pattern';

export interface SemanticMotion {
  name: string;
  group: SemanticGroup;
  description: string;
  spatial?: SpringSpeed;
  effect?: SpringSpeed;
  axis?: 'x' | 'y';
  direction?: 1 | -1;
}

export const SEMANTIC_MOTION: SemanticMotion[] = [
  { name: 'press', group: 'basic', description: 'Instant feedback on touch or click', spatial: 'fast' },
  { name: 'move', group: 'basic', description: 'An element changes position', spatial: 'default' },
  { name: 'expand', group: 'basic', description: 'An element grows or collapses', spatial: 'slow' },
  { name: 'enter', group: 'basic', description: 'An element appears', spatial: 'default', effect: 'default' },
  { name: 'exit', group: 'basic', description: 'An element leaves, faster than it came', effect: 'fast' },
  { name: 'fade', group: 'basic', description: 'Color or opacity change without movement', effect: 'default' },
  { name: 'navigate.forward', group: 'pattern', description: 'Push to the next screen', spatial: 'slow', effect: 'fast', axis: 'x', direction: 1 },
  { name: 'navigate.back', group: 'pattern', description: 'Return to the previous screen', spatial: 'slow', effect: 'fast', axis: 'x', direction: -1 },
  { name: 'sheet.open', group: 'pattern', description: 'A sheet slides up', spatial: 'slow', effect: 'fast', axis: 'y', direction: 1 },
  { name: 'sheet.close', group: 'pattern', description: 'A sheet slides down', spatial: 'default', effect: 'fast', axis: 'y', direction: -1 },
  { name: 'container', group: 'pattern', description: 'A card grows into a screen', spatial: 'slow', effect: 'default' },
];

export function findPrimitive(primitives: MotionPrimitive[], kind: SpringKind, speed: SpringSpeed): MotionPrimitive {
  return primitives.find((p) => p.kind === kind && p.speed === speed)!;
}

export function semanticRefs(s: SemanticMotion): string {
  return [s.spatial && `spatial.${s.spatial}`, s.effect && `effect.${s.effect}`].filter(Boolean).join(' + ');
}

export type ReducedStrategy = 'effect-only' | 'crossfade';

export interface ReducedMotion {
  strategy: ReducedStrategy;
  effect: SpringSpeed;
}

export function reducedMotionFor(s: SemanticMotion): ReducedMotion {
  if (s.effect) return { strategy: 'effect-only', effect: s.effect };
  return { strategy: 'crossfade', effect: s.spatial! };
}

export function cssLinearEasing(s: Spring, durationMs: number, points = 48): string {
  const fn = springProgress(s);
  const values: string[] = [];
  for (let i = 0; i <= points; i++) {
    const v = i === points ? 1 : fn(((i / points) * durationMs) / 1000);
    values.push(String(round(v, 3)));
  }
  return `linear(${values.join(', ')})`;
}

function bezierAxis(p1: number, p2: number, t: number): number {
  const u = 1 - t;
  return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
}

export function cubicBezierAt(x1: number, y1: number, x2: number, y2: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let lo = 0;
  let hi = 1;
  let t = x;
  for (let i = 0; i < 24; i++) {
    t = (lo + hi) / 2;
    if (bezierAxis(x1, x2, t) < x) lo = t;
    else hi = t;
  }
  return bezierAxis(y1, y2, t);
}

export type Bezier = [number, number, number, number];

export function fitCubicBezier(s: Spring, durationMs: number): Bezier {
  const fn = springProgress(s);
  const samples = 40;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 1; i < samples; i++) {
    const x = i / samples;
    xs.push(x);
    ys.push(fn((x * durationMs) / 1000));
  }
  const error = (b: Bezier) => {
    let sum = 0;
    for (let i = 0; i < xs.length; i++) {
      const d = cubicBezierAt(b[0], b[1], b[2], b[3], xs[i]) - ys[i];
      sum += d * d;
    }
    return sum;
  };
  const yMax = s.damping >= 1 ? 1 : 2;
  const limits: [number, number][] = [[0, 1], [0, yMax], [0, 1], [0, yMax]];
  let best: Bezier = [0.2, 0.6, 0.2, 1];
  let bestErr = error(best);
  let step = 0.25;
  while (step > 0.0005) {
    let improved = false;
    for (let axis = 0; axis < 4; axis++) {
      for (const dir of [-1, 1]) {
        const next = [...best] as Bezier;
        next[axis] = Math.min(limits[axis][1], Math.max(limits[axis][0], next[axis] + dir * step));
        const e = error(next);
        if (e < bestErr) {
          best = next;
          bestErr = e;
          improved = true;
        }
      }
    }
    if (!improved) step /= 2;
  }
  return best.map((v) => round(v, 3)) as Bezier;
}

export function reversedProgress(s: Spring, turnSec: number): (sec: number) => number {
  const forward = springProgress(s);
  const p0 = forward(turnSec);
  const v0 = (forward(turnSec) - forward(turnSec - 0.001)) / 0.001;
  const back = springOffset(s.response, s.damping, p0, v0);
  return (t) => (t < turnSec ? forward(t) : back(t - turnSec));
}
