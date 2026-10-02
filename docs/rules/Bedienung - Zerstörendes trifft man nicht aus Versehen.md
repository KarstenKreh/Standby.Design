---
dateCreated: 2026-10-02
description: "Zerstörendes steht nie neben dem Häufigen. Im Dialog davor liegt der Fokus auf Abbrechen, und der Dialog nennt Gegenstand und Folge."
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
  - fluss
---

# Zerstörendes trifft man nicht aus Versehen

> [!TIP] Regel
> Stell eine zerstörende Handlung nie direkt neben die häufigste und nie an den Platz des Hauptknopfs. Im Dialog vor einer unumkehrbaren Handlung liegt der Fokus auf dem sicheren Knopf, die zerstörende Handlung ist nie die Standardtaste, und der Dialog nennt Gegenstand und Folge.

## Warum

Was nah und groß ist, trifft man schnell, auch aus Versehen. Wer zehnmal am Tag auf „Speichern“ klickt, trifft beim elften Mal den Nachbarn.

Wer Enter drückt, um ein Fenster wegzuklicken, soll dabei nichts löschen.

Der Dialog nennt dazu den Gegenstand und die Folge, und die Knöpfe nennen die Handlung: „‚Projekt Alpha‘ löschen?“ mit „Löschen“ und „Abbrechen“. Der Nutzer soll nicht erinnern müssen, worauf er geklickt hat.

## Hart und weich

Hart: getrennt durch Ort oder deutlichen Abstand. Weich: wie. Vorgabe: Löschen an der gegenüberliegenden Kante oder im Menü der Zeile.

Hart: die zerstörende Handlung ist nie Standard. Weich: ob der Fokus auf „Abbrechen" oder auf dem Dialog selbst liegt. Vorgabe „Abbrechen".

## Woran Du den Verstoß erkennst

- „Löschen“ direkt neben „Speichern“, ohne Abstand.
- „Löschen“ steht rechts unten, wo auf allen anderen Seiten „Speichern“ steht.
- „Alle entfernen“ neben „Hinzufügen“.
- `autoFocus` auf „Löschen".
- Enter im Dialog löst die zerstörende Handlung aus.
- Der Löschknopf ist der `type="submit"` im Dialog-Formular.
- „Sind Sie sicher?“ ohne Namen des Gegenstands. Knöpfe „Ja“ und „Nein“ oder „OK“.

## Grenzen

Der Bestätigungsdialog. Dort steht „Löschen“ bewusst neben „Abbrechen“, und [[Bedienung - Zerstörendes trifft man nicht aus Versehen]] regelt den Fokus.

Der Nutzer hat die Handlung eben selbst gewählt und sie ist umkehrbar. Dann gilt Rückgängig statt Dialog, siehe die Fehler-Regel.

## Quelle

Laws of UX › Fitts’s Law, https://lawsofux.com/fittss-law/ Nielsen Norman Group › 10 Usability Heuristics, Nr. 6 Recognition rather than recall. APG › Dialog (Modal) Pattern („set focus on the least destructive action"). Apple HIG › Alerts („include a Cancel button to give people a clear, safe way").

## Verwandt

- [[Bedienung - Gewicht ist ein Budget, ein Primary pro Ansicht]]
- [[Fluss - Ein Pop-up unterbricht, es führt nicht]]
- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
- [[Bedienung - Der Fokus ist sichtbar und hat immer einen Ort]]
