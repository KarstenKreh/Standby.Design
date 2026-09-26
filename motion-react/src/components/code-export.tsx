import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@core/code-block';
import {
  generateMotionCompose,
  generateMotionCss,
  generateMotionDesignTokens,
  generateMotionJs,
  generateMotionSwiftUI,
} from '@core/motion-code-export';
import { useMotionStore } from '@/store/motion-store';
import { useMotionPrimitives } from '@/hooks/use-motion-primitives';

export function CodeExport({ restoreUrl }: { restoreUrl: string }) {
  const energy = useMotionStore((s) => s.energy);
  const material = useMotionStore((s) => s.material);
  const primitives = useMotionPrimitives();
  const [tab, setTab] = useState('css');

  const opts = useMemo(() => ({ character: { energy, material }, primitives, restoreUrl }), [energy, material, primitives, restoreUrl]);
  const code = useMemo(() => ({
    css: generateMotionCss(opts),
    swift: generateMotionSwiftUI(opts),
    compose: generateMotionCompose(opts),
    js: generateMotionJs(opts),
    tokens: generateMotionDesignTokens(opts),
  }), [opts]);

  return (
    <div>
      <h2 className="text-body-s font-semibold mb-3">Code export</h2>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="css" className="text-caption">CSS</TabsTrigger>
          <TabsTrigger value="swift" className="text-caption">SwiftUI</TabsTrigger>
          <TabsTrigger value="compose" className="text-caption">Compose</TabsTrigger>
          <TabsTrigger value="js" className="text-caption">Motion (JS)</TabsTrigger>
          <TabsTrigger value="tokens" className="text-caption">Design Tokens</TabsTrigger>
        </TabsList>
        <TabsContent value="css"><CodeBlock code={code.css} mode="css" /></TabsContent>
        <TabsContent value="swift"><CodeBlock code={code.swift} mode="markdown" /></TabsContent>
        <TabsContent value="compose"><CodeBlock code={code.compose} mode="markdown" /></TabsContent>
        <TabsContent value="js"><CodeBlock code={code.js} mode="markdown" /></TabsContent>
        <TabsContent value="tokens"><CodeBlock code={code.tokens} mode="json" /></TabsContent>
      </Tabs>
      <p className="text-caption text-muted-foreground mt-3">
        CSS uses linear() to draw the exact spring and falls back to a fitted cubic-bezier. Design Tokens carry the cubic-bezier fit for tools without springs, plus the spring values as an extension. Every format includes a reduced-motion variant: effects only, no paths.
      </p>
    </div>
  );
}
