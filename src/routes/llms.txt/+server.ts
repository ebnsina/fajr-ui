import { llmsTxt } from '$lib/llms/build';
import type { RequestHandler } from './$types';

export const prerender = true;

/**
 * The llms.txt convention: a short index at a predictable path that tells a
 * model what this project is and where to read the rest. Served as plain text
 * so it renders in a browser rather than downloading.
 */
export const GET: RequestHandler = () =>
	new Response(llmsTxt(), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
