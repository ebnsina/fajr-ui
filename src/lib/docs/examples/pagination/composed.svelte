<script lang="ts">
	import {
		PaginationEllipsis,
		PaginationItem,
		PaginationLink,
		PaginationList,
		PaginationNext,
		PaginationPrevious,
		PaginationRoot,
		usePagination
	} from '$lib/components/ui';

	let page = $state(4);
</script>

<PaginationRoot bind:page count={20} label="Search results">
	{@render body()}
</PaginationRoot>

{#snippet body()}
	{@const pagination = usePagination()}
	<PaginationList>
		<PaginationItem><PaginationPrevious>Back</PaginationPrevious></PaginationItem>

		<!-- The window comes from the state, so laying it out yourself does not
		     mean rewriting the ellipsis logic. -->
		{#each pagination.slots as slot, index (typeof slot === 'number' ? slot : `gap-${index}`)}
			<PaginationItem>
				{#if slot === 'gap'}
					<PaginationEllipsis />
				{:else}
					<PaginationLink page={slot} />
				{/if}
			</PaginationItem>
		{/each}

		<PaginationItem><PaginationNext>Forward</PaginationNext></PaginationItem>
	</PaginationList>
{/snippet}
