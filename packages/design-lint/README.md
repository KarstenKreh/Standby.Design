# standby-design-lint

Setzt die [Design-Regeln von standby.design](https://standby.design/docs/rules) im Code durch, statt sie nur zu beschreiben. Jede Meldung nennt den Verstoß, den Fix und die Regel mit Link, damit ein Agent sie direkt umsetzen kann.

Die Prüfung läuft in Stufen:

| Stufe | Wann | Was | Kosten |
|---|---|---|---|
| Claude-Code-Hook | nach jedem Edit/Write | Lint der geänderten Zeilen, Meldung geht an den Agenten zurück | kein LLM-Aufruf |
| Pre-Commit | vor jedem Commit | Lint der vorgemerkten Zeilen | kein LLM-Aufruf |
| CI | bei jedem Pull Request | Lint der neuen Zeilen seit dem Ziel-Branch | kein LLM-Aufruf |
| Review-Skill | einmal pro fertigem Screen | Screenshots, Textstil-Zählung, frischer Review-Subagent | ein Subagent |

Hook, Pre-Commit und CI prüfen nur neue oder geänderte Zeilen. Ein bestehendes Projekt mit Altlasten wird dadurch nicht auf einen Schlag rot.

## Lint-Regeln

| Regel | Findet | Design-Regel |
|---|---|---|
| `standby/no-raw-values` | `bg-[#fff]`, `p-[13px]`, `font-['Inter']`, `bg-blue-500`, `text-white` | [Werte kommen aus Tokens](https://standby.design/docs/rules/farbe-werte-kommen-aus-tokens-nie-aus-der-hand) |
| `standby/no-inline-style` | feste Werte in `style={{ … }}`, `StyleSheet.create` | [Utility-Klassen statt Inline-Styles](https://standby.design/docs/rules/stack-utility-klassen-statt-inline-styles) |
| `standby/no-state-classes-in-views` | `hover:`, `focus:`, `active:` außerhalb des Komponenten-Ordners | [Verhalten und Aussehen werden nicht in der Ansicht nachgebaut](https://standby.design/docs/rules/bedienung-verhalten-und-aussehen-werden-nicht-in-der-ansicht-nachgebaut) |
| `standby/no-transition-all` | `transition-all`, `transition: all` | [Bewegung hat einen Wert](https://standby.design/docs/rules/bedienung-bewegung-hat-einen-wert-und-haelt-nichts-auf) |
| `standby/no-opacity-on-semantic-colors` | `bg-primary/10`, `hover:bg-primary/90` | [Keine Deckkraft-Modifier](https://standby.design/docs/rules/stack-keine-deckkraft-modifier-auf-semantischen-farben) |
| `standby/no-space-utilities` | `space-y-*`, `last:mb-0` | [Abstand über gap](https://standby.design/docs/rules/stack-abstand-ueber-gap-nicht-ueber-margins-am-kind) |
| `standby/no-disabled-by-validity` | `disabled={!isValid}`, `disabled={!isDirty}` | [Ein Button ist nie gesperrt](https://standby.design/docs/rules/bedienung-ein-button-ist-nie-gesperrt) |
| `standby/no-click-on-non-interactive` | `<div onClick>`, `<span onClick>` | [Name und Zustand stehen im Code](https://standby.design/docs/rules/bedienung-name-und-zustand-stehen-im-code) |

Klassen werden in `className`, `class` und in `cn()`, `clsx()`, `cva()`, `twMerge()`, `tv()` erkannt. Welche Merkmale der Regeln sich wie prüfen lassen, steht in [INVENTORY.md](INVENTORY.md).

## Einrichten und aktualisieren

Im Wurzelordner des Projekts:

```sh
npx standby-design-lint@latest init
```

Der Befehl installiert das Paket und richtet alles ein, was unten einzeln beschrieben ist: Claude-Code-Hook, Pre-Commit (warnt nur), CI-Workflow (blockiert neue Verstöße im Pull Request), den Skill `design-review`, einen kurzen Regelblock in `CLAUDE.md` oder `AGENTS.md` und die Einstellungen in `package.json`. Ein zweiter Lauf aktualisiert alles auf die neueste Version und legt nichts doppelt an. Fremde Hooks und eigener Text bleiben stehen.

Mit dem MCP-Server von standby.design reicht dem Agenten ein Satz wie „Hol Dir das Update“: Das Tool `update_project` nennt ihm die Schritte.

Einstellungen in `package.json`, alle optional:

```json
"standbyDesignLint": {
  "componentPaths": ["/components/ui/"],
  "allowedColors": [],
  "ignores": ["src/legacy/**"]
}
```

`componentPaths` sind die Ordner, in denen Zustände wie `hover:` erlaubt sind. `allowedColors` erlaubt einzelne Farben der Tailwind-Palette, etwa `"white"`.

**Claude-Code-Hook** in `.claude/settings.json`. Exit-Code 2 gibt die Meldung an den Agenten zurück, er korrigiert in derselben Sitzung:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|MultiEdit|Write",
      "hooks": [{ "type": "command", "command": "npx standby-design-lint --hook", "timeout": 30 }]
    }]
  }
}
```

**Pre-Commit**, etwa mit `simple-git-hooks` oder `husky`. `--warn` meldet, hält den Commit aber nicht auf:

```sh
npx standby-design-lint --staged --warn
```

**CI**, im Pull Request:

```sh
npx standby-design-lint --since origin/main
```

**ESLint**, falls das Projekt schon eine Konfiguration hat:

```js
import { recommended } from 'standby-design-lint';
export default [recommended({ componentPaths: ['/components/ui/'] })];
```

## Review eines Screens

```sh
npm i -D playwright && npx playwright install --only-shell chromium
npx standby-design-lint review http://localhost:5173/settings
```

Legt Screenshots bei 1280 und 375 Pixeln und `report.md` unter `.design-review/` ab. Der Bericht zählt die Textstile (Größe, Schnitt, Farbe, Schreibweise) und prüft sie gegen [Jeder Textstil hat eine Rolle](https://standby.design/docs/rules/typografie-jeder-textstil-hat-eine-rolle). Rollen erkennt er an `data-text-role="meta"` oder an Klassen `text-role-meta`. Die Klassen liefert der Type-Export von standby.design: `text-role-title-1` bis `-3`, `-figure`, `-body`, `-label`, `-meta`.

Der Skill in [skills/design-review/SKILL.md](skills/design-review/SKILL.md) führt den Agenten durch das Review: Screenshots, frischer Subagent mit Prüfliste, Befunde beheben. Kopieren nach `.claude/skills/design-review/SKILL.md`.

## Agenten-Datei kurz halten

In `CLAUDE.md` oder `AGENTS.md` des Projekts reichen drei Zeilen. Die Regeln selbst kommen über Hook, MCP-Server und Skill:

```md
- Farben, Abstände, Schriftgrößen nur aus den Tokens in `src/styles/theme.css`, Komponenten aus `src/components/ui/`.
- Design-Regeln: MCP-Tool `get_design_rules` (standby-design-mcp), gefiltert nach Kategorie.
- Vor „fertig“ bei jedem Screen den Skill `design-review` ausführen.
```
