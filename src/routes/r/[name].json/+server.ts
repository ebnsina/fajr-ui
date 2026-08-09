import { error, json } from '@sveltejs/kit';
import { allItemNames, buildItem } from '$lib/registry/build';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => allItemNames().map((name) => ({ name }));

export const GET: RequestHandler = ({ params }) => {
	const item = buildItem(params.name);
	if (!item) error(404, `No registry item named "${params.name}".`);
	return json(item);
};
