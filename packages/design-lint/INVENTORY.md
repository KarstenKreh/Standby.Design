# Inventar der Design-Regeln für design-lint

Aus den 62 Regelnotizen in `docs/rules/` sind 369 Merkmale ("Woran Du den Verstoß erkennst") nach Prüfart und Werkzeug eingeordnet.

Umgesetzt sind die acht Regeln mit dem Präfix `standby/` (Lint, siehe README) und `count-text-styles` (DOM, `standby-design-lint review`). Alles mit `neu:` ist ein Vorschlag, `review-checklist` deckt der Skill `design-review` ab.

| Prüfart | Anzahl Merkmale | Anzahl Regeln |
|---|---|---|
| Lint | 113 | 38 |
| DOM | 105 | 40 |
| Visuell | 151 | 46 |
| Summe | 369 | 62 |

Eine Regel zählt in jeder Prüfart, in der sie mindestens ein Merkmal hat, deshalb ergibt die Spalte "Anzahl Regeln" mehr als die Gesamtzahl.

## Häufigste Lint-Kandidaten

| Werkzeug | Merkmale |
|---|---|
| standby/no-raw-values | 11 |
| neu: use-intl-formatting | 5 |
| standby/no-opacity-on-semantic-colors | 5 |
| standby/no-click-on-non-interactive | 4 |
| neu: no-input-blocking-during-motion | 3 |
| neu: autocomplete-attributes | 2 |
| neu: motion-duration-tokens | 2 |
| neu: no-bare-key-shortcut | 2 |
| neu: no-behavior-in-skin | 2 |
| neu: no-fixed-height-on-text | 2 |
| neu: no-margin-spacing-on-children | 2 |
| neu: no-orientation-lock | 2 |
| neu: no-tabindex-misuse | 2 |
| neu: no-text-white-on-fill | 2 |
| neu: prose-max-width | 2 |
| neu: require-global-css-rules | 2 |
| neu: require-reduced-motion | 2 |
| neu: wrap-native-inputs | 2 |
| standby/no-inline-style | 2 |
| neu: dark-variant-required | 1 |
| neu: email-spellcheck-off | 1 |
| neu: fields-inside-form | 1 |
| neu: flex-child-min-w-0 | 1 |
| neu: focus-ring-needs-outline | 1 |
| neu: focus-ring-single-source | 1 |
| neu: input-name-semantics | 1 |
| neu: input-type-inputmode | 1 |
| neu: link-button-semantics | 1 |
| neu: long-text-break-words | 1 |
| neu: no-action-on-pointer-down | 1 |
| neu: no-autofocus-destructive | 1 |
| neu: no-char-filtering-onchange | 1 |
| neu: no-console-only-errors | 1 |
| neu: no-css-background-icon | 1 |
| neu: no-default-primary-variant | 1 |
| neu: no-device-sniffing | 1 |
| neu: no-disabled-by-permission | 1 |
| neu: no-disabled-display-input | 1 |
| neu: no-divider-component | 1 |
| neu: no-font-weight-override-on-title | 1 |
| neu: no-geo-language | 1 |
| neu: no-height-override-prop | 1 |
| neu: no-height-padding-in-views | 1 |
| neu: no-interactive-in-tooltip | 1 |
| neu: no-invert-filter-darkmode | 1 |
| neu: no-js-width-switching | 1 |
| neu: no-layout-transitions | 1 |
| neu: no-navigate-on-change | 1 |
| neu: no-negative-margin-reset | 1 |
| neu: no-numeric-postcode | 1 |
| neu: no-outline-none | 1 |
| neu: no-padding-on-card | 1 |
| neu: no-paste-prevent | 1 |
| neu: no-radius-override-in-views | 1 |
| neu: no-rebuilt-component-in-views | 1 |
| neu: no-role-menu-for-navigation | 1 |
| neu: no-submit-on-destructive | 1 |
| neu: no-title-attribute-only | 1 |
| neu: no-type-number-for-amount | 1 |
| neu: no-uniform-padding | 1 |
| neu: no-vh-units | 1 |
| neu: no-visual-reorder | 1 |
| neu: optimistic-update-needs-rollback | 1 |
| neu: require-color-scheme | 1 |
| neu: require-contrast-media-queries | 1 |
| neu: safe-area-insets | 1 |
| neu: shadow-token-per-scheme | 1 |
| neu: single-icon-package | 1 |
| neu: state-colors-from-tokens | 1 |
| neu: submit-via-form | 1 |
| neu: tooltip-needs-focus-trigger | 1 |
| neu: video-autoplay-needs-muted | 1 |
| standby/no-disabled-by-validity | 1 |
| standby/no-space-utilities | 1 |
| standby/no-state-classes-in-views | 1 |
| standby/no-transition-all | 1 |

## Häufigste DOM-Kandidaten

| Werkzeug | Merkmale |
|---|---|
| axe | 18 |
| count-text-styles | 3 |
| dom: no-horizontal-overflow-320 | 3 |
| dom: non-text-contrast | 3 |
| dom: semantic-structure | 3 |
| dom: view-state-in-url | 3 |
| dom: autoplay-has-pause | 2 |
| dom: centered-column | 2 |
| dom: concentric-radii | 2 |
| dom: duplicate-heading-text | 2 |
| dom: hover-direction | 2 |
| dom: layout-shift | 2 |
| dom: long-list-needs-search | 2 |
| dom: row-equal-heights | 2 |
| dom: visual-order-matches-dom-order | 2 |
| dom: adjacent-series-contrast | 1 |
| dom: alt-not-filename | 1 |
| dom: aria-current-on-active-item | 1 |
| dom: aria-expanded-on-disclosure | 1 |
| dom: aria-invalid-on-error-field | 1 |
| dom: aria-sort-on-sortable-column | 1 |
| dom: canvas-text-alternative | 1 |
| dom: chip-badge-distinct-size | 1 |
| dom: consistent-decimals-in-column | 1 |
| dom: count-border-widths | 1 |
| dom: count-distinct-heights | 1 |
| dom: count-distinct-surface-colors | 1 |
| dom: cursor-pointer-needs-action | 1 |
| dom: decorative-image-empty-alt | 1 |
| dom: dialog-background-inert | 1 |
| dom: dialog-focus-trap | 1 |
| dom: enter-no-destructive-action | 1 |
| dom: enter-submits-form | 1 |
| dom: esc-closes-overlay | 1 |
| dom: first-tab-stop-skip-link | 1 |
| dom: focus-first-invalid-field | 1 |
| dom: focus-layout-shift | 1 |
| dom: focus-return-after-close | 1 |
| dom: heading-scroll-margin | 1 |
| dom: hover-differs-from-selected | 1 |
| dom: icon-button-square | 1 |
| dom: label-click-toggles-checkbox | 1 |
| dom: live-region-preexisting | 1 |
| dom: loading-button-stable | 1 |
| dom: maxlength-needs-counter | 1 |
| dom: no-keyboard-trap | 1 |
| dom: no-nested-dialogs | 1 |
| dom: numeric-column-alignment | 1 |
| dom: one-primary-per-view | 1 |
| dom: overlay-fits-viewport | 1 |
| dom: prose-line-length | 1 |
| dom: rapid-double-click | 1 |
| dom: reduced-motion-emulation | 1 |
| dom: row-equal-radii | 1 |
| dom: select-has-explicit-colors | 1 |
| dom: shortcut-ignored-in-fields | 1 |
| dom: slider-keyboard-support | 1 |
| dom: sticky-needs-scroll-padding | 1 |
| dom: styled-text-without-heading | 1 |
| dom: tabular-nums | 1 |
| dom: target-size | 1 |
| dom: toast-live-region | 1 |
| dom: toggle-has-aria-state | 1 |
| dom: tooltip-hoverable | 1 |
| dom: truncated-text-has-full-text | 1 |
| dom: underline-only-on-links | 1 |
| dom: unique-document-title | 1 |
| dom: unit-non-breaking-space | 1 |
| dom: validation-timing | 1 |

## Alle Merkmale

