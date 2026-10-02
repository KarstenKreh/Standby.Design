---
dateCreated: 2026-10-02
description: "Die Titel einer Ansicht bilden ein Inhaltsverzeichnis: Ebene 1 genau einmal, keine Ebene übersprungen, kein Titel doppelt. Jede Ebene hebt sich sichtbar ab."
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

# Die Titel bilden eine Gliederung

> [!TIP] Regel
> Behandle die Titel einer Ansicht wie ein Inhaltsverzeichnis. Ebene 1 ist der Seitentitel und steht genau einmal da. Jede weitere Ebene liegt in einem Abschnitt der Ebene darüber, und von oben nach unten gelesen geben die Titel den Ablauf der Seite wieder. Kein Titel kommt zweimal vor, auch nicht in einer anderen Größe. Jede Ebene hebt sich sichtbar von der darunter ab, und ein Titel hebt sich genauso von seinen Einträgen ab. Der Titel im Browser-Tab nennt die aktuelle Ansicht.

## Warum

Die Größe eines Titels sagt, wie viel er umfasst. Der Seitentitel umfasst alles, ein Abschnittstitel nur seinen Abschnitt. Liest Du nur die Titel von oben nach unten, kennst Du den Aufbau der Seite, bevor Du ein Feld gelesen hast.

Steht derselbe Titel zweimal da, einmal groß im Kopf und einmal kleiner über dem Formular, behauptet die Seite zwei Ebenen für eine Sache. Der Blick liest dasselbe zweimal und fragt sich, ob es zwei Dinge sind. Ändert später jemand nur einen der beiden, weiß niemand mehr, wie die Seite heißt.

Screenreader lesen dieselbe Gliederung vor. Wer von Überschrift zu Überschrift springt, hört die Struktur, nicht das Aussehen. Ein doppelter Titel oder eine übersprungene Ebene ist dort ein Fehler in der Navigation.

## Jede Stufe ist sichtbar

Die Gliederung muss man auch sehen. Jede Ebene unterscheidet sich von der darunter durch Größe, Gewicht oder beides. Titelstufen dürfen beide Mittel zusammen nutzen, anders als Kennzahlen in [[Typografie - Betone mit einem Mittel, nicht mit zweien]]. Das gilt auch für die unterste Stufe: Ein Titel über einer Liste hebt sich von ihren Einträgen ab. Hat er dieselbe Größe und dasselbe Gewicht, liest er sich als erster Eintrag. Ein zusätzliches Icon oder eine Einrückung ersetzt Größe und Gewicht nicht, sie fügen nur eine Kante hinzu.

## Hart und weich

| | Status |
|---|---|
| Genau ein Titel der Ebene 1 pro Ansicht | hart |
| Jeder Titel steht einmal da | hart |
| Die Ebenen folgen der Schachtelung, keine wird übersprungen | hart |
| Ein Titel steht vor seinem Inhalt, die Reihenfolge ist die Lesereihenfolge | hart |
| Jede Ebene hebt sich von der darunter und von ihren Einträgen über Größe, Gewicht oder beides ab | hart |
| Der Titel im Browser-Tab nennt die aktuelle Ansicht | hart |
| Ob Ebene 1 im Kopf der Anwendung oder in der Ansicht steht | weich, das Projekt entscheidet einmal für alle Ansichten |
| Wie viele Ebenen | weich, Vorgabe höchstens drei in einer Ansicht |
| Welche Mittel eine Ebene nutzt | weich, Größe, Gewicht oder beides |
| Aufbau des Tab-Titels | weich, Vorgabe „Ansicht · Produkt“ |

## Woran Du den Verstoß erkennst

- Kopfleiste und erste Überschrift der Ansicht nennen dasselbe.
- Eine Karte direkt unter dem Titel trägt ihn noch einmal als Kopf.
- Titel und Untertitel sagen dasselbe mit anderen Worten.
- Auf einen Titel der Ebene 1 folgt direkt einer der Ebene 3.
- Ein Titel ist nur über Größe und Gewicht gesetzt, ohne Überschriften-Element.
- Ein Titel hat dieselbe Größe und dasselbe Gewicht wie die Einträge darunter.
- Ein Titel hebt sich nur über ein zweites Icon oder eine Einrückung ab.
- Jeder Browser-Tab der Anwendung heißt gleich, der Titel ändert sich beim Seitenwechsel nicht.

## Richtig / falsch

```
        RICHTIG                             FALSCH

  1 Stammdaten bearbeiten             1 Stammdaten bearbeiten
    2 Anstellung                      1 Stammdaten bearbeiten   ← doppelt
    2 Daten                               3 Anstellung          ← Ebene 2 fehlt
    2 Gehalt und Abfindung              2 Daten
```

## Grenzen

Ein Abschnittstitel darf ein Wort mit dem Seitentitel teilen. Ein Pfad im Kopf der Anwendung („Bereich › Objekt“) ist Navigation und kein Titel. Dann trägt die Ansicht den Namen des Objekts als Ebene 1.

Druckansichten und Exporte brauchen Ebene 1 im Dokument, weil dort der Kopf der Anwendung fehlt.

## Verwandt

- [[Typografie - Betone mit einem Mittel, nicht mit zweien]]
