import { startHashSync } from '@core/hash-sync';
import { encodeState, decodeState } from '@core/url-state/shape';
import { decodeColorOrDefault } from '@core/url-state/color';
import { buildThemePalettes } from '@core/theme-palettes';
import { useShapeStore } from '@/store/shape-store';

export const hashSync = startHashSync({ key: 's', store: useShapeStore, encode: encodeState, decode: decodeState });

export const sharedColor = decodeColorOrDefault(hashSync.segments.c);

export const sharedPalettes = buildThemePalettes(sharedColor);
