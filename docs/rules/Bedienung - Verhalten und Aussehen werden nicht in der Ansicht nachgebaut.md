---
dateCreated: 2026-08-27
description: Eine Ansicht setzt vorhandene Elemente zusammen. Sie definiert weder Verhalten noch Aussehen selbst.
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
---

# Verhalten und Aussehen werden nicht in der Ansicht nachgebaut

> [!TIP] Regel
> Eine Ansicht setzt vorhandene Elemente zusammen. Sie definiert weder ihr Verhalten noch ihr Aussehen neu. Wer in einer Ansicht Hover, Fokus, Fläche, Radius oder Padding von Hand schreibt, hat etwas nachgebaut, das an einer gemeinsamen Stelle schon festgelegt ist.

## Warum

Was in der Ansicht steht, bleibt bei der nächsten Änderung, wie es war. Niemand findet es, weil niemand weiß, dass es existiert. Niemand kann es zählen, weil es keinen Namen hat.

In einer gewachsenen Anwendung findet man schnell mehrere hundert solcher Stellen. Die Karte gibt es dann nicht als benanntes Aussehen, nur als Hunderte handgebauter Flächen mit uneinheitlichem Radius und Padding. Jede einzelne war richtig, als sie entstand. Zusammen ergeben sie kein System mehr. Jede Stelle legt anders fest, wie eine Karte aussieht.

Beim Verhalten ist es dasselbe, nur schwerer zu sehen. Schreibt eine Ansicht ihren eigenen Hover, hat sie das Drücken neu gebaut, mit eigener Dauer, Stufe und Richtung. Ändert sich die Regel im System, ändert sich diese Stelle nicht mit. Niemand merkt es, weil sie aussieht wie vorher.

Selten baut jemand absichtlich nach. Meist kann das vorhandene Aussehen eine Kleinigkeit nicht. Dann erweitert er dieses Aussehen oder benennt ein neues. Umgeht er es in der Ansicht, gibt es die Kleinigkeit ab jetzt zweimal.

## Woran Du den Verstoß erkennst

- Ein `Pressable` oder ein `div` mit `onClick` trägt in der Ansicht Fläche, Radius und Padding.
- Hover-, Fokus- oder Aktiv-Zustände stehen in einer Ansicht statt beim gemeinsamen Verhalten.
- Das Aussehen enthält Interaktions-Code, oder das Verhalten setzt Farben.
- Zwei Ansichten zeigen dasselbe Ding mit verschiedenem Radius oder Padding.
- Etwas wird kopiert und dann an einer Stelle angepasst.
- Die Anzahl der handgebauten Stellen lässt sich nicht mehr überblicken.

## Richtig / falsch

```tsx
// richtig — die Ansicht benutzt das vorhandene Element
<Button onPress={onSubmit}>Speichern</Button>

// falsch — die Ansicht baut Verhalten und Aussehen selbst
<Pressable
  onPress={onSubmit}
  className="rounded-md bg-blue-500 px-4 py-2 hover:bg-blue-600"
>
  <Text className="text-white">Speichern</Text>
</Pressable>
```

Ein häufiger Name wie Button ist in Ordnung. Er ist die Abkürzung für ein bekanntes Paar aus Verhalten und Aussehen, siehe [[Bedienung - Verhalten und Aussehen bleiben getrennt]].

## Grenzen

Eine Anordnung, die es genau einmal gibt, etwa eine bestimmte Kachel oder ein bestimmtes Kopfelement, gehört in den Bereichsordner ihres Themas. Das ist kein Verstoß. Sie setzt vorhandene Elemente zusammen. Sie legt kein neues Verhalten und kein neues Aussehen fest.

## Verwandt

- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
- [[Stack - Utility-Klassen statt Inline-Styles]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
