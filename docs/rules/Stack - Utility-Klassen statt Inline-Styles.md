---
dateCreated: 2026-08-27
description: Gestaltung läuft über Utility-Klassen. Inline-Styles und Style-Objekte umgehen das Design-System.
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
> Setze jede Gestaltung über Utility-Klassen. Keine Inline-Styles, keine Style-Objekte.

## Warum

Mit einem Inline-Style umgeht man am bequemsten alle Regeln. Er kennt keine Tokens, keine Breakpoints, keinen hellen Modus und keine Zustände. Er hat außerdem Vorrang vor jeder Klasse. Eine spätere Korrektur über das System greift dort deshalb nicht mehr. Die Stelle ändert sich nur noch, wenn jemand genau dort ansetzt.

Utility-Klassen sind dagegen durchsuchbar. Man findet alle Stellen mit einem bestimmten Abstand, kann sie zählen und in einem Zug umstellen. So lässt sich die Gestaltung als System pflegen. Inline-Styles bleiben eine Sammlung von Einzelfällen.

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

Manche Werte werden erst zur Laufzeit berechnet, etwa die Breite eines Balkens aus einem Prozentwert oder eine Position aus einer Messung. Sie gehören in einen Style. Sie sind Daten, keine Gestaltung. Alles andere daneben bleibt in Klassen.

## Verwandt

- [[Farbe - Werte kommen aus Tokens, nie aus der Hand]]
- [[Stack - Abstand über gap, nicht über Margins am Kind]]
- [[Bedienung - Verhalten und Aussehen werden nicht in der Ansicht nachgebaut]]
