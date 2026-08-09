# fajr-ui

Copy [Fajr UI](https://fajr-ui.dev) components into your project and keep them up to date.

Nothing is installed at runtime. `fajr-ui add` writes real files into your source tree, which you
then own outright — read them, edit them, delete the parts you do not want. The CLI's job is to get
them in and, later, to tell you what has changed upstream without trampling the changes you made.

The package itself has no dependencies.

## Getting started

```sh
npx fajr-ui init
npx fajr-ui add button dialog
```

`init` writes `fajr-ui.json`, which records the two paths components are resolved against — where
components land, and where their shared helpers land. Because both are yours to choose, a project
can put components anywhere while `$lib/utils` still arrives where their imports expect it.

`add` copies a component in along with whatever it composes, so asking for one thing that is built
out of three gets you all four.

## Commands

| Command              | What it does                                                  |
| -------------------- | ------------------------------------------------------------- |
| `init`               | Write `fajr-ui.json` with the paths to install into            |
| `add <name...>`      | Copy components in, with whatever they compose                 |
| `list`               | Show every component, and which you have installed             |
| `outdated [name...]` | Show what has changed upstream since you installed             |
| `diff [name...]`     | Show those changes line by line                                |
| `update [name...]`   | Apply them, leaving files you have edited alone                |
| `skill`              | Write the agent instructions into this project                 |

| Option             | What it does                          |
| ------------------ | ------------------------------------- |
| `--dry-run`        | Report what would happen, write nothing |
| `--force`          | Replace files you have edited too       |
| `-y`, `--yes`      | Skip prompts                            |
| `--registry=<url>` | Read from a different registry          |
| `-v`, `--version`  | Print the version                       |

## Keeping your edits

Updating a component you have customised is the case that usually goes wrong, so the CLI is
deliberate about it. As it writes each file it records a hash of exactly what it wrote — never of
what it finds on disk later. `update` replaces only the files that still match; anything you have
touched is reported and left alone until you pass `--force`.

Recording what was written rather than what is on disk is the whole point. Adopting your edit as the
baseline would make the file look merely out of date, and it would be overwritten a run later.

Use `outdated` to see which components have moved, and `diff` to read the change before taking it.

## Working with agents

`npx fajr-ui skill` writes the component instructions into your project so a coding agent has the
API in front of it. The same content is served at [`/llms.txt`](https://fajr-ui.dev/llms.txt), with
every component inline at [`/llms-full.txt`](https://fajr-ui.dev/llms-full.txt).

## Configuration

`FAJR_UI_REGISTRY` or `--registry=<url>` points the CLI at a different registry — useful for a
private fork, or for testing against a local build of the site.

`NO_COLOR` disables colour; `FORCE_COLOR` keeps it through a pipe.

## Licence

MIT
