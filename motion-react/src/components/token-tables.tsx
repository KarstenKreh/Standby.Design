import { SEMANTIC_MOTION, semanticRefs, springProgress, type MotionPrimitive } from '@core/motion';
import { useMotionStore } from '@/store/motion-store';
import { useMotionPrimitives } from '@/hooks/use-motion-primitives';
import { SPATIAL_COLOR, EFFECT_COLOR } from '@/components/motion-graph';
import { cn } from '@/lib/utils';

function Sparkline({ p }: { p: MotionPrimitive }) {
  const fn = springProgress(p);
  const w = 72;
  const h = 24;
  const pts: string[] = [];
  for (let i = 0; i <= 36; i++) {
    const t = (i / 36) * p.settleMs;
    const v = fn(t / 1000);
    pts.push(`${((i / 36) * w).toFixed(1)},${(h - 3 - v * (h - 8)).toFixed(1)}`);
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <line x1={0} x2={w} y1={5} y2={5} stroke="var(--border)" strokeWidth={0.5} />
      <polyline points={pts.join(' ')} fill="none" stroke={p.kind === 'spatial' ? SPATIAL_COLOR : EFFECT_COLOR} strokeWidth={1.5} />
    </svg>
  );
}

const rowClass = (active: boolean) => cn(
  'border-t border-border cursor-pointer transition-colors',
  active ? 'bg-primary/10' : 'hover:bg-muted/50',
);

export function PrimitiveTable() {
  const primitives = useMotionPrimitives();
  const previewToken = useMotionStore((s) => s.previewToken);
  const setPreviewToken = useMotionStore((s) => s.setPreviewToken);

  return (
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
            <tr key={p.name} className={rowClass(previewToken === p.name)} onClick={() => setPreviewToken(p.name)}>
              <td className="py-1.5 pr-3 font-mono">{p.name}</td>
              <td className="py-1.5 pr-3 font-mono">{p.response.toFixed(3)} s</td>
              <td className="py-1.5 pr-3 font-mono">{p.damping.toFixed(2)}</td>
              <td className="py-1.5 pr-3 font-mono">{p.settleMs} ms</td>
              <td className="py-1.5 pr-3 font-mono">{(p.overshoot * 100).toFixed(1)} %</td>
              <td className="py-1"><Sparkline p={p} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-caption text-muted-foreground mt-3">
        Spatial springs move things and may overshoot. Effect springs change opacity or color, run 1.5× faster and never overshoot. Fast, default and slow sit a factor of 1.5 apart.
      </p>
    </div>
  );
}

export function SemanticTable() {
  const previewToken = useMotionStore((s) => s.previewToken);
  const setPreviewToken = useMotionStore((s) => s.setPreviewToken);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-caption">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="font-medium py-1.5 pr-3">Token</th>
            <th className="font-medium py-1.5 pr-3">Uses</th>
            <th className="font-medium py-1.5">When</th>
          </tr>
        </thead>
        <tbody>
          {SEMANTIC_MOTION.map((s) => (
            <tr key={s.name} className={rowClass(previewToken === s.name)} onClick={() => setPreviewToken(s.name)}>
              <td className="py-1.5 pr-3 font-mono">motion.{s.name}</td>
              <td className="py-1.5 pr-3 font-mono">{semanticRefs(s)}</td>
              <td className="py-1.5 text-muted-foreground">{s.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
