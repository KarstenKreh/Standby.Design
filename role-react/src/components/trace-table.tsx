import type { StateToken } from '@/lib/system-tokens';

export interface TraceRow {
  id: string;
  state: string;
  rule: string;
  token?: StateToken;
  tokenText?: string;
  forbidden?: boolean;
}

function Swatch({ hex }: { hex: string }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-1.5 align-[1px] border border-white/10"
      style={{ background: hex }}
    />
  );
}

export function TraceTable({ rows, active }: { rows: TraceRow[]; active: Set<string> }) {
  return (
    <table className="w-full border-collapse text-caption">
      <tbody>
        {rows.map((row, i) => {
          const isActive = active.has(row.id);
          return (
            <tr
              key={row.id}
              className={`transition-colors ${isActive ? 'bg-primary/10' : ''} ${i > 0 ? 'border-t border-border' : ''}`}
            >
              <td className={`py-1.5 px-2 font-mono whitespace-nowrap w-28 align-top ${row.forbidden ? 'line-through' : ''} ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {row.state}
              </td>
              <td className={`py-1.5 px-2 align-top ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {row.rule}
              </td>
              <td className={`py-1.5 px-2 font-mono whitespace-nowrap text-right align-top ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {row.token ? (<><Swatch hex={row.token.hex} />{row.token.label}</>) : row.tokenText}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
