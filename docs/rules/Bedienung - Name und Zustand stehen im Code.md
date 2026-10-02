---
dateCreated: 2026-10-02
description: "Jedes Bedienelement hat einen zugänglichen Namen mit dem sichtbaren Text, und jeder dauerhafte Zustand steht als Attribut im Code."
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
  - accessibility
---

# Name und Zustand stehen im Code

> [!TIP] Regel
> Gib jedem Bedienelement einen zugänglichen Namen: Ein Feld hat ein verknüpftes `label`, ein Icon-Button ein `aria-label`, und der sichtbare Text ist Teil des Namens. Leg jeden dauerhaften Zustand als Attribut ab: `aria-pressed`, `aria-expanded`, `aria-selected`, `aria-checked`, `aria-current`, `aria-invalid`, `aria-sort`.

## Warum

Ohne Namen sagt der Screenreader nur „Button". Und wer per Sprache steuert, sagt, was er sieht.

Für das Design heißt das: Jeder Icon-Button braucht in der Spezifikation einen Namen, auch wenn er nie zu sehen ist. Bei einer Zeile mit Bearbeiten, Kopieren und Löschen hört der Nutzer sonst „Button, Button, Button“.

Ein Screenreader liest kein Aussehen. Ohne Attribut hört der Nutzer „Button" und weiß nicht, ob er an oder aus ist.

## Hart und weich

Hart.

## Woran Du den Verstoß erkennst

- `<button><Icon/></button>` ohne `aria-label`.
- `<input placeholder="E-Mail">` ohne `label`.
- `aria-label`, das vom sichtbaren Text abweicht.
- Umschalter, dessen Zustand nur eine Klasse ändert.
- Aufklapper ohne `aria-expanded`.
- Aktiver Menüpunkt ohne `aria-current`.
- Sortierbare Spalte ohne `aria-sort`.
- Fehlerhaftes Feld ohne `aria-invalid`.

## Grenzen

Ein Icon neben Text ist Schmuck. Es bekommt `aria-hidden`, keinen Namen.

Native Elemente, die den Zustand selbst melden: `checkbox`, `radio`, `select`, `details`.

## Quelle

WCAG 4.1.2 Name, Role, Value, 3.3.2 Labels or Instructions, 2.5.3 Label in Name. Vercel › Content & Accessibility („Icon-only buttons have descriptive `aria-label`"). WCAG 4.1.2 Name, Role, Value. APG › Button Pattern (Toggle), Disclosure Pattern.

## Verwandt

- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
- [[Formular - Was ein Feld beschreibt, steht im Feld]]
- [[Farbe - Farbe trägt nie allein]]
- [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]]
- [[Inhalt - Struktur steckt im Element]]
