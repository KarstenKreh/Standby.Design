---
dateCreated: 2026-10-02
description: "Alles per Tab erreichbar und auslösbar, in der Reihenfolge des Bildes. Globale Kürzel nie auf einer einzelnen Taste."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - bedienung
  - layout
---

# Alles geht mit der Tastatur, in der Reihenfolge des Bildes

> [!TIP] Regel
> Mach jedes Bedienelement mit Tab erreichbar und mit Enter oder Leertaste auslösbar, in der Reihenfolge, in der man es sieht. CSS stellt diese Reihenfolge nicht um. Zusammengesetzte Elemente folgen der APG: Tab hinein, Pfeiltasten innen, Esc schließt. Globale Tastenkürzel brauchen Strg, Alt oder Cmd.

## Warum

Wer keine Maus nutzt, kommt sonst an diese Stelle nie heran.

Wer per Sprache diktiert oder sich vertippt, löst sonst Handlungen aus, die er nie wollte.

Das Auge folgt dem Bild, die Tab-Taste und der Screenreader folgen dem Code. Solange beides gleich ist, merkt niemand etwas. Weichen sie ab, springt der Fokus quer über den Schirm.

Ein typischer Fall: Am Desktop steht „Abbrechen“ links und „Speichern“ rechts, am Handy soll „Speichern“ oben stehen. Steht „Speichern“ dafür im Code zuerst und dreht CSS die Reihenfolge am Desktop um, landet der erste Tab rechts und der zweite links. Optisch fällt das nie auf, beim Bedienen sofort.

## Hart und weich

Hart: alles per Tastatur, Tastenbelegung nach APG. Weich: zusätzliche Kürzel.

## Woran Du den Verstoß erkennst

- Klick-Handler ohne Tastenweg.
- `tabindex="-1"` an etwas Bedienbarem.
- Menü oder Popover, das Esc ignoriert.
- Eine Stelle, aus der Tab nicht mehr herausführt.
- `keydown` am `document` für eine einzelne Taste ohne Strg, Alt oder Cmd.
- Das Kürzel feuert auch, während ein Feld den Fokus hat.
- Kürzel auf `/` oder `?`, die auf einer anderen Tastaturbelegung nicht erreichbar sind.
- `tabindex` größer als 0.
- CSS `order`, `flex-direction: row-reverse` oder `column-reverse` an Elementen mit Text oder Bedienung.
- Umgestellte `grid-area` oder absolute Positionierung, die die sichtbare Reihenfolge ändert.
- Beim Durchtabben springt der Fokus rückwärts oder quer.

## Grenzen

Bewegungen, deren Weg selbst die Eingabe ist, etwa Freihandzeichnen.

Kürzel, die nur gelten, solange das Element den Fokus hat, etwa Pfeiltasten in einer Liste.

Rein dekorative Elemente ohne Text und ohne Bedienung. Braucht ein kleiner Schirm eine andere Reihenfolge, wird sie dort im Code anders gebaut, nicht per CSS umgedreht.

## Quelle

WCAG 2.1.1 Keyboard, 2.1.2 No Keyboard Trap. APG › Developing a Keyboard Interface. Vercel › Keyboard. WCAG 2.1.4 Character Key Shortcuts. Vercel › Interactions („Locale-aware keyboard shortcuts"). WCAG 1.3.2 Meaningful Sequence, 2.4.3 Focus Order.

## Verwandt

- [[Bedienung - Der Fokus ist sichtbar und hat immer einen Ort]]
- [[Layout - Die Titel bilden eine Gliederung]]
