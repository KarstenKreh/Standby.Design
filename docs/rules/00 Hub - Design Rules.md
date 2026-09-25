---
dateCreated: 2026-08-27
description: Übersicht über das qualitative Regelwerk für Layout und Bedienung. Eine Notiz pro Regel, hier die Tabelle mit Geltungsbereich und Einzeiler.
type: project-hub
status: active
parentProject: "[[00 Project Hub - OKLCH Palette Generator]]"
tags:
  - design-system
  - design-rule
---

# Hub – Design Rules

> [!SUMMARY] Was ist das?
> Das qualitative Gegenstück zum Token-Generator. Der Generator liefert die messbaren Werte — Farben, Skalen, Radien, Schatten. Diese Sammlung liefert die Regeln, die man nicht exportieren kann: welches Verhalten wofür, wie eine Karte innen aufgebaut ist, wie Elemente gruppiert werden, wann Farbe etwas bedeuten darf. Zielgruppe sind Agenten, die Layouts bauen, und Menschen, die deren Ergebnis prüfen.

---

## Wie eine Regel aufgebaut ist

Jede Notiz folgt demselben Schnitt:

- **Regel** — ein Satz, Imperativ, ohne Einschränkung
- **Warum** — der Grund, aus dem sich die Regel im Zweifel selbst herleiten lässt
- **Woran Du den Verstoß erkennst** — das Merkmal, nach dem im Code gesucht werden kann
- **Richtig / falsch** — Wireframe oder Minimalbeispiel
- **Grenzen** — wann die Regel nicht greift

Das Warum ist kein Beiwerk. Ohne Grund baut ein Agent die Regel weg, sobald sie im konkreten Fall unbequem wird.

## Hart und weich

Manche Regeln enthalten eine Zahl. Die Zahl ist fast nie das Allgemeingültige daran, sie ist eine Frage der Handschrift. Solche Regeln trennen deshalb zwei Dinge:

- **Hart** ist die Invariante: dass es überhaupt genau einen Wert gibt, dass er als Token steht, und in welchem Korridor er liegen darf.
- **Weich** ist die Zahl im Korridor. Dafür nennt die Regel einen **Vorgabewert**, der gilt, solange das Projekt nichts anderes festlegt.

So bleibt die Sammlung ohne Marken-Richtlinie benutzbar: ein Agent hat immer etwas Konkretes zur Hand, und eine Marke kann es überschreiben, ohne die Regel zu brechen. Im Frontmatter stehen dafür `korridor` und `default`.

## Die drei Geltungsbereiche

| `scope` | Bedeutung |
|---|---|
| `universal` | Gilt in jedem Projekt, unabhängig von Marke und Technik |
| `stack` | Gilt innerhalb einer Technik (Web, React Native), aber projektübergreifend |
| `project` | Bleibt im Repo. Steht nicht hier |

Dazu sagt `applies-to`, für welche Techniken eine Regel gedacht ist. Damit lässt sich die Sammlung später gefiltert exportieren: ein Agent bekommt genau die Regeln, die zu seinem Projekt passen, statt aller.

---

## Layout

| Regel | Scope | Kern |
|---|---|---|
| [[Layout - Die Karte hat kein Padding]] | universal | Padding im Abschnitt, nicht in der Karte. Nur so darf ein Bild randlos laufen |
| [[Layout - Der Divider ist die Unterkante einer Section]] | universal | Die Linie ist keine Komponente, sondern eine Kante. Der letzte Abschnitt hat keine |
| [[Layout - Nähe gruppiert, nicht die Linie]] | universal | Abstand gruppiert. Die Linie kommt erst, wenn der Abstand nicht mehr trägt |
| [[Layout - Weniger Kanten, ruhigere Ansicht]] | universal | Ausrichtungskanten zählen und zusammenlegen. Nicht linksbündig mit zentriert mischen |
| [[Layout - Jede Ansicht bricht bei 320 Pixeln um]] | universal | WCAG Reflow: umbrechen ohne waagerechtes Scrollen. Betrifft vor allem Zoom, nicht Telefone |

