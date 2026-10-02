import { create } from 'zustand';
import { DEFAULT_SHAPE_STATE, type ShapeStyle, type ShadowType, type ColorMode, type SeparationMode, type BrutalistVariant, type RingStyle } from '@core/url-state/shape';

export type { ShapeStyle, ShadowType, ColorMode, SeparationMode, BrutalistVariant, RingStyle } from '@core/url-state/shape';

export interface ShapeState {
  // Style (top-level mode)
  shapeStyle: ShapeStyle;

  // Shadows (paper)
  shadowEnabled: boolean;
  shadowType: ShadowType;
  shadowStrength: number;
  shadowBlurScale: number;
  shadowScale: number;
  shadowColorMode: ColorMode;
  shadowCustomColor: string;

  // Brutalist shadow offset (active when shapeStyle === 'neobrutalism')
  shadowOffsetX: number;
  shadowOffsetY: number;
  /** 'outlined' = front + echo both have border; 'solid' = no front border, echo filled in border color. */
  brutalistVariant: BrutalistVariant;

  // Borders
  borderEnabled: boolean;
  borderWidth: number;
  borderColorMode: ColorMode;
  borderCustomColor: string;

  // Border Radius
  borderRadius: number;

  // Glass (Liquid Glass via liquid-glass-react — active when shapeStyle === 'glass')
  glassDepth: number;
  glassBlur: number;
  glassDispersion: number;

  // Ring / Focus
  ringWidth: number;
  ringOffset: number;
  ringColorMode: ColorMode;
  ringCustomColor: string;
  /** 'soft' = translucent halo at the edge; 'solid' = hard outline with offset. */
  ringStyle: RingStyle;

  // Surface Separation
  separationMode: SeparationMode;

  // Setters
  setShapeStyle: (v: ShapeStyle) => void;
  setShadowEnabled: (v: boolean) => void;
  setShadowType: (v: ShadowType) => void;
  setShadowStrength: (v: number) => void;
  setShadowBlurScale: (v: number) => void;
  setShadowScale: (v: number) => void;
  setShadowColorMode: (v: ColorMode) => void;
  setShadowCustomColor: (v: string) => void;
  setShadowOffsetX: (v: number) => void;
  setShadowOffsetY: (v: number) => void;
  setBrutalistVariant: (v: BrutalistVariant) => void;
  setBorderEnabled: (v: boolean) => void;
  setBorderWidth: (v: number) => void;
  setBorderColorMode: (v: ColorMode) => void;
  setBorderCustomColor: (v: string) => void;
  setBorderRadius: (v: number) => void;
  setGlassDepth: (v: number) => void;
  setGlassBlur: (v: number) => void;
  setGlassDispersion: (v: number) => void;
  setRingWidth: (v: number) => void;
  setRingOffset: (v: number) => void;
  setRingColorMode: (v: ColorMode) => void;
  setRingCustomColor: (v: string) => void;
  setRingStyle: (v: RingStyle) => void;
  setSeparationMode: (v: SeparationMode) => void;
  setFullState: (state: Partial<ShapeState>) => void;
}

export const useShapeStore = create<ShapeState>((set) => ({
  ...DEFAULT_SHAPE_STATE,

  // Setters
  setShapeStyle: (v) => set((prev) => {
    if (v === 'neomorph' && prev.shapeStyle !== 'neomorph') {
      return { shapeStyle: v, borderWidth: 0, ringWidth: 3, ringOffset: 0 };
    }
    if (v === 'neobrutalism' && prev.shapeStyle !== 'neobrutalism') {
      return {
        shapeStyle: v,
        borderEnabled: true,
        borderWidth: 2,
        borderRadius: 4,
        shadowOffsetX: 2,
        shadowOffsetY: 4,
        shadowScale: 1,
        shadowStrength: 1.0,
        shadowColorMode: 'auto',
        ringWidth: 2,
        ringOffset: 2,
        ringStyle: 'solid' as RingStyle,
      };
    }
    // Leaving brutalism: restore default elevation ladder so paper/neomorph/glass have staggered shadows again.
    if (prev.shapeStyle === 'neobrutalism' && v !== 'neobrutalism' && prev.shadowScale === 1) {
      return { shapeStyle: v, shadowScale: 1.272 };
    }
    return { shapeStyle: v };
  }),
  setShadowEnabled: (v) => set({ shadowEnabled: v }),
  setShadowType: (v) => set({ shadowType: v }),
  setShadowStrength: (v) => set({ shadowStrength: v }),
  setShadowBlurScale: (v) => set({ shadowBlurScale: v }),
  setShadowScale: (v) => set({ shadowScale: v }),
  setShadowColorMode: (v) => set({ shadowColorMode: v }),
  setShadowCustomColor: (v) => set({ shadowCustomColor: v }),
  setShadowOffsetX: (v) => set({ shadowOffsetX: v }),
  setShadowOffsetY: (v) => set({ shadowOffsetY: v }),
  setBrutalistVariant: (v) => set({ brutalistVariant: v }),
  setBorderEnabled: (v) => set({ borderEnabled: v }),
  setBorderWidth: (v) => set({ borderWidth: v }),
  setBorderColorMode: (v) => set({ borderColorMode: v }),
  setBorderCustomColor: (v) => set({ borderCustomColor: v }),
  setBorderRadius: (v) => set({ borderRadius: v }),
  setGlassDepth: (v) => set({ glassDepth: v }),
  setGlassBlur: (v) => set({ glassBlur: v }),
  setGlassDispersion: (v) => set({ glassDispersion: v }),
  setRingWidth: (v) => set({ ringWidth: v }),
  setRingOffset: (v) => set({ ringOffset: v }),
  setRingColorMode: (v) => set({ ringColorMode: v }),
  setRingCustomColor: (v) => set({ ringCustomColor: v }),
  setRingStyle: (v) => set({ ringStyle: v }),
  setSeparationMode: (v) => set({ separationMode: v }),
  setFullState: (partial) => set(partial),
}));
