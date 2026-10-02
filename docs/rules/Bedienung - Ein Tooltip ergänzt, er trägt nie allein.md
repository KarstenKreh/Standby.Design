---
dateCreated: 2026-10-02
description: "Was man zum Bedienen wissen muss, steht sichtbar da. Ein Tooltip kommt auch per Fokus, bleibt beim Darüberfahren stehen und schließt mit Esc."
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
---

# Ein Tooltip ergänzt, er trägt nie allein

> [!TIP] Regel
> Zeig alles, was man zum Bedienen wissen muss, sichtbar. Ein Tooltip erscheint bei Hover und bei Fokus, bleibt beim Darüberfahren stehen und schließt mit Esc.

## Warum

Auf Touch gibt es kein Hover. Was nur dort steht, sieht ein Teil der Nutzer nie.

## Woran Du den Verstoß erkennst

- Pflichthinweis nur im `title`.
- Tooltip nur mit `onMouseEnter`.
- Link oder Button im Tooltip.
- Tooltip verschwindet, sobald die Maus hineinfährt.

## Hart und weich

Hart: Fokus, Stehenbleiben, Esc. Weich: Verzögerung. Vorgabe: der erste kommt verzögert, die Nachbarn danach sofort.

## Grenzen

Der Tooltip an einem Icon-Button wiederholt dessen Namen. Der Name steht trotzdem im `aria-label`.

## Quelle

WCAG 1.4.13 Content on Hover or Focus. Vercel › Touch & Drag („Delay first tooltip; subsequent peers instant") und Content & Accessibility („Inline help first; tooltips last resort").

## Verwandt

- [[Bedienung - Der Fokus ist sichtbar und hat immer einen Ort]]
- [[Bedienung - Klickbares hat eine Fläche, und nur Klickbares sieht so aus]]
