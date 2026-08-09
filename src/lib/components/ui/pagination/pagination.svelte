<script module lang="ts">
	import type { PaginationRootProps } from './pagination-root.svelte';

	export type PaginationProps = Omit<PaginationRootProps, 'children'>;
</script>

<script lang="ts">
	import PaginationRoot from './pagination-root.svelte';
	import PaginationList from './pagination-list.svelte';
	import PaginationItem from './pagination-item.svelte';
	import PaginationLink from './pagination-link.svelte';
	import PaginationPrevious from './pagination-previous.svelte';
	import PaginationNext from './pagination-next.svelte';
	import PaginationEllipsis from './pagination-ellipsis.svelte';
	import { usePagination } from './context.svelte';

	let { page = $bindable(1), ...rest }: PaginationProps = $props();
</script>

<!--
	The whole control in one tag, assembled from the same parts you would use to
	lay it out yourself. There is no second implementation here: change a part and
	both forms change with it.
-->
<PaginationRoot bind:page {...rest}>
	{@render body()}
</PaginationRoot>

{#snippet body()}
	{@const pagination = usePagination()}
	<PaginationList>
		<PaginationItem><PaginationPrevious /></PaginationItem>

		{#each pagination.slots as slot, index (typeof slot === 'number' ? slot : `gap-${index}`)}
			<PaginationItem>
				{#if slot === 'gap'}
					<PaginationEllipsis />
				{:else}
					<PaginationLink page={slot} />
				{/if}
			</PaginationItem>
		{/each}

		<PaginationItem><PaginationNext /></PaginationItem>
	</PaginationList>
{/snippet}
