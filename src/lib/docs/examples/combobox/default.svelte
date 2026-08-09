<script lang="ts">
	import { Combobox, type ComboboxItemData } from '$lib/components/ui';

	const disciplines: ComboboxItemData[] = [
		{ value: 'algebra', label: 'Algebra' },
		{ value: 'optics', label: 'Optics' },
		{ value: 'astronomy', label: 'Astronomy' },
		{ value: 'medicine', label: 'Medicine' },
		{ value: 'alchemy', label: 'Alchemy', disabled: true }
	];

	let discipline = $state<string | undefined>();
</script>

<div class="w-full max-w-xs">
	<Combobox items={disciplines} bind:value={discipline} placeholder="Search disciplines…" />
</div>
