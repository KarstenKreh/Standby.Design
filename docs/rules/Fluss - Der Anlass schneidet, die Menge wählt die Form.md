---
dateCreated: 2026-11-28
description: "Was der Nutzer aus demselben Anlass braucht, steht zusammen. Verschiedene Anlässe werden getrennt. Die Menge entscheidet, ob als Abschnitt oder als eigener Screen. Nie ein Menü im Menü."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - fluss
---

# Der Anlass schneidet, die Menge wählt die Form

> [!TIP] Regel
> Fass zusammen, was der Nutzer aus demselben Anlass braucht. Trenn, was verschiedene Anlässe hat. Ob die Trennung ein Abschnitt mit Überschrift oder ein eigener Screen wird, entscheidet die Menge. Tiefe ist immer eine Ebene mit Adresse, nie ein Menü im Menü.

## Warum

Ob zwei Funktionen verwandt sind, ist eine Frage des Grades. Ähnlichkeit hat keine natürliche Grenze, also lässt sich darüber nicht sicher entscheiden. Der Anlass dagegen ist eindeutig: Der Nutzer kommt für eine Sache. Was er in demselben Besuch braucht, steht zusammen. Was er nie zusammen braucht, stört sich gegenseitig.

Der Schnitt und die Form sind zwei Fragen. Wo geschnitten wird, entscheidet der Anlass, und das steht fest. Ob ein Abschnitt oder ein Screen daraus wird, entscheidet die Menge, und das darf sich ändern. Wird eine Seite voller, werden aus Abschnitten Screens. Die Überschriften bleiben dieselben und werden zu Einträgen der Navigation. Niemand muss entscheiden, wie verwandt etwas ist.

Eine Ebene zeigt dem Nutzer, wo er ist: Pfad, Zurück, Adresse. Ein Menü, das ein weiteres Menü öffnet, zeigt das nicht. Der Nutzer muss den Weg im Kopf behalten, und beim nächsten Besuch findet er die Funktion nicht wieder.

## Der Test

Bevor eine Funktion auf eine bestehende Seite kommt, drei Fragen in dieser Reihenfolge:

1. **Anlass:** Fülle den Satz „Der Nutzer kommt hierher, um ___.“ Passt die neue Funktion in denselben Satz, ohne „und“? Dann gehört sie auf die Seite.
2. **Gegenstand:** Verändert die Funktion dieselbe Entität wie die Seite? Verändert sie eine andere, gilt [[Fluss - Eine Entität hat ihren Screen, ein Teil bleibt bei ihr]].
3. **Erreichbarkeit:** Braucht die Funktion ein zweites Öffnen, um erreichbar zu sein? Dann fehlt eine Ebene.

## Drei sichere Zeichen für eine Trennung

Bleibt der Anlass unklar, trennt jedes dieser Zeichen sicher:

| Zeichen | Beispiel |
|---|---|
| Anderes Speichern | Das eine wirkt sofort, das andere braucht einen Knopf |
| Andere Folgen | Konto löschen steht nicht neben der App-Sprache |
| Anderer Nutzer | Das eine darf jeder, das andere nur der Admin |

## Die Form

| Menge | Form |
|---|---|
| Alle Abschnitte passen in eine Ansicht | eine Seite, Abschnitte mit Überschrift |
| Die Abschnitte passen nicht mehr in eine Ansicht | jeder Abschnitt wird ein Screen, seine Überschrift ein Eintrag der Navigation |

Beispiel Kontoeinstellungen: „Lizenz, Zahlung, Rechnungen“ ist ein Screen, weil der Nutzer kommt, um sein Abo zu regeln. „Tastenbelegung“ hat einen anderen Anlass und ist ein eigener Screen. „Gefahrenzone“ steht für sich, weil die Folgen andere sind. „Einstellungen“ selbst ist keine Entität, sondern eine Ebene der Navigation über mehreren.

## Hart und weich

| | Status |
|---|---|
| Verschiedene Anlässe stehen in verschiedenen Abschnitten oder Screens | hart |
| Ein Menü öffnet kein weiteres Menü, Reiter stehen nicht in Reitern | hart |
| Der Test läuft, bevor eine Funktion auf eine bestehende Seite kommt | hart |
| Abschnitt oder eigener Screen | weich, nach Menge |
| Ab wann geteilt wird | weich, Vorgabe: sobald nicht mehr alle Abschnitte in eine Ansicht passen |

## Woran Du den Verstoß erkennst

- Ein Menü öffnet ein Menü.
- Reiter stehen in Reitern.
- Ein Aufklappbereich enthält eigene Aktionen oder ein Formular.
- Ein „Mehr“-Menü sammelt Funktionen, die mit dem Anlass der Ansicht nichts zu tun haben.
- Der Anlass-Satz der Seite braucht ein „und“.
- Mehrere Abschnitte einer Seite speichern je für sich.

## Grenzen

- Eine Ebene entsteht nur für eine eigene Entität oder einen eigenen Anlass. Filter, Sortierung und ein einzelner Wert bleiben auf der Seite, siehe [[Fluss - Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben]].
- Ein Aufklappmenü oder eine Auswahlliste an einem Bedienelement ist kein Menü im Menü, solange daraus nichts Weiteres aufgeht.
- Eine Zwischenseite ohne eigenen Inhalt ist auch ein Fehler. Wer drei Funktionen hat, braucht keine drei Ebenen.

## Quelle

GOV.UK Service Manual › Form structure und Design Notes › „One thing per page“ (2015): eine Sache pro Seite, nicht kurze Seiten. Nielsen Norman Group › Progressive Disclosure: Seltenes wandert auf einen nachgeordneten Screen. Nielsen Norman Group › Card Sorting: Wo Nutzer die Grenze ziehen, zeigt am Ende nur der Test mit ihnen. Anlass und die drei Zeichen sind die Annäherung dieser Sammlung dafür.

## Verwandt

- [[Fluss - Eine Entität hat ihren Screen, ein Teil bleibt bei ihr]]
- [[Fluss - Konfiguration bekommt eine Seite, Ansichts-Einstellungen bleiben]]
- [[Fluss - Ein Pop-up unterbricht, es führt nicht]]
- [[Layout - Die Titel bilden eine Gliederung]]
