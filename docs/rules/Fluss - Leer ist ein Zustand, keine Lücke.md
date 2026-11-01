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

Vor einer leeren Fläche kann der Nutzer drei Dinge vermuten: es lädt noch, es ist etwas kaputt, oder es gibt wirklich nichts. Er kann die drei nicht unterscheiden, und jeder Fall verlangt etwas anderes: warten, neu laden oder weitermachen. Ohne Antwort wählt er falsch.

Außerdem ist der leere Zustand bei jedem neuen Nutzer der **erste** Zustand. Er sieht ihn, bevor er irgendetwas anderes sieht. Zeigt eine Anwendung als Erstes eine unbeschriebene Fläche, wirkt sie unfertig statt aufgeräumt.

## Drei Sorten leer, drei Antworten

Der häufigste Fehler ist derselbe Text für alle drei Fälle. Er kommt öfter vor als ein fehlender leerer Zustand.

| Fall | Was der Nutzer wissen muss | Ton |
|---|---|---|
| **Noch nichts angelegt** | Was hier stehen wird, und wie er den ersten Eintrag anlegt | einladend, mit Aktion |
| **Nichts gefunden** | Wonach gesucht wurde, und wie er die Suche lockert | sachlich, mit Weg zurück |
| **Nichts mehr offen** | Dass er fertig ist | bestätigend, ohne Aktion |

„Keine Daten vorhanden" beantwortet keinen der drei Fälle. Beim dritten ist der Text sogar falsch. Dort ist leer das gute Ergebnis, und der Text sollte das sagen statt einen Mangel zu melden.

## Was ein leerer Zustand tut

- Er nennt den Grund in einem Satz.
- Er bietet den nächsten Schritt an, wenn es einen gibt, und zwar nur einen.
- Er steht an derselben Stelle, an der später der Inhalt steht, und verschiebt das Layout nicht.
- Er bleibt im Verhältnis. Eine große Illustration für eine leere Liste in einer Karte ist mehr Aufwand als der Inhalt, den sie ersetzt.

## Woran Du den Verstoß erkennst

- Eine Liste rendert bei null Einträgen einfach nichts.
- Derselbe Text erscheint für „noch nie etwas angelegt" und für „Filter ergibt nichts".
- Der leere Zustand meldet einen Mangel, obwohl leer das Ziel war (Posteingang abgearbeitet, keine offenen Fehler).
- Es gibt keinen Weg aus dem leeren Zustand heraus, obwohl ein Filter ihn verursacht hat.
- Der leere Zustand ist höher oder niedriger als der gefüllte, und die Seite springt beim Laden.

## Grenzen

Nicht jede leere Fläche braucht Text. Bei einer Spalte in einer Tabelle, einem einzelnen Feld oder einem Diagrammabschnitt ohne Wert reicht ein Strich oder ein Zeichen für „kein Wert", siehe [[Zustand - Eine Bedeutung, überall gleich]]. Die Regel gilt für Bereiche, die als Ganzes leer sind.

## Verwandt

- [[Zustand - Eine Bedeutung, überall gleich]]
- [[Fluss - Der Platz ist da, bevor die Daten kommen]]
- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
