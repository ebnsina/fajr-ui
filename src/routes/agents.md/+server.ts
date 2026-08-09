import { agentsMarkdown } from '$lib/llms/rules';
import type { RequestHandler } from './$types';

export const prerender = true;

/** The AGENTS.md block, marked so it can be refreshed in place. */
export const GET: RequestHandler = () =>
	new Response(agentsMarkdown(), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
