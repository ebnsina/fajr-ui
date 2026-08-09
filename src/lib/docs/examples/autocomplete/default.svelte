<script lang="ts">
	import { Autocomplete } from '$lib/components/ui';

	const cities = [
		{ value: 'baghdad', label: 'Baghdad' },
		{ value: 'bukhara', label: 'Bukhara' },
		{ value: 'basra', label: 'Basra' },
		{ value: 'balkh', label: 'Balkh' }
	];

	let city = $state('');
</script>

<div class="w-full max-w-xs">
	<Autocomplete items={cities} bind:value={city} placeholder="City of origin" />
	<p class="mt-3 text-xs text-muted-foreground">Value: {city || '—'}</p>
</div>
