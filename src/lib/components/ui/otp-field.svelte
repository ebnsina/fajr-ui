<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type OtpFieldProps = Omit<HTMLAttributes<HTMLDivElement>, 'oncomplete'> & {
		value?: string;
		length?: number;
		/** Restricts what can be entered. */
		pattern?: 'digits' | 'alphanumeric';
		disabled?: boolean;
		label?: string;
		name?: string;
		oncomplete?: (value: string) => void;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useField } from './field/context.svelte';

	let {
		class: className,
		value = $bindable(''),
		length = 6,
		pattern = 'digits',
		disabled,
		label = 'Verification code',
		name,
		oncomplete,
		...rest
	}: OtpFieldProps = $props();

	const field = useField();
	const isDisabled = $derived(Boolean(disabled || field?.disabled));

	let input = $state<HTMLInputElement | null>(null);
	let focused = $state(false);

	const allowed = $derived(pattern === 'digits' ? /[^0-9]/g : /[^a-zA-Z0-9]/g);
	const chars = $derived(Array.from({ length }, (_, index) => value[index] ?? ''));
	// The caret sits on the next empty slot, or the last one when full.
	const caret = $derived(Math.min(value.length, length - 1));

	function set(next: string) {
		const cleaned = next.replace(allowed, '').slice(0, length);
		const wasIncomplete = value.length < length;
		value = cleaned;
		if (wasIncomplete && cleaned.length === length) oncomplete?.(cleaned);
	}
</script>

<!--
	One real input behind the slots, rather than one input per character. That is
	what makes paste, autofill and the platform's SMS one-time-code suggestion
	work — none of which survive being split across six separate fields.
-->
<div
	data-slot="otp-field"
	class={cn('relative flex w-fit items-center gap-2', className)}
	onclick={() => input?.focus()}
	onkeydown={() => {}}
	role="presentation"
	{...rest}
>
	<input
		bind:this={input}
		{name}
		{value}
		disabled={isDisabled}
		id={field?.controlId}
		aria-label={field ? undefined : label}
		aria-describedby={field?.describedBy}
		aria-invalid={field?.invalid ? 'true' : undefined}
		inputmode={pattern === 'digits' ? 'numeric' : 'text'}
		autocomplete="one-time-code"
		maxlength={length}
		class="absolute inset-0 z-1 w-full cursor-default opacity-0 disabled:cursor-not-allowed"
		oninput={(event) => set(event.currentTarget.value)}
		onfocus={() => (focused = true)}
		onblur={() => (focused = false)}
	/>

	{#each chars as char, index (index)}
		{@const active = focused && index === caret}
		<div
			data-slot="otp-field-slot"
			data-active={active ? '' : undefined}
			aria-hidden="true"
			class={cn(
				'relative flex size-10 items-center justify-center rounded-lg border border-input bg-background text-base transition-[border-color,box-shadow] not-dark:bg-clip-padding sm:size-9 sm:text-sm dark:bg-input/32',
				active && 'z-10 ring-2 ring-ring ring-offset-2 ring-offset-background',
				isDisabled && 'opacity-64'
			)}
		>
			{char}
			{#if active && char === ''}
				<span class="absolute h-5 w-px animate-caret-blink bg-foreground motion-reduce:animate-none"
				></span>
			{/if}
		</div>
	{/each}
</div>
