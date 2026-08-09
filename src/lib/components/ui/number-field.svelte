<script module lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type NumberFieldProps = Omit<HTMLInputAttributes, 'value' | 'type' | 'size'> & {
		value?: number | null;
		min?: number;
		max?: number;
		step?: number;
		size?: 'sm' | 'default' | 'lg';
		label?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Input from './input.svelte';
	import { useField } from './field/context.svelte';

	let {
		class: className,
		value = $bindable(null),
		min = Number.NEGATIVE_INFINITY,
		max = Number.POSITIVE_INFINITY,
		step = 1,
		size = 'default',
		label = 'Number',
		disabled,
		...rest
	}: NumberFieldProps = $props();

	const field = useField();
	const isDisabled = $derived(Boolean(disabled || field?.disabled));

	const decimals = $derived((String(step).split('.')[1] ?? '').length);
	const atMin = $derived(value !== null && value <= min);
	const atMax = $derived(value !== null && value >= max);

	function nudge(delta: number) {
		const base = value ?? 0;
		const next = Math.min(max, Math.max(min, base + delta));
		value = Number(next.toFixed(decimals));
	}

	function onkeydown(event: KeyboardEvent) {
		// Up and Down step the value, as they do on a native number input.
		const moves: Record<string, number> = { ArrowUp: step, ArrowDown: -step };
		const delta = moves[event.key];
		if (delta === undefined) return;
		event.preventDefault();
		nudge(delta);
	}

	const stepper =
		'relative flex shrink-0 cursor-pointer items-center justify-center transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 [&>svg]:size-4';
</script>

<!--
	One bordered group rather than three separate controls: the steppers sit flush
	inside the field's own border and share its focus ring, so the whole thing
	reads as a single control.
-->
<div
	data-slot="number-field"
	data-size={size}
	class={cn(
		'relative flex w-full justify-between rounded-lg border border-input bg-background text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-visible:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:border-ring has-focus-visible:ring-[3px] has-disabled:opacity-64 has-aria-invalid:border-destructive/36 sm:text-sm dark:bg-input/32 dark:not-has-disabled:not-has-focus-visible:before:shadow-[0_-1px_--theme(--color-white/6%)]',
		className
	)}
>
	<button
		type="button"
		tabindex={-1}
		aria-label="Decrease"
		disabled={isDisabled || atMin}
		onclick={() => nudge(-step)}
		data-slot="number-field-decrement"
		class={cn(
			stepper,
			'rounded-s-[calc(var(--radius-lg)-1px)]',
			size === 'sm' ? 'px-[calc(--spacing(2.5)-1px)]' : 'px-[calc(--spacing(3)-1px)]'
		)}
	>
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		>
			<path d="M5 12h14" />
		</svg>
	</button>

	<!--
		`inputmode="decimal"` brings up a numeric keypad on touch without the
		spinner buttons and scroll-to-change behaviour of `type="number"`, which
		are easy to trigger by accident.
	-->
	<Input
		unstyled
		{size}
		type="text"
		inputmode="decimal"
		role="spinbutton"
		aria-label={field ? undefined : label}
		aria-valuenow={value ?? undefined}
		aria-valuemin={Number.isFinite(min) ? min : undefined}
		aria-valuemax={Number.isFinite(max) ? max : undefined}
		value={value ?? ''}
		disabled={isDisabled}
		class="min-w-0 grow"
		inputClass="text-center tabular-nums"
		oninput={(event) => {
			const raw = (event.currentTarget as HTMLInputElement).value.trim();
			value = raw === '' ? null : Number(raw);
		}}
		onblur={() => {
			if (value === null || Number.isNaN(value)) return;
			// Clamp on blur rather than on every keystroke, so typing "1" on the way
			// to "15" is not snapped up to the minimum mid-entry.
			value = Number(Math.min(max, Math.max(min, value)).toFixed(decimals));
		}}
		{onkeydown}
		{...rest}
	/>

	<button
		type="button"
		tabindex={-1}
		aria-label="Increase"
		disabled={isDisabled || atMax}
		onclick={() => nudge(step)}
		data-slot="number-field-increment"
		class={cn(
			stepper,
			'rounded-e-[calc(var(--radius-lg)-1px)]',
			size === 'sm' ? 'px-[calc(--spacing(2.5)-1px)]' : 'px-[calc(--spacing(3)-1px)]'
		)}
	>
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		>
			<path d="M12 5v14M5 12h14" />
		</svg>
	</button>
</div>
