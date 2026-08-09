<script lang="ts">
	import { Badge, Button } from '$lib/components/ui';
	import { cn } from '$lib/utils';
	import ComponentThumbnail from '$lib/components/site/component-thumbnail.svelte';
	import PageHeader from '$lib/components/site/page-header.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';
	import { builtComponents, components } from '$lib/data/components';

	const description =
		'Accessible components you copy into your project and own outright — no runtime, no lock-in.';

	/**
	 * The handful of examples that genuinely need more than one column's width.
	 * Measured rather than guessed: everything else renders under 330px, so a
	 * wider tile would only add empty space around it.
	 */
	const WIDE = new Set([
		'table',
		'data-table',
		'calendar',
		'command',
		'pagination',
		'sidebar',
		'toolbar',
		'otp-field'
	]);
</script>

<svelte:head>
	<title>A modern Svelte UI component library — Fajr UI</title>
	<meta name="description" content={description} />
</svelte:head>

<main id="main-content" tabindex="-1" class="outline-none">
	<div class="container w-full">
		<PageHeader class="max-w-2xl *:items-start *:text-left">
			<h1 class="font-heading text-4xl font-bold lg:text-5xl">
				Components for <span class="text-primary">Svelte</span> that feel finished.
			</h1>
			<p class="text-muted-foreground lg:text-lg">{description}</p>
			<div class="mt-2 flex gap-2">
				<Button href="/docs" size="lg">Get started</Button>
				<Button href="/examples" size="lg" variant="outline">View Examples</Button>
			</div>
		</PageHeader>
	</div>

	<div
		class="relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border/64"
	>
		<div class="container w-full">
			<p class="pt-8 text-sm text-muted-foreground">
				{#if builtComponents.length === components.length}
					{components.length} components, with more coming.
				{:else}
					{builtComponents.length} of {components.length} components built.
				{/if}
			</p>
			<!--
			A specimen-first grid. Measured across every example, only two want more
			than 330px — so the previous half-card-wide preview panel was mostly empty,
			and the 200px column of prose beside it was answering a question nobody
			asks while scanning a catalogue. The example is the content; the name is
			its caption.

			Those exceptions span a second column rather than being cropped, so the
			layout follows the content instead of forcing one shape onto all of it.
			`grid-flow-dense` lets a single-width tile backfill the gap a wide one
			leaves when it cannot fit in the columns remaining.
		-->
			<div
				class="grid grid-flow-dense grid-cols-1 gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 2xl:grid-cols-4"
			>
				{#each components as component (component.slug)}
					<article
						class={cn(
							'group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs/5 transition-[box-shadow,transform] duration-(--duration-press) ease-out not-dark:bg-clip-padding focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background hover:-translate-y-0.5 hover:shadow-md/5 motion-reduce:hover:translate-y-0',
							WIDE.has(component.slug) && 'sm:col-span-2 lg:col-span-2'
						)}
					>
						<div
							class="pointer-events-none relative flex h-40 items-center justify-center overflow-hidden bg-[color-mix(in_srgb,var(--color-card),var(--color-sidebar))] px-5 dark:bg-background"
						>
							{#if component.isNew}
								<Badge class="absolute end-2.5 top-2.5 z-10" variant="info">New</Badge>
							{:else if !component.built}
								<Badge class="absolute end-2.5 top-2.5 z-10" variant="secondary">Planned</Badge>
							{/if}
							<!--
							The specimen is scenery. It is already `pointer-events-none`, so
							it could not be clicked — but it was still tabbable, and between
							them the previews held 136 of this page's 206 tab stops. Reaching
							the second card meant tabbing through an accordion, a slider and
							a menu that do nothing. `inert` takes the whole subtree out of
							the tab order and the accessibility tree, which also settles the
							outline: the demos brought their own `h3`s, so the first heading
							on the page after the `h1` was a level three.
						-->
							<div class="contents" inert>
								<ComponentThumbnail slug={component.slug} />
							</div>
						</div>

						<!-- The caption reads as a label for the specimen above it, not a heading. -->
						<div class="flex flex-col gap-0.5 border-t px-4 py-3">
							<h2 class="text-sm font-medium">
								<a
									class="outline-none before:absolute before:inset-0 before:rounded-xl"
									href="/docs/components/{component.slug}"
								>
									{component.name}
								</a>
							</h2>
							<p class="truncate text-xs text-muted-foreground">{component.description}</p>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</div>
</main>

<SiteFooter />
