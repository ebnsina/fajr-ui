<script lang="ts">
	import { glyphFor } from '$lib/data/glyphs';

	let { slug }: { slug: string } = $props();

	const shapes = $derived(glyphFor(slug));
</script>

<!--
	Decorative, and hidden from assistive technology.

	The drawing is an impression of the component, not a description of it — a
	screen reader announcing "rectangle, rectangle, rectangle" would be worse than
	silence. The card's own link carries the name.

	`preserveAspectRatio` is left at its default so the drawing scales as a whole:
	stretching a wireframe to fill a card would put a different corner radius on
	every tile, which is the one thing this grid cannot have.
-->
<svg
	aria-hidden="true"
	focusable="false"
	viewBox="0 0 120 64"
	class="h-auto w-full max-w-[13.5rem] text-foreground"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	{#each shapes as shape, index (index)}
		{#if Array.isArray(shape)}
			{@const [x, y, width, height, radius, tone] = shape}
			<rect
				{x}
				{y}
				{width}
				{height}
				rx={radius}
				class={tone === 2
					? 'fill-none stroke-current opacity-24'
					: tone === 1
						? 'fill-current opacity-24'
						: 'fill-current opacity-11'}
				stroke-width={tone === 2 ? 1.25 : 0}
			/>
		{:else}
			<!--
				Strokes, for the parts of a control that are a mark rather than a
				surface. A tick drawn as a rectangle is a dash, a chevron is a blob,
				and a magnifier cannot be drawn at all — those three are most of what
				separates a wireframe from a loading placeholder.
			-->
			<path
				d={shape.d}
				fill="none"
				class="stroke-current {shape.tone === 1 ? 'opacity-42' : 'opacity-26'}"
				stroke-width="1.6"
			/>
		{/if}
	{/each}
</svg>
