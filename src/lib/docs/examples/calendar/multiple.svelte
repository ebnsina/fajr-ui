<script lang="ts">
	import { Calendar } from '$lib/components/ui';

	// Days the observatory is open to visitors — an arbitrary set rather than a
	// span, so clicking a chosen day removes it again.
	let openDays = $state<string[]>(['2026-08-05', '2026-08-12', '2026-08-19', '2026-08-26']);

	const format = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' });
</script>

<div class="flex flex-col items-center gap-3">
	<Calendar mode="multiple" bind:value={openDays} label="Observatory open days" />
	<p class="text-sm text-muted-foreground">
		{#if openDays.length === 0}
			No days chosen
		{:else}
			{openDays.length}
			{openDays.length === 1 ? 'day' : 'days'}: {openDays
				.map((day) => format.format(new Date(`${day}T00:00`)))
				.join(', ')}
		{/if}
	</p>
</div>
