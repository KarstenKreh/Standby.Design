---
dateCreated: 2026-08-27
description: "Eine Dauer als Token, nur transform und opacity, jede Eingabe bricht ab, Zusammengehöriges bewegt sich gemeinsam. Bei reduzierter Bewegung sofort."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
korridor: 100-200ms
default: 150ms
tags:
  - design-system
  - design-rule
  - bedienung
  - accessibility
---

# Bewegung hat einen Wert und hält nichts auf

> [!TIP] Regel
> Gib Zustandswechseln genau eine Dauer als Token, im Korridor 100 bis 200 Millisekunden, Vorgabe 150. Animiere nur `transform` und `opacity` und nenne jede Eigenschaft einzeln. Jede neue Eingabe bricht eine laufende Bewegung ab, und was zusammengehört, bewegt sich gemeinsam. Hat der Nutzer weniger Bewegung eingestellt, wechselt alles sofort.

## Warum

Der Korridor hat einen Grund, die Zahl darin nicht. Unter etwa 100 Millisekunden nimmt niemand mehr eine Bewegung wahr, der Wechsel liest sich als Sprung und die Rückmeldung geht verloren. Über etwa 200 wartet der Nutzer auf die Oberfläche, und das Warten fällt umso mehr auf, je öfter er den Wechsel auslöst.

Innerhalb des Korridors ist die Zahl eine Frage der Handschrift. Ein ruhiges, schweres Produkt darf am oberen Ende sitzen, ein Werkzeug, das schnell wirken soll, am unteren. Diese Entscheidung nimmt die Regel niemandem ab.

Hart ist etwas anderes: dass es **eine** Dauer gibt. Verschiedene Dauern nebeneinander lassen eine Ansicht flackern, weil mehrere Elemente in einer Reihe zu verschiedenen Zeitpunkten ankommen. Der Blick sieht dann nicht einen Wechsel, sondern drei. Und weil die Dauer als Token steht, lässt sich die Handschrift später an einer Stelle ändern statt an zweihundert.

Die letzte Hälfte ist keine Höflichkeit. Für Menschen mit vestibulärer Störung löst Bewegung auf dem Bildschirm Schwindel und Übelkeit aus. Die Systemeinstellung ist ihre Bitte, und sie wird beachtet.

Layout-Eigenschaften rechnen bei jedem Bild die Seite neu, ruckeln und schieben Nachbarn. `all` animiert auch, was nie gemeint war, etwa jede Farbe beim Moduswechsel.

Eine Animation ist Rückmeldung, keine Wartezeit. Wer schnell klickt, darf nicht auf das Ende warten.

Was sich zusammen bewegt, liest das Auge als eine Sache. Fahren Kopf und Inhalt einer Karte getrennt ein, wirkt sie wie zwei.

## Hart und weich

| | Status |
|---|---|
| Es gibt genau eine Dauer für Zustandswechsel am Ort | hart |
| Sie steht als Token, nicht pro Komponente | hart |
| Sie liegt zwischen 100 und 200 Millisekunden | hart |
| Bei reduzierter Bewegung findet der Wechsel sofort statt | hart |
| Die Zahl im Korridor | weich, Vorgabe 150 |

## Woran Du den Verstoß erkennst

- Die Dauer wird pro Komponente gewählt, es gibt 100, 200 und 300 Millisekunden nebeneinander.
- Eine Dauer liegt außerhalb des Korridors, ohne dass jemand das begründen kann.
- `prefers-reduced-motion` kommt im Projekt nirgends vor.
- Eine Ansicht animiert beim Laden Elemente ein, obwohl die Einstellung Bewegung reduziert.
- `transition: all`, Tailwind `transition-all`.
- Animiertes `height`, `width`, `top`, `left`, `margin`.
- `pointer-events: none` während eines Übergangs.
- Flag wie `isAnimating`, das Klicks verwirft.
- `await` auf das Ende einer Animation vor dem Seitenwechsel.
- Ein schneller Doppelklick öffnet und schließt nicht.
- Kopf und Inhalt einer Karte haben verschiedene Animationen oder Verzögerungen.
- Abschnitte ohne Bezug blenden gestaffelt nacheinander ein.
- Beim Öffnen eines Panels rutscht ein Element mit, das nicht dazugehört.

## Grenzen

Größere Bewegungen sind nicht gemeint und dürfen länger dauern: ein Off-Canvas-Drawer, ein Dialog, ein Seitenwechsel. Der Korridor gilt für Wechsel am Ort — Farbe, Rand, die Position eines Schalterknopfs. Auch die längeren Bewegungen fallen bei reduzierter Bewegung weg.

Legt eine Marken-Richtlinie im Projekt eine eigene Zahl fest, gilt diese. Der Vorgabewert ist dafür da, dass man ohne eine solche Richtlinie trotzdem loslegen kann, und nicht dafür, sie zu überstimmen.

Farbe, Rahmen und Schatten bei Zustandswechseln, einzeln genannt und mit der Dauer von oben.

Listen, deren Einträge bewusst nacheinander erscheinen, um eine Reihenfolge zu zeigen. Bei reduzierter Bewegung fällt ohnehin alles weg.

## Quelle

Vercel › Animation („Animate compositor-friendly props only", „Never animate layout props", „Never `transition: all`"). Vercel Web Interface Guidelines › Animations („Interruptible. Animations are cancelable by user input"). Gestaltgesetz des gemeinsamen Schicksals (Wertheimer, 1923).

## Verwandt

- [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]]
- [[Bedienung - Der Fokus ist sichtbar und hat immer einen Ort]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
- [[Bedienung - Was sich von selbst bewegt, lässt sich anhalten]]
