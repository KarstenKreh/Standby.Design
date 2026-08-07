import { useState } from 'react';
import { CodeBlock } from '@core/code-block';
import { generateRoleCss, generateGrammarMd } from '@/lib/role-code-export';

type Tab = 'css' | 'grammar';

export function CodeExport({ themeName }: { themeName: string }) {
  const [tab, setTab] = useState<Tab>('css');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'css', label: 'CSS [data-*] rules' },
    { id: 'grammar', label: 'grammar.md' },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-3">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-md text-caption font-medium transition-colors cursor-pointer ${
              tab === t.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'css'
        ? <CodeBlock code={generateRoleCss(themeName)} mode="css" />
        : <CodeBlock code={generateGrammarMd(themeName)} mode="markdown" />}
    </div>
  );
}
