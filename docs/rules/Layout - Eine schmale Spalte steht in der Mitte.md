---
dateCreated: 2026-10-02
description: "Ist der Inhalt schmaler als die Fläche, steht die Spalte in der Mitte. Zurück, Titel und Aktionen stehen an ihrer Kante."
type: design-rule
scope: universal
applies-to:
  - web
status: active
default: 48rem für Formulare
tags:
  - design-system
  - design-rule
  - layout
---

# Eine schmale Spalte steht in der Mitte

> [!TIP] Regel
> Ist der Inhalt einer Ansicht schmaler als die Inhaltsfläche, setz die Spalte in deren Mitte. Was zur Spalte gehört, also Zurück, Titel und Aktionen, steht an ihren Kanten und nicht an der Kante der Seite.

## Warum

Der Nutzer sitzt mittig vor seinem Bildschirm, und sein Blick landet zuerst in der Mitte. Auf einem breiten Bildschirm liegt eine linksbündige Spalte am Rand seines Blickfelds, und er muss zum Lesen nach links schauen, während in der Mitte nichts steht.

Dazu bleibt rechts eine leere Fläche, die wie fehlender Inhalt aussieht. Auf breiten Bildschirmen wird sie größer als die Spalte selbst. In der Mitte liest sich dieselbe Leere als Rand, und die Lesebreite bleibt gleich.

Steht der Zurück-Knopf dagegen an der Seitenkante und das Formular in der Mitte, entstehen zwei Kanten ohne Bezug. Der Knopf gehört zur Spalte, also steht er an ihrer Kante.

## Hart und weich

| | Status |
|---|---|
| Eine schmale Spalte steht in der Mitte der Inhaltsfläche, nicht des Fensters | hart |
| Begleitende Elemente richten sich an der Spalte aus | hart |
| Die Breite der Spalte | weich, Vorgabe 48rem für Formulare |

## Woran Du den Verstoß erkennst

- Eine Spalte hat eine maximale Breite, aber keinen automatischen Rand links und rechts.
- Zurück steht links an der Seite, das Formular darunter in der Mitte.
- Die leere Fläche rechts ist breiter als der Inhalt.

## Richtig / falsch

```
        RICHTIG                             FALSCH

  │      ‹ Zurück             │       │ ‹ Zurück                  │
  │      ┌───────────┐        │       │ ┌───────────┐             │
  │      │ Formular  │        │       │ │ Formular  │             │
  │      └───────────┘        │       │ └───────────┘             │
         ^ eine Kante                   rechts leer, wirkt halb fertig
```

## Grenzen

Ansichten, die die Breite füllen (Tabellen, Raster, Dashboards), betrifft das nicht. Gehört eine Seitenleiste zur Ansicht selbst, etwa ein Inhaltsverzeichnis, steht die Spalte neben ihr.

Das ist keine Ausnahme zu [[Layout - Weniger Kanten, ruhigere Ansicht]]. Die Spalte steht in der Mitte, ihr Inhalt bleibt linksbündig.

## Verwandt

- [[Layout - Weniger Kanten, ruhigere Ansicht]]
- [[Layout - Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um]]
