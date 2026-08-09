<script lang="ts">
	import SiteHeader from '$lib/components/site/site-header.svelte';

	let { children } = $props();
</script>

<div
	class="relative isolate flex min-h-svh flex-col overflow-clip bg-sidebar [--header-height:4rem]"
>
	<!-- Visible only once focused; skips the header and the long component nav. -->
	<a
		href="#main-content"
		class="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:start-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:border focus-visible:bg-popover focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:shadow-lg/5"
	>
		Skip to content
	</a>
	<SiteHeader />
	<!--
		No wrapper here: `#main-content` is the `<main>` each page renders, so the
		skip link lands on a real focusable element. It used to point at a
		`display: contents` div, which generates no box and cannot take focus — the
		link moved the hash and scrolled, but focus stayed on `<body>`, so the very
		next Tab restarted from the top of the document and the link did nothing.
	-->
	{@render children()}
</div>
