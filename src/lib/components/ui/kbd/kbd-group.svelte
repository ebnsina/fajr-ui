<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type KbdGroupProps = HTMLAttributes<HTMLElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest }: KbdGroupProps = $props();
</script>

<!-- A chord or sequence: several keys read as one instruction, so they sit together. -->
<kbd data-slot="kbd-group" class={cn('inline-flex items-center gap-1', className)} {...rest}>
	{@render children?.()}
</kbd>
