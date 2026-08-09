import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';

/*
 * The site is served from a GitHub Pages project page, so every route sits
 * under the repository name rather than at the root.
 *
 * It applies in dev as well as in the build, on purpose. A base path that only
 * exists in production is a base path nobody tests, and a link missing its
 * prefix then works perfectly in dev and 404s once deployed — the one failure
 * this setting exists to prevent. Dev pays a redirect for it.
 *
 * The exception is Vitest's browser mode, which serves its own harness page
 * rather than the app: a base it does not know about moves the harness assets
 * out from under it, and the run dies without ever reaching a test. Components
 * are mounted directly there, so there is no routing to get wrong anyway.
 */
const BASE = '/fajr-ui';

export default defineConfig(({ mode }) => {
	const base = mode === 'test' ? '' : BASE;

	return {
		plugins: [
			tailwindcss(),
			sveltekit({
				compilerOptions: {
					// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
					runes: ({ filename }) =>
						filename.split(/[/\\]/).includes('node_modules') ? undefined : true
				},

				/*
				 * `fallback` gives GitHub Pages the file it serves for anything it does
				 * not recognise, which is how a deep link to a route that no longer
				 * exists reaches the app's own error page instead of GitHub's.
				 *
				 * It does not weaken the build: every page is marked prerenderable in
				 * the root layout, so one that fails to render still fails the build
				 * rather than quietly falling through to this.
				 */
				adapter: adapter({ fallback: '404.html' }),
				paths: { base },

				prerender: {
					/*
					 * The dashboard example's sidebar is populated from a nav that
					 * describes a whole product — collections, scholars, an observatory —
					 * of which only the overview is actually built. Those entries exist to
					 * show a sidebar carrying a realistic amount of navigation, and
					 * shortening the list to what is implemented would demonstrate less.
					 *
					 * So they are allowed to 404, and nothing else is. A broken link
					 * anywhere in the documentation still fails the build, which is the
					 * only reason this handler can be trusted at all.
					 */
					handleHttpError: ({ path, referrer, message }) => {
						const isDemoNav = path.startsWith(`${base}/examples/dashboard/app/`);
						if (isDemoNav) return;
						throw new Error(`${message} (linked from ${referrer})`);
					}
				}
			})
		],
		ssr: {
			// Ships an uncompiled .svelte file, so Vite has to process it rather than
			// letting Node import it directly during dev SSR.
			noExternal: ['@hugeicons/svelte', '@tanstack/svelte-charts', '@tanstack/svelte-table']
		},
		test: {
			expect: { requireAssertions: true },
			projects: [
				{
					extends: './vite.config.ts',
					test: {
						name: 'client',
						browser: {
							enabled: true,
							provider: playwright(),
							instances: [{ browser: 'chromium', headless: true }]
						},
						include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
						exclude: ['src/lib/server/**']
					}
				},

				{
					extends: './vite.config.ts',
					test: {
						name: 'server',
						environment: 'node',
						include: ['src/**/*.{test,spec}.{js,ts}'],
						exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
					}
				},

				{
					// The CLI is plain Node with no dependencies, and lives outside
					// `src/`, so neither of the two projects above would pick it up.
					extends: './vite.config.ts',
					test: {
						name: 'cli',
						environment: 'node',
						include: ['cli/**/*.{test,spec}.js']
					}
				}
			]
		}
	};
});
