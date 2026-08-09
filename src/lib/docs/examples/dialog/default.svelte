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

<Button onclick={() => (open = true)}>Open dialog</Button>

<Dialog bind:open dismissible={true} showCloseButton={true}>
	<DialogHeader>
		<DialogTitle>Delete collection</DialogTitle>
		<DialogDescription>This cannot be undone.</DialogDescription>
	</DialogHeader>
	<DialogPanel>
		<p class="text-sm">Every manuscript catalogued under it will be removed.</p>
	</DialogPanel>
	<DialogFooter>
		<DialogClose variant="outline">Cancel</DialogClose>
		<DialogClose variant="destructive">Delete</DialogClose>
	</DialogFooter>
</Dialog>
