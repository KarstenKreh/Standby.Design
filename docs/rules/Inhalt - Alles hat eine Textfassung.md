---
dateCreated: 2026-10-02
description: "Was man nur sehen oder hören kann, gibt es auch als Text: Alternativtext, Untertitel, Transkript. Text steht nie als Grafik."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - inhalt
  - accessibility
---

# Alles hat eine Textfassung

> [!TIP] Regel
> Gib jedem Bild mit Bedeutung einen Alternativtext, der sagt, was es zeigt, und jedem Schmuckbild ein leeres `alt`. Gib gesprochenem Inhalt in Videos Untertitel und reinem Ton ein Transkript. Setz Überschriften, Beschriftungen und Zahlen als Text, nie als Grafik.

## Warum

Ohne Text liest der Screenreader den Dateinamen vor oder gar nichts. Mit Text bei einem Schmuckbild hört der Nutzer Rauschen.

Ein leeres `alt=""` ist dabei kein Versehen, sondern der Standard in HTML: Es sagt dem Screenreader „überspringen“. Fehlt das `alt` ganz, liest er stattdessen den Dateinamen vor. Schmuck ist ein Bild ohne Information, etwa ein Hintergrundmuster oder eine Deko-Illustration.

Text in einem Bild lässt sich nicht vergrößern, nicht übersetzen, nicht kopieren und nicht vorlesen.

Wer nicht hört oder gerade keinen Ton anmachen kann, bekommt den Inhalt sonst gar nicht.

## Hart und weich

Hart.

## Woran Du den Verstoß erkennst

- `img` ohne `alt`.
- `alt` mit Dateinamen oder „Bild".
- Bedeutungsvolles SVG ohne `role="img"` und Titel.
- Schmuckbild mit beschreibendem `alt` statt `alt=""`.
- Überschrift als PNG oder SVG mit Pfaden.
- Text in ein Titelbild eingebrannt.
- Beschriftungen per `canvas` gezeichnet ohne Textfassung.
- `video` ohne `track kind="captions"`.
- Podcast oder Sprachnachricht ohne Text.
- Eingebrannte Untertitel, die sich nicht ausschalten lassen.

## Grenzen

Icons in Buttons regelt [[Bedienung - Name und Zustand stehen im Code]].

Logos und Wortmarken.

Video ohne Sprache und ohne wichtige Geräusche. Schmuckvideo, das nach [[Bedienung - Was sich von selbst bewegt, lässt sich anhalten]] stumm läuft.

## Quelle

WCAG 1.1.1 Non-text Content. Fluent 2 › Accessibility › Rich media and alternatives. WCAG 1.4.5 Images of Text. WCAG 1.2.1 Audio-only and Video-only, 1.2.2 Captions (Prerecorded). Vercel › Content („Accessible media").

## Verwandt

- [[Bedienung - Name und Zustand stehen im Code]]
- [[Layout - Jeder Textbehälter hält jede Textmenge aus]]
- [[Typografie - Icons sind auf die Schrift abgestimmt]]
- [[Bedienung - Was sich von selbst bewegt, lässt sich anhalten]]
