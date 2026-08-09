<script lang="ts">
	import DocsExample from './docs-example.svelte';
	import { getDoc } from '$lib/docs/registry';

	let { slug }: { slug: string } = $props();

	const doc = $derived(getDoc(slug));

	let box = $state<HTMLElement | null>(null);
	let overflowX = $state(false);
	let overflowY = $state(false);

	/*
	 * The edge fade is applied only on the axis that actually overflows.
	 * Applying it unconditionally softened the edges of examples that fit
	 * perfectly well, which read as a rendering fault rather than a crop.
	 */
	$effect(() => {
		if (!box) return;
		const measure = () => {
			overflowX = box!.scrollWidth > box!.clientWidth + 1;
			overflowY = box!.scrollHeight > box!.clientHeight + 1;
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(box);
		for (const child of box.children) observer.observe(child);
		return () => observer.disconnect();
	});

	const mask = $derived(
		[
			overflowX &&
				'[mask-image:linear-gradient(to_right,transparent,#000_1.5rem,#000_calc(100%-1.5rem),transparent)]',
			overflowY &&
				'[mask-image:linear-gradient(to_bottom,transparent,#000_1.5rem,#000_calc(100%-1.5rem),transparent)]'
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<!--
	The card shows the component's own hero example rather than a hand-drawn
	stand-in, so a thumbnail can never fall out of step with what the component
	actually looks like. The card wrapper is already `pointer-events-none`, so
	these are display-only.
-->
{#if doc?.hero}
	<div
		bind:this={box}
		data-overflow={overflowX || overflowY ? '' : undefined}
		class="flex size-full items-center justify-center overflow-hidden {mask}"
	>
		<DocsExample {slug} id={doc.hero.id} />
	</div>
{:else}
	<p class="text-xs text-muted-foreground/50">No preview</p>
{/if}
