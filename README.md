# Fajr UI

Accessible Svelte components you copy into your project and own outright.

Nothing is installed at runtime. The CLI writes real files into your source tree — read them, edit
them, delete the parts you do not want. Later it can tell you what has changed upstream and merge it
in without touching the lines you wrote.

Built for **Svelte 5** and **Tailwind v4**.

```sh
npx fajr-ui init
npx fajr-ui add button dialog
```

Documentation, every component and the live examples: **https://ebnsina.github.io/fajr-ui**

## What is in here

One SvelteKit app serves all three of these, which is the point — none of them can drift from the
others.

| Path                    | What it is                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| `src/lib/components/ui` | The library. The components users copy.                                                             |
| `src/routes/(site)`     | The documentation site, plus full example apps under `src/routes/examples`.                         |
| `cli/`                  | The CLI, published to npm as [`fajr-ui`](https://www.npmjs.com/package/fajr-ui). Zero dependencies. |

The registry the CLI reads from is generated at build time from the same component sources the site
renders, so a component cannot be documented one way and shipped another.

## Working on it

```sh
pnpm install
pnpm dev            # localhost:5173
pnpm check          # svelte-check, must report 0 errors
pnpm lint
pnpm test           # unit, component and end-to-end
pnpm build          # prerenders the whole site into build/
```

`AGENTS.md` holds the house rules — accessibility standards, the token system, and which files are
generated and must not be edited by hand. `CLAUDE.md` covers the architecture. Read both before
changing anything under `src/lib`.

## Licence

MIT
