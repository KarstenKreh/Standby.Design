import { useMemo } from 'react';
import { computeMotionPrimitives } from '@core/motion';
import { useMotionStore } from '@/store/motion-store';

export function useMotionPrimitives() {
  const energy = useMotionStore((s) => s.energy);
  const material = useMotionStore((s) => s.material);
  return useMemo(() => computeMotionPrimitives({ energy, material }), [energy, material]);
}
