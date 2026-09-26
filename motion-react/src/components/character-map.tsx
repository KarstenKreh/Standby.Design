import { useCallback, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { MOTION_PRESETS, presetFor } from '@core/motion';
import { useMotionStore } from '@/store/motion-store';
import { SPATIAL_COLOR } from '@/components/motion-graph';

const SNAP_RADIUS_PX = 14;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const toPercent = (v: number) => `${v * 100}%`;

export function CharacterMap() {
  const energy = useMotionStore((s) => s.energy);
  const material = useMotionStore((s) => s.material);
  const setCharacter = useMotionStore((s) => s.setCharacter);
  const active = presetFor({ energy, material });
  const areaRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = useCallback((clientX: number, clientY: number) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const material = clamp01((clientX - rect.left) / rect.width);
    const energy = clamp01((clientY - rect.top) / rect.height);
    const snapped = MOTION_PRESETS.find((p) =>
      Math.hypot((p.material - material) * rect.width, (p.energy - energy) * rect.height) <= SNAP_RADIUS_PX);
    setCharacter(snapped ?? {
      material: Math.round(material * 100) / 100,
      energy: Math.round(energy * 100) / 100,
    });
  }, [setCharacter]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX, e.clientY);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX, e.clientY);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 0.1 : 0.01;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [0, -step], ArrowRight: [0, step], ArrowUp: [-step, 0], ArrowDown: [step, 0],
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    setCharacter({
      energy: Math.round(clamp01(energy + move[0]) * 100) / 100,
      material: Math.round(clamp01(material + move[1]) * 100) / 100,
    });
  };

  return (
    <div>
      <span className="text-caption text-muted-foreground block mb-1.5">Presets and position</span>
      <div className="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-1.5">
        <div className="flex flex-col justify-between items-end text-caption text-muted-foreground py-1">
          <span>calm</span>
          <span className="[writing-mode:vertical-rl] rotate-180">Energy</span>
          <span>lively</span>
        </div>
        <div
          ref={areaRef}
          role="slider"
          tabIndex={0}
          aria-label="Character: energy and material"
          aria-valuetext={`Energy ${Math.round(energy * 100)}, Material ${Math.round(material * 100)}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          className="relative aspect-[4/3] rounded-md border border-border bg-background cursor-crosshair touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-border" />
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border" />
          {MOTION_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setCharacter(p)}
              className="absolute size-5 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group"
              style={{ left: toPercent(p.material), top: toPercent(p.energy) }}
              title={`${p.label} · often: ${p.seenIn}`}
            >
              <span className={`block size-2.5 rounded-full border ${active?.id === p.id ? 'bg-foreground border-foreground' : 'border-muted-foreground group-hover:bg-muted-foreground'}`} />
              <span className="absolute top-full left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap text-muted-foreground group-hover:text-foreground">{p.label}</span>
            </button>
          ))}
          <div
            className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background pointer-events-none"
            style={{ left: toPercent(material), top: toPercent(energy), background: SPATIAL_COLOR, boxShadow: '0 0 0 1px var(--border)' }}
          />
        </div>
        <div />
        <div className="flex justify-between text-caption text-muted-foreground px-1">
          <span>firm</span>
          <span>Material</span>
          <span>elastic</span>
        </div>
      </div>
      <p className="text-caption mt-2 min-h-5">
        {active ? <><span className="font-medium">{active.label}</span><span className="text-muted-foreground"> · often: {active.seenIn}</span></> : <span className="text-muted-foreground">Custom position</span>}
      </p>
      <p className="text-caption text-muted-foreground mt-1">Drag the point or click a preset. Near a preset the point snaps into place. Arrow keys move in steps of 1, with Shift in steps of 10.</p>
    </div>
  );
}
