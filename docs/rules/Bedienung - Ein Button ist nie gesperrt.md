---
dateCreated: 2026-10-02
description: Kein Button wird ausgegraut. Er bleibt aktiv und zeigt beim Klick, was fehlt, oder er wird durch die Handlung ersetzt, die die Sperre löst. Gesperrt nur, während eine Anfrage läuft.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - bedienung
---

# Ein Button ist nie gesperrt

> [!TIP] Regel
> Graue keinen Button aus. Fehlt etwas, bleibt er aktiv und zeigt beim Klick, was fehlt. Steht etwas Grundsätzliches im Weg, wird er durch die Handlung ersetzt, die es löst. Gesperrt ist er nur, solange eine Anfrage läuft.

## Warum

Ein ausgegrauter Button ist eine Sackgasse ohne Erklärung. Der Nutzer sieht, dass er nicht weiterkommt, aber nicht warum. Er sucht das Formular nach dem fehlenden Häkchen ab, oder er gibt auf.

Ein aktiver Button beantwortet die Frage beim Klick. Das fehlende Feld markiert sich, die Meldung sagt, was zu tun ist, und der Fehler verschwindet, sobald das Feld stimmt. Das ist derselbe Weg wie in [[Fluss - Ein Fehler steht dort, wo er entstanden ist]].

Steht kein Feld im Weg, sondern eine Grenze, etwa ein volles Kontingent oder ein fehlender Tarif, ist der gesperrte Button die falsche Handlung am richtigen Ort. „Mitglied einladen“ wird dann zu „Mehr Plätze buchen“. Der Nutzer sieht sofort, was ihn weiterbringt.

Die eine Sperre, die bleibt, schützt vor doppeltem Absenden. Während die Anfrage läuft, ist ein zweiter Klick nie gewollt.

## Die Fälle

| Fall | Was passiert |
|---|---|
| Eine Eingabe fehlt oder stimmt nicht | Button bleibt aktiv. Beim Klick markiert sich das Feld, die Meldung sagt, was fehlt |
| Eine Grenze steht im Weg (Kontingent, Tarif, Frist) | Button wird durch die Handlung ersetzt, die die Grenze löst |
| Eine Anfrage läuft | Button gesperrt, Ladezeichen neben der Beschriftung, Beschriftung bleibt |
| Der Nutzer hat kein Recht zu dieser Handlung | Button wird nicht gezeigt |

## Hart und weich

| | Status |
|---|---|
| Kein Button ist gesperrt, außer während einer Anfrage | hart |
| Beim Klick auf einen unvollständigen Stand zeigt die Ansicht, was fehlt | hart |
| Ohne Recht wird die Handlung nicht gezeigt, nicht ausgegraut | hart |
| Wie der Fehler erscheint | weich, Vorgabe am Feld nach [[Fluss - Ein Fehler steht dort, wo er entstanden ist]] |

## Woran Du den Verstoß erkennst

- `disabled={!isValid}`, `disabled={!isDirty}` oder `disabled={!accepted}` an einem Button.
- Ein ausgegrauter Button ohne Erklärung in der Nähe.
- Ein Button ohne Recht ist grau statt weg.
- Das Ladezeichen ersetzt die Beschriftung, oder der Button bleibt während der Anfrage klickbar.
- Ein Feld, das nur einen Wert anzeigt, ist als gesperrtes Eingabefeld gebaut. Dann lässt sich der Wert nicht kopieren, und der Screenreader überspringt ihn.

## Grenzen

Steht der Grund unmittelbar neben dem Button und ist ohne Lesen zu sehen, darf er gesperrt sein. Das Beispiel ist der Senden-Knopf neben einem leeren Chatfeld.

Ein Wert, den man sehen, aber nicht ändern darf, ist kein gesperrtes Feld, sondern Text. Er steht lesbar und kopierbar da, ohne Rahmen und ohne Bedienzeichen.

Sperren, die sich aus dem Bild erklären, bleiben erlaubt: „Zurück“ auf der ersten Seite, „Weiter“ auf der letzten.

## Quelle

Vercel Web Interface Guidelines › Forms („Don’t pre-disable submit“, „Keep submit enabled until submission starts“, „Loading buttons show spinner and keep original label“). Carbon › Patterns › Disabled states (Disabled, Read-only, Hidden).

## Verwandt

- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
- [[Formular - Was der Nutzer tippt oder einfügt, kommt an]]
