import { makeManuscripts, type Manuscript } from './manuscripts';

export type ManuscriptQuery = {
	search?: string;
	disciplines?: string[];
	statuses?: string[];
	sort?: string;
	desc?: boolean;
	page?: number;
	size?: number;
};

export type ManuscriptPage = {
	rows: Manuscript[];
	rowCount: number;
};

const ALL = makeManuscripts(5000);

/**
 * Filter, sort and slice 5000 rows the way a backend would, and answer with one
 * page plus the total count.
 *
 * This is the half of the server-side example that a real deployment would run
 * behind an HTTP endpoint. The docs site is prerendered to static files and has
 * no server to run it on, so it runs in the browser instead — and it is written
 * as an async function returning `{ rows, rowCount }` precisely so the calling
 * component is the same either way. Swapping it for `fetch('/api/manuscripts')`
 * changes the data source and nothing else.
 */
export async function queryManuscripts(
	query: ManuscriptQuery,
	{ signal, delay = 220 }: { signal?: AbortSignal; delay?: number } = {}
): Promise<ManuscriptPage> {
	const search = (query.search ?? '').trim().toLowerCase();
	const disciplines = query.disciplines ?? [];
	const statuses = query.statuses ?? [];
	const page = Math.max(0, query.page ?? 0);
	const size = Math.min(100, Math.max(1, query.size ?? 10));

	let rows: Manuscript[] = ALL;

	if (search) {
		rows = rows.filter((row) =>
			`${row.title} ${row.scholar} ${row.city} ${row.id}`.toLowerCase().includes(search)
		);
	}
	if (disciplines.length) rows = rows.filter((row) => disciplines.includes(row.discipline));
	if (statuses.length) rows = rows.filter((row) => statuses.includes(row.status));

	if (query.sort) {
		rows = [...rows].sort((a, b) => {
			const left = a[query.sort as keyof Manuscript];
			const right = b[query.sort as keyof Manuscript];
			const order =
				typeof left === 'number' && typeof right === 'number'
					? left - right
					: String(left).localeCompare(String(right));
			return query.desc ? -order : order;
		});
	}

	// A visible delay, so the loading and empty states are actually exercised
	// rather than flashing past. Abort rejects the same way `fetch` does, which
	// is what lets the caller drop a superseded response without a special case.
	await new Promise<void>((resolve, reject) => {
		if (signal?.aborted) return reject(abortError());
		const timer = setTimeout(resolve, delay);
		signal?.addEventListener('abort', () => {
			clearTimeout(timer);
			reject(abortError());
		});
	});

	return {
		rows: rows.slice(page * size, page * size + size),
		rowCount: rows.length
	};
}

function abortError() {
	return new DOMException('The operation was aborted.', 'AbortError');
}
