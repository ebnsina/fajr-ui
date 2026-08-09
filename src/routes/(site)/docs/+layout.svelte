<script lang="ts">
	import DocsSidebar from '$lib/components/site/docs-sidebar.svelte';
	import { SidebarProvider } from '$lib/components/ui';

	let { children } = $props();
</script>

<div class="flex flex-1 flex-col">
	<SidebarProvider
		class="container min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]"
	>
		<DocsSidebar />
		<!--
			The card is drawn by DocsPage around the reading column alone, so the table
			of contents can sit outside it on the sidebar ground and read as a second
			rail rather than as part of the page content.
		-->
		<!--
			`main` starts after the sidebar, not around it. With the nav inside main,
			skipping "to content" still dropped the user in front of seventy links —
			the exact thing the skip link exists to avoid. `tabindex="-1"` makes it a
			focus target without adding a tab stop.
		-->
		<main id="main-content" tabindex="-1" class="h-full w-full min-w-0 outline-none lg:pe-4">
			{@render children()}
		</main>
	</SidebarProvider>
</div>
