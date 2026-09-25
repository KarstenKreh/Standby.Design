---
dateCreated: 2026-08-27
description: Persönliche Haltung, keine Design-Regel. Cellular Design gegen Atomic Design. Ein Body differenziert sich über Role und Skin, statt als fertiges Atom kombiniert zu werden.
type: concept
status: active
aliases:
  - 01 Grundlagen - Body, Role und Skin
source: "[[From Atoms to Cells - An Aristotelian Revolution for UI Design]] · [[Cellular Design - Umsetzungsplan Rollen, Skins und Grammatik]]"
tags:
  - design-system
  - cellular-design
  - philosophie
---

# Body, Role und Skin

```
        ╔═══════════════════════════════════════╗
        ║ ┌───────────────────────────────────┐ ║
        ║ │                                   │ ║
        ║ │         ╭───────────────╮         │ ║
        ║ │         │   Speichern   │         │ ║
        ║ │         ╰───────────────╯         │ ║
        ║ │                                   │ ║
        ║ │     Ceci n'est pas un bouton.     │ ║
        ║ │                                   │ ║
        ║ └───────────────────────────────────┘ ║
        ╚═══════════════════════════════════════╝
```

> [!QUOTE] Ceci n'est pas un bouton
> Magritte malt eine Pfeife und schreibt darunter: dies ist keine Pfeife. Er hat recht. Es ist das Bild einer Pfeife. Man kann sie nicht stopfen.
>
> Mit dem Button ist es genauso. Was wir Button nennen, ist kein Ding. Es ist das Bild eines Zustands: ein Body, der gerade drückbar ist und gerade so aussieht. Wir haben diesen einen Moment eingefroren, in eine Bibliothek gelegt und ihm einen Namen gegeben. Danach haben wir den Namen für die Sache gehalten.
>
> Der Verrat liegt nicht im Bild. Er liegt in der Verwechslung.

Wörtlich genommen stimmt es sogar: die Pfeife im Bild kann man nicht rauchen, und die Master Component in Figma kann man nicht drücken. Beide sind Abbilder. Nur haben wir beim Button vergessen, dass es eines ist, und angefangen, die Bibliothek der Abbilder für das System zu halten.

Was dabei verloren geht, ist genau das, was den Button zum Button macht: dass er etwas tut. Ein eingefrorener Zustand trägt seine Rolle und seine Bedeutung noch in sich, aber nur als Erinnerung, nicht als Fähigkeit. Er kann sich nicht mehr anders entscheiden.

> [!SUMMARY] Worum es geht
> Atomic Design denkt in Chemie: Atome verbinden sich zu Molekülen. Cellular Design denkt in Biologie: eine Zelle differenziert sich. Der Unterschied liegt nicht in der Größe der Einheit, sondern darin, ob sie sich verändern kann. Diese Notiz ist die Haltung dahinter. Sie ist keine Regel der Sammlung und keine Voraussetzung für die Notizen daneben.

---

## Warum nicht Atomic Design

Atomic Design leiht seine Metapher bei der Chemie: Atome, Moleküle, Organismen. Das klingt nach Wachstum, greift aber auf die unbelebteste Ebene der Wirklichkeit zurück, die es gibt. Ein Atom kann nichts werden. Es kann sich nur verbinden.

Aus dieser einen Entscheidung folgt alles Weitere, und zwar zwingend. Wenn die kleinste Einheit sich nicht verändern kann, ist Kombination der einzige Vorgang, der zur Verfügung steht. Vielfalt entsteht dann nur über mehr Einheiten. Für jede Verbindung aus Verhalten, Aussehen und Zustand braucht es ein eigenes fertiges Ding, und irgendwann ist die Pflege der Bibliothek aufwändiger als die Arbeit, für die sie da ist. Das ist kein Fehler in der Anwendung. Das ist die Metapher, die korrekt arbeitet.

Am Hover sieht man es am deutlichsten. Er steckt im Button, noch einmal im Chip und ein drittes Mal in der Tabellenzeile — nicht aus Nachlässigkeit, sondern weil ein Atom seine Eigenschaften bei sich trägt und nicht von außen bezieht. Ändert sich die Regel, ändert sie sich an drei Stellen, oder eben an zweien.

Die Biologie kennt einen zweiten Vorgang, den die Chemie nicht hat: **Differenzierung**. Dieselbe Zelle wird zu Verschiedenem, je nach Kontext. Vielfalt entsteht ohne mehr Einheiten. Deshalb lautet der Gegenentwurf nicht „kleinere Teile" oder „besser gepflegte Teile", sondern: eine andere Materie.

Die Frage „haben wir für alles ein fertiges Teil?" ist damit die falsche Frage. Die richtige lautet: **Was ist die kleinste Anzahl an Regeln, mit der wir das meiste erschaffen können?**

## Das Modell

Ein Body ist zunächst nichts. Er ist formbare, bedeutungsfreie Materie — im Web ein `div`, in React Native ein `View`. Er bekommt seine Bedeutung erst aus zwei Zuweisungen.

