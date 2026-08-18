<script lang="ts">
	import {
		Popover,
		PopoverDescription,
		PopoverPopup,
		PopoverTitle,
		PopoverTrigger
	} from '$lib/components/ui';

	let open = $state(false);
</script>

<Popover bind:open>
	<PopoverTrigger variant="outline">Folio size</PopoverTrigger>
	<PopoverPopup side="bottom" align="center">
		<div class="flex w-56 flex-col gap-1 p-4">
			<PopoverTitle>Folio size</PopoverTitle>
			<PopoverDescription class="text-xs">
				Height and width of the page, measured at the widest folio.
			</PopoverDescription>
		</div>
	</PopoverPopup>
</Popover>
