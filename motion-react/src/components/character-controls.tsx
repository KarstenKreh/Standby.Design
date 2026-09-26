import { MOTION_PRESETS, presetFor } from '@core/motion';
import { useMotionStore } from '@/store/motion-store';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

function Axis({ label, left, right, hint, value, onChange }: {
  label: string;
  left: string;
  right: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-body-s font-medium">{label}</span>
        <span className="text-caption font-mono text-muted-foreground">{Math.round(value * 100)}</span>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[Math.round(value * 100)]}
        onValueChange={(v) => onChange((Array.isArray(v) ? v[0] : (v as number)) / 100)}
        aria-label={label}
      />
      <div className="flex justify-between text-caption text-muted-foreground">
        <span>{left}</span>
        <span>{right}</span>
      </div>
      <p className="text-caption text-muted-foreground">{hint}</p>
    </div>
  );
}

export function CharacterControls() {
  const energy = useMotionStore((s) => s.energy);
  const material = useMotionStore((s) => s.material);
  const setEnergy = useMotionStore((s) => s.setEnergy);
  const setMaterial = useMotionStore((s) => s.setMaterial);
  const setCharacter = useMotionStore((s) => s.setCharacter);
  const active = presetFor({ energy, material });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-caption text-muted-foreground block mb-1.5">Presets</span>
        <div className="grid grid-cols-2 gap-1.5">
          {MOTION_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setCharacter(p)}
              className={cn(
                'text-left rounded-md border px-3 py-2 transition-colors cursor-pointer',
                p.id === 'balanced' && 'col-span-2',
                active?.id === p.id ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted',
              )}
            >
              <span className="block text-body-s font-medium">{p.label}</span>
              <span className="block text-caption text-muted-foreground">often: {p.seenIn}</span>
            </button>
          ))}
        </div>
      </div>

      <Axis
        label="Energy"
        left="calm"
        right="lively"
        hint="Sets the tempo of every spring. Faster motion reads as more energetic."
        value={energy}
        onChange={setEnergy}
      />
      <Axis
        label="Material"
        left="firm"
        right="elastic"
        hint="Sets how much spatial motion overshoots and settles. Effects such as opacity never overshoot."
        value={material}
        onChange={setMaterial}
      />

      <p className="text-caption text-muted-foreground border-t border-border pt-3">
        Energy follows well-replicated research: people read speed as arousal. Material and the brand examples are design conventions. The values are starting points, not proof.
      </p>
    </div>
  );
}
