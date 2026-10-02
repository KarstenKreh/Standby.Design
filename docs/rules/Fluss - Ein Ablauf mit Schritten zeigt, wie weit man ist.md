---
dateCreated: 2026-10-02
description: "Ein mehrstufiger Ablauf zeigt, wie weit man ist, etwa als Fortschrittsbalken. Zurück verliert keine Eingabe."
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

# Ein Ablauf mit Schritten zeigt, wie weit man ist

> [!TIP] Regel
> Zeig in jedem Ablauf über mehrere Schritte, wie weit der Nutzer ist, und lass auf jedem Schritt zurück, ohne dass eine Eingabe verloren geht.

## Warum

Wer nicht weiß, wie viel noch kommt, bricht eher ab. Wer zurückgeht und alles neu tippen muss, bricht sicher ab.

## Woran Du den Verstoß erkennst

- Mehrstufiges Formular ohne Fortschrittsanzeige.
- Zurück leert die Felder.
- Es gibt nur den Zurück-Knopf des Browsers, und der verlässt den Ablauf.

## Hart und weich

Hart: der Fortschritt ist sichtbar, Zurück ohne Verlust. Weich: wie der Fortschritt aussieht. Ein Fortschrittsbalken reicht, ausgeschriebene Schritte sind nicht nötig.

## Grenzen

Abläufe mit einem Schritt. Hängt die Länge von den Antworten ab, zeigt die Anzeige den Fortschritt nach dem, was bekannt ist.

## Quelle

Laws of UX › Zeigarnik Effect und Goal-Gradient Effect, https://lawsofux.com/

## Verwandt

- [[Fluss - Ein Pop-up unterbricht, es führt nicht]]
- [[Fluss - Der Platz ist da, bevor die Daten kommen]]
- [[Fluss - Der Zustand der Ansicht steht in der Adresse]]
