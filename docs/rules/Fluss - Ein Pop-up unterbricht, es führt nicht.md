---
dateCreated: 2026-08-27
description: Ein Pop-up gehört dem System, nicht dem Nutzer. Es ist für einen Hinweis da, der jetzt eine Entscheidung braucht. Alles, was der Nutzer selbst tun will, ist ein Screen.
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - fluss
---

# Ein Pop-up unterbricht, es führt nicht

> [!TIP] Regel
> Benutze ein Pop-up nur, um den Nutzer auf genau eine Sache aufmerksam zu machen, die jetzt eine Entscheidung braucht. Sobald mehr als eine Eingabe nötig ist oder es um mehr als einen konkreten Hinweis geht, wird daraus ein eigener Screen. Ein Pop-up ist nie eine Eingabemaske.

## Warum

### Ein Pop-up gehört dem System, nicht dem Nutzer

Das ist der Kern, und alles Weitere folgt daraus. Ein Pop-up ist eine Unterbrechung, und unterbrechen darf nur, wer etwas zu sagen hat, das nicht warten kann. Es ist das Werkzeug, mit dem die Anwendung den Nutzer anspricht.

Ein Formular ist das Gegenteil. Da spricht nicht die Anwendung, da arbeitet der Nutzer. Es ist keine Unterbrechung, sondern das, weswegen er gekommen ist.

Ein Formular in einem Pop-up hat deshalb nicht die falsche Größe, sondern die falsche Richtung. Es benutzt das Werkzeug für das Anhalten, um jemanden weitergehen zu lassen. „Verlassen ohne zu speichern?" ist richtig herum: die Anwendung sagt etwas, der Nutzer antwortet, es ist vorbei. „Kontakt anlegen" ist verkehrt herum.

### Ein Pop-up verspricht Kürze und bricht das Versprechen

Wer alles andere wegnimmt, geht einen Handel ein: das hier ist gleich vorbei. Ein Formular hält die Anwendung stattdessen minutenlang fest.

Der Preis dafür ist konkreter, als er klingt. Was der Nutzer beim Ausfüllen braucht, liegt fast immer hinter dem Pop-up: die Liste, aus der er kommt, der Wert in der Tabelle daneben, der Name, den er gerade nachsehen wollte. **Er sieht es. Er kann es nicht anfassen.** Das Pop-up zeigt ihm den Zusammenhang und verbietet ihn gleichzeitig. Bei einem Hinweis stört das nicht, bei einer Aufgabe ist es genau das Falsche.

### Das Pop-up erzeugt seine eigene Nachfrage

Der beste Beweis, dass ein Formular dort nicht hingehört, liefert das Muster selbst. Ein Formular im Pop-up braucht eine Warnung beim Schließen, denn die Eingaben verschwinden mit dem Fenster. Also legt man ein zweites Pop-up darüber: „Änderungen verwerfen?"

Das Muster braucht sich selbst, um den Schaden zu heilen, den es selbst anrichtet. Bei einem Screen stellt sich die Frage gar nicht erst so scharf, weil er einen Ort hat, an den man zurückkommt.

### Tiefe hat keine Anzeige

Jede andere Form von Navigation zeigt dem Nutzer, wo er ist: ein Pfad, ein Zurück, ein aktiver Reiter. Für gestapelte Fenster gibt es das nicht. Nirgends auf dem Bildschirm steht, dass man drei Ebenen tief steckt.

Deshalb hat Deine Frage keine gute Antwort: **ich bin in Fenster 3 und muss zurück nach Fenster 1.** Was passiert mit Fenster 2? Was mit dem, was in Fenster 3 schon eingegeben wurde? Was macht der Zurück-Knopf des Geräts? Das Problem ist nicht, dass sich das schwer bauen lässt. Das Problem ist, dass es dem Nutzer nicht gezeigt werden kann, weil es keine Darstellung für Tiefe gibt.

### Ein Screen hat eine Adresse, ein Pop-up nicht

Alles, woran jemand länger als einen Moment arbeitet, muss adressierbar sein: verlinkbar, nach einem Absturz wiederherstellbar, im Verlauf auffindbar, an einen Kollegen schickbar. Ein Formular im Pop-up kann nichts davon. Es existiert nur, solange niemand danebentippt.

### Verschachtelte Pop-ups sind eine Sackgasse für die Tastatur

