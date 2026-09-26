---
dateCreated: 2026-09-26
description: Lassen sich die Achsen des Motion-Tools auf Forschung stützen? Energie ja, Material nur als Konvention.
type: research
tool: Motion
stand: 26.09.2026
tags:
  - research
  - motion
---

# Wahrnehmung von Bewegung

**Frage:** Lassen sich die zwei Achsen des Motion-Tools und die Zuordnung zu Marken-Charakteren auf replizierte Forschung stützen? Die Achse **Energie: ruhig ↔ lebhaft** steuert das Tempo der Feder (response). Die Achse **Material: fest ↔ elastisch** steuert das Nachschwingen (damping).

> [!SUMMARY] Kurzfassung
> Die Achse **Energie** ist gut belegt: Tempo bildet Erregung ab. Die Achse **Material** ist als Gefühl kaum belegt. Nachschwingen wird eher als Material gelesen (weich, elastisch), daher der Name.

## Gut belegt

- **Tempo bildet Erregung (Arousal) ab: schnell wirkt energisch, langsam wirkt ruhig.** Das ist der robusteste Befund im Feld, unabhängig in vielen Bereichen:
  - Armbewegungen als Lichtpunkte (Pollick 2001): Aktivierung hängt an der Geschwindigkeit, Valenz an der Koordination der Gelenke.
  - Gang (Roether 2009).
  - Musik und Sprache, Meta-Analyse über 145 Studien (Juslin & Laukka 2003).
  - Musik und Bewegung, auch über Kulturen hinweg (Sievers 2013, PNAS).
  - Abstrakte Formen (Visch & Goudbeek 2009, N=33; Bartram & Nakatani 2010).
  - Roboter (Saerbeck & Bartneck 2010, N=18: Beschleunigung sagt Erregung vorher).
  - Formwandelnde Displays (Strohmeier 2016, CHI).
- **Valenz (angenehm ↔ unangenehm) hängt nicht an einer einzelnen Größe.** Sie entsteht aus Wechselwirkungen, z. B. Beschleunigung × Krümmung (Saerbeck) oder Rhythmus und Zackigkeit (Sievers). Eine Regel „Nachschwingen = Freundlichkeit“ gibt die Forschung nicht her.
- **Slow-in/Slow-out hilft beim Verfolgen von Objekten** (Dragicevic 2011, N=12, Einzelbefund). Das passt zur Motorik-Forschung: Natürliche Bewegungen haben ein glockenförmiges Geschwindigkeitsprofil (Flash & Hogan 1985).
- **Zeitschwellen:** Unter etwa 100 ms wirkt eine Reaktion sofort (Miller 1968; Card, Moran & Newell 1983; Card et al. 1991). Beim Ziehen auf Touch-Geräten werden deutlich kleinere Verzögerungen wahrgenommen als beim Tippen (Jota et al. 2013; Deber et al. 2015; Einzelwerte nicht im Volltext geprüft). Diese Werte betreffen die Reaktionszeit auf eine Eingabe, nicht die Dauer einer Animation.
- **Langsamkeit wirkt luxuriös** (Jung & Dubois 2023, JMR, 12 Experimente, N=27.227, fünf vorregistriert). Das ist die stärkste Brücke zur Markenwahrnehmung. Getestet wurde Zeitlupe in Werbevideos, nicht UI-Animation.

## Plausibel, aber schwach belegt

- **Konkrete UI-Dauern (200 bis 500 ms):** keine replizierte Studie. Einzelstudien: Huhtala 2010 (früher Beginn wirkt schneller), Ge et al. 2024 (Verzögerung nach dem Klick und Ladezeit bestimmen die Flüssigkeit stärker als die Animationsdauer), Ding & Kyung 2025 (JCR: Bei Wartezeit-Animationen wirkt mittlere Geschwindigkeit am kürzesten).
- **Anticipation und Follow-through:** Robotik-Studien zeigen bessere Lesbarkeit (Takayama 2011). Linear gegen Slow-in/Slow-out ergab beim Roboter keinen Unterschied im Godspeed-Fragebogen (Schulz 2019). Merz et al. 2016 ist nur eine Pilotstudie.
- **Overshoot und Bounce:** Menschen lesen aus einem springenden Ball ab, wie elastisch er ist (Warren 1987). Bounce wird als Material wahrgenommen. Eine Studie, die die Dämpfung gezielt verändert und Adjektive wie „verspielt“ misst, wurde nicht gefunden.
- **Studien von 2026** (Displays; IJHCI mit PAD-Emotionsmodell) verbinden Übergangsarten mit Emotionen. Sie sind nur per Abstract geprüft und Einzelstudien.

## Folklore oder Branchen-Richtlinie

