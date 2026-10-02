# Design Rules

Source: https://standby.design/docs/rules

Übersicht über das qualitative Regelwerk für Layout und Bedienung. Eine Notiz pro Regel, hier die Tabelle mit Geltungsbereich und Einzeiler.

Every rule follows the same shape: Regel (the rule), Warum (why it holds), Woran Du den Verstoß erkennst (how to detect a violation in code), Richtig / falsch (example), Grenzen (when it does not apply). Rules that name a number separate hard invariants from soft values: Korridor is the allowed range, Vorgabe is the default until a project sets its own value.

## Die Karte hat kein Padding

Layout · https://standby.design/docs/rules/layout-die-karte-hat-kein-padding

**Geltung:** universal · web, react-native · **Vorgabe:** 14 senkrecht, 16 waagerecht

> **Regel**
> Gib der Karte kein eigenes Padding und kein Gap. Sie ist eine senkrechte Flexbox mit Fläche, Rand, Radius und beschnittenem Überlauf. Das Padding tragen die Abschnitte darin, und jeder Abschnitt entscheidet für sich, ob er welches braucht.

### Warum

Wenn die Karte das Padding trägt, drückt sie jeden Inhalt nach innen, ausnahmslos. Ein Bild, ein Chart oder eine Tabelle kann dann nie bis an die Kante laufen, obwohl genau das oft die richtige Darstellung wäre. Der einzige Ausweg wären negative Margins, und die sind immer ein Hinweis darauf, dass etwas eine Ebene zu hoch sitzt.

Liegt das Padding dagegen im Abschnitt, entscheidet jeder Abschnitt für sich: Text bekommt Abstand, ein Bild darf randlos sein, eine Tabelle darf ihre eigenen Spaltenabstände mitbringen. Der Abstand bleibt trotzdem überall gleich, weil alle Abschnitte aus denselben zwei Werten schöpfen.

Die Regel nimmt der Karte nichts. Sie gibt den Abschnitten Freiheit.

### Der Aufbau

```
Karte        = flex-col · Fläche · Rand · Radius · Überlauf beschnitten · KEIN Padding · KEIN Gap
└─ Abschnitt = volle Breite bis zur Kante · trägt das Padding
   └─ Inhalt = Text | Chart | Bild | Tabelle | Hinweis | Button | Kennzahl
```

### Richtig / falsch

```
        RICHTIG                             FALSCH
   Padding im Abschnitt            Padding auf der Karte

╔═════════════════════════╗       ╔═════════════════════════╗
║┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄║       ║                         ║
║                         ║       ║  ┌───────────────────┐  ║
║     Titel               ║       ║  │ Titel             │  ║
║                         ║       ║  └───────────────────┘  ║
║┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄║       ║  ┌───────────────────┐  ║
║█████████████████████████║       ║  │███████████████████│  ║
║██ Bild bis zur Kante ███║       ║  │██ Bild eingerückt │  ║
║█████████████████████████║       ║  └───────────────────┘  ║
╚═════════════════════════╝       ╚═════════════════════════╝

 Abschnitt berührt die Kante.      Karte drückt alles nach innen.
 Randloses Bild möglich.           Randloses Bild unmöglich.
```

### Wann ein Abschnitt randlos läuft

Randlos ist für Inhalt, der **bis an seine eigene Kante Farbe trägt**: Bild, Chart, Tabelle, Heatmap, Landkarte, Video. Solcher Inhalt bringt seine Begrenzung selbst mit. Setzt Du ihn zusätzlich in einen Rahmen aus Hintergrundfläche, stehen zwei Kanten dicht nebeneinander, und keine der beiden wirkt gewollt. Läuft er bis an die Kante, ist die Karte selbst sein Rahmen.

Nicht randlos läuft Inhalt, der seinen Weißraum schon mitbringt: ein freigestelltes Logo, eine Illustration auf hellem Grund, Text. Der braucht das Padding des Abschnitts.

Damit die Ecke dabei sauber bleibt, muss die Karte ihren Überlauf beschneiden. Läuft ein Bild bis zur Kante und die Ecke ist trotzdem eckig, fehlt genau das.

### Padding-Werte im Abschnitt

Das erste Kind ist das, was oben steht. Hat die Karte einen Kopf, ist es der Kopf. Hat sie keinen, ist es der Inhalt, und der bekommt oben Padding. Setz die Null deshalb nicht an eine bestimmte Art von Abschnitt, sondern an den Fall „Abschnitt folgt auf Abschnitt“. Dann stimmt die Regel ohne Fallunterscheidung. Die weiteren nicht, weil der untere Abstand des Vorgängers den Abstand schon liefert. Sobald Trennlinien im Spiel sind, bekommt jeder Abschnitt oben und unten Padding, sonst klebt der Inhalt an der Linie.

| Fall | oben | rechts | unten | links |
|---|---|---|---|---|
| Erstes Kind, ohne Trennlinie | 14 | 16 | 14 | 16 |
| Weitere Kinder, ohne Trennlinie | 0 | 16 | 14 | 16 |
| Alle Kinder, mit Trennlinie | 14 | 16 | 14 | 16 |
| Randloser Abschnitt | 0 | 0 | 0 | 0 |

### Hart und weich

| | Status |
|---|---|
| Die Karte trägt kein Padding und kein Gap | hart |
| Das Padding sitzt im Abschnitt, randlose Abschnitte dürfen null setzen | hart |
| Zwei Werte für die ganze Karte, senkrecht kleiner als waagerecht | hart |
| Die konkreten Zahlen | weich, Vorgabe 14 senkrecht, 16 waagerecht |

Warum senkrecht kleiner: Senkrechtes Padding wird optisch ausgeglichen.

### Woran Du den Verstoß erkennst

- Die Karte selbst trägt Padding oder ein Gap.
- Ein Abschnitt setzt sein Padding mit negativen Margins wieder zurück. Das ist der sichere Beweis, dass das Padding eine Ebene zu hoch sitzt.
- Ein Bild in einer Karte hat links und rechts denselben Abstand wie der Fließtext darüber, obwohl es bis an die Kante gehört.
- Ein Chart läuft bis zur Kante, aber die Ecke ist eckig.
- Der Inhalt einer Karte ohne Kopf klebt an der Oberkante.
- Die Null für das obere Padding hängt an einem Abschnittstyp statt an seiner Position.

### Grenzen

Keine. Auch eine Karte, die nur einen Textblock enthält, bekommt kein Padding. Sonst ist die Ausnahme nach dem dritten Einsatz die Regel, und beim nächsten Mal steht wieder ein Padding auf der Karte.

### Verwandt

- Der Divider ist die Unterkante einer Section
- Senkrechtes Padding wird optisch ausgeglichen
- Konzentrische Radien

## Der Divider ist die Unterkante einer Section

Layout · https://standby.design/docs/rules/layout-der-divider-ist-die-unterkante-einer-section

**Geltung:** universal · web, react-native

> **Regel**
> Baue Trennlinien nie als eigenes Element. Die Linie ist die untere Kante eines Abschnitts, sie läuft von Kartenkante zu Kartenkante, und der letzte Abschnitt bekommt keine. Sobald Linien im Spiel sind, bekommt jeder Abschnitt oben und unten Padding.

### Warum

Eine Trennlinie als eigenes Element ist ein Kind ohne Inhalt. Sie muss von Hand an die richtige Stelle gesetzt werden, sie wird beim Umsortieren vergessen, und am Ende steht eine Linie unter dem letzten Abschnitt oder es stehen zwei Linien direkt übereinander. Als Kante des Abschnitts kann das nicht passieren: wer den Abschnitt verschiebt, verschiebt die Linie mit, und die Regel „letzter bekommt keine" ist eine einzige Bedingung statt einer Entscheidung pro Einsatzort.

Das zusätzliche Padding oben ist nötig, weil der Inhalt sonst an der Linie klebt. Ohne Linie liefert der untere Abstand des Vorgängers den Abstand schon.

### Woran Du den Verstoß erkennst

- Es gibt eine Komponente `Divider`, `Separator` oder ein `<hr>` zwischen den Abschnitten.
- Unter dem letzten Abschnitt sitzt eine Linie, direkt über der Kartenkante.
- Die Linie ist kürzer als die Karte, weil sie innerhalb des Paddings gezeichnet wird.

### Richtig / falsch

```
╔═══════════════════════════════════════════════════╗ ← Karte
║                                                   ║ ⇕ 14   ┐
║      Financial Health                             ║        │ Abschnitt 1
║                                                   ║ ⇕ 14   ┘ 14 16 14 16
╟───────────────────────────────────────────────────╢ ← Kante, volle Breite
║                                                   ║ ⇕ 14   ┐
║      Runway          14,2 Monate                  ║        │ Abschnitt 2
║                                                   ║ ⇕ 14   ┘ 14 16 14 16
╟───────────────────────────────────────────────────╢ ← Kante
║                                                   ║ ⇕ 14   ┐
║      [ Details ansehen ]                          ║        │ Abschnitt 3
║                                                   ║ ⇕ 14   ┘ letzter → keine Kante
╚═══════════════════════════════════════════════════╝
```

### Grenzen

Die Regel sagt, wie eine Trennlinie gebaut wird, nicht wann es eine braucht. Das steht in Erst Abstand, dann Fläche, dann Linie.

Ein Primitive, das die Kante zeichnet, ist erlaubt, solange es die Unterkante des Abschnitts ist. Ein eigenes Kind zwischen zwei Abschnitten ist es nicht. Der Name der Hilfsklasse ändert das nicht.

### Verwandt

- Erst Abstand, dann Fläche, dann Linie
- Die Karte hat kein Padding
- Erst Abstand, dann Fläche, dann Linie

## Weniger Kanten, ruhigere Ansicht

Layout · https://standby.design/docs/rules/layout-weniger-kanten-ruhigere-ansicht

**Geltung:** universal · web, react-native

> **Regel**
> Richte alles an möglichst wenigen gemeinsamen Kanten aus. Jede zusätzliche Linie, an der etwas beginnt, kostet den Blick einen Ankerpunkt. Und misch innerhalb eines Blocks nicht linksbündig mit zentriert.

### Warum

Der Blick sucht beim Lesen einer Ansicht nach Anhaltspunkten und findet sie an den Kanten: dort, wo mehrere Dinge gemeinsam beginnen. Zwei solche Linien liest man ohne Anstrengung. Bei sechs muss der Blick bei jedem Element neu ansetzen, und die Ansicht wirkt unruhig, ohne dass man sagen könnte woran es liegt. Man sieht die Kanten nicht, aber man spürt sie.

Deshalb ist das eines der wirksamsten Mittel überhaupt: es kostet nichts. Es ändert keine Farbe, keine Größe, keinen Inhalt. Es räumt nur die Anfänge zusammen.

Ausrichtung und Nähe sind dabei ein Paar. Nähe sagt, **was zusammengehört**, Ausrichtung sagt, **dass es zusammengehört**. Siehe Erst Abstand, dann Fläche, dann Linie.

### Der Kanten-Test

Screenshot der Ansicht nehmen, durch jede linke Kante eine senkrechte Linie ziehen, zählen. Meistens sind es fünf oder sechs. Meistens kommt man auf zwei, ohne dass sonst etwas anders wird.

```
        VORHER                              NACHHER

  │  Rechnungen                      │  Rechnungen
  │     │                            │
  │     │  Zeitraum  [____]          │  Zeitraum  [____]
  │     │            │               │
  │  Summe        1.240,00           │  Summe        1.240,00
  │       │                          │
  │       │      [ Export ]          │  [ Export ]
  │       │        │                 │
  ^     ^ ^      ^ ^                 ^
  fünf Kanten                        eine
```

### Zentriert ist erlaubt, gemischt nicht

Ein zentrierter Block ist in Ordnung — ein Anmeldefenster, ein leerer Zustand, eine Fehlerseite. Dann ist aber **alles** darin zentriert, auch die Beschriftungen und der Knopf.

Der schlechte Fall ist die Mischung: drei Blöcke linksbündig und einer zentriert. Der zentrierte hat dann zwei eigene Kanten, links und rechts, die zu keiner anderen passen, und er zieht die Aufmerksamkeit auf sich, ohne dass das gemeint war.

Zentrierter Fließtext über mehr als zwei Zeilen fällt ohnehin weg: dort wandert der Zeilenanfang bei jeder Zeile, und der Blick findet ihn nicht mehr.

### Icons teilen sich eine Kante

Stehen Icons vor Einträgen, bilden sie eine eigene Kante, und der Text dahinter eine zweite. Das Icon im Titel gehört auf dieselbe Kante wie die Icons der Einträge. Hat der Titel einen Rahmen oder ein Padding, weil er ein Knopf ist, zieh das ab, bis sein Icon auf der Kante der anderen steht.

Bei mehrzeiligen Einträgen steht das Icon auf der ersten Zeile, nicht in der Mitte des Eintrags. Es gehört zum Anfang des Textes.

### Woran Du den Verstoß erkennst

- Beschriftung, Wert und Knopf beginnen an drei verschiedenen Stellen.
- Ein einzelnes Element ist zentriert, alles andere daneben linksbündig.
- Eingerückte Blöcke stehen an frei gewählten Stellen statt an einer gemeinsamen zweiten Kante.
- Ein Text ist zentriert und länger als zwei Zeilen.
- Zahlen und Text in einer Tabelle richten sich an derselben Kante aus, statt Zahlen rechts zu setzen (siehe Zahlenspalten stehen rechtsbündig).
- Der Titel einer aufklappbaren Liste ist gegenüber den Einträgen eingerückt.
- Icon im Titel und Icons der Einträge stehen ein paar Pixel versetzt.
- Ein Icon vor einem mehrzeiligen Eintrag steht senkrecht in dessen Mitte.

### Grenzen

Zahlenspalten sind die gewollte Ausnahme: sie bekommen ihre eigene rechte Kante, weil dort die Vergleichbarkeit schwerer wiegt als eine Kante weniger.

Und eine zweite Kante für Einrückungen ist normal und richtig — Aufzählungen, verschachtelte Listen, Antworten in einem Verlauf. Die Regel sagt nicht „eine Kante", sie sagt „so wenige wie möglich, und jede mit Grund".

### Verwandt

- Erst Abstand, dann Fläche, dann Linie
- Zahlenspalten stehen rechtsbündig
- Die Höhe gehört der Zeile, nicht dem Element

## Die Titel bilden eine Gliederung

Layout · https://standby.design/docs/rules/layout-die-titel-bilden-eine-gliederung

**Geltung:** universal · web, react-native

> **Regel**
> Behandle die Titel einer Ansicht wie ein Inhaltsverzeichnis. Ebene 1 ist der Seitentitel und steht genau einmal da. Jede weitere Ebene liegt in einem Abschnitt der Ebene darüber, und von oben nach unten gelesen geben die Titel den Ablauf der Seite wieder. Kein Titel kommt zweimal vor, auch nicht in einer anderen Größe. Jede Ebene hebt sich sichtbar von der darunter ab, und ein Titel hebt sich genauso von seinen Einträgen ab. Der Titel im Browser-Tab nennt die aktuelle Ansicht.

### Warum

Die Größe eines Titels sagt, wie viel er umfasst. Der Seitentitel umfasst alles, ein Abschnittstitel nur seinen Abschnitt. Liest Du nur die Titel von oben nach unten, kennst Du den Aufbau der Seite, bevor Du ein Feld gelesen hast.

Steht derselbe Titel zweimal da, einmal groß im Kopf und einmal kleiner über dem Formular, behauptet die Seite zwei Ebenen für eine Sache. Der Blick liest dasselbe zweimal und fragt sich, ob es zwei Dinge sind. Ändert später jemand nur einen der beiden, weiß niemand mehr, wie die Seite heißt.

Screenreader lesen dieselbe Gliederung vor. Wer von Überschrift zu Überschrift springt, hört die Struktur, nicht das Aussehen. Ein doppelter Titel oder eine übersprungene Ebene ist dort ein Fehler in der Navigation.

### Jede Stufe ist sichtbar

Die Gliederung muss man auch sehen. Jede Ebene unterscheidet sich von der darunter durch Größe, Gewicht oder beides. Titelstufen dürfen beide Mittel zusammen nutzen, anders als Kennzahlen in Betone mit einem Mittel, nicht mit zweien. Das gilt auch für die unterste Stufe: Ein Titel über einer Liste hebt sich von ihren Einträgen ab. Hat er dieselbe Größe und dasselbe Gewicht, liest er sich als erster Eintrag. Ein zusätzliches Icon oder eine Einrückung ersetzt Größe und Gewicht nicht, sie fügen nur eine Kante hinzu.

### Hart und weich

| | Status |
|---|---|
| Genau ein Titel der Ebene 1 pro Ansicht | hart |
| Jeder Titel steht einmal da | hart |
| Die Ebenen folgen der Schachtelung, keine wird übersprungen | hart |
| Ein Titel steht vor seinem Inhalt, die Reihenfolge ist die Lesereihenfolge | hart |
| Jede Ebene hebt sich von der darunter und von ihren Einträgen über Größe, Gewicht oder beides ab | hart |
| Der Titel im Browser-Tab nennt die aktuelle Ansicht | hart |
| Ob Ebene 1 im Kopf der Anwendung oder in der Ansicht steht | weich, das Projekt entscheidet einmal für alle Ansichten |
| Wie viele Ebenen | weich, Vorgabe höchstens drei in einer Ansicht |
| Welche Mittel eine Ebene nutzt | weich, Größe, Gewicht oder beides |
| Aufbau des Tab-Titels | weich, Vorgabe „Ansicht · Produkt“ |

### Woran Du den Verstoß erkennst

- Kopfleiste und erste Überschrift der Ansicht nennen dasselbe.
- Eine Karte direkt unter dem Titel trägt ihn noch einmal als Kopf.
- Titel und Untertitel sagen dasselbe mit anderen Worten.
- Auf einen Titel der Ebene 1 folgt direkt einer der Ebene 3.
- Ein Titel ist nur über Größe und Gewicht gesetzt, ohne Überschriften-Element.
- Ein Titel hat dieselbe Größe und dasselbe Gewicht wie die Einträge darunter.
- Ein Titel hebt sich nur über ein zweites Icon oder eine Einrückung ab.
- Jeder Browser-Tab der Anwendung heißt gleich, der Titel ändert sich beim Seitenwechsel nicht.

### Richtig / falsch

```
        RICHTIG                             FALSCH

  1 Stammdaten bearbeiten             1 Stammdaten bearbeiten
    2 Anstellung                      1 Stammdaten bearbeiten   ← doppelt
    2 Daten                               3 Anstellung          ← Ebene 2 fehlt
    2 Gehalt und Abfindung              2 Daten
```

### Grenzen

Ein Abschnittstitel darf ein Wort mit dem Seitentitel teilen. Ein Pfad im Kopf der Anwendung („Bereich › Objekt“) ist Navigation und kein Titel. Dann trägt die Ansicht den Namen des Objekts als Ebene 1.

Druckansichten und Exporte brauchen Ebene 1 im Dokument, weil dort der Kopf der Anwendung fehlt.

### Verwandt

- Betone mit einem Mittel, nicht mit zweien

## Eine schmale Spalte steht in der Mitte

Layout · https://standby.design/docs/rules/layout-eine-schmale-spalte-steht-in-der-mitte

**Geltung:** universal · web · **Vorgabe:** 48rem für Formulare

> **Regel**
> Ist der Inhalt einer Ansicht schmaler als die Inhaltsfläche, setz die Spalte in deren Mitte. Was zur Spalte gehört, also Zurück, Titel und Aktionen, steht an ihren Kanten und nicht an der Kante der Seite.

### Warum

Der Nutzer sitzt mittig vor seinem Bildschirm, und sein Blick landet zuerst in der Mitte. Auf einem breiten Bildschirm liegt eine linksbündige Spalte am Rand seines Blickfelds, und er muss zum Lesen nach links schauen, während in der Mitte nichts steht.

Dazu bleibt rechts eine leere Fläche, die wie fehlender Inhalt aussieht. Auf breiten Bildschirmen wird sie größer als die Spalte selbst. In der Mitte liest sich dieselbe Leere als Rand, und die Lesebreite bleibt gleich.

Steht der Zurück-Knopf dagegen an der Seitenkante und das Formular in der Mitte, entstehen zwei Kanten ohne Bezug. Der Knopf gehört zur Spalte, also steht er an ihrer Kante.

### Hart und weich

| | Status |
|---|---|
| Eine schmale Spalte steht in der Mitte der Inhaltsfläche, nicht des Fensters | hart |
| Begleitende Elemente richten sich an der Spalte aus | hart |
| Die Breite der Spalte | weich, Vorgabe 48rem für Formulare |

### Woran Du den Verstoß erkennst

- Eine Spalte hat eine maximale Breite, aber keinen automatischen Rand links und rechts.
- Zurück steht links an der Seite, das Formular darunter in der Mitte.
- Die leere Fläche rechts ist breiter als der Inhalt.

### Richtig / falsch

```
        RICHTIG                             FALSCH

  │      ‹ Zurück             │       │ ‹ Zurück                  │
  │      ┌───────────┐        │       │ ┌───────────┐             │
  │      │ Formular  │        │       │ │ Formular  │             │
  │      └───────────┘        │       │ └───────────┘             │
         ^ eine Kante                   rechts leer, wirkt halb fertig
```

### Grenzen

Ansichten, die die Breite füllen (Tabellen, Raster, Dashboards), betrifft das nicht. Gehört eine Seitenleiste zur Ansicht selbst, etwa ein Inhaltsverzeichnis, steht die Spalte neben ihr.

Das ist keine Ausnahme zu Weniger Kanten, ruhigere Ansicht. Die Spalte steht in der Mitte, ihr Inhalt bleibt linksbündig.

### Verwandt

- Weniger Kanten, ruhigere Ansicht
- Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um

## Ein Bedienelement steht bei dem, was es verändert

Layout · https://standby.design/docs/rules/layout-ein-bedienelement-steht-bei-dem-was-es-veraendert

**Geltung:** universal · web, react-native

> **Regel**
> Setz jedes Bedienelement in dieselbe Fläche wie das, was es verändert.

### Warum

Das Auge ordnet einen Knopf der Fläche zu, in der er steht. Steht „Speichern“ oben im Seitenkopf, fragt sich der Nutzer, ob es die Karte unten speichert oder die ganze Seite.

### Woran Du den Verstoß erkennst

- Der Speichern-Knopf einer Karte steht im Seitenkopf.
- Ein Filter steht über einer anderen Liste als der, die er filtert.
- Die Sammelaktionen einer Tabelle stehen weit weg von ihr.
- Der Löschen-Knopf einer Zeile steht außerhalb der Zeile.

### Hart und weich

Hart.

### Grenzen

Handlungen, die die ganze Ansicht betreffen. Die stehen im Kopf der Ansicht.

### Quelle

Laws of UX › Law of Common Region und Law of Proximity, https://lawsofux.com/. Don Norman, The Design of Everyday Things › Mapping.

### Verwandt

- Erst Abstand, dann Fläche, dann Linie
- Ein Fehler steht dort, wo er entstanden ist
- Die Karte hat kein Padding

## Jeder Textbehälter hält jede Textmenge aus

Layout · https://standby.design/docs/rules/layout-jeder-textbehaelter-haelt-jede-textmenge-aus

**Geltung:** universal · web, react-native

> **Regel**
> Setz Schriftgrößen relativ, gib Textbehältern keine feste Höhe und sperr nie den Zoom. Leg für jeden Text fest, ob er umbricht oder gekürzt wird, und halte Gekürztes vollständig erreichbar. Die Ansicht hält 200 % Schrift und den längsten echten Inhalt aus.

### Warum

Wer schlecht sieht, vergrößert die Schrift. Feste Höhen schneiden den Text dann ab.

Agenten bauen mit Beispieltext. Echte Namen, Übersetzungen und Nutzerinhalte sind oft dreimal so lang. Aus „Max Mustermann“ wird „Maximilian von Hohenzollern-Sigmaringen“, aus einem Link eine URL ohne ein einziges Leerzeichen. Ohne festgelegtes Verhalten läuft so ein Text aus der Karte heraus oder drückt das Layout breit.

### Hart und weich

Hart. Die Höhen aus Die Höhe gehört der Zeile, nicht dem Element stehen in `rem` und gelten als `min-height`.

Hart: jeder Text hat ein Verhalten für Überlänge. Weich: welches. Vorgabe: Fließtext bricht um, Zellen und Beschriftungen kürzen.

### Woran Du den Verstoß erkennst

- `user-scalable=no` oder `maximum-scale=1`.
- `height` statt `min-height` an Elementen mit Text.
- `font-size` in `px`.
- `overflow: hidden` mit fester Höhe.
- Flex-Kind mit Text ohne `min-w-0`.
- `truncate` ohne Weg zum vollen Text.
- Lange URL oder E-Mail ohne `break-words` sprengt die Karte.

### Grenzen

Text in Bildern und Grafiken.

Inhalte, die das Produkt selbst festlegt, etwa Kürzel und Codes.

### Quelle

WCAG 1.4.4 Resize Text, 1.4.12 Text Spacing. Vercel › Targets & Input („Never disable browser zoom"). Vercel › Content Handling („Text containers handle long content", „Flex children need `min-w-0`") und Content & Accessibility („Resilient to user-generated content").

### Verwandt

- Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um
- Die Höhe gehört der Zeile, nicht dem Element
- Icons sind auf die Schrift abgestimmt
- Fließtext hat eine Höchstbreite
- Leer ist ein Zustand, keine Lücke
- Ein Tooltip ergänzt, er trägt nie allein

## Erst Abstand, dann Fläche, dann Linie

Layout · https://standby.design/docs/rules/layout-erst-abstand-dann-flaeche-dann-linie