Ein Pop-up muss den Fokus einsperren, sonst tabbt man hinter das Fenster. Liegt eines im anderen, liegen zwei Fallen ineinander. Wer nicht mit der Maus arbeitet, findet aus so einer Verschachtelung schwer wieder heraus. Für ein einzelnes „Ja oder Nein" ist die Falle harmlos, für ein Formular ist sie es nicht.

## Der Test

Zwei Fragen, in dieser Reihenfolge:

1. **Braucht es mehr als eine Eingabe?** Dann ist es ein Screen.
2. **Geht es um mehr als einen konkreten Hinweis?** Dann ist es ein Screen.

Bleibt beides „nein", darf es ein Pop-up sein. Der Test ist die praktische Fassung der Richtungsfrage von oben: eine einzelne Antwort gibt der Nutzer der Anwendung, ab der zweiten arbeitet er. Er ist bewusst scharf, weil die Grauzone genau der Ort ist, an dem die Fenster anfangen sich zu stapeln.

## Was ein Pop-up darf

- Vor einem Verlust warnen und die Entscheidung einholen: verlassen ohne zu speichern, löschen, überschreiben
- Ein Ergebnis melden, das der Nutzer nicht übersehen darf und dessen Folge er bestätigen muss
- Genau einen Wert abfragen, wenn er allein steht und der Vorgang danach zu Ende ist

In allen drei Fällen redet die Anwendung, und der Nutzer antwortet mit einem Wort.

## Woran Du den Verstoß erkennst

- Im Pop-up stehen mehrere Eingabefelder oder ein „Speichern" für mehrere Werte.
- Aus einem Pop-up heraus öffnet sich ein zweites.
- Es gibt eine Warnung „Änderungen verwerfen?" beim Schließen eines Pop-ups.
- Das Pop-up hat Reiter, Schritte oder einen eigenen Scrollbereich.
- Der Zurück-Knopf des Geräts schließt etwas anderes als das, was der Nutzer erwartet.
- Der Zustand lässt sich nicht verlinken und kommt nach einem Neuladen nicht wieder.
- Das Pop-up hat eine Überschrift, die eigentlich ein Seitentitel ist.

## Richtig / falsch

```
        RICHTIG                             FALSCH

  ┌───────────────────────┐           ┌───────────────────────┐
  │ Kontakt bearbeiten    │           │ Kontakte              │
  │                       │           │  ┌──────────────────┐ │
  │ Name   [__________]   │           │  │ Bearbeiten       │ │
  │ Mail   [__________]   │           │  │ Name [________]  │ │
  │ Rolle  [__________]   │           │  │  ┌─────────────┐ │ │
  │                       │           │  │  │ Rolle wählen│ │ │
  │        [ Speichern ]  │           │  │  │  ┌────────┐ │ │ │
  └───────────────────────┘           │  │  │  │ Sicher?│ │ │ │
   eigener Screen, hat eine           │  │  │  └────────┘ │ │ │
   Adresse, Zurück ist klar           │  │  └─────────────┘ │ │
                                      │  └──────────────────┘ │
  ┌───────────────────────┐           └───────────────────────┘
  │ Ohne Speichern raus?  │            Fenster 3 zurück nach 1:
  │  [Abbrechen] [Raus]   │            keine gute Antwort
  └───────────────────────┘
   ein Hinweis, eine Entscheidung
```

## Grenzen

Nicht jedes Ding, das über dem Inhalt liegt, ist ein Pop-up im Sinne dieser Regel. Ausgenommen sind Elemente, die zu einem Bedienelement gehören und mit ihm verschwinden:

- Tooltip und Hinweis am Element
- Aufklappmenü und Auswahlliste
- Datums- und Zeitauswahl an einem Feld
- Kurzmeldung, die von selbst geht und nichts blockiert

Sie unterbrechen nicht, sie erweitern das Element darunter. Der Unterschied ist nicht die Technik, sondern die Richtung: sie tun, was der Nutzer gerade will, statt ihn anzuhalten.

Ein Panel, das von der Seite oder von unten einfährt, ist kein Schlupfloch. Steht ein Formular darin, gilt die Regel genauso: es hat keine Adresse und stapelt genauso.

## Verwandt

- [[Bedienung - Fokus ist immer sichtbar]]
- [[Layout - Jede Ansicht bricht bei 320 Pixeln um]]
- [[Bedienung - Klickbares braucht eine Fläche]]
