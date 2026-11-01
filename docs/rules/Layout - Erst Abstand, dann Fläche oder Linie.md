---
dateCreated: 2026-08-27
description: "Abstand gruppiert. Reicht er nicht, trennt eine feine Linie die Einträge einer Liste und eine Fläche große Bereiche. Die kräftige Linie bleibt der Hervorhebung vorbehalten."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
korridor: Abstand zwischen Einträgen mindestens doppelter Durchschuss
default: 1rem bei Fließtext 14px, Zeilenhöhe 1.5
tags:
  - design-system
  - design-rule
  - layout
  - flaeche
---

# Erst Abstand, dann Fläche oder Linie

> [!TIP] Regel
> Gruppiere über Abstand: Was zusammengehört, steht dichter beieinander als zu allem anderen. Reicht der Abstand nicht, entscheidet die Größe der Gruppe. Einträge einer Liste trennt eine feine Linie, große Bereiche trennt ein Wechsel der Fläche. Eine kräftige Linie ist ein Signal und bleibt dem vorbehalten, was hervorgehoben werden soll.

## Begriffe

- **Abstand:** Leerraum. Zwischen zwei Gruppen ist er größer als innerhalb einer Gruppe.
- **Fläche:** ein anderer Hintergrund für eine Gruppe, eine der Flächenebenen aus [[Fläche - Die Ebene folgt der Rolle, nicht der Schachtelung]].
- **Linie:** ein Strich oder Rahmen zwischen Gruppen. Fein ist die zurückhaltende Stärke, kräftig die hervorhebende.

## Warum

Abstand gruppiert am stärksten und kostet nichts. Was dicht steht, sieht der Nutzer als Gruppe, noch bevor er liest. Eine Linie oder Fläche zeigt dieselbe Gruppierung noch einmal, fügt aber etwas Sichtbares hinzu. Bei Titel, Chart und Button trennt der Abstand schon deutlich genug, und jede zusätzliche Linie lenkt nur ab.

Zum Prüfen nimm die Linien testweise heraus. Ist die Gruppierung danach immer noch klar, waren sie überflüssig. Ist der Aufbau ohne sie nicht mehr zu erkennen, waren die Abstände zu gleichförmig. Dann musst Du die Abstände staffeln, eine Linie löst das Problem nicht.

Linie und Fläche fügen verschieden viel hinzu. Eine feine Linie ist ein Pixel hoch und erzeugt eine einzige Kante. Eine Fläche färbt eine ganze Zone ein und erzeugt Kanten auf allen Seiten. Dafür gruppiert sie stärker: Was auf derselben Fläche liegt, liest jeder sofort als Einheit. Deshalb passt die Fläche zu großen Bereichen, etwa Seitenleiste und Inhalt. Die feine Linie passt zu vielen kleinen Einträgen, etwa den Zeilen einer Liste. Steht jeder Listeneintrag auf einer eigenen getönten Fläche, wird aus der Liste ein Raster aus Kästen.

Ist jede Trennung eine Linie oder ein Kasten, entsteht ein Gitter aus Rahmen, das mehr auffällt als der Inhalt darin. Steht die kräftige Linie überall, hebt sie nichts mehr hervor.

Es gibt gute Systeme ganz ohne Linien, die allein mit Fläche, Abstand und Erhebung arbeiten. Sie wenden die Regel am konsequentesten an.

## Die Rangfolge

Bevor Du eine Linie oder Fläche setzt, geh die Liste von oben durch:

1. **Abstand.** Er trennt am stärksten und fügt nichts hinzu.
2. **Feine Linie oder Fläche, je nach Größe der Gruppe.** Die feine Linie trennt Einträge einer Liste und Zeilen einer Tabelle. Die Fläche trennt große Bereiche, die nebeneinander oder untereinander stehen.
3. **Erhebung.** Schatten und Licht, wenn etwas wirklich über dem Übrigen liegt.

Die meisten überflüssigen Linien und Kästen stehen dort, wo Schritt 1 übersprungen wurde.

