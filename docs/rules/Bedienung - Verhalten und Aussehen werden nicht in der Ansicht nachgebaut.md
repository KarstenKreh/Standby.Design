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

Was in der Ansicht steht, bekommt die nächste Änderung nicht mit. Es ist nicht auffindbar, weil niemand weiß, dass es existiert, und es ist nicht zählbar, weil es keinen Namen hat.

In einer gewachsenen Anwendung findet man dafür schnell mehrere hundert Stellen: die Karte gibt es gar nicht als benanntes Aussehen, sondern als Hunderte handgebauter Flächen mit uneinheitlichem Radius und Padding. Jede einzelne war zum Zeitpunkt ihrer Entstehung richtig. Zusammen ergeben sie kein System mehr, sondern mehrere hundert Meinungen darüber, wie eine Karte aussieht.

Beim Verhalten ist es dasselbe, nur unsichtbarer. Schreibt eine Ansicht ihren eigenen Hover, hat sie das Drücken neu gebaut — mit eigener Dauer, eigener Stufe und eigener Richtung. Ändert sich die Regel im System, ändert sich diese Stelle nicht mit, und niemand merkt es, weil sie ja aussieht wie vorher.

Der Nachbau passiert selten aus Absicht. Er passiert, weil das vorhandene Aussehen eine Kleinigkeit nicht kann. Genau dann ist der richtige Schritt, dieses Aussehen zu erweitern oder ein neues zu benennen — nicht, es in der Ansicht zu umgehen. Sonst gibt es die Kleinigkeit ab jetzt zweimal.

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

Eine Anordnung, die es genau einmal gibt — eine bestimmte Kachel, ein bestimmtes Kopfelement —, gehört in den Bereichsordner ihres Themas. Das ist kein Verstoß: sie setzt vorhandene Elemente zusammen. Sie legt kein neues Verhalten und kein neues Aussehen fest.

## Verwandt

- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
- [[Stack - Utility-Klassen statt Inline-Styles]]
- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
