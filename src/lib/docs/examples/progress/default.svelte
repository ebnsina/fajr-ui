<script lang="ts">
	import { Button, Progress } from '$lib/components/ui';

	let progress = $state(60);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
	<Progress value={progress} label="Digitising folios" />
	<div class="flex items-center gap-2">
		<Button size="sm" variant="outline" onclick={() => (progress = Math.max(0, progress - 20))}>
			−20
		</Button>
		<Button size="sm" variant="outline" onclick={() => (progress = Math.min(100, progress + 20))}>
			+20
		</Button>
	</div>
</div>
