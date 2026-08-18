<script lang="ts">
	import { ScrollArea } from '$lib/components/ui';

	const folios = Array.from({ length: 20 }, (_, index) => ({
		shelfmark: `MS ${String(index + 401).padStart(5, '0')}`,
		title: ['The Canon of Medicine', 'The Book of Optics', 'Zij-i Ilkhani', 'Kitab al-Hawi'][
			index % 4
		]
	}));
</script>

<ScrollArea class="h-48 w-full max-w-sm rounded-xl border">
	<div class="flex flex-col gap-2 p-4 text-sm">
		{#each folios as folio (folio.shelfmark)}
			<p>
				<span class="font-mono text-xs text-muted-foreground">{folio.shelfmark}</span>
				{folio.title}
			</p>
		{/each}
	</div>
</ScrollArea>
