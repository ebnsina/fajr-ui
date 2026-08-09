<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { DialogProps } from './dialog/dialog.svelte';

	export type AlertDialogProps = Omit<DialogProps, 'role' | 'dismissible' | 'showCloseButton'> & {
		children?: Snippet;
	};
</script>

<script lang="ts">
	import Dialog from './dialog/dialog.svelte';

	let { open = $bindable(false), children, ...rest }: AlertDialogProps = $props();
</script>

<!--
	An alert dialog interrupts to ask something the user must answer, so it
	deliberately drops the two easy escapes a normal dialog offers: no backdrop
	dismissal and no corner close button. Both would let the question be waved
	away by accident, which is the whole thing it exists to prevent.

	Escape still closes it. Removing that would trap the user, and a trap is never
	the right answer — the point is to make dismissal deliberate, not impossible.
-->
<Dialog
	bind:open
	role="alertdialog"
	dismissible={false}
	showCloseButton={false}
	class="max-w-md"
	{...rest}
>
	{@render children?.()}
</Dialog>
