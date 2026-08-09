<script module lang="ts">
	import type { ProgressRootProps } from './progress-root.svelte';

	export type ProgressProps = Omit<ProgressRootProps, 'children'>;
</script>

<script lang="ts">
	import ProgressRoot from './progress-root.svelte';
	import ProgressTrack from './progress-track.svelte';
	import ProgressIndicator from './progress-indicator.svelte';

	let { ...rest }: ProgressProps = $props();
</script>

<!-- Just the bar. Compose the parts when it needs a label or a readout beside it. -->
<ProgressRoot {...rest}>
	<ProgressTrack>
		<ProgressIndicator />
	</ProgressTrack>
</ProgressRoot>
