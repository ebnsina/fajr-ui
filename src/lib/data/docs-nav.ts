import { components } from './components';
import { examples } from './examples';

export type DocsNavLink = {
	title: string;
	href: string;
	badge?: string;
	external?: boolean;
};

export type DocsNavSection = {
	title: string;
	items: DocsNavLink[];
};

export const docsNav: DocsNavSection[] = [
	{
		title: 'Overview',
		items: [
			{ title: 'Introduction', href: '/docs' },
			{ title: 'Get Started', href: '/docs/get-started' },
			{ title: 'CLI', href: '/docs/cli' },
			{ title: 'Theming', href: '/docs/theming' },
			{ title: 'Styling', href: '/docs/styling' },
			{ title: 'Right to left', href: '/docs/rtl' },
			{ title: 'For AI agents', href: '/docs/ai' },
			{ title: 'Changelog', href: '/docs/changelog' },
			{ title: 'Roadmap', href: '/docs/roadmap' }
		]
	},
	{
		title: 'Examples',
		// Derived from the gallery rather than repeated, so a new example appears
		// in the sidebar the moment it is added to `examples`.
		items: [
			{ title: 'All examples', href: '/examples' },
			...examples.map((entry) => ({ title: entry.name, href: entry.href }))
		]
	},
	{
		title: 'Components',
		items: components.map((entry) => ({
			title: entry.name,
			href: `/docs/components/${entry.slug}`,
			badge: entry.isNew ? 'New' : undefined
		}))
	}
];
