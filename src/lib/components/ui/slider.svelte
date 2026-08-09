<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type SliderProps = Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> & {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		label?: string;
		/** Formats the value announced to assistive technology. */
		format?: (value: number) => string;
		name?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { horizontalSign } from '$lib/internal/rtl';
	import { useField } from './field/context.svelte';

	let {
		class: className,
		value = $bindable(50),
		min = 0,
		max = 100,
		step = 1,
		disabled,
		label = 'Slider',
		format,
		name,
		...rest
	}: SliderProps = $props();

	const field = useField();
	const isDisabled = $derived(Boolean(disabled || field?.disabled));

	let track = $state<HTMLElement | null>(null);
	let dragging = $state(false);

	const percent = $derived(((value - min) / (max - min)) * 100);

	function clamp(next: number): number {
		const stepped = Math.round((next - min) / step) * step + min;
		// Rounding to the step can drift on fractional steps; snap to the same
		// precision so the value never reads as 0.30000000000000004.
		const decimals = (String(step).split('.')[1] ?? '').length;
		return Number(Math.min(max, Math.max(min, stepped)).toFixed(decimals));
	}

	function setFromPointer(clientX: number) {
		if (!track || isDisabled) return;
		const rect = track.getBoundingClientRect();
		const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
		value = clamp(min + ratio * (max - min));
	}

	function onkeydown(event: KeyboardEvent) {
		if (isDisabled) return;
		// A large step for PageUp/PageDown, so a long range is crossable by keyboard.
		const large = Math.max(step, (max - min) / 10);
		// Left and right are visual directions, so they swap when the track runs
		// right-to-left. Up and down are not, so they do not.
		const sign = horizontalSign(event.currentTarget as Element);
		const moves: Record<string, number> = {
			ArrowRight: step * sign,
			ArrowUp: step,
			ArrowLeft: -step * sign,
			ArrowDown: -step,
			PageUp: large,
			PageDown: -large
		};

		if (event.key === 'Home') {
			event.preventDefault();
			value = min;
			return;
		}
		if (event.key === 'End') {
			event.preventDefault();
			value = max;
			return;
		}
		const delta = moves[event.key];
		if (delta === undefined) return;
		event.preventDefault();
		value = clamp(value + delta);
	}
</script>

<div
	data-slot="slider"
	data-disabled={isDisabled ? '' : undefined}
	class={cn('relative flex w-full touch-none items-center py-2', className)}
	{...rest}
>
	<!--
		The track is only a hit area; the thumb is the control. Pointer events are
		captured on the thumb so a drag continues even when the pointer leaves it.
	-->
	<!-- Clicking the track is a shortcut; the thumb is the actual control. -->
	<div
		role="presentation"
		bind:this={track}
		data-slot="slider-track"
		class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted data-[disabled]:opacity-64"
		onpointerdown={(event) => {
			if (isDisabled) return;
			setFromPointer(event.clientX);
		}}
	>
		<div
			data-slot="slider-range"
			class={cn(
				'absolute h-full rounded-full bg-primary',
				!dragging && 'transition-[width] duration-100 ease-out motion-reduce:transition-none'
			)}
			style="width: {percent}%"
		></div>
	</div>

	<!--
		Inside a Field the visible label names the control, so the fallback must
		stand down: `aria-label` outranks `<label for>`, and leaving it on meant a
		slider in a labelled Field announced the generic "Slider" while the sighted
		user read "Recitation speed". NumberField and OtpField already do this.
	-->
	<span
		role="slider"
		tabindex={isDisabled ? -1 : 0}
		aria-label={field ? undefined : label}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		aria-valuetext={format ? format(value) : undefined}
		aria-disabled={isDisabled || undefined}
		aria-describedby={field?.describedBy}
		id={field?.controlId}
		data-slot="slider-thumb"
		style="left: {percent}%"
		class={cn(
			'absolute size-4 -translate-x-1/2 cursor-grab rounded-full border border-input bg-background shadow-sm/5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:cursor-grabbing aria-disabled:cursor-not-allowed aria-disabled:opacity-64',
			!dragging && 'transition-[left] duration-100 ease-out motion-reduce:transition-none'
		)}
		{onkeydown}
		onpointerdown={(event) => {
			if (isDisabled) return;
			dragging = true;
			event.currentTarget.setPointerCapture(event.pointerId);
		}}
		onpointermove={(event) => {
			if (dragging) setFromPointer(event.clientX);
		}}
		onpointerup={() => (dragging = false)}
		onpointercancel={() => (dragging = false)}
	></span>
</div>

{#if name}
	<input type="hidden" {name} {value} />
{/if}
