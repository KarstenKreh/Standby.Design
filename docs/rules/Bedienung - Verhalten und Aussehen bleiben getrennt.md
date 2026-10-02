---
dateCreated: 2026-08-27
description: Was ein Element tut und wie es aussieht, bleiben getrennt. Das Aussehen ist austauschbar, ohne dass sich das Verhalten ändert.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
aliases:
  - Bedienung - Jeder Body hat eine Role und einen Skin
tags:
  - design-system
  - design-rule
  - bedienung
---

# Verhalten und Aussehen bleiben getrennt

> [!TIP] Regel
> Trenne bei jedem bedienbaren Element, was es tut, von dem, wie es aussieht. Es bekommt genau eine Verhaltensart: `pressable`, `toggleable`, `editable`, `navigable`, `readable`. Die Verhaltensart beschreibt nur das Verhalten. Wie das Element aussieht, ist austauschbar.

## Warum

Ohne diese Trennung wird das Aussehen zum Verhalten. „Der Knopf ist blau" wird zu „blau heißt anklickbar", und beim nächsten Umbau kippt mit der Farbe auch die Bedienlogik. Mit der Trennung kannst Du das Aussehen wechseln, ohne dass sich ändert, was das Element tut. Und Du kannst etwas Neues bauen, indem Du nur sein Verhalten benennst, statt sein Aussehen neu zu erfinden.

Für einen Agenten ist die Tabelle der Verhaltensarten die Antwort auf die häufigste Frage überhaupt: was wird hier eingesetzt? Nicht „nimm einen Button", sondern „das ist ein dauerhafter Zustand, also `toggleable`, also Schalter oder Reiter".

## Die fünf Verhaltensarten

| Verhalten | Bedeutung |
|---|---|
| `pressable` | Löst eine Aktion aus. Danach ist das Element unverändert |
| `toggleable` | Trägt einen dauerhaften Zustand: an oder aus, ausgewählt oder nicht |
| `editable` | Nimmt eine Eingabe des Nutzers entgegen |
| `navigable` | Bringt den Nutzer an eine andere Stelle |
| `readable` | Zeigt nur an, nimmt keine Bedienung entgegen |

Die Verhaltensarten entsprechen dem, was ein blinder Nutzer heute schon erlebt: der Accessibility Tree kennt Verhalten, kein Aussehen. Sie sind damit keine Wette auf eine Abstraktion, sondern die Wahrheit der Plattform.

## Das Element im Code

Jede Verhaltensart hat ihr Bauteil im Code. `navigable` ist ein Link mit Adresse, `pressable` und `toggleable` sind ein `button`, `editable` ist ein Feld mit verbundener Beschriftung, `readable` ist Text. Ein Kasten mit Klick sieht für die Maus genauso aus, aber die Tastatur erreicht ihn nicht, der Screenreader erkennt ihn nicht, und ein Link lässt sich nicht in einem neuen Tab öffnen. Gibt es kein passendes Bauteil, etwa für Tabs oder eine Kombi-Box, gilt das Muster aus der ARIA APG.

Eine Rolle im Code ist ein Versprechen. Wer behauptet, etwas sei ein Menü, Tabs oder ein Raster, baut auch die Tastaturbedienung dazu, sonst erwartet der Nutzer Pfeiltasten, die nichts tun. Eine Hauptnavigation ist deshalb keine Menü-Rolle, sondern eine Liste von Links.

## Das Wörterbuch

Bekannte Paare aus Verhalten und Aussehen, die einen Namen tragen. Der Name der Zeile ist die Abkürzung für das Paar. Die Namen in der Spalte Aussehen sind die Vorgabe. Ein Projekt darf sie anders nennen.

| Name | Verhalten | Aussehen | Eigenes Zeichen für „aktiv" | Element im Code |
|---|---|---|---|---|
| Button | pressable | press | — | `button` |
| Icon-Button | pressable | press, nur Icon | — | `button` mit Namen |
| Chip | toggleable | chip | Punkt vorn | `button` mit `aria-pressed` |
| Switch | toggleable | track | Position des Knopfs | `button` mit `role="switch"` |
| Tab | toggleable | tab | Strich darunter | `button` mit `role="tab"` |
| Eingabefeld | editable | field | — | `input` mit verbundenem `label` |
| Navigations-Zeile | navigable | row | Balken links | `a` mit `href` |
| Fließtext-Link | navigable | text | verdickte Unterstreichung | `a` mit `href` |
| Badge | readable | badge | — | Text |

Chip und Badge sind verwandt, aber nicht gleich. Der Chip ist ein kleiner Umschalter, etwa ein Filter, der an oder aus ist. Das Badge hebt nur eine Information als Etikett hervor. Weil das Auge Gleiches für Gleichartiges hält, sehen die beiden nicht gleich aus: Das Badge ist schmaler und hat nur ein knappes Padding, der Chip hat die Polsterung eines Bedienelements. So sieht man vor dem Klick, was sich drücken lässt.

## Woran Du den Verstoß erkennst

- Ein Badge reagiert auf Klick. Dann ist es kein Badge, sondern ein Chip.
- Chip und Badge haben dasselbe Padding und dieselbe Höhe.
- Ein Switch löst eine einmalige Aktion aus, statt einen Zustand zu halten. Dann ist es ein Button.
- Etwas wird über seine Farbe beschrieben („der graue Knopf") statt über sein Verhalten.
- Das Aussehen bringt Interaktions-Code mit, oder das Verhalten setzt Farben.
- Das Verhalten wird in einer einzelnen Ansicht nachgebaut statt benutzt.
- Ein Klick sitzt auf einem `div`, `span` oder `li`.
- Ein `button` wechselt per Code die Seite, oder ein `a` hat kein `href`.
- Die Hauptnavigation hat `role="menu"`, oder ein Element hat eine Rolle ohne die Tastaturbedienung dazu.

## Grenzen

Zusammengesetzte Gebilde — Dropdown, Datepicker, Dialog — bestehen aus mehreren Elementen und bekommen keine eigene Verhaltensart. Ihr Auslöser ist `pressable`, ihre Einträge sind `navigable` oder `toggleable`.

Und nicht jede Kombination ergibt Sinn. Welche verboten sind, gehört in die Grammatik des Projekts, nicht in diese Notiz.

## Verwandt

- [[Bedienung - Verhalten und Aussehen werden nicht in der Ansicht nachgebaut]]
- [[Farbe - Farbe trägt nie allein]]
- [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]]
- [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]]
- [[Bedienung - Klickbares hat eine Fläche, und nur Klickbares sieht so aus]]
