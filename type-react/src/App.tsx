import { useCallback } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ScaleControls } from '@/components/scale-controls';
import { TypePreview } from '@/components/type-preview';
import { ScaleTable } from '@/components/scale-table';
import { ScaleDiagram } from '@/components/scale-diagram';
import { CodeExport } from '@/components/code-export';
import { useFontLoader } from '@/hooks/use-font-loader';
import { hashSync } from '@/lib/hash-sync';
import { useCurrentHash } from '@core/use-hash';
import { pageShareUrl } from '@core/share-link';
import { AppShell } from '@core/app-shell';

function App() {
  useFontLoader();
  const hash = useCurrentHash(hashSync);

  const handleShare = useCallback(() => {
    const url = pageShareUrl(window.location.origin + window.location.pathname, hash);
    navigator.clipboard.writeText(url).then(() => toast('Share link copied!'));
  }, [hash]);

  return (
    <>
      <AppShell activeTool="type" hash={hash} overflowXHidden>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-semibold" style={{ fontSize: 'var(--text-h4)', lineHeight: 'var(--leading-h4)' }}>
            Type
          </h1>
          <Button variant="default" onClick={handleShare}>
            Share Scale
          </Button>
        </div>
        <p className="text-muted-foreground mb-6" style={{ fontSize: 'var(--text-body-s)' }}>
          Choose a <strong>Scale Mode</strong> (Golden Ratio, Traditional, or
          Custom) and <strong>Fontshare Fonts</strong> &rarr; generates fluid{' '}
          <code className="text-caption">clamp()</code> values, previews your
          typographic hierarchy, and exports production-ready CSS or Tailwind
          tokens.
        </p>

        {/* Main layout: controls + preview */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,520px)_minmax(0,1fr)] gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 shrink-0">
            <ScaleControls />
          </div>
          <div className="overflow-visible">
            <TypePreview />
          </div>
        </div>

        {/* Scale Diagram + Table */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-6 mb-6">
          <div className="hidden xl:block bg-card border border-border rounded-lg p-4">
            <h2 className="text-body-s font-semibold mb-3">Scale</h2>
            <ScaleDiagram />
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-body-s font-semibold mb-3">Values</h2>
            <ScaleTable />
          </div>
        </div>

        {/* Code Export */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <CodeExport />
        </div>
      </AppShell>
      <Toaster />
    </>
  );
}

export default App;
