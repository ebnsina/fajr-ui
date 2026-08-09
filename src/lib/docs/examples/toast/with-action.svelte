<script lang="ts">
	import { Button, toast } from '$lib/components/ui';
</script>

<Button
	variant="outline"
	onclick={() =>
		toast('Manuscript archived', {
			action: { label: 'Undo', onclick: () => toast.success('Manuscript restored') }
		})}
>
	Archive a manuscript
</Button>
