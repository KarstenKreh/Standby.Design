---
dateCreated: 2026-10-02
description: "Höchstens ein Primary pro Ansicht und Zustand. Jeder Button nennt eine Handlung, nie einen Zustand."
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
---

# Gewicht ist ein Budget, ein Primary pro Ansicht

> [!TIP] Regel
> Gib jeder Ansicht und jedem ihrer Zustände höchstens einen Primary-Button, für die Hauptaufgabe. Alles andere ist leiser. Jeder Button sagt mit Verb und Gegenstand, was beim Klick passiert. Ein Zustand steht neben dem Knopf, nicht auf ihm.

## Warum

Gewicht ist ein Budget. Jeder laute Button macht den wichtigen leiser, und eine Ansicht mit drei gefüllten Buttons sagt dem Nutzer nicht mehr, wo es weitergeht.

Eine Beschriftung wie „Keine Änderungen“ macht aus dem Knopf eine Anzeige. Der Nutzer kann nicht vorhersagen, was ein Klick auslöst. Wechselt die Beschriftung mit dem Zustand, springt außerdem die Breite des Knopfes.

„Speichern“ allein reicht, solange die Seite nur einen Gegenstand hat. Gibt es mehrere, nennt der Knopf seinen: „Fehlzeiten speichern“. Eine Menge darf dabei stehen, weil sie den Umfang der Handlung beschreibt: „3 Monate speichern“.

## Die Stufen

| Stufe | Wofür |
|---|---|
| primary | die Hauptaufgabe: einziger Weg weiter, Abschluss eines Ablaufs |
| secondary | eine echte Aktion, die nicht das Ziel der Ansicht ist |
| outline | der Standard: Optionen, die man nutzen kann, aber nicht muss |
| ghost | Nebensächliches, Zurück, Werkzeuge in dichten Leisten |
| destructive | Löschen und Unumkehrbares |

## Hart und weich

| | Status |
|---|---|
| Höchstens ein Primary pro Ansicht und Zustand | hart |
| Die Beschriftung ist eine Handlung, kein Zustand | hart |
| Die Stufen sind eine geschlossene Menge, der Standard ist eine leise Stufe | hart |
| Wie viele Stufen und welcher Wortlaut | weich, Vorgabe die fünf Stufen oben |

## Woran Du den Verstoß erkennst

- In einer Ansicht stehen zwei gefüllte Buttons.
- Die Beschriftung beschreibt einen Zustand: „Keine Änderungen“, „Gespeichert“, „Fertig“.
- Eine Nebenaufgabe in der Werkzeugleiste trägt die Primary-Farbe.
- Ein Button ohne Angabe fällt auf Primary zurück statt auf die leise Standardstufe.

## Grenzen

Ein Dialog ist eine eigene Ansicht und hat seinen eigenen Primary. Eine Bestätigung zum Löschen trägt die destruktive Stufe, nicht Primary.

Gibt es nichts zu speichern, bleibt der Knopf derselbe und aktiv, siehe [[Bedienung - Ein Button ist nie gesperrt]]. Den Zustand sagt die Ansicht daneben.

## Verwandt

- [[Bedienung - Klickbares hat eine Fläche, und nur Klickbares sieht so aus]]
- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
- [[Farbe - Farbe trägt nie allein]]
