import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSymbolStore } from '@/store/symbol-store';
import { resolveIconSet } from '@core/symbol-code-export';

export function useActiveIconSet() {
  const state = useSymbolStore(useShallow((s) => ({
    preferredStyle: s.preferredStyle,
    preferredWeight: s.preferredWeight,
    preferredCorners: s.preferredCorners,
    iconBaseSize: s.iconBaseSize,
    iconScale: s.iconScale,
    snapTo4px: s.snapTo4px,
    selectedSet: s.selectedSet,
  })));
  return useMemo(() => resolveIconSet(state), [state]);
}
