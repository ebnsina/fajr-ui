<script lang="ts">
	import PageMeta from '$lib/components/site/page-meta.svelte';
	import { base } from '$app/paths';
	import { Badge, buttonVariants } from '$lib/components/ui';
	import { ArrowRightIcon, Icon } from '$lib/icons';
	import PageHeader from '$lib/components/site/page-header.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';
	import { examples } from '$lib/data/examples';

	const description = 'Complete screens built from the library, not one component at a time.';
</script>

<PageMeta title="Examples" {description} />

<main id="main-content" tabindex="-1" class="outline-none">
	<div class="container w-full">
		<PageHeader class="max-w-2xl *:items-start *:text-left">
			<h1 class="font-heading text-4xl font-bold lg:text-5xl">Examples</h1>
			<p class="text-muted-foreground lg:text-lg">{description}</p>
		</PageHeader>
	</div>

	<div
		class="relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border/64"
	>
		<div class="container w-full">
			<div class="grid gap-4 py-8 lg:grid-cols-2 lg:gap-6">
				{#each examples as example (example.slug)}
					<article
						class="group relative flex flex-col gap-4 rounded-2xl border bg-card p-6 text-card-foreground shadow-xs/5 transition-shadow not-dark:bg-clip-padding focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background hover:shadow-md/5"
					>
						<div class="flex flex-col gap-1">
							<h2 class="font-heading text-lg font-bold">
								<a
									class="outline-none before:absolute before:inset-0 before:rounded-2xl"
									href={example.href}
								>
									{example.name}
								</a>
							</h2>
							<p class="text-sm text-muted-foreground">{example.description}</p>
						</div>

						<div class="flex flex-wrap gap-1.5">
							{#each example.uses as component (component)}
								<Badge variant="outline">{component}</Badge>
							{/each}
						</div>

						<!--
						Decoration, not a control. The heading already carries an overlay
						link across the whole card, so this was a second tab stop to the
						same page — one a mouse user never sees, because it is
						`pointer-events-none` — announcing "Open example" three times with
						nothing to tell them apart.
					-->
						<div aria-hidden="true" class="mt-auto pt-2">
							<span
								class={buttonVariants({ variant: 'outline', size: 'sm' }) + ' pointer-events-none'}
							>
								Open example<Icon icon={ArrowRightIcon} />
							</span>
						</div>
					</article>
				{/each}
			</div>

			<p class="pb-8 text-sm text-muted-foreground">
				More screens are on the way — see the <a
					class="text-foreground underline underline-offset-4"
					href="{base}/docs/roadmap">roadmap</a
				>.
			</p>
		</div>
	</div>
</main>

<SiteFooter />
