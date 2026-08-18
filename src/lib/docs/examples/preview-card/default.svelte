<script lang="ts">
	import { base } from '$app/paths';
	import { Avatar, PreviewCard } from '$lib/components/ui';
</script>

<PreviewCard>
	{#snippet trigger()}
		<a href="{base}/docs" class="underline underline-offset-4">Ibn al-Haytham</a>
	{/snippet}
	<div class="flex flex-col gap-2">
		<Avatar>IH</Avatar>
		<p class="text-sm font-medium">Ibn al-Haytham</p>
		<p class="text-sm text-muted-foreground">
			Basra, then Cairo. Seven volumes of the Book of Optics are held in this collection.
		</p>
	</div>
</PreviewCard>
