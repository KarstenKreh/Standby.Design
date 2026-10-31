---
name: design-review
description: Prüft einen fertig gebauten Screen gegen die Design-Regeln von standby.design, mit Screenshot, Textstil-Zählung und einem frischen Review-Subagenten. Nutzen, bevor ein Screen, eine Ansicht oder eine Seite als fertig gemeldet wird, oder wenn jemand ein Design-Review verlangt.
---

# Design-Review eines Screens

Der Lint-Hook prüft beim Schreiben, was im Code steht. Dieses Review prüft, was er nicht sehen kann: das Gesamtbild. Es läuft einmal pro fertigem Screen, nicht nach jeder Änderung.

## Ablauf

1. **Screen erreichbar machen.** Die App läuft lokal, Du kennst die URL des Screens, mit allen Daten, die er im Normalfall zeigt.
2. **Screenshots und Zählung erzeugen:**
   ```
   npx standby-design-lint review <url>
   ```
   Im Repo von standby.design selbst: `node packages/design-lint/bin/standby-design-lint.js review <url>`.
   Das legt unter `.design-review/<screen>/` je einen ganzseitigen Screenshot bei 1280 und 375 Pixeln Breite ab und schreibt `report.md` mit der Textstil-Zählung.
3. **Einen Review-Subagenten starten**, ohne Wissen darüber, wie der Screen gebaut wurde. Er bekommt nur die Pfade der beiden Screenshots, den Pfad von `report.md` und die Prüfliste unten. Auftrag: Screenshots ansehen, jede Frage der Prüfliste beantworten, höchstens zehn Befunde zurückgeben, je Befund Stelle im Bild, Regel und konkrete Änderung. Keine Befunde erfinden, um auf eine Zahl zu kommen.
4. **Befunde beheben.** Was im Code liegt, behebst Du direkt. Dann Schritt 2 einmal wiederholen. Höchstens zwei Runden, danach nicht weiter drehen.
5. **Berichten.** Was offen bleibt oder eine Gestaltungsentscheidung braucht, legst Du dem Menschen mit dem Screenshot vor.

## Prüfliste für den Subagenten

1. **Kanten** ([Weniger Kanten, ruhigere Ansicht](https://standby.design/docs/rules/layout-weniger-kanten-ruhigere-ansicht)): Wie viele senkrechte Ausrichtungskanten gibt es pro Spalte? Liegen Kanten wenige Pixel nebeneinander, die eine sein könnten? Mischen sich linksbündig und zentriert?
2. **Textstile** ([Jeder Textstil hat eine Rolle](https://standby.design/docs/rules/typografie-jeder-textstil-hat-eine-rolle)): Befunde aus `report.md` übernehmen. Dazu: Gibt es Stile, die gleich aussehen sollen, aber leicht verschieden sind?
3. **Titel** ([Die Titel bilden eine Gliederung](https://standby.design/docs/rules/layout-die-titel-bilden-eine-gliederung)): Genau ein Titel in Titelstufe 1? Steht ein Titel doppelt, etwa im Kopf und über der Karte? Hebt sich jede Titelstufe sichtbar ab?
4. **Gewicht** ([Ein Primary pro Ansicht](https://standby.design/docs/rules/bedienung-gewicht-ist-ein-budget-ein-primary-pro-ansicht)): Wie viele gefüllte Haupt-Buttons sind sichtbar? Mehr als einer ist ein Befund.
5. **Abstand vor Linie** ([Erst Abstand, dann Fläche, dann Linie](https://standby.design/docs/rules/layout-erst-abstand-dann-flaeche-dann-linie)): Gibt es Linien oder Rahmen, wo Abstand allein gruppieren würde? Karten in Karten?
6. **Schmale Breite** ([Jede Ansicht folgt dem Platz](https://standby.design/docs/rules/layout-jede-ansicht-folgt-dem-platz-und-bricht-bei-320-pixeln-um)): Ist bei 375 Pixeln etwas abgeschnitten, überlappt oder nur waagerecht scrollbar?
7. **Farbe** ([Farbe trägt nie allein](https://standby.design/docs/rules/farbe-farbe-traegt-nie-allein)): Wird ein Zustand nur über Farbe gezeigt?

## Kosten

Ein Subagent und zwei Screenshots pro Screen. Für Durchklicken und Screenshots reicht ein günstiges Modell, für das Urteil über das Bild ein starkes.
