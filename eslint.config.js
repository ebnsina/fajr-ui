import prettier from 'eslint-config-prettier';
import path from 'node:path';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		}
	},
	{
		rules: {
			/*
			 * `resolve()` exists so links keep working under a configured base path.
			 * This app has none — there is no `svelte.config.js`, the Kit options are
			 * inline in `vite.config.ts`, and nothing sets `paths.base`.
			 *
			 * More to the point, the rule is unsatisfiable in the library itself.
			 * Button, Badge and SidebarMenuButton take `href` as a pass-through prop
			 * from whoever uses them; a component cannot resolve a route it has never
			 * been told. Turning it on would mean either a suppression on every one
			 * of those, or a `resolve()` call that cannot be written.
			 *
			 * Configure a base path and this should come back on.
			 */
			'svelte/no-navigation-without-resolve': 'off'
		}
	}
);
