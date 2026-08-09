export type ChangeKind = 'added' | 'changed' | 'fixed' | 'removed';

/**
 * An entry is either a plain sentence, or a lead-in and the detail behind it —
 * the second form so the docs page can set the lead in bold without the data
 * carrying markup.
 */
export type ChangeEntry = string | { lead: string; text: string };

export type ChangeGroup = {
	kind: ChangeKind;
	entries: ChangeEntry[];
};

export type Release = {
	version: string;
	/** ISO date. */
	date: string;
	summary?: string;
	changes: ChangeGroup[];
};

export const CHANGE_KIND_LABEL: Record<ChangeKind, string> = {
	added: 'Added',
	changed: 'Changed',
	fixed: 'Fixed',
	removed: 'Removed'
};

/**
 * Single source of truth for the changelog. The docs page renders it, and
 * `pnpm changelog` writes CHANGELOG.md from it, so the two cannot drift.
 */
export const releases: Release[] = [
	{
		version: '1.0.0',
		date: '2026-08-07',
		summary: 'The first release — 55 components, ready to use.',
		changes: [
			{
				kind: 'added',
				entries: [
					{
						lead: 'Forms.',
						text: 'Button, Input, Textarea, Select, Checkbox, Radio Group, Checkbox Group, Switch, Slider, Number Field, OTP Field, Date Picker, Combobox, Autocomplete, Toggle, Toggle Group, Input Group, Field, Fieldset and Form. Every control pairs with a label, a description and an error message, and a form that fails validation moves focus to the first field that needs attention.'
					},
					{
						lead: 'Overlays.',
						text: 'Dialog, Sheet, Drawer, Popover, Tooltip, Preview Card, Menu, Context Menu and Command. Focus stays inside while they are open and returns to where you came from when they close. Menus support submenus, and moving the pointer diagonally toward one will not close it.'
					},
					{
						lead: 'Feedback.',
						text: 'Toast, Alert, Progress, Meter, Spinner, Skeleton, Badge and Empty. Toasts collapse into a neat stack, expand when you hover them, pause their timers while you read, and can be swiped away.'
					},
					{
						lead: 'Layout and navigation.',
						text: 'Card, Frame, Separator, Accordion, Collapsible, Tabs, Table, Breadcrumb, Pagination, Toolbar, Avatar, Aspect Ratio, Scroll Area, Kbd, Calendar and Sidebar.'
					},
					{
						lead: 'Composable parts.',
						text: 'Alongside the simple form of each component, the pieces are exported on their own — so a command palette, combobox, dialog, sheet or drawer can be laid out however your design needs, without dropping to raw markup. Popover, Preview Card, Sheet, Avatar, Progress, Meter, Toolbar, Group, Kbd, Toggle Group and Input Group all expose their pieces, so a trigger no longer needs a hand-wired ref and a bar can carry its own label and readout.'
					},
					{
						lead: 'No layout shift.',
						text: 'Controls whose contents change keep their size: the calendar reserves six week rows so paging months never moves what is below it, and pagination always renders the same number of slots with tabular figures, so walking through pages does not resize the control.'
					},
					{
						lead: 'Accessibility',
						text: 'is built in rather than bolted on. Keyboard support, screen-reader labelling and focus handling come with every component, and animation respects the reduced-motion setting.'
					},
					{
						lead: 'Light and dark themes',
						text: 'driven by design tokens, so recolouring the whole library is a handful of CSS variables.'
					},
					{
						lead: 'Three accents.',
						text: 'Black by default, with Orange and Blue to switch to, chosen on the Theming page. An accent changes only the primary surface, its text, the focus ring and the hue the chart palette is built from, so it cannot disturb contrast elsewhere. Both clear 4.5:1 for their label and 3:1 against the page in light and dark, and both behave the same way — white text in light, near-black in dark — so neither needs a special case.'
					},
					{
						lead: 'Command palette footer.',
						text: 'The results sit on a raised CommandPanel over a muted ground, with the search row above and a `footer` hint bar below. Items take a leading icon.'
					},
					{
						lead: 'Tabs and Table variants.',
						text: 'Tabs gained a sliding indicator measured from the active tab, an underline variant and a vertical orientation with matching arrow keys. Table gained a card variant that lifts the body onto its own surface.'
					},
					{
						lead: 'A documentation site',
						text: 'with a live example, a props table and usage notes for every component, plus pages for theming, styling and the CLI. Code samples are syntax highlighted during rendering, so they arrive coloured with no highlighting work left for the browser.'
					},
					{
						lead: 'Input Group alignment.',
						text: 'Addons sit against the start, end, top or bottom edge via `align`, and the field takes the space they leave.'
					},
					{
						lead: 'Data Table.',
						text: "Search, faceted filters, sorting and pagination, with worked examples for both client-side and server-side data. Built on TanStack Table v9 for the state and TanStack Pacer for the debounced search; the markup is this library's own. The Dependencies section on its page names every package, the version it was built against and a link to the upstream API."
					},
					{
						lead: 'A CLI.',
						text: '`npx fajr-ui add dialog` copies a component in along with whatever it composes. Updating is the part that matters: a lockfile records the hash of every file as it is written, so `outdated`, `diff` and `update` can bring changes in while leaving anything you have edited untouched — and the record never adopts your edit as the new baseline.'
					},
					{
						lead: 'Charts.',
						text: 'Bar, line, area and stacked plots that take their colours from the theme. The series palette is generated from the accent rather than fixed — the first series sits on the accent’s own hue and the rest are rotated away from it, so a single-series chart is on brand and a multi-series one never has two colours you cannot tell apart. Contrast holds whichever accent is in force: the worst case is 4.55:1 in light and 7.63:1 in dark, against the 3:1 that applies to anything non-text. Each plot carries a required one-sentence label, so it is not a blank region to a screen reader. Built on TanStack Charts, which is pre-alpha: every import of it sits behind one file, and the version is pinned exactly.'
					},
					{
						lead: 'Your package manager.',
						text: 'Every command in the documentation is written for pnpm, npm, yarn or bun — pick once and the whole site follows, including the runner, which each of them spells differently: `pnpm dlx`, `npx`, `yarn dlx`, `bunx`. pnpm is the default.'
					},
					{
						lead: 'Install from anywhere.',
						text: 'Every component page now shows both routes side by side — a CLI tab with its exact `npx fajr-ui add` command, and a Manual tab with the packages and the path to copy from. The command palette carries it too: highlight a component and the footer shows its install command, with ⌘C to copy, so adding one never needs a trip to its page.'
					},
					{
						lead: 'Virtual List.',
						text: 'Renders only the rows in view, so a list of fifty thousand costs the same as one of thirty. Rows carry `aria-setsize` and `aria-posinset`, so a screen reader announces the position in the whole list rather than in the rendered slice, and the scroller is focusable so its content is reachable without a pointer. A single translated container moves the window rather than positioning every row absolutely. No dependency — the arithmetic is the component.'
					},
					{
						lead: 'Composable Pagination.',
						text: 'The control now ships as parts as well as one tag, and `usePagination()` exposes the computed page window — so laying it out yourself does not mean reimplementing the ellipsis logic, which was the reason it stayed monolithic. The one-tag form is built from the same parts, so there is no second implementation to keep in step.'
					},
					{
						lead: 'Tooltip in two forms.',
						text: 'The action still attaches a plain string to any element without a wrapper. Alongside it, a component for when the body needs markup: the trigger is your own element and the props are spread onto it, so nothing is wrapped, sibling selectors keep working, and `aria-describedby` lands on the element that actually takes focus.'
					},
					{
						lead: 'Right to left.',
						text: 'Setting `dir="rtl"` is the whole of it — components use logical properties throughout, so margins, padding, borders, radii and alignment flip without a second stylesheet. The parts that cannot be logical are handled too: the switch thumb has a mirrored transform, directional chevrons in Breadcrumb, Pagination, Calendar, submenus and the Sidebar trigger are flipped, and arrow keys follow what the reader sees, so Left advances a tablist, toolbar, slider or calendar laid out from the right. Code is forced back to left-to-right wherever it appears, and prose takes its direction from its own first strong character, so an English paragraph on an Arabic page keeps its punctuation. A documentation page demonstrates it in Arabic, Hebrew and Persian, with the direction set on one wrapper rather than on the document.'
					},
					{
						lead: 'Built for AI agents.',
						text: '`npx fajr-ui skill` writes an agent skill and an AGENTS.md block into your project, so a coding agent knows the import path, that this is Svelte 5 with runes, and to use tokens rather than literal colours — the things it otherwise gets wrong. The documentation is also served as plain text: `/llms.txt` indexes it, `/llms-full.txt` has every component inline, and each component is at its page URL plus `.md`, so fetching one costs a single request. All of it is generated from the same modules the site renders, so it cannot drift from the API it describes.'
					},
					{
						lead: 'Pinned dependencies.',
						text: 'Every third-party package is recorded at an exact version in one table, and the CLI installs those versions rather than whatever is latest that day. A check fails the build if that table and package.json ever disagree, so the version on the documentation page, the one the CLI installs and the one in the lockfile cannot drift apart.'
					},
					{
						lead: 'Portable tokens.',
						text: "Every design token is now a literal value rather than a reference to Tailwind's palette, so the theme file stands alone and a whole palette can be swapped in one place."
					},
					{
						lead: 'An examples gallery',
						text: 'of complete screens built from the library. Every example gets the same treatment — a page covering its anatomy, how each part works, and then the demo itself. The calendar has month, week, day and agenda views, overlapping events, an all-day row, a live now indicator, week numbers, drag to reschedule, event creation, seven locales with the right week start and clock, and keyboard navigation — all assembled from these components rather than a calendar package. Alongside it, a dashboard shell in two layouts, and a marketing page with a tabbed product preview, pricing on a billing toggle and an FAQ, none of which shifts the layout as you use it.'
					},
					{
						lead: 'Built for touch.',
						text: "Every control clears a 44px hit target on a coarse pointer without changing size on a mouse, fields are 16px on phones so iOS does not zoom on focus, overlays cap to the viewport and leave a gutter to dismiss, toasts and edge sheets clear the notch and home indicator, and the platform tap-flash is suppressed in favour of each component's own pressed state."
					},
					{
						lead: 'Contrast checked in both themes.',
						text: 'Every text colour clears the 4.5:1 floor against the surface it sits on, in light and dark.'
					}
				]
			}
		]
	}
];
