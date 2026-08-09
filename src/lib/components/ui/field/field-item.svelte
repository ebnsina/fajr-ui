<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type FieldItemProps = HTMLAttributes<HTMLDivElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest }: FieldItemProps = $props();
</script>

<!--
	One row of a field: the control on the left, its label and description filling
	the rest. Used for checkbox and radio rows, where the label sits beside the
	control rather than above it.
-->
<div
	data-slot="field-item"
	class={cn('flex items-start gap-3 [&>[data-slot=field-label]]:font-normal', className)}
	{...rest}
>
	{@render children?.()}
</div>
