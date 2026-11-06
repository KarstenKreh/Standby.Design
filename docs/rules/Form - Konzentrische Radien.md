---
dateCreated: 2026-08-27
description: Zwei ineinanderliegende Rundungen brauchen denselben Mittelpunkt. Der Innenradius ist der Außenradius minus dem Abstand.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - form
---

# Konzentrische Radien

> [!TIP] Regel
> Liegt eine gerundete Fläche in einer anderen, rechne den Innenradius aus: `r_innen = r_außen − Abstand`. Beide Rundungen haben dann denselben Mittelpunkt.

## Warum

Haben zwei Rundungen verschiedene Mittelpunkte, wird der Spalt zwischen ihnen in der Ecke breiter oder schmaler als an der geraden Kante. Das fällt auch dem auf, der den Grund nicht kennt. Die Ecke wirkt gequetscht oder ausgefranst. Mit demselben Mittelpunkt bleibt der Spalt rundherum gleich breit, und die innere Fläche sitzt sauber in der äußeren.

Fast immer entsteht der Fehler, weil innen und außen derselbe Radius steht. Das liegt nahe, doch gerade dann weicht der Spalt in der Ecke am stärksten ab.

## Woran Du den Verstoß erkennst

- Innere und äußere Fläche haben denselben Radius-Wert.
- Der innere Radius ist größer als der äußere.
- Die Ecke sieht bei genauem Hinsehen enger aus als die Gerade daneben.
- Zwei Buttons in einer Zeile haben verschiedene Radien.
- Eine Ansicht setzt den Radius eines Buttons, Feldes oder einer Auswahl selbst.

## Richtig / falsch

```
 ╭─────────────────────────╮   r_außen = 12
 │  ╭───────────────────╮  │   Abstand =  4
 │  │                   │  │   r_innen =  8
 │  ╰───────────────────╯  │
 ╰─────────────────────────╯
      gleicher Mittelpunkt

 ╭─────────────────────────╮   r_außen = 12
 │  ╭───────────────────╮  │   Abstand =  4
 │  │                   │  │   r_innen = 12  ← falsch
 │  ╰───────────────────╯  │
 ╰─────────────────────────╯
      Spalt läuft in der Ecke zusammen
```

## Die Menge der Radien ist geschlossen

Damit die Rechnung überhaupt aufgehen kann, muss es eine begrenzte, benannte Menge an Radien geben. Sonst entsteht mit jedem Einzelfall eine neue Rundung, und zwei Werte, die zusammengehören sollen, sind nie wieder dieselben.

Meist entstehen Radien außerhalb der Skala so: Eine Utility-Klasse für einen mittleren Radius wird überall benutzt, ist in der Konfiguration aber nicht definiert. Sie fällt deshalb auf den Standardwert des Frameworks zurück. Daneben steht eine Stufe aus dem eigenen System. So gibt es zwei Rundungen ohne gemeinsame Skala, und niemand hat das je entschieden.

Wie viele Stufen es gibt und ob sie mit der Verschachtelungstiefe kleiner werden, entscheidet das Projekt. Manche Systeme nutzen einen einzigen Radius für alles. Auch das ist zulässig.

## Gleiche Zeile, gleicher Radius

Bedienelemente, die nebeneinander stehen, haben alle denselben Radius. Verschiedene Radien in einer Reihe sind ein Verstoß. Der Radius gehört dem Bauteil. Eine Ansicht überschreibt ihn nicht, auch nicht, damit eine Gruppe „dichter“ wirkt. Ein Knopf im Rahmen eines Feldes ist das innere Element und folgt der Rechnung oben: Feld 8, Abstand 4, Knopf 4.

## Grenzen

Die Rechnung greift nur, wenn der Abstand **kleiner** als der Außenradius ist. Ein Element mit 16 Abstand zur Kante liegt bei einem Außenradius von 12 rechnerisch außerhalb der Rundung, die Formel ergibt einen negativen Wert. Es ist dann weit genug von der Ecke entfernt, dass Konzentrik keine Rolle mehr spielt, und nimmt einfach eine Stufe aus der Menge.

Volle Rundungen bei Pills und Avataren sind eine eigene Form und keine Stufe. Für sie gilt die Rechnung nicht.

## Verwandt

- [[Layout - Die Karte hat kein Padding]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
