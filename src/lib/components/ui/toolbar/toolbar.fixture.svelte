<script lang="ts">
	/**
	 * A toolbar whose contents can be changed from the test.
	 *
	 * The behaviour under test is what happens when items appear, disappear or
	 * become enabled, so the fixture has to be able to do all three — a static
	 * arrangement of buttons could only ever check the easy half.
	 */
	import Toolbar from './toolbar.svelte';
	import ToolbarButton from './toolbar-button.svelte';
	import ToolbarInput from './toolbar-input.svelte';

	let {
		extra = false,
		disabledLast = false,
		withInput = false
	}: { extra?: boolean; disabledLast?: boolean; withInput?: boolean } = $props();
</script>

<Toolbar label="Test toolbar">
	<ToolbarButton>Bold</ToolbarButton>
	<ToolbarButton>Italic</ToolbarButton>
	{#if withInput}
		<ToolbarInput aria-label="Find" />
	{/if}
	<ToolbarButton disabled={disabledLast}>Underline</ToolbarButton>
	{#if extra}
		<ToolbarButton>Strike</ToolbarButton>
	{/if}
</Toolbar>
