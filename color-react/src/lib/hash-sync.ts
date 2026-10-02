import { startHashSync } from '@core/hash-sync';
import { encodeState, decodeState } from '@core/url-state/color';
import { decodeState as decodeShapeState, decodeShapeOrDefault } from '@core/url-state/shape';
import { useThemeStore } from '@/store/theme-store';

export const hashSync = startHashSync({ key: 'c', store: useThemeStore, encode: encodeState, decode: decodeState });

export const sharedShape = hashSync.segments.s ? decodeShapeState(hashSync.segments.s) : null;

const shapeWithDefaults = decodeShapeOrDefault(hashSync.segments.s);

export const sharedShapeTokens = {
  borderEnabled: shapeWithDefaults.borderEnabled,
  borderWidth: shapeWithDefaults.borderWidth,
  borderRadius: shapeWithDefaults.borderRadius,
};
