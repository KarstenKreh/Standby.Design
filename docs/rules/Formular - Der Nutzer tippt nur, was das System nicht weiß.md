---
dateCreated: 2026-10-02
description: "Nichts abfragen, was das System kennt oder ableiten kann. Felder mit festem Zweck tragen type, inputmode und autocomplete."
type: design-rule
scope: universal
applies-to:
  - web
  - react-native
status: active
tags:
  - design-system
  - design-rule
  - formular
---

# Der Nutzer tippt nur, was das System nicht weiß

> [!TIP] Regel
> Frag keinen Wert ab, den das System schon kennt oder ableiten kann. Gib jedem Feld mit festem Zweck den passenden `type`, `inputmode` und `autocomplete`, damit Browser, Passwortmanager und Tastatur den Rest übernehmen.

## Warum

Jedes Feld kostet den Nutzer Zeit und ist eine Fehlerquelle. Was das System selbst weiß, muss es selbst tragen.

Browser, Passwortmanager und Handytastatur helfen nur, wenn sie den Zweck kennen.

Dazu gehört das Gegenteil: Wo die Hilfe stört, bleibt sie aus. Bei E-Mail, Codes und Nutzernamen ist die Rechtschreibprüfung aus, und Felder ohne Anmeldung, etwa die Suche, rufen keinen Passwortmanager auf. Einmalcodes tragen `autocomplete="one-time-code"`, dann bietet das Handy den Code aus der SMS an.

## Hart und weich

Hart: der Zweck steht am Feld.

## Woran Du den Verstoß erkennst

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

## Grenzen

Neues Passwort, wenn es nicht angezeigt werden kann. Werte, die der Nutzer bewusst prüfen soll, werden vorbelegt statt verborgen.

Freitext und Suche haben keinen festen Zweck.

## Quelle

Laws of UX › Tesler’s Law, https://lawsofux.com/teslers-law/. WCAG 3.3.7 Redundant Entry. WCAG 1.3.5 Identify Input Purpose, 3.3.7 Redundant Entry. Vercel › Forms („`autocomplete` + meaningful `name`; correct `type` and `inputmode`").

## Verwandt

- [[Formular - Was der Nutzer tippt oder einfügt, kommt an]]
- [[Fluss - Ein Fehler steht dort, wo er entstanden ist]]
