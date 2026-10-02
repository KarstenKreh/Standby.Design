---
dateCreated: 2026-08-27
description: "Eine Handlung hat einen Namen und ein Icon, ein Wert eine Grenze für gut, mittel und schlecht, überall im Produkt."
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

# Eine Bedeutung, überall gleich

> [!TIP] Regel
> Leg jede Bedeutung einmal fest und halte sie im ganzen Produkt gleich. Eine Handlung hat überall denselben Namen und dasselbe Icon, und ein Icon steht nie für zwei Handlungen. Ein Wert hat überall dieselbe Grenze für gut, mittel und schlecht, und fehlt er, ist der Zustand neutral.

## Warum

Liest der Nutzer hier „Entfernen" und dort „Löschen", fragt er sich, ob es dasselbe ist.

Bekannte Zeichen behalten dabei die Bedeutung, die sie außerhalb des Produkts haben: Lupe heißt Suche, Zahnrad heißt Einstellungen, X heißt Schließen, das Logo führt zur Startseite. Der Nutzer bringt diese Bedeutung mit und lernt sie nicht neu.

Dasselbe gilt für den Weg zur Hilfe. Er muss nicht auf jeder Seite stehen, ein Platz im Profil reicht. Aber wo es ihn gibt, steht er immer an derselben Stelle.

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

## Hart und weich

Hart: eins zu eins. Weich: welche Wörter und Icons. Das legt das Projekt fest.

## Woran Du den Verstoß erkennst

- „Speichern", „Sichern" und „Übernehmen" für dieselbe Handlung.
- Mülleimer und X für Löschen.
- X für Schließen und für Löschen.
- Die Lupe öffnet einen Zoom, das Zahnrad öffnet Filter, oder ein Klick aufs Logo tut nichts.
- Hilfe oder Kontakt stehen mal im Kopf, mal in der Fußzeile, mal im Profil.
- Zwei Ansichten zeigen denselben Wert in verschiedenen Farben.
- Der Vergleich mit einer Grenze steht in mehr als einer Datei.
- Eine neue Anzeige bekommt ihre Grenzen mitgegeben, statt sie zu erfragen.
- Ein fehlender Wert wird zu null gemacht und dann eingefärbt.
- Ein Feld ohne Daten ist grün, weil „kein Problem gemeldet" als gut gewertet wird.
- Eine Kennzahl zeigt einen Strich und trotzdem einen farbigen Rand oder ein farbiges Badge.

## Grenzen

Handlungen, die wirklich verschieden sind, etwa aus einer Liste entfernen und endgültig löschen. Die heißen bewusst verschieden.

Eine Kennzahl mit fachlich eigenen Grenzen — eine gesetzliche Quote, ein vertraglicher Schwellwert — bekommt ihre Werte natürlich von dort. Sie geht trotzdem durch dieselbe Übersetzung, damit der Weg von der Zahl zur Farbe an einer Stelle bleibt.

Ein leerer Zustand darf erklären, warum nichts da ist, und einen Weg anbieten („Noch keine Buchungen — Import starten"). Neutral heißt grau, nicht wortlos.

## Quelle

Laws of UX › Jakob’s Law, https://lawsofux.com/jakobs-law/. WCAG 3.2.4 Consistent Identification, 3.2.3 Consistent Navigation.

## Verwandt

- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
- [[Zustand - Rot ist nicht ein Rot]]
- [[Farbe - Farbe trägt nie allein]]
