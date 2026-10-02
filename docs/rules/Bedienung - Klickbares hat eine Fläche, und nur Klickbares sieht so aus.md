---
dateCreated: 2026-08-27
description: "Klickbares hat eine echte Trefferfläche, nie unter 24 Pixel. Was nichts tut, sieht nicht klickbar aus."
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

# Klickbares hat eine Fläche, und nur Klickbares sieht so aus

> [!TIP] Regel
> Alles, was man anklicken kann, ist ein Button, mindestens in der stillsten Variante (`ghost`), für Navigation als Button um einen Link herum. Nackte Textlinks sind nicht erlaubt, auch nicht in Fußzeilen. Umgekehrt bekommt nichts das Aussehen eines Bedienelements, das keine Handlung hat.

## Warum

Ein nackter Textlink ist auf dem Handy kaum zu treffen. Die Zeilenhöhe von Text ist keine Trefferfläche, und der Daumen ist kein Mauszeiger. Die Höhe eines Buttons in Standardgröße ist genau dafür da: sie ist die Fläche, die ein Finger sicher trifft.

Der zweite Grund ist Erkennbarkeit. Eine Fläche sagt „hier kannst Du drücken", bevor der Nutzer den Text gelesen hat. Ein Textlink sagt es erst danach, und in einer Fußzeile voller Text gar nicht.

Der Wunsch hinter dem Textlink ist meistens „das soll unauffällig sein". Das ist ein berechtigter Wunsch, aber die Antwort darauf ist Schriftfarbe und Schriftgröße, nicht eine kleinere Fläche. Dezent heißt leise, nicht schwer zu treffen.

Ein toter Klick lässt den Nutzer zweifeln, ob die Seite kaputt ist. Danach traut er auch den echten Knöpfen weniger.

## Hart und weich

| | Status |
|---|---|
| Klickbares hat eine echte Trefferfläche, kein nackter Textlink | hart |
| Dezent wird über Farbe gelöst, nicht über eine kleinere Fläche | hart |
| Die Standardhöhe liegt in der Größe einer Finger-Trefferfläche | hart |
| Keine Trefferfläche ist kleiner als 24 × 24 Pixel, auch nicht in dichten Leisten | hart |
| Kästchen oder Schalter und ihre Beschriftung sind eine gemeinsame Trefferfläche | hart |
| Die konkreten Höhen | weich, Vorgabe 40 Pixel Standard, 32 Pixel nur am Zeigegerät |

## Woran Du den Verstoß erkennst

- Ein `<a>` oder ein `Text` mit `onPress`, ohne umgebende Fläche.
- Ein Umschalter („Zur Monatsansicht", „Alle anzeigen") ist als reiner Text gebaut.
- Die Fußzeile besteht aus einer Reihe nackter Links.
- Die Trefferfläche wird kleiner gesetzt, um das Element unauffälliger zu machen.
- Ein Zurück über dem Inhalt ist ein Pfeil mit Text, ohne Fläche.
- Ein Icon-Button ist kleiner als 24 × 24 Pixel, etwa ein Schließen-X mit 12 Pixel.
- Nur das Kästchen einer Checkbox ist klickbar, nicht ihre Beschriftung.
- `cursor: pointer` oder Hover-Effekt an einer Karte ohne Handlung.
- Pfeil-Icon in einer Zeile, die sich nicht öffnet.
- Unterstrichener Text, der kein Link ist.
- Ein Teil der Karte ist klickbar, der Rest sieht gleich aus und ist es nicht.

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

## Grenzen

Die einzige Ausnahme ist ein Wort oder eine Wortgruppe **mitten im Fließtext**, etwa ein Verweis innerhalb eines Absatzes in den Rechtstexten. Dort wäre eine Fläche der Fremdkörper. Sobald der Link auf einer eigenen Zeile steht, gilt die Regel wieder.

## Quelle

Vercel AGENTS.md › Touch & Drag („If it looks clickable, it must be clickable"). Vercel Guidelines › Interactions („No dead zones").

## Verwandt

- [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]]
- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
- [[Bedienung - Der Fokus ist sichtbar und hat immer einen Ort]]
- [[Bedienung - Eine Handlung löst beim Loslassen aus]]
