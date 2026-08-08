import { useState, type CSSProperties, type ReactNode, type KeyboardEvent, type FocusEvent } from 'react';
import type { RoleTheme, Ladder } from '@/lib/system-tokens';
import { TraceTable, type TraceRow } from '@/components/trace-table';
import { focusRingCss } from '@core/ring';

interface CardProps {
  theme: RoleTheme;
  motionMs: number;
}

function intensityNote(theme: RoleTheme, ladder: Ladder): string {
  if (ladder.reversed) return theme.isDark ? 'darker — scale end, flipped' : 'lighter — scale end, flipped';
  return theme.isDark ? 'lighter' : 'darker';
}

function RoleCard({ name, desc, specimen, rows, active, control }: {
  name: string;
  desc: string;
  specimen: ReactNode;
  rows: TraceRow[];
  active: Set<string>;
  control?: ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-mono font-semibold text-primary" style={{ fontSize: 'var(--text-body-m)' }}>{name}</h2>
        {control}
      </div>
      <p className="text-caption text-muted-foreground mt-0.5 mb-4">{desc}</p>
      <div className="bg-background border border-border rounded-md min-h-24 flex items-center justify-center gap-5 p-5 mb-4">
        {specimen}
      </div>
      <TraceTable rows={rows} active={active} />
    </div>
  );
}

function isFocusVisible(e: FocusEvent<HTMLElement>): boolean {
  return e.target.matches(':focus-visible');
}

/** Focus decoration in whichever ring shape the shape module is set to.
 *  Specimens carry a transparent border at rest so the soft ring can colour it
 *  without shifting the layout. */
function ringDecoration(
  theme: RoleTheme,
  focused: boolean,
  opts: { color?: string; offset?: number } = {},
): CSSProperties {
  const color = opts.color ?? theme.ringColor;
  if (!focused) return { outline: 'none' };
  const ring = focusRingCss(theme.ringStyle, theme.ringWidth, opts.offset ?? theme.ringOffset, color);
  return {
    outline: ring.outline,
    outlineOffset: ring.outlineOffset,
    ...(ring.glow && { boxShadow: ring.glow }),
    ...(ring.borderColor && { borderColor: ring.borderColor }),
  };
}