## Fluss

| Regel | Scope | Kern |
|---|---|---|
| [[Fluss - Ein Pop-up unterbricht, es führt nicht]] | universal | Mehr als eine Eingabe oder mehr als ein Hinweis: dann ein eigener Screen |
| [[Fluss - Leer ist ein Zustand, keine Lücke]] | universal | Drei Sorten leer, drei Antworten. Eine unbeschriebene Fläche ist keine |
| [[Fluss - Der Platz ist da, bevor die Daten kommen]] | universal | Nichts springt. Unter 200ms gar kein Ladehinweis |
| [[Fluss - Ein Fehler steht dort, wo er entstanden ist]] | universal | Am Feld, nicht im Pop-up. Sagt was zu tun ist. Eingaben bleiben |

## Form

| Regel | Scope | Kern |
|---|---|---|
| [[Form - Konzentrische Radien]] | universal | `r_innen = r_außen − Abstand` |
| [[Form - Senkrechtes Padding wird optisch ausgeglichen]] | universal | 14 senkrecht gegen 16 waagerecht, damit es gleich aussieht |

## Fläche

| Regel | Scope | Kern |
|---|---|---|
| [[Fläche - Die Ebene folgt der Rolle, nicht der Schachtelung]] | universal | Geschlossene Menge, Ebene folgt der Rolle. Vorgabe drei |
| [[Fläche - Eine Linie trennt, sie schmückt nicht]] | universal | Erst Abstand, dann Fläche, dann Linie. Und wenn Linie, dann die leise |

## Bedienung

| Regel | Scope | Kern |
|---|---|---|
| [[Bedienung - Verhalten und Aussehen bleiben getrennt]] | universal | Fünf Verhaltensarten, Aussehen austauschbar. Das Wörterbuch sagt, welche Kombination wofür |
| [[Bedienung - Verhalten und Aussehen werden nicht in der Ansicht nachgebaut]] | universal | Die Ansicht benutzt vorhandene Elemente. Sie definiert Verhalten und Aussehen nicht neu |
| [[Bedienung - Klickbares braucht eine Fläche]] | universal | Kein nackter Textlink. Dezent geht über Farbe, nicht über kleinere Fläche |
| [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]] | universal | Alles in einer Zeile gleich hoch. Der Kontext sagt welche Höhe, nicht das Bauteil |
| [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]] | universal | Hover eine Stufe heller, Gedrückt eine dunkler, in beiden Modi gleich. „An" wechselt die Palette |
| [[Bedienung - Ein dauerhafter Zustand braucht ein zweites Zeichen]] | universal | Farbe allein ist für farbenblinde Nutzer unsichtbar |
| [[Bedienung - Fokus ist immer sichtbar]] | universal | Nie ersatzlos entfernt, überall gleich gebaut, verschiebt kein Layout |
| [[Bedienung - Übergänge haben genau einen Wert]] | universal | Eine Dauer im ganzen Projekt, Korridor 100-200ms, Vorgabe 150. Reduzierte Bewegung: sofort |

## Zustand

| Regel | Scope | Kern |
|---|---|---|
| [[Zustand - Dieselbe Zahl bedeutet überall dasselbe]] | universal | Eine Übersetzung fürs ganze Produkt. Fehlt der Wert, bleibt es grau |
| [[Zustand - Rot ist nicht ein Rot]] | universal | Ein Wert kann nicht Text und Fläche zugleich sein. Der Untergrund entscheidet |

## Typografie

