<script lang="ts">
	import { Button, toast } from '$lib/components/ui';
</script>

<div class="flex flex-wrap items-center justify-center gap-2">
	<!-- `duration: 0` keeps it up until something dismisses it. -->
	<Button variant="outline" onclick={() => toast('Digitising in progress', { duration: 0 })}>
		Show persistent toast
	</Button>
	<Button variant="ghost" onclick={() => toast.clear()}>Clear all</Button>
</div>
