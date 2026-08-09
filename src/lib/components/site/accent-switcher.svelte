<script lang="ts">
	import { Popover, PopoverPopup, PopoverTrigger } from '$lib/components/ui';
	import { cn } from '$lib/utils';
	import { ACCENTS, accent, type Accent } from '$lib/accent.svelte';

	let open = $state(false);
	let items = $state<(HTMLElement | null)[]>([]);

	const active = $derived(ACCENTS.find((entry) => entry.value === accent.current) ?? ACCENTS[0]);
	const activeIndex = $derived(ACCENTS.findIndex((entry) => entry.value === accent.current));

	function choose(value: Accent) {
		accent.set(value);
		open = false;
	}

	/**
	 * A menu of mutually exclusive choices is one tab stop, not seven: arrows move
	 * between options, Home and End jump to either end. Without this, reaching the
	 * last accent would cost six presses and Tab would leak out of the popup.
	 */
	function onkeydown(event: KeyboardEvent, index: number) {
		const last = ACCENTS.length - 1;
		let next: number | undefined;
		if (event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
		else if (event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = last;
		else return;

		event.preventDefault();
		items[next]?.focus();
	}

	// Focus lands on the current choice, so the menu opens where you left it.
	$effect(() => {
		if (!open) return;
		queueMicrotask(() => items[Math.max(0, activeIndex)]?.focus());
	});
</script>

<Popover bind:open>
	<!--
		The accessible name carries the current accent, because the swatch that
		conveys it visually is decorative and hidden from assistive technology.
	-->
	<PopoverTrigger
		size="icon"
		variant="ghost"
		aria-haspopup="menu"
		aria-label="Accent colour: {active.label}"
		title="Accent colour"
	>
		<span
			aria-hidden="true"
			class="size-4 rounded-full border border-black/16 dark:border-white/24"
			style="background: {active.swatch}"
		></span>
	</PopoverTrigger>

	<PopoverPopup side="bottom" align="end" label="Accent colour" manageFocus={false}>
		<div role="menu" aria-label="Accent colour" class="flex w-60 flex-col gap-0.5 p-2">
			{#each ACCENTS as entry, index (entry.value)}
				{@const selected = entry.value === accent.current}
				<!--
					`menuitemradio` rather than a pressed button: these are one choice out
					of a set, and `aria-checked` is what announces which one is in effect.
				-->
				<button
					bind:this={items[index]}
					type="button"
					role="menuitemradio"
					aria-checked={selected}
					tabindex={selected || (activeIndex === -1 && index === 0) ? 0 : -1}
					onclick={() => choose(entry.value)}
					onkeydown={(event) => onkeydown(event, index)}
					class={cn(
						'flex h-9 cursor-pointer items-center gap-2.5 rounded-md px-2 text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring sm:h-8',
						selected && 'font-medium'
					)}
				>
					<span
						aria-hidden="true"
						class="size-4 shrink-0 rounded-full border border-black/16 dark:border-white/24"
						style="background: {entry.swatch}"
					></span>
					<!--
						The label is its own flex item: as a bare text node it shrank and
						wrapped, which broke the row height and pushed the tick out of line.
					-->
					<span class="flex-1 truncate text-start">{entry.label}</span>
					{#if selected}
						<svg
							aria-hidden="true"
							class="size-4 shrink-0"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M20 6 9 17l-5-5" />
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	</PopoverPopup>
</Popover>
