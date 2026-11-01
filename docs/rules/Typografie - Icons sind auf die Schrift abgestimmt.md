---
dateCreated: 2026-08-27
description: Ein Icon steht neben Text und wird mit ihm gelesen. Größe, Strichstärke und Abstand richten sich nach der Schrift, und der Abstand wird optisch ausgeglichen statt gemessen.
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
---

# Icons sind auf die Schrift abgestimmt

> [!TIP] Regel
> Behandle ein Icon wie ein Schriftzeichen, nicht wie ein Bild in einem Kasten. Größe aus der Typo-Skala, Strichstärke passend zum Schriftgewicht daneben, Abstand zum Text optisch ausgeglichen, und es wächst mit, wenn der Nutzer die Schrift vergrößert.

## Warum

Ein Icon in einer Beschriftung wird als Teil derselben Zeile gelesen, in einem Zug mit dem Wort daneben. Was für den Buchstaben gilt, gilt deshalb auch für das Icon.

Am Abstand scheitern fast alle Systeme. Ein Icon aus drei senkrechten Punkten lässt an seiner rechten Kante Luft, ein gefülltes Quadrat nicht. Bei gleichem gemessenem Abstand wirkt das erste weiter vom Wort entfernt.

```
        Beide Abstände sind gemessen gleich groß.

        ⋮  Optionen                ■  Optionen
          ^^^                        ^^^
        wirkt zu weit              wirkt richtig
```

**Der Ausgleich gehört ins Icon, nicht in die Zeile.** Jedes Icon bringt seinen eigenen Seitenabstand mit, so wie jede Glyphe ihre Vor- und Nachbreite hat. Ein einziger `gap` für alle Icons setzt überall denselben Wert und gleicht den optischen Unterschied deshalb nicht aus.

Dasselbe gilt für Gewicht und Größe: ein Icon neben halbfettem Text soll halbfett wirken, seine Größe kommt aus der Typo-Skala, und bei vergrößerter Systemschrift wächst es mit.

## Zwei Varianten

Beide haben gute Gründe. Die Regel entscheidet den Weg nicht, sie sagt, was am Ende stimmen muss.

**Variante 1: Icons als Schriftzeichen.** Vorbild SF Symbols. Der Vorteil kommt aus dem Format, unabhängig von der Sorgfalt der Gestalter: **Der optische Ausgleich ist Pflicht.** Man kann keine Glyphe zeichnen, ohne ihre Seitenbreiten festzulegen. Auch Grundlinie, Gewichtsstufen und das Mitwachsen liefert das Format, ohne dass jemand darauf achten muss.

Der Preis ist der fehlende Rückfall. Lädt die Schrift nicht, fehlen alle Icons, denn kein Ersatzzeichen hat eine Bedeutung. Bei Apple fällt das nicht auf, weil die Schrift zum System gehört. Eine frei ausgelieferte Anwendung hat diese Garantie nicht. Dazu: nur eine Farbe in einfachen Formaten, Vorlesen als Zeichen, unsauberes Rendern in kleinen Graden. Und SF Symbols ist auf Apple-Plattformen beschränkt.

**Variante 2: Icons als SVG-Set.** Der Vorteil ist Sicherheit: Ein Icon ist entweder da oder nicht, falsche Zeichen erscheinen nie. Mehrfarbig möglich, überall lauffähig.

Der Preis: Das Format erzwingt nichts davon. Wer diesen Weg geht, muss die Arbeit bewusst leisten: Seitenabstand je Icon statt ein `gap` für alle, Strichstärken je Gewichtsstufe, Größen an der Typo-Skala, Abstände in `em`.

## Einschätzung

**Gestalterisch ist Variante 1 überlegen**, weil sie erzwingt, was die Regel verlangt, und zwar für jedes einzelne Icon.

**Variante 2 ist die sichere Wahl und eine Übergangslösung.** Sie ist heute für die meisten Projekte richtig, weil es außerhalb von Apple kaum Icon-Schriften gibt, die handwerklich sauber gemacht sind.

Icons setzen sich langfristig als Schrift durch. Wer heute Variante 2 nutzt, baut sie deshalb so, dass der Wechsel möglich bleibt: Größen an der Typo-Skala führen, Abstände je Icon pflegen. Dann tauscht man beim Umstieg nur die Quelle aus und muss die Oberfläche nicht umbauen.

## Woran Du den Verstoß erkennst

- **Punkte-Test:** ein Icon mit lockerer und eines mit geschlossener Kante vor demselben Wort. Wirken die Abstände verschieden, gleicht das Set nicht aus.
- **Rundungs-Test:** ein rundes neben einem eckigen Icon. Wirkt das runde kleiner, wurde nur skaliert. Ein Kreis muss über das Quadrat hinauslaufen, so wie ein O über die x-Höhe.
- Der Abstand zum Text ist ein fester Pixelwert, gleich für alle Icons.
- Icon-Größen stehen als feste Pixelwerte in der Ansicht.
- Ein Icon neben fettem Text hat dieselbe Strichstärke wie eines neben normalem.
- Mehr als ein Icon-Paket im Projekt, oder ein einzelnes SVG, weil das passende im Set fehlte. Verschiedene Familien haben verschiedene Strichstärken und optische Größen, und das fällt auf, weil Icons fast immer in Reihen stehen.

## Grenzen

Ein Icon-only-Bedienelement ist eine Trefferfläche und wird nicht wie ein Schriftzeichen behandelt. Es braucht die Box auf der Höhe seiner Zeile, siehe [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]]. Die Regel gilt für Icons neben Text.

Marken-Logos, Zahlungsanbieter-Zeichen und Länderflaggen sind keine Icons in diesem Sinne.

## Offen

Ein eigenes Icon-Set als variable Schrift wäre außerhalb von Apple der einzige Weg zu Variante 1. Das ist ein eigenes Vorhaben und nichts für nebenbei. Zu klären wäre vor allem der Rückfall, wenn die Schrift nicht lädt.

## Verwandt

- [[Typografie - Betone mit einem Mittel, nicht mit zweien]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
- [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]]
