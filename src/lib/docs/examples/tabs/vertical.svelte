<script lang="ts">
	import { Tabs, TabsList, TabsPanel, TabsTrigger } from '$lib/components/ui';

	let tab = $state('acquisition');
</script>

<div class="w-full max-w-md">
	<Tabs bind:value={tab} orientation="vertical">
		<TabsList class="w-40 shrink-0">
			<TabsTrigger value="acquisition">Acquisition</TabsTrigger>
			<TabsTrigger value="loans">Loans</TabsTrigger>
		</TabsList>
		<TabsPanel value="acquisition" class="pt-2 text-sm text-muted-foreground">
			How the volume reached the library, and from whom.
		</TabsPanel>
		<TabsPanel value="loans" class="pt-2 text-sm text-muted-foreground">
			Who holds it now, and when it is due back on the shelf.
		</TabsPanel>
	</Tabs>
</div>
