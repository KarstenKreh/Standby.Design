// Focus-ring rendering shared by shape, role and color previews.
//
// Two legitimate shapes for the same decision:
//   solid — a hard outline set off from the element (outline + outline-offset)
//   soft  — a translucent halo hugging the edge (box-shadow, zero blur), the
//           shadcn/Radix look
//
// WCAG 2.2 asks for 3:1 against the surroundings. A translucent halo alone can
// miss that on light surfaces, so the soft variant also paints the element's
// own border in the full ring color — the border carries the requirement, the
// halo is the extra.

import { hexToRgb } from './color-math';
import type { RingStyle } from './url-state/shape';

export const SOFT_RING_ALPHA = 0.4;

/** The halo sits one pixel wider than the nominal ring so it reads at small widths. */
export function softRingSpread(ringWidth: number): number {
  return ringWidth + 1;
}

export function ringGlowColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${SOFT_RING_ALPHA})`;
}

export interface FocusRingCss {
  outline: string;
  outlineOffset: string;
  /** box-shadow layer for the halo — empty string for the solid ring. */
  glow: string;
  /** Border color the contrast requirement rides on — empty string for the solid ring. */
  borderColor: string;
}

export function focusRingCss(
  ringStyle: RingStyle,
  ringWidth: number,
  ringOffset: number,
  ringColor: string,
): FocusRingCss {
  if (ringWidth <= 0) {
    return { outline: 'none', outlineOffset: '0px', glow: '', borderColor: '' };
  }
  if (ringStyle === 'solid') {
    return {
      outline: `${ringWidth}px solid ${ringColor}`,
      outlineOffset: `${ringOffset}px`,
      glow: '',
      borderColor: '',
    };
  }
  return {
    outline: `${ringWidth}px solid transparent`,
    outlineOffset: '0px',
    glow: `0 0 0 ${softRingSpread(ringWidth)}px ${ringGlowColor(ringColor)}`,
    borderColor: ringColor,
  };
}

export function mergeBoxShadow(...layers: Array<string | undefined | false>): string | undefined {
  const used = layers.filter((l): l is string => typeof l === 'string' && l.length > 0 && l !== 'none');
  return used.length ? used.join(', ') : undefined;
}
