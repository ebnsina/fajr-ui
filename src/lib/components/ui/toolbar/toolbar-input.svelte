<script lang="ts">
	import Input, { type InputProps } from '../input.svelte';
	import { cn } from '$lib/utils';

	let { class: className, value = $bindable(), ...rest }: InputProps = $props();
</script>

<Input bind:value data-slot="toolbar-input" size="sm" class={cn('w-auto', className)} {...rest} />
