import { startHashSync } from '@core/hash-sync';
import { encodeState, decodeState } from '@core/url-state/symbol';
import { useSymbolStore } from '@/store/symbol-store';

export const hashSync = startHashSync({ key: 'y', store: useSymbolStore, encode: encodeState, decode: decodeState });
