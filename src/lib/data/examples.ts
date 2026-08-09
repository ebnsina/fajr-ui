export type ExampleEntry = {
	slug: string;
	name: string;
	description: string;
	href: string;
	/** What the screen is built from, so the list says more than its title. */
	uses: string[];
};

/**
 * Full screens assembled from the library, as opposed to the single-component
 * examples on each documentation page. There is one today; the page is built as
 * a list so adding the next one is a matter of adding an entry.
 */
export const examples: ExampleEntry[] = [
	{
		slug: 'calendar',
		name: 'Calendar',
		description:
			'Month, week, day and agenda views, overlapping events, drag to reschedule, and a full write-up of how it is put together.',
		href: '/examples/calendar',
		uses: ['Calendar', 'Popover', 'Toggle Group', 'Badge', 'Button', 'Separator', 'Label']
	},
	{
		slug: 'dashboard',
		name: 'Dashboard',
		description:
			'A House of Wisdom workspace: collapsible sidebar, stat cards and a work queue, in a full-width or inset layout.',
		href: '/examples/dashboard',
		uses: ['Sidebar', 'Card', 'Chart', 'Badge', 'Avatar', 'Separator', 'Input', 'Button']
	},
	{
		slug: 'landing',
		name: 'SaaS landing page',
		description:
			'A marketing page for a manuscript archive: hero, product preview, feature grid, pricing with a billing toggle, testimonials and an FAQ.',
		href: '/examples/landing',
		uses: ['Tabs', 'Accordion', 'Switch', 'Sheet', 'Badge', 'Avatar', 'Input', 'Button']
	}
];
