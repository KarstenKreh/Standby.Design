---
dateCreated: 2026-08-27
description: Alles in einer Zeile hat dieselbe Höhe. Welche das ist, sagt der Kontext der Zeile und nicht die Art des Elements.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
default: 2rem dicht, 2.5rem im Formular
tags:
  - design-system
  - design-rule
  - bedienung
---

# Die Höhe gehört der Zeile, nicht dem Element

> [!TIP] Regel
> Alle Bedienelemente in einer Zeile haben dieselbe Höhe. Welche Höhe gilt, sagt der Kontext der Zeile: dicht in einer Werkzeugleiste, großzügig in einem Formular. Die Höhen sind eine kleine, benannte, geschlossene Menge und stehen als Token.

## Warum

### Ein Paar hat eine gemeinsame Kante

Ein Eingabefeld mit einem Button daneben ist ein Paar. Der Button gehört zu dem Feld, er tut etwas mit dem, was darin steht. Sind beide verschieden hoch, hat die Zeile keine gemeinsame Ober- und Unterkante mehr. Der Button wirkt lose, und der Nutzer sieht zwei Dinge, die zufällig nebeneinander liegen.

Das ist dieselbe Mechanik wie in [[Layout - Erst Abstand, dann Fläche oder Linie]], nur auf der anderen Achse: Nähe gruppiert waagerecht, eine gemeinsame Kante gruppiert senkrecht. Beides wirkt, bevor jemand liest.

### Warum es überhaupt mehr als eine Höhe gibt

Die Dichte hängt vom Kontext ab. In einer Werkzeugleiste stehen viele Bedienelemente nebeneinander, jedes wird kurz berührt und wieder losgelassen. Dort zählt Kompaktheit, weil die Leiste sonst mehr Platz braucht als der Inhalt, für den sie da ist.

In einem Formular tippt der Nutzer. Er bleibt länger dort, zielt auf Felder und liest. Da zählen Ruhe und Trefferfläche.

Der Unterschied liegt in der **Situation**. Ein Button ist in beiden derselbe Button.

### Der Sonderschalter ist das Warnzeichen

Formuliert man die Regel am Element statt an der Zeile („Buttons sind klein, Felder sind groß"), braucht sie sofort eine Ausnahme: einen Schalter, der einen Button für den Einsatz neben Feldern auf Feldhöhe hebt. Diesen Schalter braucht man dann dauernd.

Braucht eine Regel ständig eine Ausnahme, setzt sie an der falschen Stelle an. Entscheidend ist die Zeile, in der ein Element steht. Die Art des Elements spielt keine Rolle.

## Hart und weich

| | Status |
|---|---|
| Alles in einer Zeile hat dieselbe Höhe | hart |
| Die Höhe folgt dem Kontext der Zeile, nicht der Art des Elements | hart |
| Die Höhen sind eine kleine, geschlossene, benannte Menge | hart |
| Jede Höhe steht als Token, nicht in der Ansicht | hart |
| Ein Icon-only-Element ist ein Quadrat auf der Höhe seiner Zeile | hart |
| Wie viele Höhen es gibt und wie hoch sie sind | weich, Vorgabe zwei Stufen: dicht 2rem, Formular 2.5rem |

Zwei Stufen reichen für die meisten Anwendungen. Wer eine dritte einführt, muss dafür einen dritten Kontext benennen können. Eine einzelne Stelle, an der es gerade besser aussah, reicht nicht.

## Woran Du den Verstoß erkennst

- In einer Filter- oder Formularzeile stehen Feld und Button verschieden hoch.
- Ein Element trägt seine Höhe oder sein senkrechtes Padding direkt in der Ansicht.
- Es gibt eine Höhe, die nur an einer einzigen Stelle vorkommt.
- Ein Icon-Element ist rechteckig statt quadratisch.
- Ein Element wird per Sonderschalter angehoben, obwohl seine Zeile schon sagt, welche Höhe gilt.
- Unter einem Formular stehen Speichern und Abbrechen in der dichten Höhe.
- Ein Suchfeld in einer Werkzeugleiste ist höher als die Knöpfe daneben.

## Richtig / falsch

```
        RICHTIG                             FALSCH

  ┌───────────────┐┌─────────┐       ┌───────────────┐
  │               ││         │       │               │┌─────────┐
  │ Suchbegriff   ││ Suchen  │       │ Suchbegriff   ││ Suchen  │
  │               ││         │       │               │└─────────┘
  └───────────────┘└─────────┘       └───────────────┘

  eine Ober- und eine Unterkante      der Button hängt, die Zeile
  für die ganze Zeile                 hat keine gemeinsame Kante
```

## Grenzen

Nach unten begrenzt die Trefferfläche aus [[Bedienung - Klickbares hat eine Fläche, und nur Klickbares sieht so aus]]. Auf Touch-Oberflächen ist die dichte Stufe zu klein für den Finger, sie bleibt dort Werkzeugleisten am Zeigegerät vorbehalten.

Ein Element, das allein steht und in keiner Zeile sitzt, nimmt die Höhe seines Umfelds. Im Zweifel nimmt es die großzügige Höhe. Ein einzelner Knopf gehört fast immer zu einer Aufgabe und nicht zu einer Werkzeugleiste.

Beschriftete Elemente wachsen nur in der Breite mit ihrem Inhalt. Die Höhe ändert sich nie durch den Text darin.

Die Aktionszeile unter einem Formular ist eine Formularzeile. Speichern und Abbrechen nehmen die Formularhöhe, auch wenn kein Feld neben ihnen steht. Umgekehrt nimmt ein Feld in einer Werkzeugleiste, etwa die Suche, die dichte Höhe der Leiste.

## Verwandt

- [[Bedienung - Klickbares hat eine Fläche, und nur Klickbares sieht so aus]]
- [[Layout - Erst Abstand, dann Fläche oder Linie]]
- [[Form - Senkrechtes Padding wird optisch ausgeglichen]]
