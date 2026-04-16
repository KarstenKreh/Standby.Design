import { z } from 'zod';
import { hexColor, paletteMode, chromaScale, fgContrastMode } from './common.js';

// Flat input: avoid nested objects for LLM ergonomics. Fields are namespaced
// by prefix (color*, type*, space*).
export const systemInputShape = {
  // Color
  brandHex: hexColor.describe('Primary brand color, hex including #.'),
  colorMode: paletteMode.default('balanced'),
  chromaScale: chromaScale.default(0.25),
  errorHex: hexColor
    .optional()
    .describe('Destructive color. Auto-derived from brand hue if omitted.'),
  fgContrastMode: fgContrastMode.default('best'),
  // Type
  typeMode: z
    .enum(['golden', 'traditional', 'custom'])
    .default('custom')
    .describe('Type scale algorithm.'),
  typeBaseSize: z.number().min(0.5).max(3).default(1).describe('Base font size in rem.'),
  typeRatio: z
    .number()
    .min(1)
    .max(2)
    .default(1.272)
    .describe('Custom scale ratio. Default 1.272 = √φ.'),
  headingFont: z.string().default('satoshi'),
  bodyFont: z.string().default('satoshi'),
  monoFont: z.string().default('system-mono'),
  // Spacing
  spacingBase: z.number().min(0.25).max(3).default(1).describe('Spacing base in rem.'),
  spacingRatio: z.number().min(1).max(2).default(1.272),
  spacingMode: z.enum(['harmonic', 'geometric']).default('harmonic'),
  spacingSnap: z.boolean().default(true).describe('Round spacing values to 0.25/0.5/1rem grid.'),
  // Meta
  themeName: z.string().default(''),
};

export type SystemInput = z.infer<z.ZodObject<typeof systemInputShape>>;
