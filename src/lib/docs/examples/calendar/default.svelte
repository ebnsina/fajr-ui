<script lang="ts">
	import { Calendar } from '$lib/components/ui';

	let picked = $state<string | undefined>();
</script>

<Calendar bind:value={picked} />
