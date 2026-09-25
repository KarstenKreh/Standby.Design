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

Nur das erste Kind bekommt oben Padding. Die weiteren nicht, weil der untere Abstand des Vorgängers den Abstand schon liefert. Sobald Trennlinien im Spiel sind, bekommt jeder Abschnitt oben und unten Padding, sonst klebt der Inhalt an der Linie.

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

Die Regel sagt, wie eine Trennlinie gebaut wird, nicht wann es eine braucht. Das steht in Nähe gruppiert, nicht die Linie.

Ein Primitive, das die Kante zeichnet, ist erlaubt, solange es die Unterkante des Abschnitts ist. Ein eigenes Kind zwischen zwei Abschnitten ist es nicht. Der Name der Hilfsklasse ändert das nicht.

### Verwandt

- Nähe gruppiert, nicht die Linie
- Die Karte hat kein Padding
- Eine Linie trennt, sie schmückt nicht

## Nähe gruppiert, nicht die Linie

Layout · https://standby.design/docs/rules/layout-naehe-gruppiert-nicht-die-linie

**Geltung:** universal · web, react-native

> **Regel**
> Gruppiere über Abstand. Elemente, die zusammengehören, stehen dichter beieinander als zu allem anderen. Setze eine Trennlinie erst dann, wenn die Abschnitte inhaltlich wirklich getrennt sind — etwa bei einer Liste gleichrangiger Positionen.

### Warum

Abstand ist die stärkste Gruppierung, die es gibt, und sie kostet nichts. Der Blick fasst zusammen, was dicht steht, noch bevor er liest. Eine Linie behauptet dasselbe noch einmal, fügt aber ein sichtbares Element hinzu. Bei Titel, Chart und Button trennt der Abstand schon deutlich genug, und jede zusätzliche Linie ist nur Rauschen.

Der praktische Test: Nimm die Linien testweise heraus. Ist die Gruppierung danach immer noch klar, waren sie überflüssig. Fällt der Aufbau auseinander, waren die Abstände zu gleichförmig — dann ist die Abstandsstaffelung das eigentliche Problem, nicht die fehlende Linie.

### Woran Du den Verstoß erkennst

- Zwischen jedem Abschnitt einer Karte sitzt eine Linie, unabhängig vom Inhalt.
- Alle Abstände in einer Ansicht sind gleich groß, und die Struktur entsteht nur aus Linien und Rahmen.
- Ein Formular trennt jedes einzelne Feld mit einer Linie, statt zusammengehörige Felder als Block zu setzen.

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

### Verwandt

- Der Divider ist die Unterkante einer Section
- Eine Linie trennt, sie schmückt nicht
- Die Karte hat kein Padding

## Weniger Kanten, ruhigere Ansicht

Layout · https://standby.design/docs/rules/layout-weniger-kanten-ruhigere-ansicht

**Geltung:** universal · web, react-native

> **Regel**
> Richte alles an möglichst wenigen gemeinsamen Kanten aus. Jede zusätzliche Linie, an der etwas beginnt, kostet den Blick einen Ankerpunkt. Und misch innerhalb eines Blocks nicht linksbündig mit zentriert.

### Warum

Der Blick sucht beim Lesen einer Ansicht nach Anhaltspunkten und findet sie an den Kanten: dort, wo mehrere Dinge gemeinsam beginnen. Zwei solche Linien liest man ohne Anstrengung. Bei sechs muss der Blick bei jedem Element neu ansetzen, und die Ansicht wirkt unruhig, ohne dass man sagen könnte woran es liegt. Man sieht die Kanten nicht, aber man spürt sie.

Deshalb ist das eines der wirksamsten Mittel überhaupt: es kostet nichts. Es ändert keine Farbe, keine Größe, keinen Inhalt. Es räumt nur die Anfänge zusammen.

Ausrichtung und Nähe sind dabei ein Paar. Nähe sagt, **was zusammengehört**, Ausrichtung sagt, **dass es zusammengehört**. Siehe Nähe gruppiert, nicht die Linie.

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

### Woran Du den Verstoß erkennst

- Beschriftung, Wert und Knopf beginnen an drei verschiedenen Stellen.
- Ein einzelnes Element ist zentriert, alles andere daneben linksbündig.
- Eingerückte Blöcke stehen an frei gewählten Stellen statt an einer gemeinsamen zweiten Kante.
- Ein Text ist zentriert und länger als zwei Zeilen.
- Zahlen und Text in einer Tabelle richten sich an derselben Kante aus, statt Zahlen rechts zu setzen (siehe Zahlenspalten stehen rechtsbündig).

