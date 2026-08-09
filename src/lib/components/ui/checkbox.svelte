<script module lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type CheckboxProps = Omit<HTMLInputAttributes, 'type' | 'checked'> & {
		checked?: boolean;
		/** Renders the dash instead of the tick, and reports `mixed` to AT. */
		indeterminate?: boolean;
		ref?: HTMLInputElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useField } from './field/context.svelte';

	let {
		class: className,
		checked = $bindable(false),
		indeterminate = false,
		ref = $bindable(null),
		...rest
	}: CheckboxProps = $props();

	const field = useField();

	// `indeterminate` has no HTML attribute — it is a DOM property only.
	$effect(() => {
		if (ref) ref.indeterminate = indeterminate;
	});

	const state = $derived(indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked');
</script>

<span
	data-slot="checkbox"
	data-state={state}
	class={cn(
		'relative inline-flex size-4.5 shrink-0 items-center justify-center rounded-[.25rem] border border-input bg-background shadow-xs/5 ring-ring transition-shadow not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[3px] not-data-[state=checked]:not-has-disabled:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:ring-2 has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background has-disabled:cursor-not-allowed has-disabled:opacity-64 has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/48 sm:size-4 dark:not-data-[state=checked]:bg-input/32 dark:not-data-[state=checked]:not-has-disabled:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)] dark:has-aria-invalid:ring-destructive/24 [[data-state=checked],:has(:disabled),:has([aria-invalid])]:shadow-none',
		className
	)}
>
	<!-- The real input stays in the DOM so it submits with the form and keeps
	     native Space-to-toggle and label association. -->
	<input
		bind:this={ref}
		bind:checked
		type="checkbox"
		data-slot="checkbox-input"
		class="absolute inset-0 z-1 cursor-pointer opacity-0 disabled:cursor-not-allowed pointer-coarse:-inset-3.5"
		id={field?.controlId}
		aria-describedby={field?.describedBy}
		aria-invalid={field?.invalid ? 'true' : undefined}
		aria-checked={indeterminate ? 'mixed' : undefined}
		disabled={field?.disabled || undefined}
		{...rest}
	/>
	{#if checked || indeterminate}
		<!--
			Emitting exactly one background class rather than layering a conditional
			override: with both present, which wins depends on stylesheet order, not
			on the order they appear here — and it silently rendered the mixed dash
			in the same colour as its own background.
		-->
		<span
			data-slot="checkbox-indicator"
			class={cn(
				'pointer-events-none absolute -inset-px flex items-center justify-center rounded-[.25rem]',
				indeterminate ? 'text-foreground' : 'bg-primary text-primary-foreground'
			)}
		>
			<svg
				aria-hidden="true"
				class="size-3.5 sm:size-3"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				{#if indeterminate}
					<path d="M5.252 12h13.496" />
				{:else}
					<path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
				{/if}
			</svg>
		</span>
	{/if}
</span>
