---
dateCreated: 2026-08-27
description: Flächenebenen sind eine geschlossene, benannte Menge. Welche ein Element bekommt, folgt seiner Rolle im Aufbau und nicht der Zahl der Container darüber.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
default: drei Ebenen
tags:
  - design-system
  - design-rule
  - flaeche
---

# Die Ebene folgt der Rolle, nicht der Schachtelung

> [!TIP] Regel
> Lege die Flächenebenen als geschlossene, benannte Menge fest. Welche Ebene ein Element bekommt, folgt seiner Rolle im Aufbau. Verschachtelung erzeugt keine neue Ebene: ein Feld in einer Liste in einer Karte liegt genauso hoch wie ein Feld, das direkt in der Karte steht.

## Warum

Eine Ebene ist ein Signal, kein Nebenprodukt der Schachtelung. Wächst sie mit jedem Container mit, ist die Menge offen, und dann passieren zwei Dinge. Erstens ist die fünfte Ebene nicht mehr von der vierten zu unterscheiden, weil der Kontrast am Ende der Kette aufgebraucht ist. Zweitens hängt die Farbe eines Elements davon ab, wie tief es zufällig eingebaut wurde. Verschiebt jemand es eine Ebene höher, ändert es seine Farbe, ohne dass jemand eine Entscheidung getroffen hat.

Umgekehrt ergibt sich daraus auch, was nicht geht: ein Element **innerhalb** einer Fläche bekommt nie die Farbe der Ebene darunter. Es liest sich sonst als Loch.

Wie viele Ebenen es gibt, ist damit noch nicht gesagt. Das ist eine Frage des Produkts und der Handschrift, nicht der Regel.

## Hart und weich

| | Status |
|---|---|
| Die Ebenen sind eine geschlossene, benannte Menge | hart |
| Die Ebene folgt der Rolle des Elements, nicht der Schachtelungstiefe | hart |
| Ein Element in einer Fläche trägt nie die Farbe der Ebene darunter | hart |
| Wie viele Ebenen es gibt | weich, Vorgabe drei |

## Ein bewährter Satz von drei

Drei tragen die meisten Anwendungen, und sie lassen sich in einem Satz benennen: die Seite, das was darauf liegt, das was man anfassen kann.

```
Seite            ──  die Seite selbst
  └─ Karte       ──  liegt auf der Seite
       └─ erhoben ─  liegt auf einer Karte
```

Auf die erhobene Ebene gehören Eingabefelder, Options- und Einstellungszeilen samt ihrem Container, einzeln gerahmte Auswahl-Kacheln und andere Flächen, die man drücken kann.

Manche Systeme kommen mit zwei aus, weil sie Trennung über Abstand und Linien lösen. Andere brauchen eine vierte, weil sie eine echte Stapelung darstellen müssen, etwa in einem Editor mit Werkzeugfenstern. Beides ist in Ordnung, solange die Menge benannt und geschlossen bleibt.

## Woran Du den Verstoß erkennst

- Ein Element innerhalb einer Fläche trägt die Farbe der Seite.
- Es gibt eine Flächenfarbe, die nur an einer einzigen Stelle vorkommt.
- Eine Fläche wird eine Stufe dunkler gesetzt mit der Begründung, sie liege ja schon zwei Ebenen tief.
- Dasselbe Bauteil hat auf zwei Seiten verschiedene Flächenfarben.

## Richtig / falsch

```
        RICHTIG                             FALSCH

Seite  ░░░░░░░░░░░░░░░░░░░░       Seite  ░░░░░░░░░░░░░░░░░░░░
  Karte ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒            Karte ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
    Liste ▒▒▒▒▒▒▒▒▒▒▒▒                Liste ▓▓▓▓▓▓▓▓▓▓▓▓
      Feld ▓▓▓▓▓▓▓▓▓▓                  Feld ███████████
      Feld ▓▓▓▓▓▓▓▓▓▓                  Feld ███████████

 Feld bleibt auf einer Ebene.       Jede Schachtelung eine Stufe.
```

## Grenzen

Eine gedämpfte Fläche läuft in die andere Richtung, also unter die Karte, und gehört nicht zur Menge. Sie ist für zurückgenommenen Inhalt da, nicht für Tiefe.

Ein Overlay liegt über allem und hat sein eigenes Verhältnis zum Schleier darunter. Auch das ist keine weitere Stufe.

## Verwandt

- [[Fläche - Eine Linie trennt, sie schmückt nicht]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
