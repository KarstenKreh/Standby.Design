import { deriveSurface } from '@core/surface';
import type { PaletteMode } from '@core/palette';
import type { ShapeStyle } from '@core/url-state/shape';
import type { ShapeSurfaces } from '@core/shape-code-export';

export {
  generateShapeCss as generateCssExport,
  generateShapeTailwind as generateTailwindV4Export,
  generateShapeDesignTokens as generateDesignTokensExport,
  generateShapeLlmBriefing as generateLlmBriefing,
  type ShapeExportOptions,
} from '@core/shape-code-export';

export function previewSurfaces(
  surfaceHex: string,
  paletteMode: PaletteMode,
  chromaScale: number,
  shapeStyle: ShapeStyle,
): ShapeSurfaces {
  const tonesFor = (isDark: boolean) => {
    const colors = deriveSurface(surfaceHex, isDark, paletteMode, chromaScale, false, shapeStyle);
    return { background: colors.bg, card: colors.card };
  };
  return { light: tonesFor(false), dark: tonesFor(true) };
}
