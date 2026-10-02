---
dateCreated: 2026-10-02
description: "Icon, Einheit und Vorzeichen stehen im Rahmen des Feldes. Beschreibendes vorn oder hinten wie gesprochen, Handelndes am Ende."
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

# Was ein Feld beschreibt, steht im Feld

> [!TIP] Regel
> Setz Icon, Einheit und Vorzeichen, die zu einem Feld gehören, in den Rahmen des Feldes. Was den Inhalt beschreibt, steht an der Stelle, an der man es auch spricht: die Lupe und das Vorzeichen vorn, Euro und Prozent hinten. Was etwas mit dem Feld tut, steht am Ende: Kalender öffnen, leeren, Passwort zeigen. Nichts steht dazwischen und nichts außerhalb.

## Warum

Ein Icon außerhalb des Rahmens liest sich als eigenes Element. Der Blick muss raten, ob es ein Knopf ist, eine Überschrift oder Schmuck. Im Rahmen gehört es zum Feld, weil der Rahmen die Gruppe ist.

Die Einheit im Feld spart Arbeit an zwei Stellen. Der Nutzer tippt nur die Zahl und sieht trotzdem, was sie meint. Und niemand tippt das Euro-Zeichen mit, das die Prüfung danach wieder herausrechnen muss.

Die feste Stelle zählt genauso. Ein Icon, das hinter dem Text herläuft, wandert mit jeder Eingabe und bildet in einer Reihe von Feldern keine gemeinsame Kante. So baut es das native Datumsfeld mancher Browser.

## Hart und weich

| | Status |
|---|---|
| Icon, Einheit und Vorzeichen stehen im Rahmen des Feldes | hart |
| Beschreibendes vorn oder hinten wie gesprochen, Handelndes am Ende | hart |
| Ein Knopf im Feld ist das innere Element und hat den konzentrischen Radius | hart |
| Abstand zwischen Icon und Text | weich, Vorgabe die kleinste Abstandsstufe |

## Woran Du den Verstoß erkennst

- Ein Icon steht neben dem Feld statt darin.
- Die Einheit steht als eigenes Wort hinter dem Rahmen.
- Ein Icon liegt absolut positioniert über dem Feld, und der Text läuft darunter durch.
- Das Icon steht an einer Stelle, die die Länge des Inhalts bestimmt.

## Richtig / falsch

```
        RICHTIG                             FALSCH

  ┌───────────────────────┐          ⌕ ┌───────────────────────┐
  │ ⌕  Mitarbeiter suchen │            │ Mitarbeiter suchen    │
  └───────────────────────┘            └───────────────────────┘

  ┌──────────────┐                     ┌──────────────┐
  │ 1.200      € │                     │        1.200 │ €
  └──────────────┘                     └──────────────┘

  ┌───────────────────────┐            ┌───────────────────────┐
  │ 04.08.2026      [▦]   │            │ 04.08.2026  ▦         │
  └───────────────────────┘            └───────────────────────┘
  Icon an der Kante                    Icon folgt dem Text
```

## Grenzen

Ein Button neben dem Feld mit eigener Aufgabe (Suchen, Anlegen) gehört nicht ins Feld. Die beiden sind ein Paar, siehe [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]].

Die Beschriftung steht über dem Feld. Ein Platzhalter ersetzt sie nicht, weil er beim ersten Tastendruck verschwindet.

## Verwandt

- [[Form - Konzentrische Radien]]
- [[Layout - Weniger Kanten, ruhigere Ansicht]]
- [[Typografie - Zahlenspalten stehen rechtsbündig]]
