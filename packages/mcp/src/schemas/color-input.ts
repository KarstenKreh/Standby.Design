import { z } from 'zod';
import { hexColor, paletteMode, chromaScale, fgContrastMode } from './common.js';

// Zod raw shape (object of Zod values, not a Zod object) — per MCP SDK
// registerTool API.
export const colorInputShape = {
  brandHex: hexColor.describe('Primary brand color, hex including #.'),
  mode: paletteMode.default('balanced'),
  chromaScale: chromaScale.default(0.25),
  errorHex: hexColor
    .optional()
    .describe('Destructive/error color. If omitted, auto-derived from brand hue.'),
  themeName: z
    .string()
    .default('')
    .describe('Optional name shown in CSS header comments.'),
  fgContrastMode: fgContrastMode.default('best'),
};

export type ColorInput = z.infer<z.ZodObject<typeof colorInputShape>>;
