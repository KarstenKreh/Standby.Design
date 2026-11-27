---
dateCreated: 2026-11-28
description: "Jede eigenständige Entität hat einen eigenen Screen mit Adresse und allen Details. Listen zeigen nur die Kurzform. Ein Teil bleibt auf dem Screen seiner Entität."
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

# Eine Entität hat ihren Screen, ein Teil bleibt bei ihr

> [!TIP] Regel
> Gib jeder eigenständigen Entität einen eigenen Screen mit Adresse. Dort stehen alle ihre Details. Eine Liste oder Tabelle zeigt Entitäten nur in Kurzform und führt zum Screen. Ein Teil bleibt auf dem Screen der Entität, zu der es gehört.

## Warum

Eine Anwendung besteht aus Dingen, die der Nutzer beim Namen nennt: ein Gespräch, ein Kontakt, eine Rechnung. Das sind die Entitäten. Der Nutzer sucht sie, öffnet sie und schickt sie weiter. Dafür braucht jede einen Ort mit Adresse, einem Zurück und einem Titel.

Stehen zwei Entitäten mit allen Details auf einem Screen, hat keine von beiden diesen Ort. Der Titel passt nur zu einer, und der Link zeigt auf beide. Jede neue Funktion landet dann auf derselben Seite, weil sie schon da ist. So bläht eine Seite auf. Statt einer neuen Ebene entsteht ein Knopf, der ein Menü öffnet, das wieder ein Menü öffnet.

Wer zuerst die Entitäten benennt und dann die Screens baut, muss diese Frage nicht bei jeder Funktion neu stellen. Die Screens folgen aus den Entitäten.

## Entität oder Teil

Nicht alles, was einen Namen hat, ist eine Entität. Ein Teil existiert nur innerhalb einer Entität und hat keinen eigenen Ort.

| | Eigenständige Entität | Teil |
|---|---|---|
| Existiert ohne etwas anderes | ja | nein, nur innerhalb einer Entität |
| Der Nutzer sucht es für sich | ja | nein |
| Taucht an mehreren Stellen auf | oft | nie |
| Wird die Entität gelöscht | bleibt es | ist es weg |
| Ort | eigener Screen | Screen seiner Entität |

Der Test: **Würde der Nutzer das Ding außerhalb seiner Umgebung suchen?** Wenn ja, ist es eine Entität.

Beispiel Transkript-Editor: Das Gespräch ist die Entität. Absätze, Sprecherwechsel und Kommentare an Textstellen sind Teile. Sie bleiben im Editor, auch in einer ausklappbaren Spalte. Ein Sprecher ist ein Teil, solange er nur in diesem Gespräch vorkommt. Gibt es ein Verzeichnis der Sprecher über alle Gespräche, wird er zur Entität. Dann zeigt der Editor nur Name und Farbe, die Details stehen auf dem Screen des Sprechers.

## Hart und weich

| | Status |
|---|---|
| Jede eigenständige Entität hat einen eigenen Screen mit Adresse | hart |
| Alle Details einer Entität stehen nur auf ihrem Screen | hart |
| Eine Liste zeigt die Kurzform und führt zum Screen | hart |
| Ein Teil bekommt keinen eigenen Screen | hart |
| Welche Felder die Kurzform zeigt | weich, Vorgabe: was zum Wiedererkennen und Auswählen nötig ist |

## Woran Du den Verstoß erkennst

- Ein Screen hat zwei Titel, oder der Titel braucht ein „und“.
- Eine Tabellenzeile klappt auf und zeigt alle Details einer Entität mit eigenen Aktionen.
- Eine Zeile trägt mehr als zwei, drei Aktionen statt eines Wegs zum Detail.
- Eine Entität lässt sich nicht verlinken.
- Die Details einer Entität stehen in einem Pop-up oder in einem Panel ohne Adresse.
- Ein Kommentar, ein Absatz oder eine Zeile hat einen eigenen Screen, obwohl niemand es außerhalb seiner Entität sucht.

## Richtig / falsch

```
        RICHTIG                             FALSCH

  ┌───────────────────────┐           ┌───────────────────────┐
  │ Kontakte              │           │ Kontakte              │
  │ Anna Berg       ›     │           │ ▾ Anna Berg           │
  │ Tom Kraus       ›     │           │   Mail  [_________]   │
  │ Lea Sommer      ›     │           │   Firma [_________]   │
  └───────────────────────┘           │   Notizen, Termine …  │
             │                        │   [Speichern] [⋯]     │
             ▼                        │ ▾ Tom Kraus           │
  ┌───────────────────────┐           │   Mail  [_________]   │
  │ ‹ Kontakte            │           │   …                   │
  │ Anna Berg             │           └───────────────────────┘
  │ Mail, Firma, Notizen, │            zwei Entitäten mit allen
  │ Termine               │            Details auf einem Screen,
  └───────────────────────┘            keine hat eine Adresse
   Liste in Kurzform,
   Detail mit eigener Adresse
```

## Grenzen

- **Vergleich:** Zwei Entitäten stehen nebeneinander mit allen Details, wenn Vergleichen der Anlass ist.
- **Liste und Detail nebeneinander** auf breiten Bildschirmen, wie im Mail-Programm. Es bleibt ein Detail zur Zeit, und es hat eine eigene Adresse.
- **Übersichten und Dashboards** zeigen viele Entitäten in Kurzform. Das ist eine Liste und kein Verstoß.

Innerhalb einer Entität entscheidet [[Fluss - Der Anlass schneidet, die Menge wählt die Form]], ob sie einen Screen oder mehrere bekommt.

## Quelle

Sophia Prater, Object-Oriented UX: erst die Objekte und ihre Beziehungen, dann die Screens. Eric Evans, Domain-Driven Design (2003), Aggregat: ein Teil lebt nur innerhalb seiner Wurzel. Die Übertragung des Aggregats auf Screens ist eine Einschätzung dieser Sammlung.

## Verwandt

- [[Fluss - Der Anlass schneidet, die Menge wählt die Form]]
- [[Fluss - Ein Pop-up unterbricht, es führt nicht]]
- [[Fluss - Der Zustand der Ansicht steht in der Adresse]]
