import { useCallback } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppShell } from '@core/app-shell';
import { useCurrentHash } from '@core/use-hash';
import { SHARE_BASE_URL, pageShareUrl } from '@core/share-link';
import { hashSync } from '@/lib/hash-sync';
import { CharacterControls } from '@/components/character-controls';
import { MotionPreview } from '@/components/motion-preview';
import { PrimitiveTable, SemanticTable } from '@/components/token-tables';
import { CodeExport } from '@/components/code-export';

function App() {
  const hash = useCurrentHash(hashSync);

  const handleShare = useCallback(() => {
    const url = pageShareUrl(window.location.origin + window.location.pathname, hash);
    navigator.clipboard.writeText(url).then(() => toast('Share link copied!'));
  }, [hash]);

  const restoreUrl = `${SHARE_BASE_URL}/motion#${hash}`;

  return (
    <TooltipProvider>
      <AppShell activeTool="motion" hash={hash}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-semibold" style={{ fontSize: 'var(--text-h4)', lineHeight: 'var(--leading-h4)' }}>
            Motion
          </h1>
          <Button variant="default" onClick={handleShare}>
            Share Config
          </Button>
        </div>
        <p className="text-muted-foreground mb-6 max-w-4xl" style={{ fontSize: 'var(--text-body-s)' }}>
          Describe your brand&rsquo;s character on two axes. Motion turns it into springs &mdash; spatial ones that may overshoot, effect ones that never do &mdash; and exports them as tokens for CSS, SwiftUI, Compose and Motion.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)] gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-body-s font-semibold mb-3">Character</h2>
            <CharacterControls />
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-body-s font-semibold mb-3">Preview</h2>
            <MotionPreview />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-body-s font-semibold mb-3">Primitive springs</h2>
            <PrimitiveTable />
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-body-s font-semibold mb-3">Semantic tokens</h2>
            <SemanticTable />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <CodeExport restoreUrl={restoreUrl} hash={hash} />
        </div>
      </AppShell>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
