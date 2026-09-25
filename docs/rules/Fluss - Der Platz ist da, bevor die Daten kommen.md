---
dateCreated: 2026-08-27
description: Der Platz für Inhalt wird reserviert, bevor er eintrifft. Sehr kurze Wartezeiten zeigen gar nichts, lange sagen was passiert.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
korridor: 150-250ms bis zur ersten Anzeige
default: 200ms
tags:
  - design-system
  - design-rule
  - fluss
---

# Der Platz ist da, bevor die Daten kommen

> [!TIP] Regel
> Reserviere den Platz für Inhalt, bevor er eintrifft. Unter etwa 200 Millisekunden zeigst Du gar keinen Ladehinweis. Dauert es länger, zeigst Du die Form des kommenden Inhalts. Dauert es sehr lange, sagst Du, was passiert.

## Warum

### Nichts darf springen

Trifft der Inhalt ein und schiebt alles darunter nach unten, verliert der Nutzer seine Stelle. Schlimmer: er hat vielleicht schon gezielt und drückt jetzt auf etwas anderes, als er treffen wollte. Das ist kein Schönheitsfehler, das ist eine Fehlbedienung, die die Oberfläche verursacht hat.

Deshalb wird der Platz vorher belegt, in der Form, die der Inhalt haben wird. Ein Platzhalter, der die Umrisse des echten Aufbaus zeigt, tut zwei Dinge auf einmal: er hält den Platz und er sagt schon, was kommt.

### Ein Zeichen, das sofort wieder geht, stört mehr als die Wartezeit

Unter etwa einer Zehntelsekunde wirkt eine Reaktion unmittelbar, da braucht es gar keine Rückmeldung. Bis etwa einer Sekunde bleibt der Gedanke des Nutzers zusammenhängend, er wartet, ohne abzuschweifen. Erst darüber verliert er den Faden und braucht etwas, das ihn hält.

Ein Ladezeichen, das aufblitzt und sofort verschwindet, macht die Oberfläche deshalb nicht hilfreicher, sondern unruhiger. Es meldet ein Problem, das es nicht gab.

### Der Nutzer wartet auf einen Teil, nicht auf alles

Lädt ein Bereich, wird auch nur dieser Bereich als ladend gezeigt. Eine ganze Seite zu sperren, weil ein Diagramm noch rechnet, nimmt dem Nutzer alles andere weg, was schon da wäre.

## Die Stufen

| Dauer | Was Du zeigst |
|---|---|
| bis ~200 ms | nichts |
| ~200 ms bis ein paar Sekunden | die Form des kommenden Inhalts, an seinem Platz |
| darüber | zusätzlich, was gerade passiert, und wenn möglich wie weit |
| sehr lang oder unbestimmt | einen Weg heraus: abbrechen, später benachrichtigen, im Hintergrund weiterlaufen |

Die Zahlen sind eine Vorgabe. Hart ist die Staffelung: erst nichts, dann Form, dann Auskunft.

## Woran Du den Verstoß erkennst

- Der Inhalt trifft ein und schiebt die Seite nach unten.
- Ein Ladezeichen blitzt bei jedem Wechsel kurz auf.
- Ein einzelner ladender Bereich sperrt die ganze Ansicht.
- Der Platzhalter hat eine andere Höhe als der echte Inhalt.
- Bei einem langen Vorgang steht minutenlang ein sich drehender Kreis ohne Auskunft.
- Es gibt keine Möglichkeit, einen langen Vorgang zu verlassen.

## Grenzen

Beim ersten Start einer Anwendung, wenn noch gar keine Form bekannt ist, ist ein einfacher Ladehinweis in Ordnung. Die Regel greift dort, wo der Aufbau schon feststeht und nur die Daten fehlen.

Ein Vorgang, den der Nutzer selbst ausgelöst hat und dessen Ergebnis er abwartet — ein Export, eine Zahlung —, darf ihn festhalten. Er muss dann aber wissen, woran er ist.

## Verwandt

- [[Fluss - Leer ist ein Zustand, keine Lücke]]
- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
- [[Bedienung - Übergänge haben genau einen Wert]]
