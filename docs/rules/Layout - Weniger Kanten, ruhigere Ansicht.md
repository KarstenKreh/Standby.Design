---
dateCreated: 2026-08-27
description: Jede senkrechte Linie, an der etwas ausgerichtet ist, ist ein weiterer Punkt, an dem der Blick ansetzen muss. Je weniger davon, desto ruhiger die Ansicht.
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
> Richte alles an möglichst wenigen gemeinsamen Kanten aus. Jede zusätzliche Linie, an der etwas beginnt, ist ein weiterer Punkt, an dem der Blick ansetzen muss. Und misch innerhalb eines Blocks nicht linksbündig mit zentriert.

## Warum

Beim Lesen einer Ansicht orientiert sich der Nutzer an den Kanten, also dort, wo mehrere Dinge gemeinsam beginnen. Zwei solche Linien erfasst er ohne Anstrengung. Bei sechs muss sein Blick bei jedem Element neu ansetzen, und die Ansicht wirkt unruhig, ohne dass er sagen könnte, woran es liegt. Er sieht die Kanten nicht bewusst, merkt aber ihre Wirkung.

Weniger Kanten sind eines der wirksamsten Mittel und kosten nichts. Farbe, Größe und Inhalt bleiben gleich. Nur die Anfänge rücken auf gemeinsame Kanten.

Ausrichtung und Nähe sind dabei ein Paar. Nähe sagt, **was zusammengehört**, Ausrichtung sagt, **dass es zusammengehört**. Siehe [[Layout - Erst Abstand, dann Fläche oder Linie]].

## Der Kanten-Test

Screenshot der Ansicht nehmen, durch jede linke Kante eine senkrechte Linie ziehen, zählen. Meistens sind es fünf oder sechs. Meistens lassen sie sich auf zwei verringern, ohne dass sich sonst etwas ändert.

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

Ein zentrierter Block ist in Ordnung, etwa ein Anmeldefenster, ein leerer Zustand oder eine Fehlerseite. Dann ist aber **alles** darin zentriert, auch die Beschriftungen und der Knopf.

Schlecht ist die Mischung, etwa drei Blöcke linksbündig und einer zentriert. Der zentrierte hat dann zwei eigene Kanten, links und rechts, die zu keiner anderen passen, und er fällt auf, obwohl das nicht gewollt ist.

Zentrierter Fließtext über mehr als zwei Zeilen ist ohnehin ausgeschlossen. Dort beginnt jede Zeile an einer anderen Stelle, und der Nutzer findet den Zeilenanfang nicht mehr.

## Icons teilen sich eine Kante

Stehen Icons vor Einträgen, bilden sie eine eigene Kante, und der Text dahinter eine zweite. Das Icon im Titel gehört auf dieselbe Kante wie die Icons der Einträge. Hat der Titel einen Rahmen oder ein Padding, weil er ein Knopf ist, zieh das ab, bis sein Icon auf der Kante der anderen steht.

Bei mehrzeiligen Einträgen steht das Icon auf der ersten Zeile, nicht in der Mitte des Eintrags. Es gehört zum Anfang des Textes.

## Woran Du den Verstoß erkennst

- Beschriftung, Wert und Knopf beginnen an drei verschiedenen Stellen.
- Ein einzelnes Element ist zentriert, alles andere daneben linksbündig.
- Eingerückte Blöcke stehen an frei gewählten Stellen statt an einer gemeinsamen zweiten Kante.
- Ein Text ist zentriert und länger als zwei Zeilen.
- Zahlen und Text in einer Tabelle richten sich an derselben Kante aus, statt Zahlen rechts zu setzen (siehe [[Typografie - Zahlenspalten stehen rechtsbündig]]).
- Der Titel einer aufklappbaren Liste ist gegenüber den Einträgen eingerückt.
- Icon im Titel und Icons der Einträge stehen ein paar Pixel versetzt.
- Ein Icon vor einem mehrzeiligen Eintrag steht senkrecht in dessen Mitte.

## Grenzen

Zahlenspalten sind die gewollte Ausnahme. Sie bekommen ihre eigene rechte Kante, weil dort die Vergleichbarkeit wichtiger ist als eine Kante weniger.

Eine zweite Kante für Einrückungen ist normal und richtig, etwa bei Aufzählungen, verschachtelten Listen oder Antworten in einem Verlauf. Die Regel verlangt nicht genau eine Kante. Sie verlangt „so wenige wie möglich, und jede mit Grund".

## Verwandt

- [[Layout - Erst Abstand, dann Fläche oder Linie]]
- [[Typografie - Zahlenspalten stehen rechtsbündig]]
- [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]]
