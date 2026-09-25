---
dateCreated: 2026-08-27
description: Die Trennlinie ist keine eigene Komponente, sondern die untere Kante eines Abschnitts. Sie läuft von Kante zu Kante, der letzte Abschnitt hat keine.
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

# Der Divider ist die Unterkante einer Section

> [!TIP] Regel
> Baue Trennlinien nie als eigenes Element. Die Linie ist die untere Kante eines Abschnitts, sie läuft von Kartenkante zu Kartenkante, und der letzte Abschnitt bekommt keine. Sobald Linien im Spiel sind, bekommt jeder Abschnitt oben und unten Padding.

## Warum

Eine Trennlinie als eigenes Element ist ein Kind ohne Inhalt. Sie muss von Hand an die richtige Stelle gesetzt werden, sie wird beim Umsortieren vergessen, und am Ende steht eine Linie unter dem letzten Abschnitt oder es stehen zwei Linien direkt übereinander. Als Kante des Abschnitts kann das nicht passieren: wer den Abschnitt verschiebt, verschiebt die Linie mit, und die Regel „letzter bekommt keine" ist eine einzige Bedingung statt einer Entscheidung pro Einsatzort.

Das zusätzliche Padding oben ist nötig, weil der Inhalt sonst an der Linie klebt. Ohne Linie liefert der untere Abstand des Vorgängers den Abstand schon.

## Woran Du den Verstoß erkennst

- Es gibt eine Komponente `Divider`, `Separator` oder ein `<hr>` zwischen den Abschnitten.
- Unter dem letzten Abschnitt sitzt eine Linie, direkt über der Kartenkante.
- Die Linie ist kürzer als die Karte, weil sie innerhalb des Paddings gezeichnet wird.

## Richtig / falsch

```
╔═══════════════════════════════════════════════════╗ ← Karte
║                                                   ║ ⇕ 14   ┐
║      Financial Health                             ║        │ Abschnitt 1
║                                                   ║ ⇕ 14   ┘ 14 16 14 16
╟───────────────────────────────────────────────────╢ ← Kante, volle Breite
║                                                   ║ ⇕ 14   ┐
║      Runway          14,2 Monate                  ║        │ Abschnitt 2
║                                                   ║ ⇕ 14   ┘ 14 16 14 16
╟───────────────────────────────────────────────────╢ ← Kante
║                                                   ║ ⇕ 14   ┐
║      [ Details ansehen ]                          ║        │ Abschnitt 3
║                                                   ║ ⇕ 14   ┘ letzter → keine Kante
╚═══════════════════════════════════════════════════╝
```

## Grenzen

Die Regel sagt, wie eine Trennlinie gebaut wird, nicht wann es eine braucht. Das steht in [[Layout - Nähe gruppiert, nicht die Linie]].

Ein Primitive, das die Kante zeichnet, ist erlaubt, solange es die Unterkante des Abschnitts ist. Ein eigenes Kind zwischen zwei Abschnitten ist es nicht. Der Name der Hilfsklasse ändert das nicht.

## Verwandt

- [[Layout - Nähe gruppiert, nicht die Linie]]
- [[Layout - Die Karte hat kein Padding]]
- [[Fläche - Eine Linie trennt, sie schmückt nicht]]
