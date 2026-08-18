<script lang="ts">
	import { Slider } from '$lib/components/ui';

	let zoom = $state(70);
</script>

<div class="w-full max-w-sm">
	<Slider bind:value={zoom} label="Folio zoom" format={(v) => `${v}%`} />
	<p class="mt-3 text-center text-xs text-muted-foreground tabular-nums">{zoom}%</p>
</div>
