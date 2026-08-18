<script lang="ts">
	import {
		Button,
		Field,
		FieldLabel,
		Input,
		Popover,
		PopoverClose,
		PopoverPopup,
		PopoverTitle,
		PopoverTrigger
	} from '$lib/components/ui';

	let open = $state(false);
</script>

<Popover bind:open>
	<PopoverTrigger variant="outline">Rename collection</PopoverTrigger>
	<PopoverPopup side="bottom" align="center">
		<form
			class="flex w-64 flex-col gap-3 p-4"
			onsubmit={(event) => {
				event.preventDefault();
				open = false;
			}}
		>
			<PopoverTitle>Rename collection</PopoverTitle>
			<Field>
				<FieldLabel>Name</FieldLabel>
				<Input value="Astronomy, uncatalogued" />
			</Field>
			<div class="flex justify-end gap-2">
				<PopoverClose size="sm" variant="outline">Cancel</PopoverClose>
				<Button size="sm" type="submit">Save</Button>
			</div>
		</form>
	</PopoverPopup>
</Popover>
