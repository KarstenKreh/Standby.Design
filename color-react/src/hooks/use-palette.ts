import { useMemo } from 'react';
import { useThemeStore } from '@/store/theme-store';
import { buildPaletteSet, accentCssName, type AccentPalette } from '@core/orchestrate';
import type { DecodedState as DecodedColorState } from '@core/url-state/color';

export { accentCssName };
export type { AccentPalette };

export function usePalette() {
  const {
    brandHex, bgColorHex, bgAutoMatch, errorColorHex, errorAutoMatch,
    chromaScale, currentMode, extraAccents, brandPin, brandInvert,
    errorPin, errorInvert, fgContrastMode, themeName,
  } = useThemeStore();

  return useMemo(() => {
    const state: DecodedColorState = {
      brandHex, bgColorHex, bgAutoMatch, errorColorHex, errorAutoMatch,
      chromaScale, currentMode, extraAccents, brandPin, brandInvert,
      errorPin, errorInvert, fgContrastMode, themeName,
    };
    return buildPaletteSet(state);
  }, [brandHex, bgColorHex, bgAutoMatch, errorColorHex, errorAutoMatch,
      chromaScale, currentMode, extraAccents, brandPin, brandInvert,
      errorPin, errorInvert, fgContrastMode, themeName]);
}
