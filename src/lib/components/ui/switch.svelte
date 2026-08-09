<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export type SwitchProps = Omit<HTMLButtonAttributes, 'type'> & {
		checked?: boolean;
		/** Submitted with the form when checked, via a hidden input. */
		name?: string;
		value?: string;
		ref?: HTMLButtonElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useField } from './field/context.svelte';

	let {
		class: className,
		checked = $bindable(false),
		name,
		value = 'on',
		disabled,
		ref = $bindable(null),
		onclick,
		...rest
	}: SwitchProps = $props();

	const field = useField();
	const isDisabled = $derived(Boolean(disabled || field?.disabled));
</script>

<!--
	`role="switch"` on a real button: Space and Enter toggle it natively, and the
	state is announced as on/off rather than as a checkbox.
-->
<button
	bind:this={ref}
	type="button"
	role="switch"
	aria-checked={checked}
	id={field?.controlId}
	aria-describedby={field?.describedBy}
	aria-invalid={field?.invalid ? 'true' : undefined}
	disabled={isDisabled}
	data-slot="switch"
	data-state={checked ? 'checked' : 'unchecked'}
	onclick={(event) => {
		onclick?.(event);
		if (!event.defaultPrevented) checked = !checked;
	}}
	class={cn(
		'relative inline-flex h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] shrink-0 cursor-pointer items-center rounded-full p-px transition-[background-color,box-shadow] duration-200 ease-out outline-none [--thumb-size:--spacing(5)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-64 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input sm:[--thumb-size:--spacing(4)] pointer-coarse:after:absolute pointer-coarse:after:top-1/2 pointer-coarse:after:left-1/2 pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 pointer-coarse:after:-translate-x-1/2 pointer-coarse:after:-translate-y-1/2',
		className
	)}
	{...rest}
>
	<!--
		The thumb stretches horizontally while held and settles as it lands, which
		reads as weight rather than a rectangle teleporting across the track.

		The travel is a transform, which has no logical form — `translate-x` is
		physical whatever `dir` says — so right-to-left gets its own negated
		distance and mirrored origin. Without them the thumb slides out of its own
		track the moment the document is flipped.
	-->
	<span
		data-slot="switch-thumb"
		class="pointer-events-none block aspect-square h-full origin-left rounded-(--thumb-size) bg-background shadow-sm/5 transition-[translate,scale,transform-origin] duration-150 ease-out will-change-transform in-data-[state=checked]:origin-[var(--thumb-size)_50%] in-data-[state=checked]:translate-x-[calc(var(--thumb-size)-4px)] in-[[role=switch]:not(:disabled):active]:scale-x-110 motion-reduce:transition-none rtl:origin-right rtl:in-data-[state=checked]:origin-[calc(100%-var(--thumb-size))_50%] rtl:in-data-[state=checked]:-translate-x-[calc(var(--thumb-size)-4px)]"
	></span>
</button>

{#if name}
	<input type="hidden" {name} value={checked ? value : ''} />
{/if}
