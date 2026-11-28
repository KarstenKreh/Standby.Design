---
dateCreated: 2026-08-27
description: "Zustände und Datenreihen sind auch ohne Farbton erkennbar. Ein Merkmal reicht: Fläche, Rand, Strich, Punkt, Fett, Position oder Helligkeit."
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
  - daten
---

# Farbe trägt nie allein

> [!TIP] Regel
> Zeige jeden dauerhaften Zustand und jede Datenreihe so, dass man sie auch ohne Farbton erkennt. Bei Zuständen reicht ein Merkmal: eine eigene Fläche, ein Rand, ein Strich oder eine Unterstreichung, ein Punkt oder Balken, fette Schrift, ein gefülltes Icon, eine Position oder ein Helligkeitsunterschied von mindestens 3:1. Ein zweites Zeichen obendrauf braucht es nicht. Bei Datenreihen ist es eine direkte Beschriftung, die Form der Marker oder die Strichart. Nennt ein Text die Information schon, betont die Farbe nur und braucht kein Merkmal.

## Warum

Rund jeder zwölfte Mann sieht Rot und Grün nicht auseinander. Hebt sich ein aktiver Tab nur durch den Farbton der Schrift ab, kann dieser Mann ihn nicht von den vier anderen Tabs unterscheiden. Dasselbe gilt bei starkem Sonnenlicht, auf schlecht kalibrierten Bildschirmen und bei jedem, der die Ansicht nur kurz überfliegt.

Verboten ist nur der Farbton allein. Alles, was auch in Graustufen sichtbar bleibt, trägt den Zustand: eine Fläche, ein Rand, ein Gewicht, eine Position. Auch Helligkeit zählt. Unterscheiden sich zwei Farben in der Helligkeit um mindestens 3:1, ist das nach WCAG schon ein eigenes Merkmal.

Ein Merkmal genügt. Ein gewähltes Segment mit eigener Fläche braucht keinen Punkt dazu, ein fetter aktiver Tab keinen Strich. Mehrere Zeichen für denselben Zustand machen die Ansicht unruhig und sagen nichts Neues.

Für einen von zwölf Männern sehen Rot und Grün gleich aus. In einer Legende nur aus Farbfeldern kann er keine Reihe zuordnen.

## Was reicht

| Merkmal | Beispiel | Reicht, wenn |
|---|---|---|
| Eigene Fläche | gewähltes Segment, ausgewählte Kachel | die Fläche sich mit 3:1 vom Grund abhebt oder einen Rand mit 3:1 hat |
| Schatten | gewähltes Segment, das über der Leiste liegt | die Kante der Fläche 3:1 zum Grund erreicht. Ein weicher Schatten schafft das selten, und im dunklen Modus verschwindet er fast. Dann trägt ein zweites Merkmal den Zustand, etwa fette Schrift oder ein feiner Rand |
| Rand | gewählte Karte, Chip | der Rand 3:1 zum Grund hat und die anderen keinen tragen |
| Strich, Unterstreichung | Tab, Fließtext-Link | er mindestens 2 Pixel stark ist und 3:1 zum Grund hat |
| Punkt, Balken | Chip, Navigations-Zeile | er 3:1 zum Grund hat |
| Fette Schrift | Tab, Segment, Navigations-Zeile | das Gewicht um mindestens zwei Stufen springt, etwa von 400 auf 600, und die Breite für den fetten Schnitt reserviert ist |
| Gefülltes Icon | Tab-Leiste in der App | die inaktiven Icons nur umrandet sind |
| Position | Switch | der Knopf sichtbar die Seite wechselt |
| Helligkeit | Tab, Segment | aktiv und inaktiv mindestens 3:1 zueinander haben und beide die Kontrastgrenzen zum Grund einhalten |

Die Helligkeit allein ist die schwächste Wahl. Sie erfüllt die Regel, fällt beim Überfliegen aber am wenigsten auf. Nimm sie, wenn die Ansicht ruhig bleiben soll, und prüfe, ob der Zustand auf den ersten Blick klar ist.

## Der Test

Schalte die Ansicht auf Graustufen. Siehst Du auf einen Blick, welcher Tab, welches Segment, welche Kachel an ist, reicht das Merkmal. Siehst Du es erst beim zweiten Hinsehen, reicht es nicht.

## Vorgaben je Element

Weißt Du nicht, welches Merkmal passt, nimm diese.

| Element | Vorgabe |
|---|---|
| Switch | Position des Knopfs |
| Tab | Strich darunter oder fette Schrift |
| Segment | eigene Fläche, mit Schatten zusätzlich fette Schrift |
| Chip | eigene Fläche oder Punkt vorn |
| Navigations-Zeile | Balken links oder eigene Fläche |
| Fließtext-Link | Unterstreichung |
| Button, Icon-Button | — (kein dauerhafter Zustand) |
| Eingabefeld | — (der Zustand steht in Rand und Meldung) |
| Badge | — (nicht bedienbar) |

## Hart und weich

| | Status |
|---|---|
| Ein dauerhafter Zustand und eine Datenreihe sind in Graustufen erkennbar | hart |
| Das Merkmal hat 3:1 zum Grund oder zum anderen Zustand | hart |
| Welches Merkmal | weich, Vorgabe aus der Tabelle oben |
| Merkmal einer Datenreihe | weich, Vorgabe direkte Beschriftung am Ende der Linie |

## Woran Du den Verstoß erkennst

- Der aktive Tab unterscheidet sich nur im Farbton der Schrift.
- Eine ausgewählte Kachel hat nur eine getönte Fläche, die sich in Graustufen kaum abhebt.
- In Graustufen ist nicht mehr erkennbar, welches Element an ist. Das ist der schnellste Test.
- Ein Element trägt mehrere Zeichen für denselben Zustand, etwa Fläche, Strich und Punkt zugleich. Das ist derselbe Fehler, nur andersherum.
- Der aktive Tab wird fett, und die Tabs daneben rutschen zur Seite.
- Legende nur aus Farbkästchen.
- Zwei Linien, die sich nur im Farbton unterscheiden.
- Kreisdiagramm ohne Beschriftung an den Stücken.
- Benachbarte Reihen unter 3:1 zueinander.

## Grenzen

Für kurzzeitige Zustände wie Hover gilt die Regel nicht. Hover ist eine Rückmeldung auf eine Handlung, die gerade passiert, und der Nutzer weiß bereits, wo er ist.

Diagramme mit genau einer Reihe.

Farbe, die nur betont, was ein Text daneben schon sagt. Eine rote Kennzahl unter dem Titel „Frist überschritten“ braucht keinen zusätzlichen Punkt. Den Zustand trägt der Text, die Farbe lenkt nur den Blick. Ein Punkt in derselben Farbe würde ohnehin nichts unterscheiden, denn Warnung und Fehler sähen in Graustufen gleich aus.

## Quelle

WCAG 1.4.1 Use of Color mit der Erklärung „Understanding 1.4.1“: Ein Helligkeitsunterschied von mindestens 3:1 gilt als eigenes Merkmal. WCAG 1.4.11 Non-text Contrast. Vercel › Design („Accessible charts").

## Verwandt

- [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]]
- [[Zustand - Rot ist nicht ein Rot]]
- [[Farbe - Kontrast hat eine Untergrenze]]
- [[Zustand - Eine Bedeutung, überall gleich]]
