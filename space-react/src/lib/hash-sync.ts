import { startHashSync } from '@core/hash-sync';
import { encodeState, decodeState } from '@core/url-state/space';
import { useSpaceStore } from '@/store/space-store';

export const hashSync = startHashSync({ key: 'p', store: useSpaceStore, encode: encodeState, decode: decodeState });
