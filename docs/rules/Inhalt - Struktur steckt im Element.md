---
dateCreated: 2026-10-02
description: "Tabelle, Liste, Feldgruppe und Seitenbereiche sind im Code das, was sie sind. Der erste Tab-Halt springt zum Inhalt."
type: design-rule
scope: universal
applies-to:
  - web
status: active
tags:
  - design-system
  - design-rule
  - inhalt
  - layout
  - accessibility
---

# Struktur steckt im Element

> [!TIP] Regel
> Baue Tabellen als `table` mit Kopfzellen, Listen als Liste, zusammengehörige Felder als Gruppe mit Titel und die Seite aus benannten Bereichen (`header`, `nav`, `main`, `footer`). Der erste Tab-Halt springt zum Inhalt.

## Warum

Der Screenreader sagt „Tabelle, 5 Spalten" oder „Liste, 12 Einträge". Bei `div`-Gittern hört der Nutzer nur einzelne Wörter ohne Zusammenhang.

Sonst tabbt der Nutzer auf jeder Seite erst durch die ganze Navigation. Bei einer Navigation mit 20 Einträgen sind das 20 Tabs, auf jeder Seite neu.

Für das Design heißt das: Der Link „Zum Inhalt springen“ ist im Ruhezustand unsichtbar und erscheint erst beim ersten Tab. Er braucht deshalb nur ein Aussehen im Fokus-Zustand.

## Hart und weich

Hart.

## Woran Du den Verstoß erkennst

- Datentabelle aus `div` mit Grid.
- Tabelle ohne `th` und `scope`.
- Aufzählung als Folge von `div`.
- Radiogruppe ohne `fieldset` und `legend`, oder ohne `role="radiogroup"` und Namen.
- Kein `main`.
- Alles in `div`.
- Der erste Tab landet im Menü.

## Grenzen

Tabellen nur fürs Layout gibt es nicht. Dort gehört Grid hin, ohne Tabellenrolle.

Ansichten ohne wiederkehrende Navigation, etwa der Login.

## Quelle

WCAG 1.3.1 Info and Relationships. Vercel AGENTS.md › Content & Accessibility („Prefer native semantics (`button`, `a`, `label`, `table`)"). WCAG 2.4.1 Bypass Blocks. Vercel › Content & Accessibility („‚Skip to content' link").

## Verwandt

- [[Bedienung - Name und Zustand stehen im Code]]
- [[Typografie - Zahlenspalten stehen rechtsbündig]]
- [[Layout - Die Titel bilden eine Gliederung]]
- [[Bedienung - Alles geht mit der Tastatur, in der Reihenfolge des Bildes]]
- [[Bedienung - Der Fokus ist sichtbar und hat immer einen Ort]]
