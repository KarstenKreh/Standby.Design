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
> Kurzzeitige Zustände — Hover, Gedrückt — verschieben sich **innerhalb** derselben Palette: Hover eine Stufe **heller**, Gedrückt eine Stufe **dunkler**, in heller und dunkler Erscheinung gleich. Dauerhafte Zustände — an, aktuell, ungültig — **wechseln** die Palette.

## Warum

Der Nutzer muss zwei Fragen gleichzeitig beantworten können: „berühre ich das gerade?" und „ist das an?". Werden beide mit demselben Mittel beantwortet, sind sie nicht mehr zu trennen. Ein Element unter dem Mauszeiger sieht dann aus wie ein eingeschaltetes, und ein eingeschaltetes wie eines, das gerade berührt wird.

Verschieben und Wechseln sind zwei verschiedene Bewegungen im Farbraum. Solange kurze Zustände nur verschieben und dauerhafte wechseln, bleiben die beiden Fragen getrennt, ohne dass der Nutzer es lernen muss.

## Warum Hover heller wird

Hover sagt: „Ich reagiere auf Dich, drück mich." Das Element kommt dem Zeiger ein Stück entgegen, und was näher am Licht ist, wird heller. Gedrückt ist das Gegenteil: das Element sinkt ein und wird dunkler.

Im Dark Mode kehrt sich das nicht um. Das Licht kommt in beiden Erscheinungen von vorn, deshalb sind auch dort höhere Ebenen heller als tiefere. Wer die Richtung mit dem Modus umdreht, lässt denselben Knopf im Hellen einsinken und im Dunkeln herauskommen.

Weil Hover und Gedrückt in entgegengesetzte Richtungen gehen, liegen sie zwei Schritte auseinander. Der Nutzer verwechselt sie nie, und keiner von beiden landet wieder auf der Farbe des Ruhezustands.

## Die Schritte sind gleichmäßig

Die Abstände zwischen Ruhe, Hover und Gedrückt kommen aus derselben Skala und sind gleich groß. Werden sie pro Baustein von Hand gewählt, ist der Sprung an einer Stelle kaum zu sehen und an der nächsten zu stark. Auffallen tut das erst, wenn zwei Bausteine nebeneinander liegen, und dann ist es überall.

Wie groß ein Schritt ist, hängt von der Palette des Projekts ab. Gleich groß muss er sein, nicht bestimmt groß.

## Kein Schleier als Rückmeldung

Ein durchscheinender Schleier ist auf dunklem Grund ein großer Schritt und auf hellem fast keiner. Dieselbe Rückmeldung wirkt in zwei Erscheinungen unterschiedlich stark, und in einer davon fehlt sie praktisch ganz. Zustände kommen deshalb aus benannten Farbwerten, nicht aus Deckkraft.

## Woran Du den Verstoß erkennst

- Hover ist dunkler als der Ruhezustand, oder Gedrückt ist heller.
- Die Richtung dreht sich mit dem Modus um: im Hellen wird Hover dunkler, im Dunkeln heller.
- Hover benutzt dieselbe Farbe wie der Zustand „ausgewählt".
- Ein Zustandswechsel wird mit einem durchscheinenden Schleier gebaut.
- Die Schritte sind unterschiedlich groß, weil sie pro Baustein von Hand gewählt wurden.

## Richtig / falsch

```
        RICHTIG                             FALSCH

Hover     ░░   ein Schritt heller  Hover     ▓▓  ← dunkler als Ruhe
Ruhe      ▒▒                       Ruhe      ▒▒
Gedrückt  ▓▓   ein Schritt dunkler Gedrückt  ░░  ← heller als Ruhe

An        ██   andere Palette      An        ░░  ← gleich wie Hover
```

## Grenzen

Am Ende der Skala ist kein Platz mehr. Ein fast weißes Element kann nicht heller werden: dort geht Hover eine Stufe dunkler und Gedrückt zwei. Ein fast schwarzes kann nicht dunkler werden: dort geht Gedrückt zwei Stufen heller. Das ist die einzige Umkehr.

Ein Rahmen ist keine Fläche, die sich hebt. Beim Eingabefeld wird der Rand beim Hover kräftiger, damit er sich deutlicher von der Umgebung abhebt. Die Regel oben gilt für Flächen.

Ein Eingabefeld im Fehlerzustand wechselt die Palette, obwohl der Fehler vorübergehend ist. Das ist gewollt: „ungültig" ist ein dauerhafter Zustand des Feldes, solange die Eingabe nicht stimmt, und keine Rückmeldung auf eine Berührung.

## Verwandt

- [[Bedienung - Ein dauerhafter Zustand braucht ein zweites Zeichen]]
- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
