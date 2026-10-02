---
dateCreated: 2026-08-27
description: "Der Fokus ist immer sichtbar, gleich gebaut und nie verdeckt. Für jeden Wechsel steht fest, wo er landet."
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

# Der Fokus ist sichtbar und hat immer einen Ort

> [!TIP] Regel
> Jedes bedienbare Element zeigt sichtbar, wenn es den Fokus hat. Entferne den Fokus nie ersatzlos. Er ist im ganzen Projekt gleich gebaut, verschiebt kein Layout und wird nie von einer fixierten Leiste verdeckt. Leg für jeden Wechsel fest, wo er landet: Pop-up öffnet, Fokus hinein. Pop-up schließt, Fokus zurück auf den Auslöser. Element gelöscht, Fokus auf den Nachbarn. Absenden mit Fehlern, Fokus aufs erste fehlerhafte Feld.

## Warum

Wer mit der Tastatur bedient, sieht ohne Fokus gar nicht, wo er ist. Das betrifft nicht nur Screenreader-Nutzer, sondern jeden, der ein Formular schnell durchtabbt. Der Fokus ist die einzige Rückmeldung, die diese Nutzer bekommen.

Die Voreinstellung des Browsers wird oft entfernt, weil sie nicht zum Rest passt, und dann bleibt nichts übrig. Der Wunsch dahinter ist berechtigt — die Antwort darauf ist ein eigener Fokus, kein fehlender.

Dass er das Layout nicht verschieben darf, hat einen praktischen Grund: sitzt er außerhalb des Elements, springt er in engen Reihen über die Nachbarn.

Ein Fokus, der hinter einer fixierten Kopf- oder Fußleiste liegt, ist so unsichtbar wie ein entfernter. Der Browser scrollt das fokussierte Element nur bis an den Rand des Fensters, und dort steht die Leiste. Der Abstand zur Leiste muss deshalb im Scrollverhalten der Seite stehen. Dasselbe gilt für Sprungziele: Springt ein Anker zu einer Überschrift, landet sie unter der Leiste, nicht dahinter.

Verschwindet das fokussierte Element, springt der Fokus an den Seitenanfang. Der Nutzer verliert seinen Platz.

## Hart und weich

Hart: jeder Wechsel hat ein Ziel. Weich: nichts.

## Woran Du den Verstoß erkennst

- Irgendwo steht `outline: none` ohne Ersatz.
- Eine Leiste mit `position: sticky` oder `fixed`, aber kein `scroll-padding` an der Seite. Beim Durchtabben verschwindet der Fokus darunter.
- Beim Durchtabben einer Ansicht verliert man die Position.
- Der Fokus verschiebt beim Erscheinen das Layout oder überlagert Nachbarn.
- Der Fokus wird pro Komponente anders gebaut.
- Ein Anker springt zu einer Überschrift, und sie liegt hinter der fixierten Leiste. Kein `scroll-margin-top` an Überschriften.
- Dialog ohne Fokusfalle.
- Nach dem Schließen ist `document.activeElement` der `body`.
- Absenden mit Fehlern ohne `focus()` auf ein Feld.

## Grenzen

Die Regel gilt für Tastaturfokus. Ein Fokus nach einem Mausklick darf unterdrückt werden (`:focus-visible`), weil der Mausnutzer schon weiß, wo er geklickt hat.

Wie der Fokus aussieht, ist eine Entscheidung des Projekts und steht dort. Ein weicher Ring auf der Kante ist eine gute Antwort, ein kräftiger Umriss mit Abstand auch — solange er die Nachbarn nicht überlagert.

Nicht-modale Hinweise wie Kurzmeldungen ziehen den Fokus nicht.

## Quelle

APG › Dialog (Modal) Pattern. Vercel › Keyboard („Manage focus (trap, move, return)") und Forms („on submit, focus first error"). WCAG 2.4.3 Focus Order.

## Verwandt

- [[Bedienung - Klickbares hat eine Fläche, und nur Klickbares sieht so aus]]
- [[Farbe - Farbe trägt nie allein]]
- [[Bedienung - Bewegung hat einen Wert und hält nichts auf]]
- [[Fluss - Ein Pop-up unterbricht, es führt nicht]]
- [[Bedienung - Zerstörendes trifft man nicht aus Versehen]]
- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
