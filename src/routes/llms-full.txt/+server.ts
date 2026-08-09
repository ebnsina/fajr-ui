import { llmsFullTxt } from '$lib/llms/build';
import type { RequestHandler } from './$types';

export const prerender = true;

/** Every component's API and examples inline — the paste-into-context view. */
export const GET: RequestHandler = () =>
	new Response(llmsFullTxt(), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
