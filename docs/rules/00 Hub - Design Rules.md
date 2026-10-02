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
| [[Layout - Weniger Kanten, ruhigere Ansicht]] | universal | Ausrichtungskanten zählen und zusammenlegen. Nicht linksbündig mit zentriert mischen |
| [[Layout - Die Titel bilden eine Gliederung]] | universal | Titel als Inhaltsverzeichnis. Ebene 1 einmal, nichts doppelt, jede Ebene sichtbar |
| [[Layout - Eine schmale Spalte steht in der Mitte]] | universal | Schmale Spalte mittig, Zurück und Titel an ihrer Kante. Vorgabe 48rem für Formulare |
| [[Layout - Ein Bedienelement steht bei dem, was es verändert]] | universal | Steuerung steht in der Fläche dessen, was sie verändert |
| [[Layout - Jeder Textbehälter hält jede Textmenge aus]] | universal | Keine feste Höhe, Schrift relativ, Überlänge bricht um oder wird gekürzt |
| [[Layout - Erst Abstand, dann Fläche, dann Linie]] | universal | Abstand gruppiert. Reicht er nicht, Fläche. Erst dann die leise Linie |
| [[Layout - Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um]] | universal | Layout nach Platz, nicht Gerät. Umbruch bei 320 ohne waagerechtes Scrollen. Abstand zu Systemleisten |

## Fluss

| Regel | Scope | Kern |
|---|---|---|
| [[Fluss - Ein Pop-up unterbricht, es führt nicht]] | universal | Mehr als eine Eingabe oder mehr als ein Hinweis: dann ein eigener Screen |
| [[Fluss - Leer ist ein Zustand, keine Lücke]] | universal | Drei Sorten leer, drei Antworten. Eine unbeschriebene Fläche ist keine |
| [[Fluss - Der Platz ist da, bevor die Daten kommen]] | universal | Nichts springt. Unter 200ms gar kein Ladehinweis |
| [[Fluss - Der Zustand der Ansicht steht in der Adresse]] | universal | Filter, Tab, Seite in der URL. Zurück stellt alles wieder her |
| [[Fluss - Eine Eingabe wechselt nie von selbst den Ort]] | universal | Eine Auswahl allein öffnet keine Seite und sendet nichts ab |
| [[Fluss - Eine Zeitgrenze warnt vorher]] | universal | Warnung vor Ablauf, Verlängern, Eingaben bleiben |
| [[Fluss - Was vorweg angezeigt wird, wird bei Fehler zurückgenommen]] | universal | Lehnt der Server ab, verschwindet die Änderung sichtbar |
| [[Fluss - Die Sprache kommt aus der Einstellung, nicht aus dem Ort]] | universal | Aus Browser oder Konto, nie aus IP oder Standort |
| [[Fluss - Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben]] | universal | Filter wirken sofort auf der Seite. Was gespeichert wird, bekommt eine eigene Seite |
| [[Fluss - Ein Ablauf mit Schritten zeigt, wie weit man ist]] | universal | Fortschritt sichtbar, ein Balken reicht. Zurück ohne Verlust |
| [[Fluss - Ein Fehler steht dort, wo er entstanden ist]] | universal | Am Feld, nicht im Pop-up. Sagt was zu tun ist. Eingaben bleiben. Wird angesagt |

## Form

| Regel | Scope | Kern |
|---|---|---|
| [[Form - Konzentrische Radien]] | universal | `r_innen = r_außen − Abstand` |
| [[Form - Senkrechtes Padding wird optisch ausgeglichen]] | universal | 14 senkrecht gegen 16 waagerecht, damit es gleich aussieht |

## Fläche

| Regel | Scope | Kern |
|---|---|---|
| [[Fläche - Die Ebene folgt der Rolle, nicht der Schachtelung]] | universal | Geschlossene Menge, Ebene folgt der Rolle. Vorgabe drei |

## Bedienung