### Grenzen

Zahlenspalten sind die gewollte Ausnahme: sie bekommen ihre eigene rechte Kante, weil dort die Vergleichbarkeit schwerer wiegt als eine Kante weniger.

Und eine zweite Kante für Einrückungen ist normal und richtig — Aufzählungen, verschachtelte Listen, Antworten in einem Verlauf. Die Regel sagt nicht „eine Kante", sie sagt „so wenige wie möglich, und jede mit Grund".

### Verwandt

- Nähe gruppiert, nicht die Linie
- Zahlenspalten stehen rechtsbündig
- Die Höhe gehört der Zeile, nicht dem Element

## Jede Ansicht bricht bei 320 Pixeln um

Layout · https://standby.design/docs/rules/layout-jede-ansicht-bricht-bei-320-pixeln-um

**Geltung:** universal · web

> **Regel**
> Bau jede Ansicht so, dass der Inhalt bei einer Breite von 320 CSS-Pixeln umbricht, ohne dass man waagerecht scrollen muss. Nichts wird abgeschnitten, nichts überlappt, nichts schiebt die Seite zur Seite. Halte das von Anfang an ein, statt es später nachzurüsten.

### Warum

Die 320 kommen nicht vom kleinsten Telefon. Sie kommen aus **WCAG 2.1, Erfolgskriterium 1.4.10 Reflow**, Stufe AA, und die Rechnung dahinter ist: 1280 Pixel bei 400 Prozent Vergrößerung ergeben ein Sichtfenster von 320 Pixeln.

Der Nutzer, um den es geht, sitzt also meistens gar nicht am Telefon. Er sitzt am großen Bildschirm und hat stark vergrößert, weil er sonst nichts lesen kann. Für ihn ist ein waagerechter Schieber kein Schönheitsfehler: er muss dann bei jeder einzelnen Zeile hin und her schieben, um sie zu Ende zu lesen. Das macht niemand lange mit.

Dass die Regel damit auch kleine Geräte abdeckt, ist ein Nebeneffekt und kein Grund. Der Grund altert nicht mit der nächsten Gerätegeneration.

Und sie von Anfang an einzuhalten ist billiger als nachzurüsten. Beim Nachrüsten stehen die Entscheidungen schon fest — die vierspaltige Kachelreihe, die Werkzeugleiste mit acht Elementen, die Tabelle mit zwölf Spalten —, und jede davon muss einzeln aufgebrochen werden. Wer früh bei 320 prüft, trifft diese Entscheidungen gar nicht erst.

### Was die Regel verlangt und was nicht

Verlangt ist **Benutzbarkeit**, nicht Schönheit. Es darf eng aussehen. Es darf gestapelt aussehen. Es darf nach Notlösung aussehen. Was nicht sein darf: abgeschnittener Inhalt, überlappende Elemente, ein Schieber unter der ganzen Seite, unerreichbare Bedienelemente.

### Woran Du den Verstoß erkennst

- Bei 320 Pixeln erscheint ein waagerechter Schieber unter der ganzen Seite statt unter dem breiten Element.
- Eine Filter- oder Buttonzeile schiebt sich aus dem Bild, weil der Umbruch fehlt.
- Ein Overlay steht bündig an den Bildschirmkanten oder ist höher als das Fenster und nicht scrollbar.
- Die Ansicht rechnet mit `vh` und springt beim Ein- und Ausblenden der Browserleiste.
- Beim Vergrößern auf 400 Prozent am Desktop bricht die Ansicht auseinander, obwohl sie am Telefon in Ordnung aussieht.

### Die Baseline

| Bereich | Verhalten unter der Grenze |
|---|---|
| Seitenleiste | Ab der Desktop-Grenze feste Spalte, darunter ausfahrbares Panel mit Auslöser im Kopfbereich. Das Panel zeigt immer volle Beschriftungen, der eingeklappte Desktop-Zustand greift dort nicht |
| Tabellen | Eigener Wrapper mit waagerechtem Scrollen, Spalten schrumpfen nicht |
| Overlays | Container mit Außenabstand, Panel volle Breite bis zu einer Höchstbreite, Höhe begrenzt und innen scrollbar |
| Raster | Stapeln nach unten. Kachel- und Kennzahlraster dürfen zweispaltig bleiben |
| Filter- und Buttonzeilen | Umbrechen, Reiterleisten alternativ waagerecht scrollen |
| Höhen | Dynamische Viewport-Einheiten statt fester, wo die Browserleiste hineinspielt |

