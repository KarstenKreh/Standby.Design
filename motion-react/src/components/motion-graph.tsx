import { useMemo } from 'react';
import type { PreviewModel, Track } from '@/lib/preview-model';

export const SPATIAL_COLOR = 'oklch(0.72 0.13 250)';
export const EFFECT_COLOR = 'var(--foreground)';

const W = 560;
const H = 220;
const PAD = { l: 44, r: 12, t: 14, b: 26 };
const SAMPLES = 240;

interface MotionGraphProps {
  model: PreviewModel;
  axisMs: number;
  turnMs: number | null;
  playheadMs: number | null;
}

function tempoSamples(track: Track, axisMs: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = (i / SAMPLES) * axisMs;
    out.push([t, Math.abs(track.at(t + 1) - track.at(t))]);
  }
  return out;
}

function valueRange(model: PreviewModel, axisMs: number): [number, number] {
  let lo = 0;
  let hi = 1;
  for (const track of [model.spatial, model.effect, model.crossfade]) {
    if (!track) continue;
    for (let i = 0; i <= SAMPLES; i++) {
      const v = track.at((i / SAMPLES) * axisMs);
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
  }
  return [Math.min(-0.12, lo - 0.08), Math.max(1.2, hi + 0.08)];
}

export function MotionGraph({ model, axisMs, turnMs, playheadMs }: MotionGraphProps) {
  const [yMin, yMax] = useMemo(() => valueRange(model, axisMs), [model, axisMs]);
  const gx = (ms: number) => PAD.l + (Math.min(ms, axisMs) / axisMs) * (W - PAD.l - PAD.r);
  const gy = (v: number) => PAD.t + (1 - (v - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);

  const primary = model.spatialReduced ? model.effect ?? model.crossfade ?? model.spatial : model.spatial ?? model.effect;
  const primaryColor = primary === model.spatial && !model.spatialReduced ? SPATIAL_COLOR : EFFECT_COLOR;

  const paths = useMemo(() => {
    const line = (track: Track) => {
      const pts: string[] = [];
      for (let i = 0; i <= SAMPLES; i++) {
        const t = (i / SAMPLES) * axisMs;
        pts.push(`${gx(t).toFixed(1)},${gy(track.at(t)).toFixed(1)}`);
      }
      return pts.join(' ');
    };
    let tempo = '';
    if (primary) {
      const samples = tempoSamples(primary, axisMs);
      const max = Math.max(...samples.map(([, v]) => v)) || 1;
      tempo = samples.map(([t, v]) => `${gx(t).toFixed(1)},${gy((v / max) * 0.9).toFixed(1)}`).join(' ');
    }
    return {
      spatial: model.spatial ? line(model.spatial) : '',
      effect: model.effect ? line(model.effect) : '',
      crossfade: model.crossfade ? line(model.crossfade) : '',
      tempo,
    };
  }, [model, axisMs, yMin, yMax, primary]);

  const step = axisMs > 3000 ? 1000 : axisMs > 1500 ? 500 : axisMs > 600 ? 250 : 100;
  const ticks: number[] = [];
  for (let t = 0; t <= axisMs + 0.5; t += step) ticks.push(t);

  const settle = Math.max(model.spatial?.settleMs ?? 0, model.effect?.settleMs ?? 0, model.crossfade?.settleMs ?? 0);
  const settleX = gx(settle);
  const settleNearEnd = settleX > W - 110;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block bg-background border border-border rounded-md" role="img" aria-label="Motion curve over time">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={gx(t)} x2={gx(t)} y1={PAD.t} y2={H - PAD.b} stroke="var(--border)" strokeWidth={0.5} opacity={0.6} />
          <text x={gx(t)} y={H - 9} textAnchor="middle" className="fill-muted-foreground" fontSize={10} fontFamily="var(--font-mono, monospace)">{t}</text>
        </g>
      ))}
      <line x1={PAD.l} x2={W - PAD.r} y1={gy(0)} y2={gy(0)} stroke="var(--border)" />
      <line x1={PAD.l} x2={W - PAD.r} y1={gy(1)} y2={gy(1)} stroke="var(--border)" />
      <text x={PAD.l - 6} y={gy(0) + 3} textAnchor="end" className="fill-muted-foreground" fontSize={10}>Start</text>
      <text x={PAD.l - 6} y={gy(1) + 3} textAnchor="end" className="fill-muted-foreground" fontSize={10}>Target</text>

      <line x1={settleX} x2={settleX} y1={PAD.t} y2={H - PAD.b} stroke={primaryColor} strokeDasharray="2 3" opacity={0.7} />
      <text x={settleNearEnd ? settleX - 4 : settleX + 4} y={PAD.t + 9} textAnchor={settleNearEnd ? 'end' : 'start'} fill={primaryColor} fontSize={10}>
        at rest · {settle} ms
      </text>

      {turnMs !== null && (
        <g>
          <line x1={gx(turnMs)} x2={gx(turnMs)} y1={PAD.t} y2={H - PAD.b} stroke="var(--foreground)" strokeDasharray="1 2" opacity={0.7} />
          <text x={gx(turnMs) + 4} y={PAD.t + 24} fill="var(--foreground)" fontSize={10}>interrupted</text>
        </g>
      )}

      {paths.tempo && <polyline points={paths.tempo} fill="none" stroke={primaryColor} strokeWidth={1.2} strokeDasharray="3 3" opacity={0.55} />}
      {paths.spatial && (
        <polyline points={paths.spatial} fill="none" stroke={SPATIAL_COLOR} strokeWidth={model.spatialReduced ? 1.2 : 2} opacity={model.spatialReduced ? 0.3 : 1} />
      )}
      {paths.effect && <polyline points={paths.effect} fill="none" stroke={EFFECT_COLOR} strokeWidth={1.6} opacity={0.9} />}
      {paths.crossfade && <polyline points={paths.crossfade} fill="none" stroke={EFFECT_COLOR} strokeWidth={1.6} opacity={0.9} />}

      {playheadMs !== null && (
        <g>
          <line x1={gx(playheadMs)} x2={gx(playheadMs)} y1={PAD.t} y2={H - PAD.b} stroke="var(--foreground)" strokeWidth={0.8} opacity={0.6} />
          {model.spatial && <circle cx={gx(playheadMs)} cy={gy(model.spatial.at(playheadMs))} r={4} fill={SPATIAL_COLOR} stroke="var(--background)" />}
          {model.effect && <circle cx={gx(playheadMs)} cy={gy(model.effect.at(playheadMs))} r={4} fill={EFFECT_COLOR} stroke="var(--background)" />}
          {model.crossfade && <circle cx={gx(playheadMs)} cy={gy(model.crossfade.at(playheadMs))} r={4} fill={EFFECT_COLOR} stroke="var(--background)" />}
        </g>
      )}
    </svg>
  );
}

export function GraphLegend({ model }: { model: PreviewModel }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1 text-caption text-muted-foreground">
      {model.spatial && (
        <span className="inline-flex items-center gap-2">
          <i className="inline-block w-5 border-t-2" style={{ borderColor: SPATIAL_COLOR }} />
          Spatial: position, size, rotation{model.spatialReduced ? ' (off: reduced motion)' : ''}
        </span>
      )}
      {model.crossfade && (
        <span className="inline-flex items-center gap-2">
          <i className="inline-block w-5 border-t-2 border-foreground" />
          Crossfade instead of the path · effect spring of the same speed
        </span>
      )}
      {model.effect && (
        <span className="inline-flex items-center gap-2">
          <i className="inline-block w-5 border-t-2 border-foreground" />
          Effect: opacity, color · ends exactly at 100 %
        </span>
      )}
      <span className="inline-flex items-center gap-2">
        <i className="inline-block w-5 border-t-2 border-dashed border-muted-foreground" />
        Tempo: how fast it moves right now
      </span>
    </div>
  );
}
