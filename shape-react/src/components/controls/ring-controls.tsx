import { Slider } from '@/components/ui/slider';
import { useShapeStore } from '@/store/shape-store';
import { cn } from '@/lib/utils';

function sliderVal(v: number | readonly number[]): number {
  return Array.isArray(v) ? v[0] : v;
}

const RING_STYLES = [
  { value: 'soft', label: 'Soft', hint: 'Translucent halo hugging the edge, plus a full-color border (shadcn/Radix look).' },
  { value: 'solid', label: 'Solid', hint: 'Hard outline set off from the element — robust on busy backgrounds and in forced-contrast modes.' },
] as const;

export function RingControls() {
  const {
    ringWidth, setRingWidth,
    ringOffset, setRingOffset,
    ringStyle, setRingStyle,
  } = useShapeStore();

  const offsetDisabled = ringStyle === 'soft';

  return (
    <div className="space-y-3">
      <h3 className="text-body-s font-semibold">Focus Ring</h3>

      <div className="space-y-1">
        <span className="text-caption font-medium text-muted-foreground">Style</span>
        <div className="flex w-full rounded-md border border-input overflow-hidden">
          {RING_STYLES.map(({ value, label, hint }) => (
            <button
              key={value}
              type="button"
              title={hint}
              onClick={() => setRingStyle(value)}
              className={cn(
                'flex-1 px-2.5 py-1 text-caption font-medium transition-colors cursor-pointer',
                'border-r border-input last:border-r-0',
                ringStyle === value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-caption font-medium text-muted-foreground">Width</span>
          <span className="text-caption text-muted-foreground font-mono">{ringWidth}px</span>
        </div>
        <Slider
          value={[ringWidth]}
          onValueChange={(v) => setRingWidth(sliderVal(v))}
          min={0}
          max={4}
          step={0.5}
        />
      </div>

      <div className={cn('space-y-1', offsetDisabled && 'opacity-40')}>
        <div className="flex items-center justify-between">
          <span className="text-caption font-medium text-muted-foreground">Offset</span>
          <span className="text-caption text-muted-foreground font-mono">
            {offsetDisabled ? 'n/a' : `${ringOffset}px`}
          </span>
        </div>
        <Slider
          value={[ringOffset]}
          onValueChange={(v) => setRingOffset(sliderVal(v))}
          min={0}
          max={4}
          step={0.5}
          disabled={offsetDisabled}
        />
        {offsetDisabled && (
          <p className="text-caption text-muted-foreground">The soft ring sits directly on the edge — offset has no effect.</p>
        )}
      </div>
    </div>
  );
}
