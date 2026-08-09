<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type ToolbarGroupProps = HTMLAttributes<HTMLDivElement> & {
		/** Accessible name for the run of controls. */
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, label, children, ...rest }: ToolbarGroupProps = $props();
</script>

<!-- A related run inside the toolbar — bold/italic/underline, say. -->
<div
	role="group"
	aria-label={label}
	data-slot="toolbar-group"
	class={cn('flex items-center gap-1', className)}
	{...rest}
>
	{@render children?.()}
</div>
