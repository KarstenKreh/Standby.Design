import { useEffect, useSyncExternalStore } from 'react';
import {
  fetchFontCatalog,
  subscribeCatalog,
  getCatalog,
  loadFont,
} from '@core/fontshare';

/**
 * Fetches the full Fontshare catalog on mount and
 * loads CSS for the given fonts on demand.
 *
 * Also subscribes to catalog updates so fontFamily() lookups
 * in the render tree resolve once the API responds.
 */
export function useFontLoader(headingFont?: string, bodyFont?: string, monoFont?: string) {
  // Kick off the API fetch once
  useEffect(() => {
    fetchFontCatalog();
  }, []);

  // Load selected fonts on demand
  useEffect(() => {
    if (headingFont) loadFont(headingFont);
    if (bodyFont) loadFont(bodyFont);
    if (monoFont) loadFont(monoFont);
  }, [headingFont, bodyFont, monoFont]);

  // Re-render when the catalog arrives
  useSyncExternalStore(subscribeCatalog, getCatalog);
}
