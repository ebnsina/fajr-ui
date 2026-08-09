/**
 * Copy for the marketing example.
 *
 * Kept out of the page so the page is layout and behaviour only — a landing
 * page is mostly content, and mixing the two makes both harder to read. The
 * product, the institutions and the people are invented; the setting is the
 * libraries and observatories of the Islamic Golden Age.
 */

export const PRODUCT = 'Qalam';

export type NavLink = { label: string; href: string };

export const NAV: NavLink[] = [
	{ label: 'Product', href: '#product' },
	{ label: 'Features', href: '#features' },
	{ label: 'Pricing', href: '#pricing' },
	{ label: 'Questions', href: '#faq' }
];

export type Partner = {
	name: string;
	/** Where it is, which is what makes a list of institutions read as a map. */
	place: string;
	/** Monogram standing in for a logo — there is no artwork to invent. */
	mark: string;
	kind: 'Library' | 'Observatory' | 'University' | 'Hospital' | 'Archive';
};

export const PARTNERS: Partner[] = [
	{ name: 'Bayt al-Hikma', place: 'Baghdad', mark: 'BH', kind: 'Library' },
	{ name: 'Maragheh Observatory', place: 'Maragheh', mark: 'MO', kind: 'Observatory' },
	{ name: 'Al-Qarawiyyin', place: 'Fez', mark: 'AQ', kind: 'University' },
	{ name: 'Dar al-Ilm', place: 'Cairo', mark: 'DI', kind: 'Library' },
	{ name: 'Bimaristan al-Adudi', place: 'Baghdad', mark: 'BA', kind: 'Hospital' },
	{ name: 'Córdoba Athenaeum', place: 'Córdoba', mark: 'CA', kind: 'Archive' },
	{ name: 'Ulugh Beg Madrasa', place: 'Samarkand', mark: 'UB', kind: 'University' },
	{ name: 'Zaytuna Collection', place: 'Tunis', mark: 'ZC', kind: 'Archive' }
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
	{ value: '2.4M', label: 'Folios catalogued' },
	{ value: '340', label: 'Institutions' },
	{ value: '61', label: 'Languages and scripts' },
	{ value: '99.98%', label: 'Uptime, trailing year' }
];

export type Feature = {
	title: string;
	body: string;
	icon: string;
	/**
	 * Columns this tile takes on a six-column grid. The bento is deliberate:
	 * the two claims that carry the pitch get the room, and the rest get a
	 * sentence each. Rows here read 4+2, 2+2+2, 3+3.
	 */
	span: 2 | 3 | 4;
	/** Which flourish the page draws inside the tile, if any. */
	art?: 'record' | 'permissions';
};

/**
 * `icon` and `art` are keys rather than components, so this file stays plain
 * data and the page decides how each is drawn.
 */
export const FEATURES: Feature[] = [
	{
		icon: 'catalogue',
		title: 'One record per work',
		body: 'Every folio, edition and fragment gathered under a single record, with provenance, condition and shelfmark attached rather than kept in a spreadsheet beside it.',
		span: 4,
		art: 'record'
	},
	{
		icon: 'rights',
		title: 'Rights that hold',
		body: 'Permissions per collection, per folio and per field, so an embargoed acquisition stays private while the catalogue around it stays public.',
		span: 2,
		art: 'permissions'
	},
	{
		icon: 'transcribe',
		title: 'Transcribe side by side',
		body: 'The folio on one half, the text on the other, line-anchored so a correction three years later still points at the right line.',
		span: 2
	},
	{
		icon: 'translate',
		title: 'Translation memory',
		body: 'Every phrase your scholars have rendered before is offered again, with the reading each of them chose and who chose it.',
		span: 2
	},
	{
		icon: 'search',
		title: 'Search across scripts',
		body: 'Arabic, Persian, Hebrew and Latin transliteration answer the same query, so a work is found under the name the reader knows it by.',
		span: 2
	},
	{
		icon: 'api',
		title: 'An API, not an export',
		body: 'Read and write everything the interface can, on stable identifiers, so your reading room and your public site draw from one source.',
		span: 3
	},
	{
		icon: 'offline',
		title: 'Works in the reading room',
		body: 'Transcription carries on without a connection and syncs when one returns. Conflicting edits are held side by side for a reviewer, never resolved behind your back.',
		span: 3
	}
];

export type Tier = {
	id: string;
	name: string;
	blurb: string;
	/** In whole units; `null` is quoted rather than listed. */
	monthly: number | null;
	yearly: number | null;
	cta: string;
	featured?: boolean;
	includes: string[];
};

export const TIERS: Tier[] = [
	{
		id: 'scriptorium',
		name: 'Scriptorium',
		blurb: 'For one scholar and one collection.',
		monthly: 0,
		yearly: 0,
		cta: 'Start for free',
		includes: [
			'1 collection, 500 folios',
			'Transcription and annotation',
			'Public catalogue page',
			'Community support'
		]
	},
	{
		id: 'academy',
		name: 'Academy',
		blurb: 'For a department working together.',
		monthly: 24,
		yearly: 19,
		cta: 'Start free trial',
		featured: true,
		includes: [
			'Unlimited collections, 50,000 folios',
			'Translation memory and glossaries',
			'Roles, review queues and approvals',
			'Full API and webhooks',
			'Priority support, one business day'
		]
	},
	{
		id: 'institution',
		name: 'Institution',
		blurb: 'For a library that answers to a board.',
		monthly: null,
		yearly: null,
		cta: 'Talk to us',
		includes: [
			'Everything in Academy, without limits',
			'Single sign-on and directory sync',
			'Audit log and retention policy',
			'Region of your choosing',
			'Named contact and onboarding'
		]
	}
];

