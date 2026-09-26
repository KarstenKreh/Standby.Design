import { useMotionStore } from '@/store/motion-store';
import { SliderWithInput } from '@/components/ui/slider-with-input';
import { CharacterMap } from '@/components/character-map';

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
      <SliderWithInput
        label={label}
        value={Math.round(value * 100)}
        min={0}
        max={100}
        step={1}
        onChange={(v) => onChange(Math.round(v) / 100)}
        inputWidthClass="w-[4rem]"
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

  return (
    <div className="space-y-6">
      <CharacterMap />

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
