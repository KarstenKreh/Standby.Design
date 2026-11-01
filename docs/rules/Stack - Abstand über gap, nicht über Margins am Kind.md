---
dateCreated: 2026-08-27
description: Den Abstand zwischen Geschwistern setzt der Container, mit Flex und gap statt Margins oder space-y.
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
  - layout
---

# Abstand über gap, nicht über Margins am Kind

> [!TIP] Regel
> Setze Abstände zwischen Geschwistern über `flex` und `gap` am Container. Keine Margins am Kind, kein `space-y`.

## Warum

Ein Abstand beschreibt die Beziehung zwischen zwei Elementen. Er gehört zu keinem der beiden allein. Trägt das Kind den Abstand, bringt es ihn überall mit hin, auch dorthin, wo er nicht passt. Das letzte Kind hat dann einen ungewollten Abstand nach unten, den jemand mit `last:mb-0` wieder entfernt. Damit steht die Regel an zwei Stellen.

`gap` löst das an einer Stelle: der Container sagt, wie weit seine Kinder auseinanderstehen. Das letzte Kind braucht keine Sonderbehandlung, nichts wird zurückgesetzt, und keine Margins fallen zusammen.

Die Hilfsklasse `space-y` löst dasselbe Problem, aber über Margins an allen Kindern außer dem ersten. Sie bricht, sobald ein Kind bedingt gerendert wird oder ein Fragment dazwischenliegt, und sie funktioniert in React Native nicht.

## Woran Du den Verstoß erkennst

- `mb-*` oder `mt-*` an Kindern einer Liste.
- `last:mb-0`, `first:mt-0` oder `:not(:last-child)` als Korrektur.
- `space-y-*` an einem Container.
- Ein Abstand ist doppelt so groß wie gewollt, weil zwei Margins aufeinandertreffen.

## Richtig / falsch

```tsx
// richtig
<View className="flex flex-col gap-3">
  <Row />
  <Row />
</View>

// falsch
<View className="space-y-3">
  <Row className="mb-3" />
  <Row className="mb-3 last:mb-0" />
</View>
```

## Grenzen

Der Abstand einer Gruppe zu ihrem Umfeld ist kein Abstand zwischen Geschwistern. Er gehört als Padding in den Abschnitt, siehe [[Layout - Die Karte hat kein Padding]].

## Verwandt

- [[Layout - Erst Abstand, dann Fläche oder Linie]]
- [[Layout - Die Karte hat kein Padding]]
- [[Stack - Utility-Klassen statt Inline-Styles]]
