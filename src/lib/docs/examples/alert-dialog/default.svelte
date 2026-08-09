<script lang="ts">
	import {
		AlertDialog,
		Button,
		DialogClose,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui';

	let open = $state(false);
</script>

<Button variant="destructive" onclick={() => (open = true)}>Delete collection</Button>

<AlertDialog bind:open>
	<DialogHeader>
		<DialogTitle>Delete this collection?</DialogTitle>
		<DialogDescription>
			Every manuscript catalogued under it will be removed. This cannot be undone.
		</DialogDescription>
	</DialogHeader>
	<DialogFooter>
		<DialogClose variant="outline">Cancel</DialogClose>
		<DialogClose variant="destructive">Delete</DialogClose>
	</DialogFooter>
</AlertDialog>
