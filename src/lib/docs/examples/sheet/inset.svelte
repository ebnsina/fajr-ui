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

<Sheet bind:open side="right" variant="inset">
	<SheetTrigger variant="outline">Record an acquisition</SheetTrigger>
	<SheetPopup class="w-[min(22rem,calc(100vw-3rem))]">
		<SheetHeader>
			<SheetTitle>Acquisition record</SheetTitle>
			<SheetDescription>Entered against the Samarkand bequest.</SheetDescription>
		</SheetHeader>
		<SheetPanel>
			<div class="flex flex-col gap-4">
				<Field>
					<FieldLabel>Title</FieldLabel>
					<Input value="The Book of Optics" />
				</Field>
				<Field>
					<FieldLabel>Acquired from</FieldLabel>
					<Input value="The Nizamiyya, Baghdad" />
				</Field>
				<Field>
					<FieldLabel>Notes</FieldLabel>
					<Textarea placeholder="Price, donor, conditions of the gift…" />
				</Field>
			</div>
		</SheetPanel>
		<SheetFooter>
			<SheetClose variant="outline">Cancel</SheetClose>
			<SheetClose>Save</SheetClose>
		</SheetFooter>
	</SheetPopup>
</Sheet>
