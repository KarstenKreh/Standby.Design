---
dateCreated: 2026-10-02
description: "Die Sprache kommt aus Browser oder Konto, nie aus IP oder Standort. Der Nutzer kann sie jederzeit umstellen."
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

# Die Sprache kommt aus der Einstellung, nicht aus dem Ort

> [!TIP] Regel
> Wähle die Sprache aus der Einstellung von Browser oder Konto und lass sie jederzeit umstellen.

## Warum

Wer im Urlaub ist oder eine andere Sprache spricht als sein Land, bekommt sonst eine Oberfläche, die er nicht lesen kann.

Die gewählte Sprache steht auch im Code, als `lang` an der Wurzel der Seite, und wechselt mit. Danach richten sich Aussprache des Screenreaders, Silbentrennung und das Übersetzungsangebot des Browsers. Ein Abschnitt in einer anderen Sprache bekommt sein eigenes `lang`.

## Woran Du den Verstoß erkennst

- Sprachwahl über IP oder Standort.
- Kein Weg, die Sprache zu wechseln.
- Die Wahl wird beim nächsten Besuch vergessen.
- `lang` fehlt, steht auf „en“ an einer deutschen Oberfläche oder wechselt beim Umschalten der Sprache nicht mit.

## Hart und weich

Hart.

## Grenzen

Inhalte, die rechtlich am Ort hängen, etwa Preise und Steuern. Die Sprache bleibt trotzdem frei.

## Quelle

WCAG 3.1.1 Language of Page, 3.1.2 Language of Parts. Vercel Web Interface Guidelines › Content („Prefer language settings over location … Never rely on IP/GPS for language").

## Verwandt

- [[Layout - Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um]]
