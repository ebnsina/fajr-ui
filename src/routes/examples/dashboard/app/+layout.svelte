<script lang="ts">
	import { untrack } from 'svelte';
	import { page } from '$app/state';
	import { Icon, SearchIcon } from '$lib/icons';
	import ModeSwitcher from '$lib/components/site/mode-switcher.svelte';
	import AppSidebar from '$lib/components/app/app-sidebar.svelte';
	import LayoutSwitcher from '$lib/components/app/layout-switcher.svelte';
	import { navMain, navSecondary } from '$lib/components/app/nav-data';
	import { browser } from '$app/environment';
	import { DEFAULT_DASHBOARD_LAYOUT, parseDashboardLayout } from '$lib/data/dashboard-layout';
	import {
		Input,
		Separator,
		SidebarInset,
		SidebarProvider,
		SidebarTrigger
	} from '$lib/components/ui';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	/*
	 * `?layout=` pins a variant, which is what makes each one directly linkable.
	 * After that the switcher owns it, hence the deliberate one-time read.
	 *
	 * The read is guarded because this page is prerendered, and a prerendered
	 * page has no query string to speak of — reading one is an error rather than
	 * an empty result, precisely so that a build cannot bake in an answer that
	 * only held for whichever URL happened to be rendered.
	 */
	let layout = $state(
		untrack(() =>
			browser ? parseDashboardLayout(page.url.searchParams.get('layout')) : DEFAULT_DASHBOARD_LAYOUT
		)
	);

	// Derive the page title from the nav data so the header stays in step with routing.
	const title = $derived(
		[...navMain, ...navSecondary]
			.flatMap((item) => [item, ...(item.items ?? [])])
			.findLast((item) => page.url.pathname.startsWith(item.href))?.title ?? 'Dashboard'
	);
</script>

<SidebarProvider>
	<AppSidebar variant={layout} />
	<SidebarInset class={layout === 'inset' ? 'overflow-hidden' : undefined}>
		<header
			class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm"
		>
			<SidebarTrigger class="-ms-1" />
			<Separator orientation="vertical" class="me-1 h-4" decorative />
			<h1 class="font-heading text-sm font-semibold">{title}</h1>

			<div class="ms-auto flex items-center gap-2">
				<div class="relative hidden w-56 sm:block">
					<Icon
						icon={SearchIcon}
						class="pointer-events-none absolute start-2.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
						aria-hidden="true"
					/>
					<Input
						type="search"
						placeholder="Search the collection…"
						inputClass="ps-8"
						aria-label="Search"
					/>
				</div>
				<LayoutSwitcher bind:layout />
				<ModeSwitcher />
			</div>
		</header>

		<div class="flex-1 p-4 md:p-6">
			{@render children()}
		</div>
	</SidebarInset>
</SidebarProvider>
