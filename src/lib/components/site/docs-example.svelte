<script module lang="ts">
	export type DocsExampleProps = {
		slug: string;
		id?: string;
	};
</script>

<script lang="ts">
	import { exampleComponent } from '$lib/docs/examples';

	let { slug, id = 'default' }: DocsExampleProps = $props();

	const Example = $derived(exampleComponent(slug, id));
</script>

<!--
	Every example is its own file under `$lib/docs/examples`. The same file is
	rendered here and shown in the Code tab, so the two cannot disagree.
-->
{#if Example}
	<Example />
{:else}
	<p class="text-sm text-muted-foreground">No preview for this example.</p>
{/if}