| Regel | Kategorie | Merkmal | Prüfart | Werkzeug |
|---|---|---|---|---|
| Alles geht mit der Tastatur, in der Reihenfolge des Bildes | Bedienung | Klick-Handler ohne Tastenweg. | Lint | standby/no-click-on-non-interactive |
| Alles geht mit der Tastatur, in der Reihenfolge des Bildes | Bedienung | `tabindex="-1"` an etwas Bedienbarem. | Lint | neu: no-tabindex-misuse |
| Alles geht mit der Tastatur, in der Reihenfolge des Bildes | Bedienung | Menü oder Popover, das Esc ignoriert. | DOM | dom: esc-closes-overlay |
| Alles geht mit der Tastatur, in der Reihenfolge des Bildes | Bedienung | Eine Stelle, aus der Tab nicht mehr herausführt. | DOM | dom: no-keyboard-trap |
| Alles geht mit der Tastatur, in der Reihenfolge des Bildes | Bedienung | `keydown` am `document` für eine einzelne Taste ohne Strg, Alt oder Cmd. | Lint | neu: no-bare-key-shortcut |
| Alles geht mit der Tastatur, in der Reihenfolge des Bildes | Bedienung | Das Kürzel feuert auch, während ein Feld den Fokus hat. | DOM | dom: shortcut-ignored-in-fields |
| Alles geht mit der Tastatur, in der Reihenfolge des Bildes | Bedienung | Kürzel auf `/` oder `?`, die auf einer anderen Tastaturbelegung nicht erreichbar sind. | Lint | neu: no-bare-key-shortcut |
| Alles geht mit der Tastatur, in der Reihenfolge des Bildes | Bedienung | `tabindex` größer als 0. | Lint | neu: no-tabindex-misuse |
| Alles geht mit der Tastatur, in der Reihenfolge des Bildes | Bedienung | CSS `order`, `flex-direction: row-reverse` oder `column-reverse` an Elementen mit Text oder Bedienung. | Lint | neu: no-visual-reorder |
| Alles geht mit der Tastatur, in der Reihenfolge des Bildes | Bedienung | Umgestellte `grid-area` oder absolute Positionierung, die die sichtbare Reihenfolge ändert. | DOM | dom: visual-order-matches-dom-order |
| Alles geht mit der Tastatur, in der Reihenfolge des Bildes | Bedienung | Beim Durchtabben springt der Fokus rückwärts oder quer. | DOM | dom: visual-order-matches-dom-order |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | Die Dauer wird pro Komponente gewählt, es gibt 100, 200 und 300 Millisekunden nebeneinander. | Lint | neu: motion-duration-tokens |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | Eine Dauer liegt außerhalb des Korridors, ohne dass jemand das begründen kann. | Lint | neu: motion-duration-tokens |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | `prefers-reduced-motion` kommt im Projekt nirgends vor. | Lint | neu: require-reduced-motion |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | Eine Ansicht animiert beim Laden Elemente ein, obwohl die Einstellung Bewegung reduziert. | DOM | dom: reduced-motion-emulation |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | `transition: all`, Tailwind `transition-all`. | Lint | standby/no-transition-all |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | Animiertes `height`, `width`, `top`, `left`, `margin`. | Lint | neu: no-layout-transitions |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | `pointer-events: none` während eines Übergangs. | Lint | neu: no-input-blocking-during-motion |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | Flag wie `isAnimating`, das Klicks verwirft. | Lint | neu: no-input-blocking-during-motion |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | `await` auf das Ende einer Animation vor dem Seitenwechsel. | Lint | neu: no-input-blocking-during-motion |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | Ein schneller Doppelklick öffnet und schließt nicht. | DOM | dom: rapid-double-click |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | Kopf und Inhalt einer Karte haben verschiedene Animationen oder Verzögerungen. | Visuell | review-checklist |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | Abschnitte ohne Bezug blenden gestaffelt nacheinander ein. | Visuell | review-checklist |
| Bewegung hat einen Wert und hält nichts auf | Bedienung | Beim Öffnen eines Panels rutscht ein Element mit, das nicht dazugehört. | Visuell | review-checklist |
| Der Fokus ist sichtbar und hat immer einen Ort | Bedienung | Irgendwo steht `outline: none` ohne Ersatz. | Lint | neu: no-outline-none |
| Der Fokus ist sichtbar und hat immer einen Ort | Bedienung | Eine Leiste mit `position: sticky` oder `fixed`, aber kein `scroll-padding` an der Seite. Beim Durchtabben verschwindet der Fokus darunter. | DOM | dom: sticky-needs-scroll-padding |
| Der Fokus ist sichtbar und hat immer einen Ort | Bedienung | Beim Durchtabben einer Ansicht verliert man die Position. | Visuell | review-checklist |
| Der Fokus ist sichtbar und hat immer einen Ort | Bedienung | Der Fokus verschiebt beim Erscheinen das Layout oder überlagert Nachbarn. | DOM | dom: focus-layout-shift |
| Der Fokus ist sichtbar und hat immer einen Ort | Bedienung | Der Fokus wird pro Komponente anders gebaut. | Lint | neu: focus-ring-single-source |
| Der Fokus ist sichtbar und hat immer einen Ort | Bedienung | Ein Anker springt zu einer Überschrift, und sie liegt hinter der fixierten Leiste. Kein `scroll-margin-top` an Überschriften. | DOM | dom: heading-scroll-margin |
| Der Fokus ist sichtbar und hat immer einen Ort | Bedienung | Dialog ohne Fokusfalle. | DOM | dom: dialog-focus-trap |
| Der Fokus ist sichtbar und hat immer einen Ort | Bedienung | Nach dem Schließen ist `document.activeElement` der `body`. | DOM | dom: focus-return-after-close |
| Der Fokus ist sichtbar und hat immer einen Ort | Bedienung | Absenden mit Fehlern ohne `focus()` auf ein Feld. | DOM | dom: focus-first-invalid-field |
| Die Höhe gehört der Zeile, nicht dem Element | Bedienung | In einer Filter- oder Formularzeile stehen Feld und Button verschieden hoch. | DOM | dom: row-equal-heights |
| Die Höhe gehört der Zeile, nicht dem Element | Bedienung | Ein Element trägt seine Höhe oder sein senkrechtes Padding direkt in der Ansicht. | Lint | neu: no-height-padding-in-views |
| Die Höhe gehört der Zeile, nicht dem Element | Bedienung | Es gibt eine Höhe, die nur an einer einzigen Stelle vorkommt. | DOM | dom: count-distinct-heights |
| Die Höhe gehört der Zeile, nicht dem Element | Bedienung | Ein Icon-Element ist rechteckig statt quadratisch. | DOM | dom: icon-button-square |
| Die Höhe gehört der Zeile, nicht dem Element | Bedienung | Ein Element wird per Sonderschalter angehoben, obwohl seine Zeile schon sagt, welche Höhe gilt. | Lint | neu: no-height-override-prop |
| Die Höhe gehört der Zeile, nicht dem Element | Bedienung | Unter einem Formular stehen Speichern und Abbrechen in der dichten Höhe. | Visuell | review-checklist |
| Die Höhe gehört der Zeile, nicht dem Element | Bedienung | Ein Suchfeld in einer Werkzeugleiste ist höher als die Knöpfe daneben. | DOM | dom: row-equal-heights |
| Ein Button ist nie gesperrt | Bedienung | `disabled={!isValid}`, `disabled={!isDirty}` oder `disabled={!accepted}` an einem Button. | Lint | standby/no-disabled-by-validity |
| Ein Button ist nie gesperrt | Bedienung | Ein ausgegrauter Button ohne Erklärung in der Nähe. | Visuell | review-checklist |
| Ein Button ist nie gesperrt | Bedienung | Ein Button ohne Recht ist grau statt weg. | Lint | neu: no-disabled-by-permission |
| Ein Button ist nie gesperrt | Bedienung | Das Ladezeichen ersetzt die Beschriftung, oder der Button bleibt während der Anfrage klickbar. | DOM | dom: loading-button-stable |
| Ein Button ist nie gesperrt | Bedienung | Ein Feld, das nur einen Wert anzeigt, ist als gesperrtes Eingabefeld gebaut. Dann lässt sich der Wert nicht kopieren, und der… | Lint | neu: no-disabled-display-input |
| Ein Tooltip ergänzt, er trägt nie allein | Bedienung | Pflichthinweis nur im `title`. | Lint | neu: no-title-attribute-only |
| Ein Tooltip ergänzt, er trägt nie allein | Bedienung | Tooltip nur mit `onMouseEnter`. | Lint | neu: tooltip-needs-focus-trigger |
| Ein Tooltip ergänzt, er trägt nie allein | Bedienung | Link oder Button im Tooltip. | Lint | neu: no-interactive-in-tooltip |
| Ein Tooltip ergänzt, er trägt nie allein | Bedienung | Tooltip verschwindet, sobald die Maus hineinfährt. | DOM | dom: tooltip-hoverable |
| Eine Handlung löst beim Loslassen aus | Bedienung | Handlung in `onMouseDown`, `onPointerDown`, `onTouchStart` oder `onPressIn`. | Lint | neu: no-action-on-pointer-down |
| Eine lange Auswahl lässt sich durchsuchen | Bedienung | Auswahl mit 200 Ländern ohne Tippsuche. | DOM | dom: long-list-needs-search |
| Eine lange Auswahl lässt sich durchsuchen | Bedienung | Menü mit 25 Einträgen ohne Gruppen. | DOM | dom: long-list-needs-search |
| Eine lange Auswahl lässt sich durchsuchen | Bedienung | Eine Liste von Personen ohne Suchfeld. | Visuell | review-checklist |
| Gewicht ist ein Budget, ein Primary pro Ansicht | Bedienung | In einer Ansicht stehen zwei gefüllte Buttons. | DOM | dom: one-primary-per-view |
| Gewicht ist ein Budget, ein Primary pro Ansicht | Bedienung | Die Beschriftung beschreibt einen Zustand: „Keine Änderungen“, „Gespeichert“, „Fertig“. | Visuell | review-checklist |
| Gewicht ist ein Budget, ein Primary pro Ansicht | Bedienung | Eine Nebenaufgabe in der Werkzeugleiste trägt die Primary-Farbe. | Visuell | review-checklist |
| Gewicht ist ein Budget, ein Primary pro Ansicht | Bedienung | Ein Button ohne Angabe fällt auf Primary zurück statt auf die leise Standardstufe. | Lint | neu: no-default-primary-variant |
| Jede Geste hat einen zweiten Weg per Klick | Bedienung | Sortieren nur per Drag. | Visuell | review-checklist |
| Jede Geste hat einen zweiten Weg per Klick | Bedienung | Löschen nur per Wischen. | Visuell | review-checklist |
| Jede Geste hat einen zweiten Weg per Klick | Bedienung | Zoom nur per Pinch. | Visuell | review-checklist |
| Jede Geste hat einen zweiten Weg per Klick | Bedienung | Regler ohne Pfeiltasten. | DOM | dom: slider-keyboard-support |
| Jede Geste hat einen zweiten Weg per Klick | Bedienung | Rückgängig nur per Schütteln, oder Kippen löst etwas aus, ohne dass es sich abschalten lässt. | Visuell | review-checklist |
| Klickbares hat eine Fläche, und nur Klickbares sieht so aus | Bedienung | Ein `<a>` oder ein `Text` mit `onPress`, ohne umgebende Fläche. | Visuell | review-checklist |
| Klickbares hat eine Fläche, und nur Klickbares sieht so aus | Bedienung | Ein Umschalter („Zur Monatsansicht", „Alle anzeigen") ist als reiner Text gebaut. | Visuell | review-checklist |
| Klickbares hat eine Fläche, und nur Klickbares sieht so aus | Bedienung | Die Fußzeile besteht aus einer Reihe nackter Links. | Visuell | review-checklist |
| Klickbares hat eine Fläche, und nur Klickbares sieht so aus | Bedienung | Die Trefferfläche wird kleiner gesetzt, um das Element unauffälliger zu machen. | DOM | dom: target-size |
| Klickbares hat eine Fläche, und nur Klickbares sieht so aus | Bedienung | Ein Zurück über dem Inhalt ist ein Pfeil mit Text, ohne Fläche. | Visuell | review-checklist |
| Klickbares hat eine Fläche, und nur Klickbares sieht so aus | Bedienung | Ein Icon-Button ist kleiner als 24 × 24 Pixel, etwa ein Schließen-X mit 12 Pixel. | DOM | axe |
| Klickbares hat eine Fläche, und nur Klickbares sieht so aus | Bedienung | Nur das Kästchen einer Checkbox ist klickbar, nicht ihre Beschriftung. | DOM | dom: label-click-toggles-checkbox |
| Klickbares hat eine Fläche, und nur Klickbares sieht so aus | Bedienung | `cursor: pointer` oder Hover-Effekt an einer Karte ohne Handlung. | DOM | dom: cursor-pointer-needs-action |
| Klickbares hat eine Fläche, und nur Klickbares sieht so aus | Bedienung | Pfeil-Icon in einer Zeile, die sich nicht öffnet. | Visuell | review-checklist |
| Klickbares hat eine Fläche, und nur Klickbares sieht so aus | Bedienung | Unterstrichener Text, der kein Link ist. | DOM | dom: underline-only-on-links |
| Klickbares hat eine Fläche, und nur Klickbares sieht so aus | Bedienung | Ein Teil der Karte ist klickbar, der Rest sieht gleich aus und ist es nicht. | Visuell | review-checklist |
| Kurze Zustände verschieben, dauerhafte wechseln die Palette | Bedienung | Hover ist dunkler als der Ruhezustand, oder Gedrückt ist heller. | DOM | dom: hover-direction |
| Kurze Zustände verschieben, dauerhafte wechseln die Palette | Bedienung | Die Richtung dreht sich mit dem Modus um: im Hellen wird Hover dunkler, im Dunkeln heller. | DOM | dom: hover-direction |
| Kurze Zustände verschieben, dauerhafte wechseln die Palette | Bedienung | Hover benutzt dieselbe Farbe wie der Zustand „ausgewählt". | DOM | dom: hover-differs-from-selected |
| Kurze Zustände verschieben, dauerhafte wechseln die Palette | Bedienung | Ein Zustandswechsel wird mit einem durchscheinenden Schleier gebaut. | Lint | standby/no-opacity-on-semantic-colors |
| Kurze Zustände verschieben, dauerhafte wechseln die Palette | Bedienung | Die Schritte sind unterschiedlich groß, weil sie pro Baustein von Hand gewählt wurden. | Lint | neu: state-colors-from-tokens |
| Name und Zustand stehen im Code | Bedienung | `<button><Icon/></button>` ohne `aria-label`. | DOM | axe |
| Name und Zustand stehen im Code | Bedienung | `<input placeholder="E-Mail">` ohne `label`. | DOM | axe |
| Name und Zustand stehen im Code | Bedienung | `aria-label`, das vom sichtbaren Text abweicht. | DOM | axe |
| Name und Zustand stehen im Code | Bedienung | Umschalter, dessen Zustand nur eine Klasse ändert. | DOM | dom: toggle-has-aria-state |
| Name und Zustand stehen im Code | Bedienung | Aufklapper ohne `aria-expanded`. | DOM | dom: aria-expanded-on-disclosure |
| Name und Zustand stehen im Code | Bedienung | Aktiver Menüpunkt ohne `aria-current`. | DOM | dom: aria-current-on-active-item |
| Name und Zustand stehen im Code | Bedienung | Sortierbare Spalte ohne `aria-sort`. | DOM | dom: aria-sort-on-sortable-column |
| Name und Zustand stehen im Code | Bedienung | Fehlerhaftes Feld ohne `aria-invalid`. | DOM | dom: aria-invalid-on-error-field |
| Verhalten und Aussehen bleiben getrennt | Bedienung | Ein Badge reagiert auf Klick. Dann ist es kein Badge, sondern ein Chip. | Lint | standby/no-click-on-non-interactive |
| Verhalten und Aussehen bleiben getrennt | Bedienung | Chip und Badge haben dasselbe Padding und dieselbe Höhe. | DOM | dom: chip-badge-distinct-size |
| Verhalten und Aussehen bleiben getrennt | Bedienung | Ein Switch löst eine einmalige Aktion aus, statt einen Zustand zu halten. Dann ist es ein Button. | Visuell | review-checklist |
| Verhalten und Aussehen bleiben getrennt | Bedienung | Etwas wird über seine Farbe beschrieben („der graue Knopf") statt über sein Verhalten. | Visuell | review-checklist |
| Verhalten und Aussehen bleiben getrennt | Bedienung | Das Aussehen bringt Interaktions-Code mit, oder das Verhalten setzt Farben. | Lint | neu: no-behavior-in-skin |
| Verhalten und Aussehen bleiben getrennt | Bedienung | Das Verhalten wird in einer einzelnen Ansicht nachgebaut statt benutzt. | Lint | neu: no-rebuilt-component-in-views |
| Verhalten und Aussehen bleiben getrennt | Bedienung | Ein Klick sitzt auf einem `div`, `span` oder `li`. | Lint | standby/no-click-on-non-interactive |
| Verhalten und Aussehen bleiben getrennt | Bedienung | Ein `button` wechselt per Code die Seite, oder ein `a` hat kein `href`. | Lint | neu: link-button-semantics |
| Verhalten und Aussehen bleiben getrennt | Bedienung | Die Hauptnavigation hat `role="menu"`, oder ein Element hat eine Rolle ohne die Tastaturbedienung dazu. | Lint | neu: no-role-menu-for-navigation |
| Verhalten und Aussehen werden nicht in der Ansicht nachgebaut | Bedienung | Ein `Pressable` oder ein `div` mit `onClick` trägt in der Ansicht Fläche, Radius und Padding. | Lint | standby/no-click-on-non-interactive |
| Verhalten und Aussehen werden nicht in der Ansicht nachgebaut | Bedienung | Hover-, Fokus- oder Aktiv-Zustände stehen in einer Ansicht statt beim gemeinsamen Verhalten. | Lint | standby/no-state-classes-in-views |
| Verhalten und Aussehen werden nicht in der Ansicht nachgebaut | Bedienung | Das Aussehen enthält Interaktions-Code, oder das Verhalten setzt Farben. | Lint | neu: no-behavior-in-skin |
| Verhalten und Aussehen werden nicht in der Ansicht nachgebaut | Bedienung | Zwei Ansichten zeigen dasselbe Ding mit verschiedenem Radius oder Padding. | Visuell | review-checklist |
| Verhalten und Aussehen werden nicht in der Ansicht nachgebaut | Bedienung | Etwas wird kopiert und dann an einer Stelle angepasst. | Visuell | review-checklist |
| Verhalten und Aussehen werden nicht in der Ansicht nachgebaut | Bedienung | Die Anzahl der handgebauten Stellen lässt sich nicht mehr überblicken. | Visuell | review-checklist |
| Was sich von selbst bewegt, lässt sich anhalten | Bedienung | Karussell ohne Pause-Knopf. | DOM | dom: autoplay-has-pause |
| Was sich von selbst bewegt, lässt sich anhalten | Bedienung | Video mit `autoplay` ohne `muted`. | Lint | neu: video-autoplay-needs-muted |
| Was sich von selbst bewegt, lässt sich anhalten | Bedienung | Laufband oder animierter Hintergrund ohne Stopp. | DOM | dom: autoplay-has-pause |
| Was sich von selbst bewegt, lässt sich anhalten | Bedienung | Endlos-Animation, die `prefers-reduced-motion` ignoriert. | Lint | neu: require-reduced-motion |
| Zerstörendes trifft man nicht aus Versehen | Bedienung | „Löschen“ direkt neben „Speichern“, ohne Abstand. | Visuell | review-checklist |
| Zerstörendes trifft man nicht aus Versehen | Bedienung | „Löschen“ steht rechts unten, wo auf allen anderen Seiten „Speichern“ steht. | Visuell | review-checklist |
| Zerstörendes trifft man nicht aus Versehen | Bedienung | „Alle entfernen“ neben „Hinzufügen“. | Visuell | review-checklist |
| Zerstörendes trifft man nicht aus Versehen | Bedienung | `autoFocus` auf „Löschen". | Lint | neu: no-autofocus-destructive |
| Zerstörendes trifft man nicht aus Versehen | Bedienung | Enter im Dialog löst die zerstörende Handlung aus. | DOM | dom: enter-no-destructive-action |
| Zerstörendes trifft man nicht aus Versehen | Bedienung | Der Löschknopf ist der `type="submit"` im Dialog-Formular. | Lint | neu: no-submit-on-destructive |
| Zerstörendes trifft man nicht aus Versehen | Bedienung | „Sind Sie sicher?“ ohne Namen des Gegenstands. Knöpfe „Ja“ und „Nein“ oder „OK“. | Visuell | review-checklist |
| Farbe trägt nie allein | Farbe | Der aktive Tab unterscheidet sich nur in der Textfarbe. | Visuell | review-checklist |
| Farbe trägt nie allein | Farbe | Eine ausgewählte Kachel ist nur farblich hervorgehoben. | Visuell | review-checklist |
| Farbe trägt nie allein | Farbe | In Graustufen ist nicht mehr erkennbar, welches Element an ist. Das ist der schnellste Test. | Visuell | review-checklist |
| Farbe trägt nie allein | Farbe | Legende nur aus Farbkästchen. | Visuell | review-checklist |
| Farbe trägt nie allein | Farbe | Zwei Linien, die sich nur im Farbton unterscheiden. | Visuell | review-checklist |
| Farbe trägt nie allein | Farbe | Kreisdiagramm ohne Beschriftung an den Stücken. | Visuell | review-checklist |
| Farbe trägt nie allein | Farbe | Benachbarte Reihen unter 3:1 zueinander. | DOM | dom: adjacent-series-contrast |
| Hell und Dunkel sind zwei Entwürfe, keine Umkehrung | Farbe | Die dunkle Erscheinung entsteht durch eine Umkehrung oder einen Filter über die ganze Oberfläche. | Lint | neu: no-invert-filter-darkmode |
| Hell und Dunkel sind zwei Entwürfe, keine Umkehrung | Farbe | Eine Farbe ist einmal festgelegt und wird in beiden Erscheinungen benutzt. | Lint | neu: dark-variant-required |
| Hell und Dunkel sind zwei Entwürfe, keine Umkehrung | Farbe | Die Schatten-Token haben nur einen Wert, und im Dunklen ist die Tiefe deshalb verschwunden. | Lint | neu: shadow-token-per-scheme |
| Hell und Dunkel sind zwei Entwürfe, keine Umkehrung | Farbe | Ein Text ist in einer Erscheinung gut lesbar und in der anderen grenzwertig. | DOM | axe |
| Hell und Dunkel sind zwei Entwürfe, keine Umkehrung | Farbe | Die Seite steht auf reinem Schwarz, die Schrift auf reinem Weiß. | Lint | standby/no-raw-values |
| Hell und Dunkel sind zwei Entwürfe, keine Umkehrung | Farbe | Es gibt nur Screenshots aus einer Erscheinung. Dann wurde auch nur eine geprüft. | Visuell | review-checklist |
| Kontrast hat eine Untergrenze | Farbe | Platzhalter- oder Hilfetext unter 4,5:1. | DOM | axe |
| Kontrast hat eine Untergrenze | Farbe | Feldrahmen als einzige Grenze eines Feldes unter 3:1. | DOM | dom: non-text-contrast |
| Kontrast hat eine Untergrenze | Farbe | Fokusring oder Häkchen unter 3:1. | DOM | dom: non-text-contrast |
| Kontrast hat eine Untergrenze | Farbe | Geprüft nur im hellen Modus. | Visuell | review-checklist |
| Kontrast hat eine Untergrenze | Farbe | Kontrast nur im Ruhezustand geprüft. | Visuell | review-checklist |
| Kontrast hat eine Untergrenze | Farbe | Weiße Schrift auf dem helleren Hover-Zustand unter 4,5:1. | DOM | axe |
| Kontrast hat eine Untergrenze | Farbe | Fokusring nur als `box-shadow`, ohne `outline` als Rückfall. | Lint | neu: focus-ring-needs-outline |
| Kontrast hat eine Untergrenze | Farbe | Feldgrenze nur über eine andere Hintergrundfarbe. | DOM | dom: non-text-contrast |
| Kontrast hat eine Untergrenze | Farbe | Icon als CSS-Hintergrundbild. | Lint | neu: no-css-background-icon |
| Kontrast hat eine Untergrenze | Farbe | Kein `@media (prefers-contrast: more)` oder `(forced-colors: active)` im Projekt. | Lint | neu: require-contrast-media-queries |
| Werte kommen aus Tokens, nie aus der Hand | Farbe | Hex-Werte oder `rgba`-Literale in Ansichten, Komponenten oder eingegrenztem CSS. | Lint | standby/no-raw-values |
| Werte kommen aus Tokens, nie aus der Hand | Farbe | Schriftgrößen als `font-size: 32px` oder `1.75rem` statt aus der Skala. | Lint | standby/no-raw-values |
| Werte kommen aus Tokens, nie aus der Hand | Farbe | Icon-Größen als feste Pixelwerte. | Lint | standby/no-raw-values |
| Werte kommen aus Tokens, nie aus der Hand | Farbe | `text-white` auf einer gefüllten Fläche statt der zugehörigen Gegenfarbe. | Lint | neu: no-text-white-on-fill |
| Werte kommen aus Tokens, nie aus der Hand | Farbe | Verläufe und Schleier aus festen `rgba`-Werten statt aus einer Mischung mit einer Token-Farbe. | Lint | standby/no-raw-values |
| Der Platz ist da, bevor die Daten kommen | Fluss | Der Inhalt trifft ein und schiebt die Seite nach unten. | DOM | dom: layout-shift |
| Der Platz ist da, bevor die Daten kommen | Fluss | Ein Ladezeichen blitzt bei jedem Wechsel kurz auf. | Visuell | review-checklist |
| Der Platz ist da, bevor die Daten kommen | Fluss | Ein Ladehinweis verschwindet wenige Millisekunden nach dem Erscheinen. | Visuell | review-checklist |
| Der Platz ist da, bevor die Daten kommen | Fluss | Ein einzelner ladender Bereich sperrt die ganze Ansicht. | Visuell | review-checklist |
| Der Platz ist da, bevor die Daten kommen | Fluss | Der Platzhalter hat eine andere Höhe als der echte Inhalt. | DOM | dom: layout-shift |
| Der Platz ist da, bevor die Daten kommen | Fluss | Bei einem langen Vorgang steht minutenlang ein sich drehender Kreis ohne Auskunft. | Visuell | review-checklist |
| Der Platz ist da, bevor die Daten kommen | Fluss | Es gibt keine Möglichkeit, einen langen Vorgang zu verlassen. | Visuell | review-checklist |
| Der Zustand der Ansicht steht in der Adresse | Fluss | Filter nur im Komponenten-State. | DOM | dom: view-state-in-url |
| Der Zustand der Ansicht steht in der Adresse | Fluss | Tabs ohne Query-Parameter. | DOM | dom: view-state-in-url |
| Der Zustand der Ansicht steht in der Adresse | Fluss | Neuladen setzt alles zurück. | DOM | dom: view-state-in-url |
| Der Zustand der Ansicht steht in der Adresse | Fluss | Zurück landet oben statt an der alten Stelle. | Visuell | review-checklist |
| Die Sprache kommt aus der Einstellung, nicht aus dem Ort | Fluss | Sprachwahl über IP oder Standort. | Lint | neu: no-geo-language |
| Die Sprache kommt aus der Einstellung, nicht aus dem Ort | Fluss | Kein Weg, die Sprache zu wechseln. | Visuell | review-checklist |
| Die Sprache kommt aus der Einstellung, nicht aus dem Ort | Fluss | Die Wahl wird beim nächsten Besuch vergessen. | Visuell | review-checklist |
| Die Sprache kommt aus der Einstellung, nicht aus dem Ort | Fluss | `lang` fehlt, steht auf „en“ an einer deutschen Oberfläche oder wechselt beim Umschalten der Sprache nicht mit. | DOM | axe |
| Ein Ablauf mit Schritten zeigt, wie weit man ist | Fluss | Mehrstufiges Formular ohne Fortschrittsanzeige. | Visuell | review-checklist |
| Ein Ablauf mit Schritten zeigt, wie weit man ist | Fluss | Zurück leert die Felder. | Visuell | review-checklist |
| Ein Ablauf mit Schritten zeigt, wie weit man ist | Fluss | Es gibt nur den Zurück-Knopf des Browsers, und der verlässt den Ablauf. | Visuell | review-checklist |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Ein Eingabefehler erscheint als Pop-up. | Visuell | review-checklist |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Alle Fehler eines Formulars stehen gesammelt oben statt bei den Feldern. | Visuell | review-checklist |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Das Formular ist nach einem Fehler leer. | Visuell | review-checklist |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Eine technische Meldung steht ungefiltert in der Oberfläche. | Visuell | review-checklist |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Eine Kurzmeldung trägt eine Information, die der Nutzer später wieder braucht. | Visuell | review-checklist |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Es gibt eine Bestätigungsfrage für etwas, das man auch rückgängig machen könnte. | Visuell | review-checklist |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Eine Kurzmeldung mit „Rückgängig“ verschwindet nach fester Zeit, auch wenn die Maus auf ihr liegt. | Visuell | review-checklist |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Ein ungültiges Feld schweigt bis zum Absenden. | Visuell | review-checklist |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Die Fehlermeldung erscheint beim ersten Tastendruck. | DOM | dom: validation-timing |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Kurzmeldung ohne `role="status"` oder `aria-live`. | DOM | dom: toast-live-region |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Trefferzahl ändert sich still. | Visuell | review-checklist |
| Ein Fehler steht dort, wo er entstanden ist | Fluss | Der Live-Bereich wird erst mit der Meldung eingefügt. | DOM | dom: live-region-preexisting |
| Ein Pop-up unterbricht, es führt nicht | Fluss | Im Pop-up stehen mehrere Eingabefelder oder ein „Speichern" für mehrere Werte. | Visuell | review-checklist |
| Ein Pop-up unterbricht, es führt nicht | Fluss | Aus einem Pop-up heraus öffnet sich ein zweites. | DOM | dom: no-nested-dialogs |
| Ein Pop-up unterbricht, es führt nicht | Fluss | Es gibt eine Warnung „Änderungen verwerfen?" beim Schließen eines Pop-ups. | Visuell | review-checklist |
| Ein Pop-up unterbricht, es führt nicht | Fluss | Das Pop-up hat Reiter, Schritte oder einen eigenen Scrollbereich. | Visuell | review-checklist |
| Ein Pop-up unterbricht, es führt nicht | Fluss | Der Zurück-Knopf des Geräts schließt etwas anderes als das, was der Nutzer erwartet. | Visuell | review-checklist |
| Ein Pop-up unterbricht, es führt nicht | Fluss | Der Zustand lässt sich nicht verlinken und kommt nach einem Neuladen nicht wieder. | Visuell | review-checklist |
| Ein Pop-up unterbricht, es führt nicht | Fluss | Das Pop-up hat eine Überschrift, die eigentlich ein Seitentitel ist. | Visuell | review-checklist |
| Ein Pop-up unterbricht, es führt nicht | Fluss | Hinter dem offenen Pop-up scrollt die Seite mit, oder Tab erreicht Elemente dahinter. Kein `inert` am Hintergrund, kein… | DOM | dom: dialog-background-inert |
| Eine Eingabe wechselt nie von selbst den Ort | Fluss | `select` mit `onChange={navigate}`. | Lint | neu: no-navigate-on-change |
| Eine Eingabe wechselt nie von selbst den Ort | Fluss | Absenden beim letzten Zeichen. | Visuell | review-checklist |
| Eine Eingabe wechselt nie von selbst den Ort | Fluss | Fokus springt ungefragt ins nächste Feld. | Visuell | review-checklist |
| Eine Zeitgrenze warnt vorher | Fluss | Abmeldung ohne Hinweis vorher. | Visuell | review-checklist |
| Eine Zeitgrenze warnt vorher | Fluss | Nach dem neuen Login ist das Formular leer. | Visuell | review-checklist |
| Eine Zeitgrenze warnt vorher | Fluss | Ein Angebot oder Schritt läuft ab, ohne dass die Ansicht es ankündigt. | Visuell | review-checklist |
| Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben | Fluss | Ein Abschnitt „Einstellungen“ mit Pfeil liegt über einer Tabelle. | Visuell | review-checklist |
| Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben | Fluss | Ein Aufklappbereich hat einen eigenen Speichern-Knopf. | Visuell | review-checklist |
| Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben | Fluss | Jeder Abschnitt einer Seite speichert für sich. | Visuell | review-checklist |
| Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben | Fluss | Eine Konfiguration lässt sich nicht verlinken. | Visuell | review-checklist |
| Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben | Fluss | Ein Filter oder eine Sortierung hat einen Speichern-Knopf. Das ist derselbe Fehler, nur andersherum. | Visuell | review-checklist |
| Leer ist ein Zustand, keine Lücke | Fluss | Eine Liste rendert bei null Einträgen einfach nichts. | Visuell | review-checklist |
| Leer ist ein Zustand, keine Lücke | Fluss | Derselbe Text erscheint für „noch nie etwas angelegt" und für „Filter ergibt nichts". | Visuell | review-checklist |
| Leer ist ein Zustand, keine Lücke | Fluss | Der leere Zustand meldet einen Mangel, obwohl leer das Ziel war (Posteingang abgearbeitet, keine offenen Fehler). | Visuell | review-checklist |
| Leer ist ein Zustand, keine Lücke | Fluss | Es gibt keinen Weg aus dem leeren Zustand heraus, obwohl ein Filter ihn verursacht hat. | Visuell | review-checklist |
| Leer ist ein Zustand, keine Lücke | Fluss | Der leere Zustand ist höher oder niedriger als der gefüllte, und die Seite springt beim Laden. | Visuell | review-checklist |
| Was vorweg angezeigt wird, wird bei Fehler zurückgenommen | Fluss | Optimistisches Setzen des Zustands ohne `catch` und ohne Rücknahme. | Lint | neu: optimistic-update-needs-rollback |
| Was vorweg angezeigt wird, wird bei Fehler zurückgenommen | Fluss | Fehler landet nur in der Konsole. | Lint | neu: no-console-only-errors |
| Was vorweg angezeigt wird, wird bei Fehler zurückgenommen | Fluss | Nach dem Fehler steht der neue Wert weiter da. | Visuell | review-checklist |
| Die Ebene folgt der Rolle, nicht der Schachtelung | Fläche | Ein Element innerhalb einer Fläche trägt die Farbe der Seite. | Visuell | review-checklist |
| Die Ebene folgt der Rolle, nicht der Schachtelung | Fläche | Es gibt eine Flächenfarbe, die nur an einer einzigen Stelle vorkommt. | DOM | dom: count-distinct-surface-colors |
| Die Ebene folgt der Rolle, nicht der Schachtelung | Fläche | Eine Fläche wird eine Stufe dunkler gesetzt mit der Begründung, sie liege ja schon zwei Ebenen tief. | Visuell | review-checklist |
| Die Ebene folgt der Rolle, nicht der Schachtelung | Fläche | Dasselbe Bauteil hat auf zwei Seiten verschiedene Flächenfarben. | Visuell | review-checklist |
| Konzentrische Radien | Form | Innere und äußere Fläche haben denselben Radius-Wert. | DOM | dom: concentric-radii |
| Konzentrische Radien | Form | Der innere Radius ist größer als der äußere. | DOM | dom: concentric-radii |
| Konzentrische Radien | Form | Die Ecke sieht bei genauem Hinsehen enger aus als die Gerade daneben. | Visuell | review-checklist |
| Konzentrische Radien | Form | Zwei Buttons in einer Zeile haben verschiedene Radien. | DOM | dom: row-equal-radii |
| Konzentrische Radien | Form | Eine Ansicht setzt den Radius eines Buttons, Feldes oder einer Auswahl selbst. | Lint | neu: no-radius-override-in-views |
| Senkrechtes Padding wird optisch ausgeglichen | Form | Ein Kartenabschnitt hat rundherum denselben Wert, und der Textblock wirkt oben und unten trotzdem zu weit von der Kante weg. | Visuell | review-checklist |
| Senkrechtes Padding wird optisch ausgeglichen | Form | Das Padding wird mit einem einzigen `p-4` gesetzt statt getrennt nach Achse. | Lint | neu: no-uniform-padding |
| Senkrechtes Padding wird optisch ausgeglichen | Form | Der Ausgleichswert steht als Rohwert im Code, weil die Skala ihn nicht kennt. | Lint | standby/no-raw-values |
| Der Nutzer tippt nur, was das System nicht weiß | Formular | Das Feld „E-Mail wiederholen“. | Visuell | review-checklist |
| Der Nutzer tippt nur, was das System nicht weiß | Formular | Die Stadt bleibt leer, obwohl die Postleitzahl sie verrät. | Visuell | review-checklist |
| Der Nutzer tippt nur, was das System nicht weiß | Formular | Die Kartenart wird abgefragt, obwohl die Nummer sie zeigt. | Visuell | review-checklist |
| Der Nutzer tippt nur, was das System nicht weiß | Formular | Ein angemeldeter Nutzer tippt seine Adresse im Bestellformular neu. | Visuell | review-checklist |
| Der Nutzer tippt nur, was das System nicht weiß | Formular | Rechnungsadresse ohne „wie Lieferadresse“. | Visuell | review-checklist |
| Der Nutzer tippt nur, was das System nicht weiß | Formular | E-Mail, Telefon oder Betrag als `type="text"` ohne `inputmode`. | Lint | neu: input-type-inputmode |
| Der Nutzer tippt nur, was das System nicht weiß | Formular | Login ohne `autocomplete="username"` und `"current-password"`. | Lint | neu: autocomplete-attributes |
| Der Nutzer tippt nur, was das System nicht weiß | Formular | `autocomplete="off"` an Name oder Adresse. | Lint | neu: autocomplete-attributes |
| Der Nutzer tippt nur, was das System nicht weiß | Formular | Rote Wellenlinie unter einer E-Mail-Adresse. | Lint | neu: email-spellcheck-off |
| Der Nutzer tippt nur, was das System nicht weiß | Formular | Ein Suchfeld heißt `name="password"`, oder der Passwortmanager bietet sich im Suchfeld an. | Lint | neu: input-name-semantics |
| Was der Nutzer tippt oder einfügt, kommt an | Formular | `onPaste` mit `preventDefault()`. | Lint | neu: no-paste-prevent |
| Was der Nutzer tippt oder einfügt, kommt an | Formular | Ein `onChange`, der Zeichen herausfiltert. | Lint | neu: no-char-filtering-onchange |
| Was der Nutzer tippt oder einfügt, kommt an | Formular | `maxLength`, das ohne Zähler abschneidet. | DOM | dom: maxlength-needs-counter |
| Was der Nutzer tippt oder einfügt, kommt an | Formular | Ein Code-Feld, das eingefügte Codes nicht verteilt. | Visuell | review-checklist |
| Was ein Feld beschreibt, steht im Feld | Formular | Ein Icon steht neben dem Feld statt darin. | Visuell | review-checklist |
| Was ein Feld beschreibt, steht im Feld | Formular | Die Einheit steht als eigenes Wort hinter dem Rahmen. | Visuell | review-checklist |
| Was ein Feld beschreibt, steht im Feld | Formular | Ein Icon liegt absolut positioniert über dem Feld, und der Text läuft darunter durch. | Visuell | review-checklist |
| Was ein Feld beschreibt, steht im Feld | Formular | Das Icon steht an einer Stelle, die die Länge des Inhalts bestimmt. | Visuell | review-checklist |
| Was zusammen gespeichert wird, steht in einem Formular | Formular | Felder ohne umgebendes `form`. | Lint | neu: fields-inside-form |
| Was zusammen gespeichert wird, steht in einem Formular | Formular | Speichern als `type="button"` mit `onClick`. | Lint | neu: submit-via-form |
| Was zusammen gespeichert wird, steht in einem Formular | Formular | Enter im Feld bewirkt nichts. | DOM | dom: enter-submits-form |
| Alles hat eine Textfassung | Inhalt | `img` ohne `alt`. | DOM | axe |
| Alles hat eine Textfassung | Inhalt | `alt` mit Dateinamen oder „Bild". | DOM | dom: alt-not-filename |
| Alles hat eine Textfassung | Inhalt | Bedeutungsvolles SVG ohne `role="img"` und Titel. | DOM | axe |
| Alles hat eine Textfassung | Inhalt | Schmuckbild mit beschreibendem `alt` statt `alt=""`. | DOM | dom: decorative-image-empty-alt |
| Alles hat eine Textfassung | Inhalt | Überschrift als PNG oder SVG mit Pfaden. | Visuell | review-checklist |
| Alles hat eine Textfassung | Inhalt | Text in ein Titelbild eingebrannt. | Visuell | review-checklist |
| Alles hat eine Textfassung | Inhalt | Beschriftungen per `canvas` gezeichnet ohne Textfassung. | DOM | dom: canvas-text-alternative |
| Alles hat eine Textfassung | Inhalt | `video` ohne `track kind="captions"`. | DOM | axe |
| Alles hat eine Textfassung | Inhalt | Podcast oder Sprachnachricht ohne Text. | Visuell | review-checklist |
| Alles hat eine Textfassung | Inhalt | Eingebrannte Untertitel, die sich nicht ausschalten lassen. | Visuell | review-checklist |
| Lange Zeichenketten stehen in Gruppen | Inhalt | IBAN als eine lange Zeile. | Visuell | review-checklist |
| Lange Zeichenketten stehen in Gruppen | Inhalt | Telefonnummer ohne Leerzeichen. | Visuell | review-checklist |
| Lange Zeichenketten stehen in Gruppen | Inhalt | Achtstelliger Code am Stück. | Visuell | review-checklist |
| Lange Zeichenketten stehen in Gruppen | Inhalt | Kopieren liefert die Leerzeichen mit. | Visuell | review-checklist |
| Struktur steckt im Element | Inhalt | Datentabelle aus `div` mit Grid. | DOM | dom: semantic-structure |
| Struktur steckt im Element | Inhalt | Tabelle ohne `th` und `scope`. | DOM | axe |
| Struktur steckt im Element | Inhalt | Aufzählung als Folge von `div`. | DOM | dom: semantic-structure |
| Struktur steckt im Element | Inhalt | Radiogruppe ohne `fieldset` und `legend`, oder ohne `role="radiogroup"` und Namen. | DOM | axe |
| Struktur steckt im Element | Inhalt | Kein `main`. | DOM | axe |
| Struktur steckt im Element | Inhalt | Alles in `div`. | DOM | dom: semantic-structure |
| Struktur steckt im Element | Inhalt | Der erste Tab landet im Menü. | DOM | dom: first-tab-stop-skip-link |
| Zahlen, Daten und Beträge folgen dem Sprachraum | Inhalt | `toFixed(2).replace(".", ",")` oder ein eigener regulärer Ausdruck für Tausenderpunkte. | Lint | neu: use-intl-formatting |
| Zahlen, Daten und Beträge folgen dem Sprachraum | Inhalt | Ein Datum aus `getDate() + "." + getMonth()` zusammengesetzt. | Lint | neu: use-intl-formatting |
| Zahlen, Daten und Beträge folgen dem Sprachraum | Inhalt | Ein fester Sprachraum wie `"de-DE"` im Code einer App, die mehrere Sprachen anbietet. | Lint | neu: use-intl-formatting |
| Zahlen, Daten und Beträge folgen dem Sprachraum | Inhalt | `Intl` oder `toLocaleString()` ohne den Sprachraum, den der Nutzer in der App gewählt hat. | Lint | neu: use-intl-formatting |
| Zahlen, Daten und Beträge folgen dem Sprachraum | Inhalt | Ein Betragsfeld mit `type="number"`. | Lint | neu: no-type-number-for-amount |
| Zahlen, Daten und Beträge folgen dem Sprachraum | Inhalt | Ein Datum wie „03/04/2026“ in einer Oberfläche für mehrere Länder. | Visuell | review-checklist |
| Zahlen, Daten und Beträge folgen dem Sprachraum | Inhalt | In einer Spalte stehen „12 €“ und „12,50 €“ nebeneinander. | DOM | dom: consistent-decimals-in-column |
| Zahlen, Daten und Beträge folgen dem Sprachraum | Inhalt | „10MB“ ohne Leerzeichen, oder die Einheit bricht in die nächste Zeile. | DOM | dom: unit-non-breaking-space |
| Zahlen, Daten und Beträge folgen dem Sprachraum | Inhalt | Eine Postleitzahl als Zahl gespeichert, aus 01067 wird 1067. | Lint | neu: no-numeric-postcode |
| Der Divider ist die Unterkante einer Section | Layout | Es gibt eine Komponente `Divider`, `Separator` oder ein `<hr>` zwischen den Abschnitten. | Lint | neu: no-divider-component |
| Der Divider ist die Unterkante einer Section | Layout | Unter dem letzten Abschnitt sitzt eine Linie, direkt über der Kartenkante. | Visuell | review-checklist |
| Der Divider ist die Unterkante einer Section | Layout | Die Linie ist kürzer als die Karte, weil sie innerhalb des Paddings gezeichnet wird. | Visuell | review-checklist |
| Die Karte hat kein Padding | Layout | Die Karte selbst trägt Padding oder ein Gap. | Lint | neu: no-padding-on-card |
| Die Karte hat kein Padding | Layout | Ein Abschnitt setzt sein Padding mit negativen Margins wieder zurück. Das ist der sichere Beweis, dass das Padding eine Ebene zu hoch sitzt. | Lint | neu: no-negative-margin-reset |
| Die Karte hat kein Padding | Layout | Ein Bild in einer Karte hat links und rechts denselben Abstand wie der Fließtext darüber, obwohl es bis an die Kante gehört. | Visuell | review-checklist |
| Die Karte hat kein Padding | Layout | Ein Chart läuft bis zur Kante, aber die Ecke ist eckig. | Visuell | review-checklist |
| Die Karte hat kein Padding | Layout | Der Inhalt einer Karte ohne Kopf klebt an der Oberkante. | Visuell | review-checklist |
| Die Karte hat kein Padding | Layout | Die Null für das obere Padding hängt an einem Abschnittstyp statt an seiner Position. | Visuell | review-checklist |
| Die Titel bilden eine Gliederung | Layout | Kopfleiste und erste Überschrift der Ansicht nennen dasselbe. | DOM | dom: duplicate-heading-text |
| Die Titel bilden eine Gliederung | Layout | Eine Karte direkt unter dem Titel trägt ihn noch einmal als Kopf. | DOM | dom: duplicate-heading-text |
| Die Titel bilden eine Gliederung | Layout | Titel und Untertitel sagen dasselbe mit anderen Worten. | Visuell | review-checklist |
| Die Titel bilden eine Gliederung | Layout | Auf einen Titel der Ebene 1 folgt direkt einer der Ebene 3. | DOM | axe |
| Die Titel bilden eine Gliederung | Layout | Ein Titel ist nur über Größe und Gewicht gesetzt, ohne Überschriften-Element. | DOM | dom: styled-text-without-heading |
| Die Titel bilden eine Gliederung | Layout | Ein Titel hat dieselbe Größe und dasselbe Gewicht wie die Einträge darunter. | DOM | count-text-styles |
| Die Titel bilden eine Gliederung | Layout | Ein Titel hebt sich nur über ein zweites Icon oder eine Einrückung ab. | Visuell | review-checklist |
| Die Titel bilden eine Gliederung | Layout | Jeder Browser-Tab der Anwendung heißt gleich, der Titel ändert sich beim Seitenwechsel nicht. | DOM | dom: unique-document-title |
| Ein Bedienelement steht bei dem, was es verändert | Layout | Der Speichern-Knopf einer Karte steht im Seitenkopf. | Visuell | review-checklist |
| Ein Bedienelement steht bei dem, was es verändert | Layout | Ein Filter steht über einer anderen Liste als der, die er filtert. | Visuell | review-checklist |
| Ein Bedienelement steht bei dem, was es verändert | Layout | Die Sammelaktionen einer Tabelle stehen weit weg von ihr. | Visuell | review-checklist |
| Ein Bedienelement steht bei dem, was es verändert | Layout | Der Löschen-Knopf einer Zeile steht außerhalb der Zeile. | Visuell | review-checklist |
| Eine schmale Spalte steht in der Mitte | Layout | Eine Spalte hat eine maximale Breite, aber keinen automatischen Rand links und rechts. | DOM | dom: centered-column |
| Eine schmale Spalte steht in der Mitte | Layout | Zurück steht links an der Seite, das Formular darunter in der Mitte. | Visuell | review-checklist |
| Eine schmale Spalte steht in der Mitte | Layout | Die leere Fläche rechts ist breiter als der Inhalt. | DOM | dom: centered-column |
| Erst Abstand, dann Fläche, dann Linie | Layout | Zwischen jedem Abschnitt einer Karte sitzt eine Linie, unabhängig vom Inhalt. | Visuell | review-checklist |
| Erst Abstand, dann Fläche, dann Linie | Layout | Alle Abstände in einer Ansicht sind gleich groß, und die Struktur entsteht nur aus Linien und Rahmen. | Visuell | review-checklist |
| Erst Abstand, dann Fläche, dann Linie | Layout | Ein Formular trennt jedes einzelne Feld mit einer Linie, statt zusammengehörige Felder als Block zu setzen. | Visuell | review-checklist |
| Erst Abstand, dann Fläche, dann Linie | Layout | Mehrzeilige Einträge einer Liste stehen so dicht wie ihre eigenen Zeilen. | Visuell | review-checklist |
| Erst Abstand, dann Fläche, dann Linie | Layout | Jede Fläche auf der Seite hat eine sichtbare Umrandung. | Visuell | review-checklist |
| Erst Abstand, dann Fläche, dann Linie | Layout | Die kräftige Stärke kommt so oft vor, dass sie nichts mehr hervorhebt. | Visuell | review-checklist |
| Erst Abstand, dann Fläche, dann Linie | Layout | Eine Linie trennt Dinge, die schon durch Abstand getrennt sind. | Visuell | review-checklist |
| Erst Abstand, dann Fläche, dann Linie | Layout | Eine Linie wird pro Stelle als Hex- oder Grauwert gesetzt. | Lint | standby/no-raw-values |
| Erst Abstand, dann Fläche, dann Linie | Layout | Es gibt drei oder vier Linienstärken, und niemand kann sagen, wann welche gilt. | DOM | dom: count-border-widths |
| Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um | Layout | Bei 320 Pixeln erscheint ein waagerechter Schieber unter der ganzen Seite statt unter dem breiten Element. | DOM | dom: no-horizontal-overflow-320 |
| Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um | Layout | Eine Filter- oder Buttonzeile schiebt sich aus dem Bild, weil der Umbruch fehlt. | DOM | dom: no-horizontal-overflow-320 |
| Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um | Layout | Ein Overlay steht bündig an den Bildschirmkanten oder ist höher als das Fenster und nicht scrollbar. | DOM | dom: overlay-fits-viewport |
| Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um | Layout | Die Ansicht rechnet mit `vh` und springt beim Ein- und Ausblenden der Browserleiste. | Lint | neu: no-vh-units |
| Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um | Layout | Beim Vergrößern auf 400 Prozent am Desktop bricht die Ansicht auseinander, obwohl sie am Telefon in Ordnung aussieht. | DOM | dom: no-horizontal-overflow-320 |
| Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um | Layout | Eine fixierte Leiste unten sitzt auf dem Home-Strich oder der Navigationsleiste des Systems, oder ein Titel oben liegt unter der… | Visuell | review-checklist |
| Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um | Layout | `viewport-fit=cover` ohne `env(safe-area-inset-*)`. | Lint | neu: safe-area-insets |
| Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um | Layout | Layout hängt an `navigator.userAgent`, `isMobile` oder `Platform.isPad`. | Lint | neu: no-device-sniffing |
| Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um | Layout | Media Query auf `orientation`, die Inhalt ausblendet. | Lint | neu: no-orientation-lock |
| Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um | Layout | `screen.orientation.lock()`. | Lint | neu: no-orientation-lock |
| Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um | Layout | JS liest `window.innerWidth`, um Komponenten zu tauschen, wo CSS reicht. | Lint | neu: no-js-width-switching |
| Jeder Textbehälter hält jede Textmenge aus | Layout | `user-scalable=no` oder `maximum-scale=1`. | DOM | axe |
| Jeder Textbehälter hält jede Textmenge aus | Layout | `height` statt `min-height` an Elementen mit Text. | Lint | neu: no-fixed-height-on-text |
| Jeder Textbehälter hält jede Textmenge aus | Layout | `font-size` in `px`. | Lint | standby/no-raw-values |
| Jeder Textbehälter hält jede Textmenge aus | Layout | `overflow: hidden` mit fester Höhe. | Lint | neu: no-fixed-height-on-text |
| Jeder Textbehälter hält jede Textmenge aus | Layout | Flex-Kind mit Text ohne `min-w-0`. | Lint | neu: flex-child-min-w-0 |
| Jeder Textbehälter hält jede Textmenge aus | Layout | `truncate` ohne Weg zum vollen Text. | DOM | dom: truncated-text-has-full-text |
| Jeder Textbehälter hält jede Textmenge aus | Layout | Lange URL oder E-Mail ohne `break-words` sprengt die Karte. | Lint | neu: long-text-break-words |
| Weniger Kanten, ruhigere Ansicht | Layout | Beschriftung, Wert und Knopf beginnen an drei verschiedenen Stellen. | Visuell | review-checklist |
| Weniger Kanten, ruhigere Ansicht | Layout | Ein einzelnes Element ist zentriert, alles andere daneben linksbündig. | Visuell | review-checklist |
| Weniger Kanten, ruhigere Ansicht | Layout | Eingerückte Blöcke stehen an frei gewählten Stellen statt an einer gemeinsamen zweiten Kante. | Visuell | review-checklist |
| Weniger Kanten, ruhigere Ansicht | Layout | Ein Text ist zentriert und länger als zwei Zeilen. | Visuell | review-checklist |
| Weniger Kanten, ruhigere Ansicht | Layout | Zahlen und Text in einer Tabelle richten sich an derselben Kante aus, statt Zahlen rechts zu setzen (siehe [[Typografie - Zahlenspalten… | Visuell | review-checklist |
| Weniger Kanten, ruhigere Ansicht | Layout | Der Titel einer aufklappbaren Liste ist gegenüber den Einträgen eingerückt. | Visuell | review-checklist |
| Weniger Kanten, ruhigere Ansicht | Layout | Icon im Titel und Icons der Einträge stehen ein paar Pixel versetzt. | Visuell | review-checklist |
| Weniger Kanten, ruhigere Ansicht | Layout | Ein Icon vor einem mehrzeiligen Eintrag steht senkrecht in dessen Mitte. | Visuell | review-checklist |
| Abstand über gap, nicht über Margins am Kind | Stack | `mb-*` oder `mt-*` an Kindern einer Liste. | Lint | neu: no-margin-spacing-on-children |
| Abstand über gap, nicht über Margins am Kind | Stack | `last:mb-0`, `first:mt-0` oder `:not(:last-child)` als Korrektur. | Lint | neu: no-margin-spacing-on-children |
| Abstand über gap, nicht über Margins am Kind | Stack | `space-y-*` an einem Container. | Lint | standby/no-space-utilities |
| Abstand über gap, nicht über Margins am Kind | Stack | Ein Abstand ist doppelt so groß wie gewollt, weil zwei Margins aufeinandertreffen. | Visuell | review-checklist |
| Keine Deckkraft-Modifier auf semantischen Farben | Stack | Ein Schrägstrich hinter einer semantischen Farbklasse. | Lint | standby/no-opacity-on-semantic-colors |
| Keine Deckkraft-Modifier auf semantischen Farben | Stack | Ein Badge aus `bg-danger/10 text-danger`. | Lint | standby/no-opacity-on-semantic-colors |
| Keine Deckkraft-Modifier auf semantischen Farben | Stack | Hover ist als `hover:bg-primary/90` gebaut. | Lint | standby/no-opacity-on-semantic-colors |
| Utility-Klassen statt Inline-Styles | Stack | `style={{ … }}` in einer Komponente. | Lint | standby/no-inline-style |
| Utility-Klassen statt Inline-Styles | Stack | `StyleSheet.create` neben `className` in derselben Datei. | Lint | standby/no-inline-style |
| Utility-Klassen statt Inline-Styles | Stack | Farbwerte, Abstände oder Schriftgrößen direkt im Markup. | Lint | standby/no-raw-values |
| Was der Browser mitbringt, wird gestaltet oder ersetzt | Stack | Ein Datums-, Monats- oder Zahlenfeld steht ohne eigenes Element darum in der Ansicht. | Lint | neu: wrap-native-inputs |
| Was der Browser mitbringt, wird gestaltet oder ersetzt | Stack | Im globalen CSS fehlt eine Regel für markierten Text. | Lint | neu: require-global-css-rules |
| Was der Browser mitbringt, wird gestaltet oder ersetzt | Stack | Der Scrollbalken ist im Dunkelmodus hellgrau und breit. | Lint | neu: require-global-css-rules |
| Was der Browser mitbringt, wird gestaltet oder ersetzt | Stack | Das Datumsformat wechselt, wenn Du die Sprache des Browsers umstellst. | Lint | neu: wrap-native-inputs |
| Was der Browser mitbringt, wird gestaltet oder ersetzt | Stack | Ein Betrag wird von Hand zusammengesetzt, etwa `"€ " + n.toFixed(2)`, oder ein Datum steht als `toISOString()` in der Anzeige. | Lint | neu: use-intl-formatting |
| Was der Browser mitbringt, wird gestaltet oder ersetzt | Stack | Dunkles Thema ohne `color-scheme: dark`. | Lint | neu: require-color-scheme |
| Was der Browser mitbringt, wird gestaltet oder ersetzt | Stack | Natives `select` ohne eigene Hintergrund- und Textfarbe. | DOM | dom: select-has-explicit-colors |
| Betone mit einem Mittel, nicht mit zweien | Typografie | Der große Kennzahlwert in einer Kachel läuft fett. | DOM | count-text-styles |
| Betone mit einem Mittel, nicht mit zweien | Typografie | Alle Texte in einer Kachel haben dasselbe Gewicht, und die Hierarchie entsteht nur über die Größe. | DOM | count-text-styles |
| Betone mit einem Mittel, nicht mit zweien | Typografie | Ein Seitentitel wird im Code mit einem festen Gewicht überschrieben, obwohl die Skala eines vorgibt. | Lint | neu: no-font-weight-override-on-title |
| Fließtext hat eine Höchstbreite | Typografie | Absatz ohne `max-width`. | Lint | neu: prose-max-width |
| Fließtext hat eine Höchstbreite | Typografie | Breite in `px` statt `ch`. | Lint | neu: prose-max-width |
| Fließtext hat eine Höchstbreite | Typografie | Bei 1920 Pixeln läuft ein Hilfetext über die ganze Breite. | DOM | dom: prose-line-length |
| Icons sind auf die Schrift abgestimmt | Typografie | **Punkte-Test:** ein Icon mit lockerer und eines mit geschlossener Kante vor demselben Wort. Wirken die Abstände verschieden, gleicht… | Visuell | review-checklist |
| Icons sind auf die Schrift abgestimmt | Typografie | **Rundungs-Test:** ein rundes neben einem eckigen Icon. Wirkt das runde kleiner, wurde nur skaliert. Ein Kreis muss über das Quadrat… | Visuell | review-checklist |
| Icons sind auf die Schrift abgestimmt | Typografie | Der Abstand zum Text ist ein fester Pixelwert, gleich für alle Icons. | Lint | standby/no-raw-values |
| Icons sind auf die Schrift abgestimmt | Typografie | Icon-Größen stehen als feste Pixelwerte in der Ansicht. | Lint | standby/no-raw-values |
| Icons sind auf die Schrift abgestimmt | Typografie | Ein Icon neben fettem Text hat dieselbe Strichstärke wie eines neben normalem. | Visuell | review-checklist |
| Icons sind auf die Schrift abgestimmt | Typografie | Mehr als ein Icon-Paket im Projekt, oder ein einzelnes SVG, weil das passende im Set fehlte. Verschiedene Familien haben verschiedene… | Lint | neu: single-icon-package |
| Zahlenspalten stehen rechtsbündig | Typografie | Eine Betrags- oder Mengenspalte steht linksbündig oder zentriert. | DOM | dom: numeric-column-alignment |
| Zahlenspalten stehen rechtsbündig | Typografie | Die Spaltenbreite ändert sich beim Aktualisieren der Daten. | Visuell | review-checklist |
| Zahlenspalten stehen rechtsbündig | Typografie | Eine Zahlenspalte ist mit Leerzeichen auf gleiche Breite gebracht. | Visuell | review-checklist |
| Zahlenspalten stehen rechtsbündig | Typografie | Die Ziffern springen beim Wechsel der Werte hin und her, weil die Tabellenziffern nicht eingeschaltet sind. | DOM | dom: tabular-nums |
| Zahlenspalten stehen rechtsbündig | Typografie | Eine technische Anwendung zeigt lange Nummern in der Textschrift, und Null und O sind nicht zu unterscheiden. | Visuell | review-checklist |
| Zahlenspalten stehen rechtsbündig | Typografie | Ein einzelnes Betragsfeld steht rechtsbündig zwischen linksbündigen Textfeldern. | Visuell | review-checklist |
| Jeder Textstil hat eine Rolle | Typografie | Im gerenderten Screen gibt es mehr verschiedene Kombinationen aus Größe, Schnitt, Farbe und Schreibweise als benannte Rollen. | DOM | count-text-styles |
| Jeder Textstil hat eine Rolle | Typografie | Zwei Texte unterscheiden sich nur um eine Stufe der Skala und sonst in nichts. | DOM | count-text-styles |
| Jeder Textstil hat eine Rolle | Typografie | Eine Display-Schrift erscheint an mehr als einer Rolle, etwa am Seitentitel und an Beschriftungen. | DOM | count-text-styles |
| Jeder Textstil hat eine Rolle | Typografie | Ein Textstil kommt nur an einer einzigen Stelle vor. | DOM | count-text-styles |
| Jeder Textstil hat eine Rolle | Typografie | Eine Ansicht setzt Größe, Gewicht und Farbe einzeln, statt eine Rolle zu nehmen. | Lint | neu: require-text-role |
| Eine Bedeutung, überall gleich | Zustand | „Speichern", „Sichern" und „Übernehmen" für dieselbe Handlung. | Visuell | review-checklist |
| Eine Bedeutung, überall gleich | Zustand | Mülleimer und X für Löschen. | Visuell | review-checklist |
| Eine Bedeutung, überall gleich | Zustand | X für Schließen und für Löschen. | Visuell | review-checklist |
| Eine Bedeutung, überall gleich | Zustand | Die Lupe öffnet einen Zoom, das Zahnrad öffnet Filter, oder ein Klick aufs Logo tut nichts. | Visuell | review-checklist |
| Eine Bedeutung, überall gleich | Zustand | Hilfe oder Kontakt stehen mal im Kopf, mal in der Fußzeile, mal im Profil. | Visuell | review-checklist |
| Eine Bedeutung, überall gleich | Zustand | Zwei Ansichten zeigen denselben Wert in verschiedenen Farben. | Visuell | review-checklist |
| Eine Bedeutung, überall gleich | Zustand | Der Vergleich mit einer Grenze steht in mehr als einer Datei. | Visuell | review-checklist |
| Eine Bedeutung, überall gleich | Zustand | Eine neue Anzeige bekommt ihre Grenzen mitgegeben, statt sie zu erfragen. | Visuell | review-checklist |
| Eine Bedeutung, überall gleich | Zustand | Ein fehlender Wert wird zu null gemacht und dann eingefärbt. | Visuell | review-checklist |
| Eine Bedeutung, überall gleich | Zustand | Ein Feld ohne Daten ist grün, weil „kein Problem gemeldet" als gut gewertet wird. | Visuell | review-checklist |
| Eine Bedeutung, überall gleich | Zustand | Eine Kennzahl zeigt einen Strich und trotzdem einen farbigen Rand oder ein farbiges Badge. | Visuell | review-checklist |
| Rot ist nicht ein Rot | Zustand | Ein Badge wird aus der Grundfarbe mit Deckkraft und derselben Grundfarbe als Text gebaut. | Lint | standby/no-opacity-on-semantic-colors |
| Rot ist nicht ein Rot | Zustand | Ein voll eingefärbter Knopf hat weißen Text statt der zugehörigen Gegenfarbe. | Lint | neu: no-text-white-on-fill |
| Rot ist nicht ein Rot | Zustand | Dieselbe Zustandsfarbe steht einmal als Fläche und einmal als Fließtext, und beim Text muss man die Augen zusammenkneifen. | DOM | axe |
| Rot ist nicht ein Rot | Zustand | Ein Zustand ist in einer Erscheinung gut lesbar und in der anderen nicht. | DOM | axe |
