---
dateCreated: 2026-10-02
description: "Kein Bedienelement bleibt im Aussehen des Browsers. color-scheme nennt den Modus, was CSS erreicht, wird gestaltet, der Rest ersetzt."
type: design-rule
scope: stack
applies-to:
  - web
status: active
tags:
  - design-system
  - design-rule
  - stack
---

# Was der Browser mitbringt, wird gestaltet oder ersetzt

> [!TIP] Regel
> Lass kein Bedienelement im Aussehen des Browsers stehen. Sag dem Browser per `color-scheme` den aktiven Modus. Was CSS erreicht, gestaltest Du. Was CSS nicht erreicht, ersetzt Du durch ein eigenes Element.

## Warum

Native Teile bringen die Gestaltung des Betriebssystems mit: eigene Icons, eigene Strichstärken, eigene Farben. Neben den eigenen Elementen wirken sie wie aus einem fremden Set. Das ist derselbe Bruch wie zwei Icon-Pakete in einem Projekt.

Dazu ändern sie sich mit Browser und Systemsprache. Ein natives Datumsfeld zeigt in einem englisch eingestellten Browser mm/dd/yyyy, auch wenn die Anwendung Deutsch spricht. Viele lassen sich im Dunkelmodus nicht einfärben.

Ohne die Angabe zeichnet der Browser Scrollbalken, Auswahllisten und Autofill hell, auch auf einer dunklen Seite.

## Was wohin gehört

| Element | Weg | Ergebnis |
|---|---|---|
| Scrollbalken | gestalten | Breite und Farbe aus Tokens, beide Modi geprüft |
| Markierter Text | gestalten | Markenfarbe mit geprüftem Kontrast |
| Checkbox, Radio, Regler | gestalten | Akzentfarbe aus der Marke |
| Autofill-Hintergrund | gestalten | Feld behält seine Fläche |
| Kreuz im Suchfeld | ausblenden | eigener Leeren-Knopf, wenn er gebraucht wird |
| Pfeile im Zahlenfeld | ausblenden | Zahl wird getippt. Schritte, wenn nötig, als eigene Knöpfe |
| Datumsfeld | ersetzen | eigenes Feld im Format der Oberflächensprache, eigener Kalender |
| Aufklappliste einer Auswahl | ersetzen | eigene Liste mit den Rollen des Systems |

## Hart und weich

Hart. Scope `stack`, gilt für `web`.

| | Status |
|---|---|
| Kein Bedienelement zeigt das Aussehen des Browsers | hart |
| Formate folgen der Sprache der Oberfläche, nicht der des Browsers. Das gilt für jede angezeigte Zahl, jedes Datum und jeden Betrag, nicht nur im Feld. Formatiert wird über die Sprachfunktionen der Plattform (`Intl`) | hart |
| Ob gestaltet oder ersetzt wird | weich, Vorgabe die Tabelle oben |

## Woran Du den Verstoß erkennst

- Ein Datums-, Monats- oder Zahlenfeld steht ohne eigenes Element darum in der Ansicht.
- Im globalen CSS fehlt eine Regel für markierten Text.
- Der Scrollbalken ist im Dunkelmodus hellgrau und breit.
- Das Datumsformat wechselt, wenn Du die Sprache des Browsers umstellst.
- Ein Betrag wird von Hand zusammengesetzt, etwa `"€ " + n.toFixed(2)`, oder ein Datum steht als `toISOString()` in der Anzeige.
- Dunkles Thema ohne `color-scheme: dark`.
- Natives `select` ohne eigene Hintergrund- und Textfarbe.

## Grenzen

Auf Touch-Geräten bedient sich die Auswahl des Systems oft besser als eine eigene Liste. Dort darf das System-Rad bleiben, wenn der Auslöser gestaltet ist.

Dateiauswahl und Druckdialog gehören dem Betriebssystem und bleiben, wie sie sind.

Native Apps ohne Web-Ansicht. Dort regelt es die Plattform.

## Quelle

Vercel › Dark Mode & Theming („`color-scheme: dark` on `<html>`", „Native `<select>`: explicit `background-color` and `color`").

## Verwandt

- [[Typografie - Icons sind auf die Schrift abgestimmt]]
- [[Farbe - Hell und Dunkel sind zwei Entwürfe, keine Umkehrung]]
- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
- [[Farbe - Kontrast hat eine Untergrenze]]
