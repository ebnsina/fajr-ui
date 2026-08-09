<script lang="ts">
	import { Pagination } from '$lib/components/ui';

	let page = $state(3);
</script>

<Pagination bind:page count={12} />
