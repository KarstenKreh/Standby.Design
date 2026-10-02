---
dateCreated: 2026-10-02
description: "Ziehen, Wischen, Langdrücken und Bewegen des Geräts haben einen zweiten Weg per Klick und Tastatur, der zum selben Ergebnis führt."
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
  - accessibility
---

# Jede Geste hat einen zweiten Weg per Klick

> [!TIP] Regel
> Gib jeder Geste einen zweiten Weg per Klick und Tastatur, der zum selben Ergebnis führt. Das gilt für Ziehen, Wischen, Zwei-Finger-Gesten, Langdrücken und für Bewegungen des Geräts wie Schütteln und Kippen.

## Warum

Nicht jeder kann ziehen oder präzise wischen. Und keine Geste ist sichtbar.

Nachgebaut wird nicht die Geste, sondern das Ergebnis. Eine Liste, die man per Ziehen sortiert, bekommt „Nach oben“ und „Nach unten“ im Menü der Zeile. Was man per Wischen löscht, lässt sich auch im Menü löschen. Ein Regler reagiert auf Pfeiltasten. Eine Funktion, die auf Schütteln reagiert, lässt sich abschalten.

## Woran Du den Verstoß erkennst

- Sortieren nur per Drag.
- Löschen nur per Wischen.
- Zoom nur per Pinch.
- Regler ohne Pfeiltasten.
- Rückgängig nur per Schütteln, oder Kippen löst etwas aus, ohne dass es sich abschalten lässt.

## Hart und weich

Hart.

## Grenzen

Wo die Bewegung selbst die Eingabe ist, etwa Unterschrift oder Zeichnen.

## Quelle

WCAG 2.5.1 Pointer Gestures, 2.5.7 Dragging Movements. Vercel › Touch & Drag. WCAG 2.5.4 Motion Actuation.

## Verwandt

- [[Bedienung - Alles geht mit der Tastatur, in der Reihenfolge des Bildes]]
- [[Bedienung - Klickbares hat eine Fläche, und nur Klickbares sieht so aus]]
