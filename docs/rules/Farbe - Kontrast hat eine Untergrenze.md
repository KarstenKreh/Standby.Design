---
dateCreated: 2026-10-02
description: "Text 4,5:1, große Schrift, Grenzen und Zustandszeichen 3:1, in jedem Zustand. Bei erhöhtem Systemkontrast bleibt alles Nötige sichtbar."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - farbe
---

# Kontrast hat eine Untergrenze

> [!TIP] Regel
> Halte für Text 4,5:1 gegen den Untergrund ein, für große Schrift 3:1, für die Grenze eines Bedienelements und jedes Zustandszeichen ebenfalls 3:1, in jedem Zustand und in beiden Modi. Verlangt das System erhöhten Kontrast oder erzwungene Farben, bleiben Grenzen, Fokus und Zustände sichtbar.

## Warum

Darunter kann ein Teil der Nutzer den Text nicht lesen oder das Feld nicht finden, egal wie stimmig es aussieht.

Die Untergrenze gilt in jedem Zustand, nicht nur in Ruhe: auch bei Hover, Gedrückt und Fokus, und in beiden Modi. Wird ein dunkler Knopf im Hellen beim Hover heller (siehe [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]]), darf seine Beschriftung trotzdem nicht unter 4,5:1 fallen.

Wer schlecht sieht, stellt das System auf hohen Kontrast. Dann verschwinden Hintergrundfarben und Schatten, und was nur über sie gebaut ist, ist weg.

## Hart und weich

Hart: die WCAG-AA-Werte als Untergrenze. Weich: das Messverfahren. APCA darf zusätzlich prüfen (Vercel empfiehlt es), ersetzt die Untergrenze aber nicht.

Hart: alles Nötige bleibt sichtbar. Weich: wie stark die Kontrastvariante abweicht.

## Woran Du den Verstoß erkennst

- Platzhalter- oder Hilfetext unter 4,5:1.
- Feldrahmen als einzige Grenze eines Feldes unter 3:1.
- Fokusring oder Häkchen unter 3:1.
- Geprüft nur im hellen Modus.
- Kontrast nur im Ruhezustand geprüft.
- Weiße Schrift auf dem helleren Hover-Zustand unter 4,5:1.
- Fokusring nur als `box-shadow`, ohne `outline` als Rückfall.
- Feldgrenze nur über eine andere Hintergrundfarbe.
- Icon als CSS-Hintergrundbild.
- Kein `@media (prefers-contrast: more)` oder `(forced-colors: active)` im Projekt.

## Grenzen

Gesperrte Elemente, Logos, reine Schmuckflächen.

Native Apps ohne Web-Ansicht nutzen die Kontrastvarianten der Plattform.

## Quelle

WCAG 1.4.3 Contrast (Minimum), 1.4.11 Non-text Contrast. Vercel › Design („Meet contrast"). Apple HIG › Accessibility › Color and effects („provides a higher contrast color scheme when the system setting Increase Contrast is turned on").

## Verwandt

- [[Zustand - Rot ist nicht ein Rot]]
- [[Layout - Erst Abstand, dann Fläche, dann Linie]]
- [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]]
- [[Stack - Was der Browser mitbringt, wird gestaltet oder ersetzt]]
- [[Bedienung - Der Fokus ist sichtbar und hat immer einen Ort]]
- [[Farbe - Farbe trägt nie allein]]
