---
dateCreated: 2026-10-02
description: "Keine feste Höhe an Text, Schrift relativ, kein gesperrter Zoom. Jeder Text bricht um oder wird gekürzt, Gekürztes bleibt erreichbar."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - typografie
  - layout
---

# Jeder Textbehälter hält jede Textmenge aus

> [!TIP] Regel
> Setz Schriftgrößen relativ, gib Textbehältern keine feste Höhe und sperr nie den Zoom. Leg für jeden Text fest, ob er umbricht oder gekürzt wird, und halte Gekürztes vollständig erreichbar. Die Ansicht hält 200 % Schrift und den längsten echten Inhalt aus.

## Warum

Wer schlecht sieht, vergrößert die Schrift. Feste Höhen schneiden den Text dann ab.

Agenten bauen mit Beispieltext. Echte Namen, Übersetzungen und Nutzerinhalte sind oft dreimal so lang. Aus „Max Mustermann“ wird „Maximilian von Hohenzollern-Sigmaringen“, aus einem Link eine URL ohne ein einziges Leerzeichen. Ohne festgelegtes Verhalten läuft so ein Text aus der Karte heraus oder drückt das Layout breit.

## Hart und weich

Hart. Die Höhen aus [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]] stehen in `rem` und gelten als `min-height`.

Hart: jeder Text hat ein Verhalten für Überlänge. Weich: welches. Vorgabe: Fließtext bricht um, Zellen und Beschriftungen kürzen.

## Woran Du den Verstoß erkennst

- `user-scalable=no` oder `maximum-scale=1`.
- `height` statt `min-height` an Elementen mit Text.
- `font-size` in `px`.
- `overflow: hidden` mit fester Höhe.
- Flex-Kind mit Text ohne `min-w-0`.
- `truncate` ohne Weg zum vollen Text.
- Lange URL oder E-Mail ohne `break-words` sprengt die Karte.

## Grenzen

Text in Bildern und Grafiken.

Inhalte, die das Produkt selbst festlegt, etwa Kürzel und Codes.

## Quelle

WCAG 1.4.4 Resize Text, 1.4.12 Text Spacing. Vercel › Targets & Input („Never disable browser zoom"). Vercel › Content Handling („Text containers handle long content", „Flex children need `min-w-0`") und Content & Accessibility („Resilient to user-generated content").

## Verwandt

- [[Layout - Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um]]
- [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]]
- [[Typografie - Icons sind auf die Schrift abgestimmt]]
- [[Typografie - Fließtext hat eine Höchstbreite]]
- [[Fluss - Leer ist ein Zustand, keine Lücke]]
- [[Bedienung - Ein Tooltip ergänzt, er trägt nie allein]]
