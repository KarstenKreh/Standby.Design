import { useState } from 'react';
import { SEMANTIC_MOTION, cssLinearEasing, findPrimitive, semanticRefs, springProgress, type MotionCharacter, type MotionPrimitive } from '@core/motion';
import { motionLabel } from '@core/motion-code-export';

const SPATIAL_COLOR = 'oklch(0.72 0.13 250)';
const EFFECT_COLOR = 'var(--foreground)';

function Sparkline({ p }: { p: MotionPrimitive }) {
  const fn = springProgress(p);
  const w = 72;
  const h = 24;
  const pts: string[] = [];
  for (let i = 0; i <= 36; i++) {
    const v = fn(((i / 36) * p.settleMs) / 1000);
    pts.push(`${((i / 36) * w).toFixed(1)},${(h - 3 - v * (h - 8)).toFixed(1)}`);
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <line x1={0} x2={w} y1={5} y2={5} stroke="var(--border)" strokeWidth={0.5} />
      <polyline points={pts.join(' ')} fill="none" stroke={p.kind === 'spatial' ? SPATIAL_COLOR : EFFECT_COLOR} strokeWidth={1.5} />
    </svg>
  );
}

function transitionOf(p: MotionPrimitive, property: string): string {
  return `${property} ${p.settleMs}ms ${cssLinearEasing(p, p.settleMs)}`;
}

function EnterDemo({ primitives }: { primitives: MotionPrimitive[] }) {
  const [shown, setShown] = useState(true);
  const move = findPrimitive(primitives, 'spatial', 'default');
  const enterEffect = findPrimitive(primitives, 'effect', 'default');
  const exitEffect = findPrimitive(primitives, 'effect', 'fast');

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setShown((v) => !v)}
        className="inline-flex items-center h-8 px-3 rounded-lg text-sm font-medium bg-muted text-foreground hover:bg-muted/80 transition-all cursor-pointer shrink-0"
      >
        {shown ? 'Exit' : 'Enter'}
      </button>
      <div className="relative h-10 flex-1 rounded-md bg-muted/30 border border-border/50 overflow-hidden">
        <div
          className="absolute top-1.5 left-2 h-7 w-20 rounded-md bg-primary"
          style={{
            transform: shown ? 'translateX(0)' : 'translateX(-2.5rem)',
            opacity: shown ? 1 : 0,
            transition: shown
              ? `${transitionOf(move, 'transform')}, ${transitionOf(enterEffect, 'opacity')}`
              : `${transitionOf(exitEffect, 'opacity')}, transform 0ms ${exitEffect.settleMs}ms`,
          }}
        />
      </div>
    </div>
  );
}

export function MotionSummary({ character, primitives }: { character: MotionCharacter; primitives: MotionPrimitive[] }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        {motionLabel(character)}. Springs, not durations: energy sets the tempo, material the overshoot of spatial motion.
      </p>

      <div>
        <h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground mb-2">Try it</h3>
        <EnterDemo primitives={primitives} />
        <p className="text-caption text-muted-foreground mt-2">
          motion.enter moves with spatial.default and fades with effect.default. motion.exit only fades, with effect.fast.
        </p>
      </div>

      <div>
        <h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground mb-2">Primitive springs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-caption">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="font-medium py-1.5 pr-3">Token</th>
                <th className="font-medium py-1.5 pr-3">Response</th>
                <th className="font-medium py-1.5 pr-3">Damping</th>
                <th className="font-medium py-1.5 pr-3">At rest</th>
                <th className="font-medium py-1.5 pr-3">Overshoot</th>
                <th className="font-medium py-1.5">Curve</th>
              </tr>
            </thead>
            <tbody>
              {primitives.map((p) => (
                <tr key={p.name} className="border-t border-border">
                  <td className="py-1.5 pr-3 font-mono">motion.{p.name}</td>
                  <td className="py-1.5 pr-3 font-mono">{p.response.toFixed(3)} s</td>
                  <td className="py-1.5 pr-3 font-mono">{p.damping.toFixed(2)}</td>
                  <td className="py-1.5 pr-3 font-mono">{p.settleMs} ms</td>
                  <td className="py-1.5 pr-3 font-mono">{(p.overshoot * 100).toFixed(1)} %</td>
                  <td className="py-1"><Sparkline p={p} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground mb-2">Semantic tokens</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-caption">
            <tbody>
              {SEMANTIC_MOTION.map((s) => (
                <tr key={s.name} className="border-t border-border">
                  <td className="py-1.5 pr-3 font-mono">motion.{s.name}</td>
                  <td className="py-1.5 pr-3 font-mono">{semanticRefs(s)}</td>
                  <td className="py-1.5 text-muted-foreground">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-caption text-muted-foreground mt-2">
          Reduced motion: paths jump, effects stay. press, move and expand crossfade instead.
        </p>
      </div>
    </div>
  );
}
