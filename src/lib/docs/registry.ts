import type { PropRow } from '$lib/components/site/props-table.svelte';

export type DocExample = {
	id: string;
	title: string;
	description?: string;
	/**
	 * There is no code here on purpose. The example lives at
	 * `$lib/docs/examples/<slug>/<id>.svelte` and is imported twice — once to
	 * render, once as raw text to display — so the snippet on the page and the
	 * thing beside it are the same file and cannot drift.
	 */
	/** Preview stage height, for examples that need more or less room. */
	minHeight?: string;
};

export type PropsSection = {
	title: string;
	rows: PropRow[];
};

export type ExternalDependency = {
	/** Package name as published on npm. */
	name: string;
	/**
	 * The version is not written here. It is looked up in
	 * `$lib/registry/versions`, which is the same source the registry hands to
	 * the CLI and which `pnpm check:versions` holds to `package.json` — so the
	 * number on this page cannot quietly disagree with the one you install.
	 */
	/** Why the component needs it. */
	purpose: string;
	/** Upstream API reference. */
	docs: string;
};

export type ComponentDoc = {
	/** The headline example shown directly under the page title. */
	hero?: DocExample;
	usage?: string;
	api?: PropsSection[];
	examples?: DocExample[];
	/** Anything worth knowing that the tables do not convey. */
	notes?: string[];
	/**
	 * Third-party packages this component needs. Most components have none — the
	 * library leans on the platform. Where one is genuinely warranted, it is named
	 * here with the version it was built against and a link to its own reference,
	 * so nobody has to guess what they are pulling in.
	 */
	dependencies?: ExternalDependency[];
};

const CLASS_PROP: PropRow = {
	name: 'class',
	type: 'string',
	description: 'Merged with the component classes; later utilities win.'
};

