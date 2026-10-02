import { startHashSync } from '@core/hash-sync';
import { encodeState, decodeState } from '@core/url-state/type';
import { useTypeStore } from '@/store/type-store';

type TypeStoreState = ReturnType<typeof useTypeStore.getState>;

const encodeTypeStore = (s: TypeStoreState) => encodeState({
  scaleMode: s.scaleMode,
  baseSize: s.baseSize,
  customRatio: s.customRatio,
  mobileRatio: s.mobileRatio,
  headingFont: s.headingFont,
  bodyFont: s.bodyFont,
  monoFont: s.monoFont,
  headingWeight: s.headingWeight,
  mobileBaseSize: s.mobileBaseSize,
  mobileRatioMode: s.mobileRatioMode,
  autoShrink: s.autoShrink,
  lineHeightOverrides: s.lineHeightOverrides,
  letterSpacingOverrides: s.letterSpacingOverrides,
  traditionalAssignments: s.scaleMode === 'traditional' ? s.traditionalAssignments : undefined,
  traditionalMobileAssignments: s.scaleMode === 'traditional' ? s.traditionalMobileAssignments : undefined,
});

export const hashSync = startHashSync<TypeStoreState>({ key: 't', store: useTypeStore, encode: encodeTypeStore, decode: decodeState });
