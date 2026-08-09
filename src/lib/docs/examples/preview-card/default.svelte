<script lang="ts">
	import { Avatar, PreviewCard } from '$lib/components/ui';
</script>

<PreviewCard>
	{#snippet trigger()}
		<a href="/docs" class="underline underline-offset-4">Hover this link</a>
	{/snippet}
	<div class="flex flex-col gap-2">
		<Avatar>FU</Avatar>
		<p class="text-sm font-medium">Fajr UI</p>
		<p class="text-sm text-muted-foreground">
			Accessible components you copy into your project and own outright.
		</p>
	</div>
</PreviewCard>
