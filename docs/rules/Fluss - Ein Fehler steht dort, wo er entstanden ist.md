---
dateCreated: 2026-08-27
description: Eine Meldung erscheint an der Stelle, die sie betrifft, sagt was zu tun ist, und die Eingaben des Nutzers bleiben erhalten.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - fluss
---

# Ein Fehler steht dort, wo er entstanden ist

> [!TIP] Regel
> Zeige einen Fehler an der Stelle, die er betrifft — beim Feld das Feld, beim Bereich der Bereich. Sag, was zu tun ist, nicht was kaputt gegangen ist. Und lass die Eingaben des Nutzers stehen.

## Warum

Ein Fehler ist eine Anweisung, keine Meldung. Der Nutzer will nicht wissen, was das System nicht konnte, sondern was er jetzt macht. „Ungültiges Format" sagt ihm nichts. „Bitte im Format TT.MM.JJJJ eingeben" sagt ihm alles.

Deshalb muss er auch dort stehen, wo gehandelt wird. Steht der Fehler weit weg von dem Feld, das er betrifft, muss der Nutzer die Verbindung selbst herstellen — bei drei Fehlern in einem Formular ist das eine Suchaufgabe.

Und das Wichtigste, das am häufigsten verletzt wird: **die Eingaben bleiben.** Ein Fehler, der das Formular leert, bestraft den Nutzer für einen Tippfehler. Nach dem zweiten Mal macht er nicht weiter.

## Wo eine Meldung hingehört

| Was passiert ist | Wo es steht |
|---|---|
| Eine Eingabe stimmt nicht | am Feld, direkt darunter, mit dem Feld markiert |
| Ein Bereich konnte nicht laden | im Bereich, an der Stelle des Inhalts, mit „nochmal versuchen" |
| Eine Aktion ist gelungen, das Ergebnis sieht man nicht | Kurzmeldung, die von selbst geht |
| Etwas ist außerhalb des Blicks passiert | Kurzmeldung |
| Der Nutzer ist im Begriff, etwas zu verlieren | Pop-up, siehe [[Fluss - Ein Pop-up unterbricht, es führt nicht]] |

Kein Pop-up für Eingabefehler. Das Pop-up nimmt genau das Formular weg, in dem der Nutzer den Fehler beheben soll.

## Kurzmeldungen

Eine Kurzmeldung (Toast) ist ein gutes Werkzeug, wenn sie das Richtige tut: bestätigen, dass etwas passiert ist, dessen Ergebnis man gerade nicht sieht. Gespeichert, verschickt, in den Papierkorb gelegt.

Dafür gelten drei Bedingungen:

- Sie blockiert nichts und verlangt nichts. Wer sie übersieht, verliert nichts.
- Sie ist nie der einzige Ort einer wichtigen Information. Was der Nutzer später noch braucht, gehört an eine bleibende Stelle.
- Sie erscheint nicht für einen Fehler, den man an einem Feld beheben kann. Der gehört ans Feld.

Ist eine Handlung rückgängig zu machen, gehört das Angebot dazu in die Kurzmeldung („Gelöscht — rückgängig"). Das ist ihr stärkster Einsatz, weil sie damit eine Bestätigung vorher überflüssig macht.

## Was in einer Meldung steht

- Was der Nutzer tun kann, in seiner Sprache.
- Kein Fehlercode, kein technischer Wortlaut, keine Meldung aus dem System durchgereicht.
- Keine Schuldzuweisung, weder an ihn noch an das System.
- Bei einem Fehler, der nicht in seiner Hand liegt: was gerade gilt und wann er es erneut versuchen kann.

## Woran Du den Verstoß erkennst

- Ein Eingabefehler erscheint als Pop-up.
- Alle Fehler eines Formulars stehen gesammelt oben statt bei den Feldern.
- Das Formular ist nach einem Fehler leer.
- Eine technische Meldung steht ungefiltert in der Oberfläche.
- Eine Kurzmeldung trägt eine Information, die der Nutzer später wieder braucht.
- Es gibt eine Bestätigungsfrage für etwas, das man auch rückgängig machen könnte.

## Grenzen

Fehler, die die ganze Anwendung betreffen — keine Verbindung, abgelaufene Anmeldung —, gehören an eine Stelle, die über allem liegt. Sie betreffen kein einzelnes Feld, und der Nutzer muss sie sehen, bevor er weitertippt.

## Verwandt

- [[Fluss - Ein Pop-up unterbricht, es führt nicht]]
- [[Fluss - Leer ist ein Zustand, keine Lücke]]
- [[Zustand - Rot ist nicht ein Rot]]
