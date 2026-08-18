<script lang="ts">
	import { cn } from '$lib/utils';
	import { PACKAGE_MANAGERS, packageManager } from '$lib/package-manager.svelte';

	let { class: className }: { class?: string } = $props();

	let buttons = $state<(HTMLElement | null)[]>([]);

	/**
	 * One choice from a set, so arrows move between the options and the group is
	 * a single tab stop. Four package managers should not cost four Tab presses
	 * on the way to the code below them.
	 */
	function onkeydown(event: KeyboardEvent) {
		const last = PACKAGE_MANAGERS.length - 1;
		const index = PACKAGE_MANAGERS.indexOf(packageManager.current);
		let next: number | undefined;
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
			next = index === last ? 0 : index + 1;
		else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
			next = index === 0 ? last : index - 1;
		else return;

		event.preventDefault();
		packageManager.set(PACKAGE_MANAGERS[next]);
		buttons[next]?.focus();
	}
</script>

<div
	role="radiogroup"
	aria-label="Package manager"
	class={cn('inline-flex items-center gap-0.5 rounded-lg border bg-muted/32 p-0.5', className)}
>
	{#each PACKAGE_MANAGERS as manager, index (manager)}
		{@const selected = manager === packageManager.current}
		<button
			bind:this={buttons[index]}
			type="button"
			role="radio"
			aria-checked={selected}
			tabindex={selected ? 0 : -1}
			onclick={() => packageManager.set(manager)}
			{onkeydown}
			class={cn(
				'cursor-pointer rounded-sm px-2.5 py-1 font-mono text-xs transition-colors outline-none',
				selected
					? // `bg-background` is near-black in the dark theme, and so is the muted
						// track behind it, so the selected tab all but disappeared. `input`
						// is the token that stays a step lighter than its surroundings —
						// the library's own Tabs indicator solves it the same way.
						'bg-background text-foreground shadow-xs/5 dark:bg-input'
					: 'text-muted-foreground hover:text-foreground',
				'focus-visible:ring-2 focus-visible:ring-ring'
			)}
		>
			{manager}
		</button>
	{/each}
</div>
