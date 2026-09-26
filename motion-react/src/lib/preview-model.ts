import {
  SEMANTIC_MOTION,
  findPrimitive,
  reversedProgress,
  settleMs,
  springProgress,
  type MotionPrimitive,
  type SemanticMotion,
  type SpringKind,
  type SpringSpeed,
} from '@core/motion';

export interface Track {
  at: (ms: number) => number;
  settleMs: number;
  primitive: MotionPrimitive;
}

export type DemoKind = 'press' | 'move' | 'expand' | 'enter' | 'exit' | 'fade' | 'navigate' | 'sheet' | 'container' | 'effect';

export interface PreviewModel {
  demo: DemoKind;
  direction: 1 | -1;
  spatial?: Track;
  effect?: Track;
  crossfade?: Track;
  spatialReduced: boolean;
}

function track(p: MotionPrimitive, turnMs: number | null, reduced: boolean): Track {
  if (reduced) {
    const at = (ms: number) => (ms <= 0 ? 0 : turnMs !== null && ms >= turnMs ? 0 : 1);
    return { at, settleMs: turnMs ?? 0, primitive: p };
  }
  if (turnMs === null) {
    const fn = springProgress(p);
    return { at: (ms) => fn(ms / 1000), settleMs: p.settleMs, primitive: p };
  }
  const fn = reversedProgress(p, turnMs / 1000);
  const total = settleMs(fn, 0);
  return { at: (ms) => fn(ms / 1000), settleMs: total, primitive: p };
}

function demoFor(s: SemanticMotion): DemoKind {
  const root = s.name.split('.')[0];
  return root as DemoKind;
}

export function previewTarget(name: string): { semantic?: SemanticMotion; kind?: SpringKind; speed?: SpringSpeed } {
  const semantic = SEMANTIC_MOTION.find((s) => s.name === name);
  if (semantic) return { semantic };
  const [kind, speed] = name.split('.') as [SpringKind, SpringSpeed];
  return { kind, speed };
}

export function buildPreviewModel(
  name: string,
  primitives: MotionPrimitive[],
  turnMs: number | null,
  reduceMotion: boolean,
): PreviewModel {
  const { semantic, kind, speed } = previewTarget(name);
  if (semantic) {
    const crossfadeSpeed = reduceMotion && semantic.spatial && !semantic.effect ? semantic.spatial : null;
    return {
      demo: demoFor(semantic),
      direction: semantic.direction ?? 1,
      spatial: semantic.spatial ? track(findPrimitive(primitives, 'spatial', semantic.spatial), turnMs, reduceMotion) : undefined,
      effect: semantic.effect ? track(findPrimitive(primitives, 'effect', semantic.effect), turnMs, false) : undefined,
      crossfade: crossfadeSpeed ? track(findPrimitive(primitives, 'effect', crossfadeSpeed), turnMs, false) : undefined,
      spatialReduced: reduceMotion && !!semantic.spatial,
    };
  }
  const p = findPrimitive(primitives, kind!, speed!);
  if (kind === 'spatial') {
    return {
      demo: 'move',
      direction: 1,
      spatial: track(p, turnMs, reduceMotion),
      crossfade: reduceMotion ? track(findPrimitive(primitives, 'effect', speed!), turnMs, false) : undefined,
      spatialReduced: reduceMotion,
    };
  }
  return { demo: 'effect', direction: 1, effect: track(p, turnMs, false), spatialReduced: false };
}

export function modelDuration(m: PreviewModel): number {
  return Math.max(m.spatial?.settleMs ?? 0, m.effect?.settleMs ?? 0, m.crossfade?.settleMs ?? 0);
}
