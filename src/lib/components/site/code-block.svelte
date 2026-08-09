<script module lang="ts">
	export type CodeBlockProps = {
		code: string;
		language?: string;
		/** Shown in the header strip, e.g. a filename or a package manager. */
		title?: string;
		class?: string;
		style?: string;
	};
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { cn } from '$lib/utils';
	import { highlightToHtml } from '$lib/internal/highlight';

	let { code, language = 'svelte', title, class: className, style }: CodeBlockProps = $props();

	/*
	 * Highlighting is synchronous, so this runs during SSR and the markup arrives
	 * already coloured — no flash of plain source, and nothing to do on the
	 * client. The tokenizer escapes its own output.
	 */
	const html = $derived(highlightToHtml(code, language));

	let copied = $state(false);
	let resetTimer: ReturnType<typeof setTimeout>;

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			clearTimeout(resetTimer);
			// Long enough to read, short enough that the button is ready again soon.
			resetTimer = setTimeout(() => (copied = false), 1600);
		} catch {
			// Clipboard can be blocked by permissions; leaving the label alone is
			// a truer signal than claiming success.
		}
	}
</script>

<figure
	class={cn(
		'not-prose relative overflow-hidden rounded-xl border bg-code text-code-foreground',
		className
	)}
	{style}
	data-slot="code-block"
>
	{#if title}
		<figcaption
			class="flex min-h-11 items-center border-b border-border/64 px-4 py-2.5 font-mono text-xs text-muted-foreground"
		>
			{title}
		</figcaption>
	{/if}

	<Button
		size="icon-xs"
		variant="ghost"
		class="absolute end-2 top-2 z-10 text-muted-foreground"
		aria-label={copied ? 'Copied' : 'Copy code'}
		onclick={copy}
	>
		{#if copied}
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M20 6 9 17l-5-5" />
			</svg>
		{:else}
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="9" y="9" width="12" height="12" rx="2" />
				<path d="M5 15V5a2 2 0 0 1 2-2h10" />
			</svg>
		{/if}
	</Button>

	<!--
		Wide lines scroll inside the block rather than stretching the page. The
		markup comes from the tokenizer, which escapes the source it is given.
	-->
	<!--
		A long command scrolls sideways, and without a tab stop the hidden end of
		it could only be reached with a pointer (WCAG 2.1.1).
	-->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		role="region"
		tabindex="0"
		aria-label={title ? `${title} code` : 'Code'}
		class="code-block-body overflow-x-auto p-4 pe-12 font-mono text-[0.8125rem] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
	>
		<!--
			The markup comes from the tokenizer, which escapes the source it is given
			before adding its own spans. Nothing user-supplied reaches this unescaped.
		-->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html html}
	</div>

	<!-- Announced out of band so the change is heard without moving focus. -->
	<span aria-live="polite" class="sr-only">{copied ? 'Copied to clipboard' : ''}</span>
</figure>

<style>
	/*
	 * The tokenizer emits stable class names; the colours come from this
	 * library's own tokens rather than a bundled theme, so code matches the rest
	 * of the page in light and dark instead of importing someone else's palette.
	 */
	.code-block-body :global(pre) {
		margin: 0;
		background: none;
		padding: 0;
		font: inherit;
	}

	.code-block-body :global(.th-comment) {
		color: --alpha(var(--color-code-foreground) / 52%);
		font-style: italic;
	}

	.code-block-body :global(.th-keyword),
	.code-block-body :global(.th-command) {
		color: var(--color-code-keyword);
	}

	.code-block-body :global(.th-string),
	.code-block-body :global(.th-literal) {
		color: var(--color-code-string);
	}

	.code-block-body :global(.th-number) {
		color: var(--color-code-number);
	}

	.code-block-body :global(.th-function),
	.code-block-body :global(.th-selector) {
		color: var(--color-code-function);
	}

	.code-block-body :global(.th-tag),
	.code-block-body :global(.th-type) {
		color: var(--color-code-tag);
	}

	.code-block-body :global(.th-attr),
	.code-block-body :global(.th-property),
	.code-block-body :global(.th-variable) {
		color: var(--color-code-attr);
	}

	.code-block-body :global(.th-operator),
	.code-block-body :global(.th-meta) {
		color: --alpha(var(--color-code-foreground) / 72%);
	}

	.code-block-body :global(.th-inserted) {
		color: var(--color-success-foreground);
	}

	.code-block-body :global(.th-deleted) {
		color: var(--color-destructive-foreground);
	}
</style>
