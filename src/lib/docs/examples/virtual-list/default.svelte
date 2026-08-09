<script lang="ts">
	import { Badge, VirtualList } from '$lib/components/ui';

	// Fifty thousand rows. Only the ~30 on screen are ever in the DOM.
	const folios = Array.from({ length: 50_000 }, (_, index) => ({
		id: index + 1,
		shelfmark: `MS ${String(index + 1).padStart(5, '0')}`,
		title: ['Book of Optics', 'The Canon of Medicine', 'Zij-i Ilkhani', 'Kitab al-Hawi'][index % 4],
		status: index % 7 === 0 ? 'In review' : 'Catalogued'
	}));
</script>

<div class="w-full max-w-lg">
	<VirtualList items={folios} itemHeight={48} height={320} label="Folio catalogue">
		{#snippet children(folio)}
			<div class="flex w-full items-center gap-3 border-b px-4 text-sm">
				<span class="font-mono text-xs text-muted-foreground tabular-nums">{folio.shelfmark}</span>
				<span class="min-w-0 flex-1 truncate">{folio.title}</span>
				<Badge variant={folio.status === 'Catalogued' ? 'success' : 'warning'}>
					{folio.status}
				</Badge>
			</div>
		{/snippet}
	</VirtualList>
	<p class="pt-2 text-sm text-muted-foreground tabular-nums">
		{folios.length.toLocaleString()} rows.
	</p>
</div>