export const docs: Record<string, ComponentDoc> = {
	form: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '22rem'
		},
		api: [
			{
				title: 'Form',
				rows: [
					{
						name: 'validate',
						type: '(data) => FormErrors | void',
						description: 'Return errors keyed by field name to block submission.'
					},
					{
						name: 'onsubmit',
						type: '(data) => void | Promise<void>',
						description: 'Called with the form data once validation passes.'
					},
					{
						name: 'errors',
						type: 'FormErrors',
						description:
							'Current errors, keyed by field name. Bindable, so a server can set them too.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'FormField',
				rows: [
					{
						name: 'name',
						type: 'string',
						description: "Matches the control's name, which is how its error is found."
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			"`novalidate` turns off the browser's own validation bubbles, so a message sits beside its control and is wired to it with `aria-describedby` — a native bubble is neither.",
			'On a failed submit, focus moves to the first invalid field, so the problem is where the user already is rather than somewhere they have to go looking.',
			'FormField renders the error itself, so a validated field cannot ship without somewhere to show what went wrong.',
			'`errors` is bindable, so server-side validation can populate it with no extra plumbing.',
			'The form is disabled while submitting, so a double click cannot submit twice.'
		],
		examples: []
	},

	toggle: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '10rem'
		},
		api: [
			{
				title: 'Toggle',
				rows: [
					{
						name: 'pressed',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with bind:pressed.'
					},
					{
						name: 'variant',
						type: "'default' | 'outline'",
						default: "'default'",
						description: 'Visual weight.'
					},
					{
						name: 'size',
						type: "'sm' | 'default' | 'lg'",
						default: "'default'",
						description: 'Control size.'
					},
					{
						name: 'value',
						type: 'string',
						description: 'Identifies this toggle inside a ToggleGroup.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'Announced with aria-pressed rather than as a checkbox: a toggle is a button that stays down.',
			'Inside a ToggleGroup the group owns the state; standalone it owns its own, so the same component covers both.'
		],
		examples: []
	},

	'toggle-group': {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '10rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'ToggleGroupItem',
						type: 'component',
						description: 'A Toggle that takes its state, variant and size from the group.'
					},
					{
						name: 'ToggleGroupSeparator',
						type: 'component',
						description: 'Divides runs within the group.'
					}
				]
			},
			{
				title: 'ToggleGroup',
				rows: [
					{
						name: 'type',
						type: "'single' | 'multiple'",
						default: "'single'",
						description: 'How many can be pressed at once.'
					},
					{
						name: 'value',
						type: 'string | string[]',
						description: 'Pressed value(s). Bindable.'
					},
					{
						name: 'variant',
						type: "'default' | 'outline'",
						description: 'Passed down to every toggle.'
					},
					{
						name: 'size',
						type: "'sm' | 'default' | 'lg'",
						description: 'Passed down to every toggle.'
					},
					{
						name: 'label',
						type: 'string',
						description: 'Accessible name for the set.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'In single mode, pressing the active toggle releases it — there is no way to get stuck with a selection you cannot clear.',
			'Variant and size set on the group apply to every toggle inside, so they cannot drift apart.'
		],
		examples: [
			{
				id: 'multiple',
				title: 'Multiple',
				description: 'Several pressed at once.',
				minHeight: '10rem'
			}
		]
	},

	toolbar: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '10rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'ToolbarButton',
						type: 'component',
						description: 'A Button the roving tab index picks up.'
					},
					{
						name: 'ToolbarLink',
						type: 'component',
						description: 'A link styled as a toolbar control.'
					},
					{
						name: 'ToolbarGroup',
						type: 'component',
						description: 'A related run inside the toolbar.'
					},
					{
						name: 'ToolbarInput',
						type: 'component',
						description: 'A compact field inside the toolbar.'
					},
					{
						name: 'ToolbarSeparator',
						type: 'component',
						description: 'A vertical rule, centred in the row.'
					}
				]
			},
			{
				title: 'Toolbar',
				rows: [
					{
						name: 'orientation',
						type: "'horizontal' | 'vertical'",
						default: "'horizontal'",
						description: 'Which arrows move between controls.'
					},
					{
						name: 'label',
						type: 'string',
						default: "'Toolbar'",
						description: 'Accessible name.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'A toolbar is one tab stop: Tab moves past it, arrows move within. Without that, a ten-button toolbar costs ten presses to skip.',
			'Home and End jump to the ends, and the roving tab stop remembers where you were.'
		],
		examples: []
	},

	pagination: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '12rem'
		},
		api: [
			{
				title: 'Pagination',
				rows: [
					{
						name: 'page',
						type: 'number',
						default: '1',
						description: 'Current page. Bindable.'
					},
					{
						name: 'count',
						type: 'number',
						description: 'Total number of pages.'
					},
					{
						name: 'siblings',
						type: 'number',
						default: '1',
						description: 'Numbered links either side of the current page.'
					},
					{
						name: 'href',
						type: '(page: number) => string',
						description:
							'Renders links instead of buttons — use it so pages are shareable and crawlable.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'A navigation landmark with aria-current on the active page.',
			'First and last pages are always shown, so the ends of a long range stay one click away.',
			'Ellipses are aria-hidden — the numbers either side already convey the skip.',
			'Pass href to render real links; without it, the buttons drive local state.'
		],
		examples: [
			{
				id: 'composed',
				title: 'Composed',
				description:
					'The same control assembled from its parts. `usePagination()` hands you the computed window, so laying it out yourself does not mean rewriting the ellipsis logic.'
			}
		]
	},

	'input-group': {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '12rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'InputGroupText',
						type: 'component',
						description: 'Static text inside an addon.'
					},
					{
						name: 'InputGroupTextarea',
						type: 'component',
						description: 'An unstyled Textarea for a multi-line group.'
					}
				]
			},
			{
				title: 'Addon parts',
				rows: [
					{
						name: 'InputGroup',
						type: 'component',
						description: 'Carries the border, background and focus ring.'
					},
					{
						name: 'InputGroupAddon',
						type: 'component',
						description: 'Icon, text or button alongside the field.'
					},
					{
						name: 'InputGroupInput',
						type: 'component',
						description: 'An unstyled Input that sits inside the group.'
					}
				]
			}
		],
		notes: [
			'The wrapper owns the ring, so an icon or button beside the field sits inside the focus outline rather than next to it.',
			'Add a Button in an addon for a combined field-and-action control.'
		],
		examples: []
	},

	slider: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '10rem'
		},
		api: [
			{
				title: 'Slider',
				rows: [
					{
						name: 'value',
						type: 'number',
						default: '50',
						description: 'Bindable with bind:value.'
					},
					{
						name: 'min',
						type: 'number',
						default: '0',
						description: 'Lower bound.'
					},
					{
						name: 'max',
						type: 'number',
						default: '100',
						description: 'Upper bound.'
					},
					{
						name: 'step',
						type: 'number',
						default: '1',
						description: 'Granularity.'
					},
					{
						name: 'format',
						type: '(value: number) => string',
						description: 'Formats the value announced to assistive technology.'
					},
					{
						name: 'label',
						type: 'string',
						default: "'Slider'",
						description: 'Accessible name.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'Arrows step by one, PageUp and PageDown by a tenth of the range, and Home and End jump to the bounds — so a long range is crossable without dragging.',
			'Pointer events are captured on the thumb, so a drag continues even when the pointer leaves it.',
			'Values are snapped to the step’s own precision, so a 0.1 step never produces 0.30000000000000004.',
			'Pass format to give the value meaning: "70%" or "3 of 5" rather than a bare number.'
		],
		examples: []
	},

	'number-field': {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '10rem'
		},
		api: [
			{
				title: 'NumberField',
				rows: [
					{
						name: 'value',
						type: 'number | null',
						default: 'null',
						description: 'Bindable. Null when the field is empty.'
					},
					{
						name: 'min',
						type: 'number',
						description: 'Lower bound, enforced on blur.'
					},
					{
						name: 'max',
						type: 'number',
						description: 'Upper bound, enforced on blur.'
					},
					{
						name: 'step',
						type: 'number',
						default: '1',
						description: 'Amount the buttons and arrow keys change by.'
					},
					{
						name: 'size',
						type: "'sm' | 'default' | 'lg'",
						default: "'default'",
						description: 'Control size.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'Uses a text input with inputmode="decimal" rather than type="number": it brings up a numeric keypad on touch without the scroll-to-change behaviour that alters values by accident.',
			'Clamping happens on blur, not on each keystroke, so typing "1" on the way to "15" is not snapped up to the minimum mid-entry.',
			'Up and Down step the value, matching a native number input.'
		],
		examples: []
	},

	'otp-field': {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '10rem'
		},
		api: [
			{
				title: 'OtpField',
				rows: [
					{
						name: 'value',
						type: 'string',
						description: 'The code entered so far. Bindable.'
					},
					{
						name: 'length',
						type: 'number',
						default: '6',
						description: 'Number of characters.'
					},
					{
						name: 'pattern',
						type: "'digits' | 'alphanumeric'",
						default: "'digits'",
						description: 'What may be entered.'
					},
					{
						name: 'oncomplete',
						type: '(value: string) => void',
						description: 'Called once the last character is entered.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'One real input behind the slots, not one per character. That is what makes paste, autofill and the platform’s SMS one-time-code suggestion work — none of which survive being split across six fields.',
			'autocomplete="one-time-code" lets iOS and Android offer the code straight from the message.',
			'The slots are aria-hidden decoration; the single input is what is announced and focused.'
		],
		examples: []
	},

	'context-menu': {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '16rem'
		},
		api: [
			{
				title: 'ContextMenu',
				rows: [
					{
						name: 'trigger',
						type: 'Snippet',
						description: 'The region that opens the menu.'
					},
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with bind:open.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'Opens at the pointer by anchoring the existing Menu to a zero-size element parked at the click point, so positioning, flipping and keyboard handling are shared rather than reimplemented.',
			'Touch has no right click, so a long press stands in for it — and any movement cancels, so scrolling never triggers a menu.',
			'Everything from Menu applies: arrow keys, typeahead, Escape, and Tab to close.'
		],
		examples: []
	},

	'preview-card': {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '16rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'PreviewCardRoot',
						type: 'component',
						description: 'Holds the open state and the hover timers.'
					},
					{
						name: 'PreviewCardTrigger',
						type: 'component',
						description: 'Opens on hover or focus, with a grace period on leave.'
					},
					{
						name: 'PreviewCardPopup',
						type: 'component',
						description: 'The positioned card. Never takes focus.'
					}
				]
			},
			{
				title: 'PreviewCard',
				rows: [
					{
						name: 'trigger',
						type: 'Snippet',
						description: 'The element that opens it on hover or focus.'
					},
					{
						name: 'openDelay',
						type: 'number',
						default: '400',
						description: 'Delay before it appears.'
					},
					{
						name: 'closeDelay',
						type: 'number',
						default: '200',
						description: 'Grace period before it closes.'
					},
					{
						name: 'side',
						type: "'top' | 'right' | 'bottom' | 'left'",
						default: "'bottom'",
						description: 'Preferred side.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'Closing is delayed so the pointer can cross the gap into the card; without that grace period the card vanishes the moment you move toward it.',
			'Hovering the card itself keeps it open, so its content is actually reachable.',
			'Touch never opens it — a preview summoned by a tap cannot be dismissed. Focus does, so it is reachable by keyboard.',
			'For a short hint use Tooltip; a preview card is for rich content.'
		],
		examples: []
	},

	drawer: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '12rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'DrawerClose',
						type: 'component',
						description: 'A Button that closes the drawer.'
					}
				]
			},
			{
				title: 'Drawer',
				rows: [
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with bind:open.'
					},
					{
						name: 'side',
						type: "'bottom' | 'top'",
						default: "'bottom'",
						description: 'Edge it enters from.'
					},
					{
						name: 'threshold',
						type: 'number',
						default: '0.4',
						description: 'Fraction of its height a drag must pass to dismiss.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'Built on Sheet, so the focus trap, Escape and inert background come from the native dialog underneath.',
			'The grab handle is the drag surface, so dragging never fights with scrolling or text selection in the content.',
			'A quick flick dismisses even if it did not travel far; requiring the full distance makes a drawer feel stuck.',
			'Dragging the wrong way meets increasing resistance rather than a wall.'
		],
		examples: []
	},

	autocomplete: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '18rem'
		},
		api: [
			{
				title: 'Autocomplete',
				rows: [
					{
						name: 'items',
						type: 'AutocompleteItem[]',
						description: 'Suggestions: { value, label, disabled? }.'
					},
					{
						name: 'value',
						type: 'string',
						description: 'The text in the field. Free-form — it need not match a suggestion.'
					},
					{
						name: 'filter',
						type: '(item, query) => boolean',
						description: 'Replace the match rule.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'Autocomplete suggests; it does not constrain. The field’s text is the value, and picking a suggestion fills it in.',
			'Combobox is the opposite: there the value must be one of the items. Choose by whether a free-form answer is valid.',
			'Everything else — filtering, aria-activedescendant, arrow keys — is shared with Combobox.'
		],
		examples: []
	},

	calendar: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '24rem'
		},
		api: [
			{
				title: 'Calendar',
				rows: [
					{
						name: 'mode',
						type: `'single' | 'multiple' | 'range'`,
						default: `'single'`,
						description: 'One date, an arbitrary set of them, or a span.'
					},
					{
						name: 'value',
						type: 'string | string[] | DateRange',
						description:
							'Bindable. A YYYY-MM-DD string in single mode, an array of them in multiple, a { start, end } pair in range.'
					},
					{
						name: 'month',
						type: 'string',
						description: 'Month shown, as YYYY-MM. Bindable.'
					},
					{
						name: 'min',
						type: 'string',
						description: 'Earliest selectable date.'
					},
					{
						name: 'max',
						type: 'string',
						description: 'Latest selectable date.'
					},
					{
						name: 'weekStartsOn',
						type: '0 | 1',
						default: '1',
						description: '0 is Sunday, 1 is Monday.'
					},
					{
						name: 'locale',
						type: 'string',
						default: "'en-US'",
						description: 'Formats month and weekday names.'
					},
					{
						name: 'label',
						type: 'string',
						default: "'Calendar'",
						description: 'Names the grid. Say what the dates are for when there is more than one.'
					},
					{
						name: 'disabled',
						type: 'boolean',
						description: 'Makes every day unselectable while leaving the month readable.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'Values are plain YYYY-MM-DD strings built in local time, so a date never shifts by a day when it crosses a timezone — the most common date bug there is.',
			'A real table with column headers, so a cell is announced as "Tuesday 14" rather than a bare number.',
			'Arrows move by day, Up and Down by week, PageUp and PageDown by month, Home and End to the ends of the week. Crossing a month boundary moves the view with you.',
			'One roving tab stop for the whole grid, so Tab leaves the calendar rather than walking 31 cells.',
			'Month and weekday names come from Intl, so they follow the locale rather than being hardcoded English.',
			'In multiple and range mode the grid is marked aria-multiselectable, so it is not announced as though a second click would replace the first.',
			'A chosen day carries "selected" in its label. The state is on the grid cell, but focus lands on the button inside it, and not every screen reader reads the cell around a focused control.'
		],
		examples: [
			{
				id: 'range',
				title: 'Range',
				description: 'Two clicks mark a span. The second before the first flips them.',
				minHeight: '26rem'
			},
			{
				id: 'multiple',
				title: 'Multiple',
				description: 'An arbitrary set of days; clicking a chosen one removes it.',
				minHeight: '26rem'
			}
		]
	},

	'date-picker': {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '20rem'
		},
		api: [
			{
				title: 'DatePicker',
				rows: [
					{
						name: 'value',
						type: 'string',
						description: 'Selected date as YYYY-MM-DD. Bindable.'
					},
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with bind:open.'
					},
					{
						name: 'min',
						type: 'string',
						description: 'Earliest selectable date.'
					},
					{
						name: 'max',
						type: 'string',
						description: 'Latest selectable date.'
					},
					{
						name: 'locale',
						type: 'string',
						default: "'en-US'",
						description: 'Formats the displayed date.'
					},
					{
						name: 'placeholder',
						type: 'string',
						default: "'Pick a date'",
						description: 'Shown when nothing is chosen.'
					},
					{
						name: 'required',
						type: 'boolean',
						description: 'Marks the trigger aria-required, and the hidden input required.'
					},
					{
						name: 'name',
						type: 'string',
						description: 'Submits the ISO value in a hidden input.'
					},
					{
						name: 'disabled',
						type: 'boolean',
						description: 'Disables the trigger. Inherited from a surrounding Field.'
					},
					{
						name: 'class',
						type: 'string',
						description: 'Merged with the component classes; later utilities win.'
					}
				]
			}
		],
		notes: [
			'Calendar inside a Popover: the trigger shows the chosen date formatted for the locale, while the value stays a plain ISO string.',
			'Choosing a date closes the panel — there is nothing else to decide.',
			'Inside a Field, the id, description and invalid state are wired automatically.',
			'The dialog describes its own keyboard: arrows by day and week, Page Up and Page Down by month, Home and End to the ends of the week. A grid of numbers gives no other clue that it works that way.'
		],
		examples: []
	},
	toast: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '12rem'
		},
		api: [
			{
				title: 'toast()',
				rows: [
					{
						name: 'toast(title, options)',
						type: 'function',
						description: 'Shows a toast, returns its id.'
					},
					{
						name: 'toast.success / .error / .warning / .info',
						type: 'function',
						description: 'Shorthand for each tone.'
					},
					{ name: 'toast.dismiss(id)', type: 'function', description: 'Dismisses one toast.' },
					{ name: 'toast.clear()', type: 'function', description: 'Dismisses everything.' }
				]
			},
			{
				title: 'ToastOptions',
				rows: [
					{ name: 'description', type: 'string', description: 'Secondary line under the title.' },
					{
						name: 'tone',
						type: `'default' | 'success' | 'warning' | 'error' | 'info'`,
						default: `'default'`,
						description: 'Colour and icon.'
					},
					{
						name: 'duration',
						type: 'number',
						default: '5000',
						description:
							'Milliseconds before dismissal. 0 keeps it until dismissed; errors default to 8000.'
					},
					{ name: 'action', type: '{ label, onclick }', description: 'A single action button.' },
					{ name: 'onDismiss', type: '() => void', description: 'Called when it goes away.' }
				]
			},
			{
				title: 'Toaster',
				rows: [
					{
						name: 'position',
						type: `'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'`,
						default: `'bottom-right'`,
						description: 'Corner the stack sits in.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'No context and no hook: mount `<Toaster />` once and call `toast()` from anywhere, including outside a component.',
			'Timers pause on hover and on focus, and preserve the time already elapsed rather than restarting — a toast you glanced at does not get a fresh five seconds each time the pointer crosses it.',
			'They also pause when the tab is hidden, so a background tab does not burn through a toast unseen.',
			'Swipe to dismiss, with velocity taken into account: a quick flick works even if it did not travel far. Dragging against the exit direction meets resistance rather than a hard stop.',
			'Toasts enter and exit from the same edge, which is what makes swiping feel like continuing a motion already implied.',
			'The live region is `polite` so a toast waits its turn instead of cutting off the screen reader; errors use `alert` because they usually need acting on.',
			'Errors stay 8 seconds rather than 5, since they typically carry something to do.'
		],
		examples: [
			{
				id: 'tones',
				title: 'Tones',
				description: 'Each tone carries a matching icon.',
				minHeight: '12rem'
			},
			{
				id: 'with-action',
				title: 'With an action',
				description: 'One action, because a toast is not a dialog.',
				minHeight: '12rem'
			},
			{
				id: 'persistent',
				title: 'Persistent',
				description: 'Duration 0 stays until dismissed.',
				minHeight: '12rem'
			}
		]
	},

	'data-table': {
		hero: { id: 'default', title: 'Client-side', minHeight: '38rem' },
		dependencies: [
			{
				name: '@tanstack/svelte-table',
				purpose:
					'Headless table state: sorting, filtering, pagination and row models. Renders nothing itself — the markup below is ours.',
				docs: 'https://tanstack.com/table/latest/docs/framework/svelte/svelte-table'
			},
			{
				name: '@tanstack/pacer',
				purpose:
					'Debounces the search box and gives us cancel and flush. Framework-agnostic core — there is no Svelte adapter published.',
				docs: 'https://tanstack.com/pacer/latest/docs/reference/classes/debouncer'
			}
		],
		usage: `<script lang="ts">
  import {
    createTable,
    createTableState,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    columnFilteringFeature,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
    tableFeatures,
    filterFn_includesString,
    sortFns,
    type ColumnDef
  } from '@tanstack/svelte-table';
  import { DataTable, DataTablePagination, DataTableSearch } from '$lib/components/ui';

  // Features are opt-in. A row model is what makes a feature act on the rows —
  // register the feature without one and the table only tracks the state, which
  // is what you want when a server is doing the work.
  const features = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    rowSortingFeature,
    rowPaginationFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filterFns: { includesString: filterFn_includesString },
    sortFns
  });

  const table = createTable({
    features,
    columns,
    get data() { return data; },
    globalFilterFn: 'includesString'
  });
</script>

<DataTableSearch bind:value={search} />
<DataTable {table} />
<DataTablePagination {table} />`,
		api: [
			{
				title: 'DataTable',
				rows: [
					{
						name: 'table',
						type: 'Table',
						description: 'A TanStack table instance from `createTable`.'
					},
					{ name: 'empty', type: 'Snippet', description: 'Shown when there are no rows.' },
					CLASS_PROP
				]
			},
			{
				title: 'Parts',
				rows: [
					{
						name: 'DataTableSearch',
						type: 'component',
						description:
							'A search field that debounces through Pacer. Enter flushes the pending query, Escape clears it.'
					},
					{
						name: 'DataTableFilter',
						type: 'component',
						description: 'A multi-select facet in a popover, with a count of what is selected.'
					},
					{
						name: 'DataTableToolbar',
						type: 'component',
						description: 'The row above the table that holds search and filters.'
					},
					{
						name: 'DataTablePagination',
						type: 'component',
						description: 'Page controls and a page-size select, driven by the table instance.'
					},
					{
						name: 'DataTableColumnHeader',
						type: 'component',
						description:
							'The sort toggle. Applied by DataTable itself; a column that cannot sort renders plain text.'
					}
				]
			}
		],
		notes: [
			'TanStack Table v9 is a different API from v8: features are composed with `tableFeatures`, and a feature only acts on the rows if you also register its row model. Registering `rowSortingFeature` without `createSortedRowModel()` gives you sorting state and no sorting.',
			'`aria-sort` sits on the `<th>` while the toggle is a `<button>` inside it, so the column state is announced from the header cell rather than from the control.',
			'There is no row virtualisation, on purpose. Pagination already bounds what is in the DOM, so windowing would render the same ten rows through much more machinery — and it forces the table into a CSS grid, giving up the column sizing a real `<table>` does for free. It is worth adding the day a genuinely unpaginated view exists, and not before.',
			'Search is debounced rather than throttled: you want the query that was finished typing, not a sample taken part-way through it.'
		],
		examples: [
			{
				id: 'server-side',
				title: 'Server-side',
				description:
					'The data source filters, sorts and slices; the client holds one page. `manualFiltering`, `manualSorting` and `manualPagination` tell the table not to repeat the work, and `rowCount` tells it how many pages there are. This page is prerendered, so the stand-in runs in the browser — it takes the query an endpoint would receive and answers with the same shape, which is the point.',
				minHeight: '38rem'
			}
		]
	},

	table: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '18rem'
		},
		api: [
			{
				title: 'Table',
				rows: [
					{
						name: 'variant',
						type: `'default' | 'card'`,
						default: `'default'`,
						description: 'card lifts the body onto its own rounded, bordered surface.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'Parts',
				rows: [
					{
						name: 'Table',
						type: 'component',
						description: 'The table, inside a scrolling container.'
					},
					{
						name: 'TableHeader / TableBody / TableFooter',
						type: 'component',
						description: 'thead, tbody, tfoot.'
					},
					{
						name: 'TableRow',
						type: 'component',
						description: 'A row. Set data-state="selected" to highlight.'
					},
					{ name: 'TableHead', type: 'component', description: 'Header cell.' },
					{ name: 'TableCell', type: 'component', description: 'Body cell.' },
					{ name: 'TableCaption', type: 'component', description: 'Caption below the table.' }
				]
			}
		],
		notes: [
			'Real table elements, so rows and columns are announced as such and header cells are associated with their column automatically.',
			'The scrolling container is focusable, so a wide table can be scrolled with the keyboard rather than only by dragging.',
			'Sorting, selection and virtualisation are deliberately out of scope — those belong to a data table built on top of this.'
		],
		examples: [
			{
				id: 'card',
				title: 'Card',
				description:
					'The body becomes a raised surface, with the header, footer and caption sitting outside it.',
				minHeight: '20rem'
			}
		]
	},

	breadcrumb: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '10rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'Breadcrumb',
						type: 'component',
						description: 'A labelled navigation landmark wrapping an ordered list.'
					},
					{ name: 'BreadcrumbItem', type: 'component', description: 'One crumb.' },
					{ name: 'BreadcrumbLink', type: 'component', description: 'A link to an ancestor.' },
					{
						name: 'BreadcrumbPage',
						type: 'component',
						description: 'The current page — not a link.'
					},
					{ name: 'BreadcrumbSeparator', type: 'component', description: 'Decorative divider.' }
				]
			}
		],
		notes: [
			'A navigation landmark, so the trail can be jumped to directly rather than tabbed to.',
			'The current page is not a link — there is nowhere to go. It carries `aria-current="page"` instead.',
			'Separators are `aria-hidden`; the list structure already conveys the hierarchy, and hearing "chevron" between every crumb is noise.'
		],
		examples: []
	},

	empty: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '20rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{ name: 'Empty', type: 'component', description: 'The dashed container.' },
					{ name: 'EmptyMedia', type: 'component', description: 'Icon or illustration.' },
					{ name: 'EmptyTitle', type: 'component', description: 'What is missing.' },
					{ name: 'EmptyDescription', type: 'component', description: 'Why, and what to do next.' },
					{ name: 'EmptyActions', type: 'component', description: 'The way out.' }
				]
			}
		],
		notes: [
			'An empty state should say why a region is empty and what to do about it. A shrug of an icon with the word "Empty" tells the user nothing they did not already know.'
		],
		examples: []
	},

	frame: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '18rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'Frame',
						type: 'component',
						description: 'The muted tray that holds everything.'
					},
					{
						name: 'FramePanel',
						type: 'component',
						description: 'A raised panel. Stack several inside one Frame.'
					},
					{
						name: 'FrameHeader',
						type: 'component',
						description: 'Caption for the group, sitting in the tray above the panels.'
					},
					{ name: 'FrameTitle', type: 'component', description: 'Heading text.' },
					{ name: 'FrameDescription', type: 'component', description: 'Supporting text.' },
					{
						name: 'FrameFooter',
						type: 'component',
						description: 'Note below the panels, also in the tray.'
					}
				]
			}
		],
		notes: [
			'Frame is a tray, not a card: the muted background shows around and between the panels it holds, which is what separates stacked panels without needing a divider.',
			'Header and footer sit directly in the tray, alongside the panels rather than inside them, so they read as captions for the whole group.',
			'Consecutive panels are spaced automatically, so several blocks can share one frame.',
			'Use Card for a single self-contained block; use Frame when several related panels belong together.'
		],
		examples: []
	},

	fieldset: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '18rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'Fieldset',
						type: 'component',
						description: 'A native fieldset. Set disabled to disable everything inside.'
					},
					{ name: 'FieldsetLegend', type: 'component', description: 'Names the group.' },
					{ name: 'FieldsetDescription', type: 'component', description: 'Supporting text.' }
				]
			}
		],
		notes: [
			'A real `<fieldset>`: disabling it disables every control inside, with no state to thread through, and the legend names the group without any ARIA.',
			'Use it for a set of related controls. Use Field for a single control and its label.'
		],
		examples: []
	},

	group: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '10rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'GroupText',
						type: 'component',
						description: 'A static segment styled like the controls beside it.'
					},
					{
						name: 'GroupSeparator',
						type: 'component',
						description: 'Divides runs without breaking the joined edge.'
					}
				]
			},
			{
				title: 'Group',
				rows: [
					{
						name: 'orientation',
						type: `'horizontal' | 'vertical'`,
						default: `'horizontal'`,
						description: 'Direction the controls join.'
					},
					{ name: 'label', type: 'string', description: 'Accessible name for the set.' },
					CLASS_PROP
				]
			}
		],
		notes: [
			'Only the outer corners stay rounded, and the shared edge collapses to a single border rather than two stacked ones.',
			'The hovered or focused control is raised above its neighbours, so its ring is never clipped by the one beside it.'
		],
		examples: [
			{
				id: 'vertical',
				title: 'Vertical',
				minHeight: '12rem'
			}
		]
	},

	meter: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '10rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'MeterRoot',
						type: 'component',
						description: 'Carries `role="meter"` and the value.'
					},
					{
						name: 'MeterTrack',
						type: 'component',
						description: 'The groove.'
					},
					{
						name: 'MeterIndicator',
						type: 'component',
						description: 'The filled portion.'
					},
					{
						name: 'MeterLabel',
						type: 'component',
						description: 'Names the meter.'
					},
					{
						name: 'MeterValue',
						type: 'component',
						description: 'The readout; `format` overrides the default percentage.'
					}
				]
			},
			{
				title: 'Meter',
				rows: [
					{ name: 'value', type: 'number', default: '0', description: 'Current measurement.' },
					{ name: 'min', type: 'number', default: '0', description: 'Lower bound.' },
					{ name: 'max', type: 'number', default: '100', description: 'Upper bound.' },
					{ name: 'label', type: 'string', default: `'Meter'`, description: 'Accessible name.' },
					{
						name: 'format',
						type: '(value, max) => string',
						description: 'Formats the readout. Omit to show none.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'A meter reports a measurement inside a known range — disk used, quota, a score. Progress reports how far along a task is. They look alike and mean different things, so they are announced differently.'
		],
		examples: []
	},

	'radio-group': {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '14rem'
		},
		api: [
			{
				title: 'RadioGroup',
				rows: [
					{
						name: 'value',
						type: 'string | undefined',
						description: 'Selected value. Bindable with `bind:value`.'
					},
					{
						name: 'name',
						type: 'string',
						default: 'generated',
						description: 'Shared by the underlying radios and submitted with a form.'
					},
					{
						name: 'orientation',
						type: `'vertical' | 'horizontal'`,
						default: `'vertical'`,
						description: 'Layout, and what is reported as the group’s orientation.'
					},
					{
						name: 'disabled',
						type: 'boolean',
						default: 'false',
						description: 'Disables every option.'
					},
					{
						name: 'label',
						type: 'string',
						description: 'Accessible name, when there is no surrounding field label.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'RadioGroupItem',
				rows: [
					{ name: 'value', type: 'string', description: 'Value reported when selected.' },
					{
						name: 'disabled',
						type: 'boolean',
						default: 'false',
						description: 'Disables this option only.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Built on real radio inputs sharing a name, so arrow-key movement, wrapping and the roving tab stop come from the browser. A group is one tab stop, not one per option — rebuilding that by hand is where most custom radio groups go wrong.',
			'It also means the value submits with a form and works without JavaScript.',
			'Inside a `<Field>`, the description and invalid state are wired automatically.',
			'Use radios when exactly one of a few visible options applies; use a Select when the list is long.'
		],
		examples: [
			{
				id: 'horizontal',
				title: 'Horizontal',
				minHeight: '12rem'
			},
			{
				id: 'disabled-option',
				title: 'With a disabled option',
				minHeight: '14rem'
			}
		]
	},

	'checkbox-group': {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '16rem'
		},
		api: [
			{
				title: 'CheckboxGroup',
				rows: [
					{
						name: 'value',
						type: 'string[]',
						default: '[]',
						description: 'Selected values. Bindable with `bind:value`.'
					},
					{
						name: 'values',
						type: 'string[]',
						default: '[]',
						description: 'Every selectable value. Required for the select-all parent to work.'
					},
					{
						name: 'name',
						type: 'string',
						description: 'Shared by the underlying checkboxes for form submission.'
					},
					{
						name: 'orientation',
						type: `'vertical' | 'horizontal'`,
						default: `'vertical'`,
						description: 'Layout direction.'
					},
					{
						name: 'disabled',
						type: 'boolean',
						default: 'false',
						description: 'Disables every option.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'Parts',
				rows: [
					{
						name: 'CheckboxGroupItem',
						type: 'component',
						description: 'A checkbox bound to one `value` in the group.'
					},
					{
						name: 'CheckboxGroupAll',
						type: 'component',
						description: 'The parent box: checked when all are, mixed when only some are.'
					}
				]
			}
		],
		notes: [
			'The parent reports `aria-checked="mixed"` when only some children are selected — the one state a plain checkbox cannot express, and the reason this component exists.',
			'Clicking a mixed parent selects everything rather than clearing, which is what a half-filled box implies: the next click completes the set.',
			'Items bind through the group rather than holding their own state, so a box can never drift out of step with the value it represents.',
			'Unlike a radio group, checkboxes are each their own tab stop — that is the expected behaviour, since any combination is valid.'
		],
		examples: [
			{
				id: 'horizontal',
				title: 'Horizontal',
				minHeight: '12rem'
			}
		]
	},

	accordion: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '16rem'
		},
		api: [
			{
				title: 'Accordion',
				rows: [
					{
						name: 'type',
						type: `'single' | 'multiple'`,
						default: `'single'`,
						description: 'Whether one panel or several can be open at once.'
					},
					{
						name: 'value',
						type: 'string | string[]',
						description: 'Open item(s). A string in single mode, an array in multiple.'
					},
					{
						name: 'collapsible',
						type: 'boolean',
						default: 'true',
						description:
							'Single mode only. When false, one panel always stays open — clicking the open header does nothing.'
					},
					{
						name: 'disabled',
						type: 'boolean',
						default: 'false',
						description: 'Disables every item.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'AccordionItem / AccordionTrigger',
				rows: [
					{ name: 'value', type: 'string', description: 'Identifies the item.' },
					{
						name: 'disabled',
						type: 'boolean',
						default: 'false',
						description: 'Skipped by arrow keys as well as unclickable.'
					},
					{
						name: 'level',
						type: '2 | 3 | 4 | 5 | 6',
						default: '3',
						description: 'Heading level the trigger sits inside. Match the surrounding outline.'
					}
				]
			}
		],
		notes: [
			'Each trigger sits inside a real heading, so the accordion appears in the document outline and can be navigated by heading — which is how screen reader users move through a page of collapsed sections.',
			'Up and Down move between headers and wrap; Home and End jump to the ends. Disabled items are skipped.',
			'Panels animate to their natural height using a grid row from `0fr` to `1fr`, so nothing has to be measured and it stays correct when the content reflows.',
			'A closed panel is `inert`, so it is out of the tab order and the accessibility tree. Hiding it with `overflow` alone leaves it reachable — that is how collapsed sections become keyboard traps.'
		],
		examples: [
			{
				id: 'multiple',
				title: 'Multiple',
				description: 'Several panels open at once.',
				minHeight: '18rem'
			},
			{
				id: 'not-collapsible',
				title: 'Always one open',
				description: 'With `collapsible={false}`, clicking the open header does nothing.',
				minHeight: '16rem'
			}
		]
	},

	collapsible: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '14rem'
		},
		api: [
			{
				title: 'Collapsible',
				rows: [
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with `bind:open`.'
					},
					{
						name: 'disabled',
						type: 'boolean',
						default: 'false',
						description: 'Blocks the trigger.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'The trigger carries `aria-expanded` and `aria-controls`; the content is a labelled region.',
			'Height animates via a grid row from `0fr` to `1fr` — interpolatable where `height: auto` is not, and correct without measuring.',
			'Closed content is `inert`, so it cannot be tabbed into.',
			'Accordion is this same mechanism with several panels and arrow-key navigation.'
		],
		examples: []
	},

	'alert-dialog': {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '12rem'
		},
		api: [
			{
				title: 'AlertDialog',
				rows: [
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with `bind:open`.'
					},
					{
						name: 'title',
						type: 'string',
						description: 'Fallback accessible name when no `<DialogTitle>` is rendered.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Uses `role="alertdialog"`, which tells assistive technology this interrupts to ask something rather than merely presenting content.',
			'It deliberately drops the two easy escapes a normal dialog offers: no backdrop dismissal and no corner close button. Both would let the question be waved away by accident, which is the thing it exists to prevent.',
			'Escape still closes it. Removing that would trap the user, and a trap is never the right answer — the point is to make dismissal deliberate, not impossible.',
			'It composes the same header, footer and close parts as Dialog.'
		],
		examples: []
	},

	command: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '12rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'CommandGroupLabel',
						type: 'component',
						description: 'The heading above a run of results.'
					}
				]
			},
			{
				title: 'Command',
				rows: [
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with `bind:open`.'
					},
					{
						name: 'groups',
						type: 'CommandGroupData[]',
						description: 'Sections of items: `{ heading, items }`.'
					},
					{
						name: 'placeholder',
						type: 'string',
						default: `'Type a command or search…'`,
						description: 'Input placeholder.'
					},
					{
						name: 'label',
						type: 'string',
						default: `'Command palette'`,
						description: 'Accessible name for the dialog and the list.'
					},
					{ name: 'empty', type: 'Snippet', description: 'Rendered when nothing matches.' },
					{
						name: 'footer',
						type: 'Snippet',
						description: 'A hint bar pinned under the list — key legends, result counts.'
					}
				]
			},
			{
				title: 'CommandItem',
				rows: [
					{ name: 'id', type: 'string', description: 'Unique within the palette.' },
					{ name: 'label', type: 'string', description: 'Text shown and matched against.' },
					{
						name: 'keywords',
						type: 'string',
						description: 'Extra search terms that match without being displayed.'
					},
					{ name: 'shortcut', type: 'string', description: 'Keyboard hint on the right.' },
					{ name: 'icon', type: 'IconSvgElement', description: 'Leading icon.' },
					{ name: 'onselect', type: '() => void', description: 'Run when chosen.' }
				]
			}
		],
		notes: [
			'It deliberately has no open or close animation. A palette opened by a keyboard shortcut is used dozens of times a day, and any delay between the keypress and a usable input makes the whole app feel slower than it is.',
			'Built on Dialog, so the focus trap, Escape handling and inert background come from the platform.',
			'Focus stays in the input while you arrow through results, pointed at by `aria-activedescendant`.',
			'`keywords` lets an item match terms that are not in its label — "Dark" can be found by typing "theme".',
			'The query resets when the palette closes; reopening mid-search is disorienting.',
			'Groups with no matches disappear entirely rather than leaving empty headings behind.'
		],
		examples: []
	},

	combobox: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '20rem'
		},
		api: [
			{
				title: 'Combobox',
				rows: [
					{
						name: 'items',
						type: 'ComboboxItem[]',
						description: 'The options: `{ value, label, disabled? }`.'
					},
					{
						name: 'value',
						type: 'string | undefined',
						description: 'Selected value. Bindable with `bind:value`.'
					},
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with `bind:open`.'
					},
					{
						name: 'filter',
						type: '(item, query) => boolean',
						default: 'substring match',
						description: 'Replace the match rule — for fuzzy search, or matching a keyword field.'
					},
					{
						name: 'size',
						type: `'sm' | 'default' | 'lg'`,
						default: `'default'`,
						description: 'Input height.'
					},
					{
						name: 'name',
						type: 'string',
						description: 'Adds a hidden input so the value submits with a form.'
					},
					{
						name: 'empty',
						type: 'Snippet',
						description: 'Rendered when nothing matches.'
					},
					{
						name: 'option',
						type: 'Snippet<[ComboboxItem]>',
						description: 'Custom rendering for an option’s contents.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Focus stays in the input while you arrow through results, and the active option is pointed at with `aria-activedescendant`. That is what lets you keep typing without losing your place — the difference between a combobox and a select.',
			'Typing filters; choosing an option puts its label in the input. The query and the selection are separate pieces of state, so an abandoned search never destroys the current value.',
			'Escape closes first and clears second, so one keypress never throws away what you typed.',
			'The active option is scrolled into view as you arrow past the visible window.',
			'Hovering makes an option active, so the pointer and the keyboard share one highlight rather than fighting over two.',
			'Disabled items are skipped by the arrow keys and cannot be chosen.'
		],
		examples: [
			{
				id: 'empty-state',
				title: 'Empty state',
				description: 'Type something with no matches to see it.',
				minHeight: '20rem'
			},
			{
				id: 'in-field',
				title: 'In a field',
				minHeight: '22rem'
			}
		]
	},

	select: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '18rem'
		},
		api: [
			{
				title: 'Select',
				rows: [
					{
						name: 'value',
						type: 'string | undefined',
						description: 'Selected value. Bindable with `bind:value`.'
					},
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with `bind:open`.'
					},
					{
						name: 'placeholder',
						type: 'string',
						default: `'Select…'`,
						description: 'Shown when nothing is selected.'
					},
					{
						name: 'size',
						type: `'sm' | 'default' | 'lg'`,
						default: `'default'`,
						description: 'Trigger height, matching Input.'
					},
					{
						name: 'name',
						type: 'string',
						description: 'Adds a hidden input so the value submits with a form.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'SelectItem',
				rows: [
					{ name: 'value', type: 'string', description: 'Value reported when chosen.' },
					{
						name: 'label',
						type: 'string',
						description:
							'Overrides the text used for the trigger and typeahead. Only needed for non-textual content.'
					},
					{
						name: 'disabled',
						type: 'boolean',
						default: 'false',
						description: 'Skipped by arrow keys and typeahead.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Opening focuses the current selection rather than the top of the list — the same place a native select puts you.',
			'Down, Up, Home and End move between options and wrap; typing jumps to the next option starting with those letters.',
			'Options report their own text, so the trigger shows the chosen label without you having to repeat it.',
			'The trigger is `role="combobox"` with the panel as `role="listbox"`, so the pattern is announced as a select rather than as a generic popup.',
			'The panel matches the trigger’s width, so the list never appears narrower than the control it belongs to.',
			'Inside a `<Field>`, the id, description, invalid and disabled state are all wired automatically.'
		],
		examples: [
			{
				id: 'with-groups',
				title: 'With groups',
				description: 'Labels and separators organise a long list without breaking keyboard order.',
				minHeight: '20rem'
			},
			{
				id: 'in-field',
				title: 'In a field',
				description: 'Label, description and invalid state come from the surrounding field.',
				minHeight: '20rem'
			},
			{
				id: 'disabled-option',
				title: 'With a disabled option',
				minHeight: '18rem'
			}
		]
	},

	menu: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '18rem'
		},
		api: [
			{
				title: 'Menu',
				rows: [
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with `bind:open`.'
					},
					{
						name: 'anchor',
						type: 'HTMLElement | null',
						description: 'Element to position against — bind the trigger’s `ref` to it.'
					},
					{
						name: 'side',
						type: `'top' | 'right' | 'bottom' | 'left'`,
						default: `'bottom'`,
						description: 'Preferred side; flips when there is no room.'
					},
					{
						name: 'align',
						type: `'start' | 'center' | 'end'`,
						default: `'start'`,
						description: 'Alignment along the chosen side.'
					},
					{
						name: 'autoFocus',
						type: `'first' | 'last'`,
						default: `'first'`,
						description: 'Which end to focus on open. Use `last` when opening with Up arrow.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'MenuItem',
				rows: [
					{
						name: 'onselect',
						type: '() => void',
						description: 'Called on click or Enter/Space.'
					},
					{
						name: 'variant',
						type: `'default' | 'destructive'`,
						default: `'default'`,
						description: 'Destructive items take the error tone.'
					},
					{
						name: 'disabled',
						type: 'boolean',
						default: 'false',
						description: 'Skipped by arrow keys and typeahead rather than merely dimmed.'
					},
					{
						name: 'closeOnSelect',
						type: 'boolean',
						default: 'true',
						description: 'Set false to keep the menu open after activating.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'Other parts',
				rows: [
					{
						name: 'MenuCheckboxItem',
						type: 'component',
						description: 'Toggle with `bind:checked`. Stays open by default.'
					},
					{ name: 'MenuGroup', type: 'component', description: 'Groups related items.' },
					{ name: 'MenuLabel', type: 'component', description: 'Caption for a group.' },
					{ name: 'MenuSeparator', type: 'component', description: 'Divider between groups.' },
					{
						name: 'MenuShortcut',
						type: 'component',
						description: 'Right-aligned keyboard hint.'
					}
				]
			}
		],
		notes: [
			'Up and Down move between items and wrap at both ends; Home and End jump to either end.',
			'Typing jumps to the next item starting with those letters, and repeating a letter cycles through the matches. The buffer clears after a pause, so "s", pause, "e" searches for "e" rather than "se".',
			'Disabled items are skipped by arrow keys and typeahead, not merely dimmed — landing on something you cannot activate wastes a keypress.',
			'The whole menu is a single tab stop. Tab closes it rather than walking into the page behind.',
			'Escape closes and returns focus to the trigger. Item order comes from the DOM, so conditionals and groups reorder correctly without any registration bookkeeping.',
			'Shortcut hints are `aria-hidden` — the accessible name already carries the action, and "Delete Command Backspace" is noise.',
			'Submenus are not built yet.'
		],
		examples: [
			{
				id: 'with-checkboxes',
				title: 'With checkboxes',
				description:
					'Checkbox items keep the menu open by default, so several can be toggled in one visit.',
				minHeight: '18rem'
			},
			{
				id: 'with-disabled',
				title: 'With a disabled item',
				description: 'Arrow keys and typeahead skip straight past it.',
				minHeight: '18rem'
			}
		]
	},

	popover: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '16rem'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'Popover',
						type: 'component',
						description: 'Root. Holds the open state and the anchor the trigger registers.'
					},
					{
						name: 'PopoverTrigger',
						type: 'component',
						description:
							'Opens the panel and registers itself as the anchor — no `bind:ref` needed.'
					},
					{
						name: 'PopoverPopup',
						type: 'component',
						description:
							'The positioned panel. Also the primitive behind Menu, Select and Date Picker.'
					},
					{
						name: 'PopoverTitle',
						type: 'component',
						description: 'Names the panel via `aria-labelledby`.'
					},
					{
						name: 'PopoverDescription',
						type: 'component',
						description: 'Referenced by `aria-describedby`.'
					},
					{
						name: 'PopoverClose',
						type: 'component',
						description: 'A Button that closes the panel.'
					}
				]
			},
			{
				title: 'Popover',
				rows: [
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with `bind:open`.'
					},
					{
						name: 'anchor',
						type: 'HTMLElement | null',
						description: 'The element to position against — bind the trigger’s `ref` to it.'
					},
					{
						name: 'side',
						type: `'top' | 'right' | 'bottom' | 'left'`,
						default: `'bottom'`,
						description: 'Preferred side; flips when there is no room.'
					},
					{
						name: 'align',
						type: `'start' | 'center' | 'end'`,
						default: `'center'`,
						description: 'Alignment along the chosen side.'
					},
					{
						name: 'offset',
						type: 'number',
						default: '6',
						description: 'Gap between the anchor and the panel, in pixels.'
					},
					{
						name: 'label',
						type: 'string',
						description: 'Accessible name, when the content has no heading of its own.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'The anchor is passed explicitly rather than inferred from a wrapper element, so nothing extra is injected into your markup and the trigger keeps its own `aria-expanded`.',
			'It scales from its trigger, not from its own centre — a panel that grows out of the button reads as caused by the click. The origin follows the resolved side, so a popover that flips above its trigger still grows downward from it.',
			'Rendered through the Popover API, so it sits in the top layer and is never clipped by an ancestor’s `overflow: hidden`.',
			'Focus moves into the panel on open and returns to the trigger on close, so keyboard users are never dropped at the top of the document.',
			'Escape and a click outside both close it. Position is recalculated on scroll in any ancestor, on resize, and when the anchor changes size.'
		],
		examples: [
			{
				id: 'sides',
				title: 'Sides',
				description: 'Each side flips to its opposite when the viewport edge is too close.',
				minHeight: '16rem'
			},
			{
				id: 'with-form',
				title: 'With a form',
				description:
					'Focus lands on the first control in the panel, so the popover is usable from the keyboard alone.',
				minHeight: '18rem'
			}
		]
	},

	dialog: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '12rem'
		},
		api: [
			{
				title: 'Dialog',
				rows: [
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with `bind:open`.'
					},
					{
						name: 'title',
						type: 'string',
						description: 'Fallback accessible name, used only when no `<DialogTitle>` is rendered.'
					},
					{
						name: 'showCloseButton',
						type: 'boolean',
						default: 'true',
						description: 'Renders the corner close button.'
					},
					{
						name: 'dismissible',
						type: 'boolean',
						default: 'true',
						description: 'Whether clicking the backdrop closes the dialog.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'Parts',
				rows: [
					{
						name: 'DialogHeader',
						type: 'component',
						description: 'Holds the title and description.'
					},
					{
						name: 'DialogTitle',
						type: 'component',
						description: 'Names the dialog and wires `aria-labelledby`.'
					},
					{
						name: 'DialogDescription',
						type: 'component',
						description: 'Wires `aria-describedby`.'
					},
					{
						name: 'DialogPanel',
						type: 'component',
						description: 'Scrolling body. Also exported as `DialogContent`.'
					},
					{ name: 'DialogFooter', type: 'component', description: 'Action row.' },
					{
						name: 'DialogClose',
						type: 'component',
						description: 'A Button that closes the dialog. Takes all Button props.'
					}
				]
			}
		],
		notes: [
			'Built on a native `<dialog>` opened with `showModal()`, so the focus trap, Escape handling, inert background and top-layer stacking come from the platform rather than from custom focus code.',
			'`aria-labelledby` is only set once a `<DialogTitle>` is actually rendered — a dangling reference would leave the dialog with no accessible name at all, which is worse than the `title` fallback.',
			'Exit animates as well as entry, via `allow-discrete` on `display` and `overlay`.',
			'Unlike a popover, a modal keeps `transform-origin: center`: it is not anchored to a trigger, so it belongs in the middle of the viewport.',
			'The body scrolls inside `DialogPanel`, so a long dialog never scrolls the page behind it.'
		],
		examples: [
			{
				id: 'scrolling',
				title: 'Scrolling body',
				description:
					'The header and footer stay put while the panel scrolls, with the edge fade showing there is more to read.',
				minHeight: '12rem'
			},
			{
				id: 'non-dismissible',
				title: 'Not dismissible',
				description:
					'Backdrop clicks are ignored, for a decision the user has to make explicitly. Escape still works, since trapping a user in a dialog is never right.',
				minHeight: '12rem'
			}
		]
	},

	button: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		usage: `<script lang="ts">
  import { Button } from '$lib/components/ui';
</script>

<Button variant="outline" size="sm" onclick={() => console.log('pressed')}>
  Save changes
</Button>`,
		api: [
			{
				title: 'Button',
				rows: [
					{
						name: 'variant',
						type: `'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'destructive-outline'`,
						default: `'default'`,
						description: 'Visual weight of the button.'
					},
					{
						name: 'size',
						type: `'xs' | 'sm' | 'default' | 'lg' | 'xl' | 'icon-xs' | 'icon-sm' | 'icon' | 'icon-lg' | 'icon-xl'`,
						default: `'default'`,
						description: 'Height and padding. The icon sizes render a square.'
					},
					{
						name: 'loading',
						type: 'boolean',
						default: 'false',
						description: 'Swaps the label for a spinner and disables the button, keeping its width.'
					},
					{
						name: 'href',
						type: 'string',
						description: 'Renders an anchor instead of a button, styled identically.'
					},
					{
						name: 'disabled',
						type: 'boolean',
						default: 'false',
						description: 'Dims the button and blocks pointer and keyboard activation.'
					},
					{
						name: 'type',
						type: `'button' | 'submit' | 'reset'`,
						default: `'button'`,
						description: 'Defaults to button so it never submits a form by accident.'
					},
					{
						name: 'ref',
						type: 'HTMLElement | null',
						description: 'Bindable reference to the rendered element.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Pressing scales the button to 97% over 160ms, so the interface visibly acknowledges the press.',
			'`loading` also sets `aria-disabled`, so assistive technology hears the button is busy rather than simply gone.'
		],
		examples: [
			{
				id: 'secondary',
				title: 'Secondary',
				description: 'A quieter fill for actions beside a primary one.'
			},
			{
				id: 'outline',
				title: 'Outline',
				description: 'A bordered button for secondary actions on a plain surface.'
			},
			{
				id: 'ghost',
				title: 'Ghost',
				description: 'No border or fill until hovered. Good for toolbars and dense rows.'
			},
			{
				id: 'link',
				title: 'Link',
				description: 'Reads as a link but keeps button semantics and sizing.'
			},
			{
				id: 'destructive',
				title: 'Destructive',
				description: 'For actions that remove or overwrite something.'
			},
			{
				id: 'destructive-outline',
				title: 'Destructive outline',
				description:
					'The destructive tone at a lower weight, for when the action is not the page’s main one.'
			},
			{
				id: 'size-xs',
				title: 'Extra small size',
				description:
					'Every size steps down one notch at the `sm` breakpoint, so controls stay comfortable on touch.'
			},
			{
				id: 'size-sm',
				title: 'Small size',
				description:
					'Every size steps down one notch at the `sm` breakpoint, so controls stay comfortable on touch.'
			},
			{
				id: 'size-lg',
				title: 'Large size',
				description:
					'Every size steps down one notch at the `sm` breakpoint, so controls stay comfortable on touch.'
			},
			{
				id: 'size-xl',
				title: 'Extra large size',
				description:
					'Every size steps down one notch at the `sm` breakpoint, so controls stay comfortable on touch.'
			},
			{
				id: 'icon',
				title: 'Icon',
				description:
					'A square button for icon-only actions. Always give it a visually hidden label.'
			},
			{
				id: 'icon-sm',
				title: 'Icon small size'
			},
			{
				id: 'icon-lg',
				title: 'Icon large size'
			},
			{
				id: 'with-icon',
				title: 'With icon',
				description: 'Icons are sized and spaced automatically, on either side of the label.'
			},
			{
				id: 'with-link',
				title: 'With link',
				description:
					'Passing `href` renders a real anchor, so middle-click, right-click and keyboard behaviour are the browser’s.'
			},
			{
				id: 'loading',
				title: 'Loading',
				description:
					'The label goes transparent rather than being removed, so the button keeps its width and nothing around it shifts.'
			},
			{
				id: 'disabled',
				title: 'Disabled',
				description: 'Blocks pointer and keyboard activation, and drops the press feedback.'
			}
		]
	},

	input: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		usage: `<script lang="ts">
  import { Input } from '$lib/components/ui';

  let query = $state('');
</script>

<Input type="search" bind:value={query} placeholder="Search…" />`,
		api: [
			{
				title: 'Input',
				rows: [
					{
						name: 'value',
						type: 'string | number',
						description: 'Bindable with `bind:value`.'
					},
					{
						name: 'size',
						type: `'sm' | 'default' | 'lg' | number`,
						default: `'default'`,
						description: 'A number is passed through as the native `size` attribute.'
					},
					{
						name: 'unstyled',
						type: 'boolean',
						default: 'false',
						description: 'Drops the wrapper chrome so the field can sit inside another control.'
					},
					{
						name: 'inputClass',
						type: 'string',
						description: 'Classes for the inner input; `class` styles the wrapper.'
					},
					{
						name: 'ref',
						type: 'HTMLInputElement | null',
						description: 'Bindable reference to the input element.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Inside a `<Field>`, the id, `aria-describedby`, `aria-invalid` and `disabled` state are wired automatically.',
			'Focus and invalid rings are driven by `:has()` on the wrapper, so the border and ring stay in sync with the inner input without JavaScript.'
		],
		examples: [
			{
				id: 'size-sm',
				title: 'Small size'
			},
			{
				id: 'size-lg',
				title: 'Large size'
			},
			{
				id: 'invalid',
				title: 'Invalid',
				description: 'Setting `aria-invalid` recolours the border and focus ring.'
			},
			{
				id: 'disabled',
				title: 'Disabled'
			},
			{
				id: 'search',
				title: 'Search',
				description:
					'The platform’s clear button is normalised away so the field matches the rest of the set.'
			},
			{
				id: 'file',
				title: 'File'
			}
		]
	},

	field: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		usage: `<Field invalid={!valid}>
  <FieldLabel>Work email</FieldLabel>
  <Input type="email" bind:value={email} />
  {#if !valid}
    <FieldError>Enter a valid email address.</FieldError>
  {/if}
</Field>`,
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'FieldItem',
						type: 'component',
						description: 'One row — control on the left, label and description filling the rest.'
					}
				]
			},
			{
				title: 'Field',
				rows: [
					{
						name: 'invalid',
						type: 'boolean',
						default: 'false',
						description: 'Sets `aria-invalid` on the control and switches it to the error style.'
					},
					{
						name: 'disabled',
						type: 'boolean',
						default: 'false',
						description: 'Disables the control and dims the label.'
					},
					{
						name: 'controlId',
						type: 'string',
						description: 'Override the generated id when the control already has one.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'FieldLabel / FieldDescription / FieldError',
				rows: [
					{
						name: 'id',
						type: 'string',
						description:
							'Generated when omitted. Descriptions and errors register their id with the field.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'`FieldLabel` binds to the control automatically — no `for` to write by hand.',
			'Descriptions and errors register themselves, so `aria-describedby` lists exactly the ones currently rendered and nothing stale.',
			'`FieldError` carries `role="alert"`, so a message that appears after a failed submit is announced immediately.',
			'Input, Textarea, Checkbox and Switch all read this context; other controls work standalone.'
		],
		examples: [
			{
				id: 'invalid',
				title: 'Invalid',
				description:
					'`invalid` sets `aria-invalid` on the control, and the error registers itself with `aria-describedby`.'
			},
			{
				id: 'disabled',
				title: 'Disabled',
				description: 'Disables the control and dims the label together.'
			},
			{
				id: 'with-checkbox',
				title: 'With a checkbox',
				description: 'The same wiring works for any control that reads the field context.'
			}
		]
	},

	textarea: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Textarea',
				rows: [
					{ name: 'value', type: 'string', description: 'Bindable with `bind:value`.' },
					{
						name: 'size',
						type: `'sm' | 'default' | 'lg'`,
						default: `'default'`,
						description: 'Minimum height and padding.'
					},
					{
						name: 'textareaClass',
						type: 'string',
						description: 'Classes for the inner textarea; `class` styles the wrapper.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Auto-growth uses the CSS `field-sizing: content` property — no resize observer and no hidden mirror element.'
		],
		examples: [
			{
				id: 'size-sm',
				title: 'Small size'
			},
			{
				id: 'size-lg',
				title: 'Large size'
			},
			{
				id: 'disabled',
				title: 'Disabled'
			}
		]
	},

	checkbox: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Checkbox',
				rows: [
					{
						name: 'checked',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with `bind:checked`.'
					},
					{
						name: 'indeterminate',
						type: 'boolean',
						default: 'false',
						description: 'Renders the dash and reports `aria-checked="mixed"`.'
					},
					{
						name: 'ref',
						type: 'HTMLInputElement | null',
						description: 'Bindable reference to the underlying input.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'A real `<input type="checkbox">` sits underneath, so the value submits with the form and Space toggles it natively.',
			'`indeterminate` has no HTML attribute — it is set as a DOM property, which is why it needs the component rather than markup alone.'
		],
		examples: [
			{
				id: 'checked',
				title: 'Checked'
			},
			{
				id: 'indeterminate',
				title: 'Indeterminate',
				description:
					'Renders the dash and reports `aria-checked="mixed"` — for a parent whose children are partly selected.'
			},
			{
				id: 'disabled',
				title: 'Disabled'
			}
		]
	},

	switch: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Switch',
				rows: [
					{
						name: 'checked',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with `bind:checked`.'
					},
					{
						name: 'name',
						type: 'string',
						description: 'Adds a hidden input so the state submits with a form.'
					},
					{
						name: 'value',
						type: 'string',
						default: `'on'`,
						description: 'Value submitted when checked.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Built on a button with `role="switch"`, so it is announced as on/off rather than as a checkbox.',
			'The thumb stretches horizontally while held and settles as it lands, which reads as weight rather than a shape teleporting across the track.',
			'Use a switch when the change applies immediately; use a checkbox when it applies on submit.'
		],
		examples: [
			{
				id: 'checked',
				title: 'Checked'
			},
			{
				id: 'disabled',
				title: 'Disabled'
			}
		]
	},

	badge: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Badge',
				rows: [
					{
						name: 'variant',
						type: `'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'info' | 'destructive'`,
						default: `'default'`,
						description: 'Tone of the badge.'
					},
					{
						name: 'size',
						type: `'sm' | 'default' | 'lg'`,
						default: `'default'`,
						description: 'Height and text size.'
					},
					{
						name: 'href',
						type: 'string',
						description: 'Renders an anchor, with hover states enabled.'
					},
					CLASS_PROP
				]
			}
		],
		examples: [
			{
				id: 'secondary',
				title: 'Secondary'
			},
			{
				id: 'outline',
				title: 'Outline'
			},
			{
				id: 'success',
				title: 'Success'
			},
			{
				id: 'warning',
				title: 'Warning'
			},
			{
				id: 'error',
				title: 'Error'
			},
			{
				id: 'info',
				title: 'Info'
			},
			{
				id: 'size-sm',
				title: 'Small size'
			},
			{
				id: 'size-lg',
				title: 'Large size'
			}
		]
	},

	alert: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Alert',
				rows: [
					{
						name: 'variant',
						type: `'default' | 'info' | 'success' | 'warning' | 'error'`,
						default: `'default'`,
						description: 'Tone of the message.'
					},
					{
						name: 'icon',
						type: 'boolean | IconSvgElement',
						default: 'true',
						description:
							'`true` uses the icon matching the variant, `false` shows none, or pass your own.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Carries `role="status"`, not `role="alert"`: these render with the page, so they should not interrupt whatever a screen reader is currently saying. Use a toast for something genuinely urgent.',
			'Each tone shows a matching icon by default, so the kind of message is carried in a second channel rather than by colour alone. The default variant has none, since there is no state to signal.',
			'The icon is `aria-hidden` — it repeats what the text already says, and announcing it would be noise. Pass `icon={false}` to drop it, or an icon of your own to replace it.'
		],
		examples: [
			{
				id: 'info',
				title: 'Info'
			},
			{
				id: 'success',
				title: 'Success'
			},
			{
				id: 'warning',
				title: 'Warning'
			},
			{
				id: 'error',
				title: 'Error'
			}
		]
	},

	progress: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'ProgressRoot',
						type: 'component',
						description: 'Carries `role="progressbar"` and the value.'
					},
					{
						name: 'ProgressTrack',
						type: 'component',
						description: 'The groove.'
					},
					{
						name: 'ProgressIndicator',
						type: 'component',
						description: 'The filled portion.'
					},
					{
						name: 'ProgressLabel',
						type: 'component',
						description: 'Names the bar.'
					},
					{
						name: 'ProgressValue',
						type: 'component',
						description: 'The readout; `format` overrides the default percentage.'
					}
				]
			},
			{
				title: 'Progress',
				rows: [
					{
						name: 'value',
						type: 'number | null',
						default: '0',
						description: 'Pass `null` for the indeterminate state.'
					},
					{ name: 'max', type: 'number', default: '100', description: 'Upper bound.' },
					{
						name: 'label',
						type: 'string',
						default: `'Progress'`,
						description: 'Accessible name for the progress bar.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'The fill animates with a transition rather than a keyframe, so an update that lands mid-animation retargets from the current width instead of jumping back.'
		],
		examples: [
			{
				id: 'indeterminate',
				title: 'Indeterminate',
				description: 'For work whose total is not known ahead of time.'
			}
		]
	},

	tooltip: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		usage: `<button use:tooltip={{ content: 'Delete', side: 'right' }}>…</button>`,
		api: [
			{
				title: 'tooltip (action)',
				rows: [
					{
						name: 'content',
						type: 'string',
						description: 'The hint text. Nothing renders when empty.'
					},
					{
						name: 'side',
						type: `'top' | 'right' | 'bottom' | 'left'`,
						default: `'top'`,
						description: 'Preferred side; flips automatically when there is no room.'
					},
					{
						name: 'disabled',
						type: 'boolean',
						default: 'false',
						description: 'Suppresses the tooltip without removing the action.'
					}
				]
			}
		],
		notes: [
			'It is an action, not a wrapper component: wrapping a trigger in an extra element breaks sibling selectors around it and puts `aria-describedby` on the wrong node.',
			'The popup uses the Popover API, so it renders in the top layer and is never clipped by an ancestor’s `overflow: hidden`.',
			'The first tooltip waits 600ms. Once one has been shown, the next opens instantly and without animation — moving along a toolbar should feel like reading labels, not waiting for each in turn.',
			'Touch pointers never trigger it, since a tooltip summoned by a tap cannot be dismissed.',
			'Escape closes it, and the trigger gets `aria-describedby` only while it is open.'
		],
		examples: [
			{
				id: 'rich',
				title: 'With markup',
				description:
					'The component form, for when a sentence is not enough. The action takes a string; this takes a snippet.'
			},
			{
				id: 'side-right',
				title: 'Right side'
			},
			{
				id: 'side-bottom',
				title: 'Bottom side'
			}
		]
	},

	'scroll-area': {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'ScrollArea',
				rows: [
					{
						name: 'scrollFade',
						type: 'boolean',
						default: 'false',
						description: 'Fades content at the edges that still have more to scroll to.'
					},
					{
						name: 'overscrollContain',
						type: 'boolean',
						default: 'false',
						description: 'Stops scroll chaining to the page when this area reaches its end.'
					},
					{
						name: 'fill',
						type: 'boolean',
						default: 'false',
						description: 'Makes the content fill the viewport rather than hug its height.'
					},
					{
						name: 'orientation',
						type: `'vertical' | 'horizontal' | 'both'`,
						default: `'vertical'`,
						description: 'Which axis scrolls.'
					},
					{
						name: 'viewportClass',
						type: 'string',
						description: 'Classes for the scrolling viewport.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'The scroller is a native overflow container with restyled scrollbars, so keyboard paging, momentum and the platform’s own overscroll behaviour all still work — a JS-driven scrollbar has to reimplement each of those.',
			'The fade tracks the actual scroll offset, so it grows in as you leave an edge instead of sitting there on an unscrolled list.'
		],
		examples: [
			{
				id: 'fade',
				title: 'With scroll fade',
				description:
					'The fade tracks the scroll offset, so it grows in as you leave an edge rather than sitting on an unscrolled list.',
				minHeight: '20rem'
			}
		]
	},

	tabs: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Tabs',
				rows: [
					{
						name: 'value',
						type: 'string',
						description: 'The selected tab. Bindable with `bind:value`.'
					},
					{
						name: 'orientation',
						type: `'horizontal' | 'vertical'`,
						default: `'horizontal'`,
						description: 'Which way the tablist runs. Arrow keys follow the same axis.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'TabsList',
				rows: [
					{
						name: 'variant',
						type: `'default' | 'underline'`,
						default: `'default'`,
						description: 'A sliding pill, or a rule along the active edge.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'TabsTrigger / TabsPanel',
				rows: [
					{
						name: 'value',
						type: 'string',
						description: 'Identifier tying a trigger to its panel.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			"Arrows move between tabs along the tablist's own axis and wrap at both ends; Home and End jump to either end. Selection follows focus, so arrowing also switches the panel.",
			'The indicator is measured from the active tab rather than driven by an index, so it stays correct when tabs are added, hidden, or reflow onto a new line.',
			'Only the selected panel is rendered, and it is focusable so keyboard users land inside it after Tab.'
		],
		examples: [
			{
				id: 'underline',
				title: 'Underline',
				description: 'The indicator becomes a rule along the active edge instead of a filled pill.'
			},
			{
				id: 'vertical',
				title: 'Vertical',
				description: 'The tablist runs down the side, and Up and Down move between tabs.',
				minHeight: '12rem'
			}
		]
	},

	sheet: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '16rem'
		},
		api: [
			{
				title: 'Sheet',
				rows: [
					{
						name: 'open',
						type: 'boolean',
						default: 'false',
						description: 'Bindable with `bind:open`.'
					},
					{
						name: 'side',
						type: `'right' | 'left' | 'top' | 'bottom'`,
						default: `'right'`,
						description: 'Edge the panel enters from.'
					},
					{
						name: 'variant',
						type: `'default' | 'inset'`,
						default: `'default'`,
						description: '`inset` floats the panel with a margin instead of meeting the edges.'
					}
				]
			},
			{
				title: 'SheetTrigger',
				rows: [
					{
						name: '…',
						type: 'ButtonProps',
						description:
							'A Button that opens the sheet and carries `aria-haspopup` and `aria-expanded`.'
					}
				]
			},
			{
				title: 'SheetPopup',
				rows: [
					{
						name: 'title',
						type: 'string',
						description: 'Fallback accessible name when no `SheetTitle` is rendered.'
					},
					{
						name: 'showCloseButton',
						type: 'boolean',
						default: 'true',
						description: 'The ghost close button in the corner.'
					},
					{
						name: 'dismissible',
						type: 'boolean',
						default: 'true',
						description: 'Clicking the backdrop closes the sheet.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'Parts',
				rows: [
					{
						name: 'SheetHeader',
						type: 'component',
						description: 'Title and description, padded and pinned above the panel.'
					},
					{
						name: 'SheetTitle',
						type: 'component',
						description: 'Names the sheet — registers itself as the `aria-labelledby` target.'
					},
					{
						name: 'SheetDescription',
						type: 'component',
						description: 'Referenced by `aria-describedby` once rendered.'
					},
					{
						name: 'SheetPanel',
						type: 'component',
						description: 'The scrolling middle, so the header and footer stay put.'
					},
					{
						name: 'SheetFooter',
						type: 'component',
						description: 'Action row. `variant="bare"` drops the rule and fill.'
					},
					{
						name: 'SheetClose',
						type: 'component',
						description: 'A Button that closes the sheet.'
					}
				]
			}
		],
		notes: [
			'Built on a native `<dialog>` opened with `showModal()`, which supplies a real focus trap, Escape handling, an inert background and top-layer stacking — none of it hand-rolled.',
			'There is no SheetPortal or SheetBackdrop part, because the platform already provides both: `showModal()` promotes the dialog to the top layer, so nothing needs relocating in the DOM, and the backdrop is the `::backdrop` pseudo-element. Restyle it with the `--sheet-backdrop` and `--sheet-backdrop-blur` custom properties.',
			'Each side releases its far inset (`left-auto`, `top-auto`, and so on). The UA stylesheet pins all four edges of a modal dialog, which would otherwise stretch a top or bottom sheet across the viewport and snap a right sheet to the left.',
			'Exit animates as well as entry, using `allow-discrete` on `display` and `overlay`; without it the dialog would snap shut the moment it closes.',
			'It animates with transitions rather than keyframes, so reopening mid-close retargets from where the panel actually is instead of restarting offscreen.'
		],
		examples: [
			{
				id: 'inset',
				title: 'Sheet with inset',
				description: 'The panel floats clear of the edges, with a full border and rounded corners.',
				minHeight: '16rem'
			},
			{
				id: 'sides',
				title: 'Side sheets',
				description:
					'`side` picks the edge. Left and right fill the height; top and bottom size to their content.',
				minHeight: '16rem'
			}
		]
	},

	'virtual-list': {
		hero: { id: 'default', title: 'Fifty thousand rows', minHeight: '26rem' },
		usage: `<VirtualList items={rows} itemHeight={48} height={320} label="Folio catalogue">
  {#snippet children(row, index)}
    <div class="px-4">{row.title}</div>
  {/snippet}
</VirtualList>`,
		api: [
			{
				title: 'VirtualList',
				rows: [
					{
						name: 'items',
						type: 'T[]',
						description: 'The full list. Only the rows in view are rendered.'
					},
					{
						name: 'itemHeight',
						type: 'number',
						description:
							'Row height in pixels. Every row must be exactly this tall — the window is arithmetic, not measurement.'
					},
					{
						name: 'height',
						type: 'number | string',
						default: '320',
						description: 'Viewport height. A number is pixels; a string is any CSS length.'
					},
					{
						name: 'overscan',
						type: 'number',
						default: '6',
						description:
							'Rows rendered beyond each edge, to cover the gap between a scroll event and the next paint.'
					},
					{
						name: 'label',
						type: 'string',
						description: 'Accessible name for the scrolling region.'
					},
					{
						name: 'children',
						type: 'Snippet<[T, number]>',
						description: 'Receives the row and its index in the full list, not in the window.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Every row must be exactly `itemHeight` tall. The window is computed from scroll position rather than measured, which is what keeps it cheap — a row that grows will overlap its neighbour.',
			'Rows carry `aria-setsize` and `aria-posinset`, so a screen reader announces the position in the whole list rather than in the rendered slice. Without them a list of thirty thousand announces "3 of 30".',
			'The scroller is focusable. A scrollable region that cannot be reached by keyboard has content nobody can get to without a pointer.',
			'One translated container moves all the rows, rather than positioning each absolutely — one transform per frame instead of one per row, and the rows keep their document order for selection and copy.',
			'Reach for this only when the list is genuinely long and cannot be paginated. Pagination bounds the DOM too, and costs no layout constraints.'
		]
	},

	chart: {
		hero: { id: 'default', title: 'Default', minHeight: '18rem' },
		dependencies: [
			{
				name: '@tanstack/svelte-charts',
				purpose:
					'Connects the chart runtime to the Svelte lifecycle: mounts the surface, follows the container with a ResizeObserver, and tears observers down on unmount.',
				docs: 'https://tanstack.com/charts/latest/docs/framework/svelte/adapter'
			},
			{
				name: '@tanstack/charts',
				purpose:
					'The chart grammar itself — `defineChart`, the marks, the tooltip. Framework-agnostic; the adapter above does not replace it.',
				docs: 'https://tanstack.com/charts/latest/docs/reference/chart-spec'
			},
			{
				name: '@tanstack/charts-scales',
				purpose:
					'Compact band, point and linear scales. Covers categorical and numeric charts without pulling in D3.',
				docs: 'https://tanstack.com/charts/latest/docs/installation'
			}
		],
		usage: `<script lang="ts">
  import { Chart } from '$lib/components/ui';
  import { barY, defineChart, scaleBand, scaleLinear, tooltip } from '$lib/internal/chart';

  const definition = defineChart({
    marks: [barY(rows, { x: 'month', y: 'copied', fill: 'var(--chart-1)' })],
    x: { scale: scaleBand },
    y: { scale: scaleLinear, nice: true, grid: true },
    tooltip
  });
</script>

<Chart {definition} label="Folios copied per month" height={220} />`,
		api: [
			{
				title: 'Chart',
				rows: [
					{
						name: 'definition',
						type: 'ChartDefinition',
						description: 'Built with `defineChart`. Derive it if it captures reactive values.'
					},
					{
						name: 'label',
						type: 'string',
						description:
							'What the chart says, in a sentence. Becomes the plot’s accessible name — without it a screen reader reaches an unnamed region.'
					},
					{
						name: 'height',
						type: 'number',
						default: '240',
						description: 'Fixed height in pixels. Give this or `aspectRatio`, not both.'
					},
					{
						name: 'aspectRatio',
						type: 'number',
						description: 'Height as a ratio of the measured width, e.g. `16 / 9`.'
					},
					{
						name: 'initialWidth',
						type: 'number',
						default: '640',
						description:
							'Width assumed on the server and for the first frame, before the container is measured.'
					},
					{
						name: 'children',
						type: 'Snippet',
						description: 'Rendered above the plot — a legend, a title, a filter.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'ChartLegend',
				rows: [
					{
						name: 'items',
						type: 'ChartSeries[]',
						description:
							'Each with a `label`, a palette slot `series` (1–5) and an optional `value`.'
					},
					CLASS_PROP
				]
			}
		],
		examples: [
			{
				id: 'line',
				title: 'Line',
				description: 'A point scale for the categories, with the markers left on.',
				minHeight: '18rem'
			},
			{
				id: 'area',
				title: 'Area',
				description: 'The same series filled, for a quantity accumulating over time.',
				minHeight: '18rem'
			},
			{
				id: 'stacked',
				title: 'Stacked, with a legend',
				description:
					'Two series stacked, each on its own palette slot, named by a legend rather than by colour alone.',
				minHeight: '20rem'
			},
			{
				id: 'responsive',
				title: 'Responsive',
				description:
					'The definition is a function of the surface, so the tick count thins out on a narrow screen instead of overlapping.',
				minHeight: '18rem'
			}
		],
		notes: [
			'The palette comes from the `--chart-1` … `--chart-5` tokens, mapped onto the library’s own `--ts-chart-N` variables on the container. Light, dark and every accent follow without rebuilding the definition.',
			'Those tokens are generated from the accent, not fixed: series 1 and 2 are the accent’s hue at two lightnesses — two greys under the black theme — so a one- or two-series chart stays in one colour, and series 3–5 bring in muted hues a quarter turn apart. Lightness and chroma are held constant, so contrast does not depend on which accent is in force — the worst case is 3.92:1 in light and 4.02:1 in dark, against the 3:1 that applies to anything non-text.',
			'Chart chrome — axes, grid lines, tick labels — is drawn in `currentColor`, which is why the component sets a colour rather than inheriting one.',
			'Keep a definition at module scope when it captures nothing, and `$derived` when it does. Rebuilding it on every render throws away the animation state.',
			'TanStack Charts is pre-alpha and its API still moves. Every import lives in `$lib/internal/chart`, and the version is pinned exactly — see the note under Dependencies.'
		]
	},

	card: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Card parts',
				rows: [
					{
						name: 'Card',
						type: 'component',
						description: 'The bordered surface. Compose the parts below inside it.'
					},
					{
						name: 'CardHeader',
						type: 'component',
						description: 'Title, description and an optional action, laid out in a grid.'
					},
					{ name: 'CardTitle', type: 'component', description: 'Heading text.' },
					{ name: 'CardDescription', type: 'component', description: 'Supporting text.' },
					{
						name: 'CardAction',
						type: 'component',
						description: 'Right-aligned control in the header row.'
					},
					{
						name: 'CardPanel',
						type: 'component',
						description: 'Body region. Also exported as `CardContent`.'
					},
					{ name: 'CardFooter', type: 'component', description: 'Footer region.' }
				]
			}
		],
		examples: []
	},

	avatar: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'AvatarRoot',
						type: 'component',
						description: 'The ring and clipping frame.'
					},
					{
						name: 'AvatarImage',
						type: 'component',
						description: 'Hidden until it loads, so a 404 falls through to the fallback.'
					},
					{
						name: 'AvatarFallback',
						type: 'component',
						description: 'Initials or an icon, shown until the image loads.'
					}
				]
			},
			{
				title: 'Avatar',
				rows: [
					{ name: 'src', type: 'string', description: 'Image source. Optional.' },
					{ name: 'alt', type: 'string', default: `''`, description: 'Alternative text.' },
					CLASS_PROP
				]
			}
		],
		notes: [
			'Children are the fallback, shown while the image loads and kept if it fails. Changing `src` resets to the fallback rather than leaving a stale portrait in place.'
		],
		examples: []
	},

	separator: {
		hero: {
			id: 'default',
			title: 'Default',
			minHeight: '14rem'
		},
		api: [
			{
				title: 'Separator',
				rows: [
					{
						name: 'orientation',
						type: `'horizontal' | 'vertical'`,
						default: `'horizontal'`,
						description: 'Direction of the rule.'
					},
					{
						name: 'decorative',
						type: 'boolean',
						default: 'false',
						description: 'Hides it from the accessibility tree when it carries no meaning.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Use `decorative` for rules that are purely visual; a screen reader announcing a separator between every list row is noise.'
		],
		examples: []
	},

	skeleton: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [{ title: 'Skeleton', rows: [CLASS_PROP] }],
		notes: [
			'Size it with utility classes to match the content it stands in for, so nothing shifts when the real content arrives.'
		],
		examples: []
	},

	spinner: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [{ title: 'Spinner', rows: [CLASS_PROP] }],
		notes: [
			'Carries `role="status"` and an accessible name, so a loading state is announced rather than being a silent spinning shape.'
		],
		examples: []
	},

	kbd: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Parts',
				rows: [
					{
						name: 'KbdGroup',
						type: 'component',
						description: 'A chord or sequence — several keys that read as one instruction.'
					}
				]
			},
			{ title: 'Kbd', rows: [CLASS_PROP] }
		],
		notes: ['Renders a real `<kbd>` element, so the meaning survives without the styling.'],
		examples: []
	},

	label: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Label',
				rows: [
					{
						name: 'for',
						type: 'string',
						description: 'Id of the control. Unnecessary when the control is nested inside.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'Inside a `<Field>`, use `FieldLabel` instead — it binds to the control for you.',
			'Wrapping a control in the label makes the whole row a hit target, which is usually what you want for checkboxes and switches.'
		],
		examples: []
	},

	sidebar: {
		hero: {
			id: 'default',
			title: 'Default'
		},
		api: [
			{
				title: 'Sidebar',
				rows: [
					{
						name: 'side',
						type: `'left' | 'right'`,
						default: `'left'`,
						description: 'Which edge it sits on.'
					},
					{
						name: 'variant',
						type: `'sidebar' | 'floating' | 'inset'`,
						default: `'sidebar'`,
						description: 'Inset floats the content area as a rounded card on the sidebar ground.'
					},
					{
						name: 'collapsible',
						type: `'offcanvas' | 'icon' | 'none'`,
						default: `'offcanvas'`,
						description: 'How it collapses: slide away, shrink to icons, or never.'
					},
					CLASS_PROP
				]
			},
			{
				title: 'SidebarMenuButton',
				rows: [
					{
						name: 'isActive',
						type: 'boolean',
						default: 'false',
						description: 'Marks the current page and sets `aria-current`.'
					},
					{
						name: 'tooltip',
						type: 'string',
						description: 'Shown on hover only while collapsed to icons.'
					},
					{
						name: 'href',
						type: 'string',
						description: 'Renders an anchor instead of a button.'
					},
					{
						name: 'size',
						type: `'sm' | 'default' | 'lg'`,
						default: `'default'`,
						description: 'Row height.'
					},
					CLASS_PROP
				]
			}
		],
		notes: [
			'`⌘B` toggles the sidebar, and the open state is stored in a cookie so it survives a reload.',
			'Tooltips appear on menu buttons only while collapsed — when expanded, the label is right there.',
			'Below the `md` breakpoint the sidebar becomes a Sheet.'
		],
		examples: []
	}
};

export function getDoc(slug: string): ComponentDoc | undefined {
	return docs[slug];
}