### Grenzen

WCAG nimmt ausdrücklich aus, was zwingend zwei Dimensionen braucht: Tabellen, Landkarten, Zeitraster, Notensatz, Diagramme. Diese Inhalte dürfen scrollen. Der Schieber gehört dann aber an den Inhalt und nicht unter die Anwendung: der Nutzer soll die Tabelle schieben, nicht die Seite mitsamt Kopfbereich und Seitenleiste.

Ein Werkzeug, das ohne Fläche sinnlos ist, darf schmal eine ehrliche Ersatzansicht zeigen. Der Hinweis „Diese Ansicht braucht ein größeres Fenster" ist erlaubt, das stumme Abschneiden nicht.

### Verwandt

- Die Höhe gehört der Zeile, nicht dem Element
- Ein Pop-up unterbricht, es führt nicht

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

### Woran Du den Verstoß erkennst

- Im Pop-up stehen mehrere Eingabefelder oder ein „Speichern" für mehrere Werte.
- Aus einem Pop-up heraus öffnet sich ein zweites.
- Es gibt eine Warnung „Änderungen verwerfen?" beim Schließen eines Pop-ups.
- Das Pop-up hat Reiter, Schritte oder einen eigenen Scrollbereich.
- Der Zurück-Knopf des Geräts schließt etwas anderes als das, was der Nutzer erwartet.
- Der Zustand lässt sich nicht verlinken und kommt nach einem Neuladen nicht wieder.
- Das Pop-up hat eine Überschrift, die eigentlich ein Seitentitel ist.

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

- Fokus ist immer sichtbar
- Jede Ansicht bricht bei 320 Pixeln um
- Klickbares braucht eine Fläche

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

Nicht jede leere Fläche braucht Text. Eine Spalte in einer Tabelle, ein einzelnes Feld, ein Diagrammabschnitt ohne Wert — dort reicht ein Strich oder ein Zeichen für „kein Wert", siehe Dieselbe Zahl bedeutet überall dasselbe. Die Regel gilt für Bereiche, die als Ganzes leer sind.

### Verwandt

- Dieselbe Zahl bedeutet überall dasselbe
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

### Woran Du den Verstoß erkennst

- Der Inhalt trifft ein und schiebt die Seite nach unten.
- Ein Ladezeichen blitzt bei jedem Wechsel kurz auf.
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
- Übergänge haben genau einen Wert

## Ein Fehler steht dort, wo er entstanden ist

Fluss · https://standby.design/docs/rules/fluss-ein-fehler-steht-dort-wo-er-entstanden-ist

**Geltung:** universal · web, react-native

> **Regel**
> Zeige einen Fehler an der Stelle, die er betrifft — beim Feld das Feld, beim Bereich der Bereich. Sag, was zu tun ist, nicht was kaputt gegangen ist. Und lass die Eingaben des Nutzers stehen.

### Warum

Ein Fehler ist eine Anweisung, keine Meldung. Der Nutzer will nicht wissen, was das System nicht konnte, sondern was er jetzt macht. „Ungültiges Format" sagt ihm nichts. „Bitte im Format TT.MM.JJJJ eingeben" sagt ihm alles.

Deshalb muss er auch dort stehen, wo gehandelt wird. Steht der Fehler weit weg von dem Feld, das er betrifft, muss der Nutzer die Verbindung selbst herstellen — bei drei Fehlern in einem Formular ist das eine Suchaufgabe.

Und das Wichtigste, das am häufigsten verletzt wird: **die Eingaben bleiben.** Ein Fehler, der das Formular leert, bestraft den Nutzer für einen Tippfehler. Nach dem zweiten Mal macht er nicht weiter.

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

### Was in einer Meldung steht

- Was der Nutzer tun kann, in seiner Sprache.
- Kein Fehlercode, kein technischer Wortlaut, keine Meldung aus dem System durchgereicht.
- Keine Schuldzuweisung, weder an ihn noch an das System.
- Bei einem Fehler, der nicht in seiner Hand liegt: was gerade gilt und wann er es erneut versuchen kann.

### Woran Du den Verstoß erkennst

- Ein Eingabefehler erscheint als Pop-up.
- Alle Fehler eines Formulars stehen gesammelt oben statt bei den Feldern.
- Das Formular ist nach einem Fehler leer.
- Eine technische Meldung steht ungefiltert in der Oberfläche.
- Eine Kurzmeldung trägt eine Information, die der Nutzer später wieder braucht.
- Es gibt eine Bestätigungsfrage für etwas, das man auch rückgängig machen könnte.

