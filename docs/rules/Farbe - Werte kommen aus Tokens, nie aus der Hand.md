---
dateCreated: 2026-08-27
description: Farben, Abstände, Radien, Schatten und Icon-Größen kommen aus dem Token-Export. Keine Hex-Werte und keine Pixelzahlen in der Ansicht.
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
  - tokens
---

# Werte kommen aus Tokens, nie aus der Hand

> [!TIP] Regel
> Nimm jeden Gestaltungswert aus dem Token-System: Farben, Abstände, Radien, Schatten, Schriftgrößen, Icon-Größen und Strichstärken. Baue Token-Werte niemals von Hand nach.

## Warum

Ein von Hand gesetzter Wert ist eine stille Abzweigung. Er ändert sich nicht mit, wenn das System sich ändert, und er lässt sich nicht finden, weil niemand weiß, dass es ihn gibt. Nach einem halben Jahr stehen im Repo drei Grautöne, die alle „das Grau der Kante" sein wollen, und keiner davon ist es.

Bei Farben kommt der zweite Modus dazu. Ein Hex-Wert kennt nur eine Erscheinung. Der Nutzer, der auf Hell umschaltet, bekommt ihn unverändert, und die Ansicht bricht an genau dieser Stelle.

Deshalb ist der Token-Export der Ausgangspunkt und nicht eine Annäherung daran. Wer feinjustieren will, justiert im Generator und exportiert neu.

## Woran Du den Verstoß erkennst

- Hex-Werte oder `rgba`-Literale in Ansichten, Komponenten oder eingegrenztem CSS.
- Schriftgrößen als `font-size: 32px` oder `1.75rem` statt aus der Skala.
- Icon-Größen als feste Pixelwerte.
- `text-white` auf einer gefüllten Fläche statt der zugehörigen Gegenfarbe.
- Verläufe und Schleier aus festen `rgba`-Werten statt aus einer Mischung mit einer Token-Farbe.

## Wo die Grenze verläuft

Erlaubt sind feste Werte in diesen Fällen:

| Bereich | Warum |
|---|---|
| Marketing- und Landing-Seiten mit eigener Haut | Nicht Teil des Anwendungs-Token-Systems |
| Canvas-Partikel, Konfetti, reine Illustration | Dekorativ, kein Bedien-Element |
| Farben in Backend- oder Typ-Metadaten | Steuern keine Oberfläche |
| Notfall-Werte in der Chart-Brücke | Nur für den Fall, dass CSS noch nicht geladen ist |

Alles andere geht über Tokens.

## Zwei Sorten Token, und eine dritte

Neben den rohen Werten (Primitives) und der Bedeutung (Semantics) gibt es eine dritte Sorte: **Material**. Sie sagt, woraus eine Fläche gemacht ist — gebürstetes Metall, Licht von hinten, Körnung.

Die Erkennungsregel: Lässt sich das Token mit „das heißt Gefahr, Erfolg, inaktiv" beschreiben, ist es semantisch. Lässt es sich nur mit „so sieht die Oberfläche aus" beschreiben, ist es Material.

Material trägt **keinen** Zustand. Ein Panel ist in jedem Zustand aus demselben Material, nur das Licht dahinter wechselt die Farbe. Und Material wird nicht nach Bauteil benannt: sobald ein zweites Bauteil dasselbe Material nutzt, lügt der Name.

**Auch Durchsichtigkeit ist Material.** Ein System darf mit Glas, Schleier und Weichzeichner arbeiten, das ist eine gestalterische Entscheidung wie jede andere. Sie wird dann aber als Material benannt und für jede Erscheinung definiert, in der sie vorkommt. Was nicht geht, ist die beiläufige Variante: eine Deckkraft, die an einer einzelnen Stelle gesetzt wird, weil die Fläche dort gerade zu hell war. Das ist keine Materialentscheidung, sondern eine Korrektur im Vorbeigehen, und sie hinterlässt eine Stufe, die im System keinen Namen hat.

Wer durchsichtig baut, übernimmt zusätzlich eine Pflicht: der Kontrast von Text auf so einer Fläche hängt davon ab, was zufällig darunter liegt. Er muss trotzdem in jedem Fall reichen, üblicherweise über eine gedeckte Grundschicht unter dem Glas.

## Grenzen

Ein Wert, den es im System noch nicht gibt, wird nicht heimlich in der Ansicht gesetzt, sondern als neue Stufe in die Skala aufgenommen. Der Ausgleichswert 14 aus [[Form - Senkrechtes Padding wird optisch ausgeglichen]] ist genau so ein Fall.

## Verwandt

- [[Stack - Keine Deckkraft-Modifier auf semantischen Farben]]
- [[Typografie - Icons sind auf die Schrift abgestimmt]]
