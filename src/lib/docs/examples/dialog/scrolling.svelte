<script lang="ts">
	import {
		Button,
		Dialog,
		DialogClose,
		DialogFooter,
		DialogHeader,
		DialogPanel,
		DialogTitle
	} from '$lib/components/ui';

	let open = $state(false);

	const rules = [
		'A volume is drawn by shelfmark, and returned to the shelf it was drawn from.',
		'The librarian’s seal leaves the reading room with the volume, or the volume does not.',
		'Loose folios are carried flat, on the tray provided, and never under the arm.',
		'Ink is kept off the table entirely. Notes are taken in pencil.',
		'A binding is never forced open to lie flat; use the foam cradle.',
		'Marginalia are recorded on the conservation slip, not corrected on the page.',
		'Two volumes at a desk at once, no more, so that nothing is refiled by mistake.',
		'Damage is reported before the volume is refiled, however slight it looks.',
		'Lamps stay at the far edge of the desk and are lowered at midday.',
		'Copies are made at the copying desk, in the room, and nowhere else.',
		'Food and drink stay in the courtyard, including water.',
		'The room is cleared at sunset, whatever remains unread.'
	];
</script>

<Button onclick={() => (open = true)}>Read the reading room rules</Button>

<Dialog bind:open dismissible={true} showCloseButton={true}>
	<DialogHeader>
		<DialogTitle>Reading room rules</DialogTitle>
	</DialogHeader>
	<DialogPanel class="max-h-60">
		<div class="flex flex-col gap-3 text-sm">
			{#each rules as rule, index (rule)}
				<p>{index + 1}. {rule}</p>
			{/each}
		</div>
	</DialogPanel>
	<DialogFooter>
		<DialogClose variant="outline">Cancel</DialogClose>
		<DialogClose variant="default">Accept</DialogClose>
	</DialogFooter>
</Dialog>
