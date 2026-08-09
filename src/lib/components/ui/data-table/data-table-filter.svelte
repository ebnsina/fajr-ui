<script module lang="ts">
	export type DataTableFilterProps = {
		label: string;
		options: string[];
		/** Selected values. Bindable. */
		value?: string[];
		class?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Badge from '../badge.svelte';
	import Button from '../button.svelte';
	import { Popover, PopoverPopup, PopoverTrigger } from '../popover';
	// Direct, not via the barrel: `../index` names no component, so the registry
	// read it as a dependency called "index" and `fajr-ui add data-table` fetched
	// a 404 and stopped part-installed. The barrel is also a file the CLI never
	// ships, so the import could not have resolved in a copied-out project.
	import Checkbox from '../checkbox.svelte';

	let { label, options, value = $bindable([]), class: className }: DataTableFilterProps = $props();

	let open = $state(false);

	function toggle(option: string) {
		value = value.includes(option) ? value.filter((entry) => entry !== option) : [...value, option];
	}
</script>

<Popover bind:open>
	<PopoverTrigger variant="outline" size="sm" class={cn('border-dashed', className)}>
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="size-3.5"
		>
			<path d="M12 5v14M5 12h14" />
		</svg>
		{label}
		{#if value.length > 0}
			<span class="mx-1 h-4 w-px bg-border"></span>
			<Badge variant="secondary" size="sm">{value.length}</Badge>
		{/if}
	</PopoverTrigger>

	<PopoverPopup side="bottom" align="start" {label}>
		<div class="flex w-52 flex-col gap-1 p-2" role="group" aria-label={label}>
			{#each options as option (option)}
				<label
					class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
				>
					<Checkbox checked={value.includes(option)} onclick={() => toggle(option)} />
					{option}
				</label>
			{/each}
			{#if value.length > 0}
				<Button variant="ghost" size="sm" class="mt-1" onclick={() => (value = [])}>Clear</Button>
			{/if}
		</div>
	</PopoverPopup>
</Popover>
