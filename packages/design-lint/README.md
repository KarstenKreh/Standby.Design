# standby-design-lint

Documentation: [standby.design/docs/lint](https://standby.design/docs/lint)

standby-design-lint checks code against the [design rules of standby.design](https://standby.design/docs/rules). Each message names the violation, the fix and the rule with a link, so an agent can apply the fix directly.

The messages, the help text and the `init` report are in German. Each message ends with the German rule title and the link to the rule page.

It needs Node 20.19 or newer and a `package.json` in the project root. It reads `.js`, `.jsx`, `.ts`, `.tsx` and `.mjs` files.

The lint, the hook and `init` send no code or project data anywhere. The only network access of `init` is the package download from npm. The review opens the URL you pass in a local browser. The CI check runs on your CI runner.

## Set up and update

Run this in the root folder of the project:

```sh
npx standby-design-lint@latest init
```

The command installs the package as a dev dependency and sets up the following:

- A Claude Code hook in `.claude/settings.json`.
- A pre-commit hook that warns and never blocks.
- A CI workflow `.github/workflows/design-lint.yml` that fails a pull request with new violations.
- The skill `design-review` in `.claude/skills/design-review/`.
- A short rules block in `AGENTS.md` and `CLAUDE.md`.
- The `standbyDesignLint` settings in `package.json`, if they are missing.
- The entry `.design-review/` in `.gitignore`.

Run the same command again to update everything to the latest version. It never adds anything twice. Hooks from other tools and your own text in `CLAUDE.md` or `AGENTS.md` stay as they are. `init` only replaces its own hook entry, its own line in the pre-commit file and its own block between the markers `<!-- standby-design-lint:start -->` and `<!-- standby-design-lint:end -->`. The workflow file and the skill are written anew on each run, so local changes to these two files are lost. The workflow uses the version range from your `devDependencies`.

### What init does in special cases

- `init` uses the package manager of the project (npm, pnpm, yarn or bun). `--no-install` skips the install.
- The pre-commit hook goes into `.husky/pre-commit` if the project uses husky. Otherwise it goes into the Git hooks folder. Without a Git repository, `init` skips it.
- The CI workflow is only created if the project has a `.github` folder. If GitHub rejects the push because of the workflow file, run `gh auth refresh -s workflow`.
- The rules block always goes into `AGENTS.md`, which Cursor, Codex and others read. If `CLAUDE.md` is missing, `init` creates one that imports `AGENTS.md` with `@AGENTS.md`. If `CLAUDE.md` exists and does not import `AGENTS.md`, it gets the block too.

### Update through an agent

Connect the [standby.design MCP server](https://standby.design/docs/mcp) and tell the agent "Get the latest standby update" (in German: "Hol Dir das Update"). The agent calls the tool `update_project`. The tool returns the steps: run `npx standby-design-lint@latest init`, check `componentPaths` in `package.json` and commit the changed files.

The same server returns the rule texts through the tool `get_design_rules`, filtered by category. The rule texts are in German.

## What is checked, and how strictly

| Stage | When | What happens |
|---|---|---|
| Claude Code hook | after each edit or write | Lints the changed lines and reports back to the agent (exit code 2). The agent fixes them in the same session. |
| Pre-commit | before each commit | Lints the staged lines and warns (`--warn`). The commit goes through. |
| CI | on each pull request | Lints the lines added since the target branch. New violations fail the pull request. |
| Review skill | once per finished screen | Screenshots, text style count and a fresh review subagent. At most two rounds of fixes. |

Hook, pre-commit and CI make no LLM call. The review skill starts one subagent per screen.

Hook, pre-commit and CI check only new or changed lines. A project with existing violations does not turn red. To see all violations of a folder, run `npx standby-design-lint src`.

After an edit, the hook checks the edited lines. After a write of a whole file, it checks the whole file.

The hook works with Claude Code only. Cursor, Codex and other agents are covered by the pre-commit hook, the CI check and the rules block in `AGENTS.md`.

## Lint rules

The linked rule pages are in German. The link text is a short English description of the page.

| Rule | Finds | Rule page |
|---|---|---|
| `standby/no-raw-values` | `bg-[#fff]`, `p-[13px]`, `font-['Inter']`, `bg-blue-500`, `text-white` | [Values come from tokens](https://standby.design/docs/rules/farbe-werte-kommen-aus-tokens-nie-aus-der-hand) |
| `standby/no-inline-style` | Fixed values in `style={{ … }}`, `StyleSheet.create` | [Utility classes instead of inline styles](https://standby.design/docs/rules/stack-utility-klassen-statt-inline-styles) |
| `standby/no-state-classes-in-views` | `hover:`, `focus:`, `active:` outside the component folder | [Behavior and look are not rebuilt in the view](https://standby.design/docs/rules/bedienung-verhalten-und-aussehen-werden-nicht-in-der-ansicht-nachgebaut) |
| `standby/no-transition-all` | `transition-all`, `transition: all` | [Motion uses a token duration and never blocks](https://standby.design/docs/rules/bedienung-bewegung-hat-einen-wert-und-haelt-nichts-auf) |
| `standby/no-opacity-on-semantic-colors` | `bg-primary/10`, `hover:bg-primary/90` | [No opacity modifiers on semantic colors](https://standby.design/docs/rules/stack-keine-deckkraft-modifier-auf-semantischen-farben) |
| `standby/no-space-utilities` | `space-y-*`, `last:mb-0` | [Spacing through gap](https://standby.design/docs/rules/stack-abstand-ueber-gap-nicht-ueber-margins-am-kind) |
| `standby/no-disabled-by-validity` | `disabled={!isValid}`, `disabled={!isDirty}` | [A button is never disabled](https://standby.design/docs/rules/bedienung-ein-button-ist-nie-gesperrt) |
| `standby/no-click-on-non-interactive` | `<div onClick>`, `<span onClick>` | [Name and state live in the code](https://standby.design/docs/rules/bedienung-name-und-zustand-stehen-im-code) |

Classes are detected in the attributes `className`, `class` and `tw`, and in the helpers `cn()`, `clsx()`, `classnames()`, `classNames()`, `cva()`, `cx()`, `twMerge()`, `twJoin()` and `tv()`. A German list of which features of each design rule the lint can check is in [INVENTORY.md](https://github.com/KarstenKreh/Standby.Design/blob/master/packages/design-lint/INVENTORY.md).

## Exceptions

If a hit is intended, write a disable comment with the reason on the line before. The reason follows `--`.

```tsx
// eslint-disable-next-line standby/no-raw-values -- brand color from the logo guideline
export const Logo = () => <div className="bg-[#ff0000]">logo</div>;
```

Inside JSX, use a block comment:

```tsx
{/* eslint-disable-next-line standby/no-raw-values -- brand color from the logo guideline */}
<div className="bg-[#ff0000]">logo</div>
```

The comment covers the next line only. ESLint reports a disable comment that suppresses nothing. This report counts as a violation, so the CI check fails until you remove the comment.

If the project runs its own ESLint, add `recommended()` to its config (see Manual setup). Otherwise that ESLint reports the disable comment as an unknown rule.

## Settings

Settings go into `package.json`. `init` adds the block if it is missing and keeps it on later runs. All keys are optional, the `ignores` entry is an example:

```json
"standbyDesignLint": {
  "componentPaths": ["/components/ui/"],
  "allowedColors": [],
  "ignores": ["src/legacy/**"]
}
```

- `componentPaths` lists the folders where states like `hover:` are allowed. Put the folder of your base components here.
- `allowedColors` allows single colors of the Tailwind palette, for example `"white"`.
- `ignores` lists glob patterns of files to skip. `node_modules`, `dist`, `build`, `.next`, `coverage` and `*.d.ts` files are always skipped.

The CLI reads `standbyDesignLint` from the first `package.json` that has this key. It starts in the current folder and goes up. The hook starts in the folder of the edited file. The CLI does not read your ESLint configuration.

## Manual setup

`init` does all of this for you. These are the single pieces, in case you want to set them up yourself.

**Claude Code hook** in `.claude/settings.json`. The hook uses `--no-install`, so the package must be installed in the project. Exit code 2 sends the message back to the agent, which fixes it in the same session:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|MultiEdit|Write",
      "hooks": [{ "type": "command", "command": "npx --no-install standby-design-lint --hook", "timeout": 30 }]
    }]
  }
}
```

**Pre-commit**, for example with `husky` or `simple-git-hooks`. `--warn` reports violations but lets the commit through:

```sh
npx --no-install standby-design-lint --staged --warn
```

**CI**, in the pull request. The command checks the lines added since the base branch:

```sh
npx standby-design-lint --since origin/main
```

In GitHub Actions, check out the full history so that the base branch is available:

```yaml
on: pull_request

jobs:
  design-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npx --yes standby-design-lint --since origin/${{ github.base_ref }}
```

**ESLint**, if the project already has a flat config and you want the rules there too:

```js
import { recommended } from 'standby-design-lint';
export default [recommended({ componentPaths: ['/components/ui/'] })];
```

`recommended()` takes `componentPaths`, `allowedColors` and `files`.

## Review of a screen

The review needs Playwright. Install it once, then run the command with the URL of a running screen:

```sh
npm i -D playwright && npx playwright install --only-shell chromium
npx standby-design-lint review http://localhost:5173/settings
```

The command opens the page at 1280 and 375 pixels width. It saves a full-page screenshot for each width and a `report.md` in `.design-review/<screen>/`. The option `--out <folder>` changes the folder. The command exits with code 1 if the report contains violations.

The report counts the text styles of the screen. One style is one combination of font family, size, weight, color and text transform. The corridor is 4 to 7 styles, and the default is 5. More than 7 styles is a violation. More than 5 is a hint. The report also flags:

- Font sizes outside the type scale of the tokens.
- Styles without a role, while other styles on the screen have one.
- Two styles that are otherwise equal and sit only one step apart on the type scale. If the tokens declare fewer than 5 sizes, the limit is a size difference under 25%.
- A second font family that carries more than one role.

It checks the count against the rule [Every text style has a role](https://standby.design/docs/rules/typografie-jeder-textstil-hat-eine-rolle) (German).

The skill [design-review](https://github.com/KarstenKreh/Standby.Design/blob/master/packages/design-lint/skills/design-review/SKILL.md) guides the agent through the review. The agent runs the command, starts a fresh subagent with a checklist of seven points, and fixes the findings. It runs at most two rounds. `init` copies the skill to `.claude/skills/design-review/SKILL.md`.

### Text roles

The review recognizes a role by the attribute `data-text-role="meta"` or by the class `text-role-meta`, on the element or on an ancestor. The Type export of [standby.design/type](https://standby.design/type) provides the seven roles as CSS classes, as Tailwind v4 `@utility` rules and as design tokens:

| Role | Class | Type level | Notes |
|---|---|---|---|
| Title 1 | `text-role-title-1` | h1 | |
| Title 2 | `text-role-title-2` | h3 | |
| Title 3 | `text-role-title-3` | h5 | |
| Figure | `text-role-figure` | h2 | Regular weight, tabular numbers |
| Body | `text-role-body` | body-m | |
| Label | `text-role-label` | body-s | Weight 500 |
| Meta | `text-role-meta` | caption | |

The three titles sit two steps apart on the type scale.

## Short agent file block

`init` writes a short block into `AGENTS.md` and `CLAUDE.md`, between the markers `<!-- standby-design-lint:start -->` and `<!-- standby-design-lint:end -->`. It has three points. The rules themselves reach the agent through the hook, the MCP server and the skill. `init` writes the block in German. Here it is in English. If you add it by hand, keep the two markers, so a later `init` replaces the block and does not add a second one:

```md
<!-- standby-design-lint:start -->
## Design rules (standby.design)

- Colors, spacing, radii and font sizes come only from the design tokens of the project. Text gets a role (`text-role-*`) instead of a single size.
- The MCP tool `get_design_rules` from standby-design-mcp returns the rules, filtered by category. Fix messages from `standby-design-lint` right away. If a hit is intended, write the exception at that place with `eslint-disable-next-line` and a reason.
- Before a screen counts as finished, run the skill `design-review`.
<!-- standby-design-lint:end -->
```

## Commands

| Command | What it does |
|---|---|
| `standby-design-lint init` | Sets up or updates hook, pre-commit, CI, skill and agent instructions. |
| `standby-design-lint [paths…]` | Checks files or folders. The default is `src`. |
| `standby-design-lint --staged` | Checks only the staged lines (pre-commit). |
| `standby-design-lint --since <ref>` | Checks only the lines added since `<ref>`, for example `origin/main` (CI). |
| `standby-design-lint --hook` | Reads a Claude Code hook event from stdin and checks the edited file. |
| `standby-design-lint review <url>` | Takes screenshots and counts the text styles of a screen. |
| `--warn` | Reports violations but exits with code 0. |
