---
dateCreated: 2026-08-27
description: Hover und Gedrückt bewegen sich innerhalb einer Palette. An, aktuell und ungültig wechseln die Palette. Sonst sind die beiden Fragen nicht mehr zu trennen.
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

# Kurze Zustände verschieben, dauerhafte wechseln die Palette

> [!TIP] Regel
> Kurzzeitige Zustände — Hover, Gedrückt — verschieben sich **innerhalb** derselben Palette und immer in dieselbe Richtung. Dauerhafte Zustände — an, aktuell, ungültig — **wechseln** die Palette.

## Warum

Der Nutzer muss zwei Fragen gleichzeitig beantworten können: „berühre ich das gerade?" und „ist das an?". Werden beide mit demselben Mittel beantwortet, sind sie nicht mehr zu trennen. Ein Element unter dem Mauszeiger sieht dann aus wie ein eingeschaltetes, und ein eingeschaltetes wie eines, das gerade berührt wird.

Verschieben und Wechseln sind zwei verschiedene Bewegungen im Farbraum. Solange kurze Zustände nur verschieben und dauerhafte wechseln, bleiben die beiden Fragen getrennt, ohne dass der Nutzer es lernen muss.

Die zweite Hälfte der Regel verhindert einen häufigen Fehler. Gedrückt wird oft heller gesetzt, weil Hover schon dunkler war und man „noch mehr Unterschied" wollte. Damit dreht sich die Richtung um, und der Nutzer sieht ausgerechnet beim Drücken wieder die Farbe des Ruhezustands. Gedrückt geht immer weiter in dieselbe Richtung wie Hover, nur ein Stück weiter.

## Die Schritte sind gleichmäßig

Die Abstände zwischen Ruhe, Hover und Gedrückt kommen aus derselben Skala und sind gleich groß. Werden sie pro Baustein von Hand gewählt, ist der Sprung an einer Stelle kaum zu sehen und an der nächsten zu stark. Auffallen tut das erst, wenn zwei Bausteine nebeneinander liegen, und dann ist es überall.

Wie groß ein Schritt ist, hängt von der Palette des Projekts ab. Gleich groß muss er sein, nicht bestimmt groß.

## Kein Schleier als Rückmeldung

Ein durchscheinender Schleier ist auf dunklem Grund ein großer Schritt und auf hellem fast keiner. Dieselbe Rückmeldung wirkt in zwei Erscheinungen unterschiedlich stark, und in einer davon fehlt sie praktisch ganz. Zustände kommen deshalb aus benannten Farbwerten, nicht aus Deckkraft.

## Woran Du den Verstoß erkennst

- Gedrückt liegt farblich zwischen Ruhezustand und Hover.
- Hover benutzt dieselbe Farbe wie der Zustand „ausgewählt".
- Ein Zustandswechsel wird mit einem durchscheinenden Schleier gebaut.
- Die Schritte sind unterschiedlich groß, weil sie pro Baustein von Hand gewählt wurden.

## Richtig / falsch

```
        RICHTIG                             FALSCH

Ruhe      ██                       Ruhe      ██
Hover     ██   ein Schritt         Hover     ██
Gedrückt  ██   noch einer,         Gedrückt  ██  ← zurück Richtung Ruhe
               gleiche Richtung
An        ▓▓   andere Palette      An        ██  ← gleich wie Hover
```

## Grenzen

Ein Eingabefeld im Fehlerzustand wechselt die Palette, obwohl der Fehler vorübergehend ist. Das ist gewollt: „ungültig" ist ein dauerhafter Zustand des Feldes, solange die Eingabe nicht stimmt, und keine Rückmeldung auf eine Berührung.

## Verwandt

- [[Bedienung - Ein dauerhafter Zustand braucht ein zweites Zeichen]]
- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
