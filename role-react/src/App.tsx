import { useCallback, useMemo, useState } from 'react';
import { AppShell } from '@core/app-shell';
import { buildUnifiedHash } from '@core/unified-hash';
import { readSegments, buildRoleTheme } from '@/lib/system-tokens';
import { PressableCard, ToggleableCard, EditableCard, NavigableCard, ReadableCard } from '@/components/role-inspector';
import { CodeExport } from '@/components/code-export';

function App() {
  const [segments] = useState(() => readSegments(window.location.hash.slice(1)));
  const [reducedMotion, setReducedMotion] = useState(false);
  const [copied, setCopied] = useState(false);

  const theme = useMemo(() => buildRoleTheme(segments), [segments]);
  const motionMs = reducedMotion ? 0 : 150;

  const getCurrentHash = useCallback(() => buildUnifiedHash({
    c: segments.c ?? undefined,
    t: segments.t ?? undefined,
    s: segments.s ?? undefined,
    y: segments.y ?? undefined,
    p: segments.p ?? undefined,
  }), [segments]);

  const handleShare = useCallback(() => {
    const hash = getCurrentHash();
    const url = window.location.origin + window.location.pathname + (hash ? '#' + hash : '');
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [getCurrentHash]);

  const cardProps = { theme, motionMs };

  return (
    <AppShell activeTool="role" buildHash={getCurrentHash}>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-semibold" style={{ fontSize: 'var(--text-h4)', lineHeight: 'var(--leading-h4)' }}>
          Role
        </h1>
        <button
          onClick={handleShare}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-caption font-medium cursor-pointer transition-colors"
        >
          {copied ? 'Copied!' : 'Share Config'}
        </button>
      </div>
      <p className="text-muted-foreground mb-4 max-w-4xl" style={{ fontSize: 'var(--text-body-s)' }}>
        Behavior is platform truth &mdash; there is nothing to configure, only to understand.
        Roles emit state; your palette, shape and motion decide what that state looks like:
        momentary states (hover, pressed) shift <em className="text-foreground not-italic">within</em> the active
        palette, persistent ones (on, current, invalid) <em className="text-foreground not-italic">switch</em> it.
        {theme.themeName ? <> Themed from <span className="text-foreground font-medium">{theme.themeName}</span>.</> : null}
      </p>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setReducedMotion(v => !v)}
          aria-pressed={reducedMotion}
          className={`px-3 py-1.5 rounded-full text-caption border transition-colors cursor-pointer ${
            reducedMotion
              ? 'border-primary text-foreground bg-primary/10'
              : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          Reduced motion
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
        <PressableCard {...cardProps} />
        <ToggleableCard {...cardProps} />
        <EditableCard {...cardProps} />
        <NavigableCard {...cardProps} />
        <ReadableCard {...cardProps} />
      </div>

      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3" style={{ fontSize: 'var(--text-body-s)' }}>Export</h3>
        <CodeExport themeName={theme.themeName} ringStyle={theme.ringStyle} />
      </div>
    </AppShell>
  );
}

export default App;
