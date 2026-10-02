---
dateCreated: 2026-10-02
description: "Ansichts-Einstellungen bleiben auf der Seite und wirken sofort. Konfiguration bekommt eine eigene Seite mit Adresse und einem Speichern."
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

# Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben

> [!TIP] Regel
> Lass eine Einstellung auf der Seite, wenn sie drei Bedingungen erfüllt: Sie wirkt sofort, sie betrifft nur diese Ansicht, und sie braucht kein Speichern. Fehlt eine davon, ist sie Konfiguration und bekommt eine eigene Seite mit Adresse. Dort gibt es ein Formular und ein Speichern.

## Warum

Die beiden Arten unterscheiden sich darin, wann der Nutzer sie braucht. Eine Ansichts-Einstellung braucht er mitten in der Arbeit: Filter, Sortierung, Zeitraum, sichtbare Spalten, Einheit. Er sieht das Ergebnis sofort, also gehört sie dorthin, wo er hinschaut.

Eine Konfiguration legt er einmal fest und ändert sie selten: einen Abgabensatz, Kontonummern, eine Schwelle. Sie wirkt auf andere Seiten und oft auf andere Nutzer. Liegt sie aufklappbar auf einer Arbeitsseite, schiebt sie beim Öffnen die Arbeit aus dem Blick. Beim nächsten Mal findet sie niemand, weil sie hinter einem Pfeil liegt statt hinter einer Adresse.

Das Speichern ist das sicherste Zeichen. Braucht eine Einstellung einen Speichern-Knopf, ist sie ein Formular, und ein Formular braucht eine Adresse, wie bei [[Fluss - Ein Pop-up unterbricht, es führt nicht]]. Mehrere Speichern-Knöpfe auf einer Seite werfen die Frage auf, ob der untere auch das speichert, was oben geändert wurde.

## Der Schnitt

| Beispiel | wirkt sofort | nur diese Ansicht | ohne Speichern | Ort |
|---|---|---|---|---|
| Zeitraum, Filter, Sortierung | ja | ja | ja | auf der Seite |
| Schalter „Wochenenden ausblenden“ | ja | ja | ja | auf der Seite |
| Spaltenauswahl, die für den Nutzer gemerkt wird | ja | ja | ja, speichert beim Ändern | auf der Seite |
| Abgabensatz für alle Berechnungen | nein | nein | nein | eigene Seite |
| Kontonummern, aus denen eine Kennzahl rechnet | nein | nein | nein | eigene Seite |
| Benachrichtigungen | nein | nein | ja | eigene Seite, weil sie nicht zur Ansicht gehört |

## Mehrere Listen und Tabellen

Die Regel misst keine Länge und begrenzt keinen Inhalt. Eine Seite darf viele Listen und Tabellen zeigen. Sie begrenzt nur das Sammeln: Höchstens ein Bereich einer Seite sammelt Änderungen und speichert sie gemeinsam. Alles andere speichert beim Ändern oder zeigt nur an.

## Hart und weich

| | Status |
|---|---|
| Eine Ansichts-Einstellung bleibt auf der Seite und wirkt sofort | hart |
| Eine Konfiguration bekommt eine eigene Seite mit Adresse | hart |
| Höchstens ein Bereich pro Seite sammelt Änderungen für ein gemeinsames Speichern | hart |
| Wo die Einstellungsseite in der Navigation hängt | weich, Vorgabe im Bereich, von einer zentralen Einstellungsseite verlinkt |

## Woran Du den Verstoß erkennst

- Ein Abschnitt „Einstellungen“ mit Pfeil liegt über einer Tabelle.
- Ein Aufklappbereich hat einen eigenen Speichern-Knopf.
- Jeder Abschnitt einer Seite speichert für sich.
- Eine Konfiguration lässt sich nicht verlinken.
- Ein Filter oder eine Sortierung hat einen Speichern-Knopf. Das ist derselbe Fehler, nur andersherum.

## Grenzen

Aufklappen bleibt richtig für Hinweise, Erklärungen und die Details einer Tabellenzeile.

Ein leerer Zustand, dem eine Konfiguration fehlt, darf direkt zur Einstellungsseite führen. Siehe [[Fluss - Leer ist ein Zustand, keine Lücke]].

## Verwandt

- [[Fluss - Ein Pop-up unterbricht, es führt nicht]]
- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
