import { base } from '$app/paths';
import { docsNav } from '$lib/data/docs-nav';
import { examples } from '$lib/data/examples';
import { SITE } from '$lib/llms/rules';

export const prerender = true;

/**
 * The sitemap, derived rather than written.
 *
 * `docsNav` is already the one list of documentation pages — it is what the
 * sidebar renders — so reading it here means a new component or a new overview
 * page appears in the sitemap by existing, not by being remembered. The example
 * apps are the only URLs the nav does not cover, since the gallery links to
 * each write-up rather than to the screen itself.
 */
function urls(): string[] {
	const paths = new Set<string>([`${base}/`]);

	for (const section of docsNav) {
		for (const item of section.items) {
			if (!item.external) paths.add(item.href);
		}
	}

	for (const example of examples) paths.add(`${base}/examples/${example.slug}/app`);

	// Resolving against SITE keeps only its origin, because each path is absolute
	// and already carries the base — the same reasoning as the canonical tags.
	return [...paths].sort().map((path) => new URL(path, SITE).href);
}

export const GET = async () => {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls()
	.map((url) => `\t<url><loc>${url}</loc></url>`)
	.join('\n')}
</urlset>
`;

	return new Response(body, { headers: { 'content-type': 'application/xml' } });
};
