import { skillMarkdown } from '$lib/llms/rules';
import type { RequestHandler } from './$types';

export const prerender = true;

/** The agent skill, so `npx fajr-ui skill` can fetch it rather than bundle it. */
export const GET: RequestHandler = () =>
	new Response(skillMarkdown(), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
