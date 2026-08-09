<script lang="ts">
	import { ScrollArea } from '$lib/components/ui';
</script>

<ScrollArea class="h-48 w-full max-w-sm rounded-xl border" scrollFade>
	<div class="flex flex-col gap-2 p-4 text-sm">
		{#each Array.from({ length: 20 }, (_, index) => index + 1) as row (row)}
			<p>Folio {row}</p>
		{/each}
	</div>
</ScrollArea>
