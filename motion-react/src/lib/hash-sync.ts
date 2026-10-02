import { startHashSync } from '@core/hash-sync';
import { encodeState, decodeState } from '@core/url-state/motion';
import { useMotionStore } from '@/store/motion-store';

export const hashSync = startHashSync({ key: 'm', store: useMotionStore, encode: encodeState, decode: decodeState });
