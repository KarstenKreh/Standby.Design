import { useSyncExternalStore } from 'react';
import type { HashSync } from './hash-sync';

export function useCurrentHash(sync: HashSync): string {
  return useSyncExternalStore(sync.subscribe, sync.currentHash);
}
