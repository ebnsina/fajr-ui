import { error } from '@sveltejs/kit';
import { components, getComponent } from '$lib/data/components';
import type { EntryGenerator, PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const component = getComponent(params.slug);
	if (!component) error(404, `Unknown component "${params.slug}"`);
	return { component };
};

export const entries: EntryGenerator = () => components.map(({ slug }) => ({ slug }));
