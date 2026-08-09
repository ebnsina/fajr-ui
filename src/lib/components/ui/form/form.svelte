<script module lang="ts">
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { FormErrors } from './context.svelte';

	export type FormProps = Omit<HTMLFormAttributes, 'onsubmit'> & {
		/** Field errors, keyed by input name. Bindable. */
		errors?: FormErrors;
		/** Return errors to block submission, or nothing to proceed. */
		validate?: (data: Record<string, FormDataEntryValue>) => FormErrors | void;
		/** Called with the form's data once validation passes. */
		onsubmit?: (data: Record<string, FormDataEntryValue>) => void | Promise<void>;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { FormState, setFormContext } from './context.svelte';

	let {
		class: className,
		errors = $bindable({}),
		validate,
		onsubmit,
		children,
		...rest
	}: FormProps = $props();

	let submitting = $state(false);
	let form = $state<HTMLFormElement | null>(null);

	setFormContext(
		new FormState({
			errors: () => errors,
			submitting: () => submitting
		})
	);

	/**
	 * Focus the control a name belongs to.
	 *
	 * Select, Switch, Slider, DatePicker and Combobox all carry their `name` on a
	 * hidden input, because that is what a form submission reads. Focusing the
	 * `[name]` match therefore tried to focus something unfocusable and left the
	 * user on the submit button while an error appeared far above — so the search
	 * skips hidden inputs and falls back to whatever the field labels.
	 */
	function focusField(name: string) {
		if (!form) return;
		const escaped = CSS.escape(name);
		const direct = form.querySelector<HTMLElement>(`[name="${escaped}"]:not([type='hidden'])`);
		if (direct) {
			direct.focus();
			return;
		}

		// The hidden input marks the field; the control to focus is beside it.
		const hidden = form.querySelector<HTMLElement>(`[name="${escaped}"]`);
		const container = hidden?.closest('[data-slot="field"]') ?? form;
		container
			.querySelector<HTMLElement>(
				'[role="combobox"], [role="slider"], [role="switch"], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
			)
			?.focus();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting || !form) return;

		const data = Object.fromEntries(new FormData(form));
		const found = validate?.(data) ?? {};
		errors = found;

		// Move focus to the first field that failed, so the problem is where the
		// user is rather than somewhere they have to go looking for it.
		const firstInvalid = Object.keys(found).find((key) => found[key]);
		if (firstInvalid) {
			focusField(firstInvalid);
			return;
		}

		submitting = true;
		try {
			await onsubmit?.(data);
		} finally {
			submitting = false;
		}
	}
</script>

<!--
	`novalidate` turns off the browser's own bubbles so validation is reported
	through Field, where the message sits beside the control and is wired to it
	with `aria-describedby` — a native bubble is neither.
-->
<form
	bind:this={form}
	novalidate
	data-slot="form"
	data-submitting={submitting ? '' : undefined}
	onsubmit={handleSubmit}
	class={cn(className)}
	{...rest}
>
	{@render children?.()}
</form>
