import { useCallback } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { SymbolControls } from '@/components/symbol-controls';
import { SymbolPreview } from '@/components/symbol-preview';
import { CodeExport } from '@/components/code-export';
import { AppShell } from '@core/app-shell';
import { useCurrentHash } from '@core/use-hash';
import { pageShareUrl } from '@core/share-link';
import { hashSync } from '@/lib/hash-sync';

function App() {
  const hash = useCurrentHash(hashSync);

  const handleShare = useCallback(() => {
    const url = pageShareUrl(window.location.origin + window.location.pathname, hash);
    navigator.clipboard.writeText(url).then(() => toast('Share link copied!'));
  }, [hash]);

  return (
    <TooltipProvider>
      <AppShell activeTool="symbol" hash={hash}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-semibold" style={{ fontSize: 'var(--text-h4)', lineHeight: 'var(--leading-h4)' }}>
            Symbol
          </h1>
          <Button variant="default" onClick={handleShare}>
            Share Config
          </Button>
        </div>
        <p className="text-muted-foreground mb-6" style={{ fontSize: 'var(--text-body-s)' }}>
          Find the icon set that matches your brand &mdash; get sizing tokens and export recommendations.
        </p>

        {/* Main layout: controls + preview */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,520px)_minmax(0,1fr)] gap-6 mb-8">
          <div>
            <SymbolControls />
          </div>
          <div>
            <h3 className="text-body-s font-semibold mb-3">Preview</h3>
            <SymbolPreview />
          </div>
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
