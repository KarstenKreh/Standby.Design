---
dateCreated: 2026-10-02
description: "Zeigt die Ansicht eine Änderung schon vor der Antwort des Servers, nimmt sie sie bei einem Fehler sichtbar zurück. Dazu sagt sie, dass es nicht geklappt hat."
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

# Was vorweg angezeigt wird, wird bei Fehler zurückgenommen

> [!TIP] Regel
> Nimm eine Änderung, die Du vor der Antwort des Servers angezeigt hast, bei einem Fehler sichtbar zurück und sag dazu, dass es nicht geklappt hat.

## Warum

Sonst glaubt der Nutzer, es sei gespeichert. Den Unterschied merkt er erst beim nächsten Laden, wenn er nicht mehr weiß, was er getan hat.

## Woran Du den Verstoß erkennst

- Optimistisches Setzen des Zustands ohne `catch` und ohne Rücknahme.
- Fehler landet nur in der Konsole.
- Nach dem Fehler steht der neue Wert weiter da.

## Hart und weich

Hart.

## Grenzen

Änderungen, die erst nach der Antwort angezeigt werden.

## Quelle

Vercel Web Interface Guidelines › Interactions („Optimistic updates … On failure, show an error & roll back or provide Undo").

## Verwandt

- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
- [[Fluss - Der Platz ist da, bevor die Daten kommen]]
- [[Fluss - Eine Zeitgrenze warnt vorher]]