export type Testimonial = {
	quote: string;
	name: string;
	role: string;
	initials: string;
	/** The one number that quotation is really about. */
	metric?: { value: string; label: string };
	/** The lead quotation, given the room the others share. */
	featured?: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
	{
		quote:
			'We had four catalogues and none of them agreed with each other. Moving them onto one record took a term, and the arguments about which of them was correct ended with it. The part I did not expect was how much of the work was deciding what we actually held — the software only ever made that decision visible.',
		name: 'Layla al-Qurtubi',
		role: 'Keeper of Manuscripts, Córdoba Athenaeum',
		initials: 'LQ',
		metric: { value: '4 → 1', label: 'Catalogues, merged in a term' },
		featured: true
	},
	{
		quote:
			'Line-anchored transcription is the part I did not know I needed. A note left on folio 41 is still on folio 41 after the rebinding and the rescan.',
		name: 'Yusuf ibn Marwan',
		role: 'Lead Scribe, Bayt al-Hikma',
		initials: 'YM',
		metric: { value: '18,400', label: 'Folios transcribed' }
	},
	{
		quote:
			'Our star tables are public and our acquisitions are not. One permissions model covers both, which is why our lawyers stopped asking.',
		name: 'Sitt al-Munajjima',
		role: 'Director, Maragheh Observatory',
		initials: 'SM',
		metric: { value: '0', label: 'Embargo incidents since' }
	},
	{
		quote:
			'Students in Fez now cite the same identifier as readers in Tunis. That sounds small until you have spent a decade reconciling two numbering schemes.',
		name: 'Hafsa bint Idris',
		role: 'Head of Digital Collections, Al-Qarawiyyin',
		initials: 'HI',
		metric: { value: '1 scheme', label: 'Shared across four sites' }
	},
	{
		quote:
			'The translation memory changed how we train. A new scholar sees how the last three rendered a phrase, and the argument happens before the text is set, not after.',
		name: 'Tahir al-Baghdadi',
		role: 'Editor of Translations, Dar al-Ilm',
		initials: 'TB',
		metric: { value: '61', label: 'Languages in the memory' }
	}
];

export type FooterGroup = { title: string; links: NavLink[] };

/**
 * A real footer, because on a marketing page it is the second navigation: the
 * place people go when the hero did not answer their question.
 */
export const FOOTER: FooterGroup[] = [
	{
		title: 'Product',
		links: [
			{ label: 'Catalogue', href: '#product' },
			{ label: 'Transcription', href: '#product' },
			{ label: 'Translation memory', href: '#features' },
			{ label: 'Rights and access', href: '#features' },
			{ label: 'Pricing', href: '#pricing' }
		]
	},
	{
		title: 'For',
		links: [
			{ label: 'National libraries', href: '#pricing' },
			{ label: 'University collections', href: '#pricing' },
			{ label: 'Observatories', href: '#pricing' },
			{ label: 'Private archives', href: '#pricing' },
			{ label: 'Independent scholars', href: '#pricing' }
		]
	},
	{
		title: 'Resources',
		links: [
			{ label: 'Documentation', href: '#faq' },
			{ label: 'API reference', href: '#product' },
			{ label: 'Import guide', href: '#faq' },
			{ label: 'Cataloguing standards', href: '#faq' },
			{ label: 'Changelog', href: '#faq' }
		]
	},
	{
		title: 'Company',
		links: [
			{ label: 'About', href: '#features' },
			{ label: 'Partners', href: '#partners' },
			{ label: 'Careers', href: '#features' },
			{ label: 'Contact', href: '#faq' },
			{ label: 'Status', href: '#faq' }
		]
	}
];

export const LEGAL: NavLink[] = [
	{ label: 'Privacy', href: '#faq' },
	{ label: 'Terms', href: '#faq' },
	{ label: 'Accessibility', href: '#faq' },
	{ label: 'Data processing', href: '#faq' }
];

export type Faq = { id: string; q: string; a: string };

export const FAQS: Faq[] = [
	{
		id: 'migrate',
		q: 'Can we bring an existing catalogue across?',
		a: 'Yes. Import from CSV, MARC or an existing API, and map your fields once. Identifiers you already publish are preserved, so links printed in past catalogues keep resolving.'
	},
	{
		id: 'images',
		q: 'Where do the images live?',
		a: 'Wherever you already keep them. Point a collection at your own image server and the viewer streams from it; nothing is copied unless you ask for it to be.'
	},
	{
		id: 'offline',
		q: 'Does it work in a reading room with poor connectivity?',
		a: 'Transcription keeps working offline and syncs when the connection returns. Conflicting edits are held side by side for a reviewer rather than resolved silently.'
	},
	{
		id: 'leave',
		q: 'What happens if we leave?',
		a: 'You export everything — records, transcriptions, revisions and permissions — as plain files with the same identifiers. There is no departure fee and no read-only hostage period.'
	},
	{
		id: 'billing',
		q: 'Who counts as an editor?',
		a: 'Anyone who can change a record. Readers, students and the public are unlimited on every plan, including the free one.'
	}
];
