import { createHighlighter } from '@tanstack/highlight/core';
import { shell } from '@tanstack/highlight/languages/shell';
import { css } from '@tanstack/highlight/languages/css';
import { diff } from '@tanstack/highlight/languages/diff';
import { html } from '@tanstack/highlight/languages/html';
import { js } from '@tanstack/highlight/languages/js';
import { json } from '@tanstack/highlight/languages/json';
import { svelte } from '@tanstack/highlight/languages/svelte';
import { ts } from '@tanstack/highlight/languages/ts';

/**
 * Only the languages the documentation actually shows are registered, so the
 * bundle carries eight small tokenizers rather than all twenty-six.
 *
 * Highlighting is synchronous and runs identically on the server and in the
 * browser, so code blocks arrive already coloured in the HTML — there is no
 * flash of unhighlighted source, and no highlighting work on the client.
 *
 * Registering `ts`, `js` and `css` also lets the `svelte` and `html`
 * tokenizers delegate embedded `<script>` and `<style>` regions to them.
 */
export const highlighter = createHighlighter({
	languages: [svelte, ts, js, html, css, json, shell, diff],
	fallbackLanguage: 'plaintext'
});

export function highlightToHtml(code: string, lang?: string): string {
	return highlighter.highlightToHtml(code, { lang });
}
