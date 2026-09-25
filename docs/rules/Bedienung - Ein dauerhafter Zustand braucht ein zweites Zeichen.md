---
dateCreated: 2026-08-27
description: Farbe allein ist für farbenblinde Nutzer unsichtbar. Jeder dauerhafte Zustand trägt zusätzlich ein Zeichen aus der Form.
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
  - accessibility
---

# Ein dauerhafter Zustand braucht ein zweites Zeichen

> [!TIP] Regel
> Zeige jeden dauerhaften Zustand neben der Farbe mit einem zweiten Merkmal: Position, Strich, Balken, Punkt, Unterstreichung. Das Zeichen gehört zum Element. Es wird nicht an jedem Einsatzort neu erfunden.

## Warum

Rund jeder zwölfte Mann sieht Rot und Grün nicht auseinander. Für ihn ist ein aktiver Tab, der sich nur durch die Textfarbe auszeichnet, kein aktiver Tab, sondern einer von fünf gleichen. Dasselbe gilt bei starkem Sonnenlicht, auf schlecht kalibrierten Bildschirmen und bei jedem, der die Ansicht nur kurz überfliegt.

Das zweite Zeichen kostet nichts. Es ist ohnehin da, sobald das Element sauber gebaut ist: der Knopf des Switch steht rechts, unter dem Tab liegt ein Strich, vor dem Chip sitzt ein Punkt. Der Fehler entsteht nur, wenn ein Zustand nachträglich „schnell über die Farbe" gelöst wird.

## Woran Du den Verstoß erkennst

- Der aktive Tab unterscheidet sich nur in der Textfarbe.
- Eine ausgewählte Kachel ist nur farblich hervorgehoben.
- In Graustufen ist nicht mehr erkennbar, welches Element an ist. Das ist der schnellste Test.

## Die Zeichen je Element

| Element | Zweites Zeichen |
|---|---|
| Switch | Position des Knopfs |
| Tab | Strich darunter |
| Chip | Punkt vorn |
| Navigations-Zeile | Balken links |
| Fließtext-Link | verdickte Unterstreichung |
| Button, Icon-Button | — (kein dauerhafter Zustand) |
| Eingabefeld | — (der Zustand steht in Rand und Meldung) |
| Badge | — (nicht bedienbar) |

Wo ein Strich steht, hat das Element einen dauerhaften Zustand und braucht das Zeichen. Wo keiner steht, hat es keinen.

## Grenzen

Für kurzzeitige Zustände wie Hover gilt die Regel nicht. Hover ist eine Rückmeldung auf eine Handlung, die gerade passiert, und der Nutzer weiß bereits, wo er ist.

## Verwandt

- [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]]
- [[Zustand - Rot ist nicht ein Rot]]
