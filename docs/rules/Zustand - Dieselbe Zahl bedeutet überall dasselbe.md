---
dateCreated: 2026-08-27
description: Die Übersetzung von einem Wert in einen Zustand ist im Produkt einmal festgelegt und gilt auf jeder Seite. Fehlt der Wert, bleibt es neutral.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - zustand
---

# Dieselbe Zahl bedeutet überall dasselbe

> [!TIP] Regel
> Lege einmal fest, ab welcher Grenze ein Wert gut, mittel oder schlecht ist, und halte diese Übersetzung auf jeder Seite gleich. Fehlt der Wert, ist der Zustand neutral.

## Warum

Farbe ist eine Aussage über Daten. Steht derselbe Wert auf einer Seite in Gelb und auf der anderen in Grün, widerspricht sich die Oberfläche selbst. Der Nutzer merkt das, auch wenn er es nicht benennen kann, und er lernt daraus das Falsche: der Farbe nicht zu trauen. Danach nützt sie nirgends mehr etwas, auch dort nicht, wo sie stimmt.

Das passiert nicht aus Nachlässigkeit, sondern weil jede Stelle ihre Grenze einzeln setzt. Jede für sich ist plausibel gewählt, und zusammen ergeben sie vier verschiedene Skalen im selben Produkt.

Die Regel greift überall, wo eine Zahl in einen Zustand übersetzt wird: Speicherplatz, der knapp wird. Passwortstärke. Akkustand. Lagerbestand. Temperatur, Luftqualität, Lieferzeit. Ein Fortschritt, der „hinter Plan" heißt. Sobald es eine Grenze gibt, ab der etwas anders aussieht, gilt sie.

## Ohne Daten kein Zustand

Fehlt der Wert, ist der Zustand neutral und die Anzeige bleibt grau. Es wird nichts angenommen.

Wer bei fehlendem Wert Grün zeigt, behauptet „alles in Ordnung", obwohl niemand nachgesehen hat. Das ist die gefährlichste Falschaussage, weil sie beruhigt. Wer Rot zeigt, löst einen Alarm ohne Anlass aus, und nach dem dritten Mal glaubt niemand mehr an die roten Felder. Grau ist die ehrliche Antwort: es liegt nichts vor.

Die Regel hat eine unbequeme Seite. Eine frisch eingerichtete Ansicht sieht dadurch grau und leer aus. Das ist der richtige Eindruck. Der Weg zu einer bunten Ansicht führt über Daten, nicht über Annahmen.

**Sonderfall Zähler.** Bei einem Zähler für etwas, das es nicht geben sollte — offene Fehler, fehlende Belege, ungelesene Warnungen — ist die Null nicht grün, sondern grau. Grün hieße „geprüft und in Ordnung". Grau heißt „hier ist nichts", und das ist der ehrlichere Satz.

## Wo die Grenzen herkommen

Die Zahlen selbst sind eine fachliche Festlegung, keine Gestaltungsfrage. Wo die Grenze zwischen mittel und schlecht liegt, entscheidet nicht der Designer, sondern wer für die Zahl fachlich einsteht.

Getrennt davon steht die Übersetzung in das, was man sieht. Wer die Grenzen ändert, ändert sie an einer Stelle, ohne dass sich das Aussehen bewegt. Wer das Aussehen ändert, fasst die Grenzen nicht an.

## Woran Du den Verstoß erkennst

- Zwei Ansichten zeigen denselben Wert in verschiedenen Farben.
- Der Vergleich mit einer Grenze steht in mehr als einer Datei.
- Eine neue Anzeige bekommt ihre Grenzen mitgegeben, statt sie zu erfragen.
- Ein fehlender Wert wird zu null gemacht und dann eingefärbt.
- Ein Feld ohne Daten ist grün, weil „kein Problem gemeldet" als gut gewertet wird.
- Eine Kennzahl zeigt einen Strich und trotzdem einen farbigen Rand oder ein farbiges Badge.

## Grenzen

Eine Kennzahl mit fachlich eigenen Grenzen — eine gesetzliche Quote, ein vertraglicher Schwellwert — bekommt ihre Werte natürlich von dort. Sie geht trotzdem durch dieselbe Übersetzung, damit der Weg von der Zahl zur Farbe an einer Stelle bleibt.

Ein leerer Zustand darf erklären, warum nichts da ist, und einen Weg anbieten („Noch keine Buchungen — Import starten"). Neutral heißt grau, nicht wortlos.

## Verwandt

- [[Zustand - Rot ist nicht ein Rot]]
- [[Bedienung - Ein dauerhafter Zustand braucht ein zweites Zeichen]]
