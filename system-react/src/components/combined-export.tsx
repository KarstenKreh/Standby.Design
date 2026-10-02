import { useMemo, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CodeBlock } from '@core/code-block';
import type { DesignSystem } from '@core/design-system';
import { generateSystemExport, type SystemExportFormat } from '@core/system-export';

interface CombinedExportProps {
  system: DesignSystem;
  shareUrl: string;
}

export function CombinedExport({ system, shareUrl }: CombinedExportProps) {
  const [activeTab, setActiveTab] = useState('css');

  // Copy All state
  const [copyFormat, setCopyFormat] = useState<'css' | 'tailwind'>('css');
  const [copyEmbed, setCopyEmbed] = useState(true);
  const [copyLlm, setCopyLlm] = useState(true);

  const outputs = useMemo(() => {
    const out = (format: SystemExportFormat) => generateSystemExport(system, format, { shareUrl });
    return { css: out('css'), tailwind: out('tailwind'), embed: out('font-embed'), tokens: out('design-tokens'), llm: out('llm-briefing') };
  }, [system, shareUrl]);

  const handleCopyAll = useCallback(() => {
    const parts: string[] = [];
    parts.push(copyFormat === 'css' ? outputs.css : outputs.tailwind);
    if (copyEmbed) parts.push(outputs.embed);
    if (copyLlm) parts.push(outputs.llm);
    const combined = parts.join('\n\n');
    navigator.clipboard.writeText(combined).then(() => toast('All selected sections copied!'));
  }, [copyFormat, copyEmbed, copyLlm, outputs]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-body-s font-semibold">Combined Export</h2>
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
                <span className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">Format</span>
                <div className="flex gap-1 mt-1.5">
                  <Button
                    variant={copyFormat === 'css' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 h-7 text-caption"
                    onClick={() => setCopyFormat('css')}
                  >
                    CSS
                  </Button>
                  <Button
                    variant={copyFormat === 'tailwind' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 h-7 text-caption"
                    onClick={() => setCopyFormat('tailwind')}
                  >
                    Tailwind
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-2 space-y-2">
                <span className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">Include</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={copyEmbed} onCheckedChange={(v) => setCopyEmbed(!!v)} />
                  <span className="text-caption">Font Embed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={copyLlm} onCheckedChange={(v) => setCopyLlm(!!v)} />
                  <span className="text-caption">LLM Briefing</span>
                </label>
              </div>

              <Button size="sm" className="w-full" onClick={handleCopyAll}>
                Copy Selected
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="css" className="text-caption">
            CSS Custom Properties
          </TabsTrigger>
          <TabsTrigger value="tailwind" className="text-caption">
            Tailwind v4
          </TabsTrigger>
          <TabsTrigger value="embed" className="text-caption">
            Font Embed
          </TabsTrigger>
          <TabsTrigger value="tokens" className="text-caption">
            Design Tokens
          </TabsTrigger>
          <TabsTrigger value="llm" className="text-caption">
            LLM Briefing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="css">
          <CodeBlock code={outputs.css} mode="css" />
        </TabsContent>
        <TabsContent value="tailwind">
          <CodeBlock code={outputs.tailwind} mode="css" />
        </TabsContent>
        <TabsContent value="embed">
          <CodeBlock code={outputs.embed} mode="html" />
        </TabsContent>
        <TabsContent value="tokens">
          <CodeBlock code={outputs.tokens} mode="json" />
        </TabsContent>
        <TabsContent value="llm">
          <CodeBlock code={outputs.llm} mode="markdown" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
