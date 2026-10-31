---
dateCreated: 2026-10-31
description: "Jeder Textstil einer Ansicht hat eine benannte Rolle, zwei Stile unterscheiden sich deutlich. Die Zahl der Stile folgt aus dem Inhalt. Korridor 4-7, Vorgabe 5."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
korridor: 4-7 Textstile pro Ansicht
default: 5
tags:
  - design-system
  - design-rule
  - typografie
---

# Jeder Textstil hat eine Rolle

> [!TIP] Regel
> Gib jedem Textstil einer Ansicht eine Rolle, etwa Titelstufe 1, Fließtext, Beschriftung, Kennzahl oder Meta. Zwei Stile ohne verschiedene Rolle sind einer zu viel. Zwei Stile unterscheiden sich deutlich: mindestens zwei Stufen der Skala auseinander oder durch ein anderes Mittel. Eine Familie neben der Textschrift trägt genau eine Rolle.

## Begriffe

- **Textstil:** die Kombination aus Größe, Schnitt, Farbe und Schreibweise, so wie sie im Bild ankommt.
- **Rolle:** die Aufgabe eines Textstils in der Ansicht. Titelstufe 1 bis 3, Fließtext, Beschriftung, Kennzahl, Meta.
- **Stufe:** ein Schritt der Typo-Skala.
- **Familie:** die Schriftart, etwa eine Grotesk oder eine Display-Schrift.

Rolle heißt hier dasselbe wie bei Flächen und Bedienelementen in [[Philosophie - Body, Role und Skin]]: Was ein Element tut, bestimmt, wie es aussieht. Ein Textstil ist die Haut einer Text-Rolle.

## Warum

Jeder Textstil behauptet etwas: Dieser Text ist eine andere Sorte als der daneben. Der Blick sortiert danach, noch bevor er liest. Gibt es mehr Stile als Sorten, sortiert er ins Leere. Zwei Beschriftungen in leicht verschiedenen Graden lesen sich als zwei Dinge, obwohl sie dasselbe sind. Die Ansicht wirkt unruhig, und niemand kann sagen, woran es liegt.

Eine feste Höchstzahl hilft dagegen nur zum Teil. Ein Formular braucht weniger Stile als eine Übersicht mit Kennzahlen, und eine Zahl, die für jede Ansicht passt, gibt es nicht. Deshalb leitet die Regel die Zahl aus zwei Bedingungen ab. Jeder Stil braucht eine Rolle, die man benennen kann. Damit folgt die Zahl dem Inhalt. Und jeder Stil muss sich deutlich vom nächsten abheben. Damit ist die Zahl begrenzt, weil die Skala nur so viele deutlich verschiedene Stufen hat.

Eine Stufe Abstand reicht dafür nicht. Benachbarte Stufen liegen so dicht, dass das Auge sie nebeneinander als „fast gleich“ liest. Das ist schlechter als gleich: Es sieht nach einem Versehen aus. Zwei Stufen Abstand oder ein zweites Mittel, etwa Gewicht, Farbe oder Versalien, machen den Unterschied zur Absicht.

Eine Display- oder Zierschrift hat einen eigenen Charakter. Steht sie an mehreren Rollen, verliert sie ihn und macht jede dieser Rollen lauter, als sie sein soll. Eine ruhige Grotesk dagegen trägt viele Rollen, weil sie sich zurücknimmt.

## Hart und weich

| | Status |
|---|---|
| Jeder Textstil hat eine benannte Rolle | hart |
| Zwei Stile liegen mindestens zwei Stufen auseinander oder unterscheiden sich in einem weiteren Mittel | hart |
| Eine Familie neben der Textschrift trägt genau eine Rolle | hart |
| Die Rollen stehen als Tokens oder Klassen, eine Ansicht setzt Rollen statt Größen | hart |
| Anzahl der Textstile pro Ansicht | weich, Korridor 4-7, Vorgabe 5 |
| Welche Rollen ein Projekt hat | weich, Vorgabe Titelstufe 1-3, Fließtext, Beschriftung, Kennzahl, Meta |

## Woran Du den Verstoß erkennst

- Im gerenderten Screen gibt es mehr verschiedene Kombinationen aus Größe, Schnitt, Farbe und Schreibweise als benannte Rollen.
- Zwei Texte unterscheiden sich nur um eine Stufe der Skala und sonst in nichts.
- Eine Display-Schrift erscheint an mehr als einer Rolle, etwa am Seitentitel und an Beschriftungen.
- Ein Textstil kommt nur an einer einzigen Stelle vor.
- Eine Ansicht setzt Größe, Gewicht und Farbe einzeln, statt eine Rolle zu nehmen.

## Richtig / falsch

```
        RICHTIG                             FALSCH

  Übersicht              Titelstufe 1   Übersicht              text-2xl bold
  Umsatz                 Beschriftung   Umsatz                 text-sm medium
  14,2 Mio. €            Kennzahl       14,2 Mio. €            text-3xl bold
  seit Januar            Meta           seit Januar            text-xs muted
                                        Stand 31.10.           text-[13px] muted  ← keine Rolle
  Letzte Buchungen       Titelstufe 2   Letzte Buchungen       text-xl bold       ← eine Stufe unter 2xl
  Miete Oktober  1.200   Fließtext      Miete Oktober  1.200   text-base
                                        Details anzeigen       text-sm primary    ← zweite Beschriftung

  6 Stile, 6 Rollen                     8 Stile, 6 Rollen
```

## Grenzen

Marketing- und Titelseiten dürfen eigene Display-Stufen haben. Dort ist Schrift Bild, siehe [[Typografie - Betone mit einem Mittel, nicht mit zweien]].

Dichte Tabellen haben eigene Rollen für Kopf und Zellen. Sie zählen als Rollen wie alle anderen, auch wenn sie nur in der Tabelle vorkommen.

Ein Stil, der nur einmal vorkommt, ist kein Verstoß, wenn seine Rolle nur einmal gebraucht wird. Das ist meist Titelstufe 1.

Die Farbe eines Zustands, etwa Rot für einen Fehler, ist kein eigener Textstil. Sie gehört zur Rolle des Textes, der den Zustand trägt.

## Verwandt

- [[Layout - Die Titel bilden eine Gliederung]]
- [[Typografie - Betone mit einem Mittel, nicht mit zweien]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
