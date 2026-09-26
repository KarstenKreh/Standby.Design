import type { RingStyle } from '@core/url-state/shape';

/* The soft ring is a translucent halo hugging the edge; the full-color border
   next to it is what carries the WCAG 2.2 3:1 focus contrast. The solid ring is
   a hard outline set off from the element. Both come from the shape module. */
const FOCUS_RING_RULES: Record<RingStyle, { pressable: string; editable: string }> = {
  soft: {
    pressable: `  outline: var(--ring-width, 2px) solid transparent;
  border-color: var(--ring);
  box-shadow: 0 0 0 var(--ring-halo-width, 3px) var(--ring-halo, color-mix(in oklab, var(--ring) 40%, transparent));`,
    editable: `  outline: var(--ring-width, 2px) solid transparent;
  border-color: var(--ring);
  box-shadow: 0 0 0 var(--ring-halo-width, 3px) var(--ring-halo, color-mix(in oklab, var(--ring) 40%, transparent));`,
  },
  solid: {
    pressable: `  outline: var(--ring-width, 2px) solid var(--ring);
  outline-offset: var(--ring-offset, 2px);`,
    editable: `  outline: var(--ring-width, 2px) solid var(--ring);
  outline-offset: 1px;`,
  },
};

export function generateRoleCss(themeName: string, ringStyle: RingStyle = 'soft'): string {
  const header = themeName ? `/* ${themeName} — Role State Rules */` : `/* Role State Rules */`;
  const ring = FOCUS_RING_RULES[ringStyle];
  return `${header}
/* Requires the color export (primitive + semantic tokens) from standby.design/system
   and the motion export from standby.design/motion (falls back to 150ms ease) */

/* State tokens — momentary states shift WITHIN the active palette.
   Hover comes toward the pointer: one rung lighter. Pressed sinks in: one
   rung darker. The light does not change with the mode, so both directions
   hold in light and dark mode alike. One rung is 100 step numbers, measured
   in step numbers, not list positions. The steps come from the color export
   (--primary-hover, --primary-pressed, …). */
:root {
  --state-rest: var(--primary);
  --state-hover: var(--primary-hover);
  --state-pressed: var(--primary-pressed);
  --state-motion: var(--motion-fade, 150ms ease);
}

/* Persistent states switch the palette — variation is data, not a new rule. */
[data-severity="error"] {
  --state-rest: var(--destructive);
  --state-hover: var(--destructive-hover);
  --state-pressed: var(--destructive-pressed);
}

/* ── ROLES ─────────────────────────────────────────────────────────────
   A role says WHICH state is live, never what it looks like. It resolves
   --state; the skin below decides what to paint with it. Swap the skin and
   the behaviour is untouched — that is the whole point of the split. */

[data-pressable],
[data-toggleable],
[data-navigable] {
  cursor: pointer;
  --state: var(--state-rest);
  transition: background-color var(--state-motion),
              color var(--state-motion),
              border-color var(--state-motion);
}
[data-pressable]:hover,
[data-toggleable]:hover,
[data-navigable]:hover { --state: var(--state-hover); }

[data-pressable]:active,
[data-toggleable]:active,
[data-navigable]:active { --state: var(--state-pressed); }

[data-pressable]:focus-visible,
[data-toggleable]:focus-visible,
[data-navigable]:focus-visible {
${ring.pressable}
}

/* editable — typing IS focus, so the ring shows on plain :focus */
[data-editable] {
  --state-rest: var(--input);
  --state-hover: var(--input-hover);
  --state: var(--state-rest);
  transition: border-color var(--state-motion), outline-color var(--state-motion);
}
[data-editable]:hover { --state: var(--state-hover); }
[data-editable]:focus {
${ring.editable}
}
[data-editable][readonly] { outline: none; box-shadow: none; }

/* readable — the cell without a soul: no feedback, ever */
[data-readable] { cursor: default; user-select: text; }

/* Persistent states switch the palette — variation is data, not a new rule. */
[data-toggleable][data-state="off"] {
  --state-rest: var(--muted);
  --state-hover: var(--elevated);
  --state-pressed: var(--border);
}
[data-editable][data-invalid] {
  --state-rest: var(--destructive);
  --state-hover: var(--destructive-emphasis);
  --state-pressed: var(--destructive-emphasis);
}

/* ── SKINS ─────────────────────────────────────────────────────────────
   What --state paints, and which palette this skin walks. Nothing here
   knows about clicks or keyboards. A skin that marks "current" does it
   with its own symbol, so colour is never the only signal. */

[data-skin="pill"] {
  background-color: var(--state);
  color: var(--primary-foreground);
  border-radius: 999px;
  padding: 0.6rem 1.4rem;
}

[data-skin="field"] {
  background-color: var(--elevated);
  border: 1px solid var(--state);
  border-radius: var(--radius-md, 8px);
  padding: 0.55rem 0.9rem;
}
[data-skin="field"]:focus { border-color: var(--primary); }

[data-skin="link"] {
  color: var(--state);
  text-decoration: underline;
  text-underline-offset: 3px;
}
[data-skin="link"][aria-current] { text-decoration-thickness: 2px; }

[data-skin="row"] {
  position: relative;
  display: block;
  border-radius: var(--radius-md, 8px);
  padding: 0.45rem 0.75rem 0.45rem 1rem;
  color: var(--muted-foreground);
  --state-rest: transparent;
  --state-hover: var(--elevated);
  --state-pressed: var(--muted);
  background-color: var(--state);
}
[data-skin="row"][aria-current] {
  color: var(--foreground);
  --state-rest: var(--primary-subtle);
  --state-hover: var(--secondary);
  --state-pressed: var(--secondary);
}
[data-skin="row"][aria-current]::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 25%;
  bottom: 25%;
  width: 3px;
  border-radius: 999px;
  background-color: var(--primary);
}`;
}

