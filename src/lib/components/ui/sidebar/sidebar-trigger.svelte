<script lang="ts">
	import { Icon, PanelLeftIcon } from '$lib/icons';
	import { cn } from '$lib/utils';
	import Button, { type ButtonProps } from '../button.svelte';
	import { useSidebar } from './context.svelte';

	let { class: className, onclick, ...rest }: ButtonProps = $props();

	const sidebar = useSidebar();
</script>

<Button
	data-sidebar="trigger"
	data-slot="sidebar-trigger"
	size="icon"
	variant="ghost"
	class={cn('size-7', className)}
	onclick={(event) => {
		onclick?.(event);
		sidebar.toggle();
	}}
	{...rest}
>
	<Icon icon={PanelLeftIcon} class="rtl:-scale-x-100" />
	<span class="sr-only">Toggle Sidebar</span>
</Button>
