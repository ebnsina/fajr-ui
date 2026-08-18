<script lang="ts">
	import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$lib/components/ui';

	let open = $state(false);
</script>

<div class="w-full max-w-md">
	<Collapsible bind:open class="gap-2 rounded-xl border p-4">
		<CollapsibleTrigger class="flex w-full items-center justify-between text-sm font-medium">
			Provenance
			<svg
				aria-hidden="true"
				class="size-4 text-muted-foreground transition-transform duration-(--duration-drawer) ease-out motion-reduce:transition-none"
				class:rotate-180={open}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m6 9 6 6 6-6" />
			</svg>
		</CollapsibleTrigger>
		<CollapsibleContent class="pt-2 text-sm text-muted-foreground">
			Copied in Bukhara, held by the Nizamiyya until the sack of Baghdad, and entered here with the
			Samarkand bequest.
		</CollapsibleContent>
	</Collapsible>
</div>
