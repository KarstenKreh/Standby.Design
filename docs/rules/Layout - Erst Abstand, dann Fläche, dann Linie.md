---
dateCreated: 2026-08-27
description: "Abstand gruppiert. Reicht er nicht, wechselt die Fläche. Erst dann kommt eine Linie, in der zurückhaltenden Stärke."
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

Abstand gruppiert am stärksten und kostet nichts. Was dicht steht, sieht der Nutzer als Gruppe, noch bevor er liest. Eine Linie zeigt dieselbe Gruppierung noch einmal, fügt aber ein sichtbares Element hinzu. Bei Titel, Chart und Button trennt der Abstand schon deutlich genug, und jede zusätzliche Linie lenkt nur ab.

Zum Prüfen nimm die Linien testweise heraus. Ist die Gruppierung danach immer noch klar, waren sie überflüssig. Ist der Aufbau ohne sie nicht mehr zu erkennen, waren die Abstände zu gleichförmig. Dann musst Du die Abstände staffeln, eine Linie löst das Problem nicht.

Eine Linie soll nur trennen und nicht selbst auffallen. Trotzdem fällt sie von allen Mitteln zum Trennen am stärksten auf, und als einziges fügt sie dem Bild etwas hinzu. Abstand und Flächenwechsel trennen genauso zuverlässig, ohne zusätzliches Element.

Ist jede Trennung eine Linie, entsteht ein Gitter aus Rahmen, das mehr auffällt als der Inhalt darin. Steht die kräftige Stärke überall, hebt sie nichts mehr hervor.

Es gibt gute Systeme ganz ohne Linien, die allein mit Fläche, Abstand und Erhebung arbeiten. Sie wenden die Regel am konsequentesten an.

## Die Rangfolge

Bevor Du eine Linie setzt, geh die Liste von oben durch:

1. **Abstand** — trennt am stärksten und kostet nichts. Siehe [[Layout - Erst Abstand, dann Fläche, dann Linie]]
2. **Fläche** — eine Stufe der Surface-Leiter macht die Grenze sichtbar, ohne sie zu zeichnen
3. **Linie** — wenn der Platz für Abstand fehlt und ein Flächenwechsel zu schwer wäre
4. **Erhebung** — Schatten und Licht, wenn etwas wirklich über dem Übrigen liegt

Die meisten bestehenden Linien stehen dort, wo Schritt 1 und 2 übersprungen wurden.

## Hart und weich

Zwei Einträge stehen weiter auseinander als zwei Zeilen innerhalb eines Eintrags. Sonst liest der Nutzer mehrzeilige Einträge als einen einzigen Block und findet den Anfang des nächsten nicht.

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

Bei einer langen Liste gleichrangiger Zeilen (Buchungen, Positionen, Kontakte) hilft die Linie wirklich, weil der Abstand zwischen zwei Zeilen dort aus Platzgründen klein bleiben muss. Das ist der Fall, für den die Trennlinie gedacht ist.

Bei dichten Listen und Tabellen kann der Abstand zwischen zwei Zeilen aus Platzgründen nicht groß genug werden. Dort ist die Linie berechtigt und richtig.

Wenn ein Projekt nur eine einzige Linienstärke kennt, ist die Unterscheidung zwischen leise und kräftig gegenstandslos. Dann gilt von der Regel nur die Rangfolge. Das reicht.

## Verwandt

- [[Layout - Der Divider ist die Unterkante einer Section]]
- [[Layout - Die Karte hat kein Padding]]
- [[Fläche - Die Ebene folgt der Rolle, nicht der Schachtelung]]
