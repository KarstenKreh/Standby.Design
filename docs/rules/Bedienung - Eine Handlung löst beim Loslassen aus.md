---
dateCreated: 2026-10-02
description: "Ein Klick wirkt erst beim Loslassen, nie schon beim Drücken. Wer danebengreift, zieht weg und hat nichts ausgelöst."
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

# Eine Handlung löst beim Loslassen aus

> [!TIP] Regel
> Löse eine Handlung beim Loslassen aus, nicht beim Drücken.

## Warum

Wer daneben drückt, zieht den Finger oder die Maus weg und bricht ab. Beim Drücken gibt es diesen Ausweg nicht.

## Woran Du den Verstoß erkennst

- Handlung in `onMouseDown`, `onPointerDown`, `onTouchStart` oder `onPressIn`.

## Hart und weich

Hart.

## Grenzen

Ziehen, Zeichnen, Spiele und Klaviertasten, bei denen das Drücken selbst die Eingabe ist.

## Quelle

WCAG 2.5.2 Pointer Cancellation, https://www.w3.org/WAI/WCAG22/quickref/#pointer-cancellation

## Verwandt

- [[Bedienung - Klickbares hat eine Fläche, und nur Klickbares sieht so aus]]
- [[Bedienung - Zerstörendes trifft man nicht aus Versehen]]
