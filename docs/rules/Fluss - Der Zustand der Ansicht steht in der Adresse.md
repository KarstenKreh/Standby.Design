---
dateCreated: 2026-10-02
description: "Filter, Sortierung, Tab und Seite stehen in der URL. Zurück stellt Ansicht und Scrollposition wieder her."
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

# Der Zustand der Ansicht steht in der Adresse

> [!TIP] Regel
> Leg Filter, Sortierung, Suche, Tab, Seite und geöffnetes Detail in die URL. Zurück stellt Ansicht und Scrollposition wieder her.

## Warum

Nur so lässt sich eine Ansicht teilen, neu laden und mit Zurück wiederfinden.

## Woran Du den Verstoß erkennst

- Filter nur im Komponenten-State.
- Tabs ohne Query-Parameter.
- Neuladen setzt alles zurück.
- Zurück landet oben statt an der alten Stelle.

## Hart und weich

Hart.

## Grenzen

Flüchtiges (Hover, offenes Menü, ungespeicherte Eingaben) und alles Vertrauliche.

## Quelle

Vercel › State & Navigation („URL reflects state", „Back/Forward restores scroll position").

## Verwandt

- [[Fluss - Ein Pop-up unterbricht, es führt nicht]]
- [[Fluss - Eine Eingabe wechselt nie von selbst den Ort]]
