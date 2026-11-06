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

Für den Korridor gibt es einen Grund, für die genaue Zahl darin nicht. Unter etwa 100 Millisekunden nimmt niemand mehr eine Bewegung wahr. Der Wechsel wirkt wie ein Sprung, und der Nutzer sieht keine Rückmeldung. Über etwa 200 wartet der Nutzer auf die Oberfläche, und das Warten fällt umso mehr auf, je öfter er den Wechsel auslöst.

Innerhalb des Korridors hängt die Zahl vom Stil des Produkts ab. Ein ruhiges, schweres Produkt darf am oberen Ende sitzen, ein Werkzeug, das schnell wirken soll, am unteren. Diese Entscheidung nimmt die Regel niemandem ab.

Hart ist, dass es **eine** Dauer gibt. Verschiedene Dauern nebeneinander lassen eine Ansicht flackern, weil mehrere Elemente in einer Reihe zu verschiedenen Zeitpunkten ankommen. Der Nutzer sieht dann drei Wechsel statt einem. Weil die Dauer als Token steht, lässt sich der Stil später an einer Stelle ändern statt an zweihundert.

Dass bei reduzierter Bewegung alles sofort wechselt, ist Pflicht. Für Menschen mit vestibulärer Störung löst Bewegung auf dem Bildschirm Schwindel und Übelkeit aus. Mit der Systemeinstellung bitten sie um weniger Bewegung, und das Produkt hält sich daran.

Layout-Eigenschaften rechnen bei jedem Bild die Seite neu, ruckeln und schieben Nachbarn. `all` animiert auch, was niemand animieren wollte, etwa jede Farbe beim Moduswechsel.

Eine Animation gibt Rückmeldung und lässt niemanden warten. Wer schnell klickt, muss nicht auf ihr Ende warten.

Was sich zusammen bewegt, nimmt der Nutzer als eine Sache wahr. Fahren Kopf und Inhalt einer Karte getrennt ein, wirkt sie wie zwei getrennte Teile.

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

Größere Bewegungen sind nicht gemeint und dürfen länger dauern: ein Off-Canvas-Drawer, ein Dialog, ein Seitenwechsel. Der Korridor gilt für Wechsel am Ort, etwa Farbe, Rand oder die Position eines Schalterknopfs. Auch die längeren Bewegungen fallen bei reduzierter Bewegung weg.

Legt eine Marken-Richtlinie im Projekt eine eigene Zahl fest, gilt diese. Der Vorgabewert ist dafür da, dass man ohne eine solche Richtlinie loslegen kann. Eine bestehende Richtlinie überstimmt er nicht.

Farbe, Rahmen und Schatten bei Zustandswechseln, einzeln genannt und mit der Dauer von oben.

Listen, deren Einträge bewusst nacheinander erscheinen, um eine Reihenfolge zu zeigen. Bei reduzierter Bewegung fällt ohnehin alles weg.

## Quelle

Vercel › Animation („Animate compositor-friendly props only", „Never animate layout props", „Never `transition: all`"). Vercel Web Interface Guidelines › Animations („Interruptible. Animations are cancelable by user input"). Gestaltgesetz des gemeinsamen Schicksals (Wertheimer, 1923).

## Verwandt

- [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]]
- [[Bedienung - Der Fokus ist sichtbar und hat immer einen Ort]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
- [[Bedienung - Was sich von selbst bewegt, lässt sich anhalten]]
