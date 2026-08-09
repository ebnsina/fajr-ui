import type { IconSvgElement } from '@hugeicons/svelte';
import {
	AtlasIcon,
	CollectionIcon,
	InsightsIcon,
	ManuscriptIcon,
	MembersIcon,
	ObservatoryIcon,
	OverviewIcon,
	SettingsIcon,
	SupportIcon,
	TranslationIcon
} from '$lib/icons';

export type NavItem = {
	title: string;
	href: string;
	icon: IconSvgElement;
	badge?: string;
	items?: { title: string; href: string }[];
};

export const navMain: NavItem[] = [
	{ title: 'Overview', href: '/examples/dashboard/app', icon: OverviewIcon },
	{
		title: 'Manuscripts',
		href: '/examples/dashboard/app/manuscripts',
		icon: ManuscriptIcon,
		badge: '12',
		items: [
			{ title: 'In the scriptorium', href: '/examples/dashboard/app/manuscripts' },
			{ title: 'Awaiting review', href: '/examples/dashboard/app/manuscripts/review' },
			{ title: 'Archived', href: '/examples/dashboard/app/manuscripts/archive' }
		]
	},
	{ title: 'Translations', href: '/examples/dashboard/app/translations', icon: TranslationIcon },
	{ title: 'Scholars', href: '/examples/dashboard/app/scholars', icon: MembersIcon },
	{ title: 'Collections', href: '/examples/dashboard/app/collections', icon: CollectionIcon },
	{ title: 'Observatory', href: '/examples/dashboard/app/observatory', icon: ObservatoryIcon },
	{ title: 'Atlas', href: '/examples/dashboard/app/atlas', icon: AtlasIcon },
	{ title: 'Insights', href: '/examples/dashboard/app/insights', icon: InsightsIcon }
];

export const navSecondary: NavItem[] = [
	{ title: 'Settings', href: '/examples/dashboard/app/settings', icon: SettingsIcon },
	{ title: 'Support', href: '/examples/dashboard/app/support', icon: SupportIcon }
];
