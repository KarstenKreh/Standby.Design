import { describe, it, expect, vi } from 'vitest';
import { startHashSync, staticHash, type HashWindow, type SyncedStore } from './hash-sync';
import { DEFAULT_COLOR_STATE, encodeState, decodeState, type DecodedState } from './url-state/color';
import { parseUnifiedHash } from './unified-hash';

function fakeWindow(hash: string): HashWindow & { reloads: number } {
  const win = {
    reloads: 0,
    location: { hash, reload: () => { win.reloads += 1; } },
    history: {
      replaceState: (_d: unknown, _u: string, url: string) => { win.location.hash = url; },
    },
    listeners: [] as (() => void)[],
    addEventListener: (_t: 'hashchange', l: () => void) => { win.listeners.push(l); },
  };
  return win;
}

function fakeStore<S extends object>(initial: S): SyncedStore<S> {
  let state = initial;
  const listeners = new Set<(s: S) => void>();
  return {
    getState: () => state,
    setState: (partial) => { state = { ...state, ...partial }; listeners.forEach(l => l(state)); },
    subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
  };
}

const colorCodec = { encode: (s: DecodedState) => encodeState(s), decode: decodeState };

describe('startHashSync', () => {
  it('writes the segment when only brandInvert changes', () => {
    const win = fakeWindow('');
    const store = fakeStore<DecodedState>({ ...DEFAULT_COLOR_STATE });
    startHashSync({ key: 'c', store, ...colorCodec }, win);
    store.setState({ brandInvert: true });
    const written = decodeState(parseUnifiedHash(win.location.hash.slice(1)).c!);
    expect(written!.brandInvert).toBe(true);
  });

  it('hydrates the store from its segment and keeps the other segments', () => {
    const seeded = encodeState({ ...DEFAULT_COLOR_STATE, brandHex: '#FF6B35', bgColorHex: '#FF6B35' });
    const win = fakeWindow(`#c=${seeded}&t=TYPE&m=50,50`);
    const store = fakeStore<DecodedState>({ ...DEFAULT_COLOR_STATE });
    const sync = startHashSync({ key: 'c', store, ...colorCodec }, win);
    expect(store.getState().brandHex).toBe('#FF6B35');
    store.setState({ themeName: 'Next' });
    const segs = parseUnifiedHash(win.location.hash.slice(1));
    expect(segs.t).toBe('TYPE');
    expect(segs.m).toBe('50,50');
    expect(sync.currentHash()).toBe(win.location.hash.slice(1));
  });

  it('treats a pre-unified hash as the color segment', () => {
    const legacy = encodeState({ ...DEFAULT_COLOR_STATE, brandHex: '#112233', bgColorHex: '#112233' });
    const store = fakeStore<DecodedState>({ ...DEFAULT_COLOR_STATE });
    startHashSync({ key: 'c', store, ...colorCodec }, fakeWindow(`#${legacy}`));
    expect(store.getState().brandHex).toBe('#112233');
  });

  it('does not overwrite store defaults with undefined decoded fields', () => {
    const store = fakeStore({ a: 1, b: 2 });
    startHashSync({
      key: 't', store,
      encode: (s) => `${s.a},${s.b}`,
      decode: () => ({ a: 5, b: undefined }),
    }, fakeWindow('#t=x'));
    expect(store.getState()).toEqual({ a: 5, b: 2 });
  });

  it('notifies subscribers only when the encoded segment changes', () => {
    const store = fakeStore({ a: 1, ignored: 0 });
    const sync = startHashSync({ key: 'p', store, encode: (s) => String(s.a), decode: () => null }, fakeWindow(''));
    const listener = vi.fn();
    sync.subscribe(listener);
    store.setState({ ignored: 1 });
    store.setState({ a: 2 });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe('staticHash', () => {
  it('reproduces the loaded segments', () => {
    const sync = staticHash({ location: { hash: '#m=10,20&c=X', reload: () => {} } });
    expect(sync.segments.c).toBe('X');
    expect(sync.currentHash()).toBe('c=X&m=10,20');
  });
});
