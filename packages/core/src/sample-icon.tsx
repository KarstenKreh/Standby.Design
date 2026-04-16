import { SAMPLE_ICONS, type IconDef, type SampleIconName } from './sample-icons';

export function SampleIcon({ def, size, viewBox }: { def: IconDef; size: number; viewBox: string }) {
  const paths = Array.isArray(def.d) ? def.d : [def.d];
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      fill={def.type === 'fill' ? 'currentColor' : 'none'}
      stroke={def.type === 'stroke' ? 'currentColor' : 'none'}
      strokeWidth={def.type === 'stroke' ? (def.strokeWidth ?? 2) : 0}
      strokeDasharray={def.strokeDasharray}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Name-based icon renderer. Resolves an icon by name against the selected set id.
 *  Falls back to Lucide if the set id is unknown. */
export function AppIcon({
  name,
  setId,
  size = 16,
  style,
}: {
  name: SampleIconName;
  setId: string | null | undefined;
  size?: number;
  style?: React.CSSProperties;
}) {
  const set = (setId && SAMPLE_ICONS[setId]) || SAMPLE_ICONS['lucide'];
  const def = set.icons[name];
  return (
    <span style={{ display: 'inline-flex', ...style }}>
      <SampleIcon def={def} size={size} viewBox={set.viewBox} />
    </span>
  );
}
