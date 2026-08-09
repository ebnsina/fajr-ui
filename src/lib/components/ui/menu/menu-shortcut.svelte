<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();
</script>

<!--
	`aria-hidden`: the shortcut is a visual reminder, and screen readers already
	announce the accessible name. Reading "Delete Command Backspace" is noise.
-->
<span
	aria-hidden="true"
	data-slot="menu-shortcut"
	class={cn('ms-auto ps-4 text-xs text-muted-foreground/72', className)}
	{...rest}
>
	{@render children?.()}
</span>
