---
dateCreated: 2026-08-27
description: Kein bg-primary/10. Für hellere und dunklere Abstufungen gibt es benannte Stufen, für Hover eine Helligkeitsänderung.
type: design-rule
scope: stack
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - stack
  - farbe
---

# Keine Deckkraft-Modifier auf semantischen Farben

> [!TIP] Regel
> Schreibe nie `bg-primary/10`, `text-destructive/60` oder Ähnliches. Für Abstufungen gibt es benannte Stufen, für Hover eine Helligkeitsänderung (`brightness-110`).

## Warum

Eine semantische Farbe steht für eine Bedeutung. Ein Zehntel davon steht für gar nichts — es ist eine neue Farbe ohne Namen, ohne Definition und ohne Eintrag im System. Sie lässt sich nicht wiederverwenden, weil niemand weiß, dass es sie gibt, und sie taucht beim nächsten Mal als `/12` wieder auf.

Es geht dabei nicht um Durchsichtigkeit an sich. Ein System darf mit Glas und Schleier arbeiten, wenn das seine Handschrift ist. Es geht um die beiläufige Variante: eine Deckkraft, die an einer einzelnen Stelle gesetzt wird, weil es dort gerade passte. Der Unterschied ist, ob jemand eine Materialentscheidung getroffen hat oder eine Korrektur im Vorbeigehen.

Für den häufigsten Anlass — eine gedämpfte Variante für Chips und Badges — gibt es die gedämpften Stufen der Zustandsfarben. Für den zweithäufigsten — Hover — gibt es eine Helligkeitsänderung, die auf jedem Untergrund in dieselbe Richtung wirkt.

## Woran Du den Verstoß erkennst

- Ein Schrägstrich hinter einer semantischen Farbklasse.
- Ein Badge aus `bg-danger/10 text-danger`.
- Hover ist als `hover:bg-primary/90` gebaut.

## Richtig / falsch

```
richtig    bg-muted · text-muted-foreground
           die gedämpfte Stufe plus die zugehörige Schriftfarbe
           hover:brightness-110

falsch     bg-primary/10
           text-destructive/60
           hover:bg-primary/90
```

## Grenzen

Deckkraft auf einer **Ebene** ist etwas anderes als Deckkraft auf einer Farbe: ein ausgeblendetes Overlay, ein Bild beim Laden, ein Element im Übergang. Dort ist Deckkraft die richtige Eigenschaft, weil sie das ganze Element betrifft und nicht eine Farbe erfindet.

## Verwandt

- [[Zustand - Rot ist nicht ein Rot]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
