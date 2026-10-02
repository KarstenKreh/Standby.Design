import { useCallback, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { SeedColors } from '@/components/seed-colors';
import { PrimitiveTabs } from '@/components/primitive-tabs';
import { SurfacePreview } from '@/components/surface-preview';
import { CodeExport } from '@/components/code-export';
import { usePalette } from '@/hooks/use-palette';
import { useThemeCss } from '@/hooks/use-theme-css';
import { useThemeStore } from '@/store/theme-store';
import { useFavicon } from '@/hooks/use-favicon';
import { hashSync, sharedShape, sharedShapeTokens } from '@/lib/hash-sync';
import { useCurrentHash } from '@core/use-hash';
import { pageShareUrl } from '@core/share-link';
import { AppShell } from '@core/app-shell';

function App() {
  const palette = usePalette();
  const themeName = useThemeStore((s) => s.themeName);
  const brandHex = useThemeStore((s) => s.brandHex);
  const hash = useCurrentHash(hashSync);

  useThemeCss(palette.brand, palette.surface, palette.neutral);
  useFavicon(brandHex);

  const handleShare = useCallback(() => {
    const url = pageShareUrl(window.location.origin + window.location.pathname, hash);
    navigator.clipboard.writeText(url).then(() => toast('Share link copied!'));
  }, [hash]);

  useEffect(() => {
    document.title = themeName ? `${themeName} — Color Palette Generator` : 'Color Palette Generator';
  }, [themeName]);

  return (
    <TooltipProvider>
      <AppShell activeTool="color" hash={hash}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-semibold" style={{ fontSize: 'var(--text-h4)', lineHeight: 'var(--leading-h4)' }}>
            Color
          </h1>
          <Button variant="default" onClick={handleShare}>
            Share Theme
          </Button>
        </div>
        <p className="text-muted-foreground mb-6" style={{ fontSize: 'var(--text-body-s)' }}>
          Define <strong>Brand</strong>, <strong>Surface</strong> and <strong>Error</strong> seed colors &rarr; generates perceptually uniform <strong>Primitive Token</strong> scales in the OKLCH color space, maps them to ready-to-use <strong>Semantic Tokens</strong> (shadcn/ui compatible), and previews your theme across Light, Dark and High Contrast modes.
        </p>

        {/* Main layout: controls + preview */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-6 mb-8">
          <div>
            <SeedColors />
          </div>
          <div>
            <h3 className="text-body-s font-semibold mb-3">Theme Preview</h3>
            <SurfacePreview shapeTokens={sharedShapeTokens} shape={sharedShape} />
          </div>
        </div>

        {/* Primitive Tokens */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h2 className="text-body-s font-semibold mb-3">Primitive Tokens</h2>
          <PrimitiveTabs />
        </div>

        {/* Code Export */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <CodeExport />
        </div>
      </AppShell>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
