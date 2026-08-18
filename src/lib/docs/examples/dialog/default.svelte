<script lang="ts">
	import {
		Button,
		Dialog,
		DialogClose,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogPanel,
		DialogTitle
	} from '$lib/components/ui';

	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Discard changes</Button>

<Dialog bind:open dismissible={true} showCloseButton={true}>
	<DialogHeader>
		<DialogTitle>Discard this catalogue entry?</DialogTitle>
		<DialogDescription>Nothing you have typed has been saved yet.</DialogDescription>
	</DialogHeader>
	<DialogPanel>
		<p class="text-sm">The shelfmark, the collation and the conservation note will all be lost.</p>
	</DialogPanel>
	<DialogFooter>
		<DialogClose variant="outline">Keep editing</DialogClose>
		<DialogClose variant="destructive">Discard</DialogClose>
	</DialogFooter>
</Dialog>
