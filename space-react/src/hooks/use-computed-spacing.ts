import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSpaceStore } from '@/store/space-store';
import { spacingTokensFor } from '@core/space-code-export';
import type { SpacingToken } from '@core/spacing';

export function useComputedSpacing(): SpacingToken[] {
  const scale = useSpaceStore(useShallow((s) => ({
    spacingMode: s.spacingMode,
    spacingBaseRem: s.spacingBaseRem,
    spacingRatio: s.spacingRatio,
    spacingMultiplier: s.spacingMultiplier,
    spacingSnap: s.spacingSnap,
  })));
  return useMemo(() => spacingTokensFor({ ...useSpaceStore.getState(), ...scale }), [scale]);
}
