import { error } from '@sveltejs/kit';
import { components } from '$lib/data/components';
import { componentMarkdown } from '$lib/llms/build';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

/**
 * One component as markdown, at the page URL plus `.md`. That is the address an
 * agent guesses first, and it means fetching the docs for a single component
 * costs one request rather than the whole catalogue.
 */
export const GET: RequestHandler = ({ params }) => {
	const markdown = componentMarkdown(params.slug);
	if (!markdown) error(404, `Unknown component "${params.slug}"`);
	return new Response(markdown, {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
};

export const entries: EntryGenerator = () => components.map(({ slug }) => ({ slug }));
