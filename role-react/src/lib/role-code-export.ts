export function generateRoleCss(themeName: string): string {
  const header = themeName ? `/* ${themeName} — Role State Rules */` : `/* Role State Rules */`;
  return `${header}
/* Requires the color export (primitive + semantic tokens) from standby.design/system */

/* State tokens — momentary states shift WITHIN the active palette.
   Intensity means away from the surface: darker in light mode, lighter in
   dark mode. One rung is 100 step numbers (hover), two for pressed —
   measured in step numbers, not list positions, because lightness is linear
   in the step number. Pressed is always further than hover, never back
   toward rest. Where a palette runs out, flip both to the other direction —
   the constant is the perceived magnitude, never the sign. */
:root {
  --state-rest: var(--primary);
  --state-hover: var(--color-brand-700);
  --state-pressed: var(--color-brand-800);
  --state-motion: 150ms;
}
.dark {
  --state-hover: var(--color-brand-300);
  --state-pressed: var(--color-brand-200);
}

/* Persistent states switch the palette — variation is data, not a new rule. */
[data-severity="error"] {
  --state-rest: var(--destructive);
  --state-hover: var(--color-error-700);
  --state-pressed: var(--color-error-800);
}
.dark [data-severity="error"] {
  --state-hover: var(--color-error-300);
  --state-pressed: var(--color-error-200);
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
  transition: background-color var(--state-motion) ease,
              color var(--state-motion) ease,
              border-color var(--state-motion) ease;
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
  outline: var(--ring-width, 2px) solid var(--ring);
  outline-offset: var(--ring-offset, 2px);
}

/* editable — typing IS focus, so the ring shows on plain :focus */
[data-editable] {
  --state: var(--state-rest);
  transition: border-color var(--state-motion) ease, outline-color var(--state-motion) ease;
}
[data-editable]:hover { --state: var(--state-hover); }
[data-editable]:focus {
  outline: var(--ring-width, 2px) solid var(--ring);
  outline-offset: 1px;
}
[data-editable][readonly] { outline: none; }

/* readable — the cell without a soul: no feedback, ever */
[data-readable] { cursor: default; user-select: text; }

/* Persistent states switch the palette — variation is data, not a new rule. */
[data-toggleable][data-state="off"] {
  --state-rest: var(--muted);
  --state-hover: var(--border);
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
  background-color: var(--card);
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
  --state-hover: var(--muted);
  --state-pressed: var(--accent);
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
}

@media (prefers-reduced-motion: reduce) {
  :root { --state-motion: 0ms; }
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
2. Interactive elements gain INTENSITY on hover: one rung away from the
   surface they sit on. Light mode reads as darker, dark mode as lighter —
   one rule, both modes. Intensity is a direction, not a lightness.
3. A rung is 100 STEP NUMBERS, not the next entry in the list. Lightness is
   linear in the step number, so 300 → 200 and 600 → 700 are the same
   perceived move — while 25 → 50 is only a quarter of one. Measure in step
   numbers and snap to the nearest existing step; never count list positions.
4. Pressed moves two rungs in the SAME direction. It is always further than
   hover, never back toward rest.
5. Colour carries intensity, shape carries depth. The physical metaphor of a
   button sinking belongs to the shape module (neobrutalism translates and
   collapses its echo, neomorph insets the shadow, glass dims) — never to
   colour. Told in both places, the two eventually contradict each other.
6. The direction reverses at the ends of the scale. Where the rungs collapse
   onto rest or onto each other, hover and pressed both run the other way.
   A near-white element cannot get whiter; it darkens, and that reads right.
7. A pinned brand or error colour sits beside the ladder and has no steps.
   Move its OKLCH lightness by one rung's worth (the 400 → 500 distance of
   its palette), keeping hue and chroma, and clamp chroma back into gamut.
8. The focus ring comes from the shape module and appears keyboard-only —
   except on editable, where the ring is always visible while focused.
9. A persistent state needs a second signal beside colour, and that signal is
   taken from the skin's own symbol — the inline link thickens its underline,
   the nav row shows its marker bar, the tab its indicator. Colour alone is
   invisible to colour-blind users (WCAG 1.4.1), and typography is the type
   module's business, so a role must never reach for bold to mark a state.
10. Transitions run 150ms; prefers-reduced-motion makes them instant.

## Forbidden

- Disabled components. An element acts, or it explains why it can't —
  a greyed-out mystery serves no one. Hide it, or keep it active and let it answer.
- Underline appearing only on hover (inline-link skin). A symbol that hides
  until touched has failed its job.
- Marking a state with font weight. Typography belongs to the type module;
  a role that reaches for bold is solving a problem on the wrong layer.
- Hover feedback, pointer cursor, or tab focus on readable elements.
- Pressed rendered weaker than hover, or back toward the rest value.
- Translucent overlays as state feedback (a white veil at 8%). The same veil
  is a big step on a dark colour and nearly nothing on a light one, so it
  breaks the one thing state feedback must hold constant: perceived magnitude.
- Counting list positions instead of step numbers. At the dense ends of the
  scale that silently shrinks the feedback to a quarter of its size.
- Raw color values in state rules — palette steps only.
- A second "except when" inside any rule. That is a new named variant, not an if.
`;
}
