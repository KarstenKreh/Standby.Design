import { buildUnifiedHash, readSegments, type SegmentKey, type Segments } from './unified-hash';

export interface SyncedStore<S> {
  getState(): S;
  setState(partial: Partial<S>): void;
  subscribe(listener: (state: S) => void): () => void;
}

export interface HashWindow {
  location: { hash: string; reload(): void };
  history: { replaceState(data: unknown, unused: string, url: string): void };
  addEventListener(type: 'hashchange', listener: () => void): void;
}

export interface HashSyncOptions<S> {
  key: SegmentKey;
  store: SyncedStore<S>;
  encode(state: S): string;
  decode(segment: string): Partial<S> | null;
}

export interface HashSync {
  readonly segments: Readonly<Segments>;
  currentHash(): string;
  subscribe(listener: () => void): () => void;
}

function withoutUndefined<S>(partial: Partial<S>): Partial<S> {
  return Object.fromEntries(Object.entries(partial).filter(([, v]) => v !== undefined)) as Partial<S>;
}

export function startHashSync<S>(
  { key, store, encode, decode }: HashSyncOptions<S>,
  win: HashWindow = window,
): HashSync {
  const segments = readSegments(win.location.hash);
  const own = segments[key];
  const decoded = own ? decode(own) : null;
  if (decoded) store.setState(withoutUndefined(decoded));

  const listeners = new Set<() => void>();
  let encoded = encode(store.getState());
  const currentHash = () => buildUnifiedHash({ ...segments, [key]: encoded });
  const write = () => win.history.replaceState(null, '', `#${currentHash()}`);

  write();
  store.subscribe((state) => {
    const next = encode(state);
    if (next === encoded) return;
    encoded = next;
    write();
    listeners.forEach(listener => listener());
  });
  win.addEventListener('hashchange', () => win.location.reload());

  return {
    segments,
    currentHash,
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
}

export function staticHash(win: Pick<HashWindow, 'location'> = window): HashSync {
  const segments = readSegments(win.location.hash);
  const hash = buildUnifiedHash(segments);
  return { segments, currentHash: () => hash, subscribe: () => () => {} };
}