### Grenzen

Fehler, die die ganze Anwendung betreffen — keine Verbindung, abgelaufene Anmeldung —, gehören an eine Stelle, die über allem liegt. Sie betreffen kein einzelnes Feld, und der Nutzer muss sie sehen, bevor er weitertippt.

### Verwandt

- Ein Pop-up unterbricht, es führt nicht
- Leer ist ein Zustand, keine Lücke
- Rot ist nicht ein Rot

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

- Eine Linie trennt, sie schmückt nicht
- Werte kommen aus Tokens, nie aus der Hand

## Eine Linie trennt, sie schmückt nicht

Fläche · https://standby.design/docs/rules/flaeche-eine-linie-trennt-sie-schmueckt-nicht

**Geltung:** universal · web, react-native

> **Regel**
> Trenne zuerst über Abstand, dann über einen Wechsel der Fläche. Greif erst zur Linie, wenn beides nicht trägt, und nimm dann die zurückhaltende Stärke. Eine kräftige Linie ist ein Signal und bleibt dem vorbehalten, was hervorgehoben werden soll.

### Warum

Eine Linie hat eine Aufgabe: trennen. Sie soll nicht selbst gesehen werden. Trotzdem ist sie das lauteste Mittel, das dafür zur Verfügung steht, und das einzige, das dem Bild etwas hinzufügt. Abstand und Flächenwechsel trennen genauso zuverlässig, ohne dass ein Element mehr auf dem Schirm liegt.

Zieht man jede Trennung als Linie, entsteht ein Gitter aus Rahmen, das lauter ist als der Inhalt darin. Und wenn die kräftige Stärke überall steht, hebt sie nichts mehr hervor. Sie ist dann keine Aussage mehr, sondern Tapete.

Es gibt gute Systeme ganz ohne Linien, die allein mit Fläche, Abstand und Erhebung arbeiten. Das ist keine Abweichung von der Regel, sondern ihre konsequenteste Anwendung.

### Die Rangfolge

Bevor Du eine Linie setzt, geh die Liste von oben durch:

1. **Abstand** — trennt am stärksten und kostet nichts. Siehe Nähe gruppiert, nicht die Linie
2. **Fläche** — eine Stufe der Surface-Leiter macht die Grenze sichtbar, ohne sie zu zeichnen
3. **Linie** — wenn der Platz für Abstand fehlt und ein Flächenwechsel zu schwer wäre
4. **Erhebung** — Schatten und Licht, wenn etwas wirklich über dem Übrigen liegt

Die meisten Linien im Bestand sind übersprungene Schritte 1 und 2.

### Hart und weich

| | Status |
|---|---|
| Eine Linie ist ein Mittel unter mehreren, nicht die Voreinstellung | hart |
| Gibt es mehrere Stärken, ist die zurückhaltende der Alltag | hart |
| Die kräftige Stärke bleibt der Hervorhebung vorbehalten | hart |
| Linienfarben kommen aus benannten Tokens, nicht pro Stelle als Grauwert | hart |
| Ob das System überhaupt mit Linien arbeitet und wie viele Stärken es gibt | weich |

### Woran Du den Verstoß erkennst

- Jede Fläche auf der Seite hat eine sichtbare Umrandung.
- Die kräftige Stärke kommt so oft vor, dass sie nichts mehr hervorhebt.
- Eine Linie trennt Dinge, die schon durch Abstand getrennt sind.
- Eine Linie wird pro Stelle als Hex- oder Grauwert gesetzt.
- Es gibt drei oder vier Linienstärken, und niemand kann sagen, wann welche gilt.

### Grenzen

Bei dichten Listen und Tabellen kann der Abstand zwischen zwei Zeilen aus Platzgründen nicht groß genug werden. Dort verdient sich die Linie ihren Platz, und dort ist sie auch ohne schlechtes Gewissen richtig.

Wenn ein Projekt nur eine einzige Linienstärke kennt, ist die Unterscheidung zwischen leise und kräftig gegenstandslos. Dann bleibt von der Regel nur die Rangfolge, und die reicht.

### Verwandt

- Nähe gruppiert, nicht die Linie
- Der Divider ist die Unterkante einer Section
- Die Ebene folgt der Rolle, nicht der Schachtelung

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

### Das Wörterbuch

