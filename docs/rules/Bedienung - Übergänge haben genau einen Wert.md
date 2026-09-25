---
dateCreated: 2026-08-27
description: Zustandswechsel am Ort laufen im ganzen Projekt in derselben Dauer. Der Korridor ist 100 bis 200 Millisekunden, der Vorgabewert 150.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
korridor: 100-200ms
default: 150ms
tags:
  - design-system
  - design-rule
  - bedienung
  - accessibility
---

# Übergänge haben genau einen Wert

> [!TIP] Regel
> Lege für Zustandswechsel am Ort genau eine Dauer fest und halte sie als Token. Sie liegt zwischen 100 und 200 Millisekunden. Solange das Projekt nichts anderes festlegt, gilt 150. Hat der Nutzer weniger Bewegung eingestellt (`prefers-reduced-motion`), findet der Wechsel sofort statt.

## Warum

Der Korridor hat einen Grund, die Zahl darin nicht. Unter etwa 100 Millisekunden nimmt niemand mehr eine Bewegung wahr, der Wechsel liest sich als Sprung und die Rückmeldung geht verloren. Über etwa 200 wartet der Nutzer auf die Oberfläche, und das Warten fällt umso mehr auf, je öfter er den Wechsel auslöst.

Innerhalb des Korridors ist die Zahl eine Frage der Handschrift. Ein ruhiges, schweres Produkt darf am oberen Ende sitzen, ein Werkzeug, das schnell wirken soll, am unteren. Diese Entscheidung nimmt die Regel niemandem ab.

Hart ist etwas anderes: dass es **eine** Dauer gibt. Verschiedene Dauern nebeneinander lassen eine Ansicht flackern, weil mehrere Elemente in einer Reihe zu verschiedenen Zeitpunkten ankommen. Der Blick sieht dann nicht einen Wechsel, sondern drei. Und weil die Dauer als Token steht, lässt sich die Handschrift später an einer Stelle ändern statt an zweihundert.

Die letzte Hälfte ist keine Höflichkeit. Für Menschen mit vestibulärer Störung löst Bewegung auf dem Bildschirm Schwindel und Übelkeit aus. Die Systemeinstellung ist ihre Bitte, und sie wird beachtet.

## Was hart ist und was weich

| | Status |
|---|---|
| Es gibt genau eine Dauer für Zustandswechsel am Ort | hart |
| Sie steht als Token, nicht pro Komponente | hart |
| Sie liegt zwischen 100 und 200 Millisekunden | hart |
| Bei reduzierter Bewegung findet der Wechsel sofort statt | hart |
| Die Zahl im Korridor | weich, Vorgabe 150 |

## Woran Du den Verstoß erkennst

- Die Dauer wird pro Komponente gewählt, es gibt 100, 200 und 300 Millisekunden nebeneinander.
- Eine Dauer liegt außerhalb des Korridors, ohne dass jemand das begründen kann.
- `prefers-reduced-motion` kommt im Projekt nirgends vor.
- Eine Ansicht animiert beim Laden Elemente ein, obwohl die Einstellung Bewegung reduziert.

## Grenzen

Größere Bewegungen sind nicht gemeint und dürfen länger dauern: ein Off-Canvas-Drawer, ein Dialog, ein Seitenwechsel. Der Korridor gilt für Wechsel am Ort — Farbe, Rand, die Position eines Schalterknopfs. Auch die längeren Bewegungen fallen bei reduzierter Bewegung weg.

Legt eine Marken-Richtlinie im Projekt eine eigene Zahl fest, gilt diese. Der Vorgabewert ist dafür da, dass man ohne eine solche Richtlinie trotzdem loslegen kann, und nicht dafür, sie zu überstimmen.

## Verwandt

- [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]]
- [[Bedienung - Fokus ist immer sichtbar]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
