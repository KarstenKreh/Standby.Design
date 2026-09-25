---
dateCreated: 2026-08-27
description: Alles, was man anklicken kann, ist ein Button mit einer echten Trefferfläche. Dezent wird über Farbe gelöst, nicht über eine kleinere Fläche.
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

# Klickbares braucht eine Fläche

> [!TIP] Regel
> Alles, was man anklicken kann, ist ein Button — mindestens in der stillsten Variante (`ghost`), für Navigation als Button um einen Link herum. Nackte Textlinks sind nicht erlaubt, auch nicht in Fußzeilen und auch nicht als „unauffälliger" Umschalter.

## Warum

Ein nackter Textlink ist auf dem Handy kaum zu treffen. Die Zeilenhöhe von Text ist keine Trefferfläche, und der Daumen ist kein Mauszeiger. Die Höhe eines Buttons in Standardgröße ist genau dafür da: sie ist die Fläche, die ein Finger sicher trifft.

Der zweite Grund ist Erkennbarkeit. Eine Fläche sagt „hier kannst Du drücken", bevor der Nutzer den Text gelesen hat. Ein Textlink sagt es erst danach, und in einer Fußzeile voller Text gar nicht.

Der Wunsch hinter dem Textlink ist meistens „das soll unauffällig sein". Das ist ein berechtigter Wunsch, aber die Antwort darauf ist Schriftfarbe und Schriftgröße, nicht eine kleinere Fläche. Dezent heißt leise, nicht schwer zu treffen.

## Woran Du den Verstoß erkennst

- Ein `<a>` oder ein `Text` mit `onPress`, ohne umgebende Fläche.
- Ein Umschalter („Zur Monatsansicht", „Alle anzeigen") ist als reiner Text gebaut.
- Die Fußzeile besteht aus einer Reihe nackter Links.
- Die Trefferfläche wird kleiner gesetzt, um das Element unauffälliger zu machen.

## Richtig / falsch

```
        RICHTIG                             FALSCH

  ┌──────────────────┐              Alle anzeigen
  │  Alle anzeigen   │  40px hoch   ‾‾‾‾‾‾‾‾‾‾‾‾
  └──────────────────┘              ~18px, kaum zu treffen

  ghost-Variante: keine sichtbare    „unauffällig" über
  Fläche im Ruhezustand, aber        kleinere Fläche gelöst
  volle Trefferfläche
```

## Hart und weich

| | Status |
|---|---|
| Klickbares hat eine echte Trefferfläche, kein nackter Textlink | hart |
| Dezent wird über Farbe gelöst, nicht über eine kleinere Fläche | hart |
| Die Standardhöhe liegt in der Größe einer Finger-Trefferfläche | hart |
| Die konkreten Höhen | weich, Vorgabe 40 Pixel Standard, 32 Pixel nur am Zeigegerät |

## Grenzen

Die einzige Ausnahme ist ein Wort oder eine Wortgruppe **mitten im Fließtext**, etwa ein Verweis innerhalb eines Absatzes in den Rechtstexten. Dort wäre eine Fläche der Fremdkörper. Sobald der Link auf einer eigenen Zeile steht, gilt die Regel wieder.

## Verwandt

- [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]]
- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
- [[Bedienung - Fokus ist immer sichtbar]]
