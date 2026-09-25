---
dateCreated: 2026-08-27
description: Was zusammengehört, steht dicht beieinander. Eine Trennlinie kommt erst dazu, wenn der Abstand allein nicht mehr trägt.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - layout
---

# Nähe gruppiert, nicht die Linie

> [!TIP] Regel
> Gruppiere über Abstand. Elemente, die zusammengehören, stehen dichter beieinander als zu allem anderen. Setze eine Trennlinie erst dann, wenn die Abschnitte inhaltlich wirklich getrennt sind — etwa bei einer Liste gleichrangiger Positionen.

## Warum

Abstand ist die stärkste Gruppierung, die es gibt, und sie kostet nichts. Der Blick fasst zusammen, was dicht steht, noch bevor er liest. Eine Linie behauptet dasselbe noch einmal, fügt aber ein sichtbares Element hinzu. Bei Titel, Chart und Button trennt der Abstand schon deutlich genug, und jede zusätzliche Linie ist nur Rauschen.

Der praktische Test: Nimm die Linien testweise heraus. Ist die Gruppierung danach immer noch klar, waren sie überflüssig. Fällt der Aufbau auseinander, waren die Abstände zu gleichförmig — dann ist die Abstandsstaffelung das eigentliche Problem, nicht die fehlende Linie.

## Woran Du den Verstoß erkennst

- Zwischen jedem Abschnitt einer Karte sitzt eine Linie, unabhängig vom Inhalt.
- Alle Abstände in einer Ansicht sind gleich groß, und die Struktur entsteht nur aus Linien und Rahmen.
- Ein Formular trennt jedes einzelne Feld mit einer Linie, statt zusammengehörige Felder als Block zu setzen.

## Richtig / falsch

```
        RICHTIG                             FALSCH
  Abstand macht die Gruppe           Linie macht die Gruppe

  Rechnungsadresse                   Rechnungsadresse
  Straße        [__________]         Straße        [__________]
  PLZ, Ort      [__________]         ─────────────────────────
                                     PLZ, Ort      [__________]
  Lieferadresse                      ─────────────────────────
  Straße        [__________]         Lieferadresse
  PLZ, Ort      [__________]         ─────────────────────────
                                     Straße        [__________]
  Zwei Blöcke, sofort lesbar.        Sieben gleich starke Zeilen.
```

## Grenzen

Bei einer langen Liste gleichrangiger Zeilen — Buchungen, Positionen, Kontakte — hilft die Linie wirklich, weil der Abstand zwischen zwei Zeilen dort aus Platzgründen klein bleiben muss. Das ist der Fall, für den die Trennlinie gedacht ist.

## Verwandt

- [[Layout - Der Divider ist die Unterkante einer Section]]
- [[Fläche - Eine Linie trennt, sie schmückt nicht]]
- [[Layout - Die Karte hat kein Padding]]
