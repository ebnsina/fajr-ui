<script lang="ts">
	import { Tabs, TabsList, TabsPanel, TabsTrigger } from '$lib/components/ui';

	let tab = $state('folios');
</script>

<div class="w-full max-w-sm">
	<Tabs bind:value={tab}>
		<TabsList variant="underline">
			<TabsTrigger value="folios">Folios</TabsTrigger>
			<TabsTrigger value="conservation">Conservation</TabsTrigger>
		</TabsList>
		<TabsPanel value="folios" class="pt-2 text-sm text-muted-foreground">
			Collation, page size and which folios are missing.
		</TabsPanel>
		<TabsPanel value="conservation" class="pt-2 text-sm text-muted-foreground">
			Every visit to the bindery, and what was repaired.
		</TabsPanel>
	</Tabs>
</div>