## Hart und weich

Zwei Einträge stehen weiter auseinander als zwei Zeilen innerhalb eines Eintrags. Sonst liest der Nutzer mehrzeilige Einträge als einen einzigen Block und findet den Anfang des nächsten nicht.

Messbar wird das über den Durchschuss, also Zeilenhöhe minus Schriftgröße. Bei 14 Pixel Schrift und Zeilenhöhe 1,5 sind das 7 Pixel. Der Abstand zwischen zwei Einträgen liegt dann bei mindestens 14 Pixel, als Vorgabe die nächste Stufe der Abstandsskala.

| | Status |
|---|---|
| Abstand zwischen Einträgen größer als der Durchschuss innerhalb | hart |
| Mindestens das Doppelte des Durchschusses | hart |
| Die Stufe aus der Skala | weich, Vorgabe die erste Stufe über dem Doppelten |
| Eine Linie ist ein Mittel unter mehreren, nicht die Voreinstellung | hart |
| Gibt es mehrere Stärken, ist die feine der Alltag | hart |
| Nach dem Abstand: feine Linie für Einträge, Fläche für große Bereiche | weich, Vorgabe nach Größe der Gruppe |
| Die kräftige Stärke bleibt der Hervorhebung vorbehalten | hart |
| Linienfarben kommen aus benannten Tokens, nicht pro Stelle als Grauwert | hart |
| Ob das System überhaupt mit Linien arbeitet und wie viele Stärken es gibt | weich |

## Woran Du den Verstoß erkennst

- Zwischen jedem Abschnitt einer Karte sitzt eine Linie, unabhängig vom Inhalt.
- Alle Abstände in einer Ansicht sind gleich groß, und die Struktur entsteht nur aus Linien und Rahmen.
- Ein Formular trennt jedes einzelne Feld mit einer Linie, statt zusammengehörige Felder als Block zu setzen.
- Mehrzeilige Einträge einer Liste stehen so dicht wie ihre eigenen Zeilen.
- Jede Fläche auf der Seite hat eine sichtbare Umrandung.
- Jeder Eintrag einer Liste steht auf einer eigenen getönten Fläche.
- Die kräftige Stärke kommt so oft vor, dass sie nichts mehr hervorhebt.
- Eine Linie trennt Dinge, die schon durch Abstand getrennt sind.
- Eine Linie wird pro Stelle als Hex- oder Grauwert gesetzt.
- Es gibt drei oder vier Linienstärken, und niemand kann sagen, wann welche gilt.

## Richtig / falsch

```
        RICHTIG                             FALSCH
  Abstand macht die Gruppe           Linie macht die Gruppe

  Rechnungsadresse                   Rechnungsadresse
  Straße        [__________]         Straße        [__________]
  PLZ, Ort      [__________]         ─────────────────────────
                                     PLZ, Ort      [__________]
  Lieferadresse                      ─────────────────────────
  Straße        [__________]         Lieferadresse
  PLZ, Ort      [__________]         ─────────────────────────
                                     Straße        [__________]
  Zwei Blöcke, sofort lesbar.        Sieben gleich starke Zeilen.
```

## Grenzen

Bei dichten Listen und Tabellen (Buchungen, Positionen, Kontakte) kann der Abstand zwischen zwei Zeilen aus Platzgründen nicht groß genug werden. Dort ist die feine Linie berechtigt. Für diesen Fall ist sie gedacht.

Karten in einem Raster, etwa Produkte oder Projekte, sind keine Listeneinträge. Jede Karte ist ein eigener Bereich und darf eine eigene Fläche haben.

Kennt ein Projekt nur eine Linienstärke, entfällt die Unterscheidung zwischen fein und kräftig. Dann gilt von der Regel nur die Rangfolge.

## Verwandt

- [[Layout - Der Divider ist die Unterkante einer Section]]
- [[Layout - Die Karte hat kein Padding]]
- [[Fläche - Die Ebene folgt der Rolle, nicht der Schachtelung]]
