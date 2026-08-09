<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useField } from './context.svelte';

	const generatedId = $props.id();

	let {
		class: className,
		id,
		children,
		...rest
	}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();

	const field = useField();
	const resolvedId = $derived(id ?? generatedId);

	$effect(() => field?.register(resolvedId));
</script>

<!--
	`role="alert"` so the message is announced when validation fails, rather than
	only being reachable once the control is focused again.
-->
<p
	id={resolvedId}
	role="alert"
	data-slot="field-error"
	class={cn('text-xs text-destructive-foreground', className)}
	{...rest}
>
	{@render children?.()}
</p>
