<script lang="ts">
	import { fromAction } from 'svelte/attachments';
	import { Button, tooltip, type TooltipOptions } from '$lib/components/ui';

	const hint: TooltipOptions = { content: 'Add to library', side: 'right' };
</script>

<!--
	`use:` only works on elements, so an action reaches a component through
	`fromAction`, which turns it into an attachment. Button spreads what it is
	given onto its own element, so the tooltip lands there — no hand-rolled
	trigger needed.
-->
<Button variant="outline" {@attach fromAction(tooltip, () => hint)}>Hover me</Button>
