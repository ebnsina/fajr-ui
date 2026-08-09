<script lang="ts">
	import { Slider } from '$lib/components/ui';

	let volume = $state(70);
</script>

<div class="w-full max-w-sm">
	<Slider bind:value={volume} label="Volume" format={(v) => `${v}%`} />
	<p class="mt-3 text-center text-xs text-muted-foreground tabular-nums">{volume}%</p>
</div>
