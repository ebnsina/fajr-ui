<script lang="ts">
	import PageMeta from '$lib/components/site/page-meta.svelte';
	import { base } from '$app/paths';
	import { Badge, Button } from '$lib/components/ui';
	import ComponentGlyph from '$lib/components/site/component-glyph.svelte';
	import ShaderGradient from '$lib/components/site/shader-gradient.svelte';
	import { hero } from '$lib/components/site/hero.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';
	import { builtComponents, shelves } from '$lib/data/components';

	const description =
		'Accessible components you copy into your project and own outright — no runtime, no lock-in.';

	let heroEl = $state<HTMLElement | null>(null);

	/*
	 * Publishes how far the hero has been scrolled past. The header owns the
	 * other half of the question — whether a hero exists at all — because that
	 * one has to be right before hydration. See `hero.svelte.ts`.
	 *
	 * Measured against the hero's own height rather than a fixed scroll offset,
	 * because the hero's height is type-dependent — the headline wraps to three
	 * lines on a narrow window and two on a wide one, and a hardcoded threshold
	 * would hand back an unreadable header at one of those widths.
	 */
	function sync() {
		if (!heroEl) return;
		hero.scrolledPast = window.scrollY >= heroEl.offsetHeight - 64;
	}

	$effect(() => {
		sync();
		// Cleared on unmount: this state outlives the page, and a stale `true`
		// would leave every other route with an invisible header.
		return () => (hero.scrolledPast = false);
	});
</script>

<PageMeta title="A modern Svelte UI component library" {description} />

<svelte:window onscroll={sync} onresize={sync} />

<main id="main-content" tabindex="-1" class="outline-none">
	<!--
		The hero follows the theme rather than pinning itself to near-black. The
		shader reads its ramp off `--color-background` and `--color-foreground`,
		so the same surface is light-on-dark in one theme and ink-on-paper in the
		other, and the controls on top can be the library's own rather than a set
		of white overrides that only work against one ground.

		It runs up under the header, which drops its own ground while this is
		behind it — see `hero.svelte.ts` for why that is published state rather
		than the header checking the route.
	-->
	<section
		bind:this={heroEl}
		class="relative isolate -mt-(--header-height) overflow-clip bg-background pt-(--header-height)"
	>
		<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
			<ShaderGradient class="size-full" seed={1.7} speed={0.85} intensity={0.95} />
			<div
				class="absolute inset-0"
				style="background: linear-gradient(to bottom, color-mix(in srgb, var(--color-background) 30%, transparent) 0%, color-mix(in srgb, var(--color-background) 58%, transparent) 45%, color-mix(in srgb, var(--color-background) 94%, transparent) 82%, var(--color-background) 100%);"
			></div>
		</div>

		<div class="container flex w-full flex-col items-center text-center">
			<div class="max-w-3xl px-2 pt-20 pb-24">
				<p
					class="inline-flex items-center gap-2 rounded-full border border-border bg-background/48 px-3.5 py-1.5 text-xs font-semibold tracking-[0.1em] text-foreground uppercase backdrop-blur-sm"
				>
					<span aria-hidden="true" class="size-1.5 rounded-full bg-foreground"></span>
					{builtComponents.length} components, zero runtime
				</p>

				<h1
					class="mt-7 font-heading text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.03em]"
				>
					Components for Svelte that feel finished.
				</h1>

				<p class="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
					{description}
				</p>

				<div class="mt-9 flex flex-wrap justify-center gap-3">
					<Button href="{base}/docs" size="lg">Get started</Button>
					<Button href="{base}/examples" size="lg" variant="outline">View examples</Button>
				</div>
			</div>
		</div>
	</section>

	<!--
		The catalogue, shelved rather than alphabetised.

		The roster itself is alphabetical, which is the right order to look a name
		up in and the wrong one to browse: it puts Table beside Tabs and tells you
		nothing about what either is for. These groups are the browsing order.

		Each card carries a wireframe, not a working component. Mounting 58 live
		instances on the first screen of the site meant several calendars and a
		chart booting before anything was scrolled, each of them cropped or scaled
		to a size it was never designed for. At this size the useful thing is the
		*shape* — a field is a bar over a box — and a drawing says that faster
		than a shrunken copy does. See `$lib/data/glyphs.ts`.
	-->
	<div class="container w-full pt-16 pb-8">
		{#each shelves as shelf (shelf.name)}
			<section class="pt-12 first:pt-0">
				<div class="flex items-baseline justify-between gap-4 border-b pb-3">
					<h2 class="font-heading text-lg font-semibold tracking-tight">{shelf.name}</h2>
					<p class="hidden text-sm text-muted-foreground sm:block">{shelf.blurb}</p>
				</div>

				<ul class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each shelf.components as component (component.slug)}
						<li>
							<a
								href="{base}/docs/components/{component.slug}"
								class="group relative block overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
							>
								<!--
									One surface, fixed height. The tile carried a lit gradient with the
									wireframe floating on a panel above it, and two layers of decoration
									under a drawing that is itself an abstraction was one too many — the
									light was the loudest thing in a grid whose subject is the component.

									The height is fixed rather than derived so every tile in a row lines
									up regardless of how tall its wireframe happens to be, and the
									centring keeps a short one — Badge is a single pill — off the top
									edge of a tall box.
								-->
								<span
									class="flex h-52 items-center justify-center bg-muted px-10 transition-colors duration-200 group-hover:bg-accent"
								>
									<ComponentGlyph slug={component.slug} />
								</span>

								<!--
									The name arrives on hover, over the tile rather than beside it.

									It fades rather than mounts, and it is `opacity-0` rather than
									`hidden`: this is the link's entire accessible name, so it has to
									stay in the accessibility tree whether or not a pointer is over the
									card. A `display: none` here would leave 58 links announced as their
									href.
								-->
								<span
									class="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-background via-background/80 to-transparent px-4 pt-10 pb-3 text-sm font-medium text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
								>
									<span class="truncate">{component.name}</span>
									{#if component.isNew}
										<Badge variant="info" size="sm">New</Badge>
									{:else if !component.built}
										<Badge variant="secondary" size="sm">Planned</Badge>
									{/if}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</main>

<SiteFooter />
