<script lang="ts">
	import { Separator } from '$lib/components/ui';
</script>

<div class="flex w-full max-w-sm flex-col text-sm">
	<p class="font-heading font-bold [font-variation-settings:'GEOM'_50,'opsz'_32]">Fajr UI</p>
	<p class="mt-1 text-muted-foreground">
		Accessible components you copy into your project and own outright.
	</p>
	<Separator decorative class="my-4" />
	<!-- A vertical rule with no height of its own stretches to the row. -->
	<div class="flex h-5 items-center gap-3">
		<a class="text-muted-foreground hover:text-foreground" href="/docs">Docs</a>
		<Separator orientation="vertical" decorative />
		<a class="text-muted-foreground hover:text-foreground" href="/docs/roadmap">Roadmap</a>
		<Separator orientation="vertical" decorative />
		<a class="text-muted-foreground hover:text-foreground" href="/docs/changelog">Changelog</a>
	</div>
</div>
