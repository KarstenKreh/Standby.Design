import { useEffect, useRef, useState } from 'react';
import { useMotionStore } from '@/store/motion-store';
import { encodeState, decodeState } from '@core/url-state/motion';
import { isUnifiedHash, getMySegment, buildUnifiedHash } from '@core/unified-hash';

export interface OtherSegments { c?: string; t?: string; s?: string; y?: string; p?: string }

export function useUrlState(): OtherSegments {
  const energy = useMotionStore((s) => s.energy);
  const material = useMotionStore((s) => s.material);
  const initialized = useRef(false);
  const [others, setOthers] = useState<OtherSegments>({});
  const othersRef = useRef<OtherSegments>({});

  useEffect(() => {
    const raw = window.location.hash.slice(1);
    const captured: OtherSegments = {};
    if (raw && isUnifiedHash(raw)) {
      captured.c = getMySegment(raw, 'c') || undefined;
      captured.t = getMySegment(raw, 't') || undefined;
      captured.s = getMySegment(raw, 's') || undefined;
      captured.y = getMySegment(raw, 'y') || undefined;
      captured.p = getMySegment(raw, 'p') || undefined;
      const motionRaw = getMySegment(raw, 'm');
      if (motionRaw) {
        const decoded = decodeState(motionRaw);
        if (decoded) useMotionStore.getState().setFullState(decoded);
      }
    }
    othersRef.current = captured;
    setOthers(captured);
    initialized.current = true;
    history.replaceState(null, '', '#' + buildUnifiedHash({ ...captured, m: encodeState(useMotionStore.getState()) }));
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    history.replaceState(null, '', '#' + buildUnifiedHash({ ...othersRef.current, m: encodeState(useMotionStore.getState()) }));
  }, [energy, material]);

  return others;
}
