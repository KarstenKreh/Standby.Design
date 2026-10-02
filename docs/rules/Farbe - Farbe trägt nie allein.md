---
dateCreated: 2026-08-27
description: "Zustände und Datenreihen haben neben der Farbe ein zweites Merkmal."
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
  - daten
---

# Farbe trägt nie allein

> [!TIP] Regel
> Zeige jeden dauerhaften Zustand und jede Datenreihe neben der Farbe mit einem zweiten Merkmal. Bei Zuständen ist es Position, Strich, Balken, Punkt oder Unterstreichung, und es gehört zum Element. Bei Datenreihen ist es eine direkte Beschriftung, die Form der Marker oder die Strichart.

## Warum

Rund jeder zwölfte Mann sieht Rot und Grün nicht auseinander. Für ihn ist ein aktiver Tab, der sich nur durch die Textfarbe auszeichnet, kein aktiver Tab, sondern einer von fünf gleichen. Dasselbe gilt bei starkem Sonnenlicht, auf schlecht kalibrierten Bildschirmen und bei jedem, der die Ansicht nur kurz überfliegt.

Das zweite Zeichen kostet nichts. Es ist ohnehin da, sobald das Element sauber gebaut ist: der Knopf des Switch steht rechts, unter dem Tab liegt ein Strich, vor dem Chip sitzt ein Punkt. Der Fehler entsteht nur, wenn ein Zustand nachträglich „schnell über die Farbe" gelöst wird.

Für einen von zwölf Männern sehen Rot und Grün gleich aus. Eine Legende nur aus Farbfeldern ist für ihn leer.

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

## Hart und weich

Hart: ein zweites Merkmal. Weich: welches. Vorgabe direkte Beschriftung am Ende der Linie.

## Woran Du den Verstoß erkennst

- Der aktive Tab unterscheidet sich nur in der Textfarbe.
- Eine ausgewählte Kachel ist nur farblich hervorgehoben.
- In Graustufen ist nicht mehr erkennbar, welches Element an ist. Das ist der schnellste Test.
- Legende nur aus Farbkästchen.
- Zwei Linien, die sich nur im Farbton unterscheiden.
- Kreisdiagramm ohne Beschriftung an den Stücken.
- Benachbarte Reihen unter 3:1 zueinander.

## Grenzen

Für kurzzeitige Zustände wie Hover gilt die Regel nicht. Hover ist eine Rückmeldung auf eine Handlung, die gerade passiert, und der Nutzer weiß bereits, wo er ist.

Diagramme mit genau einer Reihe.

## Quelle

WCAG 1.4.1 Use of Color, 1.4.11 Non-text Contrast. Vercel › Design („Accessible charts").

## Verwandt

- [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]]
- [[Zustand - Rot ist nicht ein Rot]]
- [[Farbe - Kontrast hat eine Untergrenze]]
- [[Zustand - Eine Bedeutung, überall gleich]]