| Schicht | Was sie beiträgt | Beispiel |
|---|---|---|
| **Body** (der Körper) | Die formbare Materie. Ohne Bedeutung, ohne Aussehen | ein neutrales Element |
| **Role** (die Seele) | Was der Body **tut**. Ein reines Verhaltenspaket, ohne jede Aussage über das Aussehen | `pressable`, `toggleable`, `editable`, `navigable`, `readable` |
| **Skin** (die Haut) | Wie der Body **aussieht**. Ein reines Stil-Rezept auf Token-Basis, ohne jeden Interaktions-Code | `press`, `chip`, `track`, `tab`, `field`, `row`, `text` |

Dazu kommen die zwei Schichten, die das Ganze tragen:

| Schicht | Was sie beiträgt |
|---|---|
| **Tokens** (die DNA) | Die Werte, aus denen der Skin gemacht ist. Zustände wie Hover sind Stufen derselben Palette |
| **Grammatik** | Welche Kombinationen einen Namen haben, welche verboten sind, und warum |

## Was das praktisch ändert

Das Hover-Problem, aristotelisch gelöst: das Verhalten wird **einmal** definiert und auf beliebige Bodies angewendet.

```plaintext
Body + Skin (pill)   + Role (pressable)  =>  klickbarer Pill-Button
Body + Skin (chip)   + Role (pressable)  =>  klickbarer Chip
Body + Skin (row)    + Role (navigable)  =>  Navigations-Zeile
Body + Skin (chip)   + Role (readable)   =>  Badge
```

Die letzten beiden Zeilen zeigen den Kern. Chip und Badge sehen gleich aus und verhalten sich verschieden. In Atomic Design sind das zwangsläufig zwei Atome mit doppeltem Stil, weil ein Atom sein Aussehen bei sich trägt. Als Bodies ist es derselbe Skin mit zwei Roles.

Die Komplexität wandert aus dem einzelnen Ding in das System, wo sie wiederverwendbar bleibt. Aus Multiplikation wird Addition: nicht mehr Verhalten **mal** Skin **mal** Schwere als Einzelteile, sondern Verhalten **plus** Skins **plus** Schweregrade.

## Zwei Prüfsteine

**Der Orthogonalitäts-Test.** Etwas ist nur dann eine eigene Achse, wenn es sich mit allen anderen Achsen sinnvoll kombinieren lässt. Existiert es nur in einer einzigen Kombination, ist es kein Bauprinzip, sondern ein benannter Einzelfall — und bleibt einer.

**Ausnahmen sind unentdeckte Achsen.** Der abweichende Hover eines Fehler-Buttons ist keine Ausnahme von der Hover-Regel. Er ist die Schwere-Achse: die Regel zeigt auf den Hover-Wert der jeweils aktiven Palette, und die Abweichung wird zu Daten statt zu Code. Wer stattdessen ein `wenn` in die Regel schreibt, hat die Achse übersehen.

Daraus die Faustregel: **Verhalten hart abstrahieren, Aussehen nur als überschreibbarer Vorschlag.** Und wenn eine Regel ein zweites „außer wenn" braucht, ist das eine neue benannte Variante, kein weiteres `wenn`.

## Warum das erst jetzt geht

Atomic Design war nicht falsch, es war eine Kompression für Menschen: eingefrorene, bewiesene Kombinationen, die niemand jedes Mal neu herleiten musste. Wer keine Regeln im Kopf behalten kann, braucht ein Regal mit fertigen Teilen. Eine KI braucht diese Abkürzung nicht. Sie kann eine Grammatik anwenden, also Regeln kombinieren, statt Vokabeln nachzuschlagen.

Damit wird das Design-System von einer Teileliste zu einer Sprache. Was davon ohne diese Haltung für jedes Projekt gilt, steht in [[Bedienung - Verhalten und Aussehen bleiben getrennt]] und in [[Bedienung - Verhalten und Aussehen werden nicht in der Ansicht nachgebaut]].

## Zur Wortwahl

Die Metapher ist die Zelle, das Paradigma heißt Cellular Design. Das einzelne Ding heißt trotzdem **Body** und nicht „Zelle", weil Zelle in Oberflächen schon vergeben ist: die Tabellenzelle. Auf Deutsch ist der Body der **Körper**, die Role die **Seele**, der Skin die **Haut**. Die englischen Wörter stehen hier, weil sie im Code dieser Haltung genauso heißen. Wo `body` mit dem `<body>`-Element kollidieren könnte, hilft die Langform **cell body**.

Nicht verwendet werden „Atom", „Molekül" und „Organismus", weil sie zu Atomic Design gehören. Ebenso „Baustein" und „Komponente": nicht weil die Wörter schlecht wären, sondern weil sie dieselbe Welt beschreiben. Totes Material, das verbaut wird und danach bleibt, was es ist. Das Wort ist nur das Symptom, die Metapher darunter ist die Ursache. Diese Wortwahl gilt für Texte in dieser Haltung. Die Regeln daneben sprechen normal.

## Verwandt

- [[Bedienung - Verhalten und Aussehen bleiben getrennt]]
- [[Bedienung - Verhalten und Aussehen werden nicht in der Ansicht nachgebaut]]
- [[From Atoms to Cells - An Aristotelian Revolution for UI Design]]
- [[Cellular Design - Umsetzungsplan Rollen, Skins und Grammatik]]
