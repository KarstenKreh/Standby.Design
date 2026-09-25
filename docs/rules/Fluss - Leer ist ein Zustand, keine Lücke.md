---
dateCreated: 2026-08-27
description: Jede Liste, Tabelle und Auswertung hat einen gestalteten leeren Zustand. Er sagt, warum nichts da ist, und was der nächste Schritt wäre.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - fluss
---

# Leer ist ein Zustand, keine Lücke

> [!TIP] Regel
> Gib jeder Liste, Tabelle, Auswertung und Suchtrefferliste einen gestalteten leeren Zustand. Er sagt, warum nichts da ist, und bietet den nächsten Schritt an. Eine unbeschriebene Fläche ist keine Antwort.

## Warum

Vor einer leeren Fläche kann der Nutzer drei Dinge vermuten: es lädt noch, es ist etwas kaputt, oder es gibt wirklich nichts. Er hat keine Möglichkeit zu unterscheiden, und alle drei führen zu verschiedenem Verhalten — warten, neu laden, weitermachen. Ohne Antwort wählt er falsch.

Dazu kommt: der leere Zustand ist bei jedem neuen Nutzer der **erste** Zustand. Er sieht ihn, bevor er irgendetwas anderes sieht. Eine Anwendung, deren erster Eindruck eine unbeschriebene Fläche ist, wirkt nicht aufgeräumt, sondern unfertig.

## Drei Sorten leer, drei Antworten

Der häufigste Fehler ist nicht der fehlende leere Zustand, sondern derselbe Text für alle drei Fälle.

| Fall | Was der Nutzer wissen muss | Ton |
|---|---|---|
| **Noch nichts angelegt** | Was hier stehen wird, und wie er den ersten Eintrag anlegt | einladend, mit Aktion |
| **Nichts gefunden** | Wonach gesucht wurde, und wie er die Suche lockert | sachlich, mit Weg zurück |
| **Nichts mehr offen** | Dass er fertig ist | bestätigend, ohne Aktion |

„Keine Daten vorhanden" beantwortet keinen der drei Fälle. Beim dritten ist es sogar falsch: dort ist leer das gute Ergebnis, und der Text sollte das sagen statt einen Mangel zu melden.

## Was ein leerer Zustand tut

- Er nennt den Grund in einem Satz.
- Er bietet den nächsten Schritt an, wenn es einen gibt — und nur einen.
- Er steht an derselben Stelle, an der später der Inhalt steht, und verschiebt das Layout nicht.
- Er bleibt im Verhältnis. Eine große Illustration für eine leere Liste in einer Karte ist mehr Aufwand als der Inhalt, den sie ersetzt.

## Woran Du den Verstoß erkennst

- Eine Liste rendert bei null Einträgen einfach nichts.
- Derselbe Text erscheint für „noch nie etwas angelegt" und für „Filter ergibt nichts".
- Der leere Zustand meldet einen Mangel, obwohl leer das Ziel war (Posteingang abgearbeitet, keine offenen Fehler).
- Es gibt keinen Weg aus dem leeren Zustand heraus, obwohl ein Filter ihn verursacht hat.
- Der leere Zustand ist höher oder niedriger als der gefüllte, und die Seite springt beim Laden.

## Grenzen

Nicht jede leere Fläche braucht Text. Eine Spalte in einer Tabelle, ein einzelnes Feld, ein Diagrammabschnitt ohne Wert — dort reicht ein Strich oder ein Zeichen für „kein Wert", siehe [[Zustand - Dieselbe Zahl bedeutet überall dasselbe]]. Die Regel gilt für Bereiche, die als Ganzes leer sind.

## Verwandt

- [[Zustand - Dieselbe Zahl bedeutet überall dasselbe]]
- [[Fluss - Der Platz ist da, bevor die Daten kommen]]
- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
