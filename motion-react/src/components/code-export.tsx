import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CodeBlock } from '@core/code-block';
import { llmRulesFooter, llmShareHeader } from '@core/share-link';
import {
  generateMotionCompose,
  generateMotionCss,
  generateMotionDesignTokens,
  generateMotionJs,
  generateMotionLlmBriefing,
  generateMotionSwiftUI,
} from '@core/motion-code-export';
import { useMotionStore } from '@/store/motion-store';
import { useMotionPrimitives } from '@/hooks/use-motion-primitives';

type Platform = 'css' | 'swift' | 'compose' | 'js';

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'css', label: 'CSS' },
  { id: 'swift', label: 'SwiftUI' },
  { id: 'compose', label: 'Compose' },
  { id: 'js', label: 'Motion' },
];

export function CodeExport({ restoreUrl }: { restoreUrl: string }) {
  const energy = useMotionStore((s) => s.energy);
  const material = useMotionStore((s) => s.material);
  const primitives = useMotionPrimitives();
  const [tab, setTab] = useState('css');
  const [copyPlatform, setCopyPlatform] = useState<Platform>('css');
  const [copyTokens, setCopyTokens] = useState(true);
  const [copyLlm, setCopyLlm] = useState(true);

  const opts = useMemo(() => ({ character: { energy, material }, primitives, restoreUrl }), [energy, material, primitives, restoreUrl]);
  const code = useMemo(() => ({
    css: generateMotionCss(opts),
    swift: generateMotionSwiftUI(opts),
    compose: generateMotionCompose(opts),
    js: generateMotionJs(opts),
    tokens: generateMotionDesignTokens(opts),
    llm: llmShareHeader(restoreUrl) + generateMotionLlmBriefing(opts) + llmRulesFooter(),
  }), [opts, restoreUrl]);

  const handleCopyAll = useCallback(() => {
    const parts = [code[copyPlatform]];
    if (copyTokens) parts.push(code.tokens);
    if (copyLlm) parts.push(code.llm);
    navigator.clipboard.writeText(parts.join('\n\n')).then(() => toast('All selected sections copied!'));
  }, [code, copyPlatform, copyTokens, copyLlm]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-body-s font-semibold">Code export</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Copy className="h-3.5 w-3.5" />
              Copy All
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-3">
            <div className="space-y-3">
              <div>
                <span className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">Format</span>
                <div className="grid grid-cols-2 gap-1 mt-1.5">
                  {PLATFORMS.map((p) => (
                    <Button
                      key={p.id}
                      variant={copyPlatform === p.id ? 'default' : 'outline'}
                      size="sm"
                      className="h-7 text-caption"
                      onClick={() => setCopyPlatform(p.id)}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="border-t border-border pt-2 space-y-2">
                <span className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">Include</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={copyTokens} onCheckedChange={(v) => setCopyTokens(!!v)} />
                  <span className="text-caption">Design Tokens</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={copyLlm} onCheckedChange={(v) => setCopyLlm(!!v)} />
                  <span className="text-caption">LLM Briefing</span>
                </label>
              </div>
              <Button size="sm" className="w-full" onClick={handleCopyAll}>Copy Selected</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="css" className="text-caption">CSS</TabsTrigger>
          <TabsTrigger value="swift" className="text-caption">SwiftUI</TabsTrigger>
          <TabsTrigger value="compose" className="text-caption">Compose</TabsTrigger>
          <TabsTrigger value="js" className="text-caption">Motion (JS)</TabsTrigger>
          <TabsTrigger value="tokens" className="text-caption">Design Tokens</TabsTrigger>
          <TabsTrigger value="llm" className="text-caption">LLM Briefing</TabsTrigger>
        </TabsList>
        <TabsContent value="css"><CodeBlock code={code.css} mode="css" /></TabsContent>
        <TabsContent value="swift"><CodeBlock code={code.swift} mode="markdown" /></TabsContent>
        <TabsContent value="compose"><CodeBlock code={code.compose} mode="markdown" /></TabsContent>
        <TabsContent value="js"><CodeBlock code={code.js} mode="markdown" /></TabsContent>
        <TabsContent value="tokens"><CodeBlock code={code.tokens} mode="json" /></TabsContent>
        <TabsContent value="llm"><CodeBlock code={code.llm} mode="markdown" /></TabsContent>
      </Tabs>
      <p className="text-caption text-muted-foreground mt-3">
        CSS uses linear() to draw the exact spring and falls back to a fitted cubic-bezier. Design Tokens carry the cubic-bezier fit for tools without springs, plus the spring values as an extension. Every format includes a reduced-motion variant: no paths, effects stay, and press, move and expand become a crossfade.
      </p>
    </div>
  );
}
