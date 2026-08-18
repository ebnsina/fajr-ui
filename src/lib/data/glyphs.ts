/**
 * Wireframes for the home page catalogue.
 *
 * The catalogue used to mount the real component in every card, which is the
 * honest thing to do and the wrong thing to do at this size: 58 live instances
 * on the first screen of the site, several of them mounting a calendar or a
 * chart, and each one either cropped or scaled to a size it was never designed
 * for. What a reader takes from a 140-pixel tile is the *shape* of the thing —
 * a field is a bar over a box, a menu is a panel of rows — and a drawing says
 * that faster than a working copy of it does.
 *
 * So each component maps to an archetype, and each archetype is a list of
 * rectangles. Rectangles only: a circle is a rectangle whose radius is half its
 * side, which keeps the renderer to one element type and the data to one shape.
 *
 * Archetypes are shared on purpose. Checkbox Group and Radio Group differ by a
 * corner radius; Collapsible and Accordion draw the same picture because they
 * *are* the same picture. Inventing a distinct glyph for every slug would mean
 * 58 drawings that differ by noise, and noise is what a wireframe exists to
 * remove.
 */

/**
 * `[x, y, width, height, radius, tone]` in a 120×64 space.
 *
 * A tuple rather than an object because these are read in bulk — a screenful of
 * `{ x: 8, y: 10, width: 34 … }` hides the drawing inside its own punctuation.
 */
export type Rect = [number, number, number, number, number, Tone?];

/**
 * A stroked path, for the parts of a control that are a mark rather than a
 * surface: a tick, a chevron, the ring and handle of a magnifier. Drawn as
 * rectangles those read as dashes and blobs, which is most of what separates a
 * wireframe from a loading placeholder.
 */
export type Path = { d: string; tone?: Tone };

export type Shape = Rect | Path;

/** `0` a faint fill, `1` the emphasised part, `2` an outline with no fill. */
export type Tone = 0 | 1 | 2;

export type Archetype = keyof typeof GLYPHS;

