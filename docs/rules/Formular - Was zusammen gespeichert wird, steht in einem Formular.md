---
dateCreated: 2026-10-02
description: "Felder, die einen gemeinsamen Speichern-Knopf teilen, stehen im Code in einem Formular. Enter speichert."
type: design-rule
scope: universal
applies-to:
  - web
status: active
tags:
  - design-system
  - design-rule
  - formular
  - accessibility
---

# Was zusammen gespeichert wird, steht in einem Formular

> [!TIP] Regel
> Leg Felder, die zusammen gespeichert werden, in ein Formular. Enter im Feld speichert.

## Warum

Nutzer erwarten, dass Enter abschickt. Das liefert nur ein echtes Formular im Code, und nur dann erkennt auch der Passwortmanager die Felder. Gemeint sind Felder, die einen Speichern-Knopf teilen, etwa Name, E-Mail und Telefon mit einem „Speichern“ darunter.

## Woran Du den Verstoß erkennst

- Felder ohne umgebendes `form`.
- Speichern als `type="button"` mit `onClick`.
- Enter im Feld bewirkt nichts.

## Hart und weich

Hart.

## Grenzen

Im mehrzeiligen Textfeld macht Enter eine neue Zeile. Dort sendet Strg oder Cmd plus Enter.

## Quelle

Vercel › Forms („Enter submits focused input; in `<textarea>`, ⌘/Ctrl+Enter submits").

## Verwandt

- [[Formular - Der Nutzer tippt nur, was das System nicht weiß]]
- [[Bedienung - Ein Button ist nie gesperrt]]
- [[Fluss - Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben]]
