import { computeMotionPrimitives, cssLinearEasing, findPrimitive, type MotionPrimitive } from '@core/motion';
import { decodeState, DEFAULT_MOTION_URL_STATE } from '@core/url-state/motion';

export interface RoleMotion {
  fade: string;
  move: string;
  reduced: boolean;
}

function transitionValue(p: MotionPrimitive): string {
  return `${p.settleMs}ms ${cssLinearEasing(p, p.settleMs)}`;
}

export function buildRoleMotion(motionSegment: string | null, reduced: boolean): RoleMotion {
  const character = { ...DEFAULT_MOTION_URL_STATE, ...(motionSegment ? decodeState(motionSegment) : null) };
  const primitives = computeMotionPrimitives(character);
  return {
    fade: transitionValue(findPrimitive(primitives, 'effect', 'default')),
    move: transitionValue(findPrimitive(primitives, 'spatial', 'default')),
    reduced,
  };
}