| Regel | Scope | Kern |
|---|---|---|
| [[Bedienung - Verhalten und Aussehen bleiben getrennt]] | universal | Fünf Verhaltensarten, Aussehen austauschbar. Das Wörterbuch sagt, welche Kombination wofür |
| [[Bedienung - Verhalten und Aussehen werden nicht in der Ansicht nachgebaut]] | universal | Die Ansicht benutzt vorhandene Elemente. Sie definiert Verhalten und Aussehen nicht neu |
| [[Bedienung - Die Höhe gehört der Zeile, nicht dem Element]] | universal | Alles in einer Zeile gleich hoch. Der Kontext sagt welche Höhe, nicht das Bauteil |
| [[Bedienung - Kurze Zustände verschieben, dauerhafte wechseln die Palette]] | universal | Hover eine Stufe heller, Gedrückt eine dunkler, in beiden Modi gleich. „An" wechselt die Palette |
| [[Bedienung - Ein Tooltip ergänzt, er trägt nie allein]] | universal | Wichtiges steht sichtbar. Tooltip auch per Fokus, schließt mit Esc |
| [[Bedienung - Eine Handlung löst beim Loslassen aus]] | universal | Beim Loslassen, nicht beim Drücken. Wer abrutscht, bricht ab |
| [[Bedienung - Was sich von selbst bewegt, lässt sich anhalten]] | universal | Über fünf Sekunden Bewegung: Pause-Knopf. Ton nie von selbst |
| [[Bedienung - Gewicht ist ein Budget, ein Primary pro Ansicht]] | universal | Höchstens ein Primary pro Ansicht. Beschriftung ist eine Handlung, kein Zustand |
| [[Bedienung - Ein Button ist nie gesperrt]] | universal | Aktiv lassen und beim Klick zeigen, was fehlt. Gesperrt nur während der Anfrage |
| [[Bedienung - Eine lange Auswahl lässt sich durchsuchen]] | universal | Ab einer Schwelle Suche oder Gruppen. Korridor 7-15, Vorgabe 10 |
| [[Bedienung - Jede Geste hat einen zweiten Weg per Klick]] | universal | Ziehen, Wischen, Schütteln: dasselbe Ergebnis auch per Klick und Tastatur |
| [[Bedienung - Bewegung hat einen Wert und hält nichts auf]] | universal | Eine Dauer als Token, nur `transform` und `opacity`, Eingabe bricht ab. Reduziert: sofort |
| [[Bedienung - Alles geht mit der Tastatur, in der Reihenfolge des Bildes]] | universal | Alles per Tab, in der Reihenfolge des Bildes. Globale Kürzel mit Strg, Alt oder Cmd |
| [[Bedienung - Der Fokus ist sichtbar und hat immer einen Ort]] | universal | Immer sichtbar, gleich gebaut, nie verdeckt. Nach jedem Wechsel ein festes Ziel |
| [[Bedienung - Name und Zustand stehen im Code]] | universal | Zugänglicher Name mit sichtbarem Text, Zustand als Attribut |
| [[Bedienung - Zerstörendes trifft man nicht aus Versehen]] | universal | Nie neben dem Häufigen. Im Dialog Fokus auf Abbrechen, Gegenstand genannt |
| [[Bedienung - Klickbares hat eine Fläche, und nur Klickbares sieht so aus]] | universal | Echte Trefferfläche, nie unter 24 Pixel. Was nichts tut, sieht nicht klickbar aus |

## Formular

| Regel | Scope | Kern |
|---|---|---|
| [[Formular - Was der Nutzer tippt oder einfügt, kommt an]] | universal | Nie Einfügen sperren, nie still Zeichen schlucken |
| [[Formular - Was ein Feld beschreibt, steht im Feld]] | universal | Lupe, Einheit, Vorzeichen im Rahmen. Handelndes am Ende |
| [[Formular - Was zusammen gespeichert wird, steht in einem Formular]] | universal | Ein `form` um gemeinsam gespeicherte Felder. Enter speichert |
| [[Formular - Der Nutzer tippt nur, was das System nicht weiß]] | universal | Nichts abfragen, was das System weiß. `type`, `inputmode`, `autocomplete` |

## Inhalt