**Geltung:** universal · web, react-native · **Korridor:** Abstand zwischen Einträgen mindestens doppelter Durchschuss · **Vorgabe:** 1rem bei Fließtext 14px, Zeilenhöhe 1.5

> **Regel**
> Gruppiere über Abstand: Was zusammengehört, steht dichter beieinander als zu allem anderen. Reicht der Abstand nicht, wechsle die Fläche. Erst dann kommt eine Linie, in der zurückhaltenden Stärke. Eine kräftige Linie ist ein Signal und bleibt dem vorbehalten, was hervorgehoben werden soll.

### Warum

Abstand ist die stärkste Gruppierung, die es gibt, und sie kostet nichts. Der Blick fasst zusammen, was dicht steht, noch bevor er liest. Eine Linie behauptet dasselbe noch einmal, fügt aber ein sichtbares Element hinzu. Bei Titel, Chart und Button trennt der Abstand schon deutlich genug, und jede zusätzliche Linie ist nur Rauschen.

Der praktische Test: Nimm die Linien testweise heraus. Ist die Gruppierung danach immer noch klar, waren sie überflüssig. Fällt der Aufbau auseinander, waren die Abstände zu gleichförmig — dann ist die Abstandsstaffelung das eigentliche Problem, nicht die fehlende Linie.

Eine Linie hat eine Aufgabe: trennen. Sie soll nicht selbst gesehen werden. Trotzdem ist sie das lauteste Mittel, das dafür zur Verfügung steht, und das einzige, das dem Bild etwas hinzufügt. Abstand und Flächenwechsel trennen genauso zuverlässig, ohne dass ein Element mehr auf dem Schirm liegt.

Zieht man jede Trennung als Linie, entsteht ein Gitter aus Rahmen, das lauter ist als der Inhalt darin. Und wenn die kräftige Stärke überall steht, hebt sie nichts mehr hervor. Sie ist dann keine Aussage mehr, sondern Tapete.

Es gibt gute Systeme ganz ohne Linien, die allein mit Fläche, Abstand und Erhebung arbeiten. Das ist keine Abweichung von der Regel, sondern ihre konsequenteste Anwendung.

### Die Rangfolge

Bevor Du eine Linie setzt, geh die Liste von oben durch:

1. **Abstand** — trennt am stärksten und kostet nichts. Siehe Erst Abstand, dann Fläche, dann Linie
2. **Fläche** — eine Stufe der Surface-Leiter macht die Grenze sichtbar, ohne sie zu zeichnen
3. **Linie** — wenn der Platz für Abstand fehlt und ein Flächenwechsel zu schwer wäre
4. **Erhebung** — Schatten und Licht, wenn etwas wirklich über dem Übrigen liegt

Die meisten Linien im Bestand sind übersprungene Schritte 1 und 2.

### Hart und weich

Zwei Einträge stehen weiter auseinander als zwei Zeilen innerhalb eines Eintrags. Sonst liest der Blick mehrzeilige Einträge als eine Textwand und findet den Anfang des nächsten nicht.

Messbar wird das über den Durchschuss, also Zeilenhöhe minus Schriftgröße. Bei 14 Pixel Schrift und Zeilenhöhe 1,5 sind das 7 Pixel. Der Abstand zwischen zwei Einträgen liegt dann bei mindestens 14 Pixel, als Vorgabe die nächste Stufe der Abstandsskala.

| | Status |
|---|---|
| Abstand zwischen Einträgen größer als der Durchschuss innerhalb | hart |
| Mindestens das Doppelte des Durchschusses | hart |
| Die Stufe aus der Skala | weich, Vorgabe die erste Stufe über dem Doppelten |
| Eine Linie ist ein Mittel unter mehreren, nicht die Voreinstellung | hart |
| Gibt es mehrere Stärken, ist die zurückhaltende der Alltag | hart |
| Die kräftige Stärke bleibt der Hervorhebung vorbehalten | hart |
| Linienfarben kommen aus benannten Tokens, nicht pro Stelle als Grauwert | hart |
| Ob das System überhaupt mit Linien arbeitet und wie viele Stärken es gibt | weich |

### Woran Du den Verstoß erkennst

- Zwischen jedem Abschnitt einer Karte sitzt eine Linie, unabhängig vom Inhalt.
- Alle Abstände in einer Ansicht sind gleich groß, und die Struktur entsteht nur aus Linien und Rahmen.
- Ein Formular trennt jedes einzelne Feld mit einer Linie, statt zusammengehörige Felder als Block zu setzen.
- Mehrzeilige Einträge einer Liste stehen so dicht wie ihre eigenen Zeilen.
- Jede Fläche auf der Seite hat eine sichtbare Umrandung.
- Die kräftige Stärke kommt so oft vor, dass sie nichts mehr hervorhebt.
- Eine Linie trennt Dinge, die schon durch Abstand getrennt sind.
- Eine Linie wird pro Stelle als Hex- oder Grauwert gesetzt.
- Es gibt drei oder vier Linienstärken, und niemand kann sagen, wann welche gilt.

### Richtig / falsch

```
        RICHTIG                             FALSCH
  Abstand macht die Gruppe           Linie macht die Gruppe

  Rechnungsadresse                   Rechnungsadresse
  Straße        [__________]         Straße        [__________]
  PLZ, Ort      [__________]         ─────────────────────────
                                     PLZ, Ort      [__________]
  Lieferadresse                      ─────────────────────────
  Straße        [__________]         Lieferadresse
  PLZ, Ort      [__________]         ─────────────────────────
                                     Straße        [__________]
  Zwei Blöcke, sofort lesbar.        Sieben gleich starke Zeilen.
```

### Grenzen

Bei einer langen Liste gleichrangiger Zeilen — Buchungen, Positionen, Kontakte — hilft die Linie wirklich, weil der Abstand zwischen zwei Zeilen dort aus Platzgründen klein bleiben muss. Das ist der Fall, für den die Trennlinie gedacht ist.

Bei dichten Listen und Tabellen kann der Abstand zwischen zwei Zeilen aus Platzgründen nicht groß genug werden. Dort verdient sich die Linie ihren Platz, und dort ist sie auch ohne schlechtes Gewissen richtig.

Wenn ein Projekt nur eine einzige Linienstärke kennt, ist die Unterscheidung zwischen leise und kräftig gegenstandslos. Dann bleibt von der Regel nur die Rangfolge, und die reicht.

### Verwandt

- Der Divider ist die Unterkante einer Section
- Die Karte hat kein Padding
- Die Ebene folgt der Rolle, nicht der Schachtelung

## Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um

Layout · https://standby.design/docs/rules/layout-jede-ansicht-folgt-dem-platz-und-bricht-bei-320-pixeln-um

**Geltung:** universal · web, react-native

> **Regel**
> Entscheide das Layout nach dem verfügbaren Platz, nie nach Gerätetyp oder Ausrichtung, und sperr die Ausrichtung nicht. Bau jede Ansicht so, dass der Inhalt bei 320 CSS-Pixeln umbricht, ohne waagerechtes Scrollen. Nichts wird abgeschnitten, nichts überlappt, und Text und Bedienelemente halten Abstand zu den Rändern des Geräts.

### Warum

Die 320 kommen nicht vom kleinsten Telefon. Sie kommen aus **WCAG 2.1, Erfolgskriterium 1.4.10 Reflow**, Stufe AA, und die Rechnung dahinter ist: 1280 Pixel bei 400 Prozent Vergrößerung ergeben ein Sichtfenster von 320 Pixeln.

Der Nutzer, um den es geht, sitzt also meistens gar nicht am Telefon. Er sitzt am großen Bildschirm und hat stark vergrößert, weil er sonst nichts lesen kann. Für ihn ist ein waagerechter Schieber kein Schönheitsfehler: er muss dann bei jeder einzelnen Zeile hin und her schieben, um sie zu Ende zu lesen. Das macht niemand lange mit.

Dass die Regel damit auch kleine Geräte abdeckt, ist ein Nebeneffekt und kein Grund. Der Grund altert nicht mit der nächsten Gerätegeneration.

Und sie von Anfang an einzuhalten ist billiger als nachzurüsten. Beim Nachrüsten stehen die Entscheidungen schon fest — die vierspaltige Kachelreihe, die Werkzeugleiste mit acht Elementen, die Tabelle mit zwölf Spalten —, und jede davon muss einzeln aufgebrochen werden. Wer früh bei 320 prüft, trifft diese Entscheidungen gar nicht erst.

Ein Tablet im geteilten Fenster ist schmaler als ein Telefon quer. Wer das Gerät abfragt, zeigt dann das falsche Layout oder versteckt Funktionen.

### Was die Regel verlangt und was nicht

Verlangt ist **Benutzbarkeit**, nicht Schönheit. Es darf eng aussehen. Es darf gestapelt aussehen. Es darf nach Notlösung aussehen. Was nicht sein darf: abgeschnittener Inhalt, überlappende Elemente, ein Schieber unter der ganzen Seite, unerreichbare Bedienelemente.

### Die Baseline

| Bereich | Verhalten unter der Grenze |
|---|---|
| Seitenleiste | Ab der Desktop-Grenze feste Spalte, darunter ausfahrbares Panel mit Auslöser im Kopfbereich. Das Panel zeigt immer volle Beschriftungen, der eingeklappte Desktop-Zustand greift dort nicht |
| Tabellen | Eigener Wrapper mit waagerechtem Scrollen, Spalten schrumpfen nicht |
| Overlays | Container mit Außenabstand, Panel volle Breite bis zu einer Höchstbreite, Höhe begrenzt und innen scrollbar |
| Raster | Stapeln nach unten. Kachel- und Kennzahlraster dürfen zweispaltig bleiben |
| Filter- und Buttonzeilen | Umbrechen, Reiterleisten alternativ waagerecht scrollen |
| Höhen | Dynamische Viewport-Einheiten statt fester, wo die Browserleiste hineinspielt |
| Ränder des Geräts | Text und Bedienelemente halten Abstand zu allem, was das System über die Ansicht legt: Statusleiste oben, Kerbe oder Kamera-Insel, abgerundete Ecken, Navigationsleiste oder Home-Strich unten, mit dem man zwischen Apps und Screens wechselt. Nur Flächen und Bilder laufen darunter. Im Web über `env(safe-area-inset-*)`, in React Native über den Safe-Area-Rahmen |

### Hart und weich

Hart.

### Woran Du den Verstoß erkennst

- Bei 320 Pixeln erscheint ein waagerechter Schieber unter der ganzen Seite statt unter dem breiten Element.
- Eine Filter- oder Buttonzeile schiebt sich aus dem Bild, weil der Umbruch fehlt.
- Ein Overlay steht bündig an den Bildschirmkanten oder ist höher als das Fenster und nicht scrollbar.
- Die Ansicht rechnet mit `vh` und springt beim Ein- und Ausblenden der Browserleiste.
- Beim Vergrößern auf 400 Prozent am Desktop bricht die Ansicht auseinander, obwohl sie am Telefon in Ordnung aussieht.
- Eine fixierte Leiste unten sitzt auf dem Home-Strich oder der Navigationsleiste des Systems, oder ein Titel oben liegt unter der Statusleiste.
- `viewport-fit=cover` ohne `env(safe-area-inset-*)`.
- Layout hängt an `navigator.userAgent`, `isMobile` oder `Platform.isPad`.
- Media Query auf `orientation`, die Inhalt ausblendet.
- `screen.orientation.lock()`.
- JS liest `window.innerWidth`, um Komponenten zu tauschen, wo CSS reicht.

### Grenzen

WCAG nimmt ausdrücklich aus, was zwingend zwei Dimensionen braucht: Tabellen, Landkarten, Zeitraster, Notensatz, Diagramme. Diese Inhalte dürfen scrollen. Der Schieber gehört dann aber an den Inhalt und nicht unter die Anwendung: der Nutzer soll die Tabelle schieben, nicht die Seite mitsamt Kopfbereich und Seitenleiste.

Ein Werkzeug, das ohne Fläche sinnlos ist, darf schmal eine ehrliche Ersatzansicht zeigen. Der Hinweis „Diese Ansicht braucht ein größeres Fenster" ist erlaubt, das stumme Abschneiden nicht.

Ausrichtung, die für die Sache nötig ist, etwa ein Scheckscanner oder ein Klavier.

### Quelle

