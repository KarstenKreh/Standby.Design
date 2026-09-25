---
dateCreated: 2026-08-27
description: Trennung entsteht zuerst über Abstand und Fläche. Wenn es doch eine Linie braucht, dann die zurückhaltende. Die kräftige ist ein Signal.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - flaeche
---

# Eine Linie trennt, sie schmückt nicht

> [!TIP] Regel
> Trenne zuerst über Abstand, dann über einen Wechsel der Fläche. Greif erst zur Linie, wenn beides nicht trägt, und nimm dann die zurückhaltende Stärke. Eine kräftige Linie ist ein Signal und bleibt dem vorbehalten, was hervorgehoben werden soll.

## Warum

Eine Linie hat eine Aufgabe: trennen. Sie soll nicht selbst gesehen werden. Trotzdem ist sie das lauteste Mittel, das dafür zur Verfügung steht, und das einzige, das dem Bild etwas hinzufügt. Abstand und Flächenwechsel trennen genauso zuverlässig, ohne dass ein Element mehr auf dem Schirm liegt.

Zieht man jede Trennung als Linie, entsteht ein Gitter aus Rahmen, das lauter ist als der Inhalt darin. Und wenn die kräftige Stärke überall steht, hebt sie nichts mehr hervor. Sie ist dann keine Aussage mehr, sondern Tapete.

Es gibt gute Systeme ganz ohne Linien, die allein mit Fläche, Abstand und Erhebung arbeiten. Das ist keine Abweichung von der Regel, sondern ihre konsequenteste Anwendung.

## Die Rangfolge

Bevor Du eine Linie setzt, geh die Liste von oben durch:

1. **Abstand** — trennt am stärksten und kostet nichts. Siehe [[Layout - Nähe gruppiert, nicht die Linie]]
2. **Fläche** — eine Stufe der Surface-Leiter macht die Grenze sichtbar, ohne sie zu zeichnen
3. **Linie** — wenn der Platz für Abstand fehlt und ein Flächenwechsel zu schwer wäre
4. **Erhebung** — Schatten und Licht, wenn etwas wirklich über dem Übrigen liegt

Die meisten Linien im Bestand sind übersprungene Schritte 1 und 2.

## Hart und weich

| | Status |
|---|---|
| Eine Linie ist ein Mittel unter mehreren, nicht die Voreinstellung | hart |
| Gibt es mehrere Stärken, ist die zurückhaltende der Alltag | hart |
| Die kräftige Stärke bleibt der Hervorhebung vorbehalten | hart |
| Linienfarben kommen aus benannten Tokens, nicht pro Stelle als Grauwert | hart |
| Ob das System überhaupt mit Linien arbeitet und wie viele Stärken es gibt | weich |

## Woran Du den Verstoß erkennst

- Jede Fläche auf der Seite hat eine sichtbare Umrandung.
- Die kräftige Stärke kommt so oft vor, dass sie nichts mehr hervorhebt.
- Eine Linie trennt Dinge, die schon durch Abstand getrennt sind.
- Eine Linie wird pro Stelle als Hex- oder Grauwert gesetzt.
- Es gibt drei oder vier Linienstärken, und niemand kann sagen, wann welche gilt.

## Grenzen

Bei dichten Listen und Tabellen kann der Abstand zwischen zwei Zeilen aus Platzgründen nicht groß genug werden. Dort verdient sich die Linie ihren Platz, und dort ist sie auch ohne schlechtes Gewissen richtig.

Wenn ein Projekt nur eine einzige Linienstärke kennt, ist die Unterscheidung zwischen leise und kräftig gegenstandslos. Dann bleibt von der Regel nur die Rangfolge, und die reicht.

## Verwandt

- [[Layout - Nähe gruppiert, nicht die Linie]]
- [[Layout - Der Divider ist die Unterkante einer Section]]
- [[Fläche - Die Ebene folgt der Rolle, nicht der Schachtelung]]
