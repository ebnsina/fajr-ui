export type Manuscript = {
	id: string;
	title: string;
	scholar: string;
	city: string;
	discipline: string;
	status: 'copied' | 'in review' | 'on hold';
	folios: number;
	year: number;
};

const TITLES = [
	'The Canon of Medicine',
	'The Book of Optics',
	'The Compendious Book on Calculation',
	'The Book of Roger',
	'The Method of Medicine',
	'The Book of Healing',
	'Kitab al-Hiyal',
	'The Book of Fixed Stars',
	'The Comprehensive Book on Medicine',
	'On the Calculation with Hindu Numerals',
	'The Book of Ingenious Devices',
	'The Treatise on the Astrolabe',
	'The Almagest, annotated',
	'The Book of Animals',
	'Chronology of Ancient Nations',
	'The Book of Roads and Kingdoms'
];
const SCHOLARS = [
	'Ibn Sina',
	'Ibn al-Haytham',
	'Al-Khwarizmi',
	'Al-Idrisi',
	'Al-Zahrawi',
	'Al-Biruni',
	'Al-Jazari',
	'Al-Sufi',
	'Al-Razi',
	'Al-Kindi',
	'Ibn Battuta',
	'Ibn Rushd',
	'Jabir ibn Hayyan',
	'Nasir al-Din al-Tusi',
	'Maryam al-Asturlabi',
	'Fatima al-Fihri'
];
const CITIES = [
	'Baghdad',
	'Córdoba',
	'Samarkand',
	'Cairo',
	'Fez',
	'Damascus',
	'Bukhara',
	'Timbuktu',
	'Isfahan',
	'Granada',
	'Basra',
	'Balkh'
];
export const DISCIPLINES = [
	'Algebra',
	'Optics',
	'Astronomy',
	'Medicine',
	'Cartography',
	'Mechanics'
];
export const STATUSES: Manuscript['status'][] = ['copied', 'in review', 'on hold'];

/**
 * A deterministic generator rather than `Math.random()`: the same seed gives the
 * same rows on the server and in the browser, so a server-rendered table does
 * not flip its contents on hydration.
 */
function mulberry32(seed: number): () => number {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function makeManuscripts(count: number, seed = 1): Manuscript[] {
	const random = mulberry32(seed);
	const pick = <T>(list: T[]): T => list[Math.floor(random() * list.length)];

	return Array.from({ length: count }, (_, index) => ({
		id: `MS-${String(index + 1).padStart(5, '0')}`,
		title: pick(TITLES),
		scholar: pick(SCHOLARS),
		city: pick(CITIES),
		discipline: pick(DISCIPLINES),
		status: pick(STATUSES),
		folios: 40 + Math.floor(random() * 1400),
		year: 800 + Math.floor(random() * 500)
	}));
}