| Regel | Scope | Kern |
|---|---|---|
| [[Inhalt - Lange Zeichenketten stehen in Gruppen]] | universal | IBAN, Telefon, Codes in Gruppen. Kopieren ohne Trennzeichen |
| [[Inhalt - Struktur steckt im Element]] | universal | `table`, Liste, Feldgruppe, benannte Seitenbereiche, Sprung zum Inhalt |
| [[Inhalt - Alles hat eine Textfassung]] | universal | Alternativtext, Untertitel, Transkript. Text nie als Grafik |

## Zustand

| Regel | Scope | Kern |
|---|---|---|
| [[Zustand - Rot ist nicht ein Rot]] | universal | Ein Wert kann nicht Text und Fläche zugleich sein. Der Untergrund entscheidet |
| [[Zustand - Eine Bedeutung, überall gleich]] | universal | Eine Handlung, ein Name, ein Icon. Ein Wert, eine Grenze, überall |

## Typografie

| Regel | Scope | Kern |
|---|---|---|
| [[Typografie - Betone mit einem Mittel, nicht mit zweien]] | universal | Größe oder Gewicht, nie beides. Die große Zahl läuft normal. Titelstufen ausgenommen |
| [[Typografie - Zahlenspalten stehen rechtsbündig]] | universal | Größenordnung wird an der Länge lesbar |
| [[Typografie - Icons sind auf die Schrift abgestimmt]] | universal | Wie ein Schriftzeichen behandeln. Abstand optisch je Icon, nicht ein fester gap |
| [[Typografie - Fließtext hat eine Höchstbreite]] | universal | Höchstbreite in Zeichen als Token. Korridor 45-80, Vorgabe 65 |

## Farbe und Tokens

| Regel | Scope | Kern |
|---|---|---|
| [[Farbe - Werte kommen aus Tokens, nie aus der Hand]] | universal | Kein Hex, keine Pixelzahl in der Ansicht. Dazu: was Material ist |
| [[Farbe - Hell und Dunkel sind zwei Entwürfe, keine Umkehrung]] | universal | Beide Erscheinungen einzeln festgelegt und einzeln geprüft. Der Nutzer entscheidet |
| [[Farbe - Kontrast hat eine Untergrenze]] | universal | Text 4,5:1, Grenzen 3:1, in jedem Zustand. Systemkontrast wird beachtet |
| [[Farbe - Farbe trägt nie allein]] | universal | Zustände und Datenreihen haben ein zweites Merkmal neben der Farbe |

## Stack

| Regel | Scope | Kern |
|---|---|---|
| [[Stack - Utility-Klassen statt Inline-Styles]] | stack | Inline-Style ist der Ausstieg aus dem System |
| [[Stack - Abstand über gap, nicht über Margins am Kind]] | stack | Der Abstand gehört dem Container |
| [[Stack - Keine Deckkraft-Modifier auf semantischen Farben]] | stack | Kein `bg-primary/10`. Benannte Stufen statt Deckkraft |
| [[Stack - Was der Browser mitbringt, wird gestaltet oder ersetzt]] | stack | Nichts im Browser-Aussehen. `color-scheme`, gestalten oder ersetzen |

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
- [ ] Fehlende Bereiche ergänzen: Formular-Aufbau (Reihenfolge und Gruppierung der Felder), Daten-Visualisierung über Farbe hinaus (Achsen, Wertebänder). Bewegung über Zustandswechsel hinaus und erste Formular- und Daten-Regeln stehen seit dem 2. Oktober
- [x] Entscheiden, wie deaktivierte Bedienelemente behandelt werden. Antwort: [[Bedienung - Ein Button ist nie gesperrt]]
- [ ] Hart und weich überall trennen, wo eine Regel eine Zahl nennt: Korridor plus Vorgabewert statt fester Wert
- [ ] Export-Format festlegen: gefiltert nach `scope` und `applies-to`, als Beipack für die Agenten-Datei eines Projekts oder als Skill
- [ ] Danach den Weg über `standby.design` bauen, damit die Regeln neben `css`, `tailwind` und `llm-briefing` exportierbar sind
