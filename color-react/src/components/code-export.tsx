import { useState, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { usePalette } from '@/hooks/use-palette';
import { useThemeStore } from '@/store/theme-store';
import { colorPrimitivesExport, colorSemanticExport, colorLlmBriefing } from '@core/color-code-export';
import { systemUrlForHash, toolBriefing, withShareLink } from '@core/share-link';
import { useCurrentHash } from '@core/use-hash';
import { CodeBlock } from '@core/code-block';
import { hashSync } from '@/lib/hash-sync';

export function CodeExport() {
  const palettes = usePalette();
  const store = useThemeStore();
  const hash = useCurrentHash(hashSync);
  const shareUrl = systemUrlForHash(hash);

  const [copyFormat, setCopyFormat] = useState<'oklch' | 'hex'>('oklch');
  const [copySemantic, setCopySemantic] = useState(true);
  const [copyLlm, setCopyLlm] = useState(true);

  const oklchCode = useMemo(() => withShareLink('css', shareUrl, colorPrimitivesExport(store, palettes, 'oklch')), [store, palettes, shareUrl]);
  const hexCode = useMemo(() => withShareLink('css', shareUrl, colorPrimitivesExport(store, palettes, 'hex')), [store, palettes, shareUrl]);
  const semanticCode = useMemo(() => withShareLink('css', shareUrl, colorSemanticExport(store, palettes)), [store, palettes, shareUrl]);
  const llmCode = useMemo(() => toolBriefing(hash, colorLlmBriefing(store, palettes)), [store, palettes, hash]);

  const handleCopyAll = useCallback(() => {
    const parts: string[] = [];
    parts.push(copyFormat === 'oklch' ? oklchCode : hexCode);
    if (copySemantic) parts.push(semanticCode);
    if (copyLlm) parts.push(llmCode);
    const combined = parts.join('\n\n');
    navigator.clipboard.writeText(combined).then(() => toast('All selected sections copied!'));
  }, [copyFormat, copySemantic, copyLlm, oklchCode, hexCode, semanticCode, llmCode]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-body-s font-semibold mb-0.5">Export</h2>
          <p className="text-caption text-muted-foreground">
            Copy individual tabs or use the dropdown to bundle multiple sections
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Copy className="h-3.5 w-3.5" />
              Copy All
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-3">
            <div className="space-y-3">
              <div>
                <span className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">Primitives Format</span>
                <div className="flex gap-1 mt-1.5">
                  <Button
                    variant={copyFormat === 'oklch' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 h-7 text-caption"
                    onClick={() => setCopyFormat('oklch')}
                  >
                    OKLCH
                  </Button>
                  <Button
                    variant={copyFormat === 'hex' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 h-7 text-caption"
                    onClick={() => setCopyFormat('hex')}
                  >
                    Hex
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-2 space-y-2">
                <span className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">Include</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={copySemantic} onCheckedChange={(v) => setCopySemantic(!!v)} />
                  <span className="text-caption">Semantic Tokens</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={copyLlm} onCheckedChange={(v) => setCopyLlm(!!v)} />
                  <span className="text-caption">LLM Instructions</span>
                </label>
              </div>

              <Button size="sm" className="w-full" onClick={handleCopyAll}>
                Copy Selected
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Tabs defaultValue="oklch">
        <TabsList>
          <TabsTrigger value="oklch">Primitives OKLCH</TabsTrigger>
          <TabsTrigger value="hex">Primitives Hex</TabsTrigger>
          <TabsTrigger value="semantic">Semantic</TabsTrigger>
          <TabsTrigger value="llm">LLM Briefing</TabsTrigger>
        </TabsList>
        <TabsContent value="oklch">
          <CodeBlock code={oklchCode} mode="css" />
        </TabsContent>
        <TabsContent value="hex">
          <CodeBlock code={hexCode} mode="css" />
        </TabsContent>
        <TabsContent value="semantic">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">Semantic Layer</Badge>
            <span className="text-caption text-muted-foreground">
              References Primitive Tokens — paste after your :root block
            </span>
          </div>
          <CodeBlock code={semanticCode} mode="css" />
        </TabsContent>
        <TabsContent value="llm">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">LLM Briefing</Badge>
            <span className="text-caption text-muted-foreground">
              Paste into your AI prompt to explain your design system tokens
            </span>
          </div>
          <CodeBlock code={llmCode} mode="markdown" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
