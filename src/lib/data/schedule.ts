export type CalendarId = 'scriptorium' | 'observatory' | 'lectures' | 'travel';

export type ScheduleEvent = {
	id: string;
	title: string;
	/** `YYYY-MM-DD`, built in local time so a date never shifts across a timezone. */
	date: string;
	/** Minutes from midnight. `null` for an all-day entry. */
	start: number | null;
	/** Duration in minutes. Ignored when `start` is `null`. */
	minutes: number;
	calendar: CalendarId;
	location?: string;
	people?: string[];
};

export const CALENDARS: { id: CalendarId; label: string; token: string }[] = [
	{ id: 'scriptorium', label: 'Scriptorium', token: 'var(--color-primary)' },
	{ id: 'observatory', label: 'Observatory', token: 'var(--color-info)' },
	{ id: 'lectures', label: 'Lectures', token: 'var(--color-success)' },
	{ id: 'travel', label: 'Travel', token: 'var(--color-warning)' }
];

export const HOUR_START = 7;
export const HOUR_END = 20;

/** Working hours, shaded so the rest of the day reads as outside them. */
export const BUSINESS_START = 9;
export const BUSINESS_END = 17;

/** Pixels per hour in the time grid; one place so the maths agrees everywhere. */
export const HOUR_HEIGHT = 56;

/** Drag and resize land on quarter hours rather than wherever the pointer was. */
export const SNAP_MINUTES = 15;

export type LaidOutEvent = ScheduleEvent & {
	/** Which column of an overlapping run this sits in. */
	lane: number;
	/** How many columns that run needs. */
	lanes: number;
};

/**
 * Places overlapping events side by side.
 *
 * Events are swept in start order; each one takes the first lane whose previous
 * occupant has already finished. A run of mutually overlapping events shares a
 * lane count so they end up the same width, which is what stops a two-event
 * clash rendering as one wide and one narrow.
 */
export function layOut(events: ScheduleEvent[]): LaidOutEvent[] {
	const timed = events
		.filter((event) => event.start !== null)
		.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));

	const out: LaidOutEvent[] = [];
	let cluster: LaidOutEvent[] = [];
	let clusterEnd = -1;
	const laneEnds: number[] = [];

	const flush = () => {
		const lanes = laneEnds.length;
		for (const event of cluster) event.lanes = lanes;
		out.push(...cluster);
		cluster = [];
		laneEnds.length = 0;
		clusterEnd = -1;
	};

	for (const event of timed) {
		const start = event.start ?? 0;
		const end = start + event.minutes;
		// A gap with nothing running means the previous cluster is closed.
		if (start >= clusterEnd && cluster.length) flush();

		let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start);
		if (lane === -1) {
			lane = laneEnds.length;
			laneEnds.push(end);
		} else {
			laneEnds[lane] = end;
		}

		cluster.push({ ...event, lane, lanes: 1 });
		clusterEnd = Math.max(clusterEnd, end);
	}
	if (cluster.length) flush();
	return out;
}

/** ISO week number, so the month view can label its rows. */
export function weekNumber(date: Date): number {
	const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	// Thursday decides the year a week belongs to.
	target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
	const firstThursday = new Date(target.getFullYear(), 0, 4);
	firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));
	return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 86400000));
}

export function toISODate(date: Date): string {
	// Built from the local parts rather than `toISOString`, which converts to UTC
	// and can land on the previous day west of Greenwich.
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}

export const LOCALES = [
	{ value: 'en-US', label: 'English (US)' },
	{ value: 'en-GB', label: 'English (UK)' },
	{ value: 'de-DE', label: 'Deutsch' },
	{ value: 'fr-FR', label: 'Français' },
	{ value: 'es-ES', label: 'Español' },
	{ value: 'ar-EG', label: 'العربية' },
	{ value: 'ja-JP', label: '日本語' }
];

export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'];

export function isRTL(locale: string): boolean {
	return RTL_LOCALES.includes(locale.split('-')[0]);
}

/**
 * Which weekday the region starts its week on, as 1–7 for Monday–Sunday.
 *
 * `Intl.Locale` knows this — the United States starts on Sunday, most of Europe
 * on Monday — but `getWeekInfo` is not everywhere yet, so a Monday default
 * stands in rather than the calendar breaking.
 */
