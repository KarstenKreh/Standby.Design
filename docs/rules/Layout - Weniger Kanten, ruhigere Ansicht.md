---
dateCreated: 2026-08-27
description: Jede senkrechte Linie, an der etwas ausgerichtet ist, kostet den Blick einen Ankerpunkt. Je weniger davon, desto ruhiger die Ansicht.
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

# Weniger Kanten, ruhigere Ansicht

> [!TIP] Regel
> Richte alles an möglichst wenigen gemeinsamen Kanten aus. Jede zusätzliche Linie, an der etwas beginnt, kostet den Blick einen Ankerpunkt. Und misch innerhalb eines Blocks nicht linksbündig mit zentriert.

## Warum

Der Blick sucht beim Lesen einer Ansicht nach Anhaltspunkten und findet sie an den Kanten: dort, wo mehrere Dinge gemeinsam beginnen. Zwei solche Linien liest man ohne Anstrengung. Bei sechs muss der Blick bei jedem Element neu ansetzen, und die Ansicht wirkt unruhig, ohne dass man sagen könnte woran es liegt. Man sieht die Kanten nicht, aber man spürt sie.

Deshalb ist das eines der wirksamsten Mittel überhaupt: es kostet nichts. Es ändert keine Farbe, keine Größe, keinen Inhalt. Es räumt nur die Anfänge zusammen.

Ausrichtung und Nähe sind dabei ein Paar. Nähe sagt, **was zusammengehört**, Ausrichtung sagt, **dass es zusammengehört**. Siehe [[Layout - Nähe gruppiert, nicht die Linie]].

## Der Kanten-Test

Screenshot der Ansicht nehmen, durch jede linke Kante eine senkrechte Linie ziehen, zählen. Meistens sind es fünf oder sechs. Meistens kommt man auf zwei, ohne dass sonst etwas anders wird.

```
        VORHER                              NACHHER

  │  Rechnungen                      │  Rechnungen
  │     │                            │
  │     │  Zeitraum  [____]          │  Zeitraum  [____]
  │     │            │               │
  │  Summe        1.240,00           │  Summe        1.240,00
  │       │                          │
  │       │      [ Export ]          │  [ Export ]
  │       │        │                 │
  ^     ^ ^      ^ ^                 ^
  fünf Kanten                        eine
```

## Zentriert ist erlaubt, gemischt nicht

Ein zentrierter Block ist in Ordnung — ein Anmeldefenster, ein leerer Zustand, eine Fehlerseite. Dann ist aber **alles** darin zentriert, auch die Beschriftungen und der Knopf.

Der schlechte Fall ist die Mischung: drei Blöcke linksbündig und einer zentriert. Der zentrierte hat dann zwei eigene Kanten, links und rechts, die zu keiner anderen passen, und er zieht die Aufmerksamkeit auf sich, ohne dass das gemeint war.

Zentrierter Fließtext über mehr als zwei Zeilen fällt ohnehin weg: dort wandert der Zeilenanfang bei jeder Zeile, und der Blick findet ihn nicht mehr.

## Woran Du den Verstoß erkennst

- Beschriftung, Wert und Knopf beginnen an drei verschiedenen Stellen.
- Ein einzelnes Element ist zentriert, alles andere daneben linksbündig.
- Eingerückte Blöcke stehen an frei gewählten Stellen statt an einer gemeinsamen zweiten Kante.
- Ein Text ist zentriert und länger als zwei Zeilen.
- Zahlen und Text in einer Tabelle richten sich an derselben Kante aus, statt Zahlen rechts zu setzen (siehe [[Typografie - Zahlenspalten stehen rechtsbündig]]).

## Grenzen

Zahlenspalten sind die gewollte Ausnahme: sie bekommen ihre eigene rechte Kante, weil dort die Vergleichbarkeit schwerer wiegt als eine Kante weniger.

Und eine zweite Kante für Einrückungen ist normal und richtig — Aufzählungen, verschachtelte Listen, Antworten in einem Verlauf. Die Regel sagt nicht „eine Kante", sie sagt „so wenige wie möglich, und jede mit Grund".

## Verwandt

- [[Layout - Nähe gruppiert, nicht die Linie]]
- [[Typografie - Zahlenspalten stehen rechtsbündig]]
- [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]]
