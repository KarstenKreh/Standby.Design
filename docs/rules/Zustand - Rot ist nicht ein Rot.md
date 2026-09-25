---
dateCreated: 2026-08-27
description: Dieselbe Bedeutung braucht verschiedene Werte, je nachdem worauf sie landet. Ein Wert kann nicht Text und Fläche zugleich sein.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - zustand
  - farbe
---

# Rot ist nicht ein Rot

> [!TIP] Regel
> Lege für jede Zustandsbedeutung — Fehler, Warnung, Erfolg, Hinweis — mehrere Werte fest, nicht einen. Welcher gilt, entscheidet der Untergrund, auf dem die Farbe landet.

## Warum

Nimm ein einziges Rot und lass es drei Aufgaben erledigen:

```
1  Fehlertext auf der Karte      Rot muss LESBAR sein
                                 → braucht viel Kontrast zur Karte

2  ruhiges Badge                 Fläche darf NICHT schreien
   ▸ Fläche                      → braucht wenig Kontrast zur Karte
   ▸ Text darauf                 → braucht viel Kontrast zur Fläche

3  voll roter Knopf              Text muss lesbar SEIN
   ▸ Fläche                      → das kräftige Rot
   ▸ Text darauf                 → helle Gegenfarbe
```

Aufgabe 1 verlangt viel Kontrast, Aufgabe 2 verlangt in derselben Zeile wenig **und** viel. Ein einziger Wert kann das nicht. Nimmt man ihn trotzdem, ist entweder der Text nicht zu lesen oder die Fläche zu laut — meistens beides an verschiedenen Stellen.

Das ist derselbe Gedanke wie bei heller und dunkler Erscheinung: dieselbe Bedeutung, verschiedene Werte, je nach Umgebung. Nur läuft die Unterscheidung hier nicht über den Modus, sondern über den Untergrund.

Fehlt diese Familie, wird pro Einsatzort geraten. Man landet bei Konstruktionen wie „die Grundfarbe mit zehn Prozent Deckkraft als Fläche und dieselbe Grundfarbe als Text darauf". Bei Rot sieht das gerade noch brauchbar aus, bei Gelb nicht mehr, und in der hellen Erscheinung bei keinem von beiden.

## Was eine Familie abdecken muss

| Fall | Was gebraucht wird |
|---|---|
| Text oder Icon direkt auf einer Fläche | ein Wert mit genug Kontrast zum Lesen |
| Ruhige Fläche, etwa Badge oder Chip | ein zurückgenommener Wert **plus** die dazu passende Schriftfarbe |
| Voll eingefärbte Fläche | der kräftige Wert **plus** eine Gegenfarbe für den Text darauf |

Wie die Werte heißen und wie viele es genau sind, entscheidet das Projekt. Dass es mehr als einen braucht, entscheidet der Kontrast.

## Woran Du den Verstoß erkennst

- Ein Badge wird aus der Grundfarbe mit Deckkraft und derselben Grundfarbe als Text gebaut.
- Ein voll eingefärbter Knopf hat weißen Text statt der zugehörigen Gegenfarbe.
- Dieselbe Zustandsfarbe steht einmal als Fläche und einmal als Fließtext, und beim Text muss man die Augen zusammenkneifen.
- Ein Zustand ist in einer Erscheinung gut lesbar und in der anderen nicht.

## Zustandsfarben neben Markenfarben

**Empfehlung, keine Vorschrift:** Grün und Rot möglichst nicht auch als Marken- oder Strukturfarbe einsetzen. Sonst kann der Nutzer nicht mehr unterscheiden, ob eine grüne Fläche etwas bedeutet oder nur zur Marke gehört — und wenn er das einmal falsch gelernt hat, übersieht er später die Fläche, die wirklich etwas bedeutet.

Ist die Marke nun einmal grün oder rot, ist das kein Grund, sie zu ändern. Dann braucht es zwei Dinge:

- Die Zustandsfarben liegen sichtbar neben der Markenfarbe, nicht auf ihr. Ein anderer Farbton, eine andere Sättigung, irgendetwas, das den Unterschied trägt.
- Der Zustand hängt nicht an der Farbe allein. Ein Zeichen, ein Wort oder ein Symbol trägt die Bedeutung mit, siehe [[Bedienung - Ein dauerhafter Zustand braucht ein zweites Zeichen]]. Das ist ohnehin schon Pflicht, hier wird es nur besonders wichtig.

## Grenzen

Auf einer Marketing- oder Titelseite mit eigener Haut gilt das nicht, dort regiert die Marke. Die Regel gilt für die Anwendung, in der Farbe eine Aussage über Daten ist.

## Verwandt

- [[Zustand - Dieselbe Zahl bedeutet überall dasselbe]]
- [[Bedienung - Ein dauerhafter Zustand braucht ein zweites Zeichen]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
