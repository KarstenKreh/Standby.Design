---
dateCreated: 2026-08-27
description: Kann ein Produkt beide Erscheinungen, ist jeder Wert in beiden festgelegt und in beiden geprüft. Dunkel wird nicht durch Umkehren aus Hell gewonnen.
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

# Hell und Dunkel sind zwei Entwürfe, keine Umkehrung

> [!TIP] Regel
> Bietet ein Produkt beide Erscheinungen an, ist jeder Wert in beiden festgelegt und in beiden geprüft. Keine der beiden wird aus der anderen abgeleitet. Welche gilt, entscheidet der Nutzer.

## Warum

Die Wahl gehört dem Nutzer. Manche sehen auf hellem Grund besser, manche auf dunklem, manche wechseln mit der Tageszeit, und manche vertragen eine der beiden schlecht. Für sie ist es keine Geschmacksfrage. Erzwingt ein Produkt eine Erscheinung, entscheidet es für Menschen, deren Bedürfnisse es nicht kennt.

Die zweite Erscheinung lässt sich auch nicht aus der ersten errechnen. Auf dunklem Grund verhält sich die Wahrnehmung in mindestens drei Punkten anders.

**Helle Schrift auf dunklem Grund leuchtet aus.** Die Buchstaben wirken fetter und die Innenräume enger als dieselbe Schrift dunkel auf hell. Ein Schnitt, der hell gut sitzt, wirkt dunkel oft zu schwer.

**Gesättigte Farben flimmern auf Dunkel.** Ein kräftiges Blau, das auf Weiß ruhig liegt, vibriert auf Schwarz und ist anstrengend zu lesen. Auf Dunkel gehören dieselben Farben heller und weniger gesättigt.

**Schatten brauchen auf Dunkel eine andere Gewichtung.** Sie funktionieren dort, aber der Unterschied zwischen einer dunklen Fläche und einem dunklen Schatten ist klein. Derselbe Schatten, der auf Hell deutlich zu sehen ist, ist auf Dunkel praktisch unsichtbar. Auf Dunkel muss er also deutlich stärker ausfallen, und meist kommt die Helligkeit der Fläche als zweites Mittel dazu: was höher liegt, ist zusätzlich heller. Schatten-Token brauchen deshalb eigene Werte je Erscheinung, genau wie Farben.

Außerdem kann ein Kontrastverhältnis, das hell besteht, dunkel durchfallen und umgekehrt. Deshalb prüft man beide Erscheinungen einzeln.

## Kein reines Schwarz gegen reines Weiß

Weiße Schrift auf schwarzem Grund ist der höchstmögliche Kontrast. Gerade deshalb ist sie unangenehm. Die Schrift überstrahlt, die Augen ermüden schnell, und Menschen mit Astigmatismus können sie kaum lesen. Ein sehr dunkles Grau als Grund und ein leicht abgesenktes Weiß als Schrift lesen sich deutlich ruhiger.

Mehr Kontrast ist ab einem Punkt nicht mehr besser. Der Mindestwert ist eine Untergrenze, kein Ziel.

## Wer entscheidet

Voreingestellt gilt, was der Nutzer im Betriebssystem eingestellt hat. Damit hat er die Frage schon beantwortet, und das Produkt stellt sie nicht noch einmal.

Bietet das Produkt zusätzlich einen eigenen Schalter, überschreibt dieser die Systemeinstellung und bleibt erhalten. Er hat drei Stellungen: hell, dunkel und dem System folgen.

## Woran Du den Verstoß erkennst

- Die dunkle Erscheinung entsteht durch eine Umkehrung oder einen Filter über die ganze Oberfläche.
- Eine Farbe ist einmal festgelegt und wird in beiden Erscheinungen benutzt.
- Die Schatten-Token haben nur einen Wert, und im Dunklen ist die Tiefe deshalb verschwunden.
- Ein Text ist in einer Erscheinung gut lesbar und in der anderen grenzwertig.
- Die Seite steht auf reinem Schwarz, die Schrift auf reinem Weiß.
- Es gibt nur Screenshots aus einer Erscheinung. Dann wurde auch nur eine geprüft.

## Grenzen

Ein Produkt darf sich bewusst auf eine Erscheinung festlegen. Dann gilt die Regel nicht. Diese Festlegung sollte aber jemand bewusst getroffen haben. Sie sollte nicht dadurch entstehen, dass niemand an die zweite Erscheinung gedacht hat.

Marketing- und Titelseiten mit eigener Haut können bei einer Erscheinung bleiben, auch wenn die Anwendung dahinter beide kann.

## Verwandt

- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
- [[Fläche - Die Ebene folgt der Rolle, nicht der Schachtelung]]
- [[Zustand - Rot ist nicht ein Rot]]
