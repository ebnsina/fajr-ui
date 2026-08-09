<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type TocEntry = { title: string; id: string };

	export type DocsPageProps = {
		title: string;
		description?: string;
		toc?: TocEntry[];
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { cn } from '$lib/utils';

	let { title, description, toc = [], children }: DocsPageProps = $props();

	// Seeded so the rail is never blank on first paint.
	let activeId = $state<string | null>(untrack(() => toc[0]?.id ?? null));
	let content = $state<HTMLElement | null>(null);

	// Scroll spy. The bottom margin pulls the observation band up near the top of
	// the viewport, so a heading counts as current once it reaches reading
	// position rather than when it first peeks in from the bottom.
	$effect(() => {
		if (toc.length === 0) return;

		const headings = toc
			.map((entry) => document.getElementById(entry.id))
			.filter((element): element is HTMLElement => element !== null);
		if (headings.length === 0) return;

		function update(entries: IntersectionObserverEntry[]) {
			// At the very bottom the final heading can never reach the band, so it
			// would otherwise be impossible to mark the last section as current.
			const atBottom =
				window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
			if (atBottom) {
				activeId = headings[headings.length - 1].id;
				return;
			}

			const visible = entries
				.filter((entry) => entry.isIntersecting)
				.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

			if (visible.length > 0) {
				activeId = visible[0].target.id;
				return;
			}

			// Nothing in the band — mark the last heading scrolled past, so the
			// rail never blanks out mid-section. Above the first heading, the
			// first entry stays marked rather than showing nothing at all.
			const above = headings.filter((heading) => heading.getBoundingClientRect().top < 120);
			activeId = above.length > 0 ? above[above.length - 1].id : headings[0].id;
		}

		const observer = new IntersectionObserver(update, {
			rootMargin: '-80px 0px -70% 0px',
			threshold: 0
		});
		for (const heading of headings) observer.observe(heading);

		// The observer alone never fires once scrolling stops at the page end, so
		// this listener exists purely for that case — it must not otherwise
		// override what the observer just decided.
		const onscroll = () => {
			const atBottom =
				window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
			if (atBottom) update([]);
		};
		window.addEventListener('scroll', onscroll, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', onscroll);
		};
	});

	// Give every section heading a copyable anchor, so a specific example can be
	// linked to directly.
	$effect(() => {
		if (!content) return;
		const headings = content.querySelectorAll<HTMLElement>('h2[id]');
		for (const heading of headings) {
			if (heading.querySelector('[data-slot="heading-anchor"]')) continue;
			const anchor = document.createElement('a');
			anchor.href = `#${heading.id}`;
			anchor.dataset.slot = 'heading-anchor';
			anchor.setAttribute('aria-label', `Link to ${heading.textContent?.trim() ?? 'section'}`);
			anchor.className =
				'ms-2 align-middle text-muted-foreground no-underline opacity-0 transition-opacity focus-visible:opacity-100 group-hover/heading:opacity-100';
			anchor.textContent = '#';
			heading.classList.add('group/heading');
			heading.append(anchor);
		}
	});
</script>

<svelte:head>
	<title>{title} — Fajr UI</title>
	{#if description}<meta name="description" content={description} />{/if}
</svelte:head>

<div class="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
	<!--
		The reading column is the inset card. It scrolls with the page; the rails
		either side stay put.
	-->
	<div
		class="flex min-w-0 flex-1 flex-col rounded-2xl border bg-background px-4 pt-4 shadow-xs/5 not-dark:bg-clip-padding lg:my-4 lg:px-6 lg:pt-8"
	>
		<div class="flex flex-1 flex-col gap-6">
			<header class="flex flex-col gap-2">
				<h1 class="scroll-m-20 font-heading text-3xl font-bold tracking-tight">{title}</h1>
				{#if description}
					<p class="text-lg text-balance text-muted-foreground">{description}</p>
				{/if}
			</header>

			<!--
				The typography plugin wraps inline code in backticks; we don't want them.

				`not-prose` also strips the margins the plugin would have applied, so two
				of those blocks in a row butt together with no gap at all. The last rule
				puts the spacing back between them.
			-->
			<div
				bind:this={content}
				class="prose max-w-none prose-neutral dark:prose-invert prose-code:before:content-none prose-code:after:content-none [&_.not-prose+.not-prose]:mt-6"
			>
				{@render children?.()}
			</div>
		</div>
	</div>

	{#if toc.length > 0}
		<!--
			A second rail on the sidebar ground, mirroring the nav on the left: pinned
			under the header, with its own scroll so a long contents list never pushes
			the page taller. `overscroll-contain` stops a flick inside it from
			carrying on into the page.
		-->
		<div
			class="sticky top-(--header-height) z-30 ms-4 hidden h-[calc(100svh-var(--header-height))] w-64 shrink-0 flex-col xl:flex"
		>
			<div class="h-(--top-spacing) shrink-0"></div>
			<nav
				aria-label="On this page"
				class="flex flex-col gap-2 overflow-y-auto overscroll-contain py-4 ps-1 pe-2 pt-8 text-sm"
			>
				<p class="text-xs font-medium text-muted-foreground">On This Page</p>
				<ul class="flex flex-col">
					{#each toc as entry (entry.id)}
						{@const active = activeId === entry.id}
						<li>
							<a
								href="#{entry.id}"
								aria-current={active ? 'location' : undefined}
								class={cn(
									'-ms-px block border-s py-1 ps-3 transition-colors duration-150 ease-out hover:text-foreground',
									active
										? 'border-foreground font-medium text-foreground'
										: 'border-border text-muted-foreground'
								)}
							>
								{entry.title}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	{/if}
</div>
