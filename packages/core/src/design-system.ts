import type { Segments } from './unified-hash';
import { decodeColorOrDefault, type DecodedState as ColorState } from './url-state/color';
import { decodeTypeOrDefault, type UrlState as TypeState } from './url-state/type';
import { decodeShapeOrDefault, type ShapeUrlState } from './url-state/shape';
import { decodeState as decodeSymbolState, type UrlState as SymbolState } from './url-state/symbol';
import { decodeState as decodeSpaceState, DEFAULT_SPACE_URL_STATE, type SpaceUrlState } from './url-state/space';
import { decodeState as decodeMotionState, DEFAULT_MOTION_URL_STATE, type MotionUrlState } from './url-state/motion';
import { buildThemePalettes, type ThemePalettes } from './theme-palettes';
import { computeTypeScale } from './type-code-export';
import { spacingTokensFor } from './space-code-export';
import { computeMotionPrimitives, type MotionPrimitive } from './motion';
import type { ComputedLevel } from './scale';
import type { SpacingToken } from './spacing';

export interface DesignSystem {
  segments: Segments;
  color: ColorState;
  palettes: ThemePalettes;
  type: TypeState;
  scale: ComputedLevel[];
  shape: ShapeUrlState;
  symbol: SymbolState | null;
  space: SpaceUrlState;
  spacing: SpacingToken[];
  motion: MotionUrlState;
  motionPrimitives: MotionPrimitive[];
}

export function decodeSpaceOrDefault(segment: string | null | undefined): SpaceUrlState {
  return { ...DEFAULT_SPACE_URL_STATE, ...((segment ? decodeSpaceState(segment) : null) ?? {}) };
}

export function decodeMotionOrDefault(segment: string | null | undefined): MotionUrlState {
  return { ...DEFAULT_MOTION_URL_STATE, ...((segment ? decodeMotionState(segment) : null) ?? {}) };
}

export function decodeSymbolOrNull(segment: string | null | undefined): SymbolState | null {
  return segment ? decodeSymbolState(segment) : null;
}

export function resolveDesignSystem(segments: Segments): DesignSystem {
  const color = decodeColorOrDefault(segments.c);
  const type = decodeTypeOrDefault(segments.t);
  const space = decodeSpaceOrDefault(segments.p);
  const motion = decodeMotionOrDefault(segments.m);
  return {
    segments,
    color,
    palettes: buildThemePalettes(color),
    type,
    scale: computeTypeScale(type),
    shape: decodeShapeOrDefault(segments.s),
    symbol: decodeSymbolOrNull(segments.y),
    space,
    spacing: spacingTokensFor(space),
    motion,
    motionPrimitives: computeMotionPrimitives(motion),
  };
}
