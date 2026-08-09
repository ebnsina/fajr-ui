<script lang="ts">
	import { Button, toast } from '$lib/components/ui';
</script>

<div class="flex flex-wrap items-center justify-center gap-2">
	<Button variant="outline" size="sm" onclick={() => toast.success('Folio saved')}>Success</Button>
	<Button variant="outline" size="sm" onclick={() => toast.warning('Ink is running low')}>
		Warning
	</Button>
	<Button variant="outline" size="sm" onclick={() => toast.error('Could not save the folio')}>
		Error
	</Button>
	<Button variant="outline" size="sm" onclick={() => toast.info('Three volumes arrived')}
		>Info</Button
	>
</div>
