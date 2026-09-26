import { DEFAULT_MOTION_CHARACTER, type MotionCharacter } from '../motion';

export type MotionUrlState = MotionCharacter;

export const DEFAULT_MOTION_URL_STATE: MotionUrlState = { ...DEFAULT_MOTION_CHARACTER };

const toPercent = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 100);

export function encodeState(s: MotionUrlState): string {
  return `${toPercent(s.energy)},${toPercent(s.material)}`;
}

export function decodeState(raw: string): Partial<MotionUrlState> | null {
  if (!raw) return null;
  const [energyRaw, materialRaw] = raw.split(',');
  const energy = parseInt(energyRaw);
  const material = parseInt(materialRaw);
  const result: Partial<MotionUrlState> = {};
  if (!isNaN(energy)) result.energy = Math.min(100, Math.max(0, energy)) / 100;
  if (!isNaN(material)) result.material = Math.min(100, Math.max(0, material)) / 100;
  return Object.keys(result).length > 0 ? result : null;
}
