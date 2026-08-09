import { json } from '@sveltejs/kit';
import { registryIndex } from '$lib/registry/build';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => json({ items: registryIndex() });
