<script lang="ts">
	import { Button, toast } from '$lib/components/ui';
</script>

<Button onclick={() => toast('Added to the catalogue', { description: 'Shelf III, Baghdad.' })}>
	Show toast
</Button>
