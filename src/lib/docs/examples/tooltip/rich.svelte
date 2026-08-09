<script lang="ts">
	import { Button, Kbd, Tooltip } from '$lib/components/ui';
</script>

<Tooltip side="top">
	<!--
		The trigger is your own element. Spreading `props` onto it means nothing is
		wrapped: sibling selectors keep working, and `aria-describedby` lands on the
		button rather than on a wrapper the user never focuses.
	-->
	{#snippet trigger(props)}
		<Button variant="outline" {...props}>Rebind folio</Button>
	{/snippet}

	<span class="flex items-center gap-2">
		Sends the volume to the bindery
		<Kbd>⌘</Kbd>
		<Kbd>B</Kbd>
	</span>
</Tooltip>
