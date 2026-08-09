<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { IconSvgElement } from '@hugeicons/svelte';

	export type CommandItemData = {
		id: string;
		label: string;
		/** Extra terms that should match this item without being displayed. */
		keywords?: string;
		shortcut?: string;
		icon?: IconSvgElement;
		onselect?: () => void;
	};

	export type CommandGroupData = {
		heading: string;
		items: CommandItemData[];
	};

	export type CommandProps = {
		open?: boolean;
		/**
		 * The `id` of the highlighted item, bindable. Lets a footer describe
		 * whatever is under the cursor without reaching into the list.
		 */
		activeKey?: string;
		groups: CommandGroupData[];
		placeholder?: string;
		label?: string;
		/** Shown when nothing matches. */
		empty?: Snippet;
		/** A hint bar pinned under the list — key legends, result counts. */
		footer?: Snippet;
	};
</script>

<script lang="ts">
	import { Icon } from '$lib/icons';
	import CommandRoot from './command-root.svelte';
	import CommandInput from './command-input.svelte';
	import CommandPanel from './command-panel.svelte';
	import CommandList from './command-list.svelte';
	import CommandGroupPart from './command-group.svelte';
	import CommandItemPart from './command-item.svelte';
	import CommandEmpty from './command-empty.svelte';
	import CommandShortcut from './command-shortcut.svelte';
	import CommandFooter from './command-footer.svelte';

	let {
		open = $bindable(false),
		activeKey = $bindable(),
		groups,
		placeholder = 'Type a command or search…',
		label = 'Command palette',
		empty,
		footer
	}: CommandProps = $props();
</script>

<!--
	The common case, composed from the same parts you would use by hand. Reach for
	CommandRoot directly when an item needs to be more than a line of text.
-->
<CommandRoot bind:open bind:activeKey {label}>
	<CommandInput {placeholder} />
	<CommandPanel>
		<CommandList aria-label={label}>
			{#each groups as group (group.heading)}
				<CommandGroupPart heading={group.heading}>
					{#each group.items as item (item.id)}
						<CommandItemPart key={item.id} keywords={item.keywords} onselect={item.onselect}>
							{#if item.icon}<Icon icon={item.icon} aria-hidden="true" />{/if}
							<span class="truncate">{item.label}</span>
							{#if item.shortcut}<CommandShortcut>{item.shortcut}</CommandShortcut>{/if}
						</CommandItemPart>
					{/each}
				</CommandGroupPart>
			{/each}
			<CommandEmpty
				>{#if empty}{@render empty()}{/if}</CommandEmpty
			>
		</CommandList>
	</CommandPanel>
	{#if footer}
		<CommandFooter>{@render footer()}</CommandFooter>
	{/if}
</CommandRoot>
