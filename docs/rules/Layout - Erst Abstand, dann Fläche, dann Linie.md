---
dateCreated: 2026-08-27
description: "Abstand gruppiert. Reicht er nicht, wechselt die Fläche. Erst dann kommt eine Linie, und zwar die leise."
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

# Erst Abstand, dann Fläche, dann Linie

> [!TIP] Regel
> Gruppiere über Abstand: Was zusammengehört, steht dichter beieinander als zu allem anderen. Reicht der Abstand nicht, wechsle die Fläche. Erst dann kommt eine Linie, in der zurückhaltenden Stärke. Eine kräftige Linie ist ein Signal und bleibt dem vorbehalten, was hervorgehoben werden soll.

## Warum

Abstand ist die stärkste Gruppierung, die es gibt, und sie kostet nichts. Der Blick fasst zusammen, was dicht steht, noch bevor er liest. Eine Linie behauptet dasselbe noch einmal, fügt aber ein sichtbares Element hinzu. Bei Titel, Chart und Button trennt der Abstand schon deutlich genug, und jede zusätzliche Linie ist nur Rauschen.

Der praktische Test: Nimm die Linien testweise heraus. Ist die Gruppierung danach immer noch klar, waren sie überflüssig. Fällt der Aufbau auseinander, waren die Abstände zu gleichförmig — dann ist die Abstandsstaffelung das eigentliche Problem, nicht die fehlende Linie.

Eine Linie hat eine Aufgabe: trennen. Sie soll nicht selbst gesehen werden. Trotzdem ist sie das lauteste Mittel, das dafür zur Verfügung steht, und das einzige, das dem Bild etwas hinzufügt. Abstand und Flächenwechsel trennen genauso zuverlässig, ohne dass ein Element mehr auf dem Schirm liegt.

Zieht man jede Trennung als Linie, entsteht ein Gitter aus Rahmen, das lauter ist als der Inhalt darin. Und wenn die kräftige Stärke überall steht, hebt sie nichts mehr hervor. Sie ist dann keine Aussage mehr, sondern Tapete.

Es gibt gute Systeme ganz ohne Linien, die allein mit Fläche, Abstand und Erhebung arbeiten. Das ist keine Abweichung von der Regel, sondern ihre konsequenteste Anwendung.

## Die Rangfolge

Bevor Du eine Linie setzt, geh die Liste von oben durch:

1. **Abstand** — trennt am stärksten und kostet nichts. Siehe [[Layout - Erst Abstand, dann Fläche, dann Linie]]
2. **Fläche** — eine Stufe der Surface-Leiter macht die Grenze sichtbar, ohne sie zu zeichnen
3. **Linie** — wenn der Platz für Abstand fehlt und ein Flächenwechsel zu schwer wäre
4. **Erhebung** — Schatten und Licht, wenn etwas wirklich über dem Übrigen liegt

Die meisten Linien im Bestand sind übersprungene Schritte 1 und 2.

## Hart und weich

Zwei Einträge stehen weiter auseinander als zwei Zeilen innerhalb eines Eintrags. Sonst liest der Blick mehrzeilige Einträge als eine Textwand und findet den Anfang des nächsten nicht.

Messbar wird das über den Durchschuss, also Zeilenhöhe minus Schriftgröße. Bei 14 Pixel Schrift und Zeilenhöhe 1,5 sind das 7 Pixel. Der Abstand zwischen zwei Einträgen liegt dann bei mindestens 14 Pixel, als Vorgabe die nächste Stufe der Abstandsskala.

| | Status |
|---|---|
| Abstand zwischen Einträgen größer als der Durchschuss innerhalb | hart |
| Mindestens das Doppelte des Durchschusses | hart |
| Die Stufe aus der Skala | weich, Vorgabe die erste Stufe über dem Doppelten |
| Eine Linie ist ein Mittel unter mehreren, nicht die Voreinstellung | hart |
| Gibt es mehrere Stärken, ist die zurückhaltende der Alltag | hart |
| Die kräftige Stärke bleibt der Hervorhebung vorbehalten | hart |
| Linienfarben kommen aus benannten Tokens, nicht pro Stelle als Grauwert | hart |
| Ob das System überhaupt mit Linien arbeitet und wie viele Stärken es gibt | weich |

## Woran Du den Verstoß erkennst

- Zwischen jedem Abschnitt einer Karte sitzt eine Linie, unabhängig vom Inhalt.
- Alle Abstände in einer Ansicht sind gleich groß, und die Struktur entsteht nur aus Linien und Rahmen.
- Ein Formular trennt jedes einzelne Feld mit einer Linie, statt zusammengehörige Felder als Block zu setzen.
- Mehrzeilige Einträge einer Liste stehen so dicht wie ihre eigenen Zeilen.
- Jede Fläche auf der Seite hat eine sichtbare Umrandung.
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

Bei einer langen Liste gleichrangiger Zeilen — Buchungen, Positionen, Kontakte — hilft die Linie wirklich, weil der Abstand zwischen zwei Zeilen dort aus Platzgründen klein bleiben muss. Das ist der Fall, für den die Trennlinie gedacht ist.

Bei dichten Listen und Tabellen kann der Abstand zwischen zwei Zeilen aus Platzgründen nicht groß genug werden. Dort verdient sich die Linie ihren Platz, und dort ist sie auch ohne schlechtes Gewissen richtig.

Wenn ein Projekt nur eine einzige Linienstärke kennt, ist die Unterscheidung zwischen leise und kräftig gegenstandslos. Dann bleibt von der Regel nur die Rangfolge, und die reicht.

## Verwandt

- [[Layout - Der Divider ist die Unterkante einer Section]]
- [[Layout - Die Karte hat kein Padding]]
- [[Fläche - Die Ebene folgt der Rolle, nicht der Schachtelung]]
