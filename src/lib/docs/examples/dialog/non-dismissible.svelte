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

<Button onclick={() => (open = true)}>Delete collection</Button>

<Dialog bind:open dismissible={false} showCloseButton={false}>
	<DialogHeader>
		<DialogTitle>Delete the Samarkand bequest?</DialogTitle>
		<DialogDescription>This cannot be undone.</DialogDescription>
	</DialogHeader>
	<DialogPanel>
		<p class="text-sm">All fourteen volumes catalogued under it are removed with it.</p>
	</DialogPanel>
	<DialogFooter>
		<DialogClose variant="outline">Cancel</DialogClose>
		<DialogClose variant="destructive">Delete</DialogClose>
	</DialogFooter>
</Dialog>
