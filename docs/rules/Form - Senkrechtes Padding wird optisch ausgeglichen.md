---
dateCreated: 2026-08-27
description: Gleiche Zahlen sehen nicht gleich aus. Senkrechter Weißraum wirkt größer als waagerechter, deshalb wird er etwas kleiner gesetzt.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
default: 14 senkrecht gegen 16 waagerecht
tags:
  - design-system
  - design-rule
  - form
---

# Senkrechtes Padding wird optisch ausgeglichen

> [!TIP] Regel
> Setze das senkrechte Padding eine Spur kleiner als das waagerechte, wenn es rundherum gleich aussehen soll. Gleiche Werte sehen nicht gleich aus.

## Warum

Senkrechter Weißraum wirkt größer als waagerechter desselben Maßes. Setzt Du rundherum denselben Wert, sieht die Fläche oben und unten luftiger aus als an den Seiten, obwohl die Werte gleich sind. Die kleine Absenkung gleicht das aus.

Das liegt an der Wahrnehmung, mit Geschmack hat es nichts zu tun. In der Gestaltung ist der Effekt seit langem bekannt. Er zeigt sich auch im Kleinen. Ein waagerechter Strich wirkt dicker als ein senkrechter gleicher Breite. Schriftgestalter ziehen die Waagerechten in einem Buchstaben deshalb dünner als die Senkrechten, sonst wirkt das Zeichen kopflastig. Wer nachmisst, findet den Unterschied. Beim Lesen sieht man ihn nicht, und das ist so gewollt.

Es ist derselbe Gedanke wie bei optischer statt mathematischer Zentrierung. Maßgeblich ist, was das Auge sieht.

## Hart und weich

| | Status |
|---|---|
| Senkrechtes Padding ist kleiner als waagerechtes, wenn es gleich wirken soll | hart |
| Der Ausgleichswert ist eine benannte Stufe der Skala, kein Wert in der Ansicht | hart |
| Um wie viel kleiner | weich, Vorgabe 14 gegen 16, also etwa ein Achtel |

Der Abstand zwischen den beiden Werten darf klein sein. Der Ausgleich soll selbst nicht auffallen, nur die ungleiche Wirkung beseitigen.

## Woran Du den Verstoß erkennst

- Ein Kartenabschnitt hat rundherum denselben Wert, und der Textblock wirkt oben und unten trotzdem zu weit von der Kante weg.
- Das Padding wird mit einem einzigen `p-4` gesetzt statt getrennt nach Achse.
- Der Ausgleichswert steht als Rohwert im Code, weil die Skala ihn nicht kennt.

## Richtig / falsch

```
        RICHTIG                             FALSCH
   14 senkrecht · 16 waagerecht        16 rundherum

╔═════════════════════════╗       ╔═════════════════════════╗
║                         ║ ⇕14   ║                         ║ ⇕16
║      Financial Health   ║       ║      Financial Health   ║
║                         ║ ⇕14   ║                         ║ ⇕16
╚═════════════════════════╝       ╚═════════════════════════╝
 ├────┤             ├────┤         ├────┤             ├────┤
   16                 16             16                 16

 wirkt gleichmäßig                  wirkt oben und unten luftiger
```

## Der Ausgleichswert braucht eine eigene Stufe

Übliche Abstands-Skalen springen von 12 auf 16 und kennen den Wert dazwischen nicht. Setzt ihn dann jemand von Hand, steht er ab da an jeder Stelle einzeln im Code.

Der Ausgleichswert gehört deshalb als benannte Stufe in die Skala, mit einem Namen, der sagt wofür er da ist. Sonst setzt ihn jeder neu, und schon nach wenigen Stellen weichen die Werte voneinander ab.

## Grenzen

Der Ausgleich gilt für Flächen mit Text. Bei einem quadratischen Icon-Element ist das Quadrat das Ziel, dort wird nicht ausgeglichen.

## Verwandt

- [[Layout - Die Karte hat kein Padding]]
- [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]]
