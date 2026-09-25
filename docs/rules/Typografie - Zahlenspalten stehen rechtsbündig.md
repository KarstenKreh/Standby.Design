---
dateCreated: 2026-08-27
description: Zahlen in Tabellen stehen rechtsbündig. Ohne gleich breite Ziffern wackelt die Spalte sonst.
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

# Zahlenspalten stehen rechtsbündig

> [!TIP] Regel
> Setze jede Zahlenspalte in einer Tabelle rechtsbündig. Das gilt unabhängig davon, ob die Schrift gleich breite Ziffern hat.

## Warum

Rechtsbündig stehen Einer über Einern, Zehner über Zehnern. Der Blick vergleicht Größenordnungen dann an der Länge der Zahl, ohne zu lesen: eine Zahl, die weiter nach links reicht, ist größer. Linksbündig geht das verloren, dort steht die 9 unter der 1000.

Der zweite Grund ist praktisch. Viele moderne Schriften haben keine gleich breiten Ziffern, und die Einstellung für Tabellenziffern greift dann nicht. Beim Aktualisieren der Werte springt die Spalte. Rechtsbündig fällt das an der linken Kante viel weniger auf als linksbündig an der rechten.

Das betrifft jedes Projekt, das für Zahlen die normale Textschrift benutzt statt einer Monospace, und das ist der Normalfall, sobald Zahlen im Layout gut aussehen sollen.

## Gleich breite Ziffern, in zwei Stufen

Rechtsbündigkeit ordnet die Zahlen. Damit auch die einzelnen Stellen genau untereinander stehen, braucht es gleich breite Ziffern. Dafür gibt es zwei Stufen.

**Erste Stufe: Tabellenziffern.** Die meisten modernen Schriften bringen einen zweiten Ziffernsatz mit, bei dem alle Ziffern dieselbe Breite haben (`font-variant-numeric: tabular-nums`, im Schriftformat `tnum`). Das kostet keinen Schriftwechsel und reicht für die allermeisten Tabellen. Es greift allerdings nur, wenn die Schrift den Satz auch enthält.

**Zweite Stufe: eine Monospace.** In stark zahlengetriebenen Anwendungen — Buchhaltung, Finanzen, Messwerte, alles Mathematische, Protokolle — ist eine Schrift mit fester Zeichenbreite die bessere Wahl. Dort steht jede Stelle exakt untereinander, auch über Spalten und Zeilen hinweg, und man kann Ziffernfolgen abzählen statt sie zu lesen. Für lange Nummern ist das der Unterschied zwischen prüfbar und nicht prüfbar.

Solche Schriften unterscheiden außerdem Zeichen, die sonst verwechselt werden: die Null von einem großen O, die Eins von einem kleinen l und einem großen I. Viele bieten dafür eine durchgestrichene oder gepunktete Null als Schriftmerkmal (`font-variant-numeric: slashed-zero`, im Format `zero`). In technischen Zusammenhängen sollte die eingeschaltet sein.

Die Monospace gilt dabei für die Zahlen, nicht für die ganze Oberfläche. Beschriftungen, Titel und Fließtext bleiben in der Textschrift.

## Woran Du den Verstoß erkennst

- Eine Betrags- oder Mengenspalte steht linksbündig oder zentriert.
- Die Spaltenbreite ändert sich beim Aktualisieren der Daten.
- Eine Zahlenspalte ist mit Leerzeichen auf gleiche Breite gebracht.
- Die Ziffern springen beim Wechsel der Werte hin und her, weil die Tabellenziffern nicht eingeschaltet sind.
- Eine technische Anwendung zeigt lange Nummern in der Textschrift, und Null und O sind nicht zu unterscheiden.

## Richtig / falsch

```
        RICHTIG                             FALSCH

  Kostenstelle    Betrag            Kostenstelle    Betrag
  Vertrieb      1.240,00            Vertrieb        1.240,00
  Marketing        98,50            Marketing       98,50
  IT           12.005,20            IT              12.005,20

  Größenordnung sofort sichtbar     alles gleich lang
```

## Grenzen

Zahlen, die keine Größe sind, folgen ihrem Inhalt: Kundennummern, Postleitzahlen, Jahreszahlen, Telefonnummern. Sie werden nicht verglichen, sondern gelesen, und stehen deshalb linksbündig wie Text.

## Verwandt

- [[Typografie - Betone mit einem Mittel, nicht mit zweien]]