export const GLYPHS = {
	field: [
		[8, 10, 34, 7, 3, 1],
		[8, 24, 104, 24, 6, 2],
		[18, 33, 46, 6, 3, 0]
	],
	label: [
		[8, 20, 52, 10, 5, 1],
		[8, 38, 82, 7, 3, 0]
	],
	select: [[8, 20, 104, 24, 6, 2], [18, 29, 44, 6, 3, 0], { d: 'M93 30 98 35 103 30', tone: 1 }],
	checkbox: [
		[8, 24, 16, 16, 4, 2],
		{ d: 'M12 32.5 14.8 35.2 20 29.4', tone: 1 },
		[32, 29, 56, 6, 3, 0]
	],
	checks: [
		[8, 10, 12, 12, 3, 2],
		{ d: 'M11 16.2 13.1 18.3 17 14.1', tone: 1 },
		[26, 13, 62, 6, 3, 1],
		[8, 28, 12, 12, 3, 2],
		[26, 31, 48, 6, 3, 0],
		[8, 46, 12, 12, 3, 2],
		[26, 49, 56, 6, 3, 0]
	],
	radios: [
		[8, 10, 12, 12, 6, 2],
		[11, 13, 6, 6, 3, 1],
		[26, 13, 62, 6, 3, 1],
		[8, 28, 12, 12, 6, 2],
		[26, 31, 48, 6, 3, 0],
		[8, 46, 12, 12, 6, 2],
		[26, 49, 56, 6, 3, 0]
	],
	toggleSwitch: [
		[30, 22, 44, 20, 10, 2],
		[56, 26, 12, 12, 6, 1]
	],
	slider: [
		[8, 30, 104, 4, 2, 0],
		[8, 30, 58, 4, 2, 1],
		[60, 26, 12, 12, 6, 1]
	],
	segments: [
		[8, 20, 104, 24, 6, 2],
		[12, 24, 32, 16, 4, 1],
		[48, 24, 32, 16, 4, 0],
		[84, 24, 24, 16, 4, 0]
	],
	group: [
		[8, 22, 36, 20, 6, 1],
		[46, 22, 36, 20, 6, 0],
		[84, 22, 28, 20, 6, 0]
	],
	button: [[34, 22, 52, 20, 8, 1]],
	toggle: [
		[46, 20, 28, 24, 6, 1],
		[54, 30, 12, 4, 2, 0]
	],
	toolbar: [
		[8, 22, 104, 20, 6, 2],
		[14, 26, 12, 12, 3, 1],
		[30, 26, 12, 12, 3, 0],
		[46, 26, 12, 12, 3, 0],
		[64, 27, 2, 10, 1, 0],
		[72, 26, 12, 12, 3, 0],
		[88, 26, 12, 12, 3, 0]
	],
	dialog: [
		[14, 10, 92, 44, 8, 2],
		[24, 18, 42, 6, 3, 1],
		[24, 30, 68, 5, 2, 0],
		[74, 42, 22, 8, 4, 1]
	],
	alertDialog: [
		[14, 10, 92, 44, 8, 2],
		[24, 18, 44, 6, 3, 1],
		[24, 30, 68, 5, 2, 0],
		[50, 41, 24, 9, 4, 0],
		[78, 41, 22, 9, 4, 1]
	],
	sheet: [
		[8, 6, 48, 52, 8, 0],
		[62, 6, 50, 52, 8, 2],
		[70, 16, 28, 6, 3, 1],
		[70, 28, 34, 5, 2, 0],
		[70, 38, 24, 5, 2, 0]
	],
	drawer: [
		[8, 6, 104, 22, 8, 0],
		[8, 32, 104, 26, 8, 2],
		[52, 37, 16, 4, 2, 1],
		[20, 47, 52, 5, 2, 0]
	],
	popover: [
		[8, 6, 72, 32, 8, 2],
		[16, 14, 44, 5, 2, 1],
		[16, 24, 32, 5, 2, 0],
		[16, 44, 28, 14, 7, 1]
	],
	previewCard: [
		[16, 10, 88, 44, 8, 2],
		[24, 18, 16, 16, 8, 1],
		[46, 20, 44, 6, 3, 0],
		[46, 30, 50, 5, 2, 0],
		[24, 42, 64, 5, 2, 0]
	],
	tooltip: [
		[30, 12, 60, 20, 8, 1],
		[56, 32, 8, 5, 2, 1],
		[44, 44, 32, 12, 6, 0]
	],
	menu: [
		[24, 6, 72, 52, 8, 2],
		[32, 14, 52, 6, 3, 1],
		[32, 26, 52, 6, 3, 0],
		[32, 36, 40, 6, 3, 0],
		[32, 46, 46, 6, 3, 0]
	],
	contextMenu: [
		[40, 10, 64, 44, 8, 2],
		[48, 18, 44, 5, 2, 1],
		[48, 28, 36, 5, 2, 0],
		[48, 38, 40, 5, 2, 0],
		[28, 4, 9, 14, 2, 1]
	],
	command: [
		[8, 6, 104, 52, 8, 2],
		[16, 14, 88, 10, 5, 0],
		[22, 16, 6, 6, 3, 2],
		{ d: 'M27 21 29 23', tone: 1 },
		[16, 30, 88, 6, 3, 1],
		[16, 40, 72, 6, 3, 0],
		[16, 50, 60, 6, 3, 0]
	],
	search: [
		[8, 6, 104, 20, 6, 2],
		[16, 11, 9, 9, 4.5, 2],
		{ d: 'M24 19 27 22', tone: 1 },
		[33, 13, 46, 6, 3, 0],
		[8, 32, 104, 9, 4, 0],
		[8, 46, 84, 9, 4, 0]
	],
	list: [
		[8, 8, 104, 12, 4, 1],
		[8, 26, 104, 12, 4, 0],
		[8, 44, 104, 12, 4, 0]
	],
	scrollArea: [
		[8, 8, 86, 10, 4, 0],
		[8, 24, 86, 10, 4, 0],
		[8, 40, 86, 10, 4, 0],
		[104, 8, 6, 48, 3, 0],
		[104, 8, 6, 20, 3, 1]
	],
	table: [
		[8, 8, 104, 10, 3, 1],
		[8, 24, 104, 8, 3, 0],
		[8, 36, 104, 8, 3, 0],
		[8, 48, 104, 8, 3, 0]
	],
	dataTable: [
		[8, 4, 44, 12, 5, 2],
		[86, 4, 26, 12, 5, 0],
		[8, 22, 104, 10, 3, 1],
		[8, 36, 104, 8, 3, 0],
		[8, 48, 104, 8, 3, 0]
	],
	chart: [
		[12, 38, 14, 20, 3, 0],
		[34, 28, 14, 30, 3, 0],
		[56, 18, 14, 40, 3, 1],
		[78, 32, 14, 26, 3, 0],
		[100, 24, 12, 34, 3, 0],
		{ d: 'M19 38 41 28 63 18 85 32 106 24', tone: 1 }
	],
	calendar: [
		[8, 6, 104, 10, 4, 1],
		{ d: 'M20 9 17 11 20 13' },
		{ d: 'M100 9 103 11 100 13' },
		[13, 22, 10, 8, 2, 0],
		[27, 22, 10, 8, 2, 0],
		[41, 22, 10, 8, 2, 1],
		[55, 22, 10, 8, 2, 0],
		[69, 22, 10, 8, 2, 0],
		[83, 22, 10, 8, 2, 0],
		[97, 22, 10, 8, 2, 0],
		[13, 36, 10, 8, 2, 0],
		[27, 36, 10, 8, 2, 0],
		[41, 36, 10, 8, 2, 0],
		[55, 36, 10, 8, 2, 0],
		[69, 36, 10, 8, 2, 0],
		[83, 36, 10, 8, 2, 0],
		[97, 36, 10, 8, 2, 0],
		[13, 50, 10, 8, 2, 0],
		[27, 50, 10, 8, 2, 0],
		[41, 50, 10, 8, 2, 0],
		[55, 50, 10, 8, 2, 0]
	],
	datePicker: [
		[8, 4, 104, 16, 5, 2],
		[18, 9, 40, 6, 3, 0],
		[92, 8, 12, 8, 2, 1],
		[13, 28, 10, 8, 2, 0],
		[27, 28, 10, 8, 2, 0],
		[41, 28, 10, 8, 2, 1],
		[55, 28, 10, 8, 2, 0],
		[69, 28, 10, 8, 2, 0],
		[83, 28, 10, 8, 2, 0],
		[97, 28, 10, 8, 2, 0],
		[13, 42, 10, 8, 2, 0],
		[27, 42, 10, 8, 2, 0],
		[41, 42, 10, 8, 2, 0],
		[55, 42, 10, 8, 2, 0],
		[69, 42, 10, 8, 2, 0]
	],
	progress: [
		[8, 28, 104, 8, 4, 0],
		[8, 28, 66, 8, 4, 1]
	],
	spinner: [
		[44, 16, 32, 32, 16, 2],
		// Three quarters of the same circle, drawn over the ring. A spinner is the
		// gap, not the ring — a full circle with a bright dot beside it read as a
		// radio button with a smudge.
		{ d: 'M76 32 A16 16 0 1 0 60 48', tone: 1 }
	],
	avatar: [
		[44, 8, 32, 32, 16, 2],
		[54, 15, 12, 12, 6, 0],
		[49, 31, 22, 9, 4, 0],
		[40, 48, 40, 7, 3, 0]
	],
	badge: [[40, 24, 40, 16, 8, 1]],
	kbd: [
		[44, 20, 32, 24, 5, 2],
		[52, 30, 16, 4, 2, 1]
	],
	separator: [
		[8, 10, 104, 8, 4, 0],
		[8, 30, 104, 3, 1, 1],
		[8, 44, 104, 8, 4, 0]
	],
	accordion: [
		[8, 6, 104, 14, 6, 2],
		[16, 11, 40, 5, 2, 1],
		{ d: 'M95 11 99 15 103 11' },
		[8, 24, 104, 34, 6, 2],
		[16, 31, 56, 5, 2, 1],
		{ d: 'M95 35 99 31 103 35', tone: 1 },
		[16, 43, 72, 5, 2, 0]
	],
	breadcrumb: [
		[8, 28, 28, 8, 4, 0],
		{ d: 'M42 29 46 32 42 35' },
		[52, 28, 28, 8, 4, 0],
		{ d: 'M86 29 90 32 86 35' },
		[96, 28, 16, 8, 4, 1]
	],
	pagination: [
		{ d: 'M18 28 13 32 18 36' },
		[30, 24, 16, 16, 4, 0],
		[52, 24, 16, 16, 4, 1],
		[74, 24, 16, 16, 4, 0],
		{ d: 'M102 28 107 32 102 36' }
	],
	sidebar: [
		[8, 6, 34, 52, 6, 2],
		[14, 14, 22, 5, 2, 1],
		[14, 24, 22, 5, 2, 0],
		[14, 34, 16, 5, 2, 0],
		[48, 6, 64, 52, 6, 0]
	],
	tabs: [
		[8, 8, 32, 12, 4, 1],
		[44, 8, 32, 12, 4, 0],
		[80, 8, 32, 12, 4, 0],
		[8, 26, 104, 32, 6, 2]
	],
	alert: [
		[8, 14, 104, 36, 6, 2],
		[16, 22, 14, 14, 7, 1],
		[38, 22, 52, 6, 3, 0],
		[38, 34, 66, 5, 2, 0]
	],
	empty: [
		[20, 8, 80, 48, 8, 2],
		[52, 20, 16, 16, 4, 2],
		{ d: 'M56 28 64 28 M60 24 60 32', tone: 1 },
		[44, 44, 32, 5, 2, 0]
	],
	toast: [
		[8, 6, 104, 30, 8, 0],
		[44, 42, 68, 16, 6, 2],
		[52, 48, 32, 4, 2, 1]
	],
	card: [
		[16, 8, 88, 48, 8, 2],
		[24, 16, 72, 16, 4, 0],
		[24, 38, 52, 6, 3, 1],
		[24, 48, 36, 5, 2, 0]
	],
	frame: [
		[16, 8, 88, 48, 8, 2],
		[24, 16, 72, 32, 6, 0]
	],
	text: [
		[8, 16, 104, 9, 4, 0],
		[8, 31, 88, 9, 4, 0],
		[8, 46, 64, 9, 4, 0]
	],
	textarea: [
		[8, 8, 104, 48, 6, 2],
		[16, 16, 80, 5, 2, 0],
		[16, 26, 88, 5, 2, 0],
		[16, 36, 64, 5, 2, 0]
	],
	otp: [
		[16, 20, 18, 24, 5, 2],
		[42, 20, 18, 24, 5, 2],
		[68, 20, 18, 24, 5, 2],
		[94, 20, 18, 24, 5, 2],
		[22, 27, 6, 10, 3, 1]
	],
	stepper: [
		[8, 20, 104, 24, 6, 2],
		[18, 29, 30, 6, 3, 0],
		{ d: 'M93 28 97 24 101 28', tone: 1 },
		{ d: 'M93 36 97 40 101 36', tone: 1 }
	],
	inputGroup: [
		[8, 20, 104, 24, 6, 2],
		[12, 24, 18, 16, 4, 1],
		[36, 29, 44, 6, 3, 0],
		[90, 24, 18, 16, 4, 0]
	],
	form: [
		[8, 4, 104, 16, 5, 2],
		[8, 24, 104, 16, 5, 2],
		[76, 46, 36, 14, 7, 1]
	],
	fieldset: [
		[8, 12, 104, 44, 6, 2],
		[16, 4, 36, 9, 4, 1],
		[16, 24, 88, 10, 4, 0],
		[16, 40, 88, 10, 4, 0]
	]
} satisfies Record<string, Shape[]>;

