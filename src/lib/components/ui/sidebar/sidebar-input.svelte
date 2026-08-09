<script lang="ts">
	import { cn } from '$lib/utils';
	import Input, { type InputProps } from '../input.svelte';

	let { class: className, value = $bindable(), ...rest }: InputProps = $props();
</script>

<Input
	bind:value
	data-sidebar="input"
	data-slot="sidebar-input"
	class={cn('h-8 w-full bg-background shadow-none', className)}
	{...rest}
/>
