---
dateCreated: 2026-10-02
description: "Bevor eine Sitzung abläuft, warnt die Ansicht und bietet Verlängern an. Nach einer neuen Anmeldung sind die Eingaben noch da."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
default: Warnung zwei Minuten vor Ablauf
tags:
  - design-system
  - design-rule
  - fluss
---

# Eine Zeitgrenze warnt vorher

> [!TIP] Regel
> Warne vor dem Ablauf jeder Zeitgrenze, biete eine Verlängerung an und bewahre die Eingaben über eine neue Anmeldung hinweg.

## Warum

Wer langsam tippt oder kurz weg ist, verliert sonst seine Arbeit an eine Uhr, die er nicht sieht.

## Woran Du den Verstoß erkennst

- Abmeldung ohne Hinweis vorher.
- Nach dem neuen Login ist das Formular leer.
- Ein Angebot oder Schritt läuft ab, ohne dass die Ansicht es ankündigt.

## Hart und weich

Hart: Warnung, Verlängerung, Eingaben bleiben. Weich: wann gewarnt wird. Vorgabe zwei Minuten vorher.

## Grenzen

Echtzeit-Vorgänge wie Auktionen. Zeitgrenzen über 20 Stunden.

## Quelle

WCAG 2.2.1 Timing Adjustable, 2.2.5 Re-authenticating, 2.2.6 Timeouts.

## Verwandt

- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
- [[Fluss - Was vorweg angezeigt wird, wird bei Fehler zurückgenommen]]
