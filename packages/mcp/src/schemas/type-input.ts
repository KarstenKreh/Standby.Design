import { z } from 'zod';

export const typeInputShape = {
  mode: z
    .enum(['golden', 'traditional', 'custom'])
    .default('custom')
    .describe(
      'Scale algorithm. golden = fixed √φ lookup (≈1.272); traditional = classical Renaissance point sizes; custom = user-defined ratio.',
    ),
  baseSize: z
    .number()
    .min(0.5)
    .max(3)
    .default(1)
    .describe('Desktop base font size in rem.'),
  ratio: z
    .number()
    .min(1)
    .max(2)
    .default(1.272)
    .describe(
      'Scale ratio for custom mode. Default 1.272 = √φ (area-based golden ratio) within the 1.20–1.50 perceptual corridor.',
    ),
  mobileBaseSize: z
    .number()
    .min(0.5)
    .max(3)
    .optional()
    .describe('Mobile base size in rem. Defaults to baseSize if omitted.'),
  mobileRatio: z
    .number()
    .min(1)
    .max(2)
    .optional()
    .describe('Mobile scale ratio. Defaults to ratio if omitted.'),
  headingFont: z
    .string()
    .default('satoshi')
    .describe('Fontshare slug for headings, e.g. "satoshi", "cabinet-grotesk".'),
  bodyFont: z.string().default('satoshi'),
  monoFont: z.string().default('system-mono'),
  includeSpacing: z
    .boolean()
    .default(true)
    .describe(
      'If true, derive and include a spacing scale (--space-*) based on the body-m line-height.',
    ),
};

export type TypeInput = z.infer<z.ZodObject<typeof typeInputShape>>;
