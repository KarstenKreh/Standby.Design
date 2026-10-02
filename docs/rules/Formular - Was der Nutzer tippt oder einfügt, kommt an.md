---
dateCreated: 2026-10-02
description: "Einfügen ist nie gesperrt, und ein Feld schluckt nie still Zeichen. Normalisiert wird erst beim Verlassen und sichtbar."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - formular
---

# Was der Nutzer tippt oder einfügt, kommt an

> [!TIP] Regel
> Sperr nie das Einfügen und verändere eine Eingabe nie stillschweigend.

## Warum

Ein verschlucktes Zeichen ist ein Fehler, den der Nutzer nicht sieht. Aus eingefügtem „1.250,00 €" wird dann still „125000".

## Woran Du den Verstoß erkennst

- `onPaste` mit `preventDefault()`.
- Ein `onChange`, der Zeichen herausfiltert.
- `maxLength`, das ohne Zähler abschneidet.
- Ein Code-Feld, das eingefügte Codes nicht verteilt.

## Hart und weich

Hart.

## Grenzen

Das Feld darf beim Verlassen sichtbar normalisieren, etwa Leerzeichen am Rand entfernen oder eine IBAN gruppieren.

## Quelle

Vercel › Forms („Never block paste", „Accept free text, validate after—don't block typing", „allow pasting codes"). WCAG 3.3.8 Accessible Authentication (Minimum).

## Verwandt

- [[Formular - Der Nutzer tippt nur, was das System nicht weiß]]
- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