- „Verspielt = bouncy“, „Sport = snappy“, „Premium = sanft gedämpft“ sind Designer-Setzungen. Nur „Premium = langsam“ hat eine indirekte Stütze (Jung & Dubois).
- Dauer-Tabellen aus Material, Apple HIG und Blogs haben keine Primärquelle.
- „Dauer wächst mit der Distanz“ ist eine Richtlinie in Anlehnung an Fitts' Gesetz. Fitts misst Zielbewegungen, nicht Animationsdauern. Technisch gilt: Eine lineare Feder braucht bei gleicher Steifigkeit gleich lange, egal wie weit sie läuft.

## Folgerung für Standby Design

- Achse 1 heißt **„Energie: ruhig ↔ lebhaft“** (Tempo der Feder). Sie nennt die Forschung zu Tempo und Erregung offen als Grundlage.
- Achse 2 heißt **„Material: fest ↔ elastisch“** (Nachschwingen). Sie ist ausdrücklich als Design-Konvention gekennzeichnet.
- Presets sind Positionen auf beiden Achsen mit Beispielmarken, keine Charakter-Etiketten, z. B. „Ruhig · fest (oft bei Premium-Marken)“ oder „Lebhaft · elastisch“.
- Der Hinweis in der App lautet sinngemäß: Energie folgt gut belegter Forschung, Menschen lesen Tempo als Erregung. Material und die Beispielmarken sind Design-Konventionen. Die Werte sind Startpunkte, kein Beweis.
- Harte Grenze: Rückmeldung auf eine Eingabe unter 100 ms. Obergrenzen für Dauern gelten nur als Richtlinie.

## Quellen

- Heider & Simmel 1944, Am. J. Psychol. 57:243–259
- Michotte 1946/1963, The Perception of Causality
- Tremoulet & Feldman 2000, Perception 29:943–951, https://doi.org/10.1068/p3101
- Pollick, Paterson, Bruderlin & Sanford 2001, Cognition 82:B51–B61, https://pubmed.ncbi.nlm.nih.gov/11716834/
- Roether et al. 2009, J. Vision 9(6):15
- Juslin & Laukka 2003, Psych. Bull. 129:770–814
- Sievers et al. 2013, PNAS, https://doi.org/10.1073/pnas.1209023110
- Visch & Goudbeek 2009, ACII, https://ieeexplore.ieee.org/document/5349548/
- Bartram & Nakatani 2010, PSIVT, https://ieeexplore.ieee.org/document/5673747/
- Saerbeck & Bartneck 2010, HRI, https://www.bartneck.de/publications/2010/perceptionAffectElicitedRobotMotion/saerbeckBartneckHRI2010.pdf
- Strohmeier et al. 2016, CHI, https://dl.acm.org/doi/10.1145/2858036.2858537
- Takayama, Dooley & Ju 2011, HRI, https://dl.acm.org/doi/10.1145/1957656.1957674
- Schulz et al. 2019, RO-MAN, https://arxiv.org/abs/2003.11443
- Dragicevic et al. 2011, CHI, https://inria.hal.science/inria-00556177
- Merz, Tuch & Opwis 2016, CHI EA, https://doi.org/10.1145/2851581.2892489
- Huhtala et al. 2010, CHI, https://doi.org/10.1145/1753326.1753527
- Harrison, Yeo & Hudson 2010, CHI, https://dl.acm.org/doi/10.1145/1753326.1753556
- Ge et al. 2024, IJHCS 186, https://doi.org/10.1016/j.ijhcs.2024.103257
- Ding & Kyung 2025, J. Consumer Research, https://doi.org/10.1093/jcr/ucaf037
- Jung & Dubois 2023, J. Marketing Research, https://journals.sagepub.com/doi/abs/10.1177/00222437221146728
- Warren, Kim & Husney 1987, Perception, https://doi.org/10.1068/p160309
- Flash & Hogan 1985, J. Neurosci. 5:1688–1703
- Miller 1968, AFIPS FJCC, https://dl.acm.org/doi/10.1145/1476589.1476628
- Card, Moran & Newell 1983, The Psychology of Human-Computer Interaction
- Card, Robertson & Mackinlay 1991, CHI
- Jota et al. 2013, CHI, https://www.tactuallabs.com/papers/howFastIsFastEnoughCHI13.pdf
- Deber et al. 2015, CHI, https://www.tactuallabs.com/papers/howMuchFasterIsFastEnoughCHI15.pdf
- Chevalier et al. 2016, AVI, https://dl.acm.org/doi/10.1145/2909132.2909255
- Russell 1980, JPSP 39:1161–1178
- Displays 2026, https://www.sciencedirect.com/science/article/pii/S0141938226000995 (nur Abstract)
- IJHCI 2026, https://doi.org/10.1080/10447318.2026.2630289 (nur Abstract)
