import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { SEMANTIC_MOTION, semanticRefs } from '@core/motion';
import { useMotionStore } from '@/store/motion-store';
import { useMotionPrimitives } from '@/hooks/use-motion-primitives';
import { buildPreviewModel, modelDuration, previewTarget } from '@/lib/preview-model';
import { MotionGraph, GraphLegend } from '@/components/motion-graph';
import { MotionStage } from '@/components/motion-stage';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const HOLD_MS = 600;
const SPEEDS = [1, 0.5, 0.25];

function TokenButton({ name, active, onClick }: { name: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 rounded-md text-caption font-mono border transition-colors cursor-pointer',
        active ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {name}
    </button>
  );
}

export function MotionPreview() {
  const primitives = useMotionPrimitives();
  const energy = useMotionStore((s) => s.energy);
  const material = useMotionStore((s) => s.material);
  const previewToken = useMotionStore((s) => s.previewToken);
  const setPreviewToken = useMotionStore((s) => s.setPreviewToken);

  const [speed, setSpeed] = useState(1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [turnMs, setTurnMs] = useState<number | null>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);
  const running = useRef(false);
  const startAt = useRef(0);
  const speedRef = useRef(speed);
  const axisRef = useRef(1000);
  speedRef.current = speed;

  const model = useMemo(
    () => buildPreviewModel(previewToken, primitives, turnMs, reduceMotion),
    [previewToken, primitives, turnMs, reduceMotion],
  );
  const axisMs = Math.max(400, Math.ceil((modelDuration(model) * 1.1) / 100) * 100);
  axisRef.current = axisMs;

  const frame = useCallback((now: number) => {
    if (!running.current) return;
    const t = (now - startAt.current) * speedRef.current;
    if (t < axisRef.current + HOLD_MS) {
      setTimeMs(t);
      requestAnimationFrame(frame);
    } else {
      running.current = false;
      setTimeMs(null);
    }
  }, []);

  const play = useCallback(() => {
    setTurnMs(null);
    setTimeMs(0);
    startAt.current = performance.now();
    if (!running.current) {
      running.current = true;
      requestAnimationFrame(frame);
    }
  }, [frame]);

  useEffect(() => {
    const id = setTimeout(play, 150);
    return () => clearTimeout(id);
  }, [previewToken, energy, material, reduceMotion, play]);

  useEffect(() => () => { running.current = false; }, []);

  const interrupt = useCallback(() => {
    if (!running.current || timeMs === null) return play();
    if (turnMs !== null || timeMs < 16 || timeMs > modelDuration(model)) return;
    setTurnMs(Math.round(timeMs));
  }, [timeMs, turnMs, model, play]);

  const { semantic } = previewTarget(previewToken);
  const basic = SEMANTIC_MOTION.filter((s) => s.group === 'basic');
  const patterns = SEMANTIC_MOTION.filter((s) => s.group === 'pattern');

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-caption text-muted-foreground w-16">Basic</span>
          {basic.map((s) => (
            <TokenButton key={s.name} name={s.name} active={previewToken === s.name} onClick={() => setPreviewToken(s.name)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-caption text-muted-foreground w-16">Patterns</span>
          {patterns.map((s) => (
            <TokenButton key={s.name} name={s.name} active={previewToken === s.name} onClick={() => setPreviewToken(s.name)} />
          ))}
        </div>
      </div>

      <p className="text-caption text-muted-foreground min-h-5">
        <span className="font-mono text-foreground">motion.{previewToken}</span>
        {semantic ? <> → {semanticRefs(semantic)} · {semantic.description}</> : <> · primitive spring</>}
      </p>

      <MotionStage model={model} timeMs={timeMs} onInterrupt={interrupt} />

      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={play} className="gap-1.5">
          {timeMs === null ? <Play className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />}
          {timeMs === null ? 'Play' : 'Replay'}
        </Button>
        <div className="flex rounded-md border border-border overflow-hidden">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={cn(
                'px-2.5 py-1 text-caption border-r border-border last:border-r-0 cursor-pointer',
                speed === s ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s === 1 ? '1×' : s === 0.5 ? '½×' : '¼×'}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-caption text-muted-foreground cursor-pointer">
          <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />
          Reduce motion
        </label>
        <span className="text-caption text-muted-foreground ml-auto">Click the stage while it moves to reverse it.</span>
      </div>

      <MotionGraph model={model} axisMs={axisMs} turnMs={turnMs} playheadMs={timeMs} />
      <GraphLegend model={model} />
      {turnMs !== null && !reduceMotion && model.spatial && (
        <p className="text-caption text-muted-foreground">
          The spring keeps its tempo and turns around smoothly. A CSS transition would restart from zero tempo, which shows as a kink. For interruptible motion use the SwiftUI, Compose or Motion export.
        </p>
      )}
    </div>
  );
}
