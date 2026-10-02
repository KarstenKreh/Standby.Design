---
dateCreated: 2026-10-02
description: "Eine Zeile Fließtext ist höchstens so breit wie ein Token in Zeichen. Korridor 45 bis 80 Zeichen, Vorgabe 65."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
korridor: 45-80 Zeichen
default: 65ch
tags:
  - design-system
  - design-rule
  - typografie
---

# Fließtext hat eine Höchstbreite

> [!TIP] Regel
> Begrenze die Breite von Fließtext mit genau einem Token in Zeichen.

## Warum

Bei sehr langen Zeilen findet das Auge den Anfang der nächsten Zeile nicht. Auf breiten Bildschirmen läuft Text sonst über 200 Zeichen.

## Woran Du den Verstoß erkennst

- Absatz ohne `max-width`.
- Breite in `px` statt `ch`.
- Bei 1920 Pixeln läuft ein Hilfetext über die ganze Breite.

## Hart und weich

Hart: es gibt eine Höchstbreite, als Token, höchstens 80 Zeichen. Weich: der Wert im Korridor 45 bis 80ch. Vorgabe 65ch.

## Grenzen

Tabellen, Code, einzeilige Beschriftungen.

## Quelle

WCAG 1.4.8 Visual Presentation (AAA, „width is no more than 80 characters"). Vercel › Layout („Responsive coverage … ultra-wide").

## Verwandt

- [[Layout - Jeder Textbehälter hält jede Textmenge aus]]
- [[Layout - Weniger Kanten, ruhigere Ansicht]]
