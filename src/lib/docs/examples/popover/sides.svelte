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
	<PopoverTrigger variant="outline">Open popover</PopoverTrigger>
	<PopoverPopup side="right" align="start">
		<div class="flex w-56 flex-col gap-1 p-4">
			<PopoverTitle>Dimensions</PopoverTitle>
			<PopoverDescription class="text-xs">
				Set the width and height of the layer.
			</PopoverDescription>
		</div>
	</PopoverPopup>
</Popover>
