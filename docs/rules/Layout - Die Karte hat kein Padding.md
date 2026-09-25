---
dateCreated: 2026-08-27
description: Die Karte ist nur Fläche, Rand und Radius. Das Padding sitzt in den Abschnitten darin, und ein Abschnitt darf es auf null setzen.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
default: 14 senkrecht, 16 waagerecht
tags:
  - design-system
  - design-rule
  - layout
---

# Die Karte hat kein Padding

> [!TIP] Regel
> Gib der Karte kein eigenes Padding und kein Gap. Sie ist eine senkrechte Flexbox mit Fläche, Rand, Radius und beschnittenem Überlauf. Das Padding tragen die Abschnitte darin, und jeder Abschnitt entscheidet für sich, ob er welches braucht.

## Warum

Wenn die Karte das Padding trägt, drückt sie jeden Inhalt nach innen, ausnahmslos. Ein Bild, ein Chart oder eine Tabelle kann dann nie bis an die Kante laufen, obwohl genau das oft die richtige Darstellung wäre. Der einzige Ausweg wären negative Margins, und die sind immer ein Hinweis darauf, dass etwas eine Ebene zu hoch sitzt.

Liegt das Padding dagegen im Abschnitt, entscheidet jeder Abschnitt für sich: Text bekommt Abstand, ein Bild darf randlos sein, eine Tabelle darf ihre eigenen Spaltenabstände mitbringen. Der Abstand bleibt trotzdem überall gleich, weil alle Abschnitte aus denselben zwei Werten schöpfen.

Die Regel nimmt der Karte nichts. Sie gibt den Abschnitten Freiheit.

## Der Aufbau

```
Karte        = flex-col · Fläche · Rand · Radius · Überlauf beschnitten · KEIN Padding · KEIN Gap
└─ Abschnitt = volle Breite bis zur Kante · trägt das Padding
   └─ Inhalt = Text | Chart | Bild | Tabelle | Hinweis | Button | Kennzahl
```

## Richtig / falsch

```
        RICHTIG                             FALSCH
   Padding im Abschnitt            Padding auf der Karte

╔═════════════════════════╗       ╔═════════════════════════╗
║┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄║       ║                         ║
║                         ║       ║  ┌───────────────────┐  ║
║     Titel               ║       ║  │ Titel             │  ║
║                         ║       ║  └───────────────────┘  ║
║┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄║       ║  ┌───────────────────┐  ║
║█████████████████████████║       ║  │███████████████████│  ║
║██ Bild bis zur Kante ███║       ║  │██ Bild eingerückt │  ║
║█████████████████████████║       ║  └───────────────────┘  ║
╚═════════════════════════╝       ╚═════════════════════════╝

 Abschnitt berührt die Kante.      Karte drückt alles nach innen.
 Randloses Bild möglich.           Randloses Bild unmöglich.
```

## Wann ein Abschnitt randlos läuft

Randlos ist für Inhalt, der **bis an seine eigene Kante Farbe trägt**: Bild, Chart, Tabelle, Heatmap, Landkarte, Video. Solcher Inhalt bringt seine Begrenzung selbst mit. Setzt Du ihn zusätzlich in einen Rahmen aus Hintergrundfläche, stehen zwei Kanten dicht nebeneinander, und keine der beiden wirkt gewollt. Läuft er bis an die Kante, ist die Karte selbst sein Rahmen.

Nicht randlos läuft Inhalt, der seinen Weißraum schon mitbringt: ein freigestelltes Logo, eine Illustration auf hellem Grund, Text. Der braucht das Padding des Abschnitts.

Damit die Ecke dabei sauber bleibt, muss die Karte ihren Überlauf beschneiden. Läuft ein Bild bis zur Kante und die Ecke ist trotzdem eckig, fehlt genau das.

## Padding-Werte im Abschnitt

Nur das erste Kind bekommt oben Padding. Die weiteren nicht, weil der untere Abstand des Vorgängers den Abstand schon liefert. Sobald Trennlinien im Spiel sind, bekommt jeder Abschnitt oben und unten Padding, sonst klebt der Inhalt an der Linie.

| Fall | oben | rechts | unten | links |
|---|---|---|---|---|
| Erstes Kind, ohne Trennlinie | 14 | 16 | 14 | 16 |
| Weitere Kinder, ohne Trennlinie | 0 | 16 | 14 | 16 |
| Alle Kinder, mit Trennlinie | 14 | 16 | 14 | 16 |
| Randloser Abschnitt | 0 | 0 | 0 | 0 |

## Hart und weich

| | Status |
|---|---|
| Die Karte trägt kein Padding und kein Gap | hart |
| Das Padding sitzt im Abschnitt, randlose Abschnitte dürfen null setzen | hart |
| Zwei Werte für die ganze Karte, senkrecht kleiner als waagerecht | hart |
| Die konkreten Zahlen | weich, Vorgabe 14 senkrecht, 16 waagerecht |

Warum senkrecht kleiner: [[Form - Senkrechtes Padding wird optisch ausgeglichen]].

## Woran Du den Verstoß erkennst

- Die Karte selbst trägt Padding oder ein Gap.
- Ein Abschnitt setzt sein Padding mit negativen Margins wieder zurück. Das ist der sichere Beweis, dass das Padding eine Ebene zu hoch sitzt.
- Ein Bild in einer Karte hat links und rechts denselben Abstand wie der Fließtext darüber, obwohl es bis an die Kante gehört.
- Ein Chart läuft bis zur Kante, aber die Ecke ist eckig.

## Grenzen

Keine. Auch eine Karte, die nur einen Textblock enthält, bekommt kein Padding. Sonst ist die Ausnahme nach dem dritten Einsatz die Regel, und beim nächsten Mal steht wieder ein Padding auf der Karte.

## Verwandt

- [[Layout - Der Divider ist die Unterkante einer Section]]
- [[Form - Senkrechtes Padding wird optisch ausgeglichen]]
- [[Form - Konzentrische Radien]]
