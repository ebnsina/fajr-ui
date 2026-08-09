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
</script>

<Button onclick={() => (open = true)}>Open dialog</Button>

<Dialog bind:open dismissible={true} showCloseButton={true}>
	<DialogHeader>
		<DialogTitle>Reading room rules</DialogTitle>
	</DialogHeader>
	<DialogPanel class="max-h-60">
		<div class="flex flex-col gap-3 text-sm">
			{#each Array.from({ length: 12 }, (_, index) => index + 1) as paragraph (paragraph)}
				<p>
					{paragraph}. Manuscripts leave the reading room only with the librarian's seal, and are
					returned to the shelf they were drawn from.
				</p>
			{/each}
		</div>
	</DialogPanel>
	<DialogFooter>
		<DialogClose variant="outline">Cancel</DialogClose>
		<DialogClose variant="default">Accept</DialogClose>
	</DialogFooter>
</Dialog>