export function generateGrammarMd(themeName: string): string {
  const title = themeName ? `# Grammar — ${themeName}` : `# Grammar`;
  return `${title}

Single source of truth for AI agents building UI with this design system.
Roles define behavior, skins define looks, this file defines how they combine.

## Roles

Behavior is platform truth — it is never configured, only applied.

- \`pressable\` — buttons, clickable cards, chips. Click, Enter and Space trigger; role="button"; momentary states only.
- \`toggleable\` — switches, checkboxes, tabs. Everything pressable has, plus one persistent axis: on / off.
- \`editable\` — inputs, textareas, selects. Focus is always visible: typing IS focus.
- \`navigable\` — goes somewhere, and can be the current one. Persistent axis:
  current (aria-current). Nothing about underlines lives here: that belongs to
  the inline-link skin, and a nav row or tab wearing the same role has none.
- \`readable\` — badges, labels, stat values. The cell without a soul: no feedback, not in tab order, text stays selectable.

## Dictionary

| Component | Role | Skin | Skin's own symbol (carries "current") |
| --- | --- | --- | --- |
| Button | pressable | pill | — |
| Chip | pressable | chip | — |
| Switch | toggleable | track | knob position |
| Tab | toggleable | tab | indicator |
| Input | editable | field | — |
| Nav item | navigable | row | marker bar |
| Inline link | navigable | text | the underline, thickened |
| Badge | readable | chip | — |

Skin properties, not role properties: the inline-link skin is underlined at
rest and stays underlined — the underline is that skin's symbol, and a symbol
that only appears on hover has failed its job. The row skin is not underlined
at all. Same role either way.

## Rules

1. Momentary states (hover, pressed) shift steps WITHIN the active palette.
   Persistent states (on, current, invalid) SWITCH the palette.
   The error button is not a special case — it is the severity axis.
2. Hover comes toward the pointer: one rung LIGHTER. Pressed sinks in: one
   rung DARKER than rest. The light does not change with the mode, so the
   directions hold in light and dark mode alike — what is closer to the
   light is lighter, in both.
3. A rung is 100 STEP NUMBERS, not the next entry in the list. Lightness is
   linear in the step number, so 300 → 200 and 600 → 700 are the same
   perceived move — while 25 → 50 is only a quarter of one. Measure in step
   numbers and snap to the nearest existing step; never count list positions.
4. Hover and pressed run in OPPOSITE directions from rest, so the two states
   are two rungs apart and never mistaken for each other.
5. Colour and shape tell the same story. The shape module adds the physical
   side of sinking (neobrutalism translates and collapses its echo, neomorph
   insets the shadow, glass dims); colour agrees with it by getting darker.
6. The direction reverses at the ends of the scale. A near-white element
   cannot get lighter: hover takes one rung darker and pressed two. A
   near-black element cannot get darker: pressed takes two rungs lighter.
7. A pinned brand or error colour sits beside the ladder and has no steps.
   Move its OKLCH lightness up (hover) or down (pressed) by one rung's worth (the 400 → 500 distance of
   its palette), keeping hue and chroma, and clamp chroma back into gamut.
8. The focus ring comes from the shape module and appears keyboard-only —
   except on editable, where the ring is always visible while focused.
9. A persistent state needs a second signal beside colour, and that signal is
   taken from the skin's own symbol — the inline link thickens its underline,
   the nav row shows its marker bar, the tab its indicator. Colour alone is
   invisible to colour-blind users (WCAG 1.4.1), and typography is the type
   module's business, so a role must never reach for bold to mark a state.
10. State changes fade with motion.fade from the motion module: an effect
   spring that never overshoots. A moving part, such as a switch thumb, uses
   motion.move. With prefers-reduced-motion the fades stay and moving parts
   crossfade between their two positions instead of travelling.

## Forbidden

- Disabled components. An element acts, or it explains why it can't —
  a greyed-out mystery serves no one. Hide it, or keep it active and let it answer.
- Underline appearing only on hover (inline-link skin). A symbol that hides
  until touched has failed its job.
- Marking a state with font weight. Typography belongs to the type module;
  a role that reaches for bold is solving a problem on the wrong layer.
- Hover feedback, pointer cursor, or tab focus on readable elements.
- Hover darker than rest, or pressed lighter than rest (outside the scale ends).
- Translucent overlays as state feedback (a white veil at 8%). The same veil
  is a big step on a dark colour and nearly nothing on a light one, so it
  breaks the one thing state feedback must hold constant: perceived magnitude.
- Counting list positions instead of step numbers. At the dense ends of the
  scale that silently shrinks the feedback to a quarter of its size.
- Raw color values in state rules — palette steps only.
- A second "except when" inside any rule. That is a new named variant, not an if.
`;
}
