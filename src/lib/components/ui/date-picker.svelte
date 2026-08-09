<script module lang="ts">
	import type { Align, Side } from '$lib/internal/position';

	export type DatePickerProps = {
		/** ISO `YYYY-MM-DD`. */
		value?: string;
		open?: boolean;
		min?: string;
		max?: string;
		locale?: string;
		weekStartsOn?: 0 | 1;
		placeholder?: string;
		side?: Side;
		align?: Align;
		disabled?: boolean;
		/** Marks the trigger `aria-required`, and the hidden input `required`. */
		required?: boolean;
		name?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from './button.svelte';
	import Calendar, { fromISODate } from './calendar.svelte';
	import PopoverPopup from './popover/popover-popup.svelte';
	import { useField } from './field/context.svelte';
	import { CalendarIcon, Icon } from '$lib/icons';

	let {
		value = $bindable(),
		open = $bindable(false),
		min,
		max,
		locale = 'en-US',
		weekStartsOn = 1,
		placeholder = 'Pick a date',
		side = 'bottom',
		align = 'start',
		disabled,
		required,
		name,
		class: className
	}: DatePickerProps = $props();

	const uid = $props.id();
	const hintId = `${uid}-hint`;

	const field = useField();
	const isDisabled = $derived(Boolean(disabled || field?.disabled));

	let trigger = $state<HTMLElement | null>(null);

	const formatted = $derived.by(() => {
		if (!value) return undefined;
		const date = fromISODate(value);
		if (!date) return value;
		return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
	});

	// Choosing a date closes the panel; there is nothing else to decide.
	$effect(() => {
		if (value) open = false;
	});
</script>

<Button
	bind:ref={trigger}
	variant="outline"
	aria-haspopup="dialog"
	aria-expanded={open}
	id={field?.controlId}
	aria-describedby={field?.describedBy}
	aria-invalid={field?.invalid ? 'true' : undefined}
	aria-required={required ? 'true' : undefined}
	disabled={isDisabled}
	onclick={() => (open = !open)}
	class={cn('w-full justify-start font-normal', !value && 'text-muted-foreground/72', className)}
>
	<Icon icon={CalendarIcon} />
	{formatted ?? placeholder}
</Button>

{#if name}
	<input type="hidden" {name} value={value ?? ''} {required} />
{/if}

<!--
	The dialog says how to drive the grid inside it.
	A month is the one widget where the arrow keys move in two dimensions and
	PageUp/PageDown mean something, and none of that is guessable from a grid of
	numbers. Sighted users have the shape of the calendar to go on; announcing it
	once, when the dialog opens, is the equivalent.
-->
<PopoverPopup
	bind:open
	anchor={trigger}
	{side}
	{align}
	label="Choose a date"
	aria-describedby={hintId}
	class="p-0"
>
	<p id={hintId} class="sr-only">
		Arrow keys move by day and week, Page Up and Page Down by month, Home and End to the ends of the
		week. Enter chooses the focused date.
	</p>
	<Calendar bind:value {min} {max} {locale} {weekStartsOn} class="border-0 shadow-none" />
</PopoverPopup>
