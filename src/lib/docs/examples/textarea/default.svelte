<script lang="ts">
	import { Textarea } from '$lib/components/ui';

	let note = $state('');
</script>

<div class="w-full max-w-sm">
	<Textarea
		bind:value={note}
		placeholder="Provenance, condition, marginalia — the box grows as you write."
	/>
</div>
