import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useTypeStore } from '@/store/type-store';
import { computeTypeScale } from '@core/type-code-export';
import type { ComputedLevel } from '@core/scale';

export function useComputedScale(): ComputedLevel[] {
  const scaleState = useTypeStore(useShallow((s) => ({
    scaleMode: s.scaleMode,
    baseSize: s.baseSize,
    mobileBaseSize: s.mobileBaseSize,
    customRatio: s.customRatio,
    mobileRatioMode: s.mobileRatioMode,
    mobileRatio: s.mobileRatio,
    autoShrink: s.autoShrink,
    traditionalAssignments: s.traditionalAssignments,
    traditionalMobileAssignments: s.traditionalMobileAssignments,
    lineHeightOverrides: s.lineHeightOverrides,
    letterSpacingOverrides: s.letterSpacingOverrides,
  })));
  return useMemo(() => computeTypeScale({ ...useTypeStore.getState(), ...scaleState }), [scaleState]);
}
