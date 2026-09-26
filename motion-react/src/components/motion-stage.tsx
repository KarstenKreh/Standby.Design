import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { PreviewModel } from '@/lib/preview-model';
import { SPATIAL_COLOR } from '@/components/motion-graph';

const STAGE_H = 200;
const PAD = 16;
const SIZE = 56;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface MotionStageProps {
  model: PreviewModel;
  timeMs: number | null;
  onInterrupt: () => void;
}

const box: CSSProperties = {
  position: 'absolute',
  background: SPATIAL_COLOR,
  borderRadius: 14,
  willChange: 'transform, opacity, width, height',
};

const ghost: CSSProperties = {
  position: 'absolute',
  border: '1px dashed var(--border)',
  borderRadius: 14,
};

function Lines({ opacity = 1 }: { opacity?: number }) {
  return (
    <div className="absolute inset-4 grid gap-2 content-start" style={{ opacity }}>
      <div className="h-3 w-2/5 rounded bg-black/30" />
      <div className="h-2 w-full rounded bg-black/20" />
      <div className="h-2 w-3/4 rounded bg-black/20" />
    </div>
  );
}

function Screen({ label, style }: { label: string; style: CSSProperties }) {
  return (
    <div className="absolute inset-0 rounded-md border border-border bg-card p-4" style={style}>
      <div className="text-caption font-semibold mb-2">{label}</div>
      <div className="grid gap-2">
        <div className="h-2 w-3/4 rounded bg-muted" />
        <div className="h-2 w-1/2 rounded bg-muted" />
        <div className="h-8 w-full rounded mt-2" style={{ background: SPATIAL_COLOR, opacity: 0.35 }} />
      </div>
    </div>
  );
}

export function MotionStage({ model, timeMs, onInterrupt }: MotionStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const t = timeMs ?? Infinity;
  const fx = model.effect ? model.effect.at(t) : 1;
  const fxOpacity = clamp01(fx);
  const travel = width - 2 * PAD - SIZE;
  const midY = (STAGE_H - SIZE) / 2;

  const renderDemo = (sp: number): ReactNode => {
    let content: ReactNode = null;
    switch (model.demo) {
      case 'press': {
        const scale = 1 - 0.14 * sp;
        content = (
          <div
            className="absolute rounded-lg px-6 py-3 text-body-s font-semibold text-black"
            style={{ left: '50%', top: '50%', background: SPATIAL_COLOR, transform: `translate(-50%, -50%) scale(${scale})` }}
          >
            Press
          </div>
        );
        break;
      }
      case 'move':
        content = (
          <>
            <div style={{ ...ghost, left: PAD, top: midY, width: SIZE, height: SIZE }} />
            <div style={{ ...ghost, left: PAD + travel, top: midY, width: SIZE, height: SIZE }} />
            <div style={{ ...box, left: PAD, top: midY, width: SIZE, height: SIZE, transform: `translateX(${sp * travel}px)` }} />
          </>
        );
        break;
      case 'expand':
      case 'container': {
        const w = Math.max(12, SIZE + sp * (width - 2 * PAD - SIZE));
        const h = Math.max(12, SIZE + sp * (STAGE_H - 2 * PAD - SIZE));
        const radius = Math.max(6, 18 - sp * 10);
        content = (
          <div style={{ ...box, right: PAD, bottom: PAD, width: w, height: h, borderRadius: radius, overflow: 'hidden' }}>
            {model.demo === 'container' ? <Lines opacity={fxOpacity} /> : <Lines opacity={clamp01((sp - 0.5) * 2)} />}
          </div>
        );
        break;
      }
      case 'enter':
        content = (
          <div style={{ ...box, left: '50%', top: midY - 10, width: 180, height: SIZE + 20, marginLeft: -90, opacity: fxOpacity, transform: `translateY(${(1 - sp) * 48}px)` }}>
            <Lines />
          </div>
        );
        break;
      case 'exit':
        content = (
          <div style={{ ...box, left: '50%', top: midY - 10, width: 180, height: SIZE + 20, marginLeft: -90, opacity: 1 - fxOpacity }}>
            <Lines />
          </div>
        );
        break;
      case 'fade':
        content = (
          <>
            <div style={{ ...box, left: '50%', top: midY - 10, width: 180, height: SIZE + 20, marginLeft: -90, background: 'var(--muted)', opacity: 1 - fxOpacity }} />
            <div style={{ ...box, left: '50%', top: midY - 10, width: 180, height: SIZE + 20, marginLeft: -90, opacity: fxOpacity }}>
              <Lines />
            </div>
          </>
        );
        break;
      case 'navigate': {
        const dir = model.direction;
        const inner = width - 2 * PAD;
        content = (
          <div className="absolute" style={{ inset: PAD }}>
            <Screen label={dir === 1 ? 'List' : 'Detail'} style={{ transform: `translateX(${-dir * sp * inner * 0.3}px)`, opacity: 1 - fxOpacity }} />
            <Screen label={dir === 1 ? 'Detail' : 'List'} style={{ transform: `translateX(${dir * (1 - sp) * (inner + PAD)}px)`, opacity: fxOpacity }} />
          </div>
        );
        break;
      }
      case 'sheet': {
        const opening = model.direction === 1;
        const sheetH = STAGE_H * 0.62;
        const shown = opening ? sp : 1 - sp;
        const backdrop = opening ? fxOpacity : 1 - fxOpacity;
        content = (
          <>
            <Screen label="Screen" style={{ inset: PAD }} />
            <div className="absolute inset-0 bg-black" style={{ opacity: 0.45 * backdrop }} />
            <div
              className="absolute left-0 right-0 bottom-0 rounded-t-xl border border-border bg-card p-4"
              style={{ height: sheetH, transform: `translateY(${(1 - shown) * (sheetH + 8)}px)` }}
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded bg-muted-foreground/40" />
              <div className="h-2 w-2/3 rounded bg-muted mb-2" />
              <div className="h-2 w-1/2 rounded bg-muted" />
            </div>
          </>
        );
        break;
      }
      case 'effect':
        content = <div style={{ ...box, left: '50%', top: midY, width: SIZE, height: SIZE, marginLeft: -SIZE / 2, opacity: fxOpacity }} />;
        break;
    }
    return content;
  };

  const crossfade = model.crossfade ? clamp01(model.crossfade.at(t)) : null;
  const body = crossfade === null
    ? renderDemo(model.spatial ? model.spatial.at(t) : 1)
    : (
      <>
        <div className="absolute inset-0" style={{ opacity: 1 - crossfade }}>{renderDemo(0)}</div>
        <div className="absolute inset-0" style={{ opacity: crossfade }}>{renderDemo(1)}</div>
      </>
    );

  return (
    <div
      ref={ref}
      onClick={onInterrupt}
      className="relative overflow-hidden rounded-md border border-border bg-background cursor-pointer select-none"
      style={{ height: STAGE_H }}
      title="Click while it moves to reverse it"
    >
      {body}
    </div>
  );
}
