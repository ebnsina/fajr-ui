<script lang="ts">
	import {
		Field,
		FieldLabel,
		Input,
		Sheet,
		SheetClose,
		SheetDescription,
		SheetFooter,
		SheetHeader,
		SheetPanel,
		SheetPopup,
		SheetTitle,
		SheetTrigger,
		Textarea
	} from '$lib/components/ui';

	let open = $state(false);
</script>

<Sheet bind:open side="left">
	<SheetTrigger variant="outline">Open sheet</SheetTrigger>
	<SheetPopup class="w-[min(22rem,calc(100vw-3rem))]">
		<SheetHeader>
			<SheetTitle>Manuscript details</SheetTitle>
			<SheetDescription>Press Escape or click the backdrop to close.</SheetDescription>
		</SheetHeader>
		<SheetPanel>
			<div class="flex flex-col gap-4">
				<Field>
					<FieldLabel>Title</FieldLabel>
					<Input value="The Canon of Medicine" />
				</Field>
				<Field>
					<FieldLabel>Scholar</FieldLabel>
					<Input value="Ibn Sina" />
				</Field>
				<Field>
					<FieldLabel>Notes</FieldLabel>
					<Textarea placeholder="Provenance, condition, marginalia…" />
				</Field>
			</div>
		</SheetPanel>
		<SheetFooter>
			<SheetClose variant="outline">Cancel</SheetClose>
			<SheetClose>Save</SheetClose>
		</SheetFooter>
	</SheetPopup>
</Sheet>