export function firstDayOf(locale: string): number {
	try {
		const info = new Intl.Locale(locale) as Intl.Locale & {
			getWeekInfo?: () => { firstDay: number };
			weekInfo?: { firstDay: number };
		};
		return info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay ?? 1;
	} catch {
		return 1;
	}
}

/**
 * Time of day in the locale's own convention — the twelve-hour clock is an
 * English-speaking habit, not a universal one, and hard-coding am/pm gets it
 * wrong everywhere else.
 */
export function formatTime(minutes: number, locale = 'en-US'): string {
	const date = new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60);
	return new Intl.DateTimeFormat(locale, {
		hour: 'numeric',
		minute: minutes % 60 === 0 ? undefined : '2-digit'
	}).format(date);
}

/** Localised, correctly ordered weekday names for the grid header. */
export function weekdayNames(locale: string, firstDay: number): string[] {
	const format = new Intl.DateTimeFormat(locale, { weekday: 'short' });
	// 2024-01-01 was a Monday, so offsetting from it gives any weekday by index.
	return Array.from({ length: 7 }, (_, index) =>
		format.format(new Date(2024, 0, 1 + ((firstDay - 1 + index) % 7)))
	);
}

const TITLES: { title: string; calendar: CalendarId; location?: string; people?: string[] }[] = [
	{ title: 'Copy Book IV', calendar: 'scriptorium', location: 'Desk 3', people: ['Ibn Sina'] },
	{
		title: 'Collate the Optics',
		calendar: 'scriptorium',
		location: 'Desk 1',
		people: ['Ibn al-Haytham']
	},
	{ title: 'Bind the Compendious Book', calendar: 'scriptorium', location: 'Bindery' },
	{ title: 'Rule folios', calendar: 'scriptorium', location: 'Desk 5' },
	{
		title: 'Lunar observation',
		calendar: 'observatory',
		location: 'Maragheh',
		people: ['Al-Tusi']
	},
	{ title: 'Calibrate the astrolabe', calendar: 'observatory', location: 'North tower' },
	{ title: 'Star table review', calendar: 'observatory', people: ['Al-Sufi', 'Ulugh Beg'] },
	{
		title: 'Lecture: algebra',
		calendar: 'lectures',
		location: 'Hall of Wisdom',
		people: ['Al-Khwarizmi']
	},
	{
		title: 'Lecture: the humours',
		calendar: 'lectures',
		location: 'Hall of Wisdom',
		people: ['Al-Razi']
	},
	{ title: 'Reading circle', calendar: 'lectures', location: 'Courtyard' },
	{ title: 'Caravan to Bukhara', calendar: 'travel', location: 'East gate' },
	{ title: 'Return from Córdoba', calendar: 'travel' }
];

/** Deterministic, so the server and the browser agree on what to render. */
function mulberry32(seed: number): () => number {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Fills the month `anchor` falls in, plus the months either side of it. */
export function makeSchedule(anchor: Date, seed = 11): ScheduleEvent[] {
	const random = mulberry32(seed);
	const events: ScheduleEvent[] = [];
	let id = 0;

	for (let offset = -1; offset <= 1; offset++) {
		const month = new Date(anchor.getFullYear(), anchor.getMonth() + offset, 1);
		const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

		for (let day = 1; day <= days; day++) {
			const date = new Date(month.getFullYear(), month.getMonth(), day);
			const weekday = date.getDay();
			if (weekday === 5) continue; // The scriptorium is closed.

			const count = Math.floor(random() * 3.4);
			for (let index = 0; index < count; index++) {
				const template = TITLES[Math.floor(random() * TITLES.length)];
				const allDay = template.calendar === 'travel' && random() < 0.5;
				const startHour = HOUR_START + Math.floor(random() * (HOUR_END - HOUR_START - 2));
				events.push({
					id: `evt-${id++}`,
					date: toISODate(date),
					start: allDay ? null : startHour * 60 + (random() < 0.4 ? 30 : 0),
					minutes: [45, 60, 90, 120][Math.floor(random() * 4)],
					...template
				});
			}
		}
	}

	return events;
}
