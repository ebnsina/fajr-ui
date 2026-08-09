<script lang="ts">
	import { DatePicker } from '$lib/components/ui';

	let picked = $state<string | undefined>();
</script>

<div class="w-full max-w-xs">
	<DatePicker bind:value={picked} />
</div>
