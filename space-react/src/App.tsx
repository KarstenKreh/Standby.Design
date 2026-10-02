import { useCallback } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { AppShell } from '@core/app-shell';
import { useCurrentHash } from '@core/use-hash';
import { pageShareUrl } from '@core/share-link';
import { useSpaceStore } from '@/store/space-store';
import { hashSync } from '@/lib/hash-sync';
import { SectionNav } from '@/components/section-nav';
import { SpacingControls } from '@/components/spacing-controls';
import { SpacingTable } from '@/components/spacing-table';
import { BreakpointControls } from '@/components/breakpoint-controls';
import { BreakpointTable } from '@/components/breakpoint-table';
import { ContainerControls } from '@/components/container-controls';
import { ContainerTable } from '@/components/container-table';
import { AspectControls } from '@/components/aspect-controls';
import { AspectPreview } from '@/components/aspect-preview';
import { CodeExport } from '@/components/code-export';

function App() {
  const activeSection = useSpaceStore((s) => s.activeSection);
  const hash = useCurrentHash(hashSync);

  const handleShare = useCallback(() => {
    const url = pageShareUrl(window.location.origin + window.location.pathname, hash);
    navigator.clipboard.writeText(url).then(() => toast('Share link copied!'));
  }, [hash]);

  return (
    <TooltipProvider>
      <AppShell activeTool="space" hash={hash}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-semibold" style={{ fontSize: 'var(--text-h4)', lineHeight: 'var(--leading-h4)' }}>
            Space
          </h1>
          <Button variant="default" onClick={handleShare}>
            Share Config
          </Button>
        </div>
        <p className="text-muted-foreground mb-6" style={{ fontSize: 'var(--text-body-s)' }}>
          Spacing scale, breakpoints, container widths, and aspect ratios &mdash; production-ready layout tokens.
        </p>

        <SectionNav />

        {activeSection === 'spacing' && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-body-s font-semibold mb-3">Spacing controls</h2>
              <SpacingControls />
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-body-s font-semibold mb-3">Spacing scale</h2>
              <SpacingTable />
            </div>
          </div>
        )}

        {activeSection === 'breakpoints' && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-body-s font-semibold mb-3">Breakpoint controls</h2>
              <BreakpointControls />
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-body-s font-semibold mb-3">Breakpoints</h2>
              <BreakpointTable />
            </div>
          </div>
        )}

        {activeSection === 'containers' && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-body-s font-semibold mb-3">Container controls</h2>
              <ContainerControls />
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-body-s font-semibold mb-3">Containers</h2>
              <ContainerTable />
            </div>
          </div>
        )}

        {activeSection === 'aspect' && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-body-s font-semibold mb-3">Aspect controls</h2>
              <AspectControls />
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-body-s font-semibold mb-3">Preview</h2>
              <AspectPreview />
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <CodeExport />
        </div>
      </AppShell>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
