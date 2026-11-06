---
dateCreated: 2026-08-27
description: Mit einem Pop-up spricht das System den Nutzer an. Es ist für einen Hinweis da, der jetzt eine Entscheidung braucht. Alles, was der Nutzer selbst tun will, ist ein Screen.
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

Alles Weitere folgt aus diesem Punkt. Ein Pop-up unterbricht den Nutzer. Das darf die Anwendung nur, wenn sie ihm etwas sagen muss, das nicht warten kann. Mit einem Pop-up spricht die Anwendung den Nutzer an.

Bei einem Formular ist es umgekehrt. Dort arbeitet der Nutzer. Das Formular unterbricht ihn nicht, er ist dafür gekommen.

Ein Formular im Pop-up ist deshalb auch dann falsch, wenn das Pop-up größer wird, denn die Richtung stimmt nicht. Ein Pop-up hält den Nutzer an, im Formular soll er aber weiterarbeiten. Bei „Verlassen ohne zu speichern?" stimmt die Richtung. Die Anwendung sagt etwas, der Nutzer antwortet, und das Pop-up ist zu. Bei „Kontakt anlegen" stimmt sie nicht.

### Ein Pop-up verspricht Kürze und bricht das Versprechen

Ein Pop-up verdeckt alles andere. Damit verspricht es, dass es gleich wieder vorbei ist. Ein Formular hält die Anwendung aber minutenlang fest.

Das hat eine konkrete Folge. Was der Nutzer beim Ausfüllen braucht, liegt fast immer hinter dem Pop-up: die Liste, aus der er kommt, der Wert in der Tabelle daneben, der Name, den er gerade nachsehen wollte. **Er sieht es, kann es aber nicht bedienen.** Das Pop-up zeigt ihm den Zusammenhang und sperrt ihn zugleich. Bei einem Hinweis stört das nicht. Bei einer Aufgabe hindert es ihn an der Arbeit.

### Das Pop-up erzeugt seine eigene Nachfrage

Dass ein Formular dort nicht hingehört, zeigt das Muster selbst. Ein Formular im Pop-up braucht eine Warnung beim Schließen, denn die Eingaben verschwinden mit dem Fenster. Also legt man ein zweites Pop-up darüber: „Änderungen verwerfen?"

Das Pop-up braucht also ein zweites Pop-up, um ein Problem aufzufangen, das es selbst verursacht. Bei einem Screen ist die Frage weniger dringend, weil der Nutzer an diesen Ort zurückkommen kann.

### Tiefe hat keine Anzeige

Jede andere Form von Navigation zeigt dem Nutzer, wo er ist: ein Pfad, ein Zurück, ein aktiver Reiter. Für gestapelte Fenster gibt es das nicht. Nirgends auf dem Bildschirm steht, dass man im dritten gestapelten Fenster ist.

Deshalb hat Deine Frage keine gute Antwort: **ich bin in Fenster 3 und muss zurück nach Fenster 1.** Was passiert mit Fenster 2? Was mit dem, was in Fenster 3 schon eingegeben wurde? Was macht der Zurück-Knopf des Geräts? Das Problem liegt nicht darin, dass sich das schwer bauen lässt. Die Anwendung kann es dem Nutzer nicht zeigen, weil es keine Darstellung für Tiefe gibt.

### Ein Screen hat eine Adresse, ein Pop-up nicht

Alles, woran jemand länger als einen Moment arbeitet, muss adressierbar sein: verlinkbar, nach einem Absturz wiederherstellbar, im Verlauf auffindbar, an einen Kollegen schickbar. Ein Formular im Pop-up kann nichts davon. Es ist weg, sobald jemand danebentippt.

### Verschachtelte Pop-ups sind eine Sackgasse für die Tastatur

Ein Pop-up muss den Fokus einsperren, sonst tabbt man hinter das Fenster. Liegt eines im anderen, ist der Fokus doppelt eingesperrt. Wer nicht mit der Maus arbeitet, findet aus so einer Verschachtelung schwer wieder heraus. Bei einem einzelnen „Ja oder Nein" schadet das nicht. Bei einem Formular schon.

## Der Test

Zwei Fragen, in dieser Reihenfolge:

1. **Braucht es mehr als eine Eingabe?** Dann ist es ein Screen.
2. **Geht es um mehr als einen konkreten Hinweis?** Dann ist es ein Screen.

Bleibt beides „nein", darf es ein Pop-up sein. Der Test setzt die Richtungsfrage von oben praktisch um. Mit einer einzelnen Eingabe antwortet der Nutzer der Anwendung. Ab der zweiten arbeitet er. Der Test ist bewusst streng, weil sich gerade in Grenzfällen die Fenster zu stapeln beginnen.

## Was ein Pop-up darf

- Vor einem Verlust warnen und die Entscheidung einholen: verlassen ohne zu speichern, löschen, überschreiben
- Ein Ergebnis melden, das der Nutzer nicht übersehen darf und dessen Folge er bestätigen muss
- Genau einen Wert abfragen, wenn er allein steht und der Vorgang danach zu Ende ist

In allen drei Fällen redet die Anwendung, und der Nutzer antwortet mit einem Wort.

Solange ein Pop-up offen ist, reagiert nichts dahinter. Die Seite scrollt nicht mit, und weder Tab noch Screenreader erreichen etwas dahinter. Sonst bedient der Nutzer eine Seite, die er nicht sieht.

## Woran Du den Verstoß erkennst

- Im Pop-up stehen mehrere Eingabefelder oder ein „Speichern" für mehrere Werte.
- Aus einem Pop-up heraus öffnet sich ein zweites.
- Es gibt eine Warnung „Änderungen verwerfen?" beim Schließen eines Pop-ups.
- Das Pop-up hat Reiter, Schritte oder einen eigenen Scrollbereich.
- Der Zurück-Knopf des Geräts schließt etwas anderes als das, was der Nutzer erwartet.
- Der Zustand lässt sich nicht verlinken und kommt nach einem Neuladen nicht wieder.
- Das Pop-up hat eine Überschrift, die eigentlich ein Seitentitel ist.
- Hinter dem offenen Pop-up scrollt die Seite mit, oder Tab erreicht Elemente dahinter. Kein `inert` am Hintergrund, kein `overscroll-behavior: contain` im Pop-up.

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

Sie unterbrechen nicht, sie erweitern das Element darunter. Entscheidend ist die Richtung, die Technik ist dafür egal. Sie tun, was der Nutzer gerade will, und halten ihn nicht an.

Ein Panel, das von der Seite oder von unten einfährt, ist keine Ausnahme. Steht ein Formular darin, gilt die Regel genauso. Es hat keine Adresse und lässt sich genauso stapeln.

## Verwandt

- [[Bedienung - Der Fokus ist sichtbar und hat immer einen Ort]]
- [[Layout - Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um]]
- [[Bedienung - Klickbares hat eine Fläche, und nur Klickbares sieht so aus]]