| Regel | Scope | Kern |
|---|---|---|
| [[Typografie - Betone mit einem Mittel, nicht mit zweien]] | universal | Größe oder Gewicht, nie beides. Die große Zahl läuft normal |
| [[Typografie - Zahlenspalten stehen rechtsbündig]] | universal | Größenordnung wird an der Länge lesbar |
| [[Typografie - Icons sind auf die Schrift abgestimmt]] | universal | Wie ein Schriftzeichen behandeln. Abstand optisch je Icon, nicht ein fester gap |

## Farbe und Tokens

| Regel | Scope | Kern |
|---|---|---|
| [[Farbe - Werte kommen aus Tokens, nie aus der Hand]] | universal | Kein Hex, keine Pixelzahl in der Ansicht. Dazu: was Material ist |
| [[Farbe - Hell und Dunkel sind zwei Entwürfe, keine Umkehrung]] | universal | Beide Erscheinungen einzeln festgelegt und einzeln geprüft. Der Nutzer entscheidet |

## Stack

| Regel | Scope | Kern |
|---|---|---|
| [[Stack - Utility-Klassen statt Inline-Styles]] | stack | Inline-Style ist der Ausstieg aus dem System |
| [[Stack - Abstand über gap, nicht über Margins am Kind]] | stack | Der Abstand gehört dem Container |
| [[Stack - Keine Deckkraft-Modifier auf semantischen Farben]] | stack | Kein `bg-primary/10`. Benannte Stufen, Hover heller, Gedrückt dunkler |

---

## Daneben, keine Regel

[[Philosophie - Body, Role und Skin]] ist die persönliche Haltung: Cellular Design, die Wörter Body, Role und Skin, die Abgrenzung zu Atomic Design. Sie ist keine Regel dieser Sammlung. Die Notizen hier gelten auch ohne sie.

## Was bewusst NICHT hier steht

Diese Dinge bleiben im jeweiligen Projekt, weil sie eine Marke oder ein bestimmtes Produkt beschreiben:

- **Stilrichtung und Stimmung** — die Formsprache, das Lichtverhalten, die Liste der Stile, die man vermeiden will. Das ist die Handschrift eines Produkts, keine Regel für alle
- **Marke und Schreibweise** — Produktname, Schreibweise, Wortmarke
- **Konkrete Werte** — Farbwerte, Schriftfamilien, Breakpoint-Zahlen, Pfade zu Token-Dateien
- **Fachliche Schwellen** — wo die Grenze zwischen gut, mittel und schlecht liegt. Die Regel „Schwellen kommen aus einer Quelle" ist allgemeingültig, die Zahlen sind es nicht
- **Sprache der Oberfläche** — welche Sprache, geduzt oder gesiezt
- **Altlasten und Migration** — offene Fundstellen, Umbaupläne, Zwischenstände

Wichtig ist die Richtung: eine Regel darf ihren Grund nennen und ein typisches Muster beschreiben, aber sie nennt kein Projekt, keine Person, keine Datei und keinen Zählstand. Was nur in einem Projekt wahr ist, gehört nicht in die Sammlung.

## Nächste Schritte

- [x] Fluss-Regeln für leer, Laden und Fehler stehen
- [ ] Regeln gegenlesen und dort schärfen, wo die Begründung noch dünn ist
- [ ] Fehlende Bereiche ergänzen: Formular-Aufbau, deaktivierte Bedienelemente, Bewegung über Zustandswechsel hinaus, Daten-Visualisierung (Achsen, Legenden, Wertebänder)
- [ ] Entscheiden, wie deaktivierte Bedienelemente behandelt werden. Ein Verbot ist vertretbar, braucht aber eine Antwort darauf, was stattdessen passiert
- [ ] Hart und weich überall trennen, wo eine Regel eine Zahl nennt: Korridor plus Vorgabewert statt fester Wert
- [ ] Export-Format festlegen: gefiltert nach `scope` und `applies-to`, als Beipack für die Agenten-Datei eines Projekts oder als Skill
- [ ] Danach den Weg über `standby.design` bauen, damit die Regeln neben `css`, `tailwind` und `llm-briefing` exportierbar sind
