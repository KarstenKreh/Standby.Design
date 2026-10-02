---
dateCreated: 2026-10-02
description: "Eine Auswahl oder Eingabe allein öffnet keine neue Seite und sendet nichts ab. Filter, die nur die Ansicht ändern, dürfen sofort wirken."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - fluss
---

# Eine Eingabe wechselt nie von selbst den Ort

> [!TIP] Regel
> Eine Auswahl, Eingabe oder ein Fokus allein öffnet keine neue Seite, sendet nichts ab und springt in kein anderes Feld.

## Warum

Wer mit Pfeiltasten durch eine Auswahl blättert, landet sonst bei jedem Schritt woanders.

## Woran Du den Verstoß erkennst

- `select` mit `onChange={navigate}`.
- Absenden beim letzten Zeichen.
- Fokus springt ungefragt ins nächste Feld.

## Hart und weich

Hart.

## Grenzen

Filter und Sortierung, die nur die aktuelle Ansicht ändern. Code-Felder, deren Weiterspringen angekündigt ist.

## Quelle

WCAG 3.2.1 On Focus, 3.2.2 On Input.

## Verwandt

- [[Fluss - Der Zustand der Ansicht steht in der Adresse]]
- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
