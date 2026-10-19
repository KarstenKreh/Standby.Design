---
dateCreated: 2026-10-19
description: "Zahlen, Beträge, Daten, Uhrzeiten und Einheiten kommen formatiert aus den Daten von Unicode CLDR, im Sprachraum der Einstellung. Gespeichert wird neutral."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
korridor: Gruppieren ab 4 oder ab 5 Stellen
default: Ab 5 Stellen, in Tabellen ab 4
tags:
  - design-system
  - design-rule
  - inhalt
---

# Zahlen, Daten und Beträge folgen dem Sprachraum

> [!TIP] Regel
> Formatiere Zahlen, Beträge, Daten, Uhrzeiten und Einheiten mit den Mustern aus Unicode CLDR, im Sprachraum aus der Einstellung. Bau keine eigenen Muster und speichere jeden Wert neutral.

## Warum

„1.250“ heißt in Deutschland tausendzweihundertfünfzig und in den USA eins Komma zwei fünf. „03/04/2026“ ist der 3. April oder der 4. März. Eine falsch gelesene Zahl fällt nicht als Fehler auf. Sie wird geglaubt.

Die Zeichen dafür sind für jeden Sprachraum gepflegt: Dezimalzeichen, Tausendertrennung, Stellung des Währungszeichens, Reihenfolge im Datum, 12 oder 24 Stunden. Die Quelle ist Unicode CLDR. `Intl` im Browser, ICU, Android und iOS lesen daraus. Ein selbst gebautes Muster kennt nur die Sprachräume, an die sein Autor gedacht hat. Beispiele für die Zahl 1234567,5, den Betrag 1234,50 € und den 19. Oktober 2026:

| Sprachraum | Zahl | Betrag | Datum |
|---|---|---|---|
| de-DE | 1.234.567,5 | 1.234,50 € | 19.10.2026 |
| de-CH | 1'234'567.5 | EUR 1'234.50 | 19.10.2026 |
| en-US | 1,234,567.5 | €1,234.50 | 10/19/2026 |
| fr-FR | 1 234 567,5 | 1 234,50 € | 19/10/2026 |
| en-IN | 12,34,567.5 | €1,234.50 | 19/10/2026 |

Die Tabelle ist kein Nachschlagewerk. Das ist CLDR.

## Was CLDR offen lässt

CLDR sagt, mit welchem Zeichen formatiert wird. Wann und wie viel, entscheidet die Ansicht:

- **Ab wann getrennt wird.** Vierstellige Zahlen bleiben im Text ungetrennt, ab fünf Stellen wird gruppiert (`useGrouping: "min2"`). In einer Tabelle wird schon ab vier Stellen gruppiert, damit die Spalte gleich aussieht.
- **Was keine Zahl ist.** Jahreszahlen, Postleitzahlen, Kunden- und Versionsnummern sind Kennungen. Sie bekommen keine Tausendertrennung.
- **Nachkommastellen.** In einer Ansicht haben Beträge entweder 0 oder 2 Nachkommastellen, nie gemischt.
- **Welche Währung.** Kommen mehrere Währungen mit demselben Zeichen vor, etwa Dollar, steht der Code (USD, CAD) statt des Zeichens.
- **Wie lang ein Datum ist.** Wo Platz ist, mit Monatsnamen (`dateStyle: "long"`), dann gibt es keine Verwechslung. Weicht die Zeitzone von der des Nutzers ab, steht sie dabei.
- **Zahl und Einheit.** Dazwischen steht ein geschütztes Leerzeichen, damit „10 MB“ nicht umbricht. Das Einheitensystem, metrisch oder imperial, folgt der Region.

## Eingabe

- Ein Feld liest die Eingabe im Sprachraum der Einstellung. Sobald der Nutzer das Feld verlässt, zeigt es den erkannten Wert formatiert an. So sieht er, wie „1.250“ verstanden wurde.
- Beträge und Mengen bekommen `inputmode="decimal"`, nicht `type="number"`. Das zeigt keine Tausendertrennung, und das Mausrad ändert den Wert.
- Eine Maske, also ein Feld, das beim Tippen formatiert, nur für Formate, die für das Land geprüft sind, etwa Kartennummern. Sonst ein freies Feld.
- Ein bekanntes Datum, etwa der Geburtstag, bekommt drei Felder für Tag, Monat und Jahr in der Reihenfolge des Sprachraums. Ein Kalender ist nie die einzige Eingabe.

## Speichern

Neutral und ohne Format: Zahlen als Zahl, Beträge in der kleinsten Einheit mit Währungscode, Zeitpunkte nach ISO 8601 mit Zeitzone, Telefonnummern als E.164 (`+493012345678`). Formatiert wird erst in der Anzeige.

## Woran Du den Verstoß erkennst

- `toFixed(2).replace(".", ",")` oder ein eigener regulärer Ausdruck für Tausenderpunkte.
- Ein Datum aus `getDate() + "." + getMonth()` zusammengesetzt.
- Ein fester Sprachraum wie `"de-DE"` im Code einer App, die mehrere Sprachen anbietet.
- `Intl` oder `toLocaleString()` ohne den Sprachraum, den der Nutzer in der App gewählt hat.
- Ein Betragsfeld mit `type="number"`.
- Ein Datum wie „03/04/2026“ in einer Oberfläche für mehrere Länder.
- In einer Spalte stehen „12 €“ und „12,50 €“ nebeneinander.
- „10MB“ ohne Leerzeichen, oder die Einheit bricht in die nächste Zeile.
- Eine Postleitzahl als Zahl gespeichert, aus 01067 wird 1067.

## Richtig / falsch

```
        RICHTIG                          FALSCH

  de   12.560 €   19. Oktober 2026    de   12560.00 EUR   10/19/2026
  en   €12,560    October 19, 2026    en   12.560 €       19.10.2026

  Format aus dem Sprachraum           ein Muster für alle
```

## Hart und weich

Hart: das Format kommt aus CLDR für den Sprachraum der Einstellung, gespeichert wird neutral. Weich: ab wie vielen Stellen gruppiert wird. Vorgabe: ab fünf Stellen, in Tabellen ab vier.

## Grenzen

Werte für Maschinen bleiben neutral: Logs, API-Antworten, CSV-Exporte für die Weiterverarbeitung.

Deutsche Drucksachen nach DIN 5008 trennen nur Beträge mit dem Punkt und andere Zahlen mit einem Leerzeichen. CLDR setzt für Deutsch überall den Punkt. Auf dem Bildschirm gilt CLDR. Verlangt ein Dokument die Norm, gilt die Norm.

## Quelle

Unicode CLDR, https://www.unicode.org/cldr/charts/latest/by_type/index.html. Microsoft Globalization › Format numbers, https://learn.microsoft.com/en-us/globalization/locale/number-formatting. GOV.UK Design System › Dates, https://design-system.service.gov.uk/patterns/dates/. Baymard › Input masking, https://baymard.com/blog/input-masking-form-field. Shopify Polaris › Formatting localized currency. Vercel Web Interface Guidelines › Content („Format dates, times, numbers, delimiters, & currencies for the user’s locale"). DIN 5008, DIN 1333.

## Verwandt

- [[Fluss - Die Sprache kommt aus der Einstellung, nicht aus dem Ort]]
- [[Inhalt - Lange Zeichenketten stehen in Gruppen]]
- [[Formular - Was der Nutzer tippt oder einfügt, kommt an]]
- [[Typografie - Zahlenspalten stehen rechtsbündig]]