Bekannte Paare aus Verhalten und Aussehen, die einen Namen tragen. Der Name der Zeile ist die Abkürzung für das Paar. Die Namen in der Spalte Aussehen sind die Vorgabe. Ein Projekt darf sie anders nennen.

| Name | Verhalten | Aussehen | Eigenes Zeichen für „aktiv" |
|---|---|---|---|
| Button | pressable | press | — |
| Icon-Button | pressable | press, nur Icon | — |
| Chip | pressable | chip | Punkt vorn |
| Switch | toggleable | track | Position des Knopfs |
| Tab | toggleable | tab | Strich darunter |
| Eingabefeld | editable | field | — |
| Navigations-Zeile | navigable | row | Balken links |
| Fließtext-Link | navigable | text | verdickte Unterstreichung |
| Badge | readable | chip | — |

Chip und Badge teilen sich das Aussehen und trennen sich im Verhalten: der Chip lässt sich drücken, das Badge nicht. Genau dafür ist die Trennung da.

### Woran Du den Verstoß erkennst

- Ein Badge reagiert auf Klick. Dann ist es kein Badge, sondern ein Chip.
- Ein Switch löst eine einmalige Aktion aus, statt einen Zustand zu halten. Dann ist es ein Button.
- Etwas wird über seine Farbe beschrieben („der graue Knopf") statt über sein Verhalten.
- Das Aussehen bringt Interaktions-Code mit, oder das Verhalten setzt Farben.
- Das Verhalten wird in einer einzelnen Ansicht nachgebaut statt benutzt.

### Grenzen

Zusammengesetzte Gebilde — Dropdown, Datepicker, Dialog — bestehen aus mehreren Elementen und bekommen keine eigene Verhaltensart. Ihr Auslöser ist `pressable`, ihre Einträge sind `navigable` oder `toggleable`.

Und nicht jede Kombination ergibt Sinn. Welche verboten sind, gehört in die Grammatik des Projekts, nicht in diese Notiz.

### Verwandt

- Verhalten und Aussehen werden nicht in der Ansicht nachgebaut
- Ein dauerhafter Zustand braucht ein zweites Zeichen
- Kurze Zustände verschieben, dauerhafte wechseln die Palette
- Die Höhe gehört der Zeile, nicht dem Element
- Klickbares braucht eine Fläche

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

## Klickbares braucht eine Fläche

Bedienung · https://standby.design/docs/rules/bedienung-klickbares-braucht-eine-flaeche

**Geltung:** universal · web, react-native

> **Regel**
> Alles, was man anklicken kann, ist ein Button — mindestens in der stillsten Variante (`ghost`), für Navigation als Button um einen Link herum. Nackte Textlinks sind nicht erlaubt, auch nicht in Fußzeilen und auch nicht als „unauffälliger" Umschalter.

### Warum

Ein nackter Textlink ist auf dem Handy kaum zu treffen. Die Zeilenhöhe von Text ist keine Trefferfläche, und der Daumen ist kein Mauszeiger. Die Höhe eines Buttons in Standardgröße ist genau dafür da: sie ist die Fläche, die ein Finger sicher trifft.

Der zweite Grund ist Erkennbarkeit. Eine Fläche sagt „hier kannst Du drücken", bevor der Nutzer den Text gelesen hat. Ein Textlink sagt es erst danach, und in einer Fußzeile voller Text gar nicht.

Der Wunsch hinter dem Textlink ist meistens „das soll unauffällig sein". Das ist ein berechtigter Wunsch, aber die Antwort darauf ist Schriftfarbe und Schriftgröße, nicht eine kleinere Fläche. Dezent heißt leise, nicht schwer zu treffen.

### Woran Du den Verstoß erkennst

- Ein `<a>` oder ein `Text` mit `onPress`, ohne umgebende Fläche.
- Ein Umschalter („Zur Monatsansicht", „Alle anzeigen") ist als reiner Text gebaut.
- Die Fußzeile besteht aus einer Reihe nackter Links.
- Die Trefferfläche wird kleiner gesetzt, um das Element unauffälliger zu machen.

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

### Hart und weich

| | Status |
|---|---|
| Klickbares hat eine echte Trefferfläche, kein nackter Textlink | hart |
| Dezent wird über Farbe gelöst, nicht über eine kleinere Fläche | hart |
| Die Standardhöhe liegt in der Größe einer Finger-Trefferfläche | hart |
| Die konkreten Höhen | weich, Vorgabe 40 Pixel Standard, 32 Pixel nur am Zeigegerät |

### Grenzen

Die einzige Ausnahme ist ein Wort oder eine Wortgruppe **mitten im Fließtext**, etwa ein Verweis innerhalb eines Absatzes in den Rechtstexten. Dort wäre eine Fläche der Fremdkörper. Sobald der Link auf einer eigenen Zeile steht, gilt die Regel wieder.

### Verwandt

- Die Höhe gehört der Zeile, nicht dem Element
- Verhalten und Aussehen bleiben getrennt
- Fokus ist immer sichtbar

## Die Höhe gehört der Zeile, nicht dem Element

Bedienung · https://standby.design/docs/rules/bedienung-die-hoehe-gehoert-der-zeile-nicht-dem-element

**Geltung:** universal · web, react-native · **Vorgabe:** 2rem dicht, 2.5rem im Formular

> **Regel**
> Alle Bedienelemente in einer Zeile haben dieselbe Höhe. Welche Höhe gilt, sagt der Kontext der Zeile: dicht in einer Werkzeugleiste, großzügig in einem Formular. Die Höhen sind eine kleine, benannte, geschlossene Menge und stehen als Token.

### Warum

#### Ein Paar hat eine gemeinsame Kante

Ein Eingabefeld mit einem Button daneben ist ein Paar. Der Button gehört zu dem Feld, er tut etwas mit dem, was darin steht. Sind beide verschieden hoch, verliert die Zeile ihre Ober- und Unterkante, der Button hängt in der Luft, und die beiden lesen sich als zwei Dinge, die zufällig nebeneinander liegen.

Das ist dieselbe Mechanik wie in Nähe gruppiert, nicht die Linie, nur auf der anderen Achse: Nähe gruppiert waagerecht, eine gemeinsame Kante gruppiert senkrecht. Beides wirkt, bevor jemand liest.

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

Nach unten begrenzt die Trefferfläche aus Klickbares braucht eine Fläche. Auf Touch-Oberflächen ist die dichte Stufe zu klein für den Finger, sie bleibt dort Werkzeugleisten am Zeigegerät vorbehalten.

Ein Element, das allein steht und in keiner Zeile sitzt, nimmt die Höhe seines Umfelds. Im Zweifel die großzügige, weil ein einzelner Knopf fast immer eine Aufgabe ist und keine Werkzeugleiste.

Beschriftete Elemente wachsen nur in der Breite mit ihrem Inhalt. Die Höhe ändert sich nie durch den Text darin.

### Verwandt

- Klickbares braucht eine Fläche
- Nähe gruppiert, nicht die Linie
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

- Ein dauerhafter Zustand braucht ein zweites Zeichen
- Verhalten und Aussehen bleiben getrennt

## Ein dauerhafter Zustand braucht ein zweites Zeichen

Bedienung · https://standby.design/docs/rules/bedienung-ein-dauerhafter-zustand-braucht-ein-zweites-zeichen

**Geltung:** universal · web, react-native

> **Regel**
> Zeige jeden dauerhaften Zustand neben der Farbe mit einem zweiten Merkmal: Position, Strich, Balken, Punkt, Unterstreichung. Das Zeichen gehört zum Element. Es wird nicht an jedem Einsatzort neu erfunden.

### Warum

Rund jeder zwölfte Mann sieht Rot und Grün nicht auseinander. Für ihn ist ein aktiver Tab, der sich nur durch die Textfarbe auszeichnet, kein aktiver Tab, sondern einer von fünf gleichen. Dasselbe gilt bei starkem Sonnenlicht, auf schlecht kalibrierten Bildschirmen und bei jedem, der die Ansicht nur kurz überfliegt.

Das zweite Zeichen kostet nichts. Es ist ohnehin da, sobald das Element sauber gebaut ist: der Knopf des Switch steht rechts, unter dem Tab liegt ein Strich, vor dem Chip sitzt ein Punkt. Der Fehler entsteht nur, wenn ein Zustand nachträglich „schnell über die Farbe" gelöst wird.

### Woran Du den Verstoß erkennst

- Der aktive Tab unterscheidet sich nur in der Textfarbe.
- Eine ausgewählte Kachel ist nur farblich hervorgehoben.
- In Graustufen ist nicht mehr erkennbar, welches Element an ist. Das ist der schnellste Test.

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

### Grenzen

Für kurzzeitige Zustände wie Hover gilt die Regel nicht. Hover ist eine Rückmeldung auf eine Handlung, die gerade passiert, und der Nutzer weiß bereits, wo er ist.

### Verwandt

- Kurze Zustände verschieben, dauerhafte wechseln die Palette
- Rot ist nicht ein Rot

## Fokus ist immer sichtbar

Bedienung · https://standby.design/docs/rules/bedienung-fokus-ist-immer-sichtbar

**Geltung:** universal · web

> **Regel**
> Jedes bedienbare Element zeigt sichtbar, wenn es den Fokus hat. Entferne den Fokus nie ersatzlos. Er ist im ganzen Projekt gleich gebaut und verschiebt beim Erscheinen kein Layout.

### Warum

Wer mit der Tastatur bedient, sieht ohne Fokus gar nicht, wo er ist. Das betrifft nicht nur Screenreader-Nutzer, sondern jeden, der ein Formular schnell durchtabbt. Der Fokus ist die einzige Rückmeldung, die diese Nutzer bekommen.

Die Voreinstellung des Browsers wird oft entfernt, weil sie nicht zum Rest passt, und dann bleibt nichts übrig. Der Wunsch dahinter ist berechtigt — die Antwort darauf ist ein eigener Fokus, kein fehlender.

Dass er das Layout nicht verschieben darf, hat einen praktischen Grund: sitzt er außerhalb des Elements, springt er in engen Reihen über die Nachbarn.

### Woran Du den Verstoß erkennst

- Irgendwo steht `outline: none` ohne Ersatz.
- Beim Durchtabben einer Ansicht verliert man die Position.
- Der Fokus verschiebt beim Erscheinen das Layout oder überlagert Nachbarn.
- Der Fokus wird pro Komponente anders gebaut.

### Grenzen

Die Regel gilt für Tastaturfokus. Ein Fokus nach einem Mausklick darf unterdrückt werden (`:focus-visible`), weil der Mausnutzer schon weiß, wo er geklickt hat.

Wie der Fokus aussieht, ist eine Entscheidung des Projekts und steht dort. Ein weicher Ring auf der Kante ist eine gute Antwort, ein kräftiger Umriss mit Abstand auch — solange er die Nachbarn nicht überlagert.

### Verwandt

- Klickbares braucht eine Fläche
- Ein dauerhafter Zustand braucht ein zweites Zeichen
- Übergänge haben genau einen Wert

## Übergänge haben genau einen Wert

Bedienung · https://standby.design/docs/rules/bedienung-uebergaenge-haben-genau-einen-wert

**Geltung:** universal · web, react-native · **Korridor:** 100-200ms · **Vorgabe:** 150ms

> **Regel**
> Lege für Zustandswechsel am Ort genau eine Dauer fest und halte sie als Token. Sie liegt zwischen 100 und 200 Millisekunden. Solange das Projekt nichts anderes festlegt, gilt 150. Hat der Nutzer weniger Bewegung eingestellt (`prefers-reduced-motion`), findet der Wechsel sofort statt.

### Warum

Der Korridor hat einen Grund, die Zahl darin nicht. Unter etwa 100 Millisekunden nimmt niemand mehr eine Bewegung wahr, der Wechsel liest sich als Sprung und die Rückmeldung geht verloren. Über etwa 200 wartet der Nutzer auf die Oberfläche, und das Warten fällt umso mehr auf, je öfter er den Wechsel auslöst.

Innerhalb des Korridors ist die Zahl eine Frage der Handschrift. Ein ruhiges, schweres Produkt darf am oberen Ende sitzen, ein Werkzeug, das schnell wirken soll, am unteren. Diese Entscheidung nimmt die Regel niemandem ab.

Hart ist etwas anderes: dass es **eine** Dauer gibt. Verschiedene Dauern nebeneinander lassen eine Ansicht flackern, weil mehrere Elemente in einer Reihe zu verschiedenen Zeitpunkten ankommen. Der Blick sieht dann nicht einen Wechsel, sondern drei. Und weil die Dauer als Token steht, lässt sich die Handschrift später an einer Stelle ändern statt an zweihundert.

Die letzte Hälfte ist keine Höflichkeit. Für Menschen mit vestibulärer Störung löst Bewegung auf dem Bildschirm Schwindel und Übelkeit aus. Die Systemeinstellung ist ihre Bitte, und sie wird beachtet.

### Was hart ist und was weich

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

### Grenzen

Größere Bewegungen sind nicht gemeint und dürfen länger dauern: ein Off-Canvas-Drawer, ein Dialog, ein Seitenwechsel. Der Korridor gilt für Wechsel am Ort — Farbe, Rand, die Position eines Schalterknopfs. Auch die längeren Bewegungen fallen bei reduzierter Bewegung weg.

Legt eine Marken-Richtlinie im Projekt eine eigene Zahl fest, gilt diese. Der Vorgabewert ist dafür da, dass man ohne eine solche Richtlinie trotzdem loslegen kann, und nicht dafür, sie zu überstimmen.

### Verwandt

- Kurze Zustände verschieben, dauerhafte wechseln die Palette
- Fokus ist immer sichtbar
- Werte kommen aus Tokens, nie aus der Hand

## Dieselbe Zahl bedeutet überall dasselbe

Zustand · https://standby.design/docs/rules/zustand-dieselbe-zahl-bedeutet-ueberall-dasselbe

**Geltung:** universal · web, react-native

> **Regel**
> Lege einmal fest, ab welcher Grenze ein Wert gut, mittel oder schlecht ist, und halte diese Übersetzung auf jeder Seite gleich. Fehlt der Wert, ist der Zustand neutral.

### Warum

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

### Woran Du den Verstoß erkennst

- Zwei Ansichten zeigen denselben Wert in verschiedenen Farben.
- Der Vergleich mit einer Grenze steht in mehr als einer Datei.
- Eine neue Anzeige bekommt ihre Grenzen mitgegeben, statt sie zu erfragen.
- Ein fehlender Wert wird zu null gemacht und dann eingefärbt.
- Ein Feld ohne Daten ist grün, weil „kein Problem gemeldet" als gut gewertet wird.
- Eine Kennzahl zeigt einen Strich und trotzdem einen farbigen Rand oder ein farbiges Badge.

### Grenzen

Eine Kennzahl mit fachlich eigenen Grenzen — eine gesetzliche Quote, ein vertraglicher Schwellwert — bekommt ihre Werte natürlich von dort. Sie geht trotzdem durch dieselbe Übersetzung, damit der Weg von der Zahl zur Farbe an einer Stelle bleibt.

Ein leerer Zustand darf erklären, warum nichts da ist, und einen Weg anbieten („Noch keine Buchungen — Import starten"). Neutral heißt grau, nicht wortlos.

### Verwandt

- Rot ist nicht ein Rot
- Ein dauerhafter Zustand braucht ein zweites Zeichen

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
- Der Zustand hängt nicht an der Farbe allein. Ein Zeichen, ein Wort oder ein Symbol trägt die Bedeutung mit, siehe Ein dauerhafter Zustand braucht ein zweites Zeichen. Das ist ohnehin schon Pflicht, hier wird es nur besonders wichtig.

### Grenzen

Auf einer Marketing- oder Titelseite mit eigener Haut gilt das nicht, dort regiert die Marke. Die Regel gilt für die Anwendung, in der Farbe eine Aussage über Daten ist.

### Verwandt

- Dieselbe Zahl bedeutet überall dasselbe
- Ein dauerhafter Zustand braucht ein zweites Zeichen
- Werte kommen aus Tokens, nie aus der Hand

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
| Ein Element wird nicht gleichzeitig über Größe und Gewicht betont | hart |
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

Marketing- und Titelseiten dürfen mit ihren eigenen Display-Stufen arbeiten. Dort ist Schrift Bild, und ein Bild darf laut sein.

### Verwandt

- Zahlenspalten stehen rechtsbündig
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

## Utility-Klassen statt Inline-Styles

Stack · https://standby.design/docs/rules/stack-utility-klassen-statt-inline-styles

**Geltung:** stack · web, react-native

> **Regel**
> Setze jede Gestaltung über Utility-Klassen. Keine Inline-Styles, keine Style-Objekte, keine festen Farbwerte im Markup.

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

- Nähe gruppiert, nicht die Linie
- Die Karte hat kein Padding
- Utility-Klassen statt Inline-Styles

## Keine Deckkraft-Modifier auf semantischen Farben

Stack · https://standby.design/docs/rules/stack-keine-deckkraft-modifier-auf-semantischen-farben

**Geltung:** stack · web, react-native

> **Regel**
> Schreibe nie `bg-primary/10`, `text-destructive/60` oder Ähnliches. Für Abstufungen gibt es benannte Stufen, für Hover und Gedrückt benannte Zustandsstufen. Fehlen sie, nimm eine Helligkeitsänderung: heller beim Hover (`brightness-110`), dunkler beim Drücken (`brightness-95`).

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
