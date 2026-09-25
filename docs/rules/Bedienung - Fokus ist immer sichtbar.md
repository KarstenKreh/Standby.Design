---
dateCreated: 2026-08-27
description: Der Fokus wird nie ersatzlos entfernt, ist überall gleich gebaut und verschiebt das Layout nicht.
type: design-rule
scope: universal
applies-to:
  - web
status: active
tags:
  - design-system
  - design-rule
  - bedienung
  - accessibility
---

# Fokus ist immer sichtbar

> [!TIP] Regel
> Jedes bedienbare Element zeigt sichtbar, wenn es den Fokus hat. Entferne den Fokus nie ersatzlos. Er ist im ganzen Projekt gleich gebaut und verschiebt beim Erscheinen kein Layout.

## Warum

Wer mit der Tastatur bedient, sieht ohne Fokus gar nicht, wo er ist. Das betrifft nicht nur Screenreader-Nutzer, sondern jeden, der ein Formular schnell durchtabbt. Der Fokus ist die einzige Rückmeldung, die diese Nutzer bekommen.

Die Voreinstellung des Browsers wird oft entfernt, weil sie nicht zum Rest passt, und dann bleibt nichts übrig. Der Wunsch dahinter ist berechtigt — die Antwort darauf ist ein eigener Fokus, kein fehlender.

Dass er das Layout nicht verschieben darf, hat einen praktischen Grund: sitzt er außerhalb des Elements, springt er in engen Reihen über die Nachbarn.

## Woran Du den Verstoß erkennst

- Irgendwo steht `outline: none` ohne Ersatz.
- Beim Durchtabben einer Ansicht verliert man die Position.
- Der Fokus verschiebt beim Erscheinen das Layout oder überlagert Nachbarn.
- Der Fokus wird pro Komponente anders gebaut.

## Grenzen

Die Regel gilt für Tastaturfokus. Ein Fokus nach einem Mausklick darf unterdrückt werden (`:focus-visible`), weil der Mausnutzer schon weiß, wo er geklickt hat.

Wie der Fokus aussieht, ist eine Entscheidung des Projekts und steht dort. Ein weicher Ring auf der Kante ist eine gute Antwort, ein kräftiger Umriss mit Abstand auch — solange er die Nachbarn nicht überlagert.

## Verwandt

- [[Bedienung - Klickbares braucht eine Fläche]]
- [[Bedienung - Ein dauerhafter Zustand braucht ein zweites Zeichen]]
- [[Bedienung - Übergänge haben genau einen Wert]]
