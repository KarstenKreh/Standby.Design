import { STEPS, L_WHITE, L_BLACK, type PaletteEntry, type Step } from './palette';
import { hexToOklch, oklchToHex, maxChromaInGamut } from './color-math';

export interface StateToken {
  hex: string;
  label: string;
  step: Step | null;
}

export interface Ladder {
  rest: StateToken;
  hover: StateToken;
  pressed: StateToken;
  reversed: boolean;
}

export const STATE_RUNG_IN_STEP_NUMBERS = 100;

const LIGHTER = -1;
const DARKER = 1;

function snapToStep(target: number): Step {
  return STEPS.reduce((best, s) => Math.abs(s - target) < Math.abs(best - target) ? s : best, STEPS[0]);
}

function entryHex(pal: PaletteEntry[], step: Step): string {
  return pal.find(e => e.step === step)?.hex ?? '#888888';
}

function availableSteps(pal: PaletteEntry[]): Step[] {
  return STEPS.filter(s => pal.some(e => e.step === s));
}

function snapWithin(target: number, steps: Step[]): Step {
  return steps.reduce((best, s) => Math.abs(s - target) < Math.abs(best - target) ? s : best, steps[0] ?? snapToStep(target));
}

export function stepLadder(pal: PaletteEntry[], name: string, step: Step): Ladder {
  const steps = availableSteps(pal);
  const rung = STATE_RUNG_IN_STEP_NUMBERS;
  let hover = snapWithin(step + LIGHTER * rung, steps);
  let pressed = snapWithin(step + DARKER * rung, steps);
  let reversed = false;

  if (hover === step) {
    hover = snapWithin(step + DARKER * rung, steps);
    pressed = snapWithin(step + DARKER * 2 * rung, steps);
    reversed = true;
  } else if (pressed === step) {
    pressed = snapWithin(step + LIGHTER * 2 * rung, steps);
    reversed = true;
  }

  const token = (s: Step): StateToken => ({ hex: entryHex(pal, s), label: `${name} · ${s}`, step: s });
  return { rest: token(step), hover: token(hover), pressed: token(pressed), reversed };
}

export function rungDeltaInLightness(pal: PaletteEntry[]): number {
  const a = pal.find(e => e.step === 400);
  const b = pal.find(e => e.step === 500);
  return a && b ? Math.abs(a.L - b.L) : 0.096;
}

export function pinnedLadder(hex: string, pal: PaletteEntry[]): Ladder {
  const [L, C, H] = hexToOklch(hex);
  const delta = rungDeltaInLightness(pal);
  const roomAbove = L_WHITE - L;
  const roomBelow = L - L_BLACK;

  let hoverOffset = delta;
  let pressedOffset = -delta;
  let reversed = false;
  if (roomAbove < delta) {
    hoverOffset = -delta;
    pressedOffset = -2 * delta;
    reversed = true;
  } else if (roomBelow < delta) {
    pressedOffset = 2 * delta;
    reversed = true;
  }

  const at = (offset: number): StateToken => {
    const nextL = Math.min(L_WHITE, Math.max(L_BLACK, L + offset));
    const nextC = Math.min(C, maxChromaInGamut(nextL, H));
    const sign = offset > 0 ? '+' : '−';
    return { hex: oklchToHex(nextL, nextC, H), label: `pinned · L ${sign}${Math.abs(offset).toFixed(2)}`, step: null };
  };

  return { rest: { hex, label: 'pinned', step: null }, hover: at(hoverOffset), pressed: at(pressedOffset), reversed };
}

export function stateLadder(pal: PaletteEntry[], name: string, step: Step, pinnedHex: string | null): Ladder {
  return pinnedHex ? pinnedLadder(pinnedHex, pal) : stepLadder(pal, name, step);
}