export function PressableCard({ theme, motionMs }: CardProps) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focusVis, setFocusVis] = useState(false);

  const bg = pressed ? theme.brand.pressed.hex : hover ? theme.brand.hover.hex : theme.brand.rest.hex;
  const active = new Set<string>([pressed ? 'pressed' : hover ? 'hover' : 'rest']);
  if (focusVis) active.add('focus');

  const onKey = (down: boolean) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') setPressed(down);
  };

  return (
    <RoleCard
      name="pressable"
      desc="Buttons, clickable cards, chips. Momentary states only — nothing persists."
      active={active}
      specimen={
        <button
          className="font-medium cursor-pointer"
          style={{
            background: bg,
            color: theme.brand.fg,
            border: '1px solid transparent',
            borderRadius: 999,
            padding: '0.6rem 1.4rem',
            fontSize: 'var(--text-body-s)',
            transition: `background ${motionMs}ms ease`,
            ...ringDecoration(theme, focusVis),
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => { setHover(false); setPressed(false); }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onKeyDown={onKey(true)}
          onKeyUp={onKey(false)}
          onFocus={(e) => setFocusVis(isFocusVisible(e))}
          onBlur={() => setFocusVis(false)}
        >
          Save changes
        </button>
      }
      rows={[
        { id: 'rest', state: 'rest', rule: 'skin defaults', token: theme.brand.rest },
        { id: 'hover', state: 'hover', rule: `one rung (100 step numbers) more intensity — away from the surface (${intensityNote(theme, theme.brand)}), cursor pointer`, token: theme.brand.hover },
        { id: 'pressed', state: 'pressed', rule: 'two rungs, same direction — never back toward rest; depth is the shape module’s job', token: theme.brand.pressed },
        { id: 'focus', state: 'focus-visible', rule: 'ring from the shape module, keyboard only', tokenText: `ring ${theme.ringWidth}px ${theme.ringStyle}` },
        { id: 'disabled', state: 'disabled', rule: "forbidden — an element acts, or explains why it can't", tokenText: '∅', forbidden: true },
      ]}
    />
  );
}

export function ToggleableCard({ theme, motionMs }: CardProps) {
  const [on, setOn] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusVis, setFocusVis] = useState(false);

  const trackRest = on ? theme.brand.rest : theme.track.rest;
  const trackHover = on ? theme.brand.hover : theme.track.hover;
  const bg = hover ? trackHover.hex : trackRest.hex;

  const active = new Set<string>([on ? 'on' : 'off']);
  if (hover) active.add('hover');
  if (focusVis) active.add('focus');

  return (
    <RoleCard
      name="toggleable"
      desc="Switches, checkboxes, tabs. Adds one persistent axis: on / off."
      active={active}
      specimen={
        <button
          role="switch"
          aria-checked={on}
          className="cursor-pointer relative shrink-0"
          style={{
            width: 46,
            height: 26,
            background: bg,
            border: '1px solid transparent',
            borderRadius: 999,
            transition: `background ${motionMs}ms ease`,
            ...ringDecoration(theme, focusVis),
          }}
          onClick={() => setOn(v => !v)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={(e) => setFocusVis(isFocusVisible(e))}
          onBlur={() => setFocusVis(false)}
        >
          <span
            className="absolute rounded-full"
            style={{
              top: 3,
              left: 3,
              width: 20,
              height: 20,
              background: theme.fg,
              transform: on ? 'translateX(20px)' : 'none',
              transition: `transform ${motionMs}ms ease`,
            }}
          />
        </button>
      }
      rows={[
        { id: 'off', state: 'off', rule: 'neutral palette', token: theme.track.rest },
        { id: 'on', state: 'on', rule: 'palette switch → brand', token: theme.brand.rest },
        { id: 'hover', state: 'hover', rule: `one rung more intensity, inside whichever palette is active (${intensityNote(theme, on ? theme.brand : theme.track)})`, token: on ? theme.brand.hover : theme.track.hover },
        { id: 'focus', state: 'focus-visible', rule: 'ring from the shape module', tokenText: `ring ${theme.ringWidth}px ${theme.ringStyle}` },
      ]}
    />
  );
}

export function EditableCard({ theme, motionMs }: CardProps) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const borderColor = invalid
    ? theme.field.invalid.hex
    : focused
      ? theme.field.focusBorder.hex
      : hover
        ? theme.field.rest.hover.hex
        : theme.field.rest.rest.hex;
  const ringColor = invalid ? theme.field.invalid.hex : theme.ringColor;

  const active = new Set<string>();
  if (invalid) active.add('invalid');
  if (focused) active.add('focus');
  if (!focused && !invalid) active.add(hover ? 'hover' : 'rest');

  return (
    <RoleCard
      name="editable"
      desc="Inputs, textareas, selects. Focus is always visible — typing is focus."
      active={active}
      control={
        <button
          onClick={() => setInvalid(v => !v)}
          aria-pressed={invalid}
          className={`shrink-0 px-3 py-1 rounded-full text-caption border transition-colors cursor-pointer ${
            invalid ? 'bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
          }`}
          style={invalid ? { borderColor: theme.field.invalid.hex, color: theme.field.invalid.hex } : undefined}
        >
          invalid
        </button>
      }
      specimen={
        <input
          placeholder="you@example.com"
          className="w-56"
          style={{
            background: theme.elevated,
            color: theme.fg,
            border: `1px solid ${borderColor}`,
            borderRadius: Math.min(theme.radius, 10),
            padding: '0.55rem 0.9rem',
            fontSize: 'var(--text-body-s)',
            transition: `border-color ${motionMs}ms ease`,
            ...ringDecoration(theme, focused, { color: ringColor, offset: 1 }),
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      }
      rows={[
        { id: 'rest', state: 'rest', rule: 'surface background, neutral border', token: theme.field.rest.rest },
        { id: 'hover', state: 'hover', rule: `border one rung more intensity (${intensityNote(theme, theme.field.rest)})`, token: theme.field.rest.hover },
        { id: 'focus', state: 'focus', rule: 'ring always visible, border → brand', token: theme.field.focusBorder },
        { id: 'invalid', state: 'invalid', rule: 'palette switch → error on border and ring', token: theme.field.invalid },
        { id: 'readonly', state: 'readonly', rule: 'full contrast, no ring, no edit cursor — not disabled', tokenText: '—' },
      ]}
    />
  );
}

const NAV_ITEMS = ['Overview', 'Documentation', 'Changelog'];

export function NavigableCard({ theme, motionMs }: CardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [target, setTarget] = useState<number | null>(null);
  const [pressed, setPressed] = useState(false);
  const [focusVis, setFocusVis] = useState<number | null>(null);

  const ladderOf = (current: boolean): Ladder => current ? theme.navCurrent : theme.navRow;
  const activeLadder = ladderOf(target === currentIndex);

  const backgroundOf = (index: number, current: boolean): string => {
    const ladder = ladderOf(current);
    if (target !== index) return current ? ladder.rest.hex : 'transparent';
    return pressed ? ladder.pressed.hex : ladder.hover.hex;
  };

  const active = new Set<string>(['current']);
  active.add(target === null ? 'rest' : (pressed ? 'pressed' : 'hover'));
  if (focusVis !== null) active.add('focus');

  return (
    <RoleCard
      name="navigable"
      desc="Goes somewhere, and can be the current one. Shown as a nav-row skin — the same role also wears pills, tabs, or inline links."
      active={active}
      specimen={
        <nav className="w-56 flex flex-col gap-1">
          {NAV_ITEMS.map((label, i) => (
            <a
              key={label}
              href="#"
              aria-current={i === currentIndex ? 'page' : undefined}
              onClick={(e) => { e.preventDefault(); setCurrentIndex(i); }}
              onMouseEnter={() => setTarget(i)}
              onMouseLeave={() => { setTarget(null); setPressed(false); }}
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              onFocus={(e: FocusEvent<HTMLElement>) => setFocusVis(isFocusVisible(e) ? i : null)}
              onBlur={() => setFocusVis(null)}
              className="relative block no-underline cursor-pointer"
              style={{
                background: backgroundOf(i, i === currentIndex),
                color: i === currentIndex ? theme.fg : theme.muted,
                fontSize: 'var(--text-body-s)',
                border: '1px solid transparent',
                borderRadius: Math.min(theme.radius, 10),
                padding: '0.45rem 0.75rem 0.45rem 1rem',
                transition: `background ${motionMs}ms ease, color ${motionMs}ms ease`,
                ...ringDecoration(theme, focusVis === i),
              }}
            >
              {i === currentIndex && (
                <span
                  aria-hidden
                  className="absolute rounded-full"
                  style={{ left: 4, top: '25%', bottom: '25%', width: 3, background: theme.navMarker.hex }}
                />
              )}
              {label}
            </a>
          ))}
        </nav>
      }
      rows={[
        { id: 'rest', state: 'rest', rule: 'transparent — the row inherits the surface it sits on', token: theme.navRow.rest },
        { id: 'hover', state: 'hover', rule: `one rung more intensity, inside whichever palette is active (${intensityNote(theme, activeLadder)})`, token: activeLadder.hover },
        { id: 'pressed', state: 'pressed', rule: 'two rungs, same direction — same rule as every other pressable thing', token: activeLadder.pressed },
        { id: 'current', state: 'current', rule: 'aria-current → palette switch, plus a marker bar: colour is never the only signal', token: theme.navCurrent.rest },
        { id: 'focus', state: 'focus-visible', rule: 'ring from the shape module', tokenText: `ring ${theme.ringWidth}px ${theme.ringStyle}` },
      ]}
    />
  );
}

export function ReadableCard({ theme }: CardProps) {
  const [hover, setHover] = useState(false);

  const active = new Set<string>(hover ? ['hover'] : ['rest']);

  const badge = (label: string) => (
    <span
      className="text-caption font-semibold select-text"
      style={{
        background: theme.elevated,
        color: theme.muted,
        border: `1px solid ${theme.border}`,
        borderRadius: 999,
        padding: '0.3rem 0.9rem',
        cursor: 'default',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </span>
  );

  return (
    <RoleCard
      name="readable"
      desc="Badges, labels, stat values. The cell without a soul — feedback is forbidden."
      active={active}
      specimen={<>{badge('v0.1.5')}{badge('18 steps')}</>}
      rows={[
        { id: 'rest', state: 'rest', rule: 'skin defaults, text stays selectable', tokenText: '—' },
        { id: 'hover', state: 'hover', rule: 'forbidden — no feedback, no pointer cursor', tokenText: '∅', forbidden: true },
        { id: 'focus', state: 'focus', rule: 'forbidden — never in tab order', tokenText: '∅', forbidden: true },
      ]}
    />
  );
}
