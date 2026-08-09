<script lang="ts">
	import { Calendar } from '$lib/components/ui';
	import type { DateRange } from '$lib/components/ui';

	// A stay at the caravanserai: the first click sets the arrival, the second
	// the departure. Clicking before the arrival flips the two rather than
	// refusing, so a range can be drawn in either direction.
	let stay = $state<DateRange | undefined>({ start: '2026-08-11', end: '2026-08-18' });

	const format = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
	const label = $derived.by(() => {
		if (!stay) return 'No dates chosen';
		const from = format.format(new Date(`${stay.start}T00:00`));
		if (!stay.end) return `${from} — choose a departure`;
		return `${from} to ${format.format(new Date(`${stay.end}T00:00`))}`;
	});
</script>

<div class="flex flex-col items-center gap-3">
	<Calendar mode="range" bind:value={stay} label="Dates of stay" />
	<p class="text-sm text-muted-foreground">{label}</p>
</div>
