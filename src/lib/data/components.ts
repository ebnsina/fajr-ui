export type ComponentEntry = {
	slug: string;
	name: string;
	description: string;
	/** Whether this component exists in `$lib/components/ui` yet. */
	built?: boolean;
	isNew?: boolean;
};

/** Words that title case gets wrong; everything else is capitalised normally. */
const ACRONYMS: Record<string, string> = { otp: 'OTP' };

function toName(slug: string): string {
	return slug
		.split('-')
		.map((word) => ACRONYMS[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/** The component set, in alphabetical order. */
const entries: [slug: string, description: string, built?: boolean][] = [
	['accordion', 'Stacked sections that expand one at a time to reveal their contents.', true],
	['alert', 'An inline message that draws attention without interrupting the page.', true],
	['alert-dialog', 'A modal that blocks the page until the user answers it.', true],
	['autocomplete', 'A text field that narrows a list of suggestions as you type.', true],
	['avatar', 'A small portrait that falls back to initials when no image loads.', true],
	['badge', 'A compact label for status, counts and short metadata.', true],
	['breadcrumb', 'A trail of links showing where the current page sits in the hierarchy.', true],
	['button', 'A pressable control for the primary actions on a page.', true],
	['calendar', 'A month grid for picking a day, a range, or several dates.', true],
	['card', 'A bordered surface that groups related content into one block.', true],
	['chart', 'Bar, line and area plots that follow the theme and read to a screen reader.', true],
	['checkbox', 'A box the user ticks to turn a single option on or off.', true],
	['checkbox-group', 'Coordinates a set of checkboxes, including a select-all parent.', true],
	['collapsible', 'A region that a trigger shows and hides.', true],
	['combobox', 'A text field paired with a filtered list of choices.', true],
	['command', 'A searchable palette for jumping to pages and running actions.', true],
	['context-menu', 'Actions that open at the pointer on right click or long press.', true],
	['date-picker', 'A text field that opens a calendar for choosing a date.', true],
	['dialog', 'A window layered over the page for focused tasks.', true],
	['drawer', 'A panel that slides in from an edge and can be swiped away.', true],
	['empty', 'A placeholder that explains why a region has nothing in it.', true],
	['field', 'Wires a control to its label, hint and error message.', true],
	['fieldset', 'Groups related fields under a shared caption.', true],
	['form', 'Collects fields into a submission, with validation and errors handled.', true],
	['frame', 'A panel with a header and body for framing a block of content.', true],
	['group', 'Joins adjacent controls into a single seamless unit.', true],
	['input', 'A single-line text field.', true],
	['input-group', 'Attaches icons, buttons or text to the edges of a field.', true],
	['kbd', 'Renders a keyboard key or shortcut inline.', true],
	['label', 'A caption bound to the control it names.', true],
	['menu', 'A dropdown list of actions with full keyboard navigation.', true],
	['meter', 'Shows where a measured value sits within a known range.', true],
	['number-field', 'A numeric field with steppers and drag-to-adjust.', true],
	['otp-field', 'Separate boxes for entering a one-time code.', true],
	['pagination', 'Page links with previous and next controls.', true],
	['popover', 'A floating panel anchored to the control that opened it.', true],
	['preview-card', 'A small preview that appears when a link is hovered.', true],
	['progress', 'A bar showing how far along a task is.', true],
	['radio-group', 'A set of options where exactly one can be selected.', true],
	['scroll-area', 'A scrolling region with styled scrollbars.', true],
	['select', 'A dropdown for choosing one value from a fixed list.', true],
	['separator', 'A rule dividing content, announced to screen readers.', true],
	['sheet', 'A dialog that enters from the side of the screen.', true],
	['skeleton', 'A shimmering placeholder shown while content loads.', true],
	['slider', 'A track and handle for picking a value in a range.', true],
	['spinner', 'A rotating indicator for work in progress.', true],
	['switch', 'A toggle for settings that apply the moment they change.', true],
	['data-table', 'A table with search, filtering, sorting, pagination and virtualised rows.', true],
	['table', 'Rows and columns for tabular data.', true],
	['tabs', 'Switches between panels that share the same space.', true],
	['textarea', 'A multi-line text field that grows with its content.', true],
	['toast', 'A brief message that appears and dismisses itself.', true],
	['toggle', 'A button that stays pressed to represent an on state.', true],
	['toggle-group', 'A row of toggles sharing one selection state.', true],
	['toolbar', 'A strip of grouped controls with arrow-key navigation.', true],
	['tooltip', 'A short hint shown when a control is hovered or focused.', true],
	['virtual-list', 'Renders only the rows in view, so a list of any length stays fast.', true]
];

export const components: ComponentEntry[] = entries.map(([slug, description, built]) => ({
	slug,
	name: toName(slug),
	description,
	built
}));

/** Added for the dashboard shell, after the list above was written. */
components.push({
	slug: 'sidebar',
	name: 'Sidebar',
	description: 'A collapsible navigation panel for application shells.',
	built: true
});

/** Carries the "New" badge on the catalogue until the next release lands. */
const RECENT = new Set(['chart', 'virtual-list']);
for (const entry of components) entry.isNew = RECENT.has(entry.slug) || undefined;

export const builtComponents: ComponentEntry[] = components.filter((entry) => entry.built);

export function getComponent(slug: string): ComponentEntry | undefined {
	return components.find((entry) => entry.slug === slug);
}

/**
 * The catalogue's shelves, in reading order.
 *
 * The roster above is alphabetical, which is the right order to look something
 * up in and the wrong one to browse: it puts Accordion beside Alert and Table
 * beside Tabs, so nothing about the list tells you what a component is *for*.
 * These groups are the browsing order, and the index on the home page reads
 * from them.
 *
 * Every built component belongs to exactly one shelf, and a test enforces that
 * — a component added to the roster without a shelf would otherwise vanish from
 * the home page with nothing failing to say so.
 */
export const CATEGORIES: { name: string; blurb: string; slugs: string[] }[] = [
	{
		name: 'Forms',
		blurb: 'Taking input, and telling the reader what went wrong.',
		slugs: [
			'autocomplete',
			'checkbox',
			'checkbox-group',
			'combobox',
			'date-picker',
			'field',
			'fieldset',
			'form',
			'input',
			'input-group',
			'label',
			'number-field',
			'otp-field',
			'radio-group',
			'select',
			'slider',
			'switch',
			'textarea',
			'toggle',
			'toggle-group'
		]
	},
	{
		name: 'Actions',
		blurb: 'The things a reader presses, and the menus behind them.',
		slugs: ['button', 'command', 'context-menu', 'group', 'menu', 'toolbar']
	},
	{
		name: 'Overlays',
		blurb: 'Surfaces that arrive over the page and hand focus back when they leave.',
		slugs: ['alert-dialog', 'dialog', 'drawer', 'popover', 'preview-card', 'sheet', 'tooltip']
	},
	{
		name: 'Navigation',
		blurb: 'Saying where the reader is, and moving them somewhere else.',
		slugs: ['breadcrumb', 'pagination', 'sidebar', 'tabs']
	},
	{
		name: 'Data',
		blurb: 'Rows, series and long lists that stay fast and stay readable.',
		slugs: ['calendar', 'chart', 'data-table', 'table', 'virtual-list']
	},
	{
		name: 'Feedback',
		blurb: 'Progress, state and the messages that report it.',
		slugs: ['alert', 'empty', 'meter', 'progress', 'skeleton', 'spinner', 'toast']
	},
	{
		name: 'Layout',
		blurb: 'Surfaces, dividers and the containers everything else sits in.',
		slugs: [
			'accordion',
			'avatar',
			'badge',
			'card',
			'collapsible',
			'frame',
			'kbd',
			'scroll-area',
			'separator'
		]
	}
];

/** The roster regrouped onto its shelves, ready to render. */
export const shelves = CATEGORIES.map((category) => ({
	...category,
	components: category.slugs
		.map((slug) => components.find((component) => component.slug === slug))
		.filter((component): component is ComponentEntry => Boolean(component))
}));
