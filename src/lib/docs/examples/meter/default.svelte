<script lang="ts">
	import { Meter } from '$lib/components/ui';
</script>

<div class="w-full max-w-sm">
	<Meter value={68} label="Shelf space" format={(value, max) => `${value} of ${max} shelves`} />
</div>
