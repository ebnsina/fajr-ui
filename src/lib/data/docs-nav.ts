import { base } from '$app/paths';
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
			{ title: 'Introduction', href: `${base}/docs` },
			{ title: 'Get Started', href: `${base}/docs/get-started` },
			{ title: 'CLI', href: `${base}/docs/cli` },
			{ title: 'Theming', href: `${base}/docs/theming` },
			{ title: 'Styling', href: `${base}/docs/styling` },
			{ title: 'Right to left', href: `${base}/docs/rtl` },
			{ title: 'For AI agents', href: `${base}/docs/ai` },
			{ title: 'Changelog', href: `${base}/docs/changelog` },
			{ title: 'Roadmap', href: `${base}/docs/roadmap` }
		]
	},
	{
		title: 'Examples',
		// Derived from the gallery rather than repeated, so a new example appears
		// in the sidebar the moment it is added to `examples`.
		items: [
			{ title: 'All examples', href: `${base}/examples` },
			...examples.map((entry) => ({ title: entry.name, href: entry.href }))
		]
	},
	{
		title: 'Components',
		items: components.map((entry) => ({
			title: entry.name,
			href: `${base}/docs/components/${entry.slug}`,
			badge: entry.isNew ? 'New' : undefined
		}))
	}
];