/**
 * Which drawing stands for which component.
 *
 * Written out per slug rather than derived from the shelf, because the shelf
 * says what a component is *for* and this says what it *looks like* — Combobox
 * and Slider share a shelf and could not share a picture.
 *
 * A slug missing from here is a build-time type error rather than a blank card:
 * every entry in the roster is required, and a test checks the roster against
 * this map.
 */
export const ARCHETYPES: Record<string, Archetype> = {
	accordion: 'accordion',
	alert: 'alert',
	'alert-dialog': 'alertDialog',
	autocomplete: 'search',
	avatar: 'avatar',
	badge: 'badge',
	breadcrumb: 'breadcrumb',
	button: 'button',
	calendar: 'calendar',
	card: 'card',
	chart: 'chart',
	checkbox: 'checkbox',
	'checkbox-group': 'checks',
	collapsible: 'accordion',
	combobox: 'search',
	command: 'command',
	'context-menu': 'contextMenu',
	'data-table': 'dataTable',
	'date-picker': 'datePicker',
	dialog: 'dialog',
	drawer: 'drawer',
	empty: 'empty',
	field: 'field',
	fieldset: 'fieldset',
	form: 'form',
	frame: 'frame',
	group: 'group',
	input: 'field',
	'input-group': 'inputGroup',
	kbd: 'kbd',
	label: 'label',
	menu: 'menu',
	meter: 'progress',
	'number-field': 'stepper',
	'otp-field': 'otp',
	pagination: 'pagination',
	popover: 'popover',
	'preview-card': 'previewCard',
	progress: 'progress',
	'radio-group': 'radios',
	'scroll-area': 'scrollArea',
	select: 'select',
	separator: 'separator',
	sheet: 'sheet',
	sidebar: 'sidebar',
	skeleton: 'text',
	slider: 'slider',
	spinner: 'spinner',
	switch: 'toggleSwitch',
	table: 'table',
	tabs: 'tabs',
	textarea: 'textarea',
	toast: 'toast',
	toggle: 'toggle',
	'toggle-group': 'segments',
	toolbar: 'toolbar',
	tooltip: 'tooltip',
	'virtual-list': 'list'
};

/**
 * The shapes to draw for a component.
 *
 * Falls back to the plain three-line placeholder rather than to nothing, so a
 * component added to the roster before it has a glyph still gets a card that
 * reads as a card. The test is what makes that a temporary state.
 */
export function glyphFor(slug: string): Shape[] {
	return GLYPHS[ARCHETYPES[slug] ?? 'text'];
}