Apple HIG › Layout („Determine layout based on size classes, not device type or orientation"). WCAG 1.3.4 Orientation. Fluent 2 › Accessibility › Responsive layouts.

### Verwandt

- Die Höhe gehört der Zeile, nicht dem Element
- Ein Pop-up unterbricht, es führt nicht
- Jeder Textbehälter hält jede Textmenge aus
- Fließtext hat eine Höchstbreite

## Ein Pop-up unterbricht, es führt nicht

Fluss · https://standby.design/docs/rules/fluss-ein-pop-up-unterbricht-es-fuehrt-nicht

**Geltung:** universal · web, react-native

> **Regel**
> Benutze ein Pop-up nur, um den Nutzer auf genau eine Sache aufmerksam zu machen, die jetzt eine Entscheidung braucht. Sobald mehr als eine Eingabe nötig ist oder es um mehr als einen konkreten Hinweis geht, wird daraus ein eigener Screen. Ein Pop-up ist nie eine Eingabemaske.

### Warum

#### Ein Pop-up gehört dem System, nicht dem Nutzer

Das ist der Kern, und alles Weitere folgt daraus. Ein Pop-up ist eine Unterbrechung, und unterbrechen darf nur, wer etwas zu sagen hat, das nicht warten kann. Es ist das Werkzeug, mit dem die Anwendung den Nutzer anspricht.

Ein Formular ist das Gegenteil. Da spricht nicht die Anwendung, da arbeitet der Nutzer. Es ist keine Unterbrechung, sondern das, weswegen er gekommen ist.

Ein Formular in einem Pop-up hat deshalb nicht die falsche Größe, sondern die falsche Richtung. Es benutzt das Werkzeug für das Anhalten, um jemanden weitergehen zu lassen. „Verlassen ohne zu speichern?" ist richtig herum: die Anwendung sagt etwas, der Nutzer antwortet, es ist vorbei. „Kontakt anlegen" ist verkehrt herum.

#### Ein Pop-up verspricht Kürze und bricht das Versprechen

Wer alles andere wegnimmt, geht einen Handel ein: das hier ist gleich vorbei. Ein Formular hält die Anwendung stattdessen minutenlang fest.

Der Preis dafür ist konkreter, als er klingt. Was der Nutzer beim Ausfüllen braucht, liegt fast immer hinter dem Pop-up: die Liste, aus der er kommt, der Wert in der Tabelle daneben, der Name, den er gerade nachsehen wollte. **Er sieht es. Er kann es nicht anfassen.** Das Pop-up zeigt ihm den Zusammenhang und verbietet ihn gleichzeitig. Bei einem Hinweis stört das nicht, bei einer Aufgabe ist es genau das Falsche.

#### Das Pop-up erzeugt seine eigene Nachfrage

Der beste Beweis, dass ein Formular dort nicht hingehört, liefert das Muster selbst. Ein Formular im Pop-up braucht eine Warnung beim Schließen, denn die Eingaben verschwinden mit dem Fenster. Also legt man ein zweites Pop-up darüber: „Änderungen verwerfen?"

Das Muster braucht sich selbst, um den Schaden zu heilen, den es selbst anrichtet. Bei einem Screen stellt sich die Frage gar nicht erst so scharf, weil er einen Ort hat, an den man zurückkommt.

#### Tiefe hat keine Anzeige

Jede andere Form von Navigation zeigt dem Nutzer, wo er ist: ein Pfad, ein Zurück, ein aktiver Reiter. Für gestapelte Fenster gibt es das nicht. Nirgends auf dem Bildschirm steht, dass man drei Ebenen tief steckt.

Deshalb hat Deine Frage keine gute Antwort: **ich bin in Fenster 3 und muss zurück nach Fenster 1.** Was passiert mit Fenster 2? Was mit dem, was in Fenster 3 schon eingegeben wurde? Was macht der Zurück-Knopf des Geräts? Das Problem ist nicht, dass sich das schwer bauen lässt. Das Problem ist, dass es dem Nutzer nicht gezeigt werden kann, weil es keine Darstellung für Tiefe gibt.

#### Ein Screen hat eine Adresse, ein Pop-up nicht

Alles, woran jemand länger als einen Moment arbeitet, muss adressierbar sein: verlinkbar, nach einem Absturz wiederherstellbar, im Verlauf auffindbar, an einen Kollegen schickbar. Ein Formular im Pop-up kann nichts davon. Es existiert nur, solange niemand danebentippt.

#### Verschachtelte Pop-ups sind eine Sackgasse für die Tastatur

Ein Pop-up muss den Fokus einsperren, sonst tabbt man hinter das Fenster. Liegt eines im anderen, liegen zwei Fallen ineinander. Wer nicht mit der Maus arbeitet, findet aus so einer Verschachtelung schwer wieder heraus. Für ein einzelnes „Ja oder Nein" ist die Falle harmlos, für ein Formular ist sie es nicht.

### Der Test

Zwei Fragen, in dieser Reihenfolge:

1. **Braucht es mehr als eine Eingabe?** Dann ist es ein Screen.
2. **Geht es um mehr als einen konkreten Hinweis?** Dann ist es ein Screen.

Bleibt beides „nein", darf es ein Pop-up sein. Der Test ist die praktische Fassung der Richtungsfrage von oben: eine einzelne Antwort gibt der Nutzer der Anwendung, ab der zweiten arbeitet er. Er ist bewusst scharf, weil die Grauzone genau der Ort ist, an dem die Fenster anfangen sich zu stapeln.

### Was ein Pop-up darf

- Vor einem Verlust warnen und die Entscheidung einholen: verlassen ohne zu speichern, löschen, überschreiben
- Ein Ergebnis melden, das der Nutzer nicht übersehen darf und dessen Folge er bestätigen muss
- Genau einen Wert abfragen, wenn er allein steht und der Vorgang danach zu Ende ist

In allen drei Fällen redet die Anwendung, und der Nutzer antwortet mit einem Wort.

Solange ein Pop-up offen ist, ist alles dahinter still: Die Seite scrollt nicht mit, und weder Tab noch Screenreader erreichen etwas dahinter. Sonst bedient der Nutzer eine Seite, die er nicht sieht.

### Woran Du den Verstoß erkennst

- Im Pop-up stehen mehrere Eingabefelder oder ein „Speichern" für mehrere Werte.
- Aus einem Pop-up heraus öffnet sich ein zweites.
- Es gibt eine Warnung „Änderungen verwerfen?" beim Schließen eines Pop-ups.
- Das Pop-up hat Reiter, Schritte oder einen eigenen Scrollbereich.
- Der Zurück-Knopf des Geräts schließt etwas anderes als das, was der Nutzer erwartet.
- Der Zustand lässt sich nicht verlinken und kommt nach einem Neuladen nicht wieder.
- Das Pop-up hat eine Überschrift, die eigentlich ein Seitentitel ist.
- Hinter dem offenen Pop-up scrollt die Seite mit, oder Tab erreicht Elemente dahinter. Kein `inert` am Hintergrund, kein `overscroll-behavior: contain` im Pop-up.

### Richtig / falsch

```
        RICHTIG                             FALSCH

  ┌───────────────────────┐           ┌───────────────────────┐
  │ Kontakt bearbeiten    │           │ Kontakte              │
  │                       │           │  ┌──────────────────┐ │
  │ Name   [__________]   │           │  │ Bearbeiten       │ │
  │ Mail   [__________]   │           │  │ Name [________]  │ │
  │ Rolle  [__________]   │           │  │  ┌─────────────┐ │ │
  │                       │           │  │  │ Rolle wählen│ │ │
  │        [ Speichern ]  │           │  │  │  ┌────────┐ │ │ │
  └───────────────────────┘           │  │  │  │ Sicher?│ │ │ │
   eigener Screen, hat eine           │  │  │  └────────┘ │ │ │
   Adresse, Zurück ist klar           │  │  └─────────────┘ │ │
                                      │  └──────────────────┘ │
  ┌───────────────────────┐           └───────────────────────┘
  │ Ohne Speichern raus?  │            Fenster 3 zurück nach 1:
  │  [Abbrechen] [Raus]   │            keine gute Antwort
  └───────────────────────┘
   ein Hinweis, eine Entscheidung
```

### Grenzen

Nicht jedes Ding, das über dem Inhalt liegt, ist ein Pop-up im Sinne dieser Regel. Ausgenommen sind Elemente, die zu einem Bedienelement gehören und mit ihm verschwinden:

- Tooltip und Hinweis am Element
- Aufklappmenü und Auswahlliste
- Datums- und Zeitauswahl an einem Feld
- Kurzmeldung, die von selbst geht und nichts blockiert

Sie unterbrechen nicht, sie erweitern das Element darunter. Der Unterschied ist nicht die Technik, sondern die Richtung: sie tun, was der Nutzer gerade will, statt ihn anzuhalten.

Ein Panel, das von der Seite oder von unten einfährt, ist kein Schlupfloch. Steht ein Formular darin, gilt die Regel genauso: es hat keine Adresse und stapelt genauso.

### Verwandt

- Der Fokus ist sichtbar und hat immer einen Ort
- Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um
- Klickbares hat eine Fläche, und nur Klickbares sieht so aus

## Leer ist ein Zustand, keine Lücke

Fluss · https://standby.design/docs/rules/fluss-leer-ist-ein-zustand-keine-luecke

**Geltung:** universal · web, react-native

> **Regel**
> Gib jeder Liste, Tabelle, Auswertung und Suchtrefferliste einen gestalteten leeren Zustand. Er sagt, warum nichts da ist, und bietet den nächsten Schritt an. Eine unbeschriebene Fläche ist keine Antwort.

### Warum

Vor einer leeren Fläche kann der Nutzer drei Dinge vermuten: es lädt noch, es ist etwas kaputt, oder es gibt wirklich nichts. Er hat keine Möglichkeit zu unterscheiden, und alle drei führen zu verschiedenem Verhalten — warten, neu laden, weitermachen. Ohne Antwort wählt er falsch.

Dazu kommt: der leere Zustand ist bei jedem neuen Nutzer der **erste** Zustand. Er sieht ihn, bevor er irgendetwas anderes sieht. Eine Anwendung, deren erster Eindruck eine unbeschriebene Fläche ist, wirkt nicht aufgeräumt, sondern unfertig.

### Drei Sorten leer, drei Antworten

Der häufigste Fehler ist nicht der fehlende leere Zustand, sondern derselbe Text für alle drei Fälle.

| Fall | Was der Nutzer wissen muss | Ton |
|---|---|---|
| **Noch nichts angelegt** | Was hier stehen wird, und wie er den ersten Eintrag anlegt | einladend, mit Aktion |
| **Nichts gefunden** | Wonach gesucht wurde, und wie er die Suche lockert | sachlich, mit Weg zurück |
| **Nichts mehr offen** | Dass er fertig ist | bestätigend, ohne Aktion |

„Keine Daten vorhanden" beantwortet keinen der drei Fälle. Beim dritten ist es sogar falsch: dort ist leer das gute Ergebnis, und der Text sollte das sagen statt einen Mangel zu melden.

### Was ein leerer Zustand tut

- Er nennt den Grund in einem Satz.
- Er bietet den nächsten Schritt an, wenn es einen gibt — und nur einen.
- Er steht an derselben Stelle, an der später der Inhalt steht, und verschiebt das Layout nicht.
- Er bleibt im Verhältnis. Eine große Illustration für eine leere Liste in einer Karte ist mehr Aufwand als der Inhalt, den sie ersetzt.

### Woran Du den Verstoß erkennst

- Eine Liste rendert bei null Einträgen einfach nichts.
- Derselbe Text erscheint für „noch nie etwas angelegt" und für „Filter ergibt nichts".
- Der leere Zustand meldet einen Mangel, obwohl leer das Ziel war (Posteingang abgearbeitet, keine offenen Fehler).
- Es gibt keinen Weg aus dem leeren Zustand heraus, obwohl ein Filter ihn verursacht hat.
- Der leere Zustand ist höher oder niedriger als der gefüllte, und die Seite springt beim Laden.

### Grenzen

Nicht jede leere Fläche braucht Text. Eine Spalte in einer Tabelle, ein einzelnes Feld, ein Diagrammabschnitt ohne Wert — dort reicht ein Strich oder ein Zeichen für „kein Wert", siehe Eine Bedeutung, überall gleich. Die Regel gilt für Bereiche, die als Ganzes leer sind.

### Verwandt

- Eine Bedeutung, überall gleich
- Der Platz ist da, bevor die Daten kommen
- Ein Fehler steht dort, wo er entstanden ist

## Der Platz ist da, bevor die Daten kommen

Fluss · https://standby.design/docs/rules/fluss-der-platz-ist-da-bevor-die-daten-kommen

**Geltung:** universal · web, react-native · **Korridor:** 150-250ms bis zur ersten Anzeige · **Vorgabe:** 200ms

> **Regel**
> Reserviere den Platz für Inhalt, bevor er eintrifft. Unter etwa 200 Millisekunden zeigst Du gar keinen Ladehinweis. Dauert es länger, zeigst Du die Form des kommenden Inhalts. Dauert es sehr lange, sagst Du, was passiert.

### Warum

#### Nichts darf springen

Trifft der Inhalt ein und schiebt alles darunter nach unten, verliert der Nutzer seine Stelle. Schlimmer: er hat vielleicht schon gezielt und drückt jetzt auf etwas anderes, als er treffen wollte. Das ist kein Schönheitsfehler, das ist eine Fehlbedienung, die die Oberfläche verursacht hat.

Deshalb wird der Platz vorher belegt, in der Form, die der Inhalt haben wird. Ein Platzhalter, der die Umrisse des echten Aufbaus zeigt, tut zwei Dinge auf einmal: er hält den Platz und er sagt schon, was kommt.

#### Ein Zeichen, das sofort wieder geht, stört mehr als die Wartezeit

Unter etwa einer Zehntelsekunde wirkt eine Reaktion unmittelbar, da braucht es gar keine Rückmeldung. Bis etwa einer Sekunde bleibt der Gedanke des Nutzers zusammenhängend, er wartet, ohne abzuschweifen. Erst darüber verliert er den Faden und braucht etwas, das ihn hält.

Ein Ladezeichen, das aufblitzt und sofort verschwindet, macht die Oberfläche deshalb nicht hilfreicher, sondern unruhiger. Es meldet ein Problem, das es nicht gab.

#### Der Nutzer wartet auf einen Teil, nicht auf alles

Lädt ein Bereich, wird auch nur dieser Bereich als ladend gezeigt. Eine ganze Seite zu sperren, weil ein Diagramm noch rechnet, nimmt dem Nutzer alles andere weg, was schon da wäre.

### Die Stufen

| Dauer | Was Du zeigst |
|---|---|
| bis ~200 ms | nichts |
| ~200 ms bis ein paar Sekunden | die Form des kommenden Inhalts, an seinem Platz |
| darüber | zusätzlich, was gerade passiert, und wenn möglich wie weit |
| sehr lang oder unbestimmt | einen Weg heraus: abbrechen, später benachrichtigen, im Hintergrund weiterlaufen |

Die Zahlen sind eine Vorgabe. Hart ist die Staffelung: erst nichts, dann Form, dann Auskunft.

Ist ein Ladehinweis einmal erschienen, bleibt er eine Mindestzeit stehen. Kommt die Antwort kurz nach der Schwelle, blitzt er sonst für ein paar Millisekunden auf, genau das Flackern, das die Schwelle verhindern soll.

| | Status |
|---|---|
| Erst nichts, dann Form, dann Auskunft | hart |
| Ein erschienener Ladehinweis hat eine Mindestdauer | hart |
| Schwelle bis zur ersten Anzeige | weich, Korridor 150 bis 250 ms, Vorgabe 200 |
| Mindestdauer | weich, Korridor 300 bis 500 ms, Vorgabe 400 |

### Woran Du den Verstoß erkennst

- Der Inhalt trifft ein und schiebt die Seite nach unten.
- Ein Ladezeichen blitzt bei jedem Wechsel kurz auf.
- Ein Ladehinweis verschwindet wenige Millisekunden nach dem Erscheinen.
- Ein einzelner ladender Bereich sperrt die ganze Ansicht.
- Der Platzhalter hat eine andere Höhe als der echte Inhalt.
- Bei einem langen Vorgang steht minutenlang ein sich drehender Kreis ohne Auskunft.
- Es gibt keine Möglichkeit, einen langen Vorgang zu verlassen.

### Grenzen

Beim ersten Start einer Anwendung, wenn noch gar keine Form bekannt ist, ist ein einfacher Ladehinweis in Ordnung. Die Regel greift dort, wo der Aufbau schon feststeht und nur die Daten fehlen.

Ein Vorgang, den der Nutzer selbst ausgelöst hat und dessen Ergebnis er abwartet — ein Export, eine Zahlung —, darf ihn festhalten. Er muss dann aber wissen, woran er ist.

### Verwandt

- Leer ist ein Zustand, keine Lücke
- Ein Fehler steht dort, wo er entstanden ist
- Bewegung hat einen Wert und hält nichts auf

## Der Zustand der Ansicht steht in der Adresse

Fluss · https://standby.design/docs/rules/fluss-der-zustand-der-ansicht-steht-in-der-adresse

**Geltung:** universal · web, react-native

> **Regel**
> Leg Filter, Sortierung, Suche, Tab, Seite und geöffnetes Detail in die URL. Zurück stellt Ansicht und Scrollposition wieder her.

### Warum

Nur so lässt sich eine Ansicht teilen, neu laden und mit Zurück wiederfinden.

### Woran Du den Verstoß erkennst

- Filter nur im Komponenten-State.
- Tabs ohne Query-Parameter.
- Neuladen setzt alles zurück.
- Zurück landet oben statt an der alten Stelle.

### Hart und weich

Hart.

### Grenzen

Flüchtiges (Hover, offenes Menü, ungespeicherte Eingaben) und alles Vertrauliche.

### Quelle

Vercel › State & Navigation („URL reflects state", „Back/Forward restores scroll position").

### Verwandt

- Ein Pop-up unterbricht, es führt nicht
- Eine Eingabe wechselt nie von selbst den Ort

## Eine Eingabe wechselt nie von selbst den Ort

Fluss · https://standby.design/docs/rules/fluss-eine-eingabe-wechselt-nie-von-selbst-den-ort

**Geltung:** universal · web, react-native

> **Regel**
> Eine Auswahl, Eingabe oder ein Fokus allein öffnet keine neue Seite, sendet nichts ab und springt in kein anderes Feld.

### Warum

Wer mit Pfeiltasten durch eine Auswahl blättert, landet sonst bei jedem Schritt woanders.

### Woran Du den Verstoß erkennst

- `select` mit `onChange={navigate}`.
- Absenden beim letzten Zeichen.
- Fokus springt ungefragt ins nächste Feld.

### Hart und weich

Hart.

### Grenzen

Filter und Sortierung, die nur die aktuelle Ansicht ändern. Code-Felder, deren Weiterspringen angekündigt ist.

### Quelle

WCAG 3.2.1 On Focus, 3.2.2 On Input.

### Verwandt

- Der Zustand der Ansicht steht in der Adresse
- Ein Fehler steht dort, wo er entstanden ist

## Eine Zeitgrenze warnt vorher

Fluss · https://standby.design/docs/rules/fluss-eine-zeitgrenze-warnt-vorher

**Geltung:** universal · web, react-native · **Vorgabe:** Warnung zwei Minuten vor Ablauf

> **Regel**
> Warne vor dem Ablauf jeder Zeitgrenze, biete eine Verlängerung an und bewahre die Eingaben über eine neue Anmeldung hinweg.

### Warum

Wer langsam tippt oder kurz weg ist, verliert sonst seine Arbeit an eine Uhr, die er nicht sieht.

### Woran Du den Verstoß erkennst

- Abmeldung ohne Hinweis vorher.
- Nach dem neuen Login ist das Formular leer.
- Ein Angebot oder Schritt läuft ab, ohne dass die Ansicht es ankündigt.

### Hart und weich

Hart: Warnung, Verlängerung, Eingaben bleiben. Weich: wann gewarnt wird. Vorgabe zwei Minuten vorher.

### Grenzen

Echtzeit-Vorgänge wie Auktionen. Zeitgrenzen über 20 Stunden.

### Quelle

WCAG 2.2.1 Timing Adjustable, 2.2.5 Re-authenticating, 2.2.6 Timeouts.

### Verwandt

- Ein Fehler steht dort, wo er entstanden ist
- Was vorweg angezeigt wird, wird bei Fehler zurückgenommen

## Was vorweg angezeigt wird, wird bei Fehler zurückgenommen

Fluss · https://standby.design/docs/rules/fluss-was-vorweg-angezeigt-wird-wird-bei-fehler-zurueckgenommen

**Geltung:** universal · web, react-native

> **Regel**
> Nimm eine Änderung, die Du vor der Antwort des Servers angezeigt hast, bei einem Fehler sichtbar zurück und sag dazu, dass es nicht geklappt hat.

### Warum

Sonst glaubt der Nutzer, es sei gespeichert. Den Unterschied merkt er erst beim nächsten Laden, wenn er nicht mehr weiß, was er getan hat.

### Woran Du den Verstoß erkennst

- Optimistisches Setzen des Zustands ohne `catch` und ohne Rücknahme.
- Fehler landet nur in der Konsole.
- Nach dem Fehler steht der neue Wert weiter da.

### Hart und weich

Hart.

### Grenzen

Änderungen, die erst nach der Antwort angezeigt werden.

### Quelle

Vercel Web Interface Guidelines › Interactions („Optimistic updates … On failure, show an error & roll back or provide Undo").

### Verwandt

- Ein Fehler steht dort, wo er entstanden ist
- Der Platz ist da, bevor die Daten kommen
- Eine Zeitgrenze warnt vorher

## Die Sprache kommt aus der Einstellung, nicht aus dem Ort

Fluss · https://standby.design/docs/rules/fluss-die-sprache-kommt-aus-der-einstellung-nicht-aus-dem-ort

**Geltung:** universal · web, react-native

> **Regel**
> Wähle die Sprache aus der Einstellung von Browser oder Konto und lass sie jederzeit umstellen.

### Warum

Wer im Urlaub ist oder eine andere Sprache spricht als sein Land, bekommt sonst eine Oberfläche, die er nicht lesen kann.

Die gewählte Sprache steht auch im Code, als `lang` an der Wurzel der Seite, und wechselt mit. Danach richten sich Aussprache des Screenreaders, Silbentrennung und das Übersetzungsangebot des Browsers. Ein Abschnitt in einer anderen Sprache bekommt sein eigenes `lang`.

### Woran Du den Verstoß erkennst

- Sprachwahl über IP oder Standort.
- Kein Weg, die Sprache zu wechseln.
- Die Wahl wird beim nächsten Besuch vergessen.
- `lang` fehlt, steht auf „en“ an einer deutschen Oberfläche oder wechselt beim Umschalten der Sprache nicht mit.

### Hart und weich

Hart.

### Grenzen

Inhalte, die rechtlich am Ort hängen, etwa Preise und Steuern. Die Sprache bleibt trotzdem frei.

### Quelle

WCAG 3.1.1 Language of Page, 3.1.2 Language of Parts. Vercel Web Interface Guidelines › Content („Prefer language settings over location … Never rely on IP/GPS for language").

### Verwandt

- Jede Ansicht folgt dem Platz und bricht bei 320 Pixeln um

## Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben

Fluss · https://standby.design/docs/rules/fluss-konfiguration-bekommt-eine-seite-ansichts-einstellungen-bleiben

**Geltung:** universal · web, react-native

> **Regel**
> Lass eine Einstellung auf der Seite, wenn sie drei Bedingungen erfüllt: Sie wirkt sofort, sie betrifft nur diese Ansicht, und sie braucht kein Speichern. Fehlt eine davon, ist sie Konfiguration und bekommt eine eigene Seite mit Adresse. Dort gibt es ein Formular und ein Speichern.

### Warum

Die beiden Arten unterscheiden sich darin, wann der Nutzer sie braucht. Eine Ansichts-Einstellung braucht er mitten in der Arbeit: Filter, Sortierung, Zeitraum, sichtbare Spalten, Einheit. Er sieht das Ergebnis sofort, also gehört sie dorthin, wo er hinschaut.

Eine Konfiguration legt er einmal fest und ändert sie selten: einen Abgabensatz, Kontonummern, eine Schwelle. Sie wirkt auf andere Seiten und oft auf andere Nutzer. Liegt sie aufklappbar auf einer Arbeitsseite, schiebt sie beim Öffnen die Arbeit aus dem Blick. Beim nächsten Mal findet sie niemand, weil sie hinter einem Pfeil liegt statt hinter einer Adresse.

Das Speichern ist das sicherste Zeichen. Braucht eine Einstellung einen Speichern-Knopf, ist sie ein Formular, und ein Formular braucht eine Adresse, wie bei Ein Pop-up unterbricht, es führt nicht. Mehrere Speichern-Knöpfe auf einer Seite werfen die Frage auf, ob der untere auch das speichert, was oben geändert wurde.

### Der Schnitt

| Beispiel | wirkt sofort | nur diese Ansicht | ohne Speichern | Ort |
|---|---|---|---|---|
| Zeitraum, Filter, Sortierung | ja | ja | ja | auf der Seite |
| Schalter „Wochenenden ausblenden“ | ja | ja | ja | auf der Seite |
| Spaltenauswahl, die für den Nutzer gemerkt wird | ja | ja | ja, speichert beim Ändern | auf der Seite |
| Abgabensatz für alle Berechnungen | nein | nein | nein | eigene Seite |
| Kontonummern, aus denen eine Kennzahl rechnet | nein | nein | nein | eigene Seite |
| Benachrichtigungen | nein | nein | ja | eigene Seite, weil sie nicht zur Ansicht gehört |

### Mehrere Listen und Tabellen

Die Regel misst keine Länge und begrenzt keinen Inhalt. Eine Seite darf viele Listen und Tabellen zeigen. Sie begrenzt nur das Sammeln: Höchstens ein Bereich einer Seite sammelt Änderungen und speichert sie gemeinsam. Alles andere speichert beim Ändern oder zeigt nur an.

### Hart und weich

| | Status |
|---|---|
| Eine Ansichts-Einstellung bleibt auf der Seite und wirkt sofort | hart |
| Eine Konfiguration bekommt eine eigene Seite mit Adresse | hart |
| Höchstens ein Bereich pro Seite sammelt Änderungen für ein gemeinsames Speichern | hart |
| Wo die Einstellungsseite in der Navigation hängt | weich, Vorgabe im Bereich, von einer zentralen Einstellungsseite verlinkt |

### Woran Du den Verstoß erkennst

- Ein Abschnitt „Einstellungen“ mit Pfeil liegt über einer Tabelle.
- Ein Aufklappbereich hat einen eigenen Speichern-Knopf.
- Jeder Abschnitt einer Seite speichert für sich.
- Eine Konfiguration lässt sich nicht verlinken.
- Ein Filter oder eine Sortierung hat einen Speichern-Knopf. Das ist derselbe Fehler, nur andersherum.

### Grenzen

Aufklappen bleibt richtig für Hinweise, Erklärungen und die Details einer Tabellenzeile.

Ein leerer Zustand, dem eine Konfiguration fehlt, darf direkt zur Einstellungsseite führen. Siehe Leer ist ein Zustand, keine Lücke.

### Verwandt

- Ein Pop-up unterbricht, es führt nicht
- Ein Fehler steht dort, wo er entstanden ist

## Ein Ablauf mit Schritten zeigt, wie weit man ist

Fluss · https://standby.design/docs/rules/fluss-ein-ablauf-mit-schritten-zeigt-wie-weit-man-ist

**Geltung:** universal · web, react-native

> **Regel**
> Zeig in jedem Ablauf über mehrere Schritte, wie weit der Nutzer ist, und lass auf jedem Schritt zurück, ohne dass eine Eingabe verloren geht.

### Warum

Wer nicht weiß, wie viel noch kommt, bricht eher ab. Wer zurückgeht und alles neu tippen muss, bricht sicher ab.

### Woran Du den Verstoß erkennst

- Mehrstufiges Formular ohne Fortschrittsanzeige.
- Zurück leert die Felder.
- Es gibt nur den Zurück-Knopf des Browsers, und der verlässt den Ablauf.

### Hart und weich

Hart: der Fortschritt ist sichtbar, Zurück ohne Verlust. Weich: wie der Fortschritt aussieht. Ein Fortschrittsbalken reicht, ausgeschriebene Schritte sind nicht nötig.

### Grenzen

Abläufe mit einem Schritt. Hängt die Länge von den Antworten ab, zeigt die Anzeige den Fortschritt nach dem, was bekannt ist.

### Quelle

Laws of UX › Zeigarnik Effect und Goal-Gradient Effect, https://lawsofux.com/

### Verwandt

- Ein Pop-up unterbricht, es führt nicht
- Der Platz ist da, bevor die Daten kommen
- Der Zustand der Ansicht steht in der Adresse

## Ein Fehler steht dort, wo er entstanden ist

Fluss · https://standby.design/docs/rules/fluss-ein-fehler-steht-dort-wo-er-entstanden-ist

**Geltung:** universal · web, react-native

> **Regel**
> Zeige einen Fehler an der Stelle, die er betrifft, beim Feld das Feld, beim Bereich der Bereich. Sag, was zu tun ist, nicht was kaputt gegangen ist. Lass die Eingaben des Nutzers stehen. Jede Meldung ohne Seitenwechsel liegt in einem Live-Bereich, damit der Screenreader sie ansagt.

### Warum

Ein Fehler ist eine Anweisung, keine Meldung. Der Nutzer will nicht wissen, was das System nicht konnte, sondern was er jetzt macht. „Ungültiges Format" sagt ihm nichts. „Bitte im Format TT.MM.JJJJ eingeben" sagt ihm alles.

Deshalb muss er auch dort stehen, wo gehandelt wird. Steht der Fehler weit weg von dem Feld, das er betrifft, muss der Nutzer die Verbindung selbst herstellen — bei drei Fehlern in einem Formular ist das eine Suchaufgabe.

Und das Wichtigste, das am häufigsten verletzt wird: **die Eingaben bleiben.** Ein Fehler, der das Formular leert, bestraft den Nutzer für einen Tippfehler. Nach dem zweiten Mal macht er nicht weiter.

Sonst erfährt ein Screenreader-Nutzer nie, dass gespeichert wurde oder dass es keine Treffer gibt.

### Wann der Fehler kommt

Prüf ein Feld, wenn der Nutzer es verlässt. Beim Tippen meldet sich der Fehler zu früh, weil die Eingabe noch nicht fertig ist. Erst beim Absenden ist es zu spät, weil der Nutzer dann schon drei Felder weiter ist.

Das Feld nimmt dabei jede Eingabe an, siehe Was der Nutzer tippt oder einfügt, kommt an. Ist sie ungültig, markiert sich das Feld beim Verlassen und sagt, was fehlt.

### Wo eine Meldung hingehört

| Was passiert ist | Wo es steht |
|---|---|
| Eine Eingabe stimmt nicht | am Feld, direkt darunter, mit dem Feld markiert |
| Ein Bereich konnte nicht laden | im Bereich, an der Stelle des Inhalts, mit „nochmal versuchen" |
| Eine Aktion ist gelungen, das Ergebnis sieht man nicht | Kurzmeldung, die von selbst geht |
| Etwas ist außerhalb des Blicks passiert | Kurzmeldung |
| Der Nutzer ist im Begriff, etwas zu verlieren | Pop-up, siehe Ein Pop-up unterbricht, es führt nicht |

Kein Pop-up für Eingabefehler. Das Pop-up nimmt genau das Formular weg, in dem der Nutzer den Fehler beheben soll.

### Kurzmeldungen

Eine Kurzmeldung (Toast) ist ein gutes Werkzeug, wenn sie das Richtige tut: bestätigen, dass etwas passiert ist, dessen Ergebnis man gerade nicht sieht. Gespeichert, verschickt, in den Papierkorb gelegt.

Dafür gelten drei Bedingungen:

- Sie blockiert nichts und verlangt nichts. Wer sie übersieht, verliert nichts.
- Sie ist nie der einzige Ort einer wichtigen Information. Was der Nutzer später noch braucht, gehört an eine bleibende Stelle.
- Sie erscheint nicht für einen Fehler, den man an einem Feld beheben kann. Der gehört ans Feld.

Ist eine Handlung rückgängig zu machen, gehört das Angebot dazu in die Kurzmeldung („Gelöscht — rückgängig"). Das ist ihr stärkster Einsatz, weil sie damit eine Bestätigung vorher überflüssig macht.

Eine Kurzmeldung mit Handlung bleibt stehen, solange der Mauszeiger auf ihr liegt oder sie den Fokus hat, und sie ist per Tastatur erreichbar. Sonst ist das Angebot weg, bevor ein langsamer Nutzer es greifen kann.

### Was in einer Meldung steht

- Was der Nutzer tun kann, in seiner Sprache.
- Kein Fehlercode, kein technischer Wortlaut, keine Meldung aus dem System durchgereicht.
- Keine Schuldzuweisung, weder an ihn noch an das System.
- Bei einem Fehler, der nicht in seiner Hand liegt: was gerade gilt und wann er es erneut versuchen kann.

### Hart und weich

Hart. Weich: `polite` oder `assertive`. Vorgabe `polite`.

### Woran Du den Verstoß erkennst

- Ein Eingabefehler erscheint als Pop-up.
- Alle Fehler eines Formulars stehen gesammelt oben statt bei den Feldern.
- Das Formular ist nach einem Fehler leer.
- Eine technische Meldung steht ungefiltert in der Oberfläche.
- Eine Kurzmeldung trägt eine Information, die der Nutzer später wieder braucht.
- Es gibt eine Bestätigungsfrage für etwas, das man auch rückgängig machen könnte.
- Eine Kurzmeldung mit „Rückgängig“ verschwindet nach fester Zeit, auch wenn die Maus auf ihr liegt.
- Ein ungültiges Feld schweigt bis zum Absenden.
- Die Fehlermeldung erscheint beim ersten Tastendruck.
- Kurzmeldung ohne `role="status"` oder `aria-live`.
- Trefferzahl ändert sich still.
- Der Live-Bereich wird erst mit der Meldung eingefügt.

### Grenzen

Fehler, die die ganze Anwendung betreffen — keine Verbindung, abgelaufene Anmeldung —, gehören an eine Stelle, die über allem liegt. Sie betreffen kein einzelnes Feld, und der Nutzer muss sie sehen, bevor er weitertippt.

Fehler, die nach Der Fokus ist sichtbar und hat immer einen Ort ohnehin den Fokus bekommen.

### Quelle

WCAG 4.1.3 Status Messages. Vercel › Feedback („Use polite `aria-live` for toasts/inline validation").

### Verwandt

- Ein Pop-up unterbricht, es führt nicht
- Leer ist ein Zustand, keine Lücke
- Rot ist nicht ein Rot
- Der Platz ist da, bevor die Daten kommen
- Der Fokus ist sichtbar und hat immer einen Ort

## Konzentrische Radien

Form · https://standby.design/docs/rules/form-konzentrische-radien

**Geltung:** universal · web, react-native

> **Regel**
> Liegt eine gerundete Fläche in einer anderen, rechne den Innenradius aus: `r_innen = r_außen − Abstand`. Beide Rundungen haben dann denselben Mittelpunkt.

### Warum

Haben zwei Rundungen verschiedene Mittelpunkte, wird der Spalt zwischen ihnen in der Ecke breiter oder schmaler als an der geraden Kante. Das sieht man auch dann, wenn man nicht weiß warum: die Ecke wirkt gequetscht oder ausgefranst. Mit demselben Mittelpunkt bleibt der Spalt rundherum gleich breit, und die innere Fläche sitzt sauber in der äußeren.

Der Fehler passiert fast immer dadurch, dass innen und außen derselbe Radius steht — das wirkt naheliegend, ist aber genau der Fall, in dem die Ecke am stärksten kippt.

### Woran Du den Verstoß erkennst

- Innere und äußere Fläche haben denselben Radius-Wert.
- Der innere Radius ist größer als der äußere.
- Die Ecke sieht bei genauem Hinsehen enger aus als die Gerade daneben.
- Zwei Buttons in einer Zeile haben verschiedene Radien.
- Eine Ansicht setzt den Radius eines Buttons, Feldes oder einer Auswahl selbst.

### Richtig / falsch

```
 ╭─────────────────────────╮   r_außen = 12
 │  ╭───────────────────╮  │   Abstand =  4
 │  │                   │  │   r_innen =  8
 │  ╰───────────────────╯  │
 ╰─────────────────────────╯
      gleicher Mittelpunkt

 ╭─────────────────────────╮   r_außen = 12
 │  ╭───────────────────╮  │   Abstand =  4
 │  │                   │  │   r_innen = 12  ← falsch
 │  ╰───────────────────╯  │
 ╰─────────────────────────╯
      Spalt läuft in der Ecke zusammen
```

### Die Menge der Radien ist geschlossen

Damit die Rechnung überhaupt aufgehen kann, muss es eine begrenzte, benannte Menge an Radien geben. Sonst entsteht mit jedem Einzelfall eine neue Rundung, und zwei Werte, die zusammengehören sollen, sind nie wieder dieselben.

Der häufigste Weg, auf dem Radien an der Skala vorbeiwachsen: eine Utility-Klasse für einen mittleren Radius wird überall benutzt, ist in der Konfiguration aber gar nicht definiert und fällt auf den Standardwert des Frameworks zurück. Daneben steht eine Stufe aus dem eigenen System. Zwei Rundungen ohne gemeinsame Skala, und niemand hat je eine Entscheidung dazu getroffen.

Wie viele Stufen es gibt und ob sie mit der Verschachtelungstiefe kleiner werden, entscheidet das Projekt. Manche Systeme fahren einen einzigen Radius für alles, und das ist eine gültige Antwort.

### Gleiche Zeile, gleicher Radius

Bedienelemente, die nebeneinander stehen, haben alle denselben Radius. Verschiedene Radien in einer Reihe sind ein Verstoß. Der Radius gehört dem Bauteil. Eine Ansicht überschreibt ihn nicht, auch nicht, damit eine Gruppe „dichter“ wirkt. Ein Knopf im Rahmen eines Feldes ist das innere Element und folgt der Rechnung oben: Feld 8, Abstand 4, Knopf 4.

### Grenzen

Die Rechnung greift nur, wenn der Abstand **kleiner** als der Außenradius ist. Ein Element mit 16 Abstand zur Kante liegt bei einem Außenradius von 12 rechnerisch außerhalb der Rundung, die Formel ergibt einen negativen Wert. Es ist dann weit genug von der Ecke entfernt, dass Konzentrik keine Rolle mehr spielt, und nimmt einfach eine Stufe aus der Menge.

Volle Rundungen bei Pills und Avataren sind keine Stufe, sondern eine eigene Form, und bleiben davon unberührt.

### Verwandt

- Die Karte hat kein Padding
- Werte kommen aus Tokens, nie aus der Hand

## Senkrechtes Padding wird optisch ausgeglichen

Form · https://standby.design/docs/rules/form-senkrechtes-padding-wird-optisch-ausgeglichen

**Geltung:** universal · web, react-native · **Vorgabe:** 14 senkrecht gegen 16 waagerecht

> **Regel**
> Setze das senkrechte Padding eine Spur kleiner als das waagerechte, wenn es rundherum gleich aussehen soll. Gleich gemessen ist nicht gleich gesehen.

### Warum

Senkrechter Weißraum wirkt größer als waagerechter desselben Maßes. Setzt Du rundherum denselben Wert, sieht die Fläche oben und unten luftiger aus als an den Seiten, obwohl das Lineal etwas anderes sagt. Die kleine Absenkung gleicht das aus.

Das ist keine Frage des Geschmacks, sondern Wahrnehmung, und sie ist in der Gestaltung seit langem bekannt. Derselbe Effekt eine Ebene tiefer: ein waagerechter Strich wirkt dicker als ein senkrechter gleicher Breite. Schriftgestalter ziehen die Waagerechten in einem Buchstaben deshalb dünner als die Senkrechten, sonst wirkt das Zeichen kopflastig. Wer es misst, findet den Unterschied. Wer es liest, sieht ihn nicht — und genau das ist das Ziel.

Es ist derselbe Gedanke wie bei optischer statt mathematischer Zentrierung: das Auge entscheidet, nicht das Maßband.

### Hart und weich

| | Status |
|---|---|
| Senkrechtes Padding ist kleiner als waagerechtes, wenn es gleich wirken soll | hart |
| Der Ausgleichswert ist eine benannte Stufe der Skala, kein Wert in der Ansicht | hart |
| Um wie viel kleiner | weich, Vorgabe 14 gegen 16, also etwa ein Achtel |

Der Abstand zwischen den beiden Werten darf klein sein. Er soll nicht auffallen, er soll die Auffälligkeit beseitigen.

### Woran Du den Verstoß erkennst

- Ein Kartenabschnitt hat rundherum denselben Wert, und der Textblock wirkt oben und unten trotzdem zu weit von der Kante weg.
- Das Padding wird mit einem einzigen `p-4` gesetzt statt getrennt nach Achse.
- Der Ausgleichswert steht als Rohwert im Code, weil die Skala ihn nicht kennt.

### Richtig / falsch

```
        RICHTIG                             FALSCH
   14 senkrecht · 16 waagerecht        16 rundherum

╔═════════════════════════╗       ╔═════════════════════════╗
║                         ║ ⇕14   ║                         ║ ⇕16
║      Financial Health   ║       ║      Financial Health   ║
║                         ║ ⇕14   ║                         ║ ⇕16
╚═════════════════════════╝       ╚═════════════════════════╝
 ├────┤             ├────┤         ├────┤             ├────┤
   16                 16             16                 16

 wirkt gleichmäßig                  wirkt oben und unten luftiger
```

### Der Ausgleichswert braucht eine eigene Stufe

Übliche Abstands-Skalen springen von 12 auf 16 und kennen den Wert dazwischen nicht. Wer ihn dann im Code von Hand setzt, hat ihn ab da an jeder Stelle einzeln stehen.

Der Ausgleichswert gehört deshalb als benannte Stufe in die Skala, mit einem Namen, der sagt wofür er da ist. Sonst wird er jedes Mal neu erfunden, und beim dritten Mal ist er nicht mehr derselbe.

### Grenzen

Der Ausgleich gilt für Flächen mit Text. Bei einem quadratischen Icon-Element ist das Quadrat das Ziel, dort wird nicht ausgeglichen.

### Verwandt

- Die Karte hat kein Padding
- Die Höhe gehört der Zeile, nicht dem Element

## Die Ebene folgt der Rolle, nicht der Schachtelung

Fläche · https://standby.design/docs/rules/flaeche-die-ebene-folgt-der-rolle-nicht-der-schachtelung

**Geltung:** universal · web, react-native · **Vorgabe:** drei Ebenen

> **Regel**
> Lege die Flächenebenen als geschlossene, benannte Menge fest. Welche Ebene ein Element bekommt, folgt seiner Rolle im Aufbau. Verschachtelung erzeugt keine neue Ebene: ein Feld in einer Liste in einer Karte liegt genauso hoch wie ein Feld, das direkt in der Karte steht.

### Warum

Eine Ebene ist ein Signal, kein Nebenprodukt der Schachtelung. Wächst sie mit jedem Container mit, ist die Menge offen, und dann passieren zwei Dinge. Erstens ist die fünfte Ebene nicht mehr von der vierten zu unterscheiden, weil der Kontrast am Ende der Kette aufgebraucht ist. Zweitens hängt die Farbe eines Elements davon ab, wie tief es zufällig eingebaut wurde. Verschiebt jemand es eine Ebene höher, ändert es seine Farbe, ohne dass jemand eine Entscheidung getroffen hat.

Umgekehrt ergibt sich daraus auch, was nicht geht: ein Element **innerhalb** einer Fläche bekommt nie die Farbe der Ebene darunter. Es liest sich sonst als Loch.

Wie viele Ebenen es gibt, ist damit noch nicht gesagt. Das ist eine Frage des Produkts und der Handschrift, nicht der Regel.

### Hart und weich

| | Status |
|---|---|
| Die Ebenen sind eine geschlossene, benannte Menge | hart |
| Die Ebene folgt der Rolle des Elements, nicht der Schachtelungstiefe | hart |
| Ein Element in einer Fläche trägt nie die Farbe der Ebene darunter | hart |
| Wie viele Ebenen es gibt | weich, Vorgabe drei |

### Ein bewährter Satz von drei

Drei tragen die meisten Anwendungen, und sie lassen sich in einem Satz benennen: die Seite, das was darauf liegt, das was man anfassen kann.

```
Seite            ──  die Seite selbst
  └─ Karte       ──  liegt auf der Seite
       └─ erhoben ─  liegt auf einer Karte
```

Auf die erhobene Ebene gehören Eingabefelder, Options- und Einstellungszeilen samt ihrem Container, einzeln gerahmte Auswahl-Kacheln und andere Flächen, die man drücken kann.

Manche Systeme kommen mit zwei aus, weil sie Trennung über Abstand und Linien lösen. Andere brauchen eine vierte, weil sie eine echte Stapelung darstellen müssen, etwa in einem Editor mit Werkzeugfenstern. Beides ist in Ordnung, solange die Menge benannt und geschlossen bleibt.

### Woran Du den Verstoß erkennst

- Ein Element innerhalb einer Fläche trägt die Farbe der Seite.
- Es gibt eine Flächenfarbe, die nur an einer einzigen Stelle vorkommt.
- Eine Fläche wird eine Stufe dunkler gesetzt mit der Begründung, sie liege ja schon zwei Ebenen tief.
- Dasselbe Bauteil hat auf zwei Seiten verschiedene Flächenfarben.

### Richtig / falsch

```
        RICHTIG                             FALSCH

Seite  ░░░░░░░░░░░░░░░░░░░░       Seite  ░░░░░░░░░░░░░░░░░░░░
  Karte ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒            Karte ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
    Liste ▒▒▒▒▒▒▒▒▒▒▒▒                Liste ▓▓▓▓▓▓▓▓▓▓▓▓
      Feld ▓▓▓▓▓▓▓▓▓▓                  Feld ███████████
      Feld ▓▓▓▓▓▓▓▓▓▓                  Feld ███████████

 Feld bleibt auf einer Ebene.       Jede Schachtelung eine Stufe.
```

### Grenzen

Eine gedämpfte Fläche läuft in die andere Richtung, also unter die Karte, und gehört nicht zur Menge. Sie ist für zurückgenommenen Inhalt da, nicht für Tiefe.

Ein Overlay liegt über allem und hat sein eigenes Verhältnis zum Schleier darunter. Auch das ist keine weitere Stufe.

### Verwandt

- Erst Abstand, dann Fläche, dann Linie
- Werte kommen aus Tokens, nie aus der Hand

## Verhalten und Aussehen bleiben getrennt

Bedienung · https://standby.design/docs/rules/bedienung-verhalten-und-aussehen-bleiben-getrennt

**Geltung:** universal · web, react-native

> **Regel**
> Trenne bei jedem bedienbaren Element, was es tut, von dem, wie es aussieht. Es bekommt genau eine Verhaltensart: `pressable`, `toggleable`, `editable`, `navigable`, `readable`. Die Verhaltensart beschreibt nur das Verhalten. Wie das Element aussieht, ist austauschbar.

### Warum

Ohne diese Trennung wird das Aussehen zum Verhalten. „Der Knopf ist blau" wird zu „blau heißt anklickbar", und beim nächsten Umbau kippt mit der Farbe auch die Bedienlogik. Mit der Trennung kannst Du das Aussehen wechseln, ohne dass sich ändert, was das Element tut. Und Du kannst etwas Neues bauen, indem Du nur sein Verhalten benennst, statt sein Aussehen neu zu erfinden.

Für einen Agenten ist die Tabelle der Verhaltensarten die Antwort auf die häufigste Frage überhaupt: was wird hier eingesetzt? Nicht „nimm einen Button", sondern „das ist ein dauerhafter Zustand, also `toggleable`, also Schalter oder Reiter".

### Die fünf Verhaltensarten

| Verhalten | Bedeutung |
|---|---|
| `pressable` | Löst eine Aktion aus. Danach ist das Element unverändert |
| `toggleable` | Trägt einen dauerhaften Zustand: an oder aus, ausgewählt oder nicht |
| `editable` | Nimmt eine Eingabe des Nutzers entgegen |
| `navigable` | Bringt den Nutzer an eine andere Stelle |
| `readable` | Zeigt nur an, nimmt keine Bedienung entgegen |

Die Verhaltensarten entsprechen dem, was ein blinder Nutzer heute schon erlebt: der Accessibility Tree kennt Verhalten, kein Aussehen. Sie sind damit keine Wette auf eine Abstraktion, sondern die Wahrheit der Plattform.

### Das Element im Code

Jede Verhaltensart hat ihr Bauteil im Code. `navigable` ist ein Link mit Adresse, `pressable` und `toggleable` sind ein `button`, `editable` ist ein Feld mit verbundener Beschriftung, `readable` ist Text. Ein Kasten mit Klick sieht für die Maus genauso aus, aber die Tastatur erreicht ihn nicht, der Screenreader erkennt ihn nicht, und ein Link lässt sich nicht in einem neuen Tab öffnen. Gibt es kein passendes Bauteil, etwa für Tabs oder eine Kombi-Box, gilt das Muster aus der ARIA APG.

Eine Rolle im Code ist ein Versprechen. Wer behauptet, etwas sei ein Menü, Tabs oder ein Raster, baut auch die Tastaturbedienung dazu, sonst erwartet der Nutzer Pfeiltasten, die nichts tun. Eine Hauptnavigation ist deshalb keine Menü-Rolle, sondern eine Liste von Links.

### Das Wörterbuch

Bekannte Paare aus Verhalten und Aussehen, die einen Namen tragen. Der Name der Zeile ist die Abkürzung für das Paar. Die Namen in der Spalte Aussehen sind die Vorgabe. Ein Projekt darf sie anders nennen.

| Name | Verhalten | Aussehen | Eigenes Zeichen für „aktiv" | Element im Code |
|---|---|---|---|---|
| Button | pressable | press | — | `button` |
| Icon-Button | pressable | press, nur Icon | — | `button` mit Namen |
| Chip | toggleable | chip | Punkt vorn | `button` mit `aria-pressed` |
| Switch | toggleable | track | Position des Knopfs | `button` mit `role="switch"` |
| Tab | toggleable | tab | Strich darunter | `button` mit `role="tab"` |
| Eingabefeld | editable | field | — | `input` mit verbundenem `label` |
| Navigations-Zeile | navigable | row | Balken links | `a` mit `href` |
| Fließtext-Link | navigable | text | verdickte Unterstreichung | `a` mit `href` |
| Badge | readable | badge | — | Text |

Chip und Badge sind verwandt, aber nicht gleich. Der Chip ist ein kleiner Umschalter, etwa ein Filter, der an oder aus ist. Das Badge hebt nur eine Information als Etikett hervor. Weil das Auge Gleiches für Gleichartiges hält, sehen die beiden nicht gleich aus: Das Badge ist schmaler und hat nur ein knappes Padding, der Chip hat die Polsterung eines Bedienelements. So sieht man vor dem Klick, was sich drücken lässt.

### Woran Du den Verstoß erkennst

- Ein Badge reagiert auf Klick. Dann ist es kein Badge, sondern ein Chip.
- Chip und Badge haben dasselbe Padding und dieselbe Höhe.
- Ein Switch löst eine einmalige Aktion aus, statt einen Zustand zu halten. Dann ist es ein Button.
- Etwas wird über seine Farbe beschrieben („der graue Knopf") statt über sein Verhalten.
- Das Aussehen bringt Interaktions-Code mit, oder das Verhalten setzt Farben.
- Das Verhalten wird in einer einzelnen Ansicht nachgebaut statt benutzt.
- Ein Klick sitzt auf einem `div`, `span` oder `li`.
- Ein `button` wechselt per Code die Seite, oder ein `a` hat kein `href`.
- Die Hauptnavigation hat `role="menu"`, oder ein Element hat eine Rolle ohne die Tastaturbedienung dazu.

### Grenzen

Zusammengesetzte Gebilde — Dropdown, Datepicker, Dialog — bestehen aus mehreren Elementen und bekommen keine eigene Verhaltensart. Ihr Auslöser ist `pressable`, ihre Einträge sind `navigable` oder `toggleable`.

Und nicht jede Kombination ergibt Sinn. Welche verboten sind, gehört in die Grammatik des Projekts, nicht in diese Notiz.

### Verwandt

- Verhalten und Aussehen werden nicht in der Ansicht nachgebaut
- Farbe trägt nie allein
- Kurze Zustände verschieben, dauerhafte wechseln die Palette
- Die Höhe gehört der Zeile, nicht dem Element
- Klickbares hat eine Fläche, und nur Klickbares sieht so aus

## Verhalten und Aussehen werden nicht in der Ansicht nachgebaut

Bedienung · https://standby.design/docs/rules/bedienung-verhalten-und-aussehen-werden-nicht-in-der-ansicht-nachgebaut

**Geltung:** universal · web, react-native

> **Regel**
> Eine Ansicht setzt vorhandene Elemente zusammen. Sie definiert weder ihr Verhalten noch ihr Aussehen neu. Wer in einer Ansicht Hover, Fokus, Fläche, Radius oder Padding von Hand schreibt, hat etwas nachgebaut, das an einer gemeinsamen Stelle schon festgelegt ist.

### Warum

Was in der Ansicht steht, bekommt die nächste Änderung nicht mit. Es ist nicht auffindbar, weil niemand weiß, dass es existiert, und es ist nicht zählbar, weil es keinen Namen hat.

In einer gewachsenen Anwendung findet man dafür schnell mehrere hundert Stellen: die Karte gibt es gar nicht als benanntes Aussehen, sondern als Hunderte handgebauter Flächen mit uneinheitlichem Radius und Padding. Jede einzelne war zum Zeitpunkt ihrer Entstehung richtig. Zusammen ergeben sie kein System mehr, sondern mehrere hundert Meinungen darüber, wie eine Karte aussieht.

Beim Verhalten ist es dasselbe, nur unsichtbarer. Schreibt eine Ansicht ihren eigenen Hover, hat sie das Drücken neu gebaut — mit eigener Dauer, eigener Stufe und eigener Richtung. Ändert sich die Regel im System, ändert sich diese Stelle nicht mit, und niemand merkt es, weil sie ja aussieht wie vorher.

Der Nachbau passiert selten aus Absicht. Er passiert, weil das vorhandene Aussehen eine Kleinigkeit nicht kann. Genau dann ist der richtige Schritt, dieses Aussehen zu erweitern oder ein neues zu benennen — nicht, es in der Ansicht zu umgehen. Sonst gibt es die Kleinigkeit ab jetzt zweimal.

### Woran Du den Verstoß erkennst

- Ein `Pressable` oder ein `div` mit `onClick` trägt in der Ansicht Fläche, Radius und Padding.
- Hover-, Fokus- oder Aktiv-Zustände stehen in einer Ansicht statt beim gemeinsamen Verhalten.
- Das Aussehen enthält Interaktions-Code, oder das Verhalten setzt Farben.
- Zwei Ansichten zeigen dasselbe Ding mit verschiedenem Radius oder Padding.
- Etwas wird kopiert und dann an einer Stelle angepasst.
- Die Anzahl der handgebauten Stellen lässt sich nicht mehr überblicken.

### Richtig / falsch

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

Ein häufiger Name wie Button ist in Ordnung. Er ist die Abkürzung für ein bekanntes Paar aus Verhalten und Aussehen, siehe Verhalten und Aussehen bleiben getrennt.

### Grenzen

Eine Anordnung, die es genau einmal gibt — eine bestimmte Kachel, ein bestimmtes Kopfelement —, gehört in den Bereichsordner ihres Themas. Das ist kein Verstoß: sie setzt vorhandene Elemente zusammen. Sie legt kein neues Verhalten und kein neues Aussehen fest.

### Verwandt

- Verhalten und Aussehen bleiben getrennt
- Utility-Klassen statt Inline-Styles
- Werte kommen aus Tokens, nie aus der Hand

## Die Höhe gehört der Zeile, nicht dem Element

Bedienung · https://standby.design/docs/rules/bedienung-die-hoehe-gehoert-der-zeile-nicht-dem-element

**Geltung:** universal · web, react-native · **Vorgabe:** 2rem dicht, 2.5rem im Formular

> **Regel**
> Alle Bedienelemente in einer Zeile haben dieselbe Höhe. Welche Höhe gilt, sagt der Kontext der Zeile: dicht in einer Werkzeugleiste, großzügig in einem Formular. Die Höhen sind eine kleine, benannte, geschlossene Menge und stehen als Token.

### Warum

#### Ein Paar hat eine gemeinsame Kante

Ein Eingabefeld mit einem Button daneben ist ein Paar. Der Button gehört zu dem Feld, er tut etwas mit dem, was darin steht. Sind beide verschieden hoch, verliert die Zeile ihre Ober- und Unterkante, der Button hängt in der Luft, und die beiden lesen sich als zwei Dinge, die zufällig nebeneinander liegen.

Das ist dieselbe Mechanik wie in Erst Abstand, dann Fläche, dann Linie, nur auf der anderen Achse: Nähe gruppiert waagerecht, eine gemeinsame Kante gruppiert senkrecht. Beides wirkt, bevor jemand liest.

#### Warum es überhaupt mehr als eine Höhe gibt

Weil Dichte eine Eigenschaft des Kontexts ist. In einer Werkzeugleiste stehen viele Bedienelemente nebeneinander, jedes wird kurz berührt und wieder losgelassen. Dort gewinnt Kompaktheit, weil die Leiste sonst mehr Platz frisst als der Inhalt, für den sie da ist.

In einem Formular tippt der Nutzer. Er hält sich dort auf, er trifft dort, er liest dort. Da gewinnen Ruhe und Trefferfläche.

Das ist ein Unterschied zwischen zwei **Situationen**, nicht zwischen zwei Bauteilen. Ein Button ist in beiden derselbe Button.

#### Der Sonderschalter ist das Warnzeichen

Formuliert man die Regel am Element statt an der Zeile („Buttons sind klein, Felder sind groß"), braucht sie sofort eine Ausnahme: einen Schalter, der einen Button für den Einsatz neben Feldern auf Feldhöhe hebt. Und den braucht man dauernd.

Eine Regel, die ständig eine Ausnahme braucht, hat die falsche Frage gestellt. Die Frage ist nicht, welche Art von Element das ist, sondern in welcher Zeile es steht.

### Hart und weich

| | Status |
|---|---|
| Alles in einer Zeile hat dieselbe Höhe | hart |
| Die Höhe folgt dem Kontext der Zeile, nicht der Art des Elements | hart |
| Die Höhen sind eine kleine, geschlossene, benannte Menge | hart |
| Jede Höhe steht als Token, nicht in der Ansicht | hart |
| Ein Icon-only-Element ist ein Quadrat auf der Höhe seiner Zeile | hart |
| Wie viele Höhen es gibt und wie hoch sie sind | weich, Vorgabe zwei Stufen: dicht 2rem, Formular 2.5rem |

Zwei Stufen reichen für die meisten Anwendungen. Wer eine dritte einführt, braucht dafür einen dritten Kontext, den er benennen kann — nicht eine Stelle, an der es gerade besser aussah.

### Woran Du den Verstoß erkennst

- In einer Filter- oder Formularzeile stehen Feld und Button verschieden hoch.
- Ein Element trägt seine Höhe oder sein senkrechtes Padding direkt in der Ansicht.
- Es gibt eine Höhe, die nur an einer einzigen Stelle vorkommt.
- Ein Icon-Element ist rechteckig statt quadratisch.
- Ein Element wird per Sonderschalter angehoben, obwohl seine Zeile schon sagt, welche Höhe gilt.
- Unter einem Formular stehen Speichern und Abbrechen in der dichten Höhe.
- Ein Suchfeld in einer Werkzeugleiste ist höher als die Knöpfe daneben.

### Richtig / falsch

```
        RICHTIG                             FALSCH

  ┌───────────────┐┌─────────┐       ┌───────────────┐
  │               ││         │       │               │┌─────────┐
  │ Suchbegriff   ││ Suchen  │       │ Suchbegriff   ││ Suchen  │
  │               ││         │       │               │└─────────┘
  └───────────────┘└─────────┘       └───────────────┘

  eine Ober- und eine Unterkante      der Button hängt, die Zeile
  für die ganze Zeile                 hat keine gemeinsame Kante
```

### Grenzen

Nach unten begrenzt die Trefferfläche aus Klickbares hat eine Fläche, und nur Klickbares sieht so aus. Auf Touch-Oberflächen ist die dichte Stufe zu klein für den Finger, sie bleibt dort Werkzeugleisten am Zeigegerät vorbehalten.

Ein Element, das allein steht und in keiner Zeile sitzt, nimmt die Höhe seines Umfelds. Im Zweifel die großzügige, weil ein einzelner Knopf fast immer eine Aufgabe ist und keine Werkzeugleiste.

Beschriftete Elemente wachsen nur in der Breite mit ihrem Inhalt. Die Höhe ändert sich nie durch den Text darin.

Die Aktionszeile unter einem Formular ist eine Formularzeile. Speichern und Abbrechen nehmen die Formularhöhe, auch wenn kein Feld neben ihnen steht. Umgekehrt nimmt ein Feld in einer Werkzeugleiste, etwa die Suche, die dichte Höhe der Leiste.

### Verwandt

- Klickbares hat eine Fläche, und nur Klickbares sieht so aus
- Erst Abstand, dann Fläche, dann Linie
- Senkrechtes Padding wird optisch ausgeglichen

## Kurze Zustände verschieben, dauerhafte wechseln die Palette

Bedienung · https://standby.design/docs/rules/bedienung-kurze-zustaende-verschieben-dauerhafte-wechseln-die-palette

**Geltung:** universal · web, react-native

> **Regel**
> Kurzzeitige Zustände — Hover, Gedrückt — verschieben sich **innerhalb** derselben Palette: Hover eine Stufe **heller**, Gedrückt eine Stufe **dunkler**, in heller und dunkler Erscheinung gleich. Dauerhafte Zustände — an, aktuell, ungültig — **wechseln** die Palette.

### Warum

Der Nutzer muss zwei Fragen gleichzeitig beantworten können: „berühre ich das gerade?" und „ist das an?". Werden beide mit demselben Mittel beantwortet, sind sie nicht mehr zu trennen. Ein Element unter dem Mauszeiger sieht dann aus wie ein eingeschaltetes, und ein eingeschaltetes wie eines, das gerade berührt wird.

Verschieben und Wechseln sind zwei verschiedene Bewegungen im Farbraum. Solange kurze Zustände nur verschieben und dauerhafte wechseln, bleiben die beiden Fragen getrennt, ohne dass der Nutzer es lernen muss.

### Warum Hover heller wird

Hover sagt: „Ich reagiere auf Dich, drück mich." Das Element kommt dem Zeiger ein Stück entgegen, und was näher am Licht ist, wird heller. Gedrückt ist das Gegenteil: das Element sinkt ein und wird dunkler.

Im Dark Mode kehrt sich das nicht um. Das Licht kommt in beiden Erscheinungen von vorn, deshalb sind auch dort höhere Ebenen heller als tiefere. Wer die Richtung mit dem Modus umdreht, lässt denselben Knopf im Hellen einsinken und im Dunkeln herauskommen.

Weil Hover und Gedrückt in entgegengesetzte Richtungen gehen, liegen sie zwei Schritte auseinander. Der Nutzer verwechselt sie nie, und keiner von beiden landet wieder auf der Farbe des Ruhezustands.

### Die Schritte sind gleichmäßig

Die Abstände zwischen Ruhe, Hover und Gedrückt kommen aus derselben Skala und sind gleich groß. Werden sie pro Baustein von Hand gewählt, ist der Sprung an einer Stelle kaum zu sehen und an der nächsten zu stark. Auffallen tut das erst, wenn zwei Bausteine nebeneinander liegen, und dann ist es überall.

Wie groß ein Schritt ist, hängt von der Palette des Projekts ab. Gleich groß muss er sein, nicht bestimmt groß.

### Kein Schleier als Rückmeldung

Ein durchscheinender Schleier ist auf dunklem Grund ein großer Schritt und auf hellem fast keiner. Dieselbe Rückmeldung wirkt in zwei Erscheinungen unterschiedlich stark, und in einer davon fehlt sie praktisch ganz. Zustände kommen deshalb aus benannten Farbwerten, nicht aus Deckkraft.

### Woran Du den Verstoß erkennst

- Hover ist dunkler als der Ruhezustand, oder Gedrückt ist heller.
- Die Richtung dreht sich mit dem Modus um: im Hellen wird Hover dunkler, im Dunkeln heller.
- Hover benutzt dieselbe Farbe wie der Zustand „ausgewählt".
- Ein Zustandswechsel wird mit einem durchscheinenden Schleier gebaut.
- Die Schritte sind unterschiedlich groß, weil sie pro Baustein von Hand gewählt wurden.

### Richtig / falsch

```
        RICHTIG                             FALSCH

Hover     ░░   ein Schritt heller  Hover     ▓▓  ← dunkler als Ruhe
Ruhe      ▒▒                       Ruhe      ▒▒
Gedrückt  ▓▓   ein Schritt dunkler Gedrückt  ░░  ← heller als Ruhe

An        ██   andere Palette      An        ░░  ← gleich wie Hover
```

### Grenzen

Am Ende der Skala ist kein Platz mehr. Ein fast weißes Element kann nicht heller werden: dort geht Hover eine Stufe dunkler und Gedrückt zwei. Ein fast schwarzes kann nicht dunkler werden: dort geht Gedrückt zwei Stufen heller. Das ist die einzige Umkehr.

Ein Rahmen ist keine Fläche, die sich hebt. Beim Eingabefeld wird der Rand beim Hover kräftiger, damit er sich deutlicher von der Umgebung abhebt. Die Regel oben gilt für Flächen.

Ein Eingabefeld im Fehlerzustand wechselt die Palette, obwohl der Fehler vorübergehend ist. Das ist gewollt: „ungültig" ist ein dauerhafter Zustand des Feldes, solange die Eingabe nicht stimmt, und keine Rückmeldung auf eine Berührung.

### Verwandt

- Farbe trägt nie allein
- Verhalten und Aussehen bleiben getrennt

## Ein Tooltip ergänzt, er trägt nie allein

Bedienung · https://standby.design/docs/rules/bedienung-ein-tooltip-ergaenzt-er-traegt-nie-allein

**Geltung:** universal · web, react-native

> **Regel**
> Zeig alles, was man zum Bedienen wissen muss, sichtbar. Ein Tooltip erscheint bei Hover und bei Fokus, bleibt beim Darüberfahren stehen und schließt mit Esc.

### Warum

Auf Touch gibt es kein Hover. Was nur dort steht, sieht ein Teil der Nutzer nie.

### Woran Du den Verstoß erkennst

- Pflichthinweis nur im `title`.
- Tooltip nur mit `onMouseEnter`.
- Link oder Button im Tooltip.
- Tooltip verschwindet, sobald die Maus hineinfährt.

### Hart und weich

Hart: Fokus, Stehenbleiben, Esc. Weich: Verzögerung. Vorgabe: der erste kommt verzögert, die Nachbarn danach sofort.

### Grenzen

Der Tooltip an einem Icon-Button wiederholt dessen Namen. Der Name steht trotzdem im `aria-label`.

### Quelle

WCAG 1.4.13 Content on Hover or Focus. Vercel › Touch & Drag („Delay first tooltip; subsequent peers instant") und Content & Accessibility („Inline help first; tooltips last resort").

### Verwandt

- Der Fokus ist sichtbar und hat immer einen Ort
- Klickbares hat eine Fläche, und nur Klickbares sieht so aus

## Eine Handlung löst beim Loslassen aus

Bedienung · https://standby.design/docs/rules/bedienung-eine-handlung-loest-beim-loslassen-aus

**Geltung:** universal · web, react-native

> **Regel**
> Löse eine Handlung beim Loslassen aus, nicht beim Drücken.

### Warum

Wer daneben drückt, zieht den Finger oder die Maus weg und bricht ab. Beim Drücken gibt es diesen Ausweg nicht.

### Woran Du den Verstoß erkennst

- Handlung in `onMouseDown`, `onPointerDown`, `onTouchStart` oder `onPressIn`.

### Hart und weich

Hart.

### Grenzen

Ziehen, Zeichnen, Spiele und Klaviertasten, bei denen das Drücken selbst die Eingabe ist.

### Quelle

WCAG 2.5.2 Pointer Cancellation, https://www.w3.org/WAI/WCAG22/quickref/#pointer-cancellation

### Verwandt

- Klickbares hat eine Fläche, und nur Klickbares sieht so aus
- Zerstörendes trifft man nicht aus Versehen

## Was sich von selbst bewegt, lässt sich anhalten

Bedienung · https://standby.design/docs/rules/bedienung-was-sich-von-selbst-bewegt-laesst-sich-anhalten

**Geltung:** universal · web, react-native

> **Regel**
> Gib jeder Bewegung, die von selbst startet und länger als fünf Sekunden läuft, eine Pause, und starte Ton nie von selbst.

### Warum

Bewegung neben Inhalt zieht den Blick ab und macht manchen Menschen übel. Ton, der von selbst startet, übertönt den Screenreader.

### Woran Du den Verstoß erkennst

- Karussell ohne Pause-Knopf.
- Video mit `autoplay` ohne `muted`.
- Laufband oder animierter Hintergrund ohne Stopp.
- Endlos-Animation, die `prefers-reduced-motion` ignoriert.

### Hart und weich

Hart. Die fünf Sekunden sind der Wert aus WCAG, keine Vorgabe.

### Grenzen

Ladeanzeigen. Bewegung, die der Nutzer selbst gestartet hat.

### Quelle

WCAG 2.2.2 Pause, Stop, Hide und 1.4.2 Audio Control. Vercel AGENTS.md › Animation („autoplay only for muted, non-essential loops").

### Verwandt

- Bewegung hat einen Wert und hält nichts auf
- Bewegung hat einen Wert und hält nichts auf
- Alles hat eine Textfassung

## Gewicht ist ein Budget, ein Primary pro Ansicht

Bedienung · https://standby.design/docs/rules/bedienung-gewicht-ist-ein-budget-ein-primary-pro-ansicht

**Geltung:** universal · web, react-native

> **Regel**
> Gib jeder Ansicht und jedem ihrer Zustände höchstens einen Primary-Button, für die Hauptaufgabe. Alles andere ist leiser. Jeder Button sagt mit Verb und Gegenstand, was beim Klick passiert. Ein Zustand steht neben dem Knopf, nicht auf ihm.

### Warum

Gewicht ist ein Budget. Jeder laute Button macht den wichtigen leiser, und eine Ansicht mit drei gefüllten Buttons sagt dem Nutzer nicht mehr, wo es weitergeht.

Eine Beschriftung wie „Keine Änderungen“ macht aus dem Knopf eine Anzeige. Der Nutzer kann nicht vorhersagen, was ein Klick auslöst. Wechselt die Beschriftung mit dem Zustand, springt außerdem die Breite des Knopfes.

„Speichern“ allein reicht, solange die Seite nur einen Gegenstand hat. Gibt es mehrere, nennt der Knopf seinen: „Fehlzeiten speichern“. Eine Menge darf dabei stehen, weil sie den Umfang der Handlung beschreibt: „3 Monate speichern“.

### Die Stufen

| Stufe | Wofür |
|---|---|
| primary | die Hauptaufgabe: einziger Weg weiter, Abschluss eines Ablaufs |
| secondary | eine echte Aktion, die nicht das Ziel der Ansicht ist |
| outline | der Standard: Optionen, die man nutzen kann, aber nicht muss |
| ghost | Nebensächliches, Zurück, Werkzeuge in dichten Leisten |
| destructive | Löschen und Unumkehrbares |

### Hart und weich

| | Status |
|---|---|
| Höchstens ein Primary pro Ansicht und Zustand | hart |
| Die Beschriftung ist eine Handlung, kein Zustand | hart |
| Die Stufen sind eine geschlossene Menge, der Standard ist eine leise Stufe | hart |
| Wie viele Stufen und welcher Wortlaut | weich, Vorgabe die fünf Stufen oben |

### Woran Du den Verstoß erkennst

- In einer Ansicht stehen zwei gefüllte Buttons.
- Die Beschriftung beschreibt einen Zustand: „Keine Änderungen“, „Gespeichert“, „Fertig“.
- Eine Nebenaufgabe in der Werkzeugleiste trägt die Primary-Farbe.
- Ein Button ohne Angabe fällt auf Primary zurück statt auf die leise Standardstufe.

### Grenzen

Ein Dialog ist eine eigene Ansicht und hat seinen eigenen Primary. Eine Bestätigung zum Löschen trägt die destruktive Stufe, nicht Primary.

Gibt es nichts zu speichern, bleibt der Knopf derselbe und aktiv, siehe Ein Button ist nie gesperrt. Den Zustand sagt die Ansicht daneben.

### Verwandt

- Klickbares hat eine Fläche, und nur Klickbares sieht so aus
- Verhalten und Aussehen bleiben getrennt
- Farbe trägt nie allein

## Ein Button ist nie gesperrt

Bedienung · https://standby.design/docs/rules/bedienung-ein-button-ist-nie-gesperrt

**Geltung:** universal · web, react-native

> **Regel**
> Graue keinen Button aus. Fehlt etwas, bleibt er aktiv und zeigt beim Klick, was fehlt. Steht etwas Grundsätzliches im Weg, wird er durch die Handlung ersetzt, die es löst. Gesperrt ist er nur, solange eine Anfrage läuft.

### Warum

Ein ausgegrauter Button ist eine Sackgasse ohne Erklärung. Der Nutzer sieht, dass er nicht weiterkommt, aber nicht warum. Er sucht das Formular nach dem fehlenden Häkchen ab, oder er gibt auf.

Ein aktiver Button beantwortet die Frage beim Klick. Das fehlende Feld markiert sich, die Meldung sagt, was zu tun ist, und der Fehler verschwindet, sobald das Feld stimmt. Das ist derselbe Weg wie in Ein Fehler steht dort, wo er entstanden ist.

Steht kein Feld im Weg, sondern eine Grenze, etwa ein volles Kontingent oder ein fehlender Tarif, ist der gesperrte Button die falsche Handlung am richtigen Ort. „Mitglied einladen“ wird dann zu „Mehr Plätze buchen“. Der Nutzer sieht sofort, was ihn weiterbringt.

Die eine Sperre, die bleibt, schützt vor doppeltem Absenden. Während die Anfrage läuft, ist ein zweiter Klick nie gewollt.

### Die Fälle

| Fall | Was passiert |
|---|---|
| Eine Eingabe fehlt oder stimmt nicht | Button bleibt aktiv. Beim Klick markiert sich das Feld, die Meldung sagt, was fehlt |
| Eine Grenze steht im Weg (Kontingent, Tarif, Frist) | Button wird durch die Handlung ersetzt, die die Grenze löst |
| Eine Anfrage läuft | Button gesperrt, Ladezeichen neben der Beschriftung, Beschriftung bleibt |
| Der Nutzer hat kein Recht zu dieser Handlung | Button wird nicht gezeigt |

### Hart und weich

| | Status |
|---|---|
| Kein Button ist gesperrt, außer während einer Anfrage | hart |
| Beim Klick auf einen unvollständigen Stand zeigt die Ansicht, was fehlt | hart |
| Ohne Recht wird die Handlung nicht gezeigt, nicht ausgegraut | hart |
| Wie der Fehler erscheint | weich, Vorgabe am Feld nach Ein Fehler steht dort, wo er entstanden ist |

### Woran Du den Verstoß erkennst

- `disabled={!isValid}`, `disabled={!isDirty}` oder `disabled={!accepted}` an einem Button.
- Ein ausgegrauter Button ohne Erklärung in der Nähe.
- Ein Button ohne Recht ist grau statt weg.
- Das Ladezeichen ersetzt die Beschriftung, oder der Button bleibt während der Anfrage klickbar.
- Ein Feld, das nur einen Wert anzeigt, ist als gesperrtes Eingabefeld gebaut. Dann lässt sich der Wert nicht kopieren, und der Screenreader überspringt ihn.

### Grenzen

Steht der Grund unmittelbar neben dem Button und ist ohne Lesen zu sehen, darf er gesperrt sein. Das Beispiel ist der Senden-Knopf neben einem leeren Chatfeld.

Ein Wert, den man sehen, aber nicht ändern darf, ist kein gesperrtes Feld, sondern Text. Er steht lesbar und kopierbar da, ohne Rahmen und ohne Bedienzeichen.

Sperren, die sich aus dem Bild erklären, bleiben erlaubt: „Zurück“ auf der ersten Seite, „Weiter“ auf der letzten.

### Quelle

Vercel Web Interface Guidelines › Forms („Don’t pre-disable submit“, „Keep submit enabled until submission starts“, „Loading buttons show spinner and keep original label“). Carbon › Patterns › Disabled states (Disabled, Read-only, Hidden).

### Verwandt

- Ein Fehler steht dort, wo er entstanden ist
- Verhalten und Aussehen bleiben getrennt
- Was der Nutzer tippt oder einfügt, kommt an

## Eine lange Auswahl lässt sich durchsuchen

Bedienung · https://standby.design/docs/rules/bedienung-eine-lange-auswahl-laesst-sich-durchsuchen

**Geltung:** universal · web, react-native · **Korridor:** 7-15 Einträge · **Vorgabe:** Suche ab 10 Einträgen

> **Regel**
> Gib jeder Auswahl ab einer festen Zahl von Einträgen eine Suche oder teil sie in benannte Gruppen.

### Warum

Jede weitere Option verlängert die Entscheidung. Bei 200 Ländern sucht niemand mit den Augen, er tippt.

### Woran Du den Verstoß erkennst

- Auswahl mit 200 Ländern ohne Tippsuche.
- Menü mit 25 Einträgen ohne Gruppen.
- Eine Liste von Personen ohne Suchfeld.

### Hart und weich

Hart: ab einer Schwelle gibt es Suche oder Gruppen, als Token. Weich: die Schwelle, Korridor 7 bis 15, Vorgabe 10.

### Grenzen

Natürlich geordnete Reihen wie Jahre oder Zahlen, in denen man per Tastatur springt.

### Quelle

Laws of UX › Hick’s Law und Choice Overload, https://lawsofux.com/hicks-law/

### Verwandt

- Was ein Feld beschreibt, steht im Feld
- Was der Browser mitbringt, wird gestaltet oder ersetzt

## Jede Geste hat einen zweiten Weg per Klick

Bedienung · https://standby.design/docs/rules/bedienung-jede-geste-hat-einen-zweiten-weg-per-klick

**Geltung:** universal · web, react-native

> **Regel**
> Gib jeder Geste einen zweiten Weg per Klick und Tastatur, der zum selben Ergebnis führt. Das gilt für Ziehen, Wischen, Zwei-Finger-Gesten, Langdrücken und für Bewegungen des Geräts wie Schütteln und Kippen.

### Warum

Nicht jeder kann ziehen oder präzise wischen. Und keine Geste ist sichtbar.

Nachgebaut wird nicht die Geste, sondern das Ergebnis. Eine Liste, die man per Ziehen sortiert, bekommt „Nach oben“ und „Nach unten“ im Menü der Zeile. Was man per Wischen löscht, lässt sich auch im Menü löschen. Ein Regler reagiert auf Pfeiltasten. Eine Funktion, die auf Schütteln reagiert, lässt sich abschalten.

### Woran Du den Verstoß erkennst

- Sortieren nur per Drag.
- Löschen nur per Wischen.
- Zoom nur per Pinch.
- Regler ohne Pfeiltasten.
- Rückgängig nur per Schütteln, oder Kippen löst etwas aus, ohne dass es sich abschalten lässt.

### Hart und weich

Hart.

### Grenzen

Wo die Bewegung selbst die Eingabe ist, etwa Unterschrift oder Zeichnen.

### Quelle

WCAG 2.5.1 Pointer Gestures, 2.5.7 Dragging Movements. Vercel › Touch & Drag. WCAG 2.5.4 Motion Actuation.

### Verwandt

- Alles geht mit der Tastatur, in der Reihenfolge des Bildes
- Klickbares hat eine Fläche, und nur Klickbares sieht so aus

## Bewegung hat einen Wert und hält nichts auf

Bedienung · https://standby.design/docs/rules/bedienung-bewegung-hat-einen-wert-und-haelt-nichts-auf

**Geltung:** universal · web, react-native · **Korridor:** 100-200ms · **Vorgabe:** 150ms

> **Regel**
> Gib Zustandswechseln genau eine Dauer als Token, im Korridor 100 bis 200 Millisekunden, Vorgabe 150. Animiere nur `transform` und `opacity` und nenne jede Eigenschaft einzeln. Jede neue Eingabe bricht eine laufende Bewegung ab, und was zusammengehört, bewegt sich gemeinsam. Hat der Nutzer weniger Bewegung eingestellt, wechselt alles sofort.

### Warum

Der Korridor hat einen Grund, die Zahl darin nicht. Unter etwa 100 Millisekunden nimmt niemand mehr eine Bewegung wahr, der Wechsel liest sich als Sprung und die Rückmeldung geht verloren. Über etwa 200 wartet der Nutzer auf die Oberfläche, und das Warten fällt umso mehr auf, je öfter er den Wechsel auslöst.

Innerhalb des Korridors ist die Zahl eine Frage der Handschrift. Ein ruhiges, schweres Produkt darf am oberen Ende sitzen, ein Werkzeug, das schnell wirken soll, am unteren. Diese Entscheidung nimmt die Regel niemandem ab.

Hart ist etwas anderes: dass es **eine** Dauer gibt. Verschiedene Dauern nebeneinander lassen eine Ansicht flackern, weil mehrere Elemente in einer Reihe zu verschiedenen Zeitpunkten ankommen. Der Blick sieht dann nicht einen Wechsel, sondern drei. Und weil die Dauer als Token steht, lässt sich die Handschrift später an einer Stelle ändern statt an zweihundert.

Die letzte Hälfte ist keine Höflichkeit. Für Menschen mit vestibulärer Störung löst Bewegung auf dem Bildschirm Schwindel und Übelkeit aus. Die Systemeinstellung ist ihre Bitte, und sie wird beachtet.

Layout-Eigenschaften rechnen bei jedem Bild die Seite neu, ruckeln und schieben Nachbarn. `all` animiert auch, was nie gemeint war, etwa jede Farbe beim Moduswechsel.

Eine Animation ist Rückmeldung, keine Wartezeit. Wer schnell klickt, darf nicht auf das Ende warten.

Was sich zusammen bewegt, liest das Auge als eine Sache. Fahren Kopf und Inhalt einer Karte getrennt ein, wirkt sie wie zwei.

### Hart und weich

| | Status |
|---|---|
| Es gibt genau eine Dauer für Zustandswechsel am Ort | hart |
| Sie steht als Token, nicht pro Komponente | hart |
| Sie liegt zwischen 100 und 200 Millisekunden | hart |
| Bei reduzierter Bewegung findet der Wechsel sofort statt | hart |
| Die Zahl im Korridor | weich, Vorgabe 150 |

### Woran Du den Verstoß erkennst

- Die Dauer wird pro Komponente gewählt, es gibt 100, 200 und 300 Millisekunden nebeneinander.
- Eine Dauer liegt außerhalb des Korridors, ohne dass jemand das begründen kann.
- `prefers-reduced-motion` kommt im Projekt nirgends vor.
- Eine Ansicht animiert beim Laden Elemente ein, obwohl die Einstellung Bewegung reduziert.
- `transition: all`, Tailwind `transition-all`.
- Animiertes `height`, `width`, `top`, `left`, `margin`.
- `pointer-events: none` während eines Übergangs.
- Flag wie `isAnimating`, das Klicks verwirft.
- `await` auf das Ende einer Animation vor dem Seitenwechsel.
- Ein schneller Doppelklick öffnet und schließt nicht.
- Kopf und Inhalt einer Karte haben verschiedene Animationen oder Verzögerungen.
- Abschnitte ohne Bezug blenden gestaffelt nacheinander ein.
- Beim Öffnen eines Panels rutscht ein Element mit, das nicht dazugehört.

### Grenzen

Größere Bewegungen sind nicht gemeint und dürfen länger dauern: ein Off-Canvas-Drawer, ein Dialog, ein Seitenwechsel. Der Korridor gilt für Wechsel am Ort — Farbe, Rand, die Position eines Schalterknopfs. Auch die längeren Bewegungen fallen bei reduzierter Bewegung weg.

Legt eine Marken-Richtlinie im Projekt eine eigene Zahl fest, gilt diese. Der Vorgabewert ist dafür da, dass man ohne eine solche Richtlinie trotzdem loslegen kann, und nicht dafür, sie zu überstimmen.

Farbe, Rahmen und Schatten bei Zustandswechseln, einzeln genannt und mit der Dauer von oben.

Listen, deren Einträge bewusst nacheinander erscheinen, um eine Reihenfolge zu zeigen. Bei reduzierter Bewegung fällt ohnehin alles weg.

### Quelle

Vercel › Animation („Animate compositor-friendly props only", „Never animate layout props", „Never `transition: all`"). Vercel Web Interface Guidelines › Animations („Interruptible. Animations are cancelable by user input"). Gestaltgesetz des gemeinsamen Schicksals (Wertheimer, 1923).

### Verwandt

- Kurze Zustände verschieben, dauerhafte wechseln die Palette
- Der Fokus ist sichtbar und hat immer einen Ort
- Werte kommen aus Tokens, nie aus der Hand
- Was sich von selbst bewegt, lässt sich anhalten

## Alles geht mit der Tastatur, in der Reihenfolge des Bildes

Bedienung · https://standby.design/docs/rules/bedienung-alles-geht-mit-der-tastatur-in-der-reihenfolge-des-bildes

**Geltung:** universal · web, react-native

> **Regel**
> Mach jedes Bedienelement mit Tab erreichbar und mit Enter oder Leertaste auslösbar, in der Reihenfolge, in der man es sieht. CSS stellt diese Reihenfolge nicht um. Zusammengesetzte Elemente folgen der APG: Tab hinein, Pfeiltasten innen, Esc schließt. Globale Tastenkürzel brauchen Strg, Alt oder Cmd.

### Warum

Wer keine Maus nutzt, kommt sonst an diese Stelle nie heran.

Wer per Sprache diktiert oder sich vertippt, löst sonst Handlungen aus, die er nie wollte.

Das Auge folgt dem Bild, die Tab-Taste und der Screenreader folgen dem Code. Solange beides gleich ist, merkt niemand etwas. Weichen sie ab, springt der Fokus quer über den Schirm.

Ein typischer Fall: Am Desktop steht „Abbrechen“ links und „Speichern“ rechts, am Handy soll „Speichern“ oben stehen. Steht „Speichern“ dafür im Code zuerst und dreht CSS die Reihenfolge am Desktop um, landet der erste Tab rechts und der zweite links. Optisch fällt das nie auf, beim Bedienen sofort.

### Hart und weich

Hart: alles per Tastatur, Tastenbelegung nach APG. Weich: zusätzliche Kürzel.

### Woran Du den Verstoß erkennst

- Klick-Handler ohne Tastenweg.
- `tabindex="-1"` an etwas Bedienbarem.
- Menü oder Popover, das Esc ignoriert.
- Eine Stelle, aus der Tab nicht mehr herausführt.
- `keydown` am `document` für eine einzelne Taste ohne Strg, Alt oder Cmd.
- Das Kürzel feuert auch, während ein Feld den Fokus hat.
- Kürzel auf `/` oder `?`, die auf einer anderen Tastaturbelegung nicht erreichbar sind.
- `tabindex` größer als 0.
- CSS `order`, `flex-direction: row-reverse` oder `column-reverse` an Elementen mit Text oder Bedienung.
- Umgestellte `grid-area` oder absolute Positionierung, die die sichtbare Reihenfolge ändert.
- Beim Durchtabben springt der Fokus rückwärts oder quer.

### Grenzen

Bewegungen, deren Weg selbst die Eingabe ist, etwa Freihandzeichnen.

Kürzel, die nur gelten, solange das Element den Fokus hat, etwa Pfeiltasten in einer Liste.

Rein dekorative Elemente ohne Text und ohne Bedienung. Braucht ein kleiner Schirm eine andere Reihenfolge, wird sie dort im Code anders gebaut, nicht per CSS umgedreht.

### Quelle

WCAG 2.1.1 Keyboard, 2.1.2 No Keyboard Trap. APG › Developing a Keyboard Interface. Vercel › Keyboard. WCAG 2.1.4 Character Key Shortcuts. Vercel › Interactions („Locale-aware keyboard shortcuts"). WCAG 1.3.2 Meaningful Sequence, 2.4.3 Focus Order.

### Verwandt

- Der Fokus ist sichtbar und hat immer einen Ort
- Die Titel bilden eine Gliederung

## Der Fokus ist sichtbar und hat immer einen Ort

Bedienung · https://standby.design/docs/rules/bedienung-der-fokus-ist-sichtbar-und-hat-immer-einen-ort

**Geltung:** universal · web, react-native

> **Regel**
> Jedes bedienbare Element zeigt sichtbar, wenn es den Fokus hat. Entferne den Fokus nie ersatzlos. Er ist im ganzen Projekt gleich gebaut, verschiebt kein Layout und wird nie von einer fixierten Leiste verdeckt. Leg für jeden Wechsel fest, wo er landet: Pop-up öffnet, Fokus hinein. Pop-up schließt, Fokus zurück auf den Auslöser. Element gelöscht, Fokus auf den Nachbarn. Absenden mit Fehlern, Fokus aufs erste fehlerhafte Feld.

### Warum

Wer mit der Tastatur bedient, sieht ohne Fokus gar nicht, wo er ist. Das betrifft nicht nur Screenreader-Nutzer, sondern jeden, der ein Formular schnell durchtabbt. Der Fokus ist die einzige Rückmeldung, die diese Nutzer bekommen.

Die Voreinstellung des Browsers wird oft entfernt, weil sie nicht zum Rest passt, und dann bleibt nichts übrig. Der Wunsch dahinter ist berechtigt — die Antwort darauf ist ein eigener Fokus, kein fehlender.

Dass er das Layout nicht verschieben darf, hat einen praktischen Grund: sitzt er außerhalb des Elements, springt er in engen Reihen über die Nachbarn.

Ein Fokus, der hinter einer fixierten Kopf- oder Fußleiste liegt, ist so unsichtbar wie ein entfernter. Der Browser scrollt das fokussierte Element nur bis an den Rand des Fensters, und dort steht die Leiste. Der Abstand zur Leiste muss deshalb im Scrollverhalten der Seite stehen. Dasselbe gilt für Sprungziele: Springt ein Anker zu einer Überschrift, landet sie unter der Leiste, nicht dahinter.

Verschwindet das fokussierte Element, springt der Fokus an den Seitenanfang. Der Nutzer verliert seinen Platz.

### Hart und weich

Hart: jeder Wechsel hat ein Ziel. Weich: nichts.

### Woran Du den Verstoß erkennst

- Irgendwo steht `outline: none` ohne Ersatz.
- Eine Leiste mit `position: sticky` oder `fixed`, aber kein `scroll-padding` an der Seite. Beim Durchtabben verschwindet der Fokus darunter.
- Beim Durchtabben einer Ansicht verliert man die Position.
- Der Fokus verschiebt beim Erscheinen das Layout oder überlagert Nachbarn.
- Der Fokus wird pro Komponente anders gebaut.
- Ein Anker springt zu einer Überschrift, und sie liegt hinter der fixierten Leiste. Kein `scroll-margin-top` an Überschriften.
- Dialog ohne Fokusfalle.
- Nach dem Schließen ist `document.activeElement` der `body`.
- Absenden mit Fehlern ohne `focus()` auf ein Feld.

### Grenzen

Die Regel gilt für Tastaturfokus. Ein Fokus nach einem Mausklick darf unterdrückt werden (`:focus-visible`), weil der Mausnutzer schon weiß, wo er geklickt hat.

Wie der Fokus aussieht, ist eine Entscheidung des Projekts und steht dort. Ein weicher Ring auf der Kante ist eine gute Antwort, ein kräftiger Umriss mit Abstand auch — solange er die Nachbarn nicht überlagert.

Nicht-modale Hinweise wie Kurzmeldungen ziehen den Fokus nicht.

### Quelle

APG › Dialog (Modal) Pattern. Vercel › Keyboard („Manage focus (trap, move, return)") und Forms („on submit, focus first error"). WCAG 2.4.3 Focus Order.

### Verwandt

- Klickbares hat eine Fläche, und nur Klickbares sieht so aus
- Farbe trägt nie allein
- Bewegung hat einen Wert und hält nichts auf
- Ein Pop-up unterbricht, es führt nicht
- Zerstörendes trifft man nicht aus Versehen
- Ein Fehler steht dort, wo er entstanden ist

## Name und Zustand stehen im Code

Bedienung · https://standby.design/docs/rules/bedienung-name-und-zustand-stehen-im-code

**Geltung:** universal · web, react-native

> **Regel**
> Gib jedem Bedienelement einen zugänglichen Namen: Ein Feld hat ein verknüpftes `label`, ein Icon-Button ein `aria-label`, und der sichtbare Text ist Teil des Namens. Leg jeden dauerhaften Zustand als Attribut ab: `aria-pressed`, `aria-expanded`, `aria-selected`, `aria-checked`, `aria-current`, `aria-invalid`, `aria-sort`.

### Warum

Ohne Namen sagt der Screenreader nur „Button". Und wer per Sprache steuert, sagt, was er sieht.

Für das Design heißt das: Jeder Icon-Button braucht in der Spezifikation einen Namen, auch wenn er nie zu sehen ist. Bei einer Zeile mit Bearbeiten, Kopieren und Löschen hört der Nutzer sonst „Button, Button, Button“.

Ein Screenreader liest kein Aussehen. Ohne Attribut hört der Nutzer „Button" und weiß nicht, ob er an oder aus ist.

### Hart und weich

Hart.

### Woran Du den Verstoß erkennst

- `<button><Icon/></button>` ohne `aria-label`.
- `<input placeholder="E-Mail">` ohne `label`.
- `aria-label`, das vom sichtbaren Text abweicht.
- Umschalter, dessen Zustand nur eine Klasse ändert.
- Aufklapper ohne `aria-expanded`.
- Aktiver Menüpunkt ohne `aria-current`.
- Sortierbare Spalte ohne `aria-sort`.
- Fehlerhaftes Feld ohne `aria-invalid`.

### Grenzen

Ein Icon neben Text ist Schmuck. Es bekommt `aria-hidden`, keinen Namen.

Native Elemente, die den Zustand selbst melden: `checkbox`, `radio`, `select`, `details`.

### Quelle

WCAG 4.1.2 Name, Role, Value, 3.3.2 Labels or Instructions, 2.5.3 Label in Name. Vercel › Content & Accessibility („Icon-only buttons have descriptive `aria-label`"). WCAG 4.1.2 Name, Role, Value. APG › Button Pattern (Toggle), Disclosure Pattern.

### Verwandt

- Verhalten und Aussehen bleiben getrennt
- Was ein Feld beschreibt, steht im Feld
- Farbe trägt nie allein
- Kurze Zustände verschieben, dauerhafte wechseln die Palette
- Struktur steckt im Element

## Zerstörendes trifft man nicht aus Versehen

Bedienung · https://standby.design/docs/rules/bedienung-zerstoerendes-trifft-man-nicht-aus-versehen

**Geltung:** universal · web, react-native

> **Regel**
> Stell eine zerstörende Handlung nie direkt neben die häufigste und nie an den Platz des Hauptknopfs. Im Dialog vor einer unumkehrbaren Handlung liegt der Fokus auf dem sicheren Knopf, die zerstörende Handlung ist nie die Standardtaste, und der Dialog nennt Gegenstand und Folge.

### Warum

Was nah und groß ist, trifft man schnell, auch aus Versehen. Wer zehnmal am Tag auf „Speichern“ klickt, trifft beim elften Mal den Nachbarn.

Wer Enter drückt, um ein Fenster wegzuklicken, soll dabei nichts löschen.

Der Dialog nennt dazu den Gegenstand und die Folge, und die Knöpfe nennen die Handlung: „‚Projekt Alpha‘ löschen?“ mit „Löschen“ und „Abbrechen“. Der Nutzer soll nicht erinnern müssen, worauf er geklickt hat.

### Hart und weich

Hart: getrennt durch Ort oder deutlichen Abstand. Weich: wie. Vorgabe: Löschen an der gegenüberliegenden Kante oder im Menü der Zeile.

Hart: die zerstörende Handlung ist nie Standard. Weich: ob der Fokus auf „Abbrechen" oder auf dem Dialog selbst liegt. Vorgabe „Abbrechen".

### Woran Du den Verstoß erkennst

- „Löschen“ direkt neben „Speichern“, ohne Abstand.
- „Löschen“ steht rechts unten, wo auf allen anderen Seiten „Speichern“ steht.
- „Alle entfernen“ neben „Hinzufügen“.
- `autoFocus` auf „Löschen".
- Enter im Dialog löst die zerstörende Handlung aus.
- Der Löschknopf ist der `type="submit"` im Dialog-Formular.
- „Sind Sie sicher?“ ohne Namen des Gegenstands. Knöpfe „Ja“ und „Nein“ oder „OK“.

### Grenzen

Der Bestätigungsdialog. Dort steht „Löschen“ bewusst neben „Abbrechen“, und Zerstörendes trifft man nicht aus Versehen regelt den Fokus.

Der Nutzer hat die Handlung eben selbst gewählt und sie ist umkehrbar. Dann gilt Rückgängig statt Dialog, siehe die Fehler-Regel.

### Quelle

Laws of UX › Fitts’s Law, https://lawsofux.com/fittss-law/ Nielsen Norman Group › 10 Usability Heuristics, Nr. 6 Recognition rather than recall. APG › Dialog (Modal) Pattern („set focus on the least destructive action"). Apple HIG › Alerts („include a Cancel button to give people a clear, safe way").

### Verwandt

- Gewicht ist ein Budget, ein Primary pro Ansicht
- Ein Pop-up unterbricht, es führt nicht
- Ein Fehler steht dort, wo er entstanden ist
- Der Fokus ist sichtbar und hat immer einen Ort

## Klickbares hat eine Fläche, und nur Klickbares sieht so aus

Bedienung · https://standby.design/docs/rules/bedienung-klickbares-hat-eine-flaeche-und-nur-klickbares-sieht-so-aus

**Geltung:** universal · web, react-native

> **Regel**
> Alles, was man anklicken kann, ist ein Button, mindestens in der stillsten Variante (`ghost`), für Navigation als Button um einen Link herum. Nackte Textlinks sind nicht erlaubt, auch nicht in Fußzeilen. Umgekehrt bekommt nichts das Aussehen eines Bedienelements, das keine Handlung hat.

### Warum

Ein nackter Textlink ist auf dem Handy kaum zu treffen. Die Zeilenhöhe von Text ist keine Trefferfläche, und der Daumen ist kein Mauszeiger. Die Höhe eines Buttons in Standardgröße ist genau dafür da: sie ist die Fläche, die ein Finger sicher trifft.

Der zweite Grund ist Erkennbarkeit. Eine Fläche sagt „hier kannst Du drücken", bevor der Nutzer den Text gelesen hat. Ein Textlink sagt es erst danach, und in einer Fußzeile voller Text gar nicht.

Der Wunsch hinter dem Textlink ist meistens „das soll unauffällig sein". Das ist ein berechtigter Wunsch, aber die Antwort darauf ist Schriftfarbe und Schriftgröße, nicht eine kleinere Fläche. Dezent heißt leise, nicht schwer zu treffen.

Ein toter Klick lässt den Nutzer zweifeln, ob die Seite kaputt ist. Danach traut er auch den echten Knöpfen weniger.

### Hart und weich

| | Status |
|---|---|
| Klickbares hat eine echte Trefferfläche, kein nackter Textlink | hart |
| Dezent wird über Farbe gelöst, nicht über eine kleinere Fläche | hart |
| Die Standardhöhe liegt in der Größe einer Finger-Trefferfläche | hart |
| Keine Trefferfläche ist kleiner als 24 × 24 Pixel, auch nicht in dichten Leisten | hart |
| Kästchen oder Schalter und ihre Beschriftung sind eine gemeinsame Trefferfläche | hart |
| Die konkreten Höhen | weich, Vorgabe 40 Pixel Standard, 32 Pixel nur am Zeigegerät |

### Woran Du den Verstoß erkennst

- Ein `<a>` oder ein `Text` mit `onPress`, ohne umgebende Fläche.
- Ein Umschalter („Zur Monatsansicht", „Alle anzeigen") ist als reiner Text gebaut.
- Die Fußzeile besteht aus einer Reihe nackter Links.
- Die Trefferfläche wird kleiner gesetzt, um das Element unauffälliger zu machen.
- Ein Zurück über dem Inhalt ist ein Pfeil mit Text, ohne Fläche.
- Ein Icon-Button ist kleiner als 24 × 24 Pixel, etwa ein Schließen-X mit 12 Pixel.
- Nur das Kästchen einer Checkbox ist klickbar, nicht ihre Beschriftung.
- `cursor: pointer` oder Hover-Effekt an einer Karte ohne Handlung.
- Pfeil-Icon in einer Zeile, die sich nicht öffnet.
- Unterstrichener Text, der kein Link ist.
- Ein Teil der Karte ist klickbar, der Rest sieht gleich aus und ist es nicht.

### Richtig / falsch

```
        RICHTIG                             FALSCH

  ┌──────────────────┐              Alle anzeigen
  │  Alle anzeigen   │  40px hoch   ‾‾‾‾‾‾‾‾‾‾‾‾
  └──────────────────┘              ~18px, kaum zu treffen

  ghost-Variante: keine sichtbare    „unauffällig" über
  Fläche im Ruhezustand, aber        kleinere Fläche gelöst
  volle Trefferfläche
```

### Grenzen

Die einzige Ausnahme ist ein Wort oder eine Wortgruppe **mitten im Fließtext**, etwa ein Verweis innerhalb eines Absatzes in den Rechtstexten. Dort wäre eine Fläche der Fremdkörper. Sobald der Link auf einer eigenen Zeile steht, gilt die Regel wieder.

### Quelle

Vercel AGENTS.md › Touch & Drag („If it looks clickable, it must be clickable"). Vercel Guidelines › Interactions („No dead zones").

### Verwandt

- Die Höhe gehört der Zeile, nicht dem Element
- Verhalten und Aussehen bleiben getrennt
- Der Fokus ist sichtbar und hat immer einen Ort
- Eine Handlung löst beim Loslassen aus

## Was der Nutzer tippt oder einfügt, kommt an

Formular · https://standby.design/docs/rules/formular-was-der-nutzer-tippt-oder-einfuegt-kommt-an

**Geltung:** universal · web, react-native

> **Regel**
> Sperr nie das Einfügen und verändere eine Eingabe nie stillschweigend.

### Warum

Ein verschlucktes Zeichen ist ein Fehler, den der Nutzer nicht sieht. Aus eingefügtem „1.250,00 €" wird dann still „125000".

### Woran Du den Verstoß erkennst

- `onPaste` mit `preventDefault()`.
- Ein `onChange`, der Zeichen herausfiltert.
- `maxLength`, das ohne Zähler abschneidet.
- Ein Code-Feld, das eingefügte Codes nicht verteilt.

### Hart und weich

Hart.

### Grenzen

Das Feld darf beim Verlassen sichtbar normalisieren, etwa Leerzeichen am Rand entfernen oder eine IBAN gruppieren.

### Quelle

Vercel › Forms („Never block paste", „Accept free text, validate after—don't block typing", „allow pasting codes"). WCAG 3.3.8 Accessible Authentication (Minimum).

### Verwandt

- Der Nutzer tippt nur, was das System nicht weiß
- Ein Fehler steht dort, wo er entstanden ist

## Was ein Feld beschreibt, steht im Feld

Formular · https://standby.design/docs/rules/formular-was-ein-feld-beschreibt-steht-im-feld

**Geltung:** universal · web, react-native

> **Regel**
> Setz Icon, Einheit und Vorzeichen, die zu einem Feld gehören, in den Rahmen des Feldes. Was den Inhalt beschreibt, steht an der Stelle, an der man es auch spricht: die Lupe und das Vorzeichen vorn, Euro und Prozent hinten. Was etwas mit dem Feld tut, steht am Ende: Kalender öffnen, leeren, Passwort zeigen. Nichts steht dazwischen und nichts außerhalb.

### Warum

Ein Icon außerhalb des Rahmens liest sich als eigenes Element. Der Blick muss raten, ob es ein Knopf ist, eine Überschrift oder Schmuck. Im Rahmen gehört es zum Feld, weil der Rahmen die Gruppe ist.

Die Einheit im Feld spart Arbeit an zwei Stellen. Der Nutzer tippt nur die Zahl und sieht trotzdem, was sie meint. Und niemand tippt das Euro-Zeichen mit, das die Prüfung danach wieder herausrechnen muss.

Die feste Stelle zählt genauso. Ein Icon, das hinter dem Text herläuft, wandert mit jeder Eingabe und bildet in einer Reihe von Feldern keine gemeinsame Kante. So baut es das native Datumsfeld mancher Browser.

### Hart und weich

| | Status |
|---|---|
| Icon, Einheit und Vorzeichen stehen im Rahmen des Feldes | hart |
| Beschreibendes vorn oder hinten wie gesprochen, Handelndes am Ende | hart |
| Ein Knopf im Feld ist das innere Element und hat den konzentrischen Radius | hart |
| Abstand zwischen Icon und Text | weich, Vorgabe die kleinste Abstandsstufe |

### Woran Du den Verstoß erkennst

- Ein Icon steht neben dem Feld statt darin.
- Die Einheit steht als eigenes Wort hinter dem Rahmen.
- Ein Icon liegt absolut positioniert über dem Feld, und der Text läuft darunter durch.
- Das Icon steht an einer Stelle, die die Länge des Inhalts bestimmt.

### Richtig / falsch

```
        RICHTIG                             FALSCH

  ┌───────────────────────┐          ⌕ ┌───────────────────────┐
  │ ⌕  Mitarbeiter suchen │            │ Mitarbeiter suchen    │
  └───────────────────────┘            └───────────────────────┘

  ┌──────────────┐                     ┌──────────────┐
  │ 1.200      € │                     │        1.200 │ €
  └──────────────┘                     └──────────────┘

  ┌───────────────────────┐            ┌───────────────────────┐
  │ 04.08.2026      [▦]   │            │ 04.08.2026  ▦         │
  └───────────────────────┘            └───────────────────────┘
  Icon an der Kante                    Icon folgt dem Text
```

### Grenzen

Ein Button neben dem Feld mit eigener Aufgabe (Suchen, Anlegen) gehört nicht ins Feld. Die beiden sind ein Paar, siehe Die Höhe gehört der Zeile, nicht dem Element.

Die Beschriftung steht über dem Feld. Ein Platzhalter ersetzt sie nicht, weil er beim ersten Tastendruck verschwindet.

### Verwandt

- Konzentrische Radien
- Weniger Kanten, ruhigere Ansicht
- Zahlenspalten stehen rechtsbündig

## Was zusammen gespeichert wird, steht in einem Formular

Formular · https://standby.design/docs/rules/formular-was-zusammen-gespeichert-wird-steht-in-einem-formular

**Geltung:** universal · web

> **Regel**
> Leg Felder, die zusammen gespeichert werden, in ein Formular. Enter im Feld speichert.

### Warum

Nutzer erwarten, dass Enter abschickt. Das liefert nur ein echtes Formular im Code, und nur dann erkennt auch der Passwortmanager die Felder. Gemeint sind Felder, die einen Speichern-Knopf teilen, etwa Name, E-Mail und Telefon mit einem „Speichern“ darunter.

### Woran Du den Verstoß erkennst

- Felder ohne umgebendes `form`.
- Speichern als `type="button"` mit `onClick`.
- Enter im Feld bewirkt nichts.

### Hart und weich

Hart.

### Grenzen

Im mehrzeiligen Textfeld macht Enter eine neue Zeile. Dort sendet Strg oder Cmd plus Enter.

### Quelle

Vercel › Forms („Enter submits focused input; in `<textarea>`, ⌘/Ctrl+Enter submits").

### Verwandt

- Der Nutzer tippt nur, was das System nicht weiß
- Ein Button ist nie gesperrt
- Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben

## Der Nutzer tippt nur, was das System nicht weiß

Formular · https://standby.design/docs/rules/formular-der-nutzer-tippt-nur-was-das-system-nicht-weiss

**Geltung:** universal · web, react-native

> **Regel**
> Frag keinen Wert ab, den das System schon kennt oder ableiten kann. Gib jedem Feld mit festem Zweck den passenden `type`, `inputmode` und `autocomplete`, damit Browser, Passwortmanager und Tastatur den Rest übernehmen.

### Warum

Jedes Feld kostet den Nutzer Zeit und ist eine Fehlerquelle. Was das System selbst weiß, muss es selbst tragen.

Browser, Passwortmanager und Handytastatur helfen nur, wenn sie den Zweck kennen.

Dazu gehört das Gegenteil: Wo die Hilfe stört, bleibt sie aus. Bei E-Mail, Codes und Nutzernamen ist die Rechtschreibprüfung aus, und Felder ohne Anmeldung, etwa die Suche, rufen keinen Passwortmanager auf. Einmalcodes tragen `autocomplete="one-time-code"`, dann bietet das Handy den Code aus der SMS an.

### Hart und weich

Hart: der Zweck steht am Feld.

### Woran Du den Verstoß erkennst

- Das Feld „E-Mail wiederholen“.
- Die Stadt bleibt leer, obwohl die Postleitzahl sie verrät.
- Die Kartenart wird abgefragt, obwohl die Nummer sie zeigt.
- Ein angemeldeter Nutzer tippt seine Adresse im Bestellformular neu.
- Rechnungsadresse ohne „wie Lieferadresse“.
- E-Mail, Telefon oder Betrag als `type="text"` ohne `inputmode`.
- Login ohne `autocomplete="username"` und `"current-password"`.
- `autocomplete="off"` an Name oder Adresse.
- Rote Wellenlinie unter einer E-Mail-Adresse.
- Ein Suchfeld heißt `name="password"`, oder der Passwortmanager bietet sich im Suchfeld an.

### Grenzen

Neues Passwort, wenn es nicht angezeigt werden kann. Werte, die der Nutzer bewusst prüfen soll, werden vorbelegt statt verborgen.

Freitext und Suche haben keinen festen Zweck.

### Quelle

Laws of UX › Tesler’s Law, https://lawsofux.com/teslers-law/. WCAG 3.3.7 Redundant Entry. WCAG 1.3.5 Identify Input Purpose, 3.3.7 Redundant Entry. Vercel › Forms („`autocomplete` + meaningful `name`; correct `type` and `inputmode`").

### Verwandt

- Was der Nutzer tippt oder einfügt, kommt an
- Ein Fehler steht dort, wo er entstanden ist

## Lange Zeichenketten stehen in Gruppen

Inhalt · https://standby.design/docs/rules/inhalt-lange-zeichenketten-stehen-in-gruppen

**Geltung:** universal · web, react-native

> **Regel**
> Zeig IBAN, Telefonnummern, Codes und andere lange Zeichenketten in Gruppen an und gib sie beim Kopieren ohne Trennzeichen heraus.

### Warum

22 Zeichen am Stück kann niemand vergleichen oder abtippen. In Vierergruppen findet das Auge seinen Platz wieder.

### Woran Du den Verstoß erkennst

- IBAN als eine lange Zeile.
- Telefonnummer ohne Leerzeichen.
- Achtstelliger Code am Stück.
- Kopieren liefert die Leerzeichen mit.

### Hart und weich

Hart: gruppiert in der Anzeige, ohne Trennzeichen beim Kopieren. Weich: die Gruppengröße. Vorgabe: die Norm des Formats, sonst Vierergruppen.

### Grenzen

Werte, die nur kopiert und nie gelesen werden, etwa lange Schlüssel. Die bekommen einen Kopierknopf.

### Quelle

Laws of UX › Chunking, https://lawsofux.com/chunking/

### Verwandt

- Was der Nutzer tippt oder einfügt, kommt an
- Zahlenspalten stehen rechtsbündig

## Struktur steckt im Element

Inhalt · https://standby.design/docs/rules/inhalt-struktur-steckt-im-element

**Geltung:** universal · web

> **Regel**
> Baue Tabellen als `table` mit Kopfzellen, Listen als Liste, zusammengehörige Felder als Gruppe mit Titel und die Seite aus benannten Bereichen (`header`, `nav`, `main`, `footer`). Der erste Tab-Halt springt zum Inhalt.

### Warum

Der Screenreader sagt „Tabelle, 5 Spalten" oder „Liste, 12 Einträge". Bei `div`-Gittern hört der Nutzer nur einzelne Wörter ohne Zusammenhang.

Sonst tabbt der Nutzer auf jeder Seite erst durch die ganze Navigation. Bei einer Navigation mit 20 Einträgen sind das 20 Tabs, auf jeder Seite neu.

Für das Design heißt das: Der Link „Zum Inhalt springen“ ist im Ruhezustand unsichtbar und erscheint erst beim ersten Tab. Er braucht deshalb nur ein Aussehen im Fokus-Zustand.

### Hart und weich

Hart.

### Woran Du den Verstoß erkennst

- Datentabelle aus `div` mit Grid.
- Tabelle ohne `th` und `scope`.
- Aufzählung als Folge von `div`.
- Radiogruppe ohne `fieldset` und `legend`, oder ohne `role="radiogroup"` und Namen.
- Kein `main`.
- Alles in `div`.
- Der erste Tab landet im Menü.

### Grenzen

Tabellen nur fürs Layout gibt es nicht. Dort gehört Grid hin, ohne Tabellenrolle.

Ansichten ohne wiederkehrende Navigation, etwa der Login.

### Quelle

WCAG 1.3.1 Info and Relationships. Vercel AGENTS.md › Content & Accessibility („Prefer native semantics (`button`, `a`, `label`, `table`)"). WCAG 2.4.1 Bypass Blocks. Vercel › Content & Accessibility („‚Skip to content' link").

### Verwandt

- Name und Zustand stehen im Code
- Zahlenspalten stehen rechtsbündig
- Die Titel bilden eine Gliederung
- Alles geht mit der Tastatur, in der Reihenfolge des Bildes
- Der Fokus ist sichtbar und hat immer einen Ort

## Alles hat eine Textfassung

Inhalt · https://standby.design/docs/rules/inhalt-alles-hat-eine-textfassung

**Geltung:** universal · web, react-native

> **Regel**
> Gib jedem Bild mit Bedeutung einen Alternativtext, der sagt, was es zeigt, und jedem Schmuckbild ein leeres `alt`. Gib gesprochenem Inhalt in Videos Untertitel und reinem Ton ein Transkript. Setz Überschriften, Beschriftungen und Zahlen als Text, nie als Grafik.

### Warum

Ohne Text liest der Screenreader den Dateinamen vor oder gar nichts. Mit Text bei einem Schmuckbild hört der Nutzer Rauschen.

Ein leeres `alt=""` ist dabei kein Versehen, sondern der Standard in HTML: Es sagt dem Screenreader „überspringen“. Fehlt das `alt` ganz, liest er stattdessen den Dateinamen vor. Schmuck ist ein Bild ohne Information, etwa ein Hintergrundmuster oder eine Deko-Illustration.

Text in einem Bild lässt sich nicht vergrößern, nicht übersetzen, nicht kopieren und nicht vorlesen.

Wer nicht hört oder gerade keinen Ton anmachen kann, bekommt den Inhalt sonst gar nicht.

### Hart und weich

Hart.

### Woran Du den Verstoß erkennst

- `img` ohne `alt`.
- `alt` mit Dateinamen oder „Bild".
- Bedeutungsvolles SVG ohne `role="img"` und Titel.
- Schmuckbild mit beschreibendem `alt` statt `alt=""`.
- Überschrift als PNG oder SVG mit Pfaden.
- Text in ein Titelbild eingebrannt.
- Beschriftungen per `canvas` gezeichnet ohne Textfassung.
- `video` ohne `track kind="captions"`.
- Podcast oder Sprachnachricht ohne Text.
- Eingebrannte Untertitel, die sich nicht ausschalten lassen.

### Grenzen

Icons in Buttons regelt Name und Zustand stehen im Code.

Logos und Wortmarken.

Video ohne Sprache und ohne wichtige Geräusche. Schmuckvideo, das nach Was sich von selbst bewegt, lässt sich anhalten stumm läuft.

### Quelle

WCAG 1.1.1 Non-text Content. Fluent 2 › Accessibility › Rich media and alternatives. WCAG 1.4.5 Images of Text. WCAG 1.2.1 Audio-only and Video-only, 1.2.2 Captions (Prerecorded). Vercel › Content („Accessible media").

### Verwandt

- Name und Zustand stehen im Code
- Jeder Textbehälter hält jede Textmenge aus
- Icons sind auf die Schrift abgestimmt
- Was sich von selbst bewegt, lässt sich anhalten

## Rot ist nicht ein Rot

Zustand · https://standby.design/docs/rules/zustand-rot-ist-nicht-ein-rot

**Geltung:** universal · web, react-native

> **Regel**
> Lege für jede Zustandsbedeutung — Fehler, Warnung, Erfolg, Hinweis — mehrere Werte fest, nicht einen. Welcher gilt, entscheidet der Untergrund, auf dem die Farbe landet.

### Warum

Nimm ein einziges Rot und lass es drei Aufgaben erledigen:

```
1  Fehlertext auf der Karte      Rot muss LESBAR sein
                                 → braucht viel Kontrast zur Karte

2  ruhiges Badge                 Fläche darf NICHT schreien
   ▸ Fläche                      → braucht wenig Kontrast zur Karte
   ▸ Text darauf                 → braucht viel Kontrast zur Fläche

3  voll roter Knopf              Text muss lesbar SEIN
   ▸ Fläche                      → das kräftige Rot
   ▸ Text darauf                 → helle Gegenfarbe
```

Aufgabe 1 verlangt viel Kontrast, Aufgabe 2 verlangt in derselben Zeile wenig **und** viel. Ein einziger Wert kann das nicht. Nimmt man ihn trotzdem, ist entweder der Text nicht zu lesen oder die Fläche zu laut — meistens beides an verschiedenen Stellen.

Das ist derselbe Gedanke wie bei heller und dunkler Erscheinung: dieselbe Bedeutung, verschiedene Werte, je nach Umgebung. Nur läuft die Unterscheidung hier nicht über den Modus, sondern über den Untergrund.

Fehlt diese Familie, wird pro Einsatzort geraten. Man landet bei Konstruktionen wie „die Grundfarbe mit zehn Prozent Deckkraft als Fläche und dieselbe Grundfarbe als Text darauf". Bei Rot sieht das gerade noch brauchbar aus, bei Gelb nicht mehr, und in der hellen Erscheinung bei keinem von beiden.

### Was eine Familie abdecken muss

| Fall | Was gebraucht wird |
|---|---|
| Text oder Icon direkt auf einer Fläche | ein Wert mit genug Kontrast zum Lesen |
| Ruhige Fläche, etwa Badge oder Chip | ein zurückgenommener Wert **plus** die dazu passende Schriftfarbe |
| Voll eingefärbte Fläche | der kräftige Wert **plus** eine Gegenfarbe für den Text darauf |

Wie die Werte heißen und wie viele es genau sind, entscheidet das Projekt. Dass es mehr als einen braucht, entscheidet der Kontrast.

### Woran Du den Verstoß erkennst

- Ein Badge wird aus der Grundfarbe mit Deckkraft und derselben Grundfarbe als Text gebaut.
- Ein voll eingefärbter Knopf hat weißen Text statt der zugehörigen Gegenfarbe.
- Dieselbe Zustandsfarbe steht einmal als Fläche und einmal als Fließtext, und beim Text muss man die Augen zusammenkneifen.
- Ein Zustand ist in einer Erscheinung gut lesbar und in der anderen nicht.

### Zustandsfarben neben Markenfarben

**Empfehlung, keine Vorschrift:** Grün und Rot möglichst nicht auch als Marken- oder Strukturfarbe einsetzen. Sonst kann der Nutzer nicht mehr unterscheiden, ob eine grüne Fläche etwas bedeutet oder nur zur Marke gehört — und wenn er das einmal falsch gelernt hat, übersieht er später die Fläche, die wirklich etwas bedeutet.

Ist die Marke nun einmal grün oder rot, ist das kein Grund, sie zu ändern. Dann braucht es zwei Dinge:

- Die Zustandsfarben liegen sichtbar neben der Markenfarbe, nicht auf ihr. Ein anderer Farbton, eine andere Sättigung, irgendetwas, das den Unterschied trägt.
- Der Zustand hängt nicht an der Farbe allein. Ein Zeichen, ein Wort oder ein Symbol trägt die Bedeutung mit, siehe Farbe trägt nie allein. Das ist ohnehin schon Pflicht, hier wird es nur besonders wichtig.

### Grenzen

Auf einer Marketing- oder Titelseite mit eigener Haut gilt das nicht, dort regiert die Marke. Die Regel gilt für die Anwendung, in der Farbe eine Aussage über Daten ist.

### Verwandt

- Eine Bedeutung, überall gleich
- Farbe trägt nie allein
- Werte kommen aus Tokens, nie aus der Hand

## Eine Bedeutung, überall gleich

Zustand · https://standby.design/docs/rules/zustand-eine-bedeutung-ueberall-gleich

**Geltung:** universal · web, react-native

> **Regel**
> Leg jede Bedeutung einmal fest und halte sie im ganzen Produkt gleich. Eine Handlung hat überall denselben Namen und dasselbe Icon, und ein Icon steht nie für zwei Handlungen. Ein Wert hat überall dieselbe Grenze für gut, mittel und schlecht, und fehlt er, ist der Zustand neutral.

### Warum

Liest der Nutzer hier „Entfernen" und dort „Löschen", fragt er sich, ob es dasselbe ist.

Bekannte Zeichen behalten dabei die Bedeutung, die sie außerhalb des Produkts haben: Lupe heißt Suche, Zahnrad heißt Einstellungen, X heißt Schließen, das Logo führt zur Startseite. Der Nutzer bringt diese Bedeutung mit und lernt sie nicht neu.

Dasselbe gilt für den Weg zur Hilfe. Er muss nicht auf jeder Seite stehen, ein Platz im Profil reicht. Aber wo es ihn gibt, steht er immer an derselben Stelle.

Farbe ist eine Aussage über Daten. Steht derselbe Wert auf einer Seite in Gelb und auf der anderen in Grün, widerspricht sich die Oberfläche selbst. Der Nutzer merkt das, auch wenn er es nicht benennen kann, und er lernt daraus das Falsche: der Farbe nicht zu trauen. Danach nützt sie nirgends mehr etwas, auch dort nicht, wo sie stimmt.

Das passiert nicht aus Nachlässigkeit, sondern weil jede Stelle ihre Grenze einzeln setzt. Jede für sich ist plausibel gewählt, und zusammen ergeben sie vier verschiedene Skalen im selben Produkt.

Die Regel greift überall, wo eine Zahl in einen Zustand übersetzt wird: Speicherplatz, der knapp wird. Passwortstärke. Akkustand. Lagerbestand. Temperatur, Luftqualität, Lieferzeit. Ein Fortschritt, der „hinter Plan" heißt. Sobald es eine Grenze gibt, ab der etwas anders aussieht, gilt sie.

### Ohne Daten kein Zustand

Fehlt der Wert, ist der Zustand neutral und die Anzeige bleibt grau. Es wird nichts angenommen.

Wer bei fehlendem Wert Grün zeigt, behauptet „alles in Ordnung", obwohl niemand nachgesehen hat. Das ist die gefährlichste Falschaussage, weil sie beruhigt. Wer Rot zeigt, löst einen Alarm ohne Anlass aus, und nach dem dritten Mal glaubt niemand mehr an die roten Felder. Grau ist die ehrliche Antwort: es liegt nichts vor.

Die Regel hat eine unbequeme Seite. Eine frisch eingerichtete Ansicht sieht dadurch grau und leer aus. Das ist der richtige Eindruck. Der Weg zu einer bunten Ansicht führt über Daten, nicht über Annahmen.

**Sonderfall Zähler.** Bei einem Zähler für etwas, das es nicht geben sollte — offene Fehler, fehlende Belege, ungelesene Warnungen — ist die Null nicht grün, sondern grau. Grün hieße „geprüft und in Ordnung". Grau heißt „hier ist nichts", und das ist der ehrlichere Satz.

### Wo die Grenzen herkommen

Die Zahlen selbst sind eine fachliche Festlegung, keine Gestaltungsfrage. Wo die Grenze zwischen mittel und schlecht liegt, entscheidet nicht der Designer, sondern wer für die Zahl fachlich einsteht.

Getrennt davon steht die Übersetzung in das, was man sieht. Wer die Grenzen ändert, ändert sie an einer Stelle, ohne dass sich das Aussehen bewegt. Wer das Aussehen ändert, fasst die Grenzen nicht an.

### Hart und weich

Hart: eins zu eins. Weich: welche Wörter und Icons. Das legt das Projekt fest.

### Woran Du den Verstoß erkennst

- „Speichern", „Sichern" und „Übernehmen" für dieselbe Handlung.
- Mülleimer und X für Löschen.
- X für Schließen und für Löschen.
- Die Lupe öffnet einen Zoom, das Zahnrad öffnet Filter, oder ein Klick aufs Logo tut nichts.
- Hilfe oder Kontakt stehen mal im Kopf, mal in der Fußzeile, mal im Profil.
- Zwei Ansichten zeigen denselben Wert in verschiedenen Farben.
- Der Vergleich mit einer Grenze steht in mehr als einer Datei.
- Eine neue Anzeige bekommt ihre Grenzen mitgegeben, statt sie zu erfragen.
- Ein fehlender Wert wird zu null gemacht und dann eingefärbt.
- Ein Feld ohne Daten ist grün, weil „kein Problem gemeldet" als gut gewertet wird.
- Eine Kennzahl zeigt einen Strich und trotzdem einen farbigen Rand oder ein farbiges Badge.

### Grenzen

Handlungen, die wirklich verschieden sind, etwa aus einer Liste entfernen und endgültig löschen. Die heißen bewusst verschieden.

Eine Kennzahl mit fachlich eigenen Grenzen — eine gesetzliche Quote, ein vertraglicher Schwellwert — bekommt ihre Werte natürlich von dort. Sie geht trotzdem durch dieselbe Übersetzung, damit der Weg von der Zahl zur Farbe an einer Stelle bleibt.

Ein leerer Zustand darf erklären, warum nichts da ist, und einen Weg anbieten („Noch keine Buchungen — Import starten"). Neutral heißt grau, nicht wortlos.

### Quelle

Laws of UX › Jakob’s Law, https://lawsofux.com/jakobs-law/. WCAG 3.2.4 Consistent Identification, 3.2.3 Consistent Navigation.

### Verwandt

- Verhalten und Aussehen bleiben getrennt
- Rot ist nicht ein Rot
- Farbe trägt nie allein

## Betone mit einem Mittel, nicht mit zweien

Typografie · https://standby.design/docs/rules/typografie-betone-mit-einem-mittel-nicht-mit-zweien

**Geltung:** universal · web, react-native

> **Regel**
> Betone entweder über die Größe oder über das Gewicht, nicht über beides. Ein großer Wert steht deshalb im normalen Schnitt, eine kleine Überschrift darf dafür schwerer laufen.

### Warum

Größe und Gewicht sagen dasselbe: schau hierhin. Setzt Du beides zugleich ein, verstärken sie sich nicht, sie verstopfen sich. Eine große Zahl im fetten Schnitt wirkt nicht wichtiger, nur schwer — die Innenräume der 8, der 0 und der 6 laufen zu, und die Ziffern rücken zusammen. Auf großen Graden ist genau das der sichtbarste Nebeneffekt von Fettung.

Eine kleine Überschrift hat das umgekehrte Problem. Sie kann sich über die Größe kaum vom Fließtext lösen, weil der Unterschied zu klein wäre, um zu wirken. Dort ist das Gewicht das richtige Mittel.

Daraus folgt die Aufteilung von selbst: klein und schwer für Überschriften, groß und normal für Kennzahlen. Beides betont gleich stark, nur mit verschiedenen Mitteln.

Ein häufiger Widerspruch löst sich damit auf. Ein Token-Export nennt für Zahlen oft ein leichteres Gewicht als für Überschriften. Das ist kein Fehler im Export, das ist diese Unterscheidung.

### Hart und weich

| | Status |
|---|---|
| Ein Element wird nicht gleichzeitig über Größe und Gewicht betont, außer Titelstufen | hart |
| Eine alleinstehende große Zahl läuft im normalen Schnitt | hart |
| Gewichte kommen aus der Skala, nicht aus der Ansicht | hart |
| Welche Gewichte und Größen das sind | weich |

### Woran Du den Verstoß erkennst

- Der große Kennzahlwert in einer Kachel läuft fett.
- Alle Texte in einer Kachel haben dasselbe Gewicht, und die Hierarchie entsteht nur über die Größe.
- Ein Seitentitel wird im Code mit einem festen Gewicht überschrieben, obwohl die Skala eines vorgibt.

### Richtig / falsch

```
        RICHTIG                             FALSCH

  Runway                              Runway
  14,2 Monate                         14,2 Monate
  ^^^^^^^^^^^                         ^^^^^^^^^^^
  Titel klein und schwer              beides groß und schwer
  Zahl groß und normal                Zahl wirkt gedrungen
```

### Grenzen

Eine Zahl im Fließtext ist keine alleinstehende Zahl und folgt dem Text.

Titelstufen dürfen Größe und Gewicht zusammen nutzen. Dort geht es nicht um Betonung eines Wertes, sondern darum, dass jede Ebene der Gliederung sichtbar ist. Das regelt Die Titel bilden eine Gliederung.

Marketing- und Titelseiten dürfen mit ihren eigenen Display-Stufen arbeiten. Dort ist Schrift Bild, und ein Bild darf laut sein.

### Verwandt

- Zahlenspalten stehen rechtsbündig
- Die Titel bilden eine Gliederung
- Werte kommen aus Tokens, nie aus der Hand

## Zahlenspalten stehen rechtsbündig

Typografie · https://standby.design/docs/rules/typografie-zahlenspalten-stehen-rechtsbuendig

**Geltung:** universal · web, react-native

> **Regel**
> Setze jede Zahlenspalte in einer Tabelle rechtsbündig. Das gilt unabhängig davon, ob die Schrift gleich breite Ziffern hat.

### Warum

Rechtsbündig stehen Einer über Einern, Zehner über Zehnern. Der Blick vergleicht Größenordnungen dann an der Länge der Zahl, ohne zu lesen: eine Zahl, die weiter nach links reicht, ist größer. Linksbündig geht das verloren, dort steht die 9 unter der 1000.

Der zweite Grund ist praktisch. Viele moderne Schriften haben keine gleich breiten Ziffern, und die Einstellung für Tabellenziffern greift dann nicht. Beim Aktualisieren der Werte springt die Spalte. Rechtsbündig fällt das an der linken Kante viel weniger auf als linksbündig an der rechten.

Das betrifft jedes Projekt, das für Zahlen die normale Textschrift benutzt statt einer Monospace, und das ist der Normalfall, sobald Zahlen im Layout gut aussehen sollen.

### Gleich breite Ziffern, in zwei Stufen

Rechtsbündigkeit ordnet die Zahlen. Damit auch die einzelnen Stellen genau untereinander stehen, braucht es gleich breite Ziffern. Dafür gibt es zwei Stufen.

**Erste Stufe: Tabellenziffern.** Die meisten modernen Schriften bringen einen zweiten Ziffernsatz mit, bei dem alle Ziffern dieselbe Breite haben (`font-variant-numeric: tabular-nums`, im Schriftformat `tnum`). Das kostet keinen Schriftwechsel und reicht für die allermeisten Tabellen. Es greift allerdings nur, wenn die Schrift den Satz auch enthält.

**Zweite Stufe: eine Monospace.** In stark zahlengetriebenen Anwendungen — Buchhaltung, Finanzen, Messwerte, alles Mathematische, Protokolle — ist eine Schrift mit fester Zeichenbreite die bessere Wahl. Dort steht jede Stelle exakt untereinander, auch über Spalten und Zeilen hinweg, und man kann Ziffernfolgen abzählen statt sie zu lesen. Für lange Nummern ist das der Unterschied zwischen prüfbar und nicht prüfbar.

Solche Schriften unterscheiden außerdem Zeichen, die sonst verwechselt werden: die Null von einem großen O, die Eins von einem kleinen l und einem großen I. Viele bieten dafür eine durchgestrichene oder gepunktete Null als Schriftmerkmal (`font-variant-numeric: slashed-zero`, im Format `zero`). In technischen Zusammenhängen sollte die eingeschaltet sein.

Die Monospace gilt dabei für die Zahlen, nicht für die ganze Oberfläche. Beschriftungen, Titel und Fließtext bleiben in der Textschrift.

### Woran Du den Verstoß erkennst

- Eine Betrags- oder Mengenspalte steht linksbündig oder zentriert.
- Die Spaltenbreite ändert sich beim Aktualisieren der Daten.
- Eine Zahlenspalte ist mit Leerzeichen auf gleiche Breite gebracht.
- Die Ziffern springen beim Wechsel der Werte hin und her, weil die Tabellenziffern nicht eingeschaltet sind.
- Eine technische Anwendung zeigt lange Nummern in der Textschrift, und Null und O sind nicht zu unterscheiden.
- Ein einzelnes Betragsfeld steht rechtsbündig zwischen linksbündigen Textfeldern.

### Richtig / falsch

```
        RICHTIG                             FALSCH

  Kostenstelle    Betrag            Kostenstelle    Betrag
  Vertrieb      1.240,00            Vertrieb        1.240,00
  Marketing        98,50            Marketing       98,50
  IT           12.005,20            IT              12.005,20

  Größenordnung sofort sichtbar     alles gleich lang
```

### Grenzen

Zahlen, die keine Größe sind, folgen ihrem Inhalt: Kundennummern, Postleitzahlen, Jahreszahlen, Telefonnummern. Sie werden nicht verglichen, sondern gelesen, und stehen deshalb linksbündig wie Text.

Ein einzelnes Zahlenfeld in einem Formular ist keine Spalte. Niemand vergleicht es mit etwas, man füllt es nur aus. Es steht deshalb linksbündig wie die Felder darüber und darunter, die Einheit steht im Feld am Ende. Rechtsbündig wird ein Feld erst, wenn mehrere Zahlenfelder untereinander eine Spalte bilden, etwa in einem Planungsraster.

### Verwandt

- Betone mit einem Mittel, nicht mit zweien

## Icons sind auf die Schrift abgestimmt

Typografie · https://standby.design/docs/rules/typografie-icons-sind-auf-die-schrift-abgestimmt

**Geltung:** universal · web, react-native

> **Regel**
> Behandle ein Icon wie ein Schriftzeichen, nicht wie ein Bild in einem Kasten. Größe aus der Typo-Skala, Strichstärke passend zum Schriftgewicht daneben, Abstand zum Text optisch ausgeglichen, und es wächst mit, wenn der Nutzer die Schrift vergrößert.

### Warum

Ein Icon in einer Beschriftung wird als Teil derselben Zeile gelesen, in einem Zug mit dem Wort daneben. Was für den Buchstaben gilt, gilt deshalb auch für das Icon.

Der Punkt, an dem fast alle Systeme scheitern, ist der Abstand. Ein Icon aus drei senkrechten Punkten lässt an seiner rechten Kante Luft, ein gefülltes Quadrat nicht. Bei gleichem gemessenem Abstand wirkt das erste weiter vom Wort entfernt.

```
        Beide Abstände sind gemessen gleich groß.

        ⋮  Optionen                ■  Optionen
          ^^^                        ^^^
        wirkt zu weit              wirkt richtig
```

**Der Ausgleich gehört ins Icon, nicht in die Zeile.** Jedes Icon bringt seinen eigenen Seitenabstand mit, so wie jede Glyphe ihre Vor- und Nachbreite hat. Ein einziger `gap` für alle Icons löst ein optisches Problem mit einer Konstante.

Dasselbe gilt für Gewicht und Größe: ein Icon neben halbfettem Text soll halbfett wirken, seine Größe kommt aus der Typo-Skala, und bei vergrößerter Systemschrift wächst es mit.

### Zwei Varianten

Beide haben gute Gründe. Die Regel entscheidet den Weg nicht, sie sagt, was am Ende stimmen muss.

**Variante 1 — Icons als Schriftzeichen.** Vorbild SF Symbols. Der Vorteil liegt nicht in der Sorgfalt der Gestalter, sondern im Format: **der optische Ausgleich ist nicht optional.** Man kann keine Glyphe zeichnen, ohne ihre Seitenbreiten festzulegen. Grundlinie, Gewichtsstufen und das Mitwachsen kommen aus dem Format, nicht aus Disziplin.

Der Preis ist der fehlende Rückfall. Ist die Schrift nicht da, ist nichts da, denn kein Ersatzzeichen bedeutet irgendetwas. Bei Apple fällt das nicht auf, weil die Schrift zum System gehört. Eine frei ausgelieferte Anwendung hat diese Garantie nicht. Dazu: nur eine Farbe in einfachen Formaten, Vorlesen als Zeichen, unsauberes Rendern in kleinen Graden. Und SF Symbols ist auf Apple-Plattformen beschränkt.

**Variante 2 — Icons als SVG-Set.** Der Vorteil ist Sicherheit: entweder da oder nicht, kein Zwischenzustand mit falschen Zeichen. Mehrfarbig möglich, überall lauffähig.

Der Preis ist, dass alles Freiwillige auch freiwillig bleibt. Wer diesen Weg geht, muss die Arbeit bewusst leisten: Seitenabstand je Icon statt ein `gap` für alle, Strichstärken je Gewichtsstufe, Größen an der Typo-Skala, Abstände in `em`.

### Einschätzung

**Gestalterisch ist Variante 1 überlegen**, weil sie erzwingt, was die Regel verlangt, und zwar für jedes einzelne Icon.

**Variante 2 ist die sichere Wahl und eine Übergangslösung.** Sie ist heute für die meisten Projekte richtig, weil es außerhalb von Apple kaum Icon-Schriften gibt, die das Handwerk wirklich machen.

Icons setzen sich langfristig als Schrift durch. Wer heute Variante 2 fährt, baut sie deshalb so, dass der Wechsel möglich bleibt: Größen an der Typo-Skala führen, Abstände je Icon pflegen. Dann ist der Umstieg ein Austausch der Quelle und kein Umbau der Oberfläche.

### Woran Du den Verstoß erkennst

- **Punkte-Test:** ein Icon mit lockerer und eines mit geschlossener Kante vor demselben Wort. Wirken die Abstände verschieden, gleicht das Set nicht aus.
- **Rundungs-Test:** ein rundes neben einem eckigen Icon. Wirkt das runde kleiner, wurde nur skaliert. Ein Kreis muss über das Quadrat hinauslaufen, so wie ein O über die x-Höhe.
- Der Abstand zum Text ist ein fester Pixelwert, gleich für alle Icons.
- Icon-Größen stehen als feste Pixelwerte in der Ansicht.
- Ein Icon neben fettem Text hat dieselbe Strichstärke wie eines neben normalem.
- Mehr als ein Icon-Paket im Projekt, oder ein einzelnes SVG, weil das passende im Set fehlte. Verschiedene Familien haben verschiedene Strichstärken und optische Größen, und das fällt auf, weil Icons fast immer in Reihen stehen.

### Grenzen

Ein Icon-only-Bedienelement ist kein Schriftzeichen, sondern eine Trefferfläche. Es braucht die Box auf der Höhe seiner Zeile, siehe Die Höhe gehört der Zeile, nicht dem Element. Die Regel gilt für Icons neben Text.

Marken-Logos, Zahlungsanbieter-Zeichen und Länderflaggen sind keine Icons in diesem Sinne.

### Offen

Ein eigenes Icon-Set als variable Schrift wäre außerhalb von Apple der einzige Weg zu Variante 1. Eigenes Vorhaben, kein Nebenbei-Schritt. Zu klären wäre vor allem der Rückfall, wenn die Schrift nicht lädt.

### Verwandt

- Betone mit einem Mittel, nicht mit zweien
- Werte kommen aus Tokens, nie aus der Hand
- Die Höhe gehört der Zeile, nicht dem Element

## Fließtext hat eine Höchstbreite

Typografie · https://standby.design/docs/rules/typografie-fliesstext-hat-eine-hoechstbreite

**Geltung:** universal · web, react-native · **Korridor:** 45-80 Zeichen · **Vorgabe:** 65ch

> **Regel**
> Begrenze die Breite von Fließtext mit genau einem Token in Zeichen.

### Warum

Bei sehr langen Zeilen findet das Auge den Anfang der nächsten Zeile nicht. Auf breiten Bildschirmen läuft Text sonst über 200 Zeichen.

### Woran Du den Verstoß erkennst

- Absatz ohne `max-width`.
- Breite in `px` statt `ch`.
- Bei 1920 Pixeln läuft ein Hilfetext über die ganze Breite.

### Hart und weich

Hart: es gibt eine Höchstbreite, als Token, höchstens 80 Zeichen. Weich: der Wert im Korridor 45 bis 80ch. Vorgabe 65ch.

### Grenzen

Tabellen, Code, einzeilige Beschriftungen.

### Quelle

WCAG 1.4.8 Visual Presentation (AAA, „width is no more than 80 characters"). Vercel › Layout („Responsive coverage … ultra-wide").

### Verwandt

- Jeder Textbehälter hält jede Textmenge aus
- Weniger Kanten, ruhigere Ansicht

## Werte kommen aus Tokens, nie aus der Hand

Farbe · https://standby.design/docs/rules/farbe-werte-kommen-aus-tokens-nie-aus-der-hand

**Geltung:** universal · web, react-native

> **Regel**
> Nimm jeden Gestaltungswert aus dem Token-System: Farben, Abstände, Radien, Schatten, Schriftgrößen, Icon-Größen und Strichstärken. Baue Token-Werte niemals von Hand nach.

### Warum

Ein von Hand gesetzter Wert ist eine stille Abzweigung. Er ändert sich nicht mit, wenn das System sich ändert, und er lässt sich nicht finden, weil niemand weiß, dass es ihn gibt. Nach einem halben Jahr stehen im Repo drei Grautöne, die alle „das Grau der Kante" sein wollen, und keiner davon ist es.

Bei Farben kommt der zweite Modus dazu. Ein Hex-Wert kennt nur eine Erscheinung. Der Nutzer, der auf Hell umschaltet, bekommt ihn unverändert, und die Ansicht bricht an genau dieser Stelle.

Deshalb ist der Token-Export der Ausgangspunkt und nicht eine Annäherung daran. Wer feinjustieren will, justiert im Generator und exportiert neu.

### Woran Du den Verstoß erkennst

- Hex-Werte oder `rgba`-Literale in Ansichten, Komponenten oder eingegrenztem CSS.
- Schriftgrößen als `font-size: 32px` oder `1.75rem` statt aus der Skala.
- Icon-Größen als feste Pixelwerte.
- `text-white` auf einer gefüllten Fläche statt der zugehörigen Gegenfarbe.
- Verläufe und Schleier aus festen `rgba`-Werten statt aus einer Mischung mit einer Token-Farbe.

### Wo die Grenze verläuft

Erlaubt sind feste Werte in diesen Fällen:

| Bereich | Warum |
|---|---|
| Marketing- und Landing-Seiten mit eigener Haut | Nicht Teil des Anwendungs-Token-Systems |
| Canvas-Partikel, Konfetti, reine Illustration | Dekorativ, kein Bedien-Element |
| Farben in Backend- oder Typ-Metadaten | Steuern keine Oberfläche |
| Notfall-Werte in der Chart-Brücke | Nur für den Fall, dass CSS noch nicht geladen ist |

Alles andere geht über Tokens.

### Zwei Sorten Token, und eine dritte

Neben den rohen Werten (Primitives) und der Bedeutung (Semantics) gibt es eine dritte Sorte: **Material**. Sie sagt, woraus eine Fläche gemacht ist — gebürstetes Metall, Licht von hinten, Körnung.

Die Erkennungsregel: Lässt sich das Token mit „das heißt Gefahr, Erfolg, inaktiv" beschreiben, ist es semantisch. Lässt es sich nur mit „so sieht die Oberfläche aus" beschreiben, ist es Material.

Material trägt **keinen** Zustand. Ein Panel ist in jedem Zustand aus demselben Material, nur das Licht dahinter wechselt die Farbe. Und Material wird nicht nach Bauteil benannt: sobald ein zweites Bauteil dasselbe Material nutzt, lügt der Name.

**Auch Durchsichtigkeit ist Material.** Ein System darf mit Glas, Schleier und Weichzeichner arbeiten, das ist eine gestalterische Entscheidung wie jede andere. Sie wird dann aber als Material benannt und für jede Erscheinung definiert, in der sie vorkommt. Was nicht geht, ist die beiläufige Variante: eine Deckkraft, die an einer einzelnen Stelle gesetzt wird, weil die Fläche dort gerade zu hell war. Das ist keine Materialentscheidung, sondern eine Korrektur im Vorbeigehen, und sie hinterlässt eine Stufe, die im System keinen Namen hat.

Wer durchsichtig baut, übernimmt zusätzlich eine Pflicht: der Kontrast von Text auf so einer Fläche hängt davon ab, was zufällig darunter liegt. Er muss trotzdem in jedem Fall reichen, üblicherweise über eine gedeckte Grundschicht unter dem Glas.

### Grenzen

Ein Wert, den es im System noch nicht gibt, wird nicht heimlich in der Ansicht gesetzt, sondern als neue Stufe in die Skala aufgenommen. Der Ausgleichswert 14 aus Senkrechtes Padding wird optisch ausgeglichen ist genau so ein Fall.

### Verwandt

- Keine Deckkraft-Modifier auf semantischen Farben
- Icons sind auf die Schrift abgestimmt

## Hell und Dunkel sind zwei Entwürfe, keine Umkehrung

Farbe · https://standby.design/docs/rules/farbe-hell-und-dunkel-sind-zwei-entwuerfe-keine-umkehrung

**Geltung:** universal · web, react-native

> **Regel**
> Bietet ein Produkt beide Erscheinungen an, ist jeder Wert in beiden festgelegt und in beiden geprüft. Keine der beiden wird aus der anderen abgeleitet. Welche gilt, entscheidet der Nutzer.

### Warum

Die Wahl gehört dem Nutzer. Manche sehen auf hellem Grund besser, manche auf dunklem, manche wechseln mit der Tageszeit, und für manche ist es eine Frage der Verträglichkeit und nicht des Geschmacks. Ein Produkt, das eine Erscheinung erzwingt, entscheidet über den Körper von jemandem, den es nicht kennt.

Und die zweite Erscheinung ist keine Rechenaufgabe. Auf dunklem Grund verhält sich Wahrnehmung anders, in mindestens drei Punkten:

**Helle Schrift auf dunklem Grund leuchtet aus.** Die Buchstaben wirken fetter und die Innenräume enger als dieselbe Schrift dunkel auf hell. Ein Schnitt, der hell gut sitzt, wirkt dunkel oft zu schwer.

**Gesättigte Farben flimmern auf Dunkel.** Ein kräftiges Blau, das auf Weiß ruhig liegt, vibriert auf Schwarz und ist anstrengend zu lesen. Auf Dunkel gehören dieselben Farben heller und weniger gesättigt.

**Schatten brauchen auf Dunkel eine andere Gewichtung.** Sie funktionieren dort, aber der Unterschied zwischen einer dunklen Fläche und einem dunklen Schatten ist klein. Derselbe Schatten, der hell deutlich trägt, ist dunkel praktisch unsichtbar. Auf Dunkel muss er also deutlich stärker ausfallen, und meist kommt die Helligkeit der Fläche als zweites Mittel dazu: was höher liegt, ist zusätzlich heller. Schatten-Token brauchen deshalb eigene Werte je Erscheinung, genau wie Farben.

Dazu kommt das Nüchterne: ein Kontrastverhältnis, das hell besteht, kann dunkel durchfallen und umgekehrt. Prüfen muss man beide, einzeln.

### Kein reines Schwarz gegen reines Weiß

Weiße Schrift auf schwarzem Grund ist der höchstmögliche Kontrast, und genau deshalb unangenehm: die Schrift blüht aus, die Augen ermüden schnell, und Menschen mit Astigmatismus lesen es kaum. Ein sehr dunkles Grau als Grund und ein leicht abgesenktes Weiß als Schrift lesen sich deutlich ruhiger.

Mehr Kontrast ist ab einem Punkt nicht mehr besser. Der Mindestwert ist eine Untergrenze, kein Ziel.

### Wer entscheidet

Voreingestellt gilt, was der Nutzer im Betriebssystem eingestellt hat. Das ist bereits seine Antwort auf die Frage, man muss sie nicht noch einmal stellen.

Bietet das Produkt zusätzlich einen eigenen Schalter, überschreibt dieser die Systemeinstellung und bleibt erhalten. Er hat drei Stellungen, nicht zwei: hell, dunkel, dem System folgen.

### Woran Du den Verstoß erkennst

- Die dunkle Erscheinung entsteht durch eine Umkehrung oder einen Filter über die ganze Oberfläche.
- Eine Farbe ist einmal festgelegt und wird in beiden Erscheinungen benutzt.
- Die Schatten-Token haben nur einen Wert, und im Dunklen ist die Tiefe deshalb verschwunden.
- Ein Text ist in einer Erscheinung gut lesbar und in der anderen grenzwertig.
- Die Seite steht auf reinem Schwarz, die Schrift auf reinem Weiß.
- Es gibt nur Screenshots aus einer Erscheinung. Dann wurde auch nur eine geprüft.

### Grenzen

Ein Produkt darf sich bewusst auf eine Erscheinung festlegen. Dann gilt die Regel nicht — aber es sollte eine Entscheidung sein, die jemand getroffen hat, und kein Zustand, der entstanden ist, weil niemand an die zweite gedacht hat.

Marketing- und Titelseiten mit eigener Haut können bei einer Erscheinung bleiben, auch wenn die Anwendung dahinter beide kann.

### Verwandt

- Werte kommen aus Tokens, nie aus der Hand
- Die Ebene folgt der Rolle, nicht der Schachtelung
- Rot ist nicht ein Rot

## Kontrast hat eine Untergrenze

Farbe · https://standby.design/docs/rules/farbe-kontrast-hat-eine-untergrenze

**Geltung:** universal · web, react-native

> **Regel**
> Halte für Text 4,5:1 gegen den Untergrund ein, für große Schrift 3:1, für die Grenze eines Bedienelements und jedes Zustandszeichen ebenfalls 3:1, in jedem Zustand und in beiden Modi. Verlangt das System erhöhten Kontrast oder erzwungene Farben, bleiben Grenzen, Fokus und Zustände sichtbar.

### Warum

Darunter kann ein Teil der Nutzer den Text nicht lesen oder das Feld nicht finden, egal wie stimmig es aussieht.

Die Untergrenze gilt in jedem Zustand, nicht nur in Ruhe: auch bei Hover, Gedrückt und Fokus, und in beiden Modi. Wird ein dunkler Knopf im Hellen beim Hover heller (siehe Kurze Zustände verschieben, dauerhafte wechseln die Palette), darf seine Beschriftung trotzdem nicht unter 4,5:1 fallen.

Wer schlecht sieht, stellt das System auf hohen Kontrast. Dann verschwinden Hintergrundfarben und Schatten, und was nur über sie gebaut ist, ist weg.

### Hart und weich

Hart: die WCAG-AA-Werte als Untergrenze. Weich: das Messverfahren. APCA darf zusätzlich prüfen (Vercel empfiehlt es), ersetzt die Untergrenze aber nicht.

Hart: alles Nötige bleibt sichtbar. Weich: wie stark die Kontrastvariante abweicht.

### Woran Du den Verstoß erkennst

- Platzhalter- oder Hilfetext unter 4,5:1.
- Feldrahmen als einzige Grenze eines Feldes unter 3:1.
- Fokusring oder Häkchen unter 3:1.
- Geprüft nur im hellen Modus.
- Kontrast nur im Ruhezustand geprüft.
- Weiße Schrift auf dem helleren Hover-Zustand unter 4,5:1.
- Fokusring nur als `box-shadow`, ohne `outline` als Rückfall.
- Feldgrenze nur über eine andere Hintergrundfarbe.
- Icon als CSS-Hintergrundbild.
- Kein `@media (prefers-contrast: more)` oder `(forced-colors: active)` im Projekt.

### Grenzen

Gesperrte Elemente, Logos, reine Schmuckflächen.

Native Apps ohne Web-Ansicht nutzen die Kontrastvarianten der Plattform.

### Quelle

WCAG 1.4.3 Contrast (Minimum), 1.4.11 Non-text Contrast. Vercel › Design („Meet contrast"). Apple HIG › Accessibility › Color and effects („provides a higher contrast color scheme when the system setting Increase Contrast is turned on").

### Verwandt

- Rot ist nicht ein Rot
- Erst Abstand, dann Fläche, dann Linie
- Kurze Zustände verschieben, dauerhafte wechseln die Palette
- Was der Browser mitbringt, wird gestaltet oder ersetzt
- Der Fokus ist sichtbar und hat immer einen Ort
- Farbe trägt nie allein

## Farbe trägt nie allein

Farbe · https://standby.design/docs/rules/farbe-farbe-traegt-nie-allein

**Geltung:** universal · web, react-native

> **Regel**
> Zeige jeden dauerhaften Zustand und jede Datenreihe neben der Farbe mit einem zweiten Merkmal. Bei Zuständen ist es Position, Strich, Balken, Punkt oder Unterstreichung, und es gehört zum Element. Bei Datenreihen ist es eine direkte Beschriftung, die Form der Marker oder die Strichart.

### Warum

Rund jeder zwölfte Mann sieht Rot und Grün nicht auseinander. Für ihn ist ein aktiver Tab, der sich nur durch die Textfarbe auszeichnet, kein aktiver Tab, sondern einer von fünf gleichen. Dasselbe gilt bei starkem Sonnenlicht, auf schlecht kalibrierten Bildschirmen und bei jedem, der die Ansicht nur kurz überfliegt.

Das zweite Zeichen kostet nichts. Es ist ohnehin da, sobald das Element sauber gebaut ist: der Knopf des Switch steht rechts, unter dem Tab liegt ein Strich, vor dem Chip sitzt ein Punkt. Der Fehler entsteht nur, wenn ein Zustand nachträglich „schnell über die Farbe" gelöst wird.

Für einen von zwölf Männern sehen Rot und Grün gleich aus. Eine Legende nur aus Farbfeldern ist für ihn leer.

### Die Zeichen je Element

| Element | Zweites Zeichen |
|---|---|
| Switch | Position des Knopfs |
| Tab | Strich darunter |
| Chip | Punkt vorn |
| Navigations-Zeile | Balken links |
| Fließtext-Link | verdickte Unterstreichung |
| Button, Icon-Button | — (kein dauerhafter Zustand) |
| Eingabefeld | — (der Zustand steht in Rand und Meldung) |
| Badge | — (nicht bedienbar) |

Wo ein Strich steht, hat das Element einen dauerhaften Zustand und braucht das Zeichen. Wo keiner steht, hat es keinen.

### Hart und weich

Hart: ein zweites Merkmal. Weich: welches. Vorgabe direkte Beschriftung am Ende der Linie.

### Woran Du den Verstoß erkennst

- Der aktive Tab unterscheidet sich nur in der Textfarbe.
- Eine ausgewählte Kachel ist nur farblich hervorgehoben.
- In Graustufen ist nicht mehr erkennbar, welches Element an ist. Das ist der schnellste Test.
- Legende nur aus Farbkästchen.
- Zwei Linien, die sich nur im Farbton unterscheiden.
- Kreisdiagramm ohne Beschriftung an den Stücken.
- Benachbarte Reihen unter 3:1 zueinander.

### Grenzen

Für kurzzeitige Zustände wie Hover gilt die Regel nicht. Hover ist eine Rückmeldung auf eine Handlung, die gerade passiert, und der Nutzer weiß bereits, wo er ist.

Diagramme mit genau einer Reihe.

### Quelle

WCAG 1.4.1 Use of Color, 1.4.11 Non-text Contrast. Vercel › Design („Accessible charts").

### Verwandt

- Kurze Zustände verschieben, dauerhafte wechseln die Palette
- Rot ist nicht ein Rot
- Kontrast hat eine Untergrenze
- Eine Bedeutung, überall gleich

## Utility-Klassen statt Inline-Styles

Stack · https://standby.design/docs/rules/stack-utility-klassen-statt-inline-styles

**Geltung:** stack · web, react-native

> **Regel**
> Setze jede Gestaltung über Utility-Klassen. Keine Inline-Styles, keine Style-Objekte.

### Warum

Ein Inline-Style ist der bequemste Weg an allen Regeln vorbei. Er kennt keine Tokens, keine Breakpoints, keinen hellen Modus und keine Zustände. Er gewinnt außerdem gegen jede Klasse, sodass eine spätere Korrektur über das System nicht mehr greift — die Stelle ist tot für jede Änderung, die nicht genau dort ansetzt.

Utility-Klassen sind dagegen durchsuchbar. Man findet alle Stellen mit einem bestimmten Abstand, kann sie zählen und in einem Zug umstellen. Das ist der Unterschied zwischen einem System und einer Sammlung von Einzelfällen.

### Woran Du den Verstoß erkennst

- `style={{ … }}` in einer Komponente.
- `StyleSheet.create` neben `className` in derselben Datei.
- Farbwerte, Abstände oder Schriftgrößen direkt im Markup.

### Richtig / falsch

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

### Grenzen

Werte, die zur Laufzeit berechnet werden — die Breite eines Balkens aus einem Prozentwert, eine Position aus einer Messung —, gehören in einen Style. Sie sind Daten, keine Gestaltung. Alles andere daneben bleibt in Klassen.

### Verwandt

- Werte kommen aus Tokens, nie aus der Hand
- Abstand über gap, nicht über Margins am Kind
- Verhalten und Aussehen werden nicht in der Ansicht nachgebaut

## Abstand über gap, nicht über Margins am Kind

Stack · https://standby.design/docs/rules/stack-abstand-ueber-gap-nicht-ueber-margins-am-kind

**Geltung:** stack · web, react-native

> **Regel**
> Setze Abstände zwischen Geschwistern über `flex` und `gap` am Container. Keine Margins am Kind, kein `space-y`.

### Warum

Ein Abstand ist eine Eigenschaft der Beziehung zwischen zwei Elementen, nicht eines einzelnen. Trägt das Kind den Abstand, bringt es ihn überall mit hin — auch dorthin, wo er nicht hingehört. Und das letzte Kind bringt einen Abstand nach unten mit, den niemand wollte, also wird er mit `last:mb-0` wieder abgeräumt. Damit steht die Regel an zwei Stellen.

`gap` löst das an einer Stelle: der Container sagt, wie weit seine Kinder auseinanderstehen. Kein letztes Kind, kein Zurücksetzen, keine zusammenfallenden Margins.

Die Hilfsklasse `space-y` löst dasselbe Problem, aber über Margins an allen Kindern außer dem ersten. Sie bricht, sobald ein Kind bedingt gerendert wird oder ein Fragment dazwischenliegt, und sie funktioniert in React Native nicht.

### Woran Du den Verstoß erkennst

- `mb-*` oder `mt-*` an Kindern einer Liste.
- `last:mb-0`, `first:mt-0` oder `:not(:last-child)` als Korrektur.
- `space-y-*` an einem Container.
- Ein Abstand ist doppelt so groß wie gewollt, weil zwei Margins aufeinandertreffen.

### Richtig / falsch

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

### Grenzen

Der Abstand einer Gruppe zu ihrem Umfeld ist kein Abstand zwischen Geschwistern. Er gehört als Padding in den Abschnitt, siehe Die Karte hat kein Padding.

### Verwandt

- Erst Abstand, dann Fläche, dann Linie
- Die Karte hat kein Padding
- Utility-Klassen statt Inline-Styles

## Keine Deckkraft-Modifier auf semantischen Farben

Stack · https://standby.design/docs/rules/stack-keine-deckkraft-modifier-auf-semantischen-farben

**Geltung:** stack · web, react-native

> **Regel**
> Schreibe nie `bg-primary/10`, `text-destructive/60` oder Ähnliches. Für Abstufungen und Zustände gibt es benannte Stufen, siehe Kurze Zustände verschieben, dauerhafte wechseln die Palette.

### Warum

Eine semantische Farbe steht für eine Bedeutung. Ein Zehntel davon steht für gar nichts — es ist eine neue Farbe ohne Namen, ohne Definition und ohne Eintrag im System. Sie lässt sich nicht wiederverwenden, weil niemand weiß, dass es sie gibt, und sie taucht beim nächsten Mal als `/12` wieder auf.

Es geht dabei nicht um Durchsichtigkeit an sich. Ein System darf mit Glas und Schleier arbeiten, wenn das seine Handschrift ist. Es geht um die beiläufige Variante: eine Deckkraft, die an einer einzelnen Stelle gesetzt wird, weil es dort gerade passte. Der Unterschied ist, ob jemand eine Materialentscheidung getroffen hat oder eine Korrektur im Vorbeigehen.

Für den häufigsten Anlass — eine gedämpfte Variante für Chips und Badges — gibt es die gedämpften Stufen der Zustandsfarben. Für den zweithäufigsten — Hover und Gedrückt — gibt es benannte Zustandsstufen: eine Stufe heller für Hover, eine dunkler für Gedrückt, in beiden Erscheinungen gleich. Wo ein System sie nicht hat, tut es eine Helligkeitsänderung in dieselbe Richtung. Warum heller und nicht dunkler: Kurze Zustände verschieben, dauerhafte wechseln die Palette.

### Woran Du den Verstoß erkennst

- Ein Schrägstrich hinter einer semantischen Farbklasse.
- Ein Badge aus `bg-danger/10 text-danger`.
- Hover ist als `hover:bg-primary/90` gebaut.

### Richtig / falsch

```
richtig    bg-muted · text-muted-foreground
           die gedämpfte Stufe plus die zugehörige Schriftfarbe
           hover:bg-primary-hover · active:bg-primary-pressed
           ohne Zustandsstufen: hover:brightness-110 · active:brightness-95

falsch     bg-primary/10
           text-destructive/60
           hover:bg-primary/90
           hover:brightness-90   (Hover dunkler statt heller)
```

### Grenzen

Deckkraft auf einer **Ebene** ist etwas anderes als Deckkraft auf einer Farbe: ein ausgeblendetes Overlay, ein Bild beim Laden, ein Element im Übergang. Dort ist Deckkraft die richtige Eigenschaft, weil sie das ganze Element betrifft und nicht eine Farbe erfindet.

### Verwandt

- Rot ist nicht ein Rot
- Werte kommen aus Tokens, nie aus der Hand

## Was der Browser mitbringt, wird gestaltet oder ersetzt

Stack · https://standby.design/docs/rules/stack-was-der-browser-mitbringt-wird-gestaltet-oder-ersetzt

**Geltung:** stack · web

> **Regel**
> Lass kein Bedienelement im Aussehen des Browsers stehen. Sag dem Browser per `color-scheme` den aktiven Modus. Was CSS erreicht, gestaltest Du. Was CSS nicht erreicht, ersetzt Du durch ein eigenes Element.

### Warum

Native Teile bringen die Gestaltung des Betriebssystems mit: eigene Icons, eigene Strichstärken, eigene Farben. Neben den eigenen Elementen wirken sie wie aus einem fremden Set. Das ist derselbe Bruch wie zwei Icon-Pakete in einem Projekt.

Dazu ändern sie sich mit Browser und Systemsprache. Ein natives Datumsfeld zeigt in einem englisch eingestellten Browser mm/dd/yyyy, auch wenn die Anwendung Deutsch spricht. Viele lassen sich im Dunkelmodus nicht einfärben.

Ohne die Angabe zeichnet der Browser Scrollbalken, Auswahllisten und Autofill hell, auch auf einer dunklen Seite.

### Was wohin gehört

| Element | Weg | Ergebnis |
|---|---|---|
| Scrollbalken | gestalten | Breite und Farbe aus Tokens, beide Modi geprüft |
| Markierter Text | gestalten | Markenfarbe mit geprüftem Kontrast |
| Checkbox, Radio, Regler | gestalten | Akzentfarbe aus der Marke |
| Autofill-Hintergrund | gestalten | Feld behält seine Fläche |
| Kreuz im Suchfeld | ausblenden | eigener Leeren-Knopf, wenn er gebraucht wird |
| Pfeile im Zahlenfeld | ausblenden | Zahl wird getippt. Schritte, wenn nötig, als eigene Knöpfe |
| Datumsfeld | ersetzen | eigenes Feld im Format der Oberflächensprache, eigener Kalender |
| Aufklappliste einer Auswahl | ersetzen | eigene Liste mit den Rollen des Systems |

### Hart und weich

Hart. Scope `stack`, gilt für `web`.

| | Status |
|---|---|
| Kein Bedienelement zeigt das Aussehen des Browsers | hart |
| Formate folgen der Sprache der Oberfläche, nicht der des Browsers. Das gilt für jede angezeigte Zahl, jedes Datum und jeden Betrag, nicht nur im Feld. Formatiert wird über die Sprachfunktionen der Plattform (`Intl`) | hart |
| Ob gestaltet oder ersetzt wird | weich, Vorgabe die Tabelle oben |

### Woran Du den Verstoß erkennst

- Ein Datums-, Monats- oder Zahlenfeld steht ohne eigenes Element darum in der Ansicht.
- Im globalen CSS fehlt eine Regel für markierten Text.
- Der Scrollbalken ist im Dunkelmodus hellgrau und breit.
- Das Datumsformat wechselt, wenn Du die Sprache des Browsers umstellst.
- Ein Betrag wird von Hand zusammengesetzt, etwa `"€ " + n.toFixed(2)`, oder ein Datum steht als `toISOString()` in der Anzeige.
- Dunkles Thema ohne `color-scheme: dark`.
- Natives `select` ohne eigene Hintergrund- und Textfarbe.

### Grenzen

Auf Touch-Geräten bedient sich die Auswahl des Systems oft besser als eine eigene Liste. Dort darf das System-Rad bleiben, wenn der Auslöser gestaltet ist.

Dateiauswahl und Druckdialog gehören dem Betriebssystem und bleiben, wie sie sind.

Native Apps ohne Web-Ansicht. Dort regelt es die Plattform.

### Quelle

Vercel › Dark Mode & Theming („`color-scheme: dark` on `<html>`", „Native `<select>`: explicit `background-color` and `color`").

### Verwandt

- Icons sind auf die Schrift abgestimmt
- Hell und Dunkel sind zwei Entwürfe, keine Umkehrung
- Verhalten und Aussehen bleiben getrennt
- Kontrast hat eine Untergrenze
