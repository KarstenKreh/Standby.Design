---
dateCreated: 2026-10-02
description: "Läuft eine Bewegung von selbst länger als fünf Sekunden, etwa ein Karussell, braucht sie einen Pause-Knopf. Ton startet nie von selbst."
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

# Was sich von selbst bewegt, lässt sich anhalten

> [!TIP] Regel
> Gib jeder Bewegung, die von selbst startet und länger als fünf Sekunden läuft, eine Pause, und starte Ton nie von selbst.

## Warum

Bewegung neben Inhalt zieht den Blick ab und macht manchen Menschen übel. Ton, der von selbst startet, übertönt den Screenreader.

## Woran Du den Verstoß erkennst

- Karussell ohne Pause-Knopf.
- Video mit `autoplay` ohne `muted`.
- Laufband oder animierter Hintergrund ohne Stopp.
- Endlos-Animation, die `prefers-reduced-motion` ignoriert.

## Hart und weich

Hart. Die fünf Sekunden sind der Wert aus WCAG, keine Vorgabe.

## Grenzen

Ladeanzeigen. Bewegung, die der Nutzer selbst gestartet hat.

## Quelle

WCAG 2.2.2 Pause, Stop, Hide und 1.4.2 Audio Control. Vercel AGENTS.md › Animation („autoplay only for muted, non-essential loops").

## Verwandt

- [[Bedienung - Bewegung hat einen Wert und hält nichts auf]]
- [[Bedienung - Bewegung hat einen Wert und hält nichts auf]]
- [[Inhalt - Alles hat eine Textfassung]]
