---
dateCreated: 2026-08-27
description: Bei 320 CSS-Pixeln Breite bricht der Inhalt um, ohne waagerecht zu scrollen. Das ist kein Gerätemaß, sondern WCAG 1.4.10 Reflow.
type: design-rule
scope: universal
applies-to:
  - web
status: active
tags:
  - design-system
  - design-rule
  - layout
  - accessibility
---

# Jede Ansicht bricht bei 320 Pixeln um

> [!TIP] Regel
> Bau jede Ansicht so, dass der Inhalt bei einer Breite von 320 CSS-Pixeln umbricht, ohne dass man waagerecht scrollen muss. Nichts wird abgeschnitten, nichts überlappt, nichts schiebt die Seite zur Seite. Halte das von Anfang an ein, statt es später nachzurüsten.

## Warum

Die 320 kommen nicht vom kleinsten Telefon. Sie kommen aus **WCAG 2.1, Erfolgskriterium 1.4.10 Reflow**, Stufe AA, und die Rechnung dahinter ist: 1280 Pixel bei 400 Prozent Vergrößerung ergeben ein Sichtfenster von 320 Pixeln.

Der Nutzer, um den es geht, sitzt also meistens gar nicht am Telefon. Er sitzt am großen Bildschirm und hat stark vergrößert, weil er sonst nichts lesen kann. Für ihn ist ein waagerechter Schieber kein Schönheitsfehler: er muss dann bei jeder einzelnen Zeile hin und her schieben, um sie zu Ende zu lesen. Das macht niemand lange mit.

Dass die Regel damit auch kleine Geräte abdeckt, ist ein Nebeneffekt und kein Grund. Der Grund altert nicht mit der nächsten Gerätegeneration.

Und sie von Anfang an einzuhalten ist billiger als nachzurüsten. Beim Nachrüsten stehen die Entscheidungen schon fest — die vierspaltige Kachelreihe, die Werkzeugleiste mit acht Elementen, die Tabelle mit zwölf Spalten —, und jede davon muss einzeln aufgebrochen werden. Wer früh bei 320 prüft, trifft diese Entscheidungen gar nicht erst.

## Was die Regel verlangt und was nicht

Verlangt ist **Benutzbarkeit**, nicht Schönheit. Es darf eng aussehen. Es darf gestapelt aussehen. Es darf nach Notlösung aussehen. Was nicht sein darf: abgeschnittener Inhalt, überlappende Elemente, ein Schieber unter der ganzen Seite, unerreichbare Bedienelemente.

## Woran Du den Verstoß erkennst

- Bei 320 Pixeln erscheint ein waagerechter Schieber unter der ganzen Seite statt unter dem breiten Element.
- Eine Filter- oder Buttonzeile schiebt sich aus dem Bild, weil der Umbruch fehlt.
- Ein Overlay steht bündig an den Bildschirmkanten oder ist höher als das Fenster und nicht scrollbar.
- Die Ansicht rechnet mit `vh` und springt beim Ein- und Ausblenden der Browserleiste.
- Beim Vergrößern auf 400 Prozent am Desktop bricht die Ansicht auseinander, obwohl sie am Telefon in Ordnung aussieht.

## Die Baseline

| Bereich | Verhalten unter der Grenze |
|---|---|
| Seitenleiste | Ab der Desktop-Grenze feste Spalte, darunter ausfahrbares Panel mit Auslöser im Kopfbereich. Das Panel zeigt immer volle Beschriftungen, der eingeklappte Desktop-Zustand greift dort nicht |
| Tabellen | Eigener Wrapper mit waagerechtem Scrollen, Spalten schrumpfen nicht |
| Overlays | Container mit Außenabstand, Panel volle Breite bis zu einer Höchstbreite, Höhe begrenzt und innen scrollbar |
| Raster | Stapeln nach unten. Kachel- und Kennzahlraster dürfen zweispaltig bleiben |
| Filter- und Buttonzeilen | Umbrechen, Reiterleisten alternativ waagerecht scrollen |
| Höhen | Dynamische Viewport-Einheiten statt fester, wo die Browserleiste hineinspielt |

## Grenzen

WCAG nimmt ausdrücklich aus, was zwingend zwei Dimensionen braucht: Tabellen, Landkarten, Zeitraster, Notensatz, Diagramme. Diese Inhalte dürfen scrollen. Der Schieber gehört dann aber an den Inhalt und nicht unter die Anwendung: der Nutzer soll die Tabelle schieben, nicht die Seite mitsamt Kopfbereich und Seitenleiste.

Ein Werkzeug, das ohne Fläche sinnlos ist, darf schmal eine ehrliche Ersatzansicht zeigen. Der Hinweis „Diese Ansicht braucht ein größeres Fenster" ist erlaubt, das stumme Abschneiden nicht.

## Verwandt

- [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]]
- [[Fluss - Ein Pop-up unterbricht, es führt nicht]]
