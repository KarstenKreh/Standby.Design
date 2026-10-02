---
dateCreated: 2026-10-02
description: "Ab einer festen Zahl von Einträgen hat eine Auswahl eine Suche oder Gruppen. Vorgabe ab 10."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
korridor: 7-15 Einträge
default: Suche ab 10 Einträgen
tags:
  - design-system
  - design-rule
  - bedienung
---

# Eine lange Auswahl lässt sich durchsuchen

> [!TIP] Regel
> Gib jeder Auswahl ab einer festen Zahl von Einträgen eine Suche oder teil sie in benannte Gruppen.

## Warum

Jede weitere Option verlängert die Entscheidung. Bei 200 Ländern sucht niemand mit den Augen, er tippt.

## Woran Du den Verstoß erkennst

- Auswahl mit 200 Ländern ohne Tippsuche.
- Menü mit 25 Einträgen ohne Gruppen.
- Eine Liste von Personen ohne Suchfeld.

## Hart und weich

Hart: ab einer Schwelle gibt es Suche oder Gruppen, als Token. Weich: die Schwelle, Korridor 7 bis 15, Vorgabe 10.

## Grenzen

Natürlich geordnete Reihen wie Jahre oder Zahlen, in denen man per Tastatur springt.

## Quelle

Laws of UX › Hick’s Law und Choice Overload, https://lawsofux.com/hicks-law/

## Verwandt

- [[Formular - Was ein Feld beschreibt, steht im Feld]]
- [[Stack - Was der Browser mitbringt, wird gestaltet oder ersetzt]]
