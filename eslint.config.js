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
			 * There now is one — `paths.base` in `vite.config.ts`, because the site
			 * is served from a GitHub Pages project path — and every link in the app
			 * carries `base` explicitly.
			 *
			 * The rule stays off all the same, because it is unsatisfiable in the
			 * library itself. Button, Badge and SidebarMenuButton take `href` as a
			 * pass-through prop from whoever uses them; a component cannot resolve a
			 * route it has never been told. Turning it on would mean either a
			 * suppression on every one of those, or a `resolve()` call that cannot be
			 * written.
			 *
			 * What actually catches a missed prefix is the build: prerendering
			 * crawls every link and fails on one that does not begin with `base`.
			 * That is a stronger check than the rule, and it covers the
			 * pass-through props the rule cannot see.
			 */
			'svelte/no-navigation-without-resolve': 'off'
		}
	}
);
