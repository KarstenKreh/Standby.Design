import { useEffect, useMemo, useState, useCallback } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { buildUnifiedHash, readSegments } from '@core/unified-hash';
import { AppShell } from '@core/app-shell';
import { toolUrl } from '@core/tool-nav';
import { encodeState as encodeColorState, DEFAULT_THEME_NAME } from '@core/url-state/color';
import { resolveDesignSystem } from '@core/design-system';
import { SHARE_BASE_URL, pageShareUrl } from '@core/share-link';
import { ColorSummary } from '@/components/color-summary';
import { TypeSummary } from '@/components/type-summary';
import { CombinedExport } from '@/components/combined-export';
import { AppPreview } from '@/components/app-preview';
import { SymbolSummary } from '@/components/symbol-summary';
import { SpaceSummary } from '@/components/space-summary';
import { MotionSummary } from '@/components/motion-summary';
import { useFontLoader } from '@/hooks/use-font-loader';
import { SquarePen } from 'lucide-react';

const initialSegments = readSegments(window.location.hash);

function App() {
  const [segments, setSegments] = useState(initialSegments);
  const system = useMemo(() => resolveDesignSystem(segments), [segments]);
  const hash = useMemo(() => buildUnifiedHash(segments), [segments]);
  const { color: colorState, palettes, type: typeState, scale, spacing, shape: shapeState, symbol: symbolState, space: spaceState, motion: motionState, motionPrimitives } = system;
  const themeName = colorState.themeName;

  const palette = useMemo(
    () => ({ ...palettes, brandInvert: colorState.brandInvert, errorInvert: colorState.errorInvert }),
    [palettes, colorState],
  );

  useFontLoader(typeState.headingFont, typeState.bodyFont, typeState.monoFont);

  useEffect(() => {
    if (hash) history.replaceState(null, '', '#' + hash);
  }, [hash]);

  useEffect(() => {
    document.title = themeName && themeName !== DEFAULT_THEME_NAME
      ? `${themeName} — Design System`
      : 'Design System — standby.design';
  }, [themeName]);

  const handleNameChange = useCallback((name: string) => {
    setSegments(s => ({ ...s, c: encodeColorState({ ...colorState, themeName: name }) }));
  }, [colorState]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(pageShareUrl(window.location.origin + '/system/', hash)).then(() => toast('Share link copied!'));
  }, [hash]);

  const [screenIdx, setScreenIdx] = useState(0);

  return (
    <>
      <AppShell activeTool="system" hash={hash}>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <label className="text-xs text-muted-foreground mb-1 block">Name your Design System</label>
              <input
                type="text"
                value={themeName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My Design System"
                className="text-foreground font-semibold w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/40"
                style={{ fontSize: 'var(--text-h4)', lineHeight: 'var(--leading-h4)' }}
              />
            </div>
            <Button variant="default" onClick={handleShare} className="shrink-0 ml-4">
              Share System
            </Button>
          </div>
        <p className="text-muted-foreground mb-6" style={{ fontSize: 'var(--text-body-s)' }}>
          Combined view of your design system &mdash; color palette, typography, spacing, shadows, and motion in one export.
        </p>

        {/* Live App Preview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold" style={{ fontSize: 'var(--text-body-l, 1.125rem)' }}>Preview</h2>
            <div className="flex items-center rounded-md border border-border overflow-hidden">
              {(['Dashboard', 'Messages', 'Profile'] as const).map((name, i) => (
                <button
                  key={name}
                  onClick={() => setScreenIdx(i)}
                  className={`px-2.5 py-1 text-caption font-medium transition-colors cursor-pointer ${
                    screenIdx === i ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <AppPreview
            palette={palette}
            scale={scale}
            spacing={spacing}
            shape={shapeState}
            themeName={themeName}
            headingFont={typeState.headingFont}
            bodyFont={typeState.bodyFont}
            headingWeight={typeState.headingWeight}
            screenIdx={screenIdx}
            fgContrastMode={colorState.fgContrastMode}
          />
        </div>

        {/* Color Summary */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold" style={{ fontSize: 'var(--text-body-l, 1.125rem)' }}>Color Palette</h2>
            <a
              href={toolUrl('color', hash)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors pr-1"
            >
              <SquarePen size={14} />
              Edit
            </a>
          </div>
          <ColorSummary palette={palette} />
        </div>

        {/* Type Summary */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold" style={{ fontSize: 'var(--text-body-l, 1.125rem)' }}>Typography</h2>
            <a
              href={toolUrl('type', hash)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors pr-1"
            >
              <SquarePen size={14} />
              Edit
            </a>
          </div>
          <TypeSummary scale={scale} spacing={spacing} typeState={typeState} />
        </div>

        {/* Space Summary */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold" style={{ fontSize: 'var(--text-body-l, 1.125rem)' }}>Spacing &amp; Layout</h2>
            <a
              href={toolUrl('space', hash)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors pr-1"
            >
              <SquarePen size={14} />
              Edit
            </a>
          </div>
          <SpaceSummary spacing={spacing} spaceState={spaceState} />
        </div>

        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold" style={{ fontSize: 'var(--text-body-l, 1.125rem)' }}>Motion</h2>
            <a
              href={toolUrl('motion', hash)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors pr-1"
            >
              <SquarePen size={14} />
              Edit
            </a>
          </div>
          <MotionSummary character={motionState} primitives={motionPrimitives} />
        </div>

        {/* Symbol Summary */}
        {symbolState && (
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold" style={{ fontSize: 'var(--text-body-l, 1.125rem)' }}>Icons</h2>
              <a
                href={toolUrl('symbol', hash)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors pr-1"
              >
                <SquarePen size={14} />
                Edit
              </a>
            </div>
            <SymbolSummary symbolState={symbolState} />
          </div>
        )}

        {/* Combined Export */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <CombinedExport system={system} shareUrl={`${SHARE_BASE_URL}/system#${hash}`} />
        </div>
      </AppShell>
      <Toaster />
    </>
  );
}

export default App;
