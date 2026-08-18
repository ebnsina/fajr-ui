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
	<SheetTrigger variant="outline">Log conservation work</SheetTrigger>
	<SheetPopup class="w-[min(22rem,calc(100vw-3rem))]">
		<SheetHeader>
			<SheetTitle>Conservation log</SheetTitle>
			<SheetDescription>One entry per visit to the bindery.</SheetDescription>
		</SheetHeader>
		<SheetPanel>
			<div class="flex flex-col gap-4">
				<Field>
					<FieldLabel>Title</FieldLabel>
					<Input value="Zij-i Ilkhani" />
				</Field>
				<Field>
					<FieldLabel>Conservator</FieldLabel>
					<Input value="Nasir al-Din al-Tusi" />
				</Field>
				<Field>
					<FieldLabel>Notes</FieldLabel>
					<Textarea placeholder="Repairs made, materials used, folios affected…" />
				</Field>
			</div>
		</SheetPanel>
		<SheetFooter>
			<SheetClose variant="outline">Cancel</SheetClose>
			<SheetClose>Save</SheetClose>
		</SheetFooter>
	</SheetPopup>
</Sheet>
