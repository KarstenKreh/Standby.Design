import { create } from 'zustand';
import { DEFAULT_SYMBOL_STATE, type IconStyle, type IconWeight, type IconCorners, type UrlState } from '@core/url-state/symbol';

export type { IconStyle, IconWeight, IconCorners } from '@core/url-state/symbol';

export type SymbolState = UrlState;

interface SymbolActions {
  setPreferredStyle: (v: IconStyle) => void;
  setPreferredWeight: (v: IconWeight) => void;
  setPreferredCorners: (v: IconCorners) => void;
  setIconBaseSize: (v: number) => void;
  setIconScale: (v: number) => void;
  setSnapTo4px: (v: boolean) => void;
  setSelectedSet: (v: string | null) => void;
  setFullState: (state: Partial<SymbolState>) => void;
}

export const useSymbolStore = create<SymbolState & SymbolActions>((set) => ({
  ...DEFAULT_SYMBOL_STATE,

  setPreferredStyle: (v) => set({ preferredStyle: v }),
  setPreferredWeight: (v) => set({ preferredWeight: v }),
  setPreferredCorners: (v) => set({ preferredCorners: v }),
  setIconBaseSize: (v) => set({ iconBaseSize: v }),
  setIconScale: (v) => set({ iconScale: v }),
  setSnapTo4px: (v) => set({ snapTo4px: v }),
  setSelectedSet: (v) => set({ selectedSet: v }),
  setFullState: (state) => set(state),
}));
