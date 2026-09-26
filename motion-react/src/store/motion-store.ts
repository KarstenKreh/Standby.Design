import { create } from 'zustand';
import { DEFAULT_MOTION_URL_STATE } from '@core/url-state/motion';
import type { MotionCharacter } from '@core/motion';

export interface MotionState extends MotionCharacter {
  previewToken: string;
  setEnergy: (v: number) => void;
  setMaterial: (v: number) => void;
  setCharacter: (c: MotionCharacter) => void;
  setPreviewToken: (name: string) => void;
  setFullState: (partial: Partial<MotionCharacter>) => void;
}

export const useMotionStore = create<MotionState>((set) => ({
  energy: DEFAULT_MOTION_URL_STATE.energy,
  material: DEFAULT_MOTION_URL_STATE.material,
  previewToken: 'enter',
  setEnergy: (energy) => set({ energy }),
  setMaterial: (material) => set({ material }),
  setCharacter: ({ energy, material }) => set({ energy, material }),
  setPreviewToken: (previewToken) => set({ previewToken }),
  setFullState: (partial) => set(partial),
}));
