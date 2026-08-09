<script lang="ts">
	import { page } from '$app/state';
	import { SITE } from '$lib/llms/rules';

	/*
	 * The head of every page, in one place.
	 *
	 * `DocsPage` renders this for the whole of the documentation, so a component
	 * page gets its title, its description, its canonical URL and its link
	 * preview from the same two strings that head the page — which is the only
	 * arrangement where the three cannot disagree.
	 */
	let {
		title,
		description
	}: {
		title: string;
		description?: string;
	} = $props();

	const full = $derived(`${title} — Fajr UI`);

	// `pathname` is absolute and already carries the base path, so resolving it
	// against SITE keeps only SITE's origin — which is exactly what is wanted,
	// and why this does not double the base path onto the end.
	const canonical = $derived(new URL(page.url.pathname, SITE).href);
</script>

<svelte:head>
	<title>{full}</title>
	<link rel="canonical" href={canonical} />
	{#if description}<meta name="description" content={description} />{/if}

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Fajr UI" />
	<meta property="og:title" content={full} />
	<meta property="og:url" content={canonical} />
	{#if description}<meta property="og:description" content={description} />{/if}

	<!--
		`summary` rather than `summary_large_image`: there is no preview image yet,
		and the large card renders as a blank slab without one.
	-->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={full} />
	{#if description}<meta name="twitter:description" content={description} />{/if}
</svelte:head>
