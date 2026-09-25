---
dateCreated: 2026-08-27
description: Gestaltung läuft über Utility-Klassen. Inline-Styles und Style-Objekte sind ein Ausstieg aus dem Design-System.
type: design-rule
scope: stack
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - stack
---

# Utility-Klassen statt Inline-Styles

> [!TIP] Regel
> Setze jede Gestaltung über Utility-Klassen. Keine Inline-Styles, keine Style-Objekte, keine festen Farbwerte im Markup.

## Warum

Ein Inline-Style ist der bequemste Weg an allen Regeln vorbei. Er kennt keine Tokens, keine Breakpoints, keinen hellen Modus und keine Zustände. Er gewinnt außerdem gegen jede Klasse, sodass eine spätere Korrektur über das System nicht mehr greift — die Stelle ist tot für jede Änderung, die nicht genau dort ansetzt.

Utility-Klassen sind dagegen durchsuchbar. Man findet alle Stellen mit einem bestimmten Abstand, kann sie zählen und in einem Zug umstellen. Das ist der Unterschied zwischen einem System und einer Sammlung von Einzelfällen.

## Woran Du den Verstoß erkennst

- `style={{ … }}` in einer Komponente.
- `StyleSheet.create` neben `className` in derselben Datei.
- Farbwerte, Abstände oder Schriftgrößen direkt im Markup.

## Richtig / falsch

```tsx
// richtig
<View className="flex-1 bg-card p-4">
  <Text className="text-lg font-semibold text-foreground">Hallo</Text>
</View>

// falsch
<View style={{ flex: 1, backgroundColor: "#ffffff", padding: 16 }}>
  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111" }}>Hallo</Text>
</View>
```

## Grenzen

Werte, die zur Laufzeit berechnet werden — die Breite eines Balkens aus einem Prozentwert, eine Position aus einer Messung —, gehören in einen Style. Sie sind Daten, keine Gestaltung. Alles andere daneben bleibt in Klassen.

## Verwandt

- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
- [[Stack - Abstand über gap, nicht über Margins am Kind]]
- [[Bedienung - Verhalten und Aussehen werden nicht in der Ansicht nachgebaut]]
