<script lang="ts">
	import { ScrollArea } from '$lib/components/ui';

	const folios = Array.from({ length: 20 }, (_, index) => ({
		shelfmark: `MS ${String(index + 801).padStart(5, '0')}`,
		title: ['The Compendious Book', 'The Book of Roger', 'Kitab al-Manazir', 'Al-Tasrif'][index % 4]
	}));
</script>

<ScrollArea class="h-48 w-full max-w-sm rounded-xl border" scrollFade>
	<div class="flex flex-col gap-2 p-4 text-sm">
		{#each folios as folio (folio.shelfmark)}
			<p>
				<span class="font-mono text-xs text-muted-foreground">{folio.shelfmark}</span>
				{folio.title}
			</p>
		{/each}
	</div>
</ScrollArea>
