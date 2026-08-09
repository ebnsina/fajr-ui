<script lang="ts">
	import { NumberField } from '$lib/components/ui';

	let guests = $state<number | null>(2);
</script>

<div class="w-full max-w-[12rem]">
	<NumberField bind:value={guests} min={0} max={99} label="Guests" />
</div>
