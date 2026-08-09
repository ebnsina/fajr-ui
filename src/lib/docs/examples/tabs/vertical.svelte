<script lang="ts">
	import { Tabs, TabsList, TabsPanel, TabsTrigger } from '$lib/components/ui';

	let tab = $state('manuscript');
</script>

<div class="w-full max-w-md">
	<Tabs bind:value={tab} orientation="vertical">
		<TabsList class="w-40 shrink-0">
			<TabsTrigger value="manuscript">Manuscript</TabsTrigger>
			<TabsTrigger value="provenance">Provenance</TabsTrigger>
		</TabsList>
		<TabsPanel value="manuscript" class="pt-2 text-sm text-muted-foreground">
			Title, scholar and the discipline it belongs to.
		</TabsPanel>
		<TabsPanel value="provenance" class="pt-2 text-sm text-muted-foreground">
			Where the copy came from, and who held it before.
		</TabsPanel>
	</Tabs>
</div>
