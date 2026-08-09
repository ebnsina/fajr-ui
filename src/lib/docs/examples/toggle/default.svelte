<script lang="ts">
	import { Toggle } from '$lib/components/ui';

	let bold = $state(false);
</script>

<Toggle bind:pressed={bold}>Bold</Toggle>
