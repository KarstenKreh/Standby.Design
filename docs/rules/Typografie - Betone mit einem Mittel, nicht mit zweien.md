---
dateCreated: 2026-08-27
description: Größe und Gewicht sind zwei Wege, dasselbe zu sagen. Was schon groß ist, braucht kein Gewicht dazu.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - typografie
---

# Betone mit einem Mittel, nicht mit zweien

> [!TIP] Regel
> Betone entweder über die Größe oder über das Gewicht, nicht über beides. Ein großer Wert steht deshalb im normalen Schnitt, eine kleine Überschrift darf dafür schwerer laufen.

## Warum

Größe und Gewicht sagen dasselbe: schau hierhin. Setzt Du beides zugleich ein, verstärken sie sich nicht, sie verstopfen sich. Eine große Zahl im fetten Schnitt wirkt nicht wichtiger, nur schwer — die Innenräume der 8, der 0 und der 6 laufen zu, und die Ziffern rücken zusammen. Auf großen Graden ist genau das der sichtbarste Nebeneffekt von Fettung.

Eine kleine Überschrift hat das umgekehrte Problem. Sie kann sich über die Größe kaum vom Fließtext lösen, weil der Unterschied zu klein wäre, um zu wirken. Dort ist das Gewicht das richtige Mittel.

Daraus folgt die Aufteilung von selbst: klein und schwer für Überschriften, groß und normal für Kennzahlen. Beides betont gleich stark, nur mit verschiedenen Mitteln.

Ein häufiger Widerspruch löst sich damit auf. Ein Token-Export nennt für Zahlen oft ein leichteres Gewicht als für Überschriften. Das ist kein Fehler im Export, das ist diese Unterscheidung.

## Hart und weich

| | Status |
|---|---|
| Ein Element wird nicht gleichzeitig über Größe und Gewicht betont | hart |
| Eine alleinstehende große Zahl läuft im normalen Schnitt | hart |
| Gewichte kommen aus der Skala, nicht aus der Ansicht | hart |
| Welche Gewichte und Größen das sind | weich |

## Woran Du den Verstoß erkennst

- Der große Kennzahlwert in einer Kachel läuft fett.
- Alle Texte in einer Kachel haben dasselbe Gewicht, und die Hierarchie entsteht nur über die Größe.
- Ein Seitentitel wird im Code mit einem festen Gewicht überschrieben, obwohl die Skala eines vorgibt.

## Richtig / falsch

```
        RICHTIG                             FALSCH

  Runway                              Runway
  14,2 Monate                         14,2 Monate
  ^^^^^^^^^^^                         ^^^^^^^^^^^
  Titel klein und schwer              beides groß und schwer
  Zahl groß und normal                Zahl wirkt gedrungen
```

## Grenzen

Eine Zahl im Fließtext ist keine alleinstehende Zahl und folgt dem Text.

Marketing- und Titelseiten dürfen mit ihren eigenen Display-Stufen arbeiten. Dort ist Schrift Bild, und ein Bild darf laut sein.

## Verwandt

- [[Typografie - Zahlenspalten stehen rechtsbündig]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
