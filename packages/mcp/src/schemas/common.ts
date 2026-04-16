import { z } from 'zod';

export const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a 6-digit hex color including #, e.g. "#335A7F"');

export const paletteMode = z
  .enum(['balanced', 'exact'])
  .describe(
    'balanced = step 500 sits at perceptual midpoint L=0.50 (symmetric light/dark distribution); exact = step 500 matches the brand lightness exactly',
  );

export const chromaScale = z
  .number()
  .min(0)
  .max(1)
  .describe(
    'Surface tint saturation. 0 = fully neutral grey backgrounds, 1 = fully saturated (equal to brand). 0.25 is the standard subtle tint.',
  );

export const fgContrastMode = z
  .enum(['best', 'preferLight', 'preferDark'])
  .describe(
    'Strategy for picking foreground text color on primary backgrounds. best = highest WCAG contrast; preferLight/preferDark = honor preference unless contrast fails.',
  );
