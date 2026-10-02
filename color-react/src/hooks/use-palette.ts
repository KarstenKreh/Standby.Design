import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useThemeStore } from '@/store/theme-store';
import { buildThemePalettes, type AccentPalette } from '@core/theme-palettes';

export type { AccentPalette };

export function usePalette() {
  const seeds = useThemeStore(useShallow((s) => ({
    brandHex: s.brandHex,
    bgColorHex: s.bgColorHex,
    bgAutoMatch: s.bgAutoMatch,
    errorColorHex: s.errorColorHex,
    errorAutoMatch: s.errorAutoMatch,
    chromaScale: s.chromaScale,
    currentMode: s.currentMode,
    extraAccents: s.extraAccents,
    brandPin: s.brandPin,
    errorPin: s.errorPin,
  })));

  return useMemo(() => buildThemePalettes({ ...useThemeStore.getState(), ...seeds }), [seeds]);
}
