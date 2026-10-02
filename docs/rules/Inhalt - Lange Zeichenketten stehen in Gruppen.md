---
dateCreated: 2026-10-02
description: "IBAN, Telefonnummern und Codes stehen in Gruppen. Kopiert wird ohne Trennzeichen."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - inhalt
---

# Lange Zeichenketten stehen in Gruppen

> [!TIP] Regel
> Zeig IBAN, Telefonnummern, Codes und andere lange Zeichenketten in Gruppen an und gib sie beim Kopieren ohne Trennzeichen heraus.

## Warum

22 Zeichen am Stück kann niemand vergleichen oder abtippen. In Vierergruppen findet das Auge seinen Platz wieder.

## Woran Du den Verstoß erkennst

- IBAN als eine lange Zeile.
- Telefonnummer ohne Leerzeichen.
- Achtstelliger Code am Stück.
- Kopieren liefert die Leerzeichen mit.

## Hart und weich

Hart: gruppiert in der Anzeige, ohne Trennzeichen beim Kopieren. Weich: die Gruppengröße. Vorgabe: die Norm des Formats, sonst Vierergruppen.

## Grenzen

Werte, die nur kopiert und nie gelesen werden, etwa lange Schlüssel. Die bekommen einen Kopierknopf.

## Quelle

Laws of UX › Chunking, https://lawsofux.com/chunking/

## Verwandt

- [[Formular - Was der Nutzer tippt oder einfügt, kommt an]]
- [[Typografie - Zahlenspalten stehen rechtsbündig]]
